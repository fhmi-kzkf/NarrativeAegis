'use client';

import { useEffect, useState } from 'react';

interface AVSGaugeProps {
  score: number;
  presenceRate: number;
  sentimentScore: number;
  shareOfVoice: number;
  geographicParity: number;
  trend: 'up' | 'down' | 'stable';
  trendDelta: number;
  size?: 'sm' | 'lg';
}

function getScoreColor(score: number): string {
  if (score < 40) return '#ff4d4d';
  if (score < 60) return '#ffc412';
  if (score < 80) return '#00a652';
  return '#c7ff69';
}

function getScoreLabel(score: number): string {
  if (score < 40) return 'Critical';
  if (score < 60) return 'Neutral';
  if (score < 80) return 'Positive';
  return 'Leading';
}

export default function AVSGauge({
  score,
  presenceRate,
  sentimentScore,
  shareOfVoice,
  geographicParity,
  trend,
  trendDelta,
  size = 'lg',
}: AVSGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  const radius = size === 'lg' ? 80 : 50;
  const strokeWidth = size === 'lg' ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const svgSize = (radius + strokeWidth) * 2;

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedScore((prev) => {
          if (prev >= score) {
            clearInterval(interval);
            return score;
          }
          return prev + 1;
        });
      }, 20);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const breakdown = [
    { label: 'Presence Rate', value: presenceRate, weight: '35%' },
    { label: 'Sentiment', value: sentimentScore, weight: '30%' },
    { label: 'Share of Voice', value: shareOfVoice, weight: '25%' },
    { label: 'Geo Parity', value: geographicParity, weight: '10%' },
  ];

  return (
    <div className="card" id="avs-gauge">
      <div className="flex flex-col items-center gap-6">
        {/* Gauge Circle */}
        <div className="relative">
          <svg
            width={svgSize}
            height={svgSize}
            className={`-rotate-90 ${mounted ? '' : 'opacity-0'}`}
          >
            {/* Background circle */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="none"
              stroke="rgba(253, 249, 240, 0.06)"
              strokeWidth={strokeWidth}
            />
            {/* Animated fill circle */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={mounted ? offset : circumference}
              className="gauge-circle"
              style={{
                filter: `drop-shadow(0 0 8px ${color}40)`,
              }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-bold tabular-nums"
              style={{
                fontSize: size === 'lg' ? '48px' : '28px',
                color,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}
            >
              {animatedScore}
            </span>
            <span className="text-caption text-ghost/50 uppercase tracking-wider">
              AVS
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <span
            className="tag"
            style={{
              background: `${color}20`,
              color,
              border: `1px solid ${color}40`,
            }}
          >
            {label}
          </span>
          <span
            className={`text-sm font-medium flex items-center gap-1 ${
              trend === 'down'
                ? 'text-danger'
                : trend === 'up'
                ? 'text-success'
                : 'text-ghost/50'
            }`}
          >
            {trend === 'down' ? '↓' : trend === 'up' ? '↑' : '→'}
            {Math.abs(trendDelta)} pts
          </span>
        </div>

        {/* Breakdown */}
        <div className="w-full space-y-3 mt-2">
          <h3 className="text-caption text-ghost/40 uppercase tracking-wider">
            Score Breakdown
          </h3>
          {breakdown.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-ghost/70">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-caption text-ghost/30">{item.weight}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: getScoreColor(item.value) }}
                  >
                    {item.value}
                  </span>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: mounted ? `${item.value}%` : '0%',
                    background: getScoreColor(item.value),
                    transitionDelay: '0.5s',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
