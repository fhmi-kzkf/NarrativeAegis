'use client';

import { useState, useMemo } from 'react';

export interface PlaybookAction {
  id: string;
  category: 'content_update' | 'seo_optimization' | 'review_management' | 'pr_outreach' | 'technical_seo';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedImpact: number;
  timelineWeeks: number;
  steps: string[];
  source: string;
}

function getPriorityStyles(priority: PlaybookAction['priority']) {
  switch (priority) {
    case 'critical':
      return { bg: 'rgba(255, 77, 77, 0.12)', border: 'rgba(255, 77, 77, 0.3)', color: '#ff4d4d', label: 'Critical' };
    case 'high':
      return { bg: 'rgba(255, 109, 56, 0.12)', border: 'rgba(255, 109, 56, 0.3)', color: '#ff6d38', label: 'High' };
    case 'medium':
      return { bg: 'rgba(255, 196, 18, 0.12)', border: 'rgba(255, 196, 18, 0.3)', color: '#ffc412', label: 'Medium' };
    case 'low':
      return { bg: 'rgba(71, 139, 255, 0.12)', border: 'rgba(71, 139, 255, 0.3)', color: '#478bff', label: 'Low' };
  }
}

function getCategoryIcon(category: PlaybookAction['category']): string {
  switch (category) {
    case 'content_update': return '📝';
    case 'seo_optimization': return '🔍';
    case 'review_management': return '⭐';
    case 'pr_outreach': return '📣';
    case 'technical_seo': return '⚙️';
  }
}

function getCategoryLabel(category: PlaybookAction['category']): string {
  switch (category) {
    case 'content_update': return 'Content Update';
    case 'seo_optimization': return 'SEO Optimization';
    case 'review_management': return 'Review Management';
    case 'pr_outreach': return 'PR Outreach';
    case 'technical_seo': return 'Technical SEO';
  }
}

