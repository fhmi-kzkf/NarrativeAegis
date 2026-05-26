'use client';

import { useState, useMemo } from 'react';

function getSentimentColor(value: number): string {
  if (value <= -0.6) return '#ff4d4d';
  if (value <= -0.3) return '#ff8c4d';
  if (value <= -0.1) return '#ffc412';
  if (value <= 0.1) return '#666';
  if (value <= 0.3) return '#66cc66';
  if (value <= 0.6) return '#00a652';
  return '#c7ff69';
}

function getSentimentLabel(value: number): string {
  if (value <= -0.6) return 'Very Negative';
  if (value <= -0.3) return 'Negative';
  if (value <= -0.1) return 'Slightly Negative';
  if (value <= 0.1) return 'Neutral';
  if (value <= 0.3) return 'Slightly Positive';
  if (value <= 0.6) return 'Positive';
  return 'Very Positive';
}

interface CellDetail {
  row: number;
  col: number;
  intent: string;
  market: string;
  sentiment: number;
  aiOverview: string;
  sources: string[];
}

export default function NarrativeMap({ liveData }: { liveData?: any[] }) {
  const [selectedCell, setSelectedCell] = useState<CellDetail | null>(null);

  // Derive unique intents (rows) and markets (columns) from liveData
  const { intents, markets, heatmap, details } = useMemo(() => {
    if (!liveData || liveData.length === 0) {
      return { intents: [], markets: [], heatmap: [], details: {} };
    }

    const uniqueIntents = Array.from(new Set(liveData.map(q => q.intent))).sort();
    const uniqueMarkets = Array.from(new Set(liveData.map(q => q.market))).sort();

    const map: number[][] = Array(uniqueIntents.length).fill(0).map(() => Array(uniqueMarkets.length).fill(0));
    const det: Record<string, any> = {};

    uniqueIntents.forEach((intent, row) => {
      uniqueMarkets.forEach((market, col) => {
        const queries = liveData.filter(q => q.intent === intent && q.market === market);
        if (queries.length > 0) {
          const avgSent = queries.reduce((sum, q) => sum + q.sentiment, 0) / queries.length;
          map[row][col] = avgSent;
          // Just take the first AI overview for the detail panel
          const firstQuery = queries.find(q => q.hasAIOverview) || queries[0];
          det[`${row}-${col}`] = {
            aiOverview: firstQuery.aiOverviewContent || 'No AI Overview generated for this query.',
            sources: firstQuery.sourceUrls || [],
          };
        }
      });
    });

    return { intents: uniqueIntents, markets: uniqueMarkets, heatmap: map, details: det };
  }, [liveData]);

  if (!liveData || intents.length === 0) {
    return (
      <div className="card text-center p-12 border-dashed border-ghost/20">
        <p className="text-ghost/50">Run an audit to generate the Narrative Map.</p>
      </div>
    );
  }

  const handleCellClick = (row: number, col: number) => {
    const key = `${row}-${col}`;
    const detail = details[key];
    const val = heatmap[row][col];
    setSelectedCell({
      row,
      col,
      intent: intents[row],
      market: markets[col],
      sentiment: val,
      aiOverview: detail?.aiOverview || 'No data',
      sources: detail?.sources || [],
    });
  };

  return (
    <div className="card" id="narrative-map">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-heading-lg text-ghost">AI Narrative Map (Live)</h2>
          <p className="text-caption text-ghost/40 mt-1">
            Intent × Geography sentiment matrix — click a cell for details
          </p>
        </div>
        {/* Legend */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-caption text-ghost/40">Negative</span>
          <div className="flex gap-0.5">
            {['#ff4d4d', '#ff8c4d', '#ffc412', '#666', '#66cc66', '#00a652', '#c7ff69'].map((c) => (
              <div
                key={c}
                className="w-4 h-3 rounded-sm"
                style={{ background: c }}
              />
            ))}
          </div>
          <span className="text-caption text-ghost/40">Positive</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[600px]">
          {/* Column Headers */}
          <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `180px repeat(${markets.length}, 70px)` }}>
            <div />
            {markets.map((m) => (
              <div
                key={m}
                className="text-center text-caption text-ghost/50 font-medium uppercase"
              >
                {m}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-1 stagger-children">
            {intents.map((intent, row) => (
              <div
                key={intent}
                className="grid gap-1 items-center"
                style={{ gridTemplateColumns: `180px repeat(${markets.length}, 70px)` }}
              >
                <div className="text-sm text-ghost/60 truncate pr-2 capitalize">{intent}</div>
                {markets.map((_, col) => {
                  const value = heatmap[row][col];
                  const color = getSentimentColor(value);
                  const isSelected = selectedCell?.row === row && selectedCell?.col === col;

                  return (
                    <button
                      key={col}
                      className={`heatmap-cell aspect-square flex items-center justify-center text-xs font-medium transition-all ${
                        isSelected ? 'ring-2 ring-lime ring-offset-2 ring-offset-midnight' : ''
                      }`}
                      style={{
                        background: color,
                        color: value > 0.3 ? '#141414' : '#fff',
                        opacity: 0.85 + Math.abs(value) * 0.15,
                      }}
                      onClick={() => handleCellClick(row, col)}
                      title={`${intent} in ${markets[col]}: ${value.toFixed(2)}`}
                    >
                      {value !== 0 ? value.toFixed(1) : '-'}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedCell && (
        <div className="mt-6 p-5 rounded-2xl bg-midnight/50 border border-ghost/10 animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-subheading text-ghost capitalize">
                {selectedCell.intent}
              </h3>
              <p className="text-caption text-ghost/40 uppercase">
                {selectedCell.market} — Sentiment: {getSentimentLabel(selectedCell.sentiment)} ({selectedCell.sentiment.toFixed(2)})
              </p>
            </div>
            <button
              className="text-ghost/40 hover:text-ghost transition-colors p-1"
              onClick={() => setSelectedCell(null)}
              aria-label="Close detail"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-caption text-ghost/40 uppercase tracking-wider block mb-1">
                AI Overview Content
              </span>
              <p className="text-sm text-ghost/80 leading-relaxed italic border-l-2 border-amethyst pl-3">
                &quot;{selectedCell.aiOverview}&quot;
              </p>
            </div>
            {selectedCell.sources.length > 0 && (
              <div>
                <span className="text-caption text-ghost/40 uppercase tracking-wider block mb-1">
                  Sources Cited
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCell.sources.map((source, i) => (
                    <span key={i} className="tag tag-neutral text-xs truncate max-w-full">
                      {new URL(source).hostname}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
