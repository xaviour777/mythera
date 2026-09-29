'use client';

import { useEffect, useRef } from 'react';
import { registerGsap, useSceneEnabled } from '../useScrollScene';

const BEATS = ['Build.', 'Release.', 'Listen.', 'Expand.'];

/**
 * CINEMATIC MOMENT 02 — four full-scale beats, each cutting in as the last
 * leaves. Scrubbed to native scroll over a short pin; with motion reduced (or
 * before hydration) the beats are a simple readable stack.
 */
export function MethodBeats() {
  const enabled = useSceneEnabled();
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pinRef.current;
    if (!enabled || !el) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const ctx = gsap.context(() => {
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      const words = gsap.utils.toArray<HTMLElement>('[data-beat]');
      const ticks = gsap.utils.toArray<HTMLElement>('[data-tick]');
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: mobile ? '+=160%' : '+=220%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });
      // The first beat is already on screen as the section arrives.
      gsap.set(words.slice(1), { opacity: 0, yPercent: 18, scale: 0.97 });
      gsap.set(ticks[0], { opacity: 1 });
      words.forEach((w, i) => {
        const at = i * 1;
        if (i > 0) {
          tl.to(w, { opacity: 1, yPercent: 0, scale: 1, duration: 0.35, ease: 'power2.out' }, at - 0.15)
            .to(ticks[i], { opacity: 1, duration: 0.2 }, at - 0.15);
        }
        if (i < words.length - 1) {
          tl.to(w, { opacity: 0, yPercent: -14, scale: 1.02, duration: 0.3, ease: 'power1.in' }, at + 0.7)
            .to(ticks[i], { opacity: 0.3, duration: 0.2 }, at + 0.8);
        }
      });
      // Hold the last beat, then let it widen and release into the copy below.
      tl.to(words[words.length - 1], { scale: 1.06, opacity: 0.2, duration: 0.6 }, BEATS.length - 1 + 0.6);
    }, el);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [enabled]);

  return (
    <section id="method" aria-labelledby="method-title" className="relative bg-[var(--ink)]">
      <h2 id="method-title" className="sr-only">
        The method: Build. Release. Listen. Expand.
      </h2>
      {enabled ? (
        <div ref={pinRef} className="gutter relative flex h-[100svh] flex-col items-center justify-center overflow-hidden">
          <p className="eyebrow absolute left-[var(--gutter)] top-[14svh]">The method</p>
          <div className="relative flex w-full items-center justify-center" aria-hidden="true">
            {BEATS.map((b) => (
              <span
                key={b}
                data-beat
                className="display absolute text-center text-[clamp(3.5rem,15vw,15rem)] leading-none will-change-transform"
              >
                {b}
              </span>
            ))}
            {/* Reserve the height of one beat. */}
            <span className="display invisible text-[clamp(3.5rem,15vw,15rem)] leading-none">Build.</span>
          </div>
          <ol className="absolute bottom-[10svh] flex gap-6" aria-hidden="true">
            {BEATS.map((b, i) => (
              <li key={b} data-tick className="eyebrow opacity-30">
                0{i + 1}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="gutter py-28 sm:py-40">
          <p className="eyebrow mb-10">The method</p>
          <ol>
            {BEATS.map((b, i) => (
              <li key={b} className="flex items-baseline gap-6 border-t border-[var(--hair)] py-4 last:border-b">
                <span className="eyebrow w-8 shrink-0">0{i + 1}</span>
                <span className="display display-lg">{b}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
