'use client';

import { useEffect, useState } from 'react';

export default function AuditStats({ stats }: { stats: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!stats) return null;

  const data = [
    {
      label: 'Queries Analyzed',
      value: stats.totalQueries,
      suffix: '',
      color: '#c7ff69',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      label: 'Markets Scanned',
      value: stats.marketsScanned,
      suffix: '',
      color: '#7a78ff',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      label: 'AI Overviews Found',
      value: stats.aiOverviewsFound,
      suffix: `/${stats.totalQueries}`,
      color: '#ff6d38',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      label: 'Poison Sources',
      value: stats.poisonSourcesFound,
      suffix: ' detected',
      color: '#ff4d4d',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" id="audit-stats">
      {data.map((stat, index) => (
        <div
          key={stat.label}
          className="card flex flex-col items-center text-center p-5 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: `${stat.color}15`, color: stat.color }}
          >
            {stat.icon}
          </div>
          <div
            className="text-3xl font-bold transition-all duration-700"
            style={{
              color: stat.color,
              fontFamily: 'var(--font-display)',
              opacity: mounted ? 1 : 0,
            }}
          >
            {mounted ? stat.value : 0}
            <span className="text-base text-ghost/40">{stat.suffix}</span>
          </div>
          <div className="text-caption text-ghost/50 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
