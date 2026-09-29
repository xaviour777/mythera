'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { PartnerCategory } from '../../lib/content';

type InquiryKind = 'partner' | 'deck';

interface InquiryApi {
  open: (kind: InquiryKind, categoryId?: string) => void;
}

const InquiryContext = createContext<InquiryApi>({ open: () => {} });

export function useInquiry() {
  return useContext(InquiryContext);
}

/**
 * One dialog for every partner entry point. "partner" opens the partnership
 * form; "deck" opens the partner-deck request. Either can be opened with a
 * category preselected.
 */
export function InquiryProvider({
  categories,
  deckStatus,
  children,
}: {
  categories: PartnerCategory[];
  deckStatus: 'in-preparation' | 'ready';
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [kind, setKind] = useState<InquiryKind>('partner');
  const [category, setCategory] = useState<string>('');
  const [session, setSession] = useState(0);

  const open = useCallback((k: InquiryKind, categoryId?: string) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setKind(k);
    setCategory(categoryId ?? '');
    setSession((s) => s + 1);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => returnFocus.current?.focus?.();
    // Click on the backdrop closes the dialog.
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    d.addEventListener('close', onClose);
    d.addEventListener('click', onClick);
    return () => {
      d.removeEventListener('close', onClose);
      d.removeEventListener('click', onClick);
    };
  }, []);

  // Deep links: /#partner or /#partner-deck open the matching form.
  useEffect(() => {
    const fromHash = () => {
      if (location.hash === '#partner-with-mythra') open('partner');
      if (location.hash === '#partner-deck') open('deck');
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [open]);

  return (
    <InquiryContext.Provider value={{ open }}>
      {children}
      <dialog ref={dialogRef} className="inquiry-dialog" aria-labelledby="inquiry-title">
        <InquiryForm
          key={session}
          kind={kind}
          categoryId={category}
          categories={categories}
          deckStatus={deckStatus}
          onClose={close}
        />
      </dialog>
    </InquiryContext.Provider>
  );
}

function InquiryForm({
  kind,
  categoryId,
  categories,
  deckStatus,
  onClose,
}: {
  kind: InquiryKind;
  categoryId: string;
  categories: PartnerCategory[];
  deckStatus: 'in-preparation' | 'ready';
  onClose: () => void;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const isDeck = kind === 'deck';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    setState('sending');
    setError('');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, type: kind, page: location.pathname }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
      setSentTo(String(payload.email || ''));
      setState('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setState('error');
    }
  }

  return (
    <div className="relative px-6 pt-7 pb-8 sm:px-10 sm:pt-10 sm:pb-10">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-[var(--bone-3)] transition-colors hover:text-[var(--bone)]"
        aria-label="Close"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      {state === 'sent' ? (
        <div className="py-8" role="status">
          <p className="eyebrow mb-6">{isDeck ? 'Request received' : 'Message received'}</p>
          <h2 id="inquiry-title" className="display display-sm mb-6">
            {isDeck ? 'Thank you.' : 'Thank you. We read every one.'}
          </h2>
          <p className="body-sm max-w-md">
            {isDeck
              ? deckStatus === 'ready'
                ? `The MYTHRA partner deck is on its way to ${sentTo}.`
                : `The MYTHRA partner deck is being finalised. It will be sent to ${sentTo} personally by the partnerships team.`
              : `The MYTHRA partnerships team will reply to ${sentTo}.`}
          </p>
          <button type="button" className="btn btn-line mt-10" onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate={false}>
          <p className="eyebrow mb-5">{isDeck ? 'Partner deck' : 'Partnerships'}</p>
          <h2 id="inquiry-title" className="display display-sm mb-3 pr-10">
            {isDeck ? 'Request the partner deck' : 'Partner with MYTHRA'}
          </h2>
          <p className="body-sm mb-8 max-w-md">
            {isDeck
              ? 'Tell us who you are and the deck will be sent to your work email.'
              : 'Tell us who you are and what you have in mind. Every inquiry is read by the studio.'}
          </p>

          <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <Field label="Name" name="name" autoComplete="name" required />
            <Field label="Company" name="company" autoComplete="organization" required />
            <Field label="Role" name="role" autoComplete="organization-title" required />
            <Field label="Work email" name="email" type="email" autoComplete="email" required />
            <Field label="Country" name="country" autoComplete="country-name" required />
            <div className="field">
              <label htmlFor="inq-interest">Partnership interest</label>
              <select id="inq-interest" name="interest" defaultValue={categoryId} required>
                <option value="" disabled>
                  Select
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>
            {!isDeck && (
              <div className="field sm:col-span-2">
                <label htmlFor="inq-message">Message (optional)</label>
                <textarea id="inq-message" name="message" rows={3} maxLength={3000} />
              </div>
            )}
          </div>

          {/* Honeypot — hidden from people and assistive tech. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {state === 'error' && (
            <p role="alert" className="body-sm mt-6 text-[var(--ember)]">
              {error}
            </p>
          )}

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="btn btn-solid w-full sm:w-auto" disabled={state === 'sending'}>
              {state === 'sending' ? 'Sending…' : isDeck ? 'Send me the MYTHRA partner deck' : 'Send to MYTHRA partnerships'}
            </button>
          </div>
          <p className="mt-5 text-[12px] leading-relaxed text-[var(--bone-4)]">
            Used only to respond to this inquiry. See the <a className="underline underline-offset-4" href="/privacy">privacy notice</a>.
          </p>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const id = `inq-${name}`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} type={type} autoComplete={autoComplete} required={required} maxLength={200} />
    </div>
  );
}

/** A button that opens the unified inquiry dialog. */
export function InquiryButton({
  kind,
  categoryId,
  className,
  children,
}: {
  kind: InquiryKind;
  categoryId?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useInquiry();
  return (
    <button type="button" className={className} onClick={() => open(kind, categoryId)} aria-haspopup="dialog">
      {children}
    </button>
  );
}
