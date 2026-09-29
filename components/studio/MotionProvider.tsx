'use client';

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';

export type MotionMode = 'full' | 'reduced';

const STORAGE_KEY = 'mythra-motion';
const listeners = new Set<() => void>();

function readMode(): MotionMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'full' || saved === 'reduced') return saved;
  } catch {}
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full';
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  window.addEventListener('storage', cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener('change', cb);
    window.removeEventListener('storage', cb);
  };
}

const noopSubscribe = () => () => {};

/**
 * The stored motion preference, readable anywhere (no provider needed).
 * `ready` is false during SSR and hydration, so scenes start static.
 */
export function useMotionPreference() {
  const mode = useSyncExternalStore<MotionMode>(subscribe, readMode, () => 'full');
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return { mode, ready };
}

const MotionContext = createContext<{ mode: MotionMode; setMode: (m: MotionMode) => void; ready: boolean }>({
  mode: 'full',
  setMode: () => {},
  ready: false,
});

/**
 * Motion mode (Full / Reduced). Defaults to the OS prefers-reduced-motion
 * setting and can be overridden from the footer. Scroll choreography and
 * ambient movement read this; content never depends on it.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const { mode, ready } = useMotionPreference();

  useEffect(() => {
    document.documentElement.dataset.motion = mode;
  }, [mode]);

  const setMode = useCallback((m: MotionMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {}
    listeners.forEach((l) => l());
  }, []);

  return <MotionContext.Provider value={{ mode, setMode, ready }}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  return useContext(MotionContext);
}

export function MotionToggle() {
  const { mode, setMode } = useMotion();
  return (
    <div className="flex items-center gap-3" role="group" aria-label="Motion">
      <span className="eyebrow">Motion</span>
      {(['full', 'reduced'] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          className={`eyebrow min-h-[44px] px-1 transition-colors ${mode === m ? '!text-[var(--bone)]' : 'hover:!text-[var(--bone-2)]'}`}
        >
          {m === 'full' ? 'Full' : 'Reduced'}
        </button>
      ))}
    </div>
  );
}
