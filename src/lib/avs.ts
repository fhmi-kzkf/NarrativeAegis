// AI Visibility Score Calculator
// Formula: AVS = (0.35 × Presence Rate) + (0.30 × Sentiment Score)
//              + (0.25 × Share of AI Voice) + (0.10 × Geographic Parity)
// Scale: 0-100

export interface AVSInput {
  totalQueries: number;
  queriesWithBrandPresent: number;
  sentiments: number[]; // array of -1 to 1 values
  brandMentions: number;
  competitorMentions: number;
  marketResults: {
    market: string;
    sentiment: number;
  }[];
}

export interface AVSResult {
  overall: number;
  presenceRate: number;
  sentimentScore: number;
  shareOfVoice: number;
  geographicParity: number;
  level: 'critical' | 'neutral' | 'positive' | 'leading';
}

export function calculateAVS(input: AVSInput): AVSResult {
  // 1. Presence Rate (0-100): % of queries where brand appears in AI Overview
  const presenceRate = input.totalQueries > 0
    ? (input.queriesWithBrandPresent / input.totalQueries) * 100
    : 0;

  // 2. Sentiment Score (0-100): normalize from [-1, 1] to [0, 100]
  const avgSentiment = input.sentiments.length > 0
    ? input.sentiments.reduce((a, b) => a + b, 0) / input.sentiments.length
    : 0;
  const sentimentScore = ((avgSentiment + 1) / 2) * 100;

  // 3. Share of AI Voice (0-100): brand mentions / total mentions
  const totalMentions = input.brandMentions + input.competitorMentions;
  const shareOfVoice = totalMentions > 0
    ? (input.brandMentions / totalMentions) * 100
    : 0;

  // 4. Geographic Parity (0-100): consistency of sentiment across markets
  const marketSentiments = input.marketResults.map((m) => m.sentiment);
  const geographicParity = calculateGeoParity(marketSentiments);

  // Final AVS
  const overall = Math.round(
    0.35 * presenceRate +
    0.30 * sentimentScore +
    0.25 * shareOfVoice +
    0.10 * geographicParity
  );

  // Level classification
  let level: AVSResult['level'];
  if (overall < 40) level = 'critical';
  else if (overall < 60) level = 'neutral';
  else if (overall < 80) level = 'positive';
  else level = 'leading';

  return {
    overall: Math.max(0, Math.min(100, overall)),
    presenceRate: Math.round(presenceRate),
    sentimentScore: Math.round(sentimentScore),
    shareOfVoice: Math.round(shareOfVoice),
    geographicParity: Math.round(geographicParity),
    level,
  };
}

function calculateGeoParity(sentiments: number[]): number {
  if (sentiments.length <= 1) return 100;

  const avg = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
  const variance =
    sentiments.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
    sentiments.length;
  const stdDev = Math.sqrt(variance);

  // Lower std dev = higher parity
  // Max expected std dev is ~1 (range of -1 to 1)
  const parity = Math.max(0, (1 - stdDev) * 100);
  return parity;
}
