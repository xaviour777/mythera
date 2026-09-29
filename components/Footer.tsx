'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Clapperboard } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear().toString();

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-background pt-16 pb-12 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
        {/* Brand column */}
        <div className="md:col-span-2 space-y-4">
          <a href="/un1" className="font-serif text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
            MYTHRA
          </a>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            {t('footer.brandDesc')}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>{t('footer.zeroTraining')}</span>
          </div>
        </div>

        {/* Path 1: For You */}
        <div className="space-y-3">
          <span className="film-credit block text-primary">{t('footer.mythraYou')}</span>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><a href="/un1/you" className="hover:text-primary transition-colors">{t('footer.personalizedCinema')}</a></li>
            <li><a href="/un1/cast" className="hover:text-primary transition-colors font-bold text-foreground flex items-center gap-1.5"><Clapperboard className="w-3 h-3 text-primary" /> MYTHRA CAST (Official)</a></li>
            <li><a href="/un1/you/start?tier=you-trailer" className="hover:text-primary transition-colors">{t('footer.createTrailer')}</a></li>
            <li><a href="/un1/you/start?tier=you-moment" className="hover:text-primary transition-colors">{t('footer.mythaMoment')}</a></li>
            <li><a href="/un1/you/start?tier=you-story" className="hover:text-primary transition-colors">{t('footer.bespokeShortFilm')}</a></li>
            <li><a href="/un1/legal/likeness-consent" className="hover:text-primary transition-colors">{t('footer.likenessConsent')}</a></li>
          </ul>
        </div>

        {/* Path 2: Filmmaker */}
        <div className="space-y-3">
          <span className="film-credit block text-primary">{t('footer.mythraFilmmaker')}</span>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><a href="/un1/filmmaker" className="hover:text-primary transition-colors">{t('footer.onePersonStudio')}</a></li>
            <li><a href="/un1/filmmaker/start?tier=film-cohort" className="hover:text-primary transition-colors">{t('footer.liveChort')}</a></li>
            <li><a href="/un1/filmmaker/start?tier=film-blueprint" className="hover:text-primary transition-colors">{t('footer.freeBlueprint')}</a></li>
            <li><a href="/un1/filmmaker/start?tier=film-starter" className="hover:text-primary transition-colors">{t('footer.selfPacedStarter')}</a></li>
            <li><a href="/un1/method" className="hover:text-primary transition-colors">{t('footer.dramaMethod')}</a></li>
          </ul>
        </div>

        {/* Path 3: Studios & Governance */}
        <div className="space-y-3">
          <span className="film-credit block text-primary">{t('footer.studiosGovernance')}</span>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><a href="/un1/studios" className="hover:text-primary transition-colors">{t('footer.brandedDrama')}</a></li>
            <li><a href="/un1/genesis" className="hover:text-primary transition-colors">{t('footer.genesisCaseStudy')}</a></li>
            <li><a href="/un1/stories" className="hover:text-primary transition-colors">{t('footer.portfolio')}</a></li>
            <li><a href="/un1/pricing" className="hover:text-primary transition-colors">{t('nav.pricing')}</a></li>
            <li><a href="/un1/legal/privacy" className="hover:text-primary transition-colors">{t('footer.privacy')}</a></li>
            <li><a href="/un1/legal/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright & admin portal trigger */}
      <div className="max-w-7xl mx-auto border-t border-[var(--border-subtle)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-muted)]">
        <div>
          {t('footer.copyright', { year: currentYear })}
        </div>
        <div className="flex items-center gap-6">
          <a href="/un1/legal/privacy" className="hover:text-primary transition-colors">{t('footer.privacyPolicy')}</a>
          <a href="/un1/legal/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</a>
          <a href="/admin/funnel-test" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
            <ShieldCheck className="w-3 h-3 text-primary" /> {t('footer.adminSuite')}
          </a>
        </div>
      </div>
    </footer>
  );
}
