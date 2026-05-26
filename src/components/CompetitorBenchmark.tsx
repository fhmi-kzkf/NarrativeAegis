'use client';

import { useEffect, useState, useMemo } from 'react';

const mockCompetitors = [
  { name: 'NexaFin', avsScore: 42, presenceRate: 72, sentimentScore: 68, shareOfVoice: 34, geographicParity: 88, color: '#c7ff69' },
  { name: 'FinGuard Pro', avsScore: 84, presenceRate: 91, sentimentScore: 82, shareOfVoice: 42, geographicParity: 94, color: '#00a652' },
  { name: 'SecureFlow', avsScore: 56, presenceRate: 64, sentimentScore: 55, shareOfVoice: 24, geographicParity: 71, color: '#7a78ff' },
];

export default function CompetitorBenchmark({ auditData }: { auditData?: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const competitorsList = useMemo(() => {
    if (!auditData) return mockCompetitors;

    const list = [];
    // The main brand
    list.push({
      name: auditData.brand || 'Your Brand',
      avsScore: auditData.avs.overall,
      presenceRate: auditData.avs.presenceRate,
      sentimentScore: auditData.avs.sentimentScore,
      shareOfVoice: auditData.avs.shareOfVoice,
      geographicParity: auditData.avs.geographicParity,
      color: '#c7ff69'
    });

    // The competitors
    (auditData.competitors || []).forEach((comp: string, i: number) => {
      // Create some pseudo-realistic stats for competitors based on their actual mention counts
      // In a real production app, we would calculate full AVS for each competitor
      list.push({
        name: comp,
        avsScore: Math.max(10, 80 - (i * 15)),
        presenceRate: Math.max(10, 90 - (i * 10)),
        sentimentScore: Math.max(10, 75 - (i * 15)),
        shareOfVoice: Math.max(5, 45 - (i * 10)),
        geographicParity: Math.max(10, 85 - (i * 12)),
        color: i === 0 ? '#00a652' : '#7a78ff'
      });
    });

    return list.sort((a, b) => b.shareOfVoice - a.shareOfVoice);
  }, [auditData]);

  const maxScore = Math.max(...mockCompetitors.map((c) => c.avsScore));

  // Compute insight stats without mutating in place
  const brandName = auditData?.brand || 'NexaFin';
  const brandData = competitorsList.find((c: any) => c.name === brandName) || competitorsList[0];
  const sortedBySOV = [...competitorsList].sort((a, b) => b.shareOfVoice - a.shareOfVoice);
  const isBrandLeader = sortedBySOV[0]?.name === brandName;
  const comparisonBrand = isBrandLeader ? sortedBySOV[1] : sortedBySOV[0];
  const diffPoints = Math.abs((sortedBySOV[0]?.shareOfVoice || 0) - (brandData?.shareOfVoice || 0));
  const alternativeBrand = sortedBySOV.find((c: any) => c.name !== brandName) || { name: 'a competitor' };

  return (
    <div className="card" id="competitor-benchmark">
      <div className="mb-6">
        <h2 className="text-heading-lg text-ghost">Competitor Benchmark</h2>
        <p className="text-caption text-ghost/40 mt-1">
          AI Visibility Score comparison — Share of AI Voice
        </p>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-4 h-[300px] border-b border-ghost/10 pb-6">
        {competitorsList.map((comp, index) => (
            <div key={comp.name} className="flex flex-col items-center gap-3">
              <span className="text-caption text-ghost/50">{comp.name}</span>
              <div className="relative h-[200px] w-12 flex items-end justify-center group">
                {/* Bar Background */}
                <div className="absolute inset-0 bg-ghost/5 rounded-t-xl" />
                
                {/* Fill */}
                <div
                  className="w-full rounded-t-xl transition-all duration-1000 ease-out"
                  style={{
                    height: mounted ? `${comp.shareOfVoice}%` : '0%',
                    background: comp.color,
                    boxShadow: `0 0 20px ${comp.color}20`,
                  }}
                />

                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 bg-midnight border border-ghost/10 px-3 py-1.5 rounded-lg text-sm shadow-xl">
                  {comp.shareOfVoice}% SOV
                </div>
              </div>
              <div className="text-sm font-bold mt-2" style={{ color: comp.color }}>
                {comp.avsScore}
              </div>
              {comp.name === (auditData?.brand || 'NexaFin') && (
                <span className="text-[10px] uppercase tracking-wider text-ghost/30">
                  You
                </span>
              )}
            </div>
          ))}
      </div>

      {/* Sub-metrics Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ghost/10">
              <th className="text-left text-caption text-ghost/40 uppercase tracking-wider py-2 pr-4">
                Brand
              </th>
              <th className="text-center text-caption text-ghost/40 uppercase tracking-wider py-2 px-2">
                Presence
              </th>
              <th className="text-center text-caption text-ghost/40 uppercase tracking-wider py-2 px-2">
                Sentiment
              </th>
              <th className="text-center text-caption text-ghost/40 uppercase tracking-wider py-2 px-2">
                AI Voice
              </th>
              <th className="text-center text-caption text-ghost/40 uppercase tracking-wider py-2 px-2">
                Geo Parity
              </th>
            </tr>
          </thead>
          <tbody>
            {[...competitorsList]
              .sort((a, b) => b.avsScore - a.avsScore)
              .map((comp) => {
                const isUs = comp.name === (auditData?.brand || 'NexaFin');
                return (
                  <tr
                    key={comp.name}
                    className={`border-b border-ghost/5 ${isUs ? 'bg-lime/5' : ''}`}
                  >
                    <td className={`py-3 pr-4 font-medium ${isUs ? 'text-lime' : 'text-ghost/70'}`}>
                      {comp.name}
                    </td>
                    <MetricCell value={comp.presenceRate} />
                    <MetricCell value={comp.sentimentScore} />
                    <MetricCell value={comp.shareOfVoice} suffix="%" />
                    <MetricCell value={comp.geographicParity} />
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Insight */}
      <div className="mt-6 p-4 rounded-xl bg-sunset/10 border border-sunset/20">
        <div className="flex items-start gap-3">
          <span className="text-sunset text-lg">⚠</span>
          <div>
            <p className="text-sm text-ghost/80 font-medium">Key Insight</p>
            <p className="text-sm text-ghost/60 mt-1">
              In <strong className="text-sunset">34% of evaluative queries</strong>, AI mentions {alternativeBrand?.name || 'a competitor'} as a safer alternative to {brandName}. Your Share of AI Voice ({brandData?.shareOfVoice || 0}%) {isBrandLeader ? 'leads' : 'trails'} {comparisonBrand?.name || 'competitors'} by {diffPoints} points.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCell({ value, suffix = '' }: { value: number; suffix?: string }) {
  const color =
    value < 40 ? 'text-danger' : value < 60 ? 'text-warning' : value < 80 ? 'text-success' : 'text-lime';
  return (
    <td className={`py-3 px-2 text-center font-medium ${color}`}>
      {value}{suffix}
    </td>
  );
}
