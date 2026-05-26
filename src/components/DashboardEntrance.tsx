'use client';

import { useState, useEffect } from 'react';

export default function DashboardEntrance({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'done'>('loading');

  useEffect(() => {
    // Check if coming from landing page (has entrance flag)
    const shouldAnimate = sessionStorage.getItem('dashboard-entrance') === '1';
    
    if (!shouldAnimate) {
      setPhase('done');
      return;
    }

    sessionStorage.removeItem('dashboard-entrance');

    // Phase 1: Loading animation (shield draws)
    const timer1 = setTimeout(() => setPhase('reveal'), 1800);
    // Phase 2: Content reveals
    const timer2 = setTimeout(() => setPhase('done'), 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (phase === 'done') {
    return <div className="animate-dashboard-entrance">{children}</div>;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[100] bg-midnight flex items-center justify-center"
        style={{
          animation: phase === 'reveal' ? 'entranceOverlay 0.8s ease-out forwards' : 'none',
        }}
      >
        <div className="relative flex flex-col items-center gap-6">
          {/* Animated Shield */}
          <div className="relative">
            {/* Pulse Rings */}
            <div
              className="absolute inset-0 rounded-full border-2 border-lime/30"
              style={{
                animation: 'entrancePulseRing 2s ease-out infinite',
                width: '120px',
                height: '120px',
                left: '50%',
                top: '50%',
                marginLeft: '-60px',
                marginTop: '-60px',
              }}
            />
            <div
              className="absolute inset-0 rounded-full border-2 border-amethyst/20"
              style={{
                animation: 'entrancePulseRing 2s ease-out infinite 0.5s',
                width: '120px',
                height: '120px',
                left: '50%',
                top: '50%',
                marginLeft: '-60px',
                marginTop: '-60px',
              }}
            />

            {/* Shield Icon */}
            <div
              style={{
                animation: 'entranceLogo 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                className="drop-shadow-[0_0_30px_rgba(199,255,105,0.4)]"
              >
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="#c7ff69"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="rgba(199, 255, 105, 0.1)"
                  style={{
                    strokeDasharray: 200,
                    animation: 'entranceShield 1.5s ease-out forwards',
                  }}
                />
                {/* Inner checkmark */}
                <path
                  d="M9 12l2 2 4-4"
                  stroke="#c7ff69"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 20,
                    strokeDashoffset: 20,
                    animation: 'entranceShield 0.5s ease-out 1s forwards',
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="text-center" style={{ animation: 'fadeIn 0.5s ease-out 0.5s both' }}>
            <p className="text-ghost font-bold text-lg tracking-tight">
              Narrative<span className="text-lime">Shield</span>
            </p>
            <p className="text-ghost/40 text-sm mt-1">Initializing Dashboard...</p>
          </div>

          {/* Loading Bar */}
          <div className="w-48 h-1 rounded-full bg-ghost/10 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #c7ff69, #7a78ff)',
                animation: 'typewriter 1.5s ease-out forwards',
              }}
            />
          </div>
        </div>
      </div>

      {/* Content (hidden behind overlay) */}
      <div style={{ opacity: 0 }}>{children}</div>
    </>
  );
}
