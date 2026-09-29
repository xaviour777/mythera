'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from './MotionProvider';

let registered = false;
export function registerGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/**
 * Whether a scroll-choreographed scene should run. False on the server, before
 * hydration, and whenever motion is reduced — scenes render a static,
 * fully readable layout in those cases.
 */
export function useSceneEnabled() {
  const { mode, ready } = useMotion();
  return ready && mode === 'full';
}
