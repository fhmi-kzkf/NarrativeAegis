'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * Hook for scroll-triggered reveal animations using GSAP
 */
export function useScrollReveal(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useGSAP(() => {
    if (!ref.current) return;
    ScrollTrigger.create({
      trigger: ref.current,
      start: `top ${100 - threshold * 100}%`,
      onEnter: () => setIsRevealed(true),
      once: true
    });
  }, { scope: ref });

  return { ref, isRevealed };
}

/**
 * Hook for parallax scroll effect — returns a Y offset based on scroll position using GSAP scrub
 */
export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useGSAP(() => {
    if (!ref.current) return;
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const windowHeight = window.innerHeight;
        const rect = ref.current!.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distanceFromCenter = elementCenter - windowHeight / 2;
        setOffset(distanceFromCenter * speed);
      }
    });
  }, { scope: ref });

  return { ref, offset };
}

/**
 * Hook for scroll progress (0 to 1) within an element using GSAP ScrollTrigger
 */
export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(() => {
    if (!ref.current) return;
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        setProgress(self.progress);
      }
    });
  }, { scope: ref });

  return { ref, progress };
}

/**
 * Hook for animated number counter using GSAP
 */
export function useCountUp(target: number, duration = 2000, startOnReveal = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    
    let obj = { val: 0 };
    
    const animation = gsap.to(obj, {
      val: target,
      duration: duration / 1000,
      ease: 'power3.out',
      onUpdate: () => setCount(Math.round(obj.val)),
      paused: startOnReveal
    });

    if (startOnReveal) {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 85%',
        onEnter: () => animation.play(),
        once: true
      });
    } else {
      animation.play();
    }
  }, { scope: ref, dependencies: [target, duration, startOnReveal] });

  return { ref, count, start: () => {} };
}

/**
 * Component wrapper for easy scroll reveal using pure GSAP animations (no CSS transitions needed)
 */
export function ScrollReveal({
  children,
  variant = 'default',
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'left' | 'right' | 'scale' | 'rotate';
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    let fromState: any = { opacity: 0 };
    let toState: any = { 
      opacity: 1, 
      duration: 1.2, 
      delay: delay, 
      ease: 'power3.out', 
      scrollTrigger: { 
        trigger: ref.current, 
        start: 'top 85%',
        toggleActions: 'play none none none'
      } 
    };

    switch (variant) {
      case 'left':
        fromState = { opacity: 0, x: -80 };
        toState.x = 0;
        break;
      case 'right':
        fromState = { opacity: 0, x: 80 };
        toState.x = 0;
        break;
      case 'scale':
        fromState = { opacity: 0, scale: 0.5 };
        toState.scale = 1;
        toState.ease = 'back.out(1.5)';
        break;
      case 'rotate':
        fromState = { opacity: 0, rotation: -15, y: 50 };
        toState.rotation = 0;
        toState.y = 0;
        toState.ease = 'back.out(1.2)';
        break;
      default:
        fromState = { opacity: 0, y: 60 };
        toState.y = 0;
    }

    gsap.fromTo(ref.current, fromState, toState);
  }, { scope: ref });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
