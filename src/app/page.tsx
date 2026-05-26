'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ScrollReveal, useScrollReveal, useParallax, useCountUp, useScrollProgress } from '@/hooks/useScrollAnimations';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    // GSAP animation to sweep across the screen
    gsap.to('.page-transition-overlay', {
      y: '0%',
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        sessionStorage.setItem('dashboard-entrance', '1');
        router.push('/dashboard');
      }
    });
  };

  return (
    <div className="relative">
      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 1: HERO — Parallax Orbs + Text Reveal         */}
      {/* ═══════════════════════════════════════════════════════ */}
      <HeroSection onGetStarted={handleGetStarted} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 2: PROBLEM — Typewriter + Stagger Cards       */}
      {/* ═══════════════════════════════════════════════════════ */}
      <ProblemSection />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 3: FEATURES — 3D Card Perspective Scroll      */}
      {/* ═══════════════════════════════════════════════════════ */}
      <FeaturesSection />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 4: HOW IT WORKS — Horizontal Scroll Timeline  */}
      {/* ═══════════════════════════════════════════════════════ */}
      <HowItWorksSection />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 5: STATS — Counter Animation                  */}
      {/* ═══════════════════════════════════════════════════════ */}
      <StatsSection />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 6: CTA — Final Call to Action                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <CTASection onGetStarted={handleGetStarted} />

      {/* Footer */}
      <footer className="border-t border-ghost/8 py-10 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-lime flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-sm text-ghost/40">
              Narrative<span className="text-lime/60">Shield</span> v4.0
            </span>
          </div>
          <div className="flex items-center gap-6 text-caption text-ghost/30">
            <span>Powered by Bright Data × Gemini AI</span>
            <span>•</span>
            <span>Bright Data Web Intelligence Hackathon 2026</span>
          </div>
        </div>
      </footer>

      {/* Page Transition Overlay */}
      <div 
        className="page-transition-overlay fixed inset-0 z-[100] bg-[#141414] flex items-center justify-center pointer-events-none"
        style={{ transform: 'translateY(100%)' }}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-lime/10 flex items-center justify-center mb-6 animate-pulse-glow">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c7ff69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="text-lime text-2xl font-bold animate-pulse" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>
            INITIALIZING DASHBOARD...
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HERO SECTION — Floating orbs + text reveal + parallax
   ───────────────────────────────────────────────────────── */
