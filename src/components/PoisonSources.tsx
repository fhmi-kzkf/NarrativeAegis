'use client';

import { useState } from 'react';

export interface PoisonSource {
  id: string;
  url: string;
  title: string;
  domain: string;
  contentAge: string;
  ageMonths: number;
  biasType: 'outdated' | 'competitor' | 'biased_review' | 'forum_noise' | 'factual_error';
  biasLabel: string;
  accuracyScore: number;
  impactScore: number;
  fixabilityScore: number;
  priorityScore: number;
  snippet: string;
  recommendation: string;
}

function getBiasIcon(type: PoisonSource['biasType']): string {
  switch (type) {
    case 'outdated': return '⏰';
    case 'competitor': return '⚔️';
    case 'biased_review': return '⭐';
    case 'forum_noise': return '💬';
    case 'factual_error': return '❌';
    default: return '⚠️';
  }
}

function getBiasColor(type: PoisonSource['biasType']): string {
  switch (type) {
    case 'outdated': return '#ffc412';
    case 'competitor': return '#ff6d38';
    case 'biased_review': return '#7a78ff';
    case 'forum_noise': return '#478bff';
    case 'factual_error': return '#ff4d4d';
    default: return '#666';
  }
}

export default function PoisonSources({ liveData }: { liveData?: PoisonSource[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const sources = liveData || [];

  return (
    <div className="card" id="poison-sources">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-heading-lg text-ghost">Poison Sources (Live)</h2>
          <p className="text-caption text-ghost/40 mt-1">
            Ranked by impact × fixability — top threats to your AI narrative
          </p>
        </div>
        <span className="tag tag-critical">
          {sources.length} detected
        </span>
      </div>

      {sources.length === 0 && (
        <div className="text-center p-8 border-dashed border-ghost/20 rounded-2xl border">
          <p className="text-ghost/50">No poison sources detected in this audit.</p>
        </div>
      )}

      <div className="space-y-3 stagger-children">
        {sources.map((source, index) => {
          const isExpanded = expandedId === source.id;
          const biasColor = getBiasColor(source.biasType);

          return (
            <div
              key={source.id}
              className={`rounded-2xl border transition-all duration-300 cursor-pointer ${
                isExpanded
                  ? 'bg-ghost/5 border-ghost/15'
                  : 'bg-midnight/50 border-ghost/8 hover:border-ghost/12 hover:bg-ghost/[0.03]'
              }`}
              onClick={() => setExpandedId(isExpanded ? null : source.id)}
              id={`poison-source-${source.id}`}
            >
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Rank */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                      background: `${biasColor}20`,
                      color: biasColor,
                    }}
                  >
                    #{index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{getBiasIcon(source.biasType)}</span>
                      <span
                        className="text-caption font-medium uppercase tracking-wider"
                        style={{ color: biasColor }}
                      >
                        {source.biasLabel || source.biasType}
                      </span>
                      <span className="text-caption text-ghost/30">•</span>
                      <span className="text-caption text-ghost/40">
                        {source.contentAge || 'Recent'}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-ghost/90 mb-1 truncate">
                      {source.title || new URL(source.url).hostname}
                    </h3>
                    <p className="text-caption text-ghost/40 truncate">
                      {source.domain || new URL(source.url).hostname}
                    </p>
                  </div>

                  {/* Impact Score */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-caption text-ghost/40 uppercase tracking-wider">
                        Impact
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: biasColor }}
                      >
                        {source.impactScore || 50}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-caption text-ghost/40 uppercase tracking-wider">
                        Fix
                      </div>
                      <div className="text-lg font-bold text-ghost/70">
                        {source.fixabilityScore || 50}
                      </div>
                    </div>

                    {/* Expand arrow */}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`text-ghost/30 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-ghost/8 pt-4 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Snippet */}
                    <div>
                      <span className="text-caption text-ghost/40 uppercase tracking-wider block mb-2">
                        Content Snippet
                      </span>
                      <p className="text-sm text-ghost/60 italic border-l-2 pl-3" style={{ borderColor: biasColor }}>
                        &quot;{source.snippet}&quot;
                      </p>
                    </div>

                    {/* Recommendation */}
                    <div>
                      <span className="text-caption text-ghost/40 uppercase tracking-wider block mb-2">
                        Recommended Action
                      </span>
                      <p className="text-sm text-ghost/80">
                        {source.recommendation}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="mt-4 flex gap-4">
                    <MetricBar label="Accuracy" value={source.accuracyScore || 50} color="#ff4d4d" />
                    <MetricBar label="Impact" value={source.impactScore || 50} color={biasColor} />
                    <MetricBar label="Fixability" value={source.fixabilityScore || 50} color="#00a652" />
                  </div>

                  {/* URL */}
                  <div className="mt-4 pt-3 border-t border-ghost/5 flex items-center justify-between">
                    <span className="text-caption text-ghost/30 truncate max-w-xl">
                      {source.url}
                    </span>
                    <a href={source.url} target="_blank" rel="noreferrer" className="text-caption text-lime hover:underline">
                      View Source ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="text-caption text-ghost/40">{label}</span>
        <span className="text-caption font-medium" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}
