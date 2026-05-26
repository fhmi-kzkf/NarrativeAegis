// Gemini AI Integration — Used for all AI tasks
// Handles both bulk analysis (fast) and playbook generation (quality)

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || '';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

/**
 * Call Gemini Flash for fast bulk analysis
 */
async function callGemini(
  prompt: string,
  model: string = 'gemini-2.5-flash'
): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] No API key found');
    return '';
  }

  const response = await fetch(
    `${GEMINI_API_BASE}/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data: GeminiResponse = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

interface SerpAnalysis {
  sentiment: number;
  claims: string[];
  competitorsMentioned: string[];
  sourceUrls: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Analyze SERP results in bulk using Gemini Flash (parallel)
 */
export async function analyzeQueriesBulk(
  serpResults: {
    query: string;
    aiOverviewContent: string | null;
    market: string;
  }[]
): Promise<SerpAnalysis[]> {
  return Promise.all(
    serpResults.map(async (result) => {
      if (!result.aiOverviewContent) {
        return {
          sentiment: 0,
          claims: [],
          competitorsMentioned: [],
          sourceUrls: [],
          riskLevel: 'low' as const,
        };
      }

      try {
        const response = await callGemini(`
          Analyze this AI Overview search result and return JSON only:
          {
            "sentiment": <number -1 to 1>,
            "claims": [<string array of factual claims made>],
            "competitorsMentioned": [<string array of competitor names>],
            "riskLevel": "<low|medium|high|critical>"
          }
          
          Query: "${result.query}"
          Market: ${result.market}
          AI Overview Content: "${result.aiOverviewContent}"
        `);

        let cleaned = response.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '').trim();
        }
        return JSON.parse(cleaned);
      } catch {
        return {
          sentiment: 0,
          claims: [],
          competitorsMentioned: [],
          sourceUrls: [],
          riskLevel: 'low' as const,
        };
      }
    })
  );
}

/**
 * Classify poison sources using Gemini Flash
 */
export async function classifyPoisonSources(
  sources: { url: string; content: string; publishDate: string | null }[]
): Promise<
  {
    biasType: string;
    accuracyScore: number;
    impactScore: number;
    fixabilityScore: number;
    recommendation: string;
  }[]
> {
  return Promise.all(
    sources.map(async (source) => {
      try {
        const response = await callGemini(`
          Classify this content source that is being cited by AI search engines.
          Return JSON only:
          {
            "biasType": "<outdated|competitor|biased_review|forum_noise|factual_error>",
            "accuracyScore": <number 0-100>,
            "impactScore": <number 0-100>,
            "fixabilityScore": <number 0-100>,
            "recommendation": "<specific action to fix this>"
          }
          
          URL: ${source.url}
          Publish Date: ${source.publishDate || 'Unknown'}
          Content: ${source.content.slice(0, 2000)}
        `);

        let cleaned = response.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '').trim();
        }
        return JSON.parse(cleaned);
      } catch {
        return {
          biasType: 'outdated',
          accuracyScore: 50,
          impactScore: 50,
          fixabilityScore: 50,
          recommendation: 'Review and assess this source manually.',
        };
      }
    })
  );
}

/**
 * Generate executive playbook using Gemini (quality output)
 */
export async function generateExecutivePlaybook(findings: {
  brand: string;
  analyses: SerpAnalysis[];
  poisonSources: { url: string; biasType: string; impactScore: number }[];
  avsScore: number;
}): Promise<string> {
  return callGemini(
    `
    You are a brand intelligence analyst. Based on these AI search findings,
    generate a structured Executive Action Playbook with:
    1. AI Visibility Score analysis (current: ${findings.avsScore}/100) with component breakdown
    2. Top 5 poison sources ranked by impact × fixability
    3. Specific corrective actions per source with timelines
    4. Competitor threat assessment
    
    Brand: ${findings.brand}
    Number of analyses: ${findings.analyses.length}
    Poison sources: ${JSON.stringify(findings.poisonSources)}
    
    Format as a professional report with clear sections and actionable recommendations.
  `,
    'gemini-2.5-flash' // Using Flash for all tasks as per user preference
  );
}
