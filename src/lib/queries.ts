// Query Variation Generator
// Generates 50+ query variations per brand across intents and markets

export type QueryIntent = 'informational' | 'comparative' | 'evaluative' | 'transactional';

export interface QueryVariation {
  query: string;
  intent: QueryIntent;
  market: string;
  language: string;
  perspective: 'customer' | 'investor' | 'recruiter';
}

const intentTemplates: Record<QueryIntent, string[]> = {
  informational: [
    'What is {brand}?',
    '{brand} reviews {year}',
    '{brand} customer experience',
    'How does {brand} work?',
    '{brand} company overview',
    'Who uses {brand}?',
  ],
  comparative: [
    '{brand} vs {competitor}',
    '{brand} alternatives',
    'Best {category} platforms',
    '{brand} or {competitor} for enterprise',
    'Compare {brand} and {competitor}',
    '{brand} competitors {year}',
  ],
  evaluative: [
    'Is {brand} safe for enterprise?',
    'Is {brand} trustworthy?',
    '{brand} security certification',
    '{brand} GDPR compliance',
    '{brand} reliability',
    'Should I use {brand}?',
  ],
  transactional: [
    '{brand} pricing plans',
    '{brand} enterprise demo',
    'Buy {brand} subscription',
    '{brand} free trial',
    '{brand} contact sales',
  ],
};

const perspectiveQueries = {
  investor: [
    '{brand} funding round',
    '{brand} market share',
    '{brand} growth rate',
  ],
  recruiter: [
    'Working at {brand}',
    '{brand} company culture',
    '{brand} employee reviews',
  ],
};

const defaultMarkets = [
  { code: 'US', language: 'en' },
  { code: 'DE', language: 'de' },
  { code: 'JP', language: 'ja' },
  { code: 'BR', language: 'pt' },
  { code: 'ID', language: 'id' },
  { code: 'GB', language: 'en' },
  { code: 'IN', language: 'en' },
  { code: 'SG', language: 'en' },
];

export function generateQueryVariations(
  brand: string,
  competitors: string[],
  category: string = 'fintech',
  markets = defaultMarkets,
  year: string = '2026'
): QueryVariation[] {
  const variations: QueryVariation[] = [];
  const primaryMarket = markets[0] || { code: 'US', language: 'en' };

  // Generate intent-based queries for primary market
  for (const [intent, templates] of Object.entries(intentTemplates)) {
    for (const template of templates) {
      let query = template
        .replace('{brand}', brand)
        .replace('{year}', year)
        .replace('{category}', category);

      // For comparative queries, generate one per competitor
      if (intent === 'comparative' && template.includes('{competitor}')) {
        for (const comp of competitors.slice(0, 3)) {
          const compQuery = query.replace('{competitor}', comp);
          variations.push({
            query: compQuery,
            intent: intent as QueryIntent,
            market: primaryMarket.code,
            language: primaryMarket.language,
            perspective: 'customer',
          });
        }
      } else {
        query = query.replace('{competitor}', competitors[0] || 'competitor');
        variations.push({
          query,
          intent: intent as QueryIntent,
          market: primaryMarket.code,
          language: primaryMarket.language,
          perspective: 'customer',
        });
      }
    }
  }

  // Add perspective-specific queries
  for (const [perspective, templates] of Object.entries(perspectiveQueries)) {
    for (const template of templates) {
      variations.push({
        query: template.replace('{brand}', brand),
        intent: 'informational',
        market: primaryMarket.code,
        language: primaryMarket.language,
        perspective: perspective as 'investor' | 'recruiter',
      });
    }
  }

  // Replicate key queries across all markets representing different intents
  const representativeQueries = [
    variations.find(v => v.intent === 'informational'),
    variations.find(v => v.intent === 'comparative'),
    variations.find(v => v.intent === 'evaluative'),
    variations.find(v => v.intent === 'transactional'),
  ].filter(Boolean) as QueryVariation[];

  // Add a few more informational/comparative queries for depth
  const extraQueries = variations.filter(v => 
    v.intent === 'informational' || v.intent === 'comparative'
  ).slice(2, 6);
  
  const keyQueries = [...representativeQueries, ...extraQueries];

  for (const market of markets.slice(1)) {
    for (const kq of keyQueries) {
      variations.push({
        ...kq,
        market: market.code,
        language: market.language,
      });
    }
  }

  return variations;
}
