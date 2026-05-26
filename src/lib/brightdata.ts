// Bright Data API Integration
// Docs: https://docs.brightdata.com/scraping-automation/serp-api

const BRIGHT_DATA_API_KEY = process.env.BRIGHT_DATA_API_KEY || '';
const WEB_SCRAPER_BASE = 'https://api.brightdata.com/datasets/v3';

let cachedZoneName: string | null = null;

async function getSerpZone(): Promise<string> {
  if (cachedZoneName) return cachedZoneName;
  
  try {
    const response = await fetch('https://api.brightdata.com/zone/get_active_zones', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BRIGHT_DATA_API_KEY}`,
      },
    });
    if (response.ok) {
      const zones = await response.json();
      const serpZone = zones.find((z: any) => z.type === 'serp');
      if (serpZone) {
        cachedZoneName = serpZone.name;
        console.log(`[BrightData] Found active SERP zone: ${cachedZoneName}`);
        return serpZone.name;
      }
    }
  } catch (error) {
    console.error('[BrightData] Error fetching active zones:', error);
  }
  
  return 'narrative_shield_serp';
}

interface SerpQuery {
  query: string;
  country: string;
  language?: string;
}

interface SerpResult {
  query: string;
  market: string;
  hasAIOverview: boolean;
  aiOverviewContent: string | null;
  aiOverviewSources: string[];
  organicResults: {
    title: string;
    url: string;
    snippet: string;
    position: number;
  }[];
}

/**
 * Fetch Google SERP results including AI Overviews via Bright Data SERP API
 */
export async function fetchSerp(queries: SerpQuery[]): Promise<SerpResult[]> {
  if (!BRIGHT_DATA_API_KEY) {
    console.warn('[BrightData] No API key found, using mock data');
    return [];
  }

  const zone = await getSerpZone();

  const results = await Promise.all(
    queries.map(async (q) => {
      try {
        const countryCode = q.country.toLowerCase();
        const lang = q.language || 'en';
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(q.query)}&gl=${countryCode}&hl=${lang}&brd_json=1`;

        const response = await fetch('https://api.brightdata.com/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BRIGHT_DATA_API_KEY}`,
          },
          body: JSON.stringify({
            zone,
            url: searchUrl,
            format: 'raw',
          }),
        });

        if (!response.ok) {
          throw new Error(`SERP API error: ${response.status}`);
        }

        const data = await response.json();

        // Parse AI Overview texts
        let aiOverviewContent: string | null = null;
        if (data.ai_overview) {
          if (Array.isArray(data.ai_overview.texts)) {
            aiOverviewContent = data.ai_overview.texts
              .map((t: any) => {
                if (t.snippet) return t.snippet;
                if (t.list && Array.isArray(t.list)) {
                  const listItems = t.list
                    .map((item: any) => {
                      if (typeof item === 'string') return item;
                      if (item && typeof item === 'object') {
                        return item.snippet || item.text || '';
                      }
                      return '';
                    })
                    .filter(Boolean)
                    .join('\n');
                  return t.title ? `${t.title}:\n${listItems}` : listItems;
                }
                return '';
              })
              .filter(Boolean)
              .join('\n\n');
          } else if (typeof data.ai_overview.text === 'string') {
            aiOverviewContent = data.ai_overview.text;
          }
        }

        // Parse AI Overview sources
        const aiOverviewSources = data.ai_overview?.references?.map((r: any) => r.href).filter(Boolean) || 
                                  data.ai_overview?.sources?.map((s: any) => s.url).filter(Boolean) || [];

        // Parse Organic results
        const organicResults = (data.organic || []).slice(0, 5).map((r: any, i: number) => ({
          title: r.title || '',
          url: r.link || r.url || '',
          snippet: r.description || r.snippet || '',
          position: i + 1,
        }));

        return {
          query: q.query,
          market: q.country,
          hasAIOverview: !!data.ai_overview,
          aiOverviewContent,
          aiOverviewSources,
          organicResults,
        };
      } catch (error) {
        console.error(`[BrightData] SERP error for "${q.query}":`, error);
        return {
          query: q.query,
          market: q.country,
          hasAIOverview: false,
          aiOverviewContent: null,
          aiOverviewSources: [],
          organicResults: [],
        };
      }
    })
  );

  return results;
}

/**
 * Scrape a webpage using Bright Data Web Scraper API
 */
export async function scrapeUrl(url: string): Promise<{
  title: string;
  content: string;
  publishDate: string | null;
}> {
  if (!BRIGHT_DATA_API_KEY) {
    return { title: '', content: '', publishDate: null };
  }

  try {
    const response = await fetch(`${WEB_SCRAPER_BASE}/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BRIGHT_DATA_API_KEY}`,
      },
      body: JSON.stringify({
        url,
        format: 'json',
      }),
    });

    const data = await response.json();
    return {
      title: data.title || '',
      content: data.content || '',
      publishDate: data.publish_date || null,
    };
  } catch (error) {
    console.error(`[BrightData] Scrape error for "${url}":`, error);
    return { title: '', content: '', publishDate: null };
  }
}