function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  const heroRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useGSAP(() => {
    if (!heroRef.current) return;
    
    // Unique Parallax and Rotation for Orbs
    gsap.to('.animate-orb-1', {
      yPercent: 60,
      rotation: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    
    gsap.to('.animate-orb-2', {
      yPercent: -40,
      rotation: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('.animate-orb-3', {
      yPercent: 80,
      scale: 1.3,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    
    // Zoom out hero content on scroll
    gsap.to('.hero-content-wrapper', {
      scale: 0.85,
      opacity: 0.1,
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay"
      id="hero"
    >
      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Orb 1: Lime */}
        <div
          className="absolute"
          style={{
            top: '10%',
            left: '-5%',
          }}
        >
          <div
            className="w-[500px] h-[500px] rounded-full animate-orb-1"
            style={{
              background: 'radial-gradient(circle, rgba(199,255,105,0.08) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Orb 2: Amethyst */}
        <div
          className="absolute"
          style={{
            top: '20%',
            right: '-5%',
          }}
        >
          <div
            className="w-[400px] h-[400px] rounded-full animate-orb-2"
            style={{
              background: 'radial-gradient(circle, rgba(122,120,255,0.1) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Orb 3: Sunset */}
        <div
          className="absolute"
          style={{
            bottom: '15%',
            left: '30%',
          }}
        >
          <div
            className="w-[300px] h-[300px] rounded-full animate-orb-3"
            style={{
              background: 'radial-gradient(circle, rgba(255,109,56,0.06) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 animate-orb-1" style={{
          backgroundImage: `
            linear-gradient(rgba(199,255,105,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(199,255,105,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Content */}
      <div className="hero-content-wrapper relative z-10 text-center px-6 max-w-[1000px] mx-auto">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-lime/20 bg-lime/5 mb-8 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
          </span>
          <span className="text-sm text-lime/80 font-medium">AI Search Visibility Platform</span>
        </div>

        {/* Headline */}
        <h1 className="mb-6">
          <span
            className={`block text-display text-ghost leading-[0.85] transition-all duration-1000 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Know What
          </span>
          <span
            className={`block text-display leading-[0.85] transition-all duration-1000 delay-500 animate-hero-glow ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              background: 'linear-gradient(135deg, #c7ff69, #7a78ff, #ff6d38)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: mounted ? 'gradientShift 6s ease infinite, heroGlowPulse 4s ease-in-out infinite' : 'none',
            }}
          >
            AI Says
          </span>
          <span
            className={`block text-display text-ghost leading-[0.85] transition-all duration-1000 delay-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            About You
          </span>
        </h1>

        {/* Subtext */}
        <p
          className={`text-lg text-ghost/50 max-w-xl mx-auto mb-10 transition-all duration-1000 delay-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Audit AI Overviews. Detect poison sources. Fix your brand narrative before AI tells the wrong story to millions.
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-[1200ms] ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            className="btn-primary text-base px-8 py-4 font-bold animate-pulse-glow"
            onClick={onGetStarted}
            id="hero-cta"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Launch Dashboard
          </button>
          <Link href="#features" className="btn-ghost text-base px-8 py-4">
            See How It Works ↓
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-[1500ms] ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="text-caption text-ghost/30 uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-ghost/20 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-lime animate-float" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   PROBLEM SECTION — Stagger reveal cards
   ───────────────────────────────────────────────────────── */
function ProblemSection() {
  return (
    <section className="py-32 px-6 relative" id="problem">
      <div className="section-divider mb-20" />
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="tag tag-critical mb-4 inline-block">The Blind Spot</span>
            <h2 className="text-heading-lg text-ghost text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
              You Have Zero Visibility
            </h2>
            <p className="text-lg text-ghost/50 max-w-2xl mx-auto">
              40% of Google searches now show AI Overviews. Your brand is being described by AI — and you have no idea what it&apos;s saying.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🤖',
              title: 'AI is the New Gatekeeper',
              desc: 'When someone asks "Is your brand trustworthy?", Google AI answers directly — before they click a single result.',
              color: '#ff4d4d',
            },
            {
              icon: '☠️',
              title: 'Invisible Poison Sources',
              desc: 'Outdated articles, biased reviews, and competitor content quietly shape your AI narrative without your knowledge.',
              color: '#ffc412',
            },
            {
              icon: '🌍',
              title: 'Geography Blind Spots',
              desc: 'Your brand may look great in the US but terrible in Germany or Indonesia. Different markets, different AI answers.',
              color: '#7a78ff',
            },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div
                className="card feature-card p-8 h-full"
                style={{ borderColor: `${item.color}20` }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: `${item.color}15` }}
                >
                  {item.icon}
                </div>
                <h3 className="text-subheading text-ghost mb-3">{item.title}</h3>
                <p className="text-sm text-ghost/50 leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Comparison */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 rounded-3xl bg-ghost/[0.03] border border-ghost/8 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 border-b md:border-b-0 md:border-r border-ghost/8">
                <span className="text-caption text-ghost/30 uppercase tracking-wider">Traditional Brand Monitoring</span>
                <h3 className="text-subheading text-ghost/50 mt-2 mb-4">Brandwatch / Meltwater</h3>
                <ul className="space-y-2 text-sm text-ghost/40">
                  <li className="flex items-center gap-2"><span className="text-ghost/20">✕</span> Monitors social media mentions</li>
                  <li className="flex items-center gap-2"><span className="text-ghost/20">✕</span> No AI search visibility</li>
                  <li className="flex items-center gap-2"><span className="text-ghost/20">✕</span> Action: &quot;Reply to tweet&quot;</li>
                </ul>
              </div>
              <div className="p-8 bg-lime/[0.03]">
                <span className="text-caption text-lime/60 uppercase tracking-wider">AI Search Intelligence</span>
                <h3 className="text-subheading text-lime mt-2 mb-4">Narrative Shield™</h3>
                <ul className="space-y-2 text-sm text-ghost/70">
                  <li className="flex items-center gap-2"><span className="text-lime">✓</span> Audits what AI tells users</li>
                  <li className="flex items-center gap-2"><span className="text-lime">✓</span> Detects poison sources</li>
                  <li className="flex items-center gap-2"><span className="text-lime">✓</span> Action: &quot;Fix page X so AI stops citing it&quot;</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   FEATURES SECTION — 3D perspective cards with scroll
   ───────────────────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      id: 'f1',
      icon: '🔍',
      tag: 'F1',
      title: 'AI Narrative Audit Engine',
      desc: '50+ query variations per brand sent to Bright Data SERP API — across different intents, languages, and geographies. Extract AI Overview content, sentiment, and source URLs.',
      color: '#c7ff69',
      visual: (
        <div className="grid grid-cols-4 gap-1 p-4">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded"
              style={{
                background: [
                  'rgba(255,77,77,0.6)', 'rgba(255,140,77,0.6)', 'rgba(255,196,18,0.6)',
                  'rgba(102,102,102,0.4)', 'rgba(102,204,102,0.5)', 'rgba(0,166,82,0.6)',
                  'rgba(199,255,105,0.6)',
                ][(i * 3 + 1) % 7],
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'f2',
      icon: '☠️',
      tag: 'F2',
      title: 'Poison Source Detector',
      desc: 'Trace every URL cited by AI Overviews. Analyze content age, bias type, factual accuracy, and fixability. Rank sources by damage × ease of repair.',
      color: '#ff6d38',
      visual: (
        <div className="space-y-2 p-4">
          {['techauditweekly.com', 'g2.com/reviews', 'reddit.com/r/fintech'].map((url, i) => (
            <div key={url} className="flex items-center gap-3 p-2 rounded-lg bg-ghost/5">
              <span className="text-sm font-bold text-sunset">#{i + 1}</span>
              <span className="text-xs text-ghost/50 flex-1 truncate">{url}</span>
              <span className="text-xs text-danger font-medium">{95 - i * 12}%</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'f3',
      icon: '📊',
      tag: 'F3',
      title: 'AI Visibility Score',
      desc: 'Proprietary AVS metric combining presence rate, sentiment score, share of AI voice, and geographic parity. Benchmark against competitors.',
      color: '#7a78ff',
      visual: (
        <div className="flex items-center justify-center p-6">
          <div className="relative w-24 h-24">
            <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
              <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(253,249,240,0.06)" strokeWidth="6" />
              <circle
                cx="48" cy="48" r="40" fill="none"
                stroke="#7a78ff" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={251} strokeDashoffset={251 * 0.58}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-amethyst" style={{ fontFamily: 'var(--font-display)' }}>42</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'f4',
      icon: '📋',
      tag: 'F4',
      title: 'Corrective Action Playbook',
      desc: 'AI-generated playbook with specific actions: which page to update, what content to publish, expected timeline for AI narrative change.',
      color: '#478bff',
      visual: (
        <div className="space-y-2 p-4">
          {['Publish Security Whitepaper', 'Request Article Correction', 'Launch G2 Review Campaign'].map((action, i) => (
            <div key={action} className="flex items-center gap-2 p-2 rounded-lg bg-ghost/5">
              <span className="w-5 h-5 rounded-full bg-lime/10 text-lime text-xs flex items-center justify-center font-medium">{i + 1}</span>
              <span className="text-xs text-ghost/60">{action}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section className="py-32 px-6 relative" id="features">
      <div className="section-divider mb-20" />
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal>
          <div className="text-center mb-20">
            <span className="tag tag-success mb-4 inline-block">Core Features</span>
            <h2 className="text-heading-lg text-ghost text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
              Your AI Intelligence Stack
            </h2>
            <p className="text-lg text-ghost/50 max-w-2xl mx-auto">
              Four powerful engines working together to protect and optimize your AI search narrative.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-8">
          {features.map((f, i) => (
            <ScrollReveal key={f.id} variant={i % 2 === 0 ? 'left' : 'right'} delay={0.1}>
              <div className={`grid md:grid-cols-[1fr_320px] gap-0 rounded-[32px] border border-ghost/8 overflow-hidden bg-surface-card ${
                i % 2 !== 0 ? 'md:grid-cols-[320px_1fr]' : ''
              }`}>
                {i % 2 !== 0 && (
                  <div className="border-b md:border-b-0 md:border-r border-ghost/8 bg-ghost/[0.02] flex items-center justify-center min-h-[200px]">
                    {f.visual}
                  </div>
                )}
                <div className="p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="tag"
                      style={{
                        background: `${f.color}15`,
                        color: f.color,
                        border: `1px solid ${f.color}30`,
                      }}
                    >
                      {f.tag}
                    </span>
                    <span className="text-2xl">{f.icon}</span>
                  </div>
                  <h3
                    className="text-2xl text-ghost mb-3 font-bold"
                    style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-ghost/50 leading-relaxed">{f.desc}</p>
                </div>
                {i % 2 === 0 && (
                  <div className="border-t md:border-t-0 md:border-l border-ghost/8 bg-ghost/[0.02] flex items-center justify-center min-h-[200px]">
                    {f.visual}
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   HOW IT WORKS — Scroll-triggered step timeline
   ───────────────────────────────────────────────────────── */
function HowItWorksSection() {
  const { ref, progress } = useScrollProgress();

  const steps = [
    { num: '01', title: 'Input Your Brand', desc: 'Enter your brand name, competitors, and target markets.', icon: '✏️', color: '#c7ff69' },
    { num: '02', title: 'AI Scans the Web', desc: '50+ queries sent via Bright Data SERP API across 8 markets.', icon: '🌐', color: '#7a78ff' },
    { num: '03', title: 'Analyze & Score', desc: 'Gemini Flash analyzes sentiment, sources, and competitor mentions in parallel.', icon: '🧠', color: '#ff6d38' },
    { num: '04', title: 'Get Your Playbook', desc: 'Receive a prioritized action plan to fix your AI narrative.', icon: '🎯', color: '#478bff' },
  ];

  // Normalize progress so that steps activate sequentially between 25% and 75% scroll.
  const startOffset = 0.25;
  const endOffset = 0.75;
  const normalizedProgress = Math.max(0, Math.min(1, (progress - startOffset) / (endOffset - startOffset)));
  const activeStep = Math.min(Math.floor(normalizedProgress * steps.length), steps.length - 1);

  return (
    <section ref={ref} className="py-32 px-6 relative" id="how-it-works">
      <div className="section-divider mb-20" />
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal>
          <div className="text-center mb-20">
            <span className="tag tag-info mb-4 inline-block">How It Works</span>
            <h2 className="text-heading-lg text-ghost text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
              Four Steps to Control
            </h2>
            <p className="text-lg text-ghost/50 max-w-xl mx-auto">
              From input to actionable playbook in under 60 seconds.
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop Timeline */}
        <div className="hidden md:block">
          {/* Progress Line */}
          <div className="relative mb-12">
            <div className="h-1 bg-ghost/8 rounded-full">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${((activeStep + 1) / steps.length) * 100}%`,
                  background: 'linear-gradient(90deg, #c7ff69, #7a78ff, #ff6d38, #478bff)',
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.15}>
                <div
                  className={`text-center transition-all duration-500 ${
                    i <= activeStep ? 'opacity-100 scale-100' : 'opacity-30 scale-95'
                  }`}
                >
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl transition-all duration-500"
                    style={{
                      background: i <= activeStep ? `${step.color}15` : 'rgba(253,249,240,0.05)',
                      border: `2px solid ${i <= activeStep ? `${step.color}40` : 'rgba(253,249,240,0.08)'}`,
                    }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider block mb-2"
                    style={{ color: i <= activeStep ? step.color : 'rgba(253,249,240,0.3)' }}
                  >
                    Step {step.num}
                  </span>
                  <h3 className="text-subheading text-ghost mb-2">{step.title}</h3>
                  <p className="text-sm text-ghost/40">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-6">
          {steps.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 0.1}>
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-xl"
                  style={{ background: `${step.color}15`, border: `2px solid ${step.color}40` }}
                >
                  {step.icon}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: step.color }}>
                    Step {step.num}
                  </span>
                  <h3 className="text-subheading text-ghost mb-1">{step.title}</h3>
                  <p className="text-sm text-ghost/40">{step.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   STATS SECTION — Animated counters
   ───────────────────────────────────────────────────────── */
function StatsSection() {
  const stat1 = useCountUp(50, 2000);
  const stat2 = useCountUp(8, 1500);
  const stat3 = useCountUp(60, 2500);
  const stat4 = useCountUp(5, 1000);

  const stats = [
    { ...stat1, label: 'Query Variations', suffix: '+', color: '#c7ff69' },
    { ...stat2, label: 'Markets Covered', suffix: '', color: '#7a78ff' },
    { ...stat3, label: 'Second Analysis', suffix: 's', color: '#ff6d38' },
    { ...stat4, label: 'Languages', suffix: '+', color: '#478bff' },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Marquee background */}
      <div className="absolute inset-0 flex items-center opacity-[0.03] pointer-events-none overflow-hidden">
        <div className="animate-marquee whitespace-nowrap" style={{ fontFamily: 'var(--font-display)', fontSize: '150px' }}>
          NARRATIVE SHIELD • AI SEARCH VISIBILITY • AISO • BRAND INTELLIGENCE • NARRATIVE SHIELD • AI SEARCH VISIBILITY • AISO • BRAND INTELLIGENCE •&nbsp;
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} ref={stat.ref} className="text-center">
              <div
                className="text-5xl md:text-6xl font-bold mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}99)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.count}{stat.suffix}
              </div>
              <p className="text-sm text-ghost/40 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   CTA SECTION — Final call to action with gradient bg
   ───────────────────────────────────────────────────────── */
function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-32 px-6 relative" id="cta">
      <div className="section-divider mb-20" />
      <div className="max-w-[800px] mx-auto">
        <ScrollReveal variant="scale">
          <div
            className="relative rounded-[48px] p-12 md:p-16 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(199,255,105,0.08), rgba(122,120,255,0.08), rgba(255,109,56,0.05))',
              border: '1px solid rgba(199,255,105,0.15)',
            }}
          >
            {/* Decorative orbs */}
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full animate-orb-1"
              style={{ background: 'radial-gradient(circle, rgba(199,255,105,0.1), transparent 70%)' }}
            />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full animate-orb-2"
              style={{ background: 'radial-gradient(circle, rgba(122,120,255,0.1), transparent 70%)' }}
            />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-lime/10 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c7ff69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>

              <h2
                className="text-3xl md:text-4xl text-ghost mb-4 font-bold"
                style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}
              >
                Ready to Shield Your Narrative?
              </h2>
              <p className="text-ghost/50 max-w-lg mx-auto mb-8">
                Don&apos;t let AI write your brand story. Take control of what millions see when they search for you.
              </p>
              <button
                className="btn-primary text-base px-10 py-4 font-bold"
                onClick={onGetStarted}
                id="cta-launch"
              >
                Launch Dashboard →
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
