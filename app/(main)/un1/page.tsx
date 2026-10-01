'use client';

import React from 'react';
import Link from 'next/link';
import CinematicHero from '@/components/CinematicHero';
import ProofMetric from '@/components/ProofMetric';
import PathSelector from '@/components/PathSelector';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function HomePage() {
  const { t } = useLanguage();

  const modelSteps = [
    { num: '01', title: t('engine.s1.title'), desc: t('engine.s1.desc') },
    { num: '02', title: t('engine.s2.title'), desc: t('engine.s2.desc') },
    { num: '03', title: t('engine.s3.title'), desc: t('engine.s3.desc') },
    { num: '04', title: t('engine.s4.title'), desc: t('engine.s4.desc') },
    { num: '05', title: t('engine.s5.title'), desc: t('engine.s5.desc') },
    { num: '06', title: t('engine.s6.title'), desc: t('engine.s6.desc') },
  ];

  return (
    <div>
      {/* SCREEN 1: Master Hero with GitHub Repo Image */}
      <CinematicHero
        backgroundImage="/un1/mythra-world.png"
        eyebrow={t('hero.eyebrow')}
        headline={
          <>
            {t('hero.headline1')}<br />
            {t('hero.headline2')}<br />
            <span className="text-primary">{t('hero.headline3')}</span>
          </>
        }
        lead={t('hero.lead')}
        support={t('hero.support')}
        primaryCtaText={t('hero.primaryCta')}
        primaryCtaHref="#paths"
        secondaryCtaText={t('hero.secondaryCta')}
        secondaryCtaHref="/un1/genesis"
      />

      {/* SCREEN 2: Verified Proof Teaser */}
      <ProofMetric />

      {/* Case Study Deep Link Banner */}
      <div className="bg-[var(--surface-dim)] border-b border-[var(--border-subtle)] py-8 px-6 sm:px-12 text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <span className="eyebrow-text block mb-1 text-primary font-bold">
              {t('proof.eyebrow')}
            </span>
            <p className="text-base font-bold text-[var(--text-primary)]">
              {t('proof.headline')}
            </p>
          </div>
          <a
            href="/un1/genesis"
            className="btn-pill-primary text-xs !py-3 !px-6 shrink-0"
          >
            <span>{t('proof.cta')}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </a>
        </div>
      </div>

      {/* SCREEN 3: Three Commercial Doors with Screenshot-Style Pill Buttons */}
      <PathSelector />

      {/* SCREEN 4: The Model — Story Engine */}
      <section className="py-24 px-6 sm:px-12 bg-background border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="eyebrow-text text-xs text-primary">
                {t('engine.eyebrow')}
              </span>
            </div>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[var(--text-primary)] uppercase">
              {t('engine.headline')}
            </h2>
            <p className="mt-6 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('engine.desc')}
            </p>
          </div>

          {/* Model Flow Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {modelSteps.map((step) => (
              <div
                key={step.num}
                className="p-8 bg-[var(--surface-elevated)] border-2 border-[var(--border-subtle)] hover:border-primary rounded-2xl transition-all shadow-lg relative group"
              >
                <span className="font-mono text-xs text-primary font-bold block mb-4 px-2.5 py-1 bg-primary/10 rounded-full border border-primary/40 w-fit">
                  {t('engine.stage')} {step.num}
                </span>
                <h3 className="font-sans text-2xl font-black text-[var(--text-primary)] mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-8 sm:p-10 bg-[var(--surface-elevated)] border-2 border-primary/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <h4 className="font-sans text-2xl font-black text-[var(--text-primary)] mb-1">
                {t('engine.methodHeadline')}
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">
                {t('engine.methodDesc')}
              </p>
            </div>
            <a
              href="/un1/method"
              className="btn-pill-primary text-xs !py-3 !px-6 shrink-0"
            >
              <span>{t('engine.methodCta')}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </a>
          </div>
        </div>
      </section>

      {/* SCREEN 5: Final CTA */}
      <section className="py-24 px-6 sm:px-12 bg-background border-t border-[var(--border-subtle)] text-center">
        <div className="max-w-4xl mx-auto">
          <span className="eyebrow-text block mb-4 text-primary">
            {t('cta.eyebrow')}
          </span>
          <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[var(--text-primary)] uppercase leading-tight">
            {t('cta.headline')}
          </h2>
          <p className="mt-6 text-base text-[var(--text-secondary)] max-w-xl mx-auto mb-12">
            {t('cta.desc')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a
              href="/un1/you/start?tier=you-trailer"
              className="p-8 bg-[var(--surface-elevated)] border-2 border-[var(--border-subtle)] hover:border-primary rounded-2xl transition-all group text-left shadow-xl hover:-translate-y-1 no-underline"
            >
              <span className="text-[10px] font-mono uppercase text-primary block mb-1 font-bold">
                {t('cta.forYou')}
              </span>
              <strong className="font-sans text-xl font-black text-[var(--text-primary)] block group-hover:text-primary">
                {t('cta.createMyFilm')}
              </strong>
              <span className="text-xs text-[var(--text-secondary)] block mt-2">
                {t('cta.trailerFrom')}
              </span>
            </a>

            <a
              href="/un1/filmmaker/start?tier=film-cohort"
              className="p-8 bg-[var(--surface-elevated)] border-2 border-primary rounded-2xl transition-all group text-left shadow-2xl ring-1 ring-primary hover:-translate-y-1 no-underline"
            >
              <span className="text-[10px] font-mono uppercase text-primary block mb-1 font-bold">
                {t('cta.forCreators')}
              </span>
              <strong className="font-sans text-xl font-black text-[var(--text-primary)] block group-hover:text-primary">
                {t('cta.joinFilmmaker')}
              </strong>
              <span className="text-xs text-[var(--text-secondary)] block mt-2">
                {t('cta.cohortFrom')}
              </span>
            </a>

            <a
              href="/un1/studios/start"
              className="p-8 bg-[var(--surface-elevated)] border-2 border-[var(--border-subtle)] hover:border-foreground rounded-2xl transition-all group text-left shadow-xl hover:-translate-y-1 no-underline"
            >
              <span className="text-[10px] font-mono uppercase text-primary block mb-1 font-bold">
                {t('cta.forBrands')}
              </span>
              <strong className="font-sans text-xl font-black text-[var(--text-primary)] block group-hover:text-foreground">
                {t('cta.startStudioBrief')}
              </strong>
              <span className="text-xs text-[var(--text-secondary)] block mt-2">
                {t('cta.pilotsFrom')}
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
