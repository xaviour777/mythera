'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, UserCheck, Film, Building2, HelpCircle, X, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from './LanguageProvider';

export default function PathSelector() {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{ path: string; name: string; desc: string; href: string } | null>(null);

  const handleDoorClick = (doorName: string, path: string) => {
    trackEvent('path_selected', {
      persona: doorName === 'YOU' ? 'YOU' : doorName === 'FILMMAKER' ? 'FILMMAKER' : 'STUDIOS',
      source: 'homepage_doors',
    });
  };

  const handleQuizAnswer = (questionKey: string, optionValue: string) => {
    const updated = { ...quizAnswers, [questionKey]: optionValue };
    setQuizAnswers(updated);

    if (quizStep < 2) {
      setQuizStep(quizStep + 1);
    } else {
      // Router outcome
      let result = {
        path: 'MYTHRA YOU',
        name: 'Personalized Film starring you or someone you know',
        desc: t('paths.youDesc'),
        href: '/un1/you',
      };

      if (updated.objective === 'learn_system' || updated.role === 'creator') {
        result = {
          path: 'MYTHRA FILMMAKER',
          name: 'The One-Person Studio System & Cohort',
          desc: t('paths.filmmakerDesc'),
          href: '/un1/filmmaker',
        };
      } else if (updated.objective === 'commission_studio' || updated.role === 'brand_or_ip') {
        result = {
          path: 'MYTHRA STUDIOS',
          name: 'B2B Production, Branded Drama & Co-Production',
          desc: t('paths.studiosDesc'),
          href: '/un1/studios',
        };
      }
      setQuizResult(result);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setQuizResult(null);
  };

  return (
    <section id="paths" className="py-24 px-6 sm:px-12 bg-background border-t border-[var(--border-subtle)] scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-[2px] bg-primary" />
              <span className="eyebrow-text text-xs text-primary">
                {t('paths.eyebrow')}
              </span>
            </div>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-[-0.03em] text-[var(--text-primary)] uppercase">
              {t('paths.headline')}
            </h2>
          </div>
          <button
            onClick={() => {
              resetQuiz();
              setModalOpen(true);
            }}
            className="btn-pill-secondary text-xs !py-3 !px-5 self-start md:self-auto"
          >
            <HelpCircle className="w-4 h-4 text-primary" />
            <span>{t('paths.helpChoose')}</span>
          </button>
        </div>

        {/* The 3 Doors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Door 1: MYTHRA YOU */}
          <div className="group relative flex flex-col justify-between p-8 sm:p-10 bg-[var(--surface-elevated)] border-2 border-[var(--border-subtle)] hover:border-primary rounded-2xl transition-all duration-300 hover:translate-y-[-4px] shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-primary font-bold px-2.5 py-1 bg-primary/10 rounded-full border border-primary/40">
                  {t('paths.door01')}
                </span>
                <UserCheck className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-primary transition-colors" />
              </div>
              <span className="text-[11px] font-mono tracking-widest block mb-2 text-[var(--text-secondary)] uppercase font-bold">
                {t('paths.youSubtitle')}
              </span>
              <h3 className="font-sans text-3xl font-black text-[var(--text-primary)] mb-3">
                {t('paths.youTitle')}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t('paths.youDesc')}
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-[var(--border-subtle)]">
              <a
                href="/un1/you"
                onClick={() => handleDoorClick('YOU', '/un1/you')}
                className="btn-pill-primary w-full text-center text-sm no-underline"
              >
                <span>{t('paths.youCta')}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>
          </div>

          {/* Door 2: MYTHRA FILMMAKER */}
          <div className="group relative flex flex-col justify-between p-8 sm:p-10 bg-[var(--surface-elevated)] border-2 border-primary rounded-2xl transition-all duration-300 hover:translate-y-[-4px] shadow-2xl overflow-hidden ring-2 ring-primary/40">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-black px-4 py-1 rounded-full shadow-lg">
              {t('paths.featured')}
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-primary font-bold px-2.5 py-1 bg-primary/10 rounded-full border border-primary/40">
                  {t('paths.door02')}
                </span>
                <Film className="w-6 h-6 text-primary" />
              </div>
              <span className="text-[11px] font-mono tracking-widest block mb-2 text-[var(--text-secondary)] uppercase font-bold">
                {t('paths.filmmakerSubtitle')}
              </span>
              <h3 className="font-sans text-3xl font-black text-[var(--text-primary)] mb-3">
                {t('paths.filmmakerTitle')}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t('paths.filmmakerDesc')}
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-[var(--border-subtle)]">
              <a
                href="/un1/filmmaker"
                onClick={() => handleDoorClick('FILMMAKER', '/un1/filmmaker')}
                className="btn-pill-primary w-full text-center text-sm no-underline"
              >
                <span>{t('paths.filmmakerCta')}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>
          </div>

          {/* Door 3: MYTHRA STUDIOS */}
          <div className="group relative flex flex-col justify-between p-8 sm:p-10 bg-[var(--surface-elevated)] border-2 border-[var(--border-subtle)] hover:border-foreground/50 rounded-2xl transition-all duration-300 hover:translate-y-[-4px] shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-foreground/5 rounded-full blur-3xl pointer-events-none group-hover:bg-foreground/10 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-primary font-bold px-2.5 py-1 bg-primary/10 rounded-full border border-primary/40">
                  {t('paths.door03')}
                </span>
                <Building2 className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-foreground transition-colors" />
              </div>
              <span className="text-[11px] font-mono tracking-widest block mb-2 text-[var(--text-secondary)] uppercase font-bold">
                {t('paths.studiosSubtitle')}
              </span>
              <h3 className="font-sans text-3xl font-black text-[var(--text-primary)] mb-3">
                {t('paths.studiosTitle')}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t('paths.studiosDesc')}
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-[var(--border-subtle)]">
              <a
                href="/un1/studios"
                onClick={() => handleDoorClick('STUDIOS', '/un1/studios')}
                className="btn-pill-white w-full text-center text-sm no-underline"
              >
                <span>{t('paths.studiosCta')}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 3-Question "Help Me Choose" Modal with Pill Buttons */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-card border-2 border-primary/40 rounded-2xl p-6 sm:p-8 text-foreground shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-1 rounded-full bg-secondary"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!quizResult ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[11px] uppercase font-mono tracking-widest text-primary font-bold">
                    {t('quiz.question')} {quizStep + 1} {t('quiz.of')} 3
                  </span>
                </div>

                {quizStep === 0 && (
                  <div>
                    <h3 className="font-sans text-2xl font-black mb-6">
                      {t('quiz.q1')}
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'star_in_film', text: t('quiz.q1a1') },
                        { key: 'learn_system', text: t('quiz.q1a2') },
                        { key: 'commission_studio', text: t('quiz.q1a3') },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleQuizAnswer('objective', opt.key)}
                          className="w-full text-left p-4 rounded-xl bg-secondary hover:bg-secondary/80 border-2 border-[var(--border-subtle)] hover:border-primary text-sm font-semibold text-foreground transition-all flex items-center justify-between"
                        >
                          <span>{opt.text}</span>
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 1 && (
                  <div>
                    <h3 className="font-sans text-2xl font-black mb-6">
                      {t('quiz.q2')}
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'individual', text: t('quiz.q2a1') },
                        { key: 'creator', text: t('quiz.q2a2') },
                        { key: 'brand_or_ip', text: t('quiz.q2a3') },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleQuizAnswer('role', opt.key)}
                          className="w-full text-left p-4 rounded-xl bg-secondary hover:bg-secondary/80 border-2 border-[var(--border-subtle)] hover:border-primary text-sm font-semibold text-foreground transition-all flex items-center justify-between"
                        >
                          <span>{opt.text}</span>
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 2 && (
                  <div>
                    <h3 className="font-sans text-2xl font-black mb-6">
                      {t('quiz.q3')}
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'personal_budget', text: t('quiz.q3a1') },
                        { key: 'education_budget', text: t('quiz.q3a2') },
                        { key: 'commercial_budget', text: t('quiz.q3a3') },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleQuizAnswer('budget', opt.key)}
                          className="w-full text-left p-4 rounded-xl bg-secondary hover:bg-secondary/80 border-2 border-[var(--border-subtle)] hover:border-primary text-sm font-semibold text-foreground transition-all flex items-center justify-between"
                        >
                          <span>{opt.text}</span>
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-primary text-xs uppercase font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4" /> {t('quiz.recommended')}
                </div>
                <h3 className="font-sans text-3xl font-black text-foreground mb-2">
                  {quizResult.path}
                </h3>
                <p className="text-sm text-foreground font-semibold mb-3">
                  {quizResult.name}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  {quizResult.desc}
                </p>
                <div className="flex gap-3">
                  <a
                    href={quizResult.href}
                    onClick={() => setModalOpen(false)}
                    className="btn-pill-primary flex-1 text-center justify-center text-xs no-underline"
                  >
                    Enter {quizResult.path} &rarr;
                  </a>
                  <button
                    onClick={resetQuiz}
                    className="px-4 py-2 rounded-full border border-border text-xs text-muted-foreground hover:text-foreground"
                  >
                    {t('quiz.reset')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
