'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Film,
  Clapperboard,
  RotateCcw,
  Lock,
  ChevronDown,
  Star,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../../../components/LanguageProvider';
import { mythraOffers, type OfferTier } from '../../../lib/offers';

/* ─────────────────────────────────────────────────────────────────────────────
   RECOMMENDATION LOGIC & TYPES
───────────────────────────────────────────────────────────────────────────── */

type DoorType = 'personal' | 'cast';

interface PersonalAnswers {
  recipient: string;
  occasion: string;
  ambition: string;
}

interface CastAnswers {
  roleLevel: string;
  assetsUsed: string;
  motivation: string;
}

interface LeadForm {
  firstName: string;
  email: string;
  country: string;
  whatsapp: string;
  consent: boolean;
}

export default function MythraYouPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const doorsRef = useRef<HTMLDivElement>(null);
  const funnelRef = useRef<HTMLDivElement>(null);

  // ── Step State ──
  const [selectedDoor, setSelectedDoor] = useState<DoorType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0); // 0, 1, 2, 3 (lead capture), 4 (result)
  const [showAllOptions, setShowAllOptions] = useState(false);

  // ── Answers State ──
  const [personalAnswers, setPersonalAnswers] = useState<PersonalAnswers>({
    recipient: 'me',
    occasion: 'social',
    ambition: 'trailer',
  });

  const [castAnswers, setCastAnswers] = useState<CastAnswers>({
    roleLevel: 'speaking',
    assetsUsed: 'all',
    motivation: 'experience',
  });

  // ── Lead Capture State ──
  const [leadForm, setLeadForm] = useState<LeadForm>({
    firstName: '',
    email: '',
    country: '',
    whatsapp: '',
    consent: true,
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);

  // ── Handle Source-Specific Smart Links / Deep Linking ──
  useEffect(() => {
    const intent = searchParams.get('intent');
    const occasion = searchParams.get('occasion');
    const role = searchParams.get('role');

    if (intent === 'personal') {
      setSelectedDoor('personal');
      if (occasion === 'wedding' || occasion === 'love') {
        setPersonalAnswers((prev) => ({ ...prev, occasion: 'love' }));
      } else if (occasion === 'founder') {
        setPersonalAnswers((prev) => ({ ...prev, occasion: 'founder' }));
      }
    } else if (intent === 'cast') {
      setSelectedDoor('cast');
      if (role === 'hero') {
        setCastAnswers((prev) => ({ ...prev, roleLevel: 'hero' }));
      }
    }
  }, [searchParams]);

  // ── Scroll to Doors ──
  const handleFindMyStory = () => {
    doorsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Door Selection ──
  const handleSelectDoor = (door: DoorType) => {
    setSelectedDoor(door);
    setCurrentQuestion(0);
    setTimeout(() => {
      funnelRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // ── Reset Funnel ──
  const handleReset = () => {
    setSelectedDoor(null);
    setCurrentQuestion(0);
    setShowAllOptions(false);
    doorsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Recommendation Calculation ──
  const getPersonalRecommendation = (): {
    recommended: OfferTier;
    lower: OfferTier | null;
    higher: OfferTier | null;
    rationale: string;
    ghlTag: string;
  } => {
    const { ambition, occasion } = personalAnswers;

    if (ambition === 'moment' || occasion === 'gift') {
      return {
        recommended: mythraOffers.you.find((t) => t.id === 'you-moment') || mythraOffers.you[0],
        lower: null,
        higher: mythraOffers.you.find((t) => t.id === 'you-trailer') || null,
        rationale: 'Based on your desire for a memorable moment, a template-led cinematic scene gives you an accessible, fast-turnaround Hollywood appearance.',
        ghlTag: 'MYTHRA_YOU_MOMENT',
      };
    }

    if (ambition === 'legacy' || occasion === 'legacy') {
      return {
        recommended: mythraOffers.you.find((t) => t.id === 'you-legacy') || mythraOffers.you[3],
        lower: mythraOffers.you.find((t) => t.id === 'you-story') || null,
        higher: null,
        rationale: 'Based on your goal of family preservation and enduring heritage, an heirloom cinematic documentary with director research creates a generational treasure.',
        ghlTag: 'MYTHRA_YOU_LEGACY',
      };
    }

    if (ambition === 'story' || occasion === 'love' || occasion === 'founder') {
      return {
        recommended: mythraOffers.you.find((t) => t.id === 'you-story') || mythraOffers.you[2],
        lower: mythraOffers.you.find((t) => t.id === 'you-trailer') || null,
        higher: mythraOffers.you.find((t) => t.id === 'you-legacy') || null,
        rationale: 'Based on your deep story premise, a bespoke 3–5 minute narrative short film provides complete original worldbuilding and multi-scene character depth.',
        ghlTag: 'MYTHRA_YOU_STORY',
      };
    }

    // Default: Trailer
    return {
      recommended: mythraOffers.you.find((t) => t.id === 'you-trailer') || mythraOffers.you[1],
      lower: mythraOffers.you.find((t) => t.id === 'you-moment') || null,
      higher: mythraOffers.you.find((t) => t.id === 'you-story') || null,
      rationale: 'Based on your answers, a personalized cinematic movie trailer gives you the strongest balance of story, recognizable likeness, and blockbuster shareability.',
      ghlTag: 'MYTHRA_YOU_TRAILER',
    };
  };

  const getCastRecommendation = (): {
    recommended: OfferTier;
    lower: OfferTier | null;
    higher: OfferTier | null;
    rationale: string;
    ghlTag: string;
  } => {
    const { roleLevel } = castAnswers;

    if (roleLevel === 'hero') {
      return {
        recommended: mythraOffers.cast.find((t) => t.id === 'cast-guest-hero') || mythraOffers.cast[3],
        lower: mythraOffers.cast.find((t) => t.id === 'cast-featured-character') || null,
        higher: null,
        rationale: 'For someone who wants to inspire the narrative spine of an official episode, the Episode Guest Hero integrates your personality into central canon.',
        ghlTag: 'MYTHRA_CAST_HERO',
      };
    }

    if (roleLevel === 'featured') {
      return {
        recommended: mythraOffers.cast.find((t) => t.id === 'cast-featured-character') || mythraOffers.cast[2],
        lower: mythraOffers.cast.find((t) => t.id === 'cast-speaking-character') || null,
        higher: mythraOffers.cast.find((t) => t.id === 'cast-guest-hero') || null,
        rationale: 'A Featured Character gives you multi-scene presence, custom character design, and featured credit billing across global syndication.',
        ghlTag: 'MYTHRA_CAST_FEATURED',
      };
    }

    if (roleLevel === 'speaking') {
      return {
        recommended: mythraOffers.cast.find((t) => t.id === 'cast-speaking-character') || mythraOffers.cast[1],
        lower: mythraOffers.cast.find((t) => t.id === 'cast-fan-cameo') || null,
        higher: mythraOffers.cast.find((t) => t.id === 'cast-featured-character') || null,
        rationale: 'A Speaking Character gives you named canon identity, scripted lines, and credit status in an official MYTHRA Original with verified screen presence.',
        ghlTag: 'MYTHRA_CAST_SPEAKING',
      };
    }

    // Default: Cameo
    return {
      recommended: mythraOffers.cast.find((t) => t.id === 'cast-fan-cameo') || mythraOffers.cast[0],
      lower: null,
      higher: mythraOffers.cast.find((t) => t.id === 'cast-speaking-character') || null,
      rationale: 'A Fan Cameo provides the fastest path to permanent canon existence inside the story world with authorized face integration and end-title placement.',
      ghlTag: 'MYTHRA_CAST_CAMEO',
    };
  };

  const recData = selectedDoor === 'personal' ? getPersonalRecommendation() : getCastRecommendation();

  // ── Handle Lead Submission ──
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);

    const fullName = (leadForm.firstName || '').trim();
    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0] || 'Lead';
    const lastName = nameParts.slice(1).join(' ') || '';

    try {
      const existing = JSON.parse(localStorage.getItem('mythra_you_leads') || '[]');
      existing.push({
        id: 'lead_' + Date.now(),
        ...leadForm,
        fullName,
        door: selectedDoor,
        answers: selectedDoor === 'personal' ? personalAnswers : castAnswers,
        ghlTag: recData.ghlTag,
        recommendedOffer: recData.recommended.name,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('mythra_you_leads', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    // Capture in GoHighLevel & CRM automation
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: 'YOU',
          contact: {
            fullName,
            firstName,
            lastName,
            email: leadForm.email.trim(),
            whatsapp: leadForm.whatsapp?.trim() || undefined,
            country: leadForm.country?.trim() || undefined,
            consentMarketing: leadForm.consent,
          },
          answers: {
            door: selectedDoor,
            doorTitle: selectedDoor === 'personal' ? 'A FILM MADE FOR ME' : 'A ROLE INSIDE MYTHRA',
            ...(selectedDoor === 'personal' ? personalAnswers : castAnswers),
            recommendedOffer: recData.recommended.name,
            ghlTag: recData.ghlTag,
          },
        }),
      });
    } catch (err) {
      console.error('GHL lead capture error:', err);
    } finally {
      setIsSubmittingLead(false);
      setCurrentQuestion(4);
    }
  };

  // ── Handle Checkout Trigger for Direct Whop / Payout / Dummy Link ──
  const handleCheckoutTrigger = async (tier: any) => {
    const tierIdentifier = tier.code || tier.id || tier.name;
    try {
      setIsCheckingOut(tierIdentifier);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerCode: tier.code || tier.id || 'MYTHRA_TRAILER',
          customerEmail: leadForm.email?.trim() || undefined,
          customerName: leadForm.firstName?.trim() || undefined,
          successUrl: `${window.location.origin}/un1/you/onboarding?tier=${tier.id || tier.code || 'you-trailer'}`,
          cancelUrl: `${window.location.origin}/un1/you`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = 'https://whop.com';
      }
    } catch (err) {
      console.error('Checkout error:', err);
      window.location.href = 'https://whop.com';
    } finally {
      setIsCheckingOut(null);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* ─────────────────────────────────────────────────────────────────────────
          SECTION 1: HERO
      ───────────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-32 pb-20 px-6 sm:px-12 overflow-hidden bg-background">
        {/* Cinematic Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/un1/mythra-world.png"
            alt="MYTHRA cinematic universe"
            className="w-full h-full object-cover object-[center_40%] animate-cinema-zoom opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>

        {/* Ambient Pulsing Engine Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />

        <div className="relative z-10 max-w-4xl text-center mx-auto">
          {/* Eyebrow badge with living pulse */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/40 text-primary text-xs font-mono font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>{t('you.heroEyebrow')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground uppercase leading-[1.05] drop-shadow-2xl">
            {t('you.heroHeadline1')} <br className="hidden sm:inline" />
            {t('you.heroHeadline2')}<br />
            <span className="text-primary">{t('you.heroHeadline3')}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-normal">
            {t('you.heroSubtitle')}
          </p>

          {/* Dual CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <button
              onClick={handleFindMyStory}
              className="btn-pill-primary text-sm sm:text-base !py-3.5 !px-8 cursor-pointer shadow-lg"
            >
              <span>{t('you.heroPrimaryCta')}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <Link
              href="/un1/stories"
              className="btn-pill-secondary text-sm sm:text-base !py-3.5 !px-7 no-underline"
            >
              <span>{t('you.heroSecondaryCta')}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          SECTION 2: ONLY TWO DOORS
      ───────────────────────────────────────────────────────────────────────── */}
      <section
        ref={doorsRef}
        className="py-24 px-6 sm:px-12 bg-[var(--surface-dim)] border-y border-[var(--border-subtle)] scroll-mt-20 relative"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary font-bold block mb-3">
              {t('you.doorsEyebrow')}
            </span>
            <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
              {t('you.doorsHeadline1')}<br />
              <span className="text-primary">{t('you.doorsHeadline2')}</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
              {t('you.doorsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* DOOR 1: A FILM MADE FOR ME */}
            <div
              onClick={() => handleSelectDoor('personal')}
              className={`p-8 sm:p-12 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                selectedDoor === 'personal'
                  ? 'bg-card border-primary ring-2 ring-primary/40 shadow-2xl -translate-y-2'
                  : 'bg-card border-border hover:border-primary/60 hover:-translate-y-1 shadow-xl'
              }`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono tracking-widest px-3 py-1 rounded-full bg-secondary border border-border text-muted-foreground uppercase font-bold">
                    {t('you.door1Badge')}
                  </span>
                  <Film className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />
                </div>

                <h3 className="font-sans text-3xl sm:text-4xl font-black text-foreground mb-3">
                  {t('you.door1Title')}
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                  {t('you.door1Desc')}
                </p>
              </div>

              <div>
                <div className="mb-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">{t('pricing.startingFrom')}:</span>
                  <span className="text-primary font-bold">{t('you.door1Qual')}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDoor('personal');
                  }}
                  className="btn-pill-primary w-full text-center text-sm !py-3.5 justify-center cursor-pointer"
                >
                  <span>{t('you.door1Cta')}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* DOOR 2: A ROLE INSIDE MYTHRA */}
            <div
              onClick={() => handleSelectDoor('cast')}
              className={`p-8 sm:p-12 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                selectedDoor === 'cast'
                  ? 'bg-card border-primary ring-2 ring-primary/40 shadow-2xl -translate-y-2'
                  : 'bg-card border-border hover:border-primary/60 hover:-translate-y-1 shadow-xl'
              }`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/40 text-primary uppercase font-bold">
                    {t('you.door2Badge')}
                  </span>
                  <Clapperboard className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />
                </div>

                <h3 className="font-sans text-3xl sm:text-4xl font-black text-foreground mb-3">
                  {t('you.door2Title')}
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                  {t('you.door2Desc')}
                </p>
              </div>

              <div>
                <div className="mb-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">{t('pricing.availabilityLabel')}</span>
                  <span className="text-primary font-bold">{t('you.door2Qual')}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDoor('cast');
                  }}
                  className="btn-pill-primary w-full text-center text-sm !py-3.5 justify-center cursor-pointer"
                >
                  <span>{t('you.door2Cta')}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          SECTION 3 & 4: ADAPTIVE GUIDED-SELLING FUNNEL + LEAD CAPTURE + RESULT
      ───────────────────────────────────────────────────────────────────────── */}
      <div ref={funnelRef} className="scroll-mt-20">
        <AnimatePresence mode="wait">
          {selectedDoor && (
            <motion.section
              key={selectedDoor}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="py-24 px-6 sm:px-12 bg-background border-b border-[var(--border-subtle)]"
            >
              <div className="max-w-3xl mx-auto">
                {/* Flow Header with Back/Reset */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase font-bold text-primary">
                      {selectedDoor === 'personal' ? t('you.pathPersonal') : t('you.pathCast')}
                    </span>
                  </div>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('you.switchDoor')}</span>
                  </button>
                </div>

                {/* ── QUESTION STEP FLOW ── */}
                {currentQuestion < 3 && (
                  <div className="p-8 sm:p-12 rounded-3xl bg-card border-2 border-border shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                    {/* Step Indicator */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                          {t('you.stepIndicator', { current: String(currentQuestion + 1) })}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((idx) => (
                          <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              idx === currentQuestion
                                ? 'w-8 bg-primary'
                                : idx < currentQuestion
                                ? 'w-4 bg-primary/50'
                                : 'w-4 bg-secondary'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* ── PATH A: PERSONAL FILM QUESTIONS ── */}
                    {selectedDoor === 'personal' && (
                      <div>
                        {currentQuestion === 0 && (
                          <motion.div
                            key="p0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <h3 className="font-sans text-2xl sm:text-3xl font-black text-foreground mb-6">
                              {t('you.pQ1')}
                            </h3>
                            <div className="space-y-3">
                              {[
                                { id: 'me', label: t('you.pQ1_opt1') },
                                { id: 'love', label: t('you.pQ1_opt2') },
                                { id: 'couple', label: t('you.pQ1_opt3') },
                                { id: 'family', label: t('you.pQ1_opt4') },
                                { id: 'founder', label: t('you.pQ1_opt5') },
                              ].map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    setPersonalAnswers({ ...personalAnswers, recipient: opt.id });
                                    setCurrentQuestion(1);
                                  }}
                                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                                    personalAnswers.recipient === opt.id
                                      ? 'border-primary bg-primary/10 font-bold text-foreground'
                                      : 'border-border bg-secondary hover:border-primary/50 text-foreground'
                                  }`}
                                >
                                  <span className="text-sm sm:text-base font-semibold">{opt.label}</span>
                                  <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {currentQuestion === 1 && (
                          <motion.div
                            key="p1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <h3 className="font-sans text-2xl sm:text-3xl font-black text-foreground mb-6">
                              {t('you.pQ2')}
                            </h3>
                            <div className="space-y-3">
                              {[
                                { id: 'gift', label: t('you.pQ2_opt1') },
                                { id: 'social', label: t('you.pQ2_opt2') },
                                { id: 'love', label: t('you.pQ2_opt3') },
                                { id: 'founder', label: t('you.pQ2_opt4') },
                                { id: 'legacy', label: t('you.pQ2_opt5') },
                              ].map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    setPersonalAnswers({ ...personalAnswers, occasion: opt.id });
                                    setCurrentQuestion(2);
                                  }}
                                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                                    personalAnswers.occasion === opt.id
                                      ? 'border-primary bg-primary/10 font-bold text-foreground'
                                      : 'border-border bg-secondary hover:border-primary/50 text-foreground'
                                  }`}
                                >
                                  <span className="text-sm sm:text-base font-semibold">{opt.label}</span>
                                  <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {currentQuestion === 2 && (
                          <motion.div
                            key="p2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <h3 className="font-sans text-2xl sm:text-3xl font-black text-foreground mb-6">
                              {t('you.pQ3')}
                            </h3>
                            <div className="space-y-3">
                              {[
                                { id: 'moment', text: t('you.pQ3_opt1'), sub: t('you.pQ3_opt1_sub') },
                                { id: 'trailer', text: t('you.pQ3_opt2'), sub: t('you.pQ3_opt2_sub') },
                                { id: 'story', text: t('you.pQ3_opt3'), sub: t('you.pQ3_opt3_sub') },
                                { id: 'legacy', text: t('you.pQ3_opt4'), sub: t('you.pQ3_opt4_sub') },
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    setPersonalAnswers({ ...personalAnswers, ambition: item.id });
                                    setCurrentQuestion(3); // To lead capture
                                  }}
                                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                                    personalAnswers.ambition === item.id
                                      ? 'border-primary bg-primary/10 font-bold text-foreground'
                                      : 'border-border bg-secondary hover:border-primary/50 text-foreground'
                                  }`}
                                >
                                  <div>
                                    <span className="text-sm sm:text-base font-semibold block">{item.text}</span>
                                    <span className="text-xs text-muted-foreground">{item.sub}</span>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* ── PATH B: OFFICIAL CAST QUESTIONS ── */}
                    {selectedDoor === 'cast' && (
                      <div>
                        {currentQuestion === 0 && (
                          <motion.div
                            key="c0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <h3 className="font-sans text-2xl sm:text-3xl font-black text-foreground mb-6">
                              {t('you.cQ1')}
                            </h3>
                            <div className="space-y-3">
                              {[
                                { id: 'cameo', text: t('you.cQ1_opt1'), sub: t('you.cQ1_opt1_sub') },
                                { id: 'speaking', text: t('you.cQ1_opt2'), sub: t('you.cQ1_opt2_sub') },
                                { id: 'featured', text: t('you.cQ1_opt3'), sub: t('you.cQ1_opt3_sub') },
                                { id: 'hero', text: t('you.cQ1_opt4'), sub: t('you.cQ1_opt4_sub') },
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    setCastAnswers({ ...castAnswers, roleLevel: item.id });
                                    setCurrentQuestion(1);
                                  }}
                                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                                    castAnswers.roleLevel === item.id
                                      ? 'border-primary bg-primary/10 font-bold text-foreground'
                                      : 'border-border bg-secondary hover:border-primary/50 text-foreground'
                                  }`}
                                >
                                  <div>
                                    <span className="text-sm sm:text-base font-semibold block">{item.text}</span>
                                    <span className="text-xs text-muted-foreground">{item.sub}</span>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {currentQuestion === 1 && (
                          <motion.div
                            key="c1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <h3 className="font-sans text-2xl sm:text-3xl font-black text-foreground mb-6">
                              {t('you.cQ2')}
                            </h3>
                            <div className="space-y-3">
                              {[
                                { id: 'face', label: t('you.cQ2_opt1') },
                                { id: 'titles', label: t('you.cQ2_opt2') },
                                { id: 'voice', label: t('you.cQ2_opt3') },
                                { id: 'traits', label: t('you.cQ2_opt4') },
                                { id: 'all', label: t('you.cQ2_opt5') },
                              ].map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    setCastAnswers({ ...castAnswers, assetsUsed: opt.id });
                                    setCurrentQuestion(2);
                                  }}
                                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                                    castAnswers.assetsUsed === opt.id
                                      ? 'border-primary bg-primary/10 font-bold text-foreground'
                                      : 'border-border bg-secondary hover:border-primary/50 text-foreground'
                                  }`}
                                >
                                  <span className="text-sm sm:text-base font-semibold">{opt.label}</span>
                                  <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {currentQuestion === 2 && (
                          <motion.div
                            key="c2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <h3 className="font-sans text-2xl sm:text-3xl font-black text-foreground mb-6">
                              {t('you.cQ3')}
                            </h3>
                            <div className="space-y-3">
                              {[
                                { id: 'fan', label: t('you.cQ3_opt1') },
                                { id: 'creator', label: t('you.cQ3_opt2') },
                                { id: 'experience', label: t('you.cQ3_opt3') },
                                { id: 'identity', label: t('you.cQ3_opt4') },
                                { id: 'surprise', label: t('you.cQ3_opt5') },
                              ].map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    setCastAnswers({ ...castAnswers, motivation: opt.id });
                                    setCurrentQuestion(3); // To lead capture
                                  }}
                                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                                    castAnswers.motivation === opt.id
                                      ? 'border-primary bg-primary/10 font-bold text-foreground'
                                      : 'border-border bg-secondary hover:border-primary/50 text-foreground'
                                  }`}
                                >
                                  <span className="text-sm sm:text-base font-semibold">{opt.label}</span>
                                  <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 4: LEAD CAPTURE BEFORE FULL RECOMMENDATION ── */}
                {currentQuestion === 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 sm:p-12 rounded-3xl bg-card border-2 border-primary ring-2 ring-primary/40 shadow-2xl relative"
                  >
                    <div className="text-center mb-8">
                      <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block mb-2">
                        {t('you.leadSynthesis')}
                      </span>
                      <h3 className="font-sans text-3xl sm:text-4xl font-black text-foreground uppercase">
                        {t('you.leadReady')}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                        {t('you.leadSubtitle')}
                      </p>
                    </div>

                    <form onSubmit={handleLeadSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            {t('you.firstName')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={leadForm.firstName}
                            onChange={(e) => setLeadForm({ ...leadForm, firstName: e.target.value })}
                            placeholder="Your name"
                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            {t('you.emailAddress')} *
                          </label>
                          <input
                            type="email"
                            required
                            value={leadForm.email}
                            onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            {t('you.country')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={leadForm.country}
                            onChange={(e) => setLeadForm({ ...leadForm, country: e.target.value })}
                            placeholder="United States, UK, Spain..."
                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            {t('you.whatsapp')}
                          </label>
                          <input
                            type="tel"
                            value={leadForm.whatsapp}
                            onChange={(e) => setLeadForm({ ...leadForm, whatsapp: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-muted-foreground">
                          <input
                            type="checkbox"
                            required
                            checked={leadForm.consent}
                            onChange={(e) => setLeadForm({ ...leadForm, consent: e.target.checked })}
                            className="mt-0.5 accent-[#d8ff44] rounded"
                          />
                          <span>
                            {t('you.consentText')}
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="btn-pill-primary w-full text-center text-sm !py-4 justify-center cursor-pointer shadow-xl mt-4 disabled:opacity-60"
                      >
                        {isSubmittingLead ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Confirming Submission...</span>
                          </div>
                        ) : (
                          <>
                            <span>{t('you.showPathCta')}</span>
                            <ArrowRight className="w-4 h-4 stroke-[3]" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* ── STEP 5: THE SINGLE RECOMMENDED RESULT ── */}
                {currentQuestion === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-12"
                  >
                    {/* Thank You & 24h Action Alert */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-primary/10 border-2 border-primary/50 text-foreground shadow-2xl">
                      <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-wider mb-2 font-mono">
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                        <span>INQUIRY SUBMITTED · THANK YOU, {leadForm.fullName || 'CREATOR'}!</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground leading-relaxed">
                        Your project brief has been registered with the MYTHRA narrative leads.
                      </p>
                      <div className="mt-3 p-4 bg-background/80 rounded-2xl border border-primary/40">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          <strong className="text-primary font-mono uppercase tracking-wide">Action Required:</strong> We have dispatched an instant confirmation email to <strong className="text-foreground">{leadForm.email}</strong>. <strong className="text-foreground">Please reply to that email within 24 hours</strong> with any notes or asset links to confirm your brief and secure your production slate.
                        </p>
                      </div>
                    </div>

                    {/* The Primary Recommended Card */}
                    <div className="p-8 sm:p-12 rounded-3xl bg-card border-2 border-primary ring-2 ring-primary/40 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-primary text-primary-foreground font-black">
                          {selectedDoor === 'personal' ? t('you.recExperience') : t('you.recRole')}
                        </span>
                        <Star className="w-5 h-5 text-primary fill-primary" />
                      </div>

                      <h3 className="font-sans text-3xl sm:text-5xl font-black text-foreground uppercase mt-2">
                        {recData.recommended.name}
                      </h3>

                      <div className="font-sans text-3xl sm:text-4xl font-black text-primary mt-2">
                        {recData.recommended.priceDisplay}
                      </div>

                      {/* Rationale */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-secondary border border-border my-6 text-sm text-[var(--text-secondary)] leading-relaxed">
                        <strong className="text-foreground block mb-1">{t('you.whyFits')}</strong>
                        {recData.rationale}
                      </div>

                      {/* Features */}
                      <div className="space-y-2.5 mb-8">
                        {recData.recommended.features.slice(0, 5).map((f, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-border">
                        <button
                          type="button"
                          disabled={isCheckingOut !== null}
                          onClick={() => handleCheckoutTrigger(recData.recommended)}
                          className="btn-pill-primary w-full sm:w-auto flex-1 text-center justify-center text-sm !py-3.5 cursor-pointer disabled:opacity-60"
                        >
                          {isCheckingOut === (recData.recommended.code || recData.recommended.id || recData.recommended.name) ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Opening Checkout...</span>
                            </div>
                          ) : (
                            <>
                              <span>{recData.recommended.ctaText}</span>
                              <ArrowRight className="w-4 h-4 stroke-[3]" />
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowAllOptions(!showAllOptions)}
                          className="btn-pill-secondary w-full sm:w-auto text-xs !py-3.5 justify-center cursor-pointer"
                        >
                          <span>{showAllOptions ? t('you.hideAlternatives') : t('you.compareOptions')}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${showAllOptions ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* ── Lower & Higher Alternatives (Progressive Disclosure) ── */}
                    {showAllOptions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 pt-2"
                      >
                        <h4 className="font-sans text-xl font-black text-foreground uppercase text-center">
                          {t('you.adjacentAlternatives')}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {recData.lower && (
                            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between">
                              <div>
                                <span className="font-mono text-[10px] uppercase text-muted-foreground font-bold block mb-1">
                                  {t('you.lowerAlt')}
                                </span>
                                <h5 className="font-sans text-xl font-black text-foreground mb-1">
                                  {recData.lower.name}
                                </h5>
                                <div className="font-sans text-2xl font-black text-primary mb-3">
                                  {recData.lower.priceDisplay}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                                  {recData.lower.description}
                                </p>
                              </div>
                              <button
                                type="button"
                                disabled={isCheckingOut !== null}
                                onClick={() => handleCheckoutTrigger(recData.lower)}
                                className="btn-pill-secondary w-full text-center text-xs justify-center cursor-pointer disabled:opacity-60"
                              >
                                {isCheckingOut === (recData.lower.code || recData.lower.id || recData.lower.name) ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Opening Checkout...</span>
                                  </div>
                                ) : (
                                  <span>{t('you.selectTier', { tier: recData.lower.name })}</span>
                                )}
                              </button>
                            </div>
                          )}

                          {recData.higher && (
                            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between">
                              <div>
                                <span className="font-mono text-[10px] uppercase text-muted-foreground font-bold block mb-1">
                                  {t('you.higherAlt')}
                                </span>
                                <h5 className="font-sans text-xl font-black text-foreground mb-1">
                                  {recData.higher.name}
                                </h5>
                                <div className="font-sans text-2xl font-black text-primary mb-3">
                                  {recData.higher.priceDisplay}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                                  {recData.higher.description}
                                </p>
                              </div>
                              <button
                                type="button"
                                disabled={isCheckingOut !== null}
                                onClick={() => handleCheckoutTrigger(recData.higher)}
                                className="btn-pill-secondary w-full text-center text-xs justify-center cursor-pointer disabled:opacity-60"
                              >
                                {isCheckingOut === (recData.higher.code || recData.higher.id || recData.higher.name) ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Opening Checkout...</span>
                                  </div>
                                ) : (
                                  <span>{t('you.selectTier', { tier: recData.higher.name })}</span>
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="text-center pt-4">
                          <Link
                            href="/un1/you/packages"
                            className="text-xs text-primary font-mono hover:underline inline-flex items-center gap-1.5"
                          >
                            <span>{t('you.browseAllCatalog')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
          SECTION 5: ESSENTIAL TRUST CONTENT ONLY
          1) 3-Step Process
          2) One Trust Strip
          3) Only Three FAQs
      ───────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 bg-background">
        <div className="max-w-5xl mx-auto">
          {/* Part A: 3-Step Process */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="eyebrow-text font-mono block mb-2">{t('you.stepJourney')}</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-foreground uppercase">
              {t('you.stepHeadline')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
            <div className="p-8 rounded-2xl bg-card border border-border">
              <span className="font-mono text-xs text-primary font-bold block mb-4 px-2.5 py-1 bg-primary/10 rounded-full border border-primary/40 w-fit">
                01
              </span>
              <h3 className="font-sans text-xl font-black text-foreground mb-2">
                {t('you.step1Title')}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('you.step1Desc')}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border">
              <span className="font-mono text-xs text-primary font-bold block mb-4 px-2.5 py-1 bg-primary/10 rounded-full border border-primary/40 w-fit">
                02
              </span>
              <h3 className="font-sans text-xl font-black text-foreground mb-2">
                {t('you.step2Title')}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('you.step2Desc')}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border">
              <span className="font-mono text-xs text-primary font-bold block mb-4 px-2.5 py-1 bg-primary/10 rounded-full border border-primary/40 w-fit">
                03
              </span>
              <h3 className="font-sans text-xl font-black text-foreground mb-2">
                {t('you.step3Title')}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('you.step3Desc')}
              </p>
            </div>
          </div>

          {/* Part B: Single Trust Strip */}
          <div className="p-6 rounded-2xl bg-secondary border border-border mb-20 text-center flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-foreground font-semibold">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>{t('you.trustUploads')}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>{t('you.trustConsent')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>{t('you.trustNoTraining')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{t('you.trustDeletion')}</span>
            </div>
          </div>

          {/* Part C: Only 3 Essential FAQs */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="eyebrow-text font-mono block mb-2">{t('you.faqClarity')}</span>
              <h3 className="font-sans text-2xl sm:text-3xl font-black text-foreground uppercase">
                {t('you.faqTitle')}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <strong className="block text-base text-foreground font-bold mb-2">
                  {t('you.faq1q')}
                </strong>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t('you.faq1a')}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <strong className="block text-base text-foreground font-bold mb-2">
                  {t('you.faq2q')}
                </strong>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t('you.faq2a')}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <strong className="block text-base text-foreground font-bold mb-2">
                  {t('you.faq3q')}
                </strong>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t('you.faq3a')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
