'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The egg. Proximity of the cursor (or a finger) brings it subtly to life;
 * touching it makes it react. Pure DOM/CSS — cheap on any phone.
 *
 * Future: replace this component with a React Three Fiber scene that keeps
 * the same props (reduced, awake, onTouch, onNear).
 */
export function Egg({
  reduced,
  awake,
  onTouch,
  onNear,
}: {
  reduced: boolean;
  awake: boolean;
  onTouch: () => void;
  onNear: (near: number) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [reacting, setReacting] = useState(0);
  const onNearRef = useRef(onNear);
  useEffect(() => {
    onNearRef.current = onNear;
  }, [onNear]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = { near: 0, dx: 0, dy: 0 };
    const cur = { near: 0, dx: 0, dy: 0 };
    let raf = 0;
    let lastNear = -1;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const reach = Math.hypot(window.innerWidth, window.innerHeight) * 0.42;
      target.near = Math.max(0, Math.min(1, 1 - Math.hypot(dx, dy) / reach));
      target.dx = Math.max(-1, Math.min(1, dx / reach));
      target.dy = Math.max(-1, Math.min(1, dy / reach));
    };
    const onLeave = () => {
      target.near = 0;
      target.dx = 0;
      target.dy = 0;
    };

    const tick = (now: number) => {
      const k = reduced ? 1 : 0.06;
      cur.near += (target.near - cur.near) * k;
      cur.dx += (target.dx - cur.dx) * k;
      cur.dy += (target.dy - cur.dy) * k;
      const t = (now - t0) / 1000;
      // Breathing quickens, faintly, as you come closer.
      const breath = reduced ? 0 : Math.sin(t * (0.7 + cur.near * 1.6)) * (0.004 + cur.near * 0.012);
      el.style.setProperty('--near', cur.near.toFixed(3));
      el.style.setProperty('--tilt', `${(cur.dx * 3).toFixed(2)}deg`);
      el.style.setProperty('--lx', `${(42 + cur.dx * 10).toFixed(1)}%`);
      el.style.setProperty('--ly', `${(34 + cur.dy * 8).toFixed(1)}%`);
      el.style.setProperty('--breath', (1 + breath).toFixed(4));
      if (Math.abs(cur.near - lastNear) > 0.01) {
        lastNear = cur.near;
        onNearRef.current(cur.near);
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  return (
    <button
      ref={ref}
      type="button"
      className={`egg ${awake ? 'is-awake' : ''}`}
      aria-label={awake ? 'The egg. It knows you are here.' : 'Touch the egg'}
      onClick={() => {
        setReacting((n) => n + 1);
        onTouch();
      }}
    >
      <span key={reacting} className={`egg-body ${reacting ? 'is-reacting' : ''}`}>
        <span className="egg-shell" />
        <span className="egg-light" />
        <svg className="egg-crack" viewBox="0 0 100 130" aria-hidden="true">
          <path d="M50 18 L46 34 L53 46 L47 60 L55 72 L50 84" />
        </svg>
      </span>
      <span className="egg-shadow" aria-hidden="true" />
    </button>
  );
}