export default function Playbook({ liveData }: { liveData?: any }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const actions: PlaybookAction[] = useMemo(() => {
    if (!liveData) return [];
    
    const generated: PlaybookAction[] = [];
    
    // Generate actions based on poison sources
    liveData.poisonSources?.forEach((ps: any, i: number) => {
      generated.push({
        id: `pa-${i}`,
        category: ps.biasType === 'factual_error' ? 'pr_outreach' : 'seo_optimization',
        priority: ps.impactScore > 70 ? 'critical' : 'high',
        title: `Address ${ps.biasLabel} on ${ps.domain}`,
        description: `AI is citing this source heavily for your brand. Recommendation: ${ps.recommendation}`,
        estimatedImpact: Math.round(ps.impactScore / 10),
        timelineWeeks: 2,
        steps: [
          `Review the exact claims made on ${ps.url}`,
          'Publish a highly-authoritative counter-narrative on your domain',
          'Ensure the new page is indexed via Google Search Console'
        ],
        source: ps.domain
      });
    });

    // Generate actions based on sentiment
    const lowSentimentMarkets = liveData.queries?.filter((q: any) => q.sentiment < -0.2) || [];
    if (lowSentimentMarkets.length > 0) {
      generated.push({
        id: 'pa-sentiment-1',
        category: 'content_update',
        priority: 'critical',
        title: 'Publish counter-narrative for negative sentiment queries',
        description: `We detected significant negative sentiment in ${lowSentimentMarkets.length} queries. You must publish content to shift this narrative.`,
        estimatedImpact: 5,
        timelineWeeks: 4,
        steps: [
          'Identify the core complaints driving the negative AI overviews.',
          'Create a dedicated landing page addressing these concerns head-on.',
          'Distribute the response via PR channels to ensure AI engines crawl it.'
        ],
        source: 'Sentiment Analysis'
      });
    }

    if (generated.length === 0) {
      generated.push({
        id: 'pa-empty',
        category: 'seo_optimization',
        priority: 'low',
        title: 'Maintain current AI Share of Voice',
        description: 'Your AI Visibility Score is healthy. Continue publishing high-quality content to maintain your position.',
        estimatedImpact: 1,
        timelineWeeks: 1,
        steps: ['Monitor metrics weekly'],
        source: 'General'
      });
    }

    return generated;
  }, [liveData]);

  if (!liveData) {
    return (
      <div className="card text-center p-12 border-dashed border-ghost/20">
        <p className="text-ghost/50">Run an audit to generate the Corrective Playbook.</p>
      </div>
    );
  }

  const totalImpact = actions.reduce((sum, a) => sum + a.estimatedImpact, 0);

  return (
    <div className="card" id="playbook">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-heading-lg text-ghost">Corrective Action Playbook (Live)</h2>
          <p className="text-caption text-ghost/40 mt-1">
            Dynamically generated recommendations based on live AI search data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="tag tag-success">
            +{totalImpact} AVS potential
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <SummaryCard
          label="Total Actions"
          value={actions.length.toString()}
          color="#c7ff69"
        />
        <SummaryCard
          label="Critical"
          value={actions.filter(a => a.priority === 'critical').length.toString()}
          color="#ff4d4d"
        />
        <SummaryCard
          label="Est. Impact"
          value={`+${totalImpact}`}
          color="#00a652"
        />
        <SummaryCard
          label="Timeline"
          value={`${Math.max(...actions.map(a => a.timelineWeeks))}w`}
          color="#478bff"
        />
      </div>

      {/* Action Cards */}
      <div className="space-y-3 stagger-children">
        {actions.map((action) => {
          const isExpanded = expandedId === action.id;
          const priority = getPriorityStyles(action.priority);

          return (
            <div
              key={action.id}
              className={`rounded-2xl border transition-all duration-300 cursor-pointer ${
                isExpanded
                  ? 'bg-ghost/5 border-ghost/15'
                  : 'bg-midnight/50 border-ghost/8 hover:border-ghost/12 hover:bg-ghost/[0.03]'
              }`}
              onClick={() => setExpandedId(isExpanded ? null : action.id)}
              id={`playbook-action-${action.id}`}
            >
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Priority Badge */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-lg"
                    style={{ background: priority.bg }}
                  >
                    {getCategoryIcon(action.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="tag text-xs"
                        style={{
                          background: priority.bg,
                          color: priority.color,
                          border: `1px solid ${priority.border}`,
                        }}
                      >
                        {priority.label}
                      </span>
                      <span className="tag tag-neutral text-xs">
                        {getCategoryLabel(action.category)}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-ghost/90">
                      {action.title}
                    </h3>
                  </div>

                  {/* Impact & Timeline */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-caption text-ghost/40">Impact</div>
                      <div className="text-sm font-bold text-success">
                        +{action.estimatedImpact} AVS
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-caption text-ghost/40">Time</div>
                      <div className="text-sm font-medium text-ghost/60">
                        {action.timelineWeeks}w
                      </div>
                    </div>

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
                  <p className="text-sm text-ghost/70 mb-4">{action.description}</p>

                  <div className="mb-4">
                    <span className="text-caption text-ghost/40 uppercase tracking-wider block mb-2">
                      Action Steps
                    </span>
                    <ol className="space-y-2">
                      {action.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="w-5 h-5 rounded-full bg-lime/10 text-lime text-xs flex items-center justify-center shrink-0 mt-0.5 font-medium">
                            {i + 1}
                          </span>
                          <span className="text-ghost/70">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-ghost/5">
                    <span className="text-caption text-ghost/30">
                      Source: {action.source}
                    </span>
                    <span className="text-caption text-ghost/30">•</span>
                    <span className="text-caption text-ghost/30">
                      Estimated completion: {action.timelineWeeks} weeks
                    </span>
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

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl bg-ghost/5 border border-ghost/8 p-4 text-center">
      <div className="text-2xl font-bold" style={{ color, fontFamily: 'var(--font-display)' }}>
        {value}
      </div>
      <div className="text-caption text-ghost/40 mt-1">{label}</div>
    </div>
  );
}
