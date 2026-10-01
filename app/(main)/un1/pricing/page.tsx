'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { mythraOffers, type OfferTier, type AddOn } from '@/lib/offers';
import {
  CheckCircle2,
  ArrowRight,
  Star,
  ChevronDown,
  Package,
  Clock,
  Users,
} from 'lucide-react';

/* ─────────────────────────── Types ─────────────────────────── */

type TabKey = 'cast' | 'you' | 'filmmaker' | 'studios';

interface TabDef {
  key: TabKey;
  label: string;
}

/* ─────────────────────────── Constants ─────────────────────── */

const TABS: TabDef[] = [
  { key: 'cast', label: 'MYTHRA CAST' },
  { key: 'you', label: 'Personal Cinema' },
  { key: 'filmmaker', label: 'Filmmaker' },
  { key: 'studios', label: 'Studios' },
];

const TIER_MAP: Record<TabKey, OfferTier[]> = {
  cast: mythraOffers.cast,
  you: mythraOffers.you,
  filmmaker: mythraOffers.filmmaker,
  studios: mythraOffers.studios,
};

/* ─────────────────────────── FAQ Item ─────────────────────── */

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border-subtle)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-[var(--text-primary)] font-sans font-semibold text-base pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className="pb-5 text-[var(--text-secondary)] text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Tier Card ─────────────────────── */

function TierCard({ tier }: { tier: OfferTier }) {
  const { t } = useLanguage();

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 transition-all duration-300 ${
        tier.isRecommended
          ? 'border-primary bg-[var(--surface-elevated)] shadow-[0_0_40px_var(--accent-glow)] ring-1 ring-primary/40'
          : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)]'
      } hover:border-primary/50 hover:shadow-lg`}
    >
      {/* Recommended Badge */}
      {tier.isRecommended && (
        <div className="absolute -top-3 left-6 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1">
          <Star className="h-3.5 w-3.5 text-primary-foreground" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
            {t('pricing.featured')}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent-brand)] font-semibold">
          {tier.name}
        </span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-sans text-3xl font-extrabold text-[var(--text-primary)]">
            {tier.priceDisplay}
          </span>
          {tier.isStartingPrice && (
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {t('pricing.startingFrom')}
            </span>
          )}
        </div>
        {tier.standardPriceDisplay && (
          <span className="text-[11px] font-mono text-primary/80 block mt-1">
            {t('pricing.standardLabel')} {tier.standardPriceDisplay}
          </span>
        )}
        <p className="mt-1 font-sans text-sm font-medium text-primary italic">
          {tier.tagline}
        </p>
      </div>

      {/* Description */}
      <p className="mb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
        {tier.description}
      </p>

      {/* Availability or Turnaround Badge */}
      {(tier.availability || tier.turnaround) && (
        <div className="mb-5 flex flex-wrap gap-2 text-xs">
          {tier.availability && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-secondary px-3 py-1 font-medium text-foreground">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>{t('pricing.availabilityLabel')} {tier.availability}</span>
            </span>
          )}
          {tier.turnaround && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-secondary px-3 py-1 font-medium text-[var(--text-secondary)]">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{tier.turnaround}</span>
            </span>
          )}
        </div>
      )}

      {/* Features Checklist */}
      <div className="mb-5">
        <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">
          {t('pricing.features')}
        </h4>
        <ul className="space-y-2">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Deliverables */}
      {tier.deliverables && tier.deliverables.length > 0 && (
        <div className="mb-6">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" />
            {t('pricing.deliverables')}
          </h4>
          <ul className="space-y-1">
            {tier.deliverables.map((d, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)] pl-5">
                • {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-2">
        <Link
          href={tier.ctaHref}
          className={`w-full text-center ${
            tier.isRecommended ? 'btn-pill-primary' : 'btn-pill-secondary'
          }`}
        >
          <span>{tier.ctaText}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────── Add-On Card ────────────────────── */

function AddOnCard({ addon }: { addon: AddOn }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5 transition-colors hover:border-[var(--border-medium)]">
      <div>
        <h4 className="font-sans text-sm font-semibold text-[var(--text-primary)] mb-1">
          {addon.name}
        </h4>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
          {addon.description}
        </p>
      </div>
      <div className="font-mono text-xs font-bold text-primary">
        {addon.priceDisplay}
      </div>
    </div>
  );
}

/* ─────────────────────────── Page ───────────────────────────── */

export default function PricingPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('cast');

  const tabs: TabDef[] = [
    { key: 'cast', label: t('pricing.tabCast') },
    { key: 'you', label: t('pricing.tabPersonal') },
    { key: 'filmmaker', label: t('pricing.tabFilmmaker') },
    { key: 'studios', label: t('pricing.tabStudios') },
  ];

  const activeTiers = TIER_MAP[activeTab];

  /* Grid column class based on tier count */
  const gridCols =
    activeTiers.length <= 2
      ? 'sm:grid-cols-2'
      : activeTiers.length === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : activeTiers.length === 4
          ? 'sm:grid-cols-2 lg:grid-cols-4'
          : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-dim)] via-background to-background pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="eyebrow-text font-mono">{t('pricing.title')}</span>
          <h1 className="mt-4 font-sans text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl uppercase">
            {t('pricing.headline')}
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {t('pricing.desc')}
          </p>
        </div>
      </section>

      {/* ── Tab Bar ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tier Cards Grid ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-12 mb-16">
        <div className={`grid grid-cols-1 ${gridCols} gap-6 items-stretch`}>
          {activeTiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>
      </section>

      {/* ── Governance Note for Cast tab ── */}
      {activeTab === 'cast' && (
        <section className="mx-auto max-w-4xl px-4 sm:px-6 mb-20 text-center">
          <div className="p-6 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
            <span className="font-mono text-xs uppercase text-primary font-bold block mb-1">
              {t('pricing.governanceTitle')}
            </span>
            <p className="text-sm font-bold text-foreground">
              {t('pricing.governanceQuote')}
            </p>
            <p className="text-xs text-muted-foreground mt-2 max-w-xl mx-auto">
              {t('pricing.governanceDesc')}
            </p>
          </div>
        </section>
      )}

      {/* ── Add-Ons (For You tab only) ── */}
      {activeTab === 'you' && mythraOffers.youAddOns.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 mb-20">
          <div className="text-center mb-8">
            <span className="eyebrow-text font-mono">{t('pricing.addOns')}</span>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {t('pricing.addOnsDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mythraOffers.youAddOns.map((addon) => (
              <AddOnCard key={addon.id} addon={addon} />
            ))}
          </div>
        </section>
      )}

      {/* ── FAQ Section ── */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-24">
        <div className="text-center mb-10">
          <span className="eyebrow-text font-mono">{t('pricing.faqTitle')}</span>
        </div>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-6 sm:px-8">
          <FAQItem
            question={t('pricing.faq1q')}
            answer={t('pricing.faq1a')}
          />
          <FAQItem
            question={t('pricing.faq2q')}
            answer={t('pricing.faq2a')}
          />
          <FAQItem
            question={t('pricing.faq3q')}
            answer={t('pricing.faq3a')}
          />
          <FAQItem
            question={t('pricing.faq4q')}
            answer={t('pricing.faq4a')}
          />
          <FAQItem
            question={t('pricing.faq5q')}
            answer={t('pricing.faq5a')}
          />
        </div>
      </section>
    </main>
  );
}
