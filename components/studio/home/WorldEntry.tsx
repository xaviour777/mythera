'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { registerGsap, useSceneEnabled } from '../useScrollScene';

/**
 * CINEMATIC MOMENT 01 — the homepage moves into the film frame.
 * A framed still opens to full bleed while the camera pushes in, then the
 * title lands and the image settles into darkness. Short pin, scrubbed to
 * native scroll, so fast scrolling passes straight through.
 */
export function WorldEntry({
  src,
  blurDataURL,
  number,
  title,
  kicker,
}: {
  src: string;
  blurDataURL: string;
  number: string;
  title: string;
  kicker: string;
}) {
  const enabled = useSceneEnabled();
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pinRef.current;
    if (!enabled || !el) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const ctx = gsap.context(() => {
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: mobile ? '+=85%' : '+=120%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          refreshPriority: 1,
        },
      });
      tl.fromTo(
        '[data-frame]',
        { clipPath: mobile ? 'inset(24% 12% 24% 12%)' : 'inset(17% 27% 17% 27%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power1.inOut' },
        0,
      )
        .fromTo('[data-img]', { scale: 1.02 }, { scale: 1.26, duration: 1.5 }, 0)
        .fromTo('[data-pre]', { opacity: 1 }, { opacity: 0, duration: 0.25 }, 0.05)
        .fromTo('[data-shade]', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.55)
        .fromTo('[data-title]', { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.7)
        .fromTo('[data-kicker]', { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0.8)
        .to({}, { duration: 0.2 });
    }, el);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [enabled]);

  return (
    <section id="world-001" aria-labelledby="world-title" className="relative bg-[var(--ink)]">
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden">
        <div data-frame className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
          <div data-img className="absolute inset-0 origin-[76%_42%] will-change-transform">
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={blurDataURL}
              className="object-cover object-[80%_42%]"
            />
          </div>
          <div
            data-shade
            className="absolute inset-0 bg-[linear-gradient(0deg,#050505_0%,rgba(5,5,5,0.7)_38%,rgba(5,5,5,0.25)_70%,rgba(5,5,5,0.45)_100%)]"
            style={{ opacity: enabled ? 0 : 1 }}
          />
        </div>

        {enabled && (
          <p data-pre className="eyebrow eyebrow-strong absolute inset-x-0 top-[9%] text-center" aria-hidden="true">
            World {number}
          </p>
        )}

        <div className="gutter absolute inset-x-0 bottom-0 pb-[12svh]">
          <p data-kicker className="eyebrow eyebrow-strong mb-6">
            {kicker}
          </p>
          <h2 id="world-title" data-title className="display display-lg max-w-[14ch]">
            {title}
          </h2>
        </div>
      </div>
    </section>
  );
}
