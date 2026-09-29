'use client';

import { useEffect } from 'react';

/**
 * Progressive, once-only fade for elements marked data-reveal. Content is
 * fully visible without JS; the class that hides it is only added here.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.querySelector('.studio-root');
    if (!root || !('IntersectionObserver' in window)) return;
    root.classList.add('js-reveal');

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    const observe = () =>
      root.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
        // Anything already on screen shows immediately — never hide what's visible.
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
        else io.observe(el);
      });
    observe();

    const mo = new MutationObserver(observe);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
