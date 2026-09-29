'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { startAmbient, type Ambient } from './ambient';
import { Egg } from './Egg';
import { useMotionPreference } from '../studio/MotionProvider';

/**
 * ENTER MYTHRA — teaser.
 * The temple is not built yet, and this page says so. What exists is honest:
 * one egg that notices you, and a way to be let in first.
 *
 * The <Egg> stage is the swap point for the future React Three Fiber temple
 * (see content/mythra.json → enter.mode).
 */
export function EnterExperience() {
  const [awake, setAwake] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sound, setSound] = useState(false);
  const { mode } = useMotionPreference();
  const reduced = mode === 'reduced';
  const ambient = useRef<Ambient | null>(null);

  useEffect(() => {
    // Never make anyone wait for the way in.
    const t = setTimeout(() => setShowForm(true), 7000);
    return () => {
      clearTimeout(t);
      ambient.current?.stop();
    };
  }, []);

  function toggleSound() {
    if (sound) {
      ambient.current?.stop();
      ambient.current = null;
      setSound(false);
    } else {
      ambient.current = startAmbient();
      setSound(!!ambient.current);
    }
  }

  function onTouch() {
    ambient.current?.pulse();
    if (!awake) {
      setAwake(true);
      setTimeout(() => setShowForm(true), 1400);
    }
  }

  return (
    <div className="enter-root">
      <div className="enter-temple" aria-hidden="true">
        <div className="enter-shaft" />
        <div className="enter-pillars" />
        <div className="enter-floor" />
      </div>

      <header className="enter-chrome">
        <Link href="/" className="enter-exit" aria-label="Leave the temple and return to MYTHRA Studios">
          Mythra
        </Link>
        <button type="button" className="enter-sound" onClick={toggleSound} aria-pressed={sound}>
          Sound <span className={sound ? 'on' : ''}>{sound ? 'On' : 'Off'}</span>
        </button>
      </header>

      <main className="enter-stage">
        <h1 className="sr-only">Enter MYTHRA</h1>
        <Egg reduced={reduced} awake={awake} onTouch={onTouch} onNear={(n) => ambient.current?.setNear(n)} />

        <div className="enter-words" aria-live="polite">
          <p className={`enter-line ${awake ? 'is-on' : ''}`}>{awake ? "It knows you're here." : ''}</p>
          {!awake && <p className="enter-hint">Come closer.</p>}
        </div>
      </main>

      <section className={`enter-door ${showForm ? 'is-open' : ''}`} aria-label="Be let in first" aria-hidden={!showForm}>
        <p className="enter-honest">The temple is still being built.</p>
        <p className="enter-sub">Leave your email. When it opens, you&apos;ll be let in first.</p>
        <EnterForm disabled={!showForm} />
      </section>
    </div>
  );
}

function EnterForm({ disabled }: { disabled: boolean }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState('sending');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'enter', email: form.get('email'), website: form.get('website'), page: '/enter' }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');
      setState('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <p className="enter-sent" role="status">
        It will remember you.
      </p>
    );
  }

  return (
    <form className="enter-form" onSubmit={onSubmit}>
      <label htmlFor="enter-email" className="sr-only">
        Email
      </label>
      <input
        id="enter-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Your email"
        disabled={disabled}
        maxLength={200}
      />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="enter-hp" />
      <button type="submit" disabled={disabled || state === 'sending'}>
        {state === 'sending' ? '…' : 'Let me in'}
      </button>
      {state === 'error' && (
        <p role="alert" className="enter-error">
          {error}
        </p>
      )}
    </form>
  );
}
