'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import AVSGauge from '@/components/AVSGauge';
import NarrativeMap from '@/components/NarrativeMap';
import CompetitorBenchmark from '@/components/CompetitorBenchmark';
import PoisonSources from '@/components/PoisonSources';
import Playbook from '@/components/Playbook';
import AuditStats from '@/components/AuditStats';
import { useAudit } from '@/context/AuditContext';

type Tab = 'overview' | 'narrative' | 'sources' | 'playbook';

export default function AuditResultPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { auditData, isLoading, error, runAudit } = useAudit();

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'narrative', label: 'Narrative Map', icon: '🗺️' },
    { id: 'sources', label: 'Poison Sources', icon: '☠️' },
    { id: 'playbook', label: 'Playbook', icon: '📋' },
  ];

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-midnight text-ghost">
          <div className="w-16 h-16 rounded-full border-4 border-lime/20 border-t-lime animate-spin mb-4" />
          <h2 className="text-xl font-bold mb-2">Running AI Narrative Audit...</h2>
          <p className="text-ghost/50 text-center max-w-md">
            Querying Bright Data SERP API across markets and analyzing AI Overviews with Gemini Flash. This may take up to 20 seconds.
          </p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-midnight text-ghost">
          <div className="text-danger text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Audit Failed</h2>
          <p className="text-ghost/50">{error}</p>
        </div>
      </>
    );
  }

  if (!auditData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-midnight text-ghost">
          <div className="w-16 h-16 rounded-xl bg-lime/10 flex items-center justify-center text-3xl mb-6">
            🏦
          </div>
          <h1 className="text-4xl font-bold mb-4">NexaFin</h1>
          <p className="text-ghost/50 mb-8 max-w-lg text-center">
            You haven't run a live audit yet. Click below to fetch real-time AI Overviews for NexaFin using Bright Data and analyze them with Gemini.
          </p>
          <button 
            onClick={() => runAudit('NexaFin', ['FinGuard Pro', 'SecureFlow'], [{ code: 'US', language: 'en' }, { code: 'DE', language: 'de' }])}
            className="btn-primary"
          >
            Run Live Audit Now
          </button>
        </div>
      </>
    );
  }

  const { avs } = auditData;

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6" id="audit-hero">
        <div className="max-w-[1400px] mx-auto">
          {/* Brand Header */}
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="tag tag-success">Live Data</span>
              <span className="text-caption text-ghost/40">Audit Completed: Just now</span>
            </div>
            <h1 className="text-display text-ghost mb-2 capitalize">
              {auditData.brand || 'NexaFin'}
            </h1>
            <p className="text-subheading text-ghost/50 max-w-2xl">
              AI Search Visibility & Narrative Intelligence Report —
              monitoring what AI tells people about your brand across{' '}
              <span className="text-amethyst font-medium">{auditData.stats.marketsScanned} markets</span> and{' '}
              <span className="text-amethyst font-medium">{auditData.stats.languagesUsed} languages</span>
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <AuditStats stats={auditData.stats} />
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-16 z-40 glass border-b border-ghost/8">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3" id="tab-navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-[20px] text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-lime text-midnight'
                    : 'text-ghost/50 hover:text-ghost hover:bg-ghost/5'
                }`}
                onClick={() => setActiveTab(tab.id)}
                id={`tab-${tab.id}`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in space-y-8">
              {/* Top Row: AVS + Key Findings */}
              <div className="grid lg:grid-cols-[380px_1fr] gap-6">
                <AVSGauge
                  score={avs.overall}
                  presenceRate={avs.presenceRate}
                  sentimentScore={avs.sentimentScore}
                  shareOfVoice={avs.shareOfVoice}
                  geographicParity={avs.geographicParity}
                  trend={avs.trend || 'stable'}
                  trendDelta={avs.trendDelta || 0}
                />
                
                {/* Key Findings */}
                <div className="card">
                  <h2 className="text-heading text-ghost mb-4">Key Findings (Live)</h2>
                  <div className="space-y-3">
                    {auditData.queries.slice(0, 4).map((q: any) => (
                      <Finding 
                        key={q.id} 
                        severity={q.sentiment < -0.3 ? 'critical' : q.sentiment < 0 ? 'warning' : 'info'} 
                        text={`Query "${q.query}" yielded sentiment ${Math.round(q.sentiment * 100) / 100}. ${q.claims?.[0] || 'No specific claims extracted.'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Narrative Map */}
              <NarrativeMap liveData={auditData.queries} />

              {/* Bottom Row: Competitors + Quick Playbook */}
              <div className="grid lg:grid-cols-2 gap-6">
                <CompetitorBenchmark auditData={auditData} />
                <div className="space-y-6">
                  <PoisonSources liveData={auditData.poisonSources} />
                </div>
              </div>
            </div>
          )}

          {/* Narrative Map Tab */}
          {activeTab === 'narrative' && (
            <div className="animate-fade-in space-y-8">
              <NarrativeMap liveData={auditData.queries} />
              <CompetitorBenchmark auditData={auditData} />
            </div>
          )}

          {/* Poison Sources Tab */}
          {activeTab === 'sources' && (
            <div className="animate-fade-in">
              <PoisonSources liveData={auditData.poisonSources} />
            </div>
          )}

          {/* Playbook Tab */}
          {activeTab === 'playbook' && (
            <div className="animate-fade-in">
              <Playbook liveData={auditData} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function Finding({ severity, text }: { severity: 'critical' | 'warning' | 'info'; text: string }) {
  const styles = {
    critical: { icon: '🔴', color: 'text-danger' },
    warning: { icon: '🟡', color: 'text-warning' },
    info: { icon: '🔵', color: 'text-info' },
  };
  const style = styles[severity];
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-ghost/[0.03] border border-ghost/5">
      <span className="text-sm shrink-0 mt-0.5">{style.icon}</span>
      <p className={`text-sm ${style.color}`}>{text}</p>
    </div>
  );
}
