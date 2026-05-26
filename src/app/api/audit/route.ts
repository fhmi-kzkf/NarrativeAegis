import { NextResponse } from 'next/server';
import { generateQueryVariations } from '@/lib/queries';
import { fetchSerp } from '@/lib/brightdata';
import { analyzeQueriesBulk } from '@/lib/gemini';
import { calculateAVS } from '@/lib/avs';

export const maxDuration = 300; // 5 minutes for Pro tier

export async function POST(req: Request) {
  try {
    const { brand, competitors, markets } = await req.json();

    if (!brand) {
      return NextResponse.json({ success: false, error: 'Brand is required' }, { status: 400 });
    }

    const startTime = Date.now();

    // Map string array ['US', 'GB'] or object array [{code: 'US'}, ...] back to objects for the query generator
    const marketObjects = (markets || []).map((m: any) => {
      const code = typeof m === 'string' ? m : m.code || 'US';
      const language = typeof m === 'string'
        ? (code === 'DE' ? 'de' : code === 'JP' ? 'ja' : code === 'BR' ? 'pt' : code === 'ID' ? 'id' : 'en')
        : m.language || (code === 'DE' ? 'de' : code === 'JP' ? 'ja' : code === 'BR' ? 'pt' : code === 'ID' ? 'id' : 'en');
      return { code, language };
    });

    // 1. Generate query variations
    const allQueries = generateQueryVariations(
      brand, 
      competitors || ['FinGuard Pro', 'SecureFlow'], 
      'fintech', 
      marketObjects.length > 0 ? marketObjects : undefined
    );
    
    // Select a diverse subset of queries to analyze (limit to 12 queries to keep execution time fast ~15s)
    const maxQueries = 12;
    const selectedQueries: typeof allQueries = [];
    
    // Group queries by intent
    const intentsList: ('informational' | 'comparative' | 'evaluative' | 'transactional')[] = [
      'informational',
      'comparative',
      'evaluative',
      'transactional',
    ];
    
    // Unique market list
    const marketCodes = marketObjects.map((m: any) => m.code);
    if (marketCodes.length === 0) marketCodes.push('US');

    // We want to pick combinations of (market, intent)
    let added = true;
    let pass = 0;
    
    while (selectedQueries.length < maxQueries && added && selectedQueries.length < allQueries.length) {
      added = false;
      for (const market of marketCodes) {
        for (const intent of intentsList) {
          if (selectedQueries.length >= maxQueries) break;
          
          // Find a query for this market and intent that hasn't been added yet
          const found = allQueries.find(q => 
            q.market === market && 
            q.intent === intent && 
            !selectedQueries.some(sq => sq.query === q.query)
          );
          
          if (found) {
            selectedQueries.push(found);
            added = true;
          }
        }
      }
      pass++;
      if (pass > 10) break;
    }
    
    // Fallback: if we selected fewer than 6 queries, just take the first few from allQueries
    if (selectedQueries.length < 6) {
      selectedQueries.push(...allQueries.slice(0, 8).filter(q => !selectedQueries.some(sq => sq.query === q.query)));
    }

    const queries = selectedQueries.slice(0, maxQueries);

    // 2. Fetch SERP results from Bright Data
    const serpResults = await fetchSerp(queries.map(q => ({
      query: q.query,
      country: q.market,
      language: q.language
    })));

    // 3. Analyze results via Gemini
    const analyses = await analyzeQueriesBulk(serpResults.map(r => ({
      query: r.query,
      aiOverviewContent: r.aiOverviewContent,
      market: r.market
    })));

    // Combine SERP and Analysis
    const combinedResults = serpResults.map((serp, index) => {
      const analysis = analyses[index];
      return {
        id: `q-${index}`,
        query: serp.query,
        intent: queries[index].intent,
        market: serp.market,
        language: queries[index].language,
        hasAIOverview: serp.hasAIOverview,
        sentiment: analysis.sentiment,
        claims: analysis.claims || [],
        competitorsMentioned: analysis.competitorsMentioned || [],
        sourceUrls: serp.aiOverviewSources || [],
        aiOverviewContent: serp.aiOverviewContent || '',
      };
    });

    // Extract poison sources (basic stub for now, would use scraper API in full version)
    const poisonSources = combinedResults
      .flatMap(r => r.sourceUrls)
      .filter((v, i, a) => a.indexOf(v) === i) // Unique URLs
      .slice(0, 5) // Limit to 5
      .map((url, i) => ({
        id: `ps-${i}`,
        url,
        title: `Source from ${new URL(url).hostname}`,
        domain: new URL(url).hostname,
        contentAge: 'Recent',
        ageMonths: 1,
        biasType: 'forum_noise' as const,
        biasLabel: 'Forum Noise',
        accuracyScore: 50,
        impactScore: 60,
        fixabilityScore: 50,
        priorityScore: 3000,
        snippet: `AI overview cited this source for ${brand}.`,
        recommendation: 'Review source content and verify accuracy.'
      }));

    // 4. Calculate AVS
    let brandMentions = 0;
    let competitorMentions = 0;
    combinedResults.forEach(r => {
      if (r.hasAIOverview) {
        if (r.aiOverviewContent.toLowerCase().includes(brand.toLowerCase())) {
          brandMentions++;
        }
        competitorMentions += r.competitorsMentioned.length;
      }
    });

    const avs = calculateAVS({
      totalQueries: queries.length,
      queriesWithBrandPresent: combinedResults.filter(r => r.hasAIOverview).length,
      sentiments: analyses.filter(a => a.sentiment !== 0).map(a => a.sentiment),
      brandMentions,
      competitorMentions,
      marketResults: combinedResults.map(r => ({
        market: r.market,
        sentiment: r.sentiment
      }))
    });

    const auditDurationSeconds = Math.round((Date.now() - startTime) / 1000);

    const stats = {
      totalQueries: queries.length,
      marketsScanned: markets?.length || 1,
      languagesUsed: 1,
      aiOverviewsFound: combinedResults.filter(r => r.hasAIOverview).length,
      aiOverviewRate: Math.round((combinedResults.filter(r => r.hasAIOverview).length / queries.length) * 100),
      avgSentiment: analyses.length ? analyses.reduce((acc, a) => acc + a.sentiment, 0) / analyses.length : 0,
      poisonSourcesFound: poisonSources.length,
      lastAuditTime: new Date().toISOString(),
      auditDurationSeconds,
    };

    return NextResponse.json({
      success: true,
      brand,
      competitors: competitors || [],
      markets: markets || [],
      queries: combinedResults,
      poisonSources,
      avs,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Audit API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Audit failed' },
      { status: 500 }
    );
  }
}
