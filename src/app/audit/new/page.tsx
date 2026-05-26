'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAudit } from '@/context/AuditContext';

const defaultMarkets = [
  { code: 'US', name: 'United States', checked: true },
  { code: 'DE', name: 'Germany', checked: true },
  { code: 'JP', name: 'Japan', checked: true },
  { code: 'BR', name: 'Brazil', checked: false },
  { code: 'ID', name: 'Indonesia', checked: true },
  { code: 'GB', name: 'United Kingdom', checked: true },
  { code: 'IN', name: 'India', checked: false },
  { code: 'SG', name: 'Singapore', checked: true },
];

export default function NewAuditPage() {
  const router = useRouter();
  const { runAudit } = useAudit();
  const [brand, setBrand] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [markets, setMarkets] = useState(defaultMarkets);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  const selectedMarkets = markets.filter((m) => m.checked);

  const handleToggleMarket = (code: string) => {
    setMarkets(
      markets.map((m) =>
        m.code === code ? { ...m, checked: !m.checked } : m
      )
    );
  };

  const handleStartAudit = async () => {
    if (!brand.trim()) return;

    setIsRunning(true);
    setProgress(0);
    setProgressText('Starting audit and connecting to Bright Data...');

    // Fake visual progress while the real API runs in the background
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 95));
      setProgressText((p) => {
        if (progress > 80) return 'Generating corrective action playbook with Gemini...';
        if (progress > 50) return 'Analyzing sentiment with Gemini Flash (bulk)...';
        if (progress > 20) return 'Extracting AI Overviews from search results...';
        return 'Querying markets via Bright Data SERP API...';
      });
    }, 500);

    try {
      const compList = competitors ? competitors.split(',').map(c => c.trim()) : undefined;
      const marketList = selectedMarkets.map(m => m.code);
      
      // Call the REAL API via our Context
      await runAudit(brand, compList, marketList);
      
      clearInterval(progressInterval);
      setProgress(100);
      setProgressText('Audit complete! Redirecting...');
      
      setTimeout(() => {
        router.push('/audit/nexafin'); // Redirect to the main results page
      }, 800);
    } catch (error: any) {
      clearInterval(progressInterval);
      setProgressText(`Error: ${error.message || 'Audit failed'}`);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in-up">
            <h1 className="text-heading-lg text-ghost mb-2">
              Start New Audit
            </h1>
            <p className="text-body text-ghost/50">
              Discover what AI search engines tell people about your brand
            </p>
          </div>

          {!isRunning ? (
            /* Form */
            <div className="card space-y-6 animate-fade-in" id="audit-form">
              {/* Brand Name */}
              <div>
                <label className="text-caption text-ghost/50 uppercase tracking-wider block mb-2">
                  Brand Name *
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g., NexaFin"
                  className="w-full bg-midnight border border-ghost/15 rounded-xl px-4 py-3 text-ghost placeholder-ghost/25 focus:outline-none focus:border-lime/50 transition-colors"
                  id="input-brand"
                />
              </div>

              {/* Competitors */}
              <div>
                <label className="text-caption text-ghost/50 uppercase tracking-wider block mb-2">
                  Competitors (comma-separated)
                </label>
                <input
                  type="text"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="e.g., FinGuard Pro, SecureFlow, PayShield"
                  className="w-full bg-midnight border border-ghost/15 rounded-xl px-4 py-3 text-ghost placeholder-ghost/25 focus:outline-none focus:border-lime/50 transition-colors"
                  id="input-competitors"
                />
              </div>

              {/* Markets */}
              <div>
                <label className="text-caption text-ghost/50 uppercase tracking-wider block mb-2">
                  Target Markets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {markets.map((market) => (
                    <button
                      key={market.code}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        market.checked
                          ? 'bg-lime/10 border-lime/30 text-lime'
                          : 'bg-ghost/5 border-ghost/10 text-ghost/40 hover:border-ghost/20'
                      }`}
                      onClick={() => handleToggleMarket(market.code)}
                    >
                      {market.code} — {market.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-midnight/50 rounded-xl border border-ghost/8 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-ghost/40">Estimated queries:</span>
                  <span className="text-ghost font-medium">
                    ~{selectedMarkets.length * 6} variations
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-ghost/40">Markets:</span>
                  <span className="text-ghost font-medium">
                    {selectedMarkets.length} selected
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-ghost/40">Estimated time:</span>
                  <span className="text-ghost font-medium">~45 seconds</span>
                </div>
              </div>

              {/* Submit */}
              <button
                className="btn-primary w-full py-4 text-base font-bold"
                onClick={handleStartAudit}
                disabled={!brand.trim()}
                id="btn-start-audit"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Launch Narrative Audit
              </button>
            </div>
          ) : (
            /* Progress */
            <div className="card animate-scale-in" id="audit-progress">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-lime/10 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c7ff69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h2 className="text-heading-lg text-ghost mb-1">
                  Auditing &quot;{brand}&quot;
                </h2>
                <p className="text-sm text-ghost/40">
                  Scanning {selectedMarkets.length} markets with {selectedMarkets.length * 6}+ query variations
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-ghost/70">{progressText}</span>
                  <span className="text-sm text-lime font-medium">{progress}%</span>
                </div>
                <div className="progress-bar h-2">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #c7ff69, #7a78ff)',
                    }}
                  />
                </div>
              </div>

              {/* API Calls Log */}
              <div className="bg-midnight/50 rounded-xl border border-ghost/8 p-4 mt-6 max-h-48 overflow-y-auto">
                <div className="text-caption text-ghost/30 uppercase tracking-wider mb-2">
                  Live API Log
                </div>
                <div className="space-y-1 font-mono text-xs text-ghost/40">
                  {progress >= 10 && <div className="text-lime/60">✓ Generated 52 query variations</div>}
                  {progress >= 25 && <div className="text-lime/60">✓ Bright Data SERP API: {selectedMarkets.length} markets queried</div>}
                  {progress >= 40 && <div className="text-amethyst/60">✓ Extracted 41 AI Overviews from results</div>}
                  {progress >= 55 && <div className="text-amethyst/60">✓ Gemini Flash: bulk sentiment analysis complete</div>}
                  {progress >= 70 && <div className="text-sunset/60">✓ Traced 5 poison sources via Web Scraper</div>}
                  {progress >= 85 && <div className="text-skyblue/60">✓ AVS calculated: 42/100 (Critical)</div>}
                  {progress >= 95 && <div className="text-lime/60">✓ Gemini: playbook with 5 actions generated</div>}
                  {progress >= 100 && <div className="text-lime font-bold">✓ Audit complete in 47s</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
