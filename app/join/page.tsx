'use client';

import React, { useState } from 'react';
import CinematicHero from '../../components/CinematicHero';
import SingleChoiceStep from '../../components/funnels/SingleChoiceStep';
import ContactStep from '../../components/funnels/ContactStep';
import { LeadContact, evaluateLead } from '../../lib/lead-scoring';
import { trackEvent } from '../../lib/analytics';
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, TestTube, Globe2 } from 'lucide-react';

// Corporate & enterprise brand funnel: short qualifier that books an executive
// briefing call (no checkout) and feeds the existing STUDIOS lead pipeline.
const TOTAL_STEPS = 4;

interface JoinAnswers {
  branch: string;
  segment: string;
  objective: string;
  budget: string;
  timeline: string;
  isDecisionMaker: boolean;
}

const PHASES = [
  {
    icon: Compass,
    label: 'PHASE 01 · FIND THE STORY',
    title: 'Story Opportunity Sprint',
    desc: 'Before producing anything, discover which story your audience may actually care about. A strategic decision product, not a production package.',
  },
  {
    icon: TestTube,
    label: 'PHASE 02 · PROVE THE STORY',
    title: 'Audience Proof Pilot',
    desc: 'You are not buying 45–90 seconds; you are buying evidence. A professionally managed test and a clear scale, revise, or stop decision.',
  },
  {
    icon: Globe2,
    label: 'PHASE 03 · SCALE THE STORY',
    title: 'Story World Partnership',
    desc: 'Series and owned entertainment properties, custom-scoped only after the story has earned it with real audience signal.',
  },
];

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<JoinAnswers>({
    branch: 'brand',
    segment: '',
    objective: '',
    budget: '',
    timeline: '',
    isDecisionMaker: false,
  });
  const [contact, setContact] = useState<LeadContact>({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    country: 'United States',
    organization: '',
    role: '',
    website: '',
    message: '',
    consentMarketing: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const updateAnswer = <K extends keyof JoinAnswers>(key: K, val: JoinAnswers[K]) => setAnswers((prev) => ({ ...prev, [key]: val }));
  const nextStep = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    const evaluated = evaluateLead('STUDIOS', { ...answers }, contact);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: 'STUDIOS',
          answers: {
            ...answers,
            door: 'corporate',
            funnel: 'join-corporate',
            recommendedOffer: 'Executive Briefing Call',
          },
          contact,
        }),
      });
      if (!res.ok) throw new Error(`Lead capture failed (${res.status})`);
      trackEvent('lead_created', {
        persona: 'STUDIOS',
        offerCode: 'JOIN_CORPORATE',
        qualificationCategory: evaluated.category,
      });
      setSubmitted(true);
    } catch (e) {
      console.error('Join lead capture error:', e);
      setError('Something went wrong sending your brief. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <CinematicHero
        backgroundImage="/mythra-world.png"
        eyebrow="MYTHRA STUDIOS · FOR BRANDS & ENTERPRISE"
        badge="CORPORATE PARTNERSHIPS"
        headline={
          <>
            DON&apos;T MAKE ANOTHER AD.<br />
            <span className="text-primary">BUILD A STORY PEOPLE CHOOSE TO WATCH.</span>
          </>
        }
        lead="Original films, audience-tested pilots, and scalable story worlds for brands that want attention they don't have to buy."
        support="Built for forward-thinking brands, media networks, and intellectual property owners."
        primaryCtaText="BOOK AN EXECUTIVE BRIEFING"
        primaryCtaHref="#brief"
        secondaryCtaText="VIEW GENESIS CASE STUDY"
        secondaryCtaHref="/genesis"
      />

      {/* Philosophy */}
      <section className="bg-[var(--surface-dim)] border-y border-[var(--border-subtle)] py-14 px-6 sm:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary font-bold block mb-3">
            HOW WE WORK WITH BRANDS
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase leading-tight">
            WE DON’T BEGIN WITH PRODUCTION.<br />
            <span className="text-primary">WE BEGIN BY FINDING THE STORY WORTH PRODUCING.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
            Your capital is invested only in stories with verified audience appetite. Start small, prove the signal, then scale.
          </p>
        </div>
      </section>

      {/* 3 phases */}
      <section className="py-20 px-6 sm:px-12 bg-background border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PHASES.map(({ icon: Icon, label, title, desc }) => (
            <div key={title} className="p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/60 transition-all shadow-xl">
              <Icon className="w-6 h-6 text-primary mb-4" />
              <span className="font-mono text-[10px] uppercase text-primary font-bold block mb-2">{label}</span>
              <h3 className="font-sans text-2xl font-black text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Qualifying funnel */}
      <section id="brief" className="py-24 px-6 sm:px-12 bg-[#000000] scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <span className="eyebrow-text text-xs text-primary font-bold block mb-3">EXECUTIVE BRIEFING · 60 SECONDS</span>
            <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-[#f3f3eb] uppercase">
              TELL US ABOUT YOUR BRAND.
            </h2>
            <p className="mt-3 text-sm text-[#a3a89e]">
              Four quick answers. Our executive creative director replies within 24 hours to schedule a private briefing.
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-2xl border-2 border-primary/40 bg-[#0a0a0a] shadow-2xl">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-sans text-2xl sm:text-3xl font-black text-[#f3f3eb] mb-3 uppercase">Brief received.</h3>
                <p className="text-sm text-[#a3a89e] max-w-md mx-auto mb-8">
                  Thank you{contact.firstName ? `, ${contact.firstName}` : ''}. Check your inbox: we will confirm your executive briefing within 24 hours.
                </p>
                <a href="/genesis" className="btn-pill-primary text-xs !py-3 !px-6 inline-flex">
                  <span>WATCH THE GENESIS CASE STUDY</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </a>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  {step > 1 ? (
                    <button type="button" onClick={prevStep} className="flex items-center gap-1 text-xs text-[#a3a89e] hover:text-primary">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  ) : <span />}
                  <span className="font-mono text-[10px] uppercase text-[#a3a89e]">Step {step} of {TOTAL_STEPS}</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full mb-8 overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
                </div>

                {step === 1 && (
                  <SingleChoiceStep
                    eyebrow="QUESTION 1 OF 4 · YOUR ORGANIZATION"
                    title="WHICH BEST DESCRIBES YOUR COMPANY?"
                    options={[
                      { id: 'Enterprise brand', title: 'Enterprise / Global Brand', description: 'Multi-market brand with in-house marketing leadership' },
                      { id: 'Growth brand', title: 'Growth-Stage Brand', description: 'Scaling consumer or B2B brand ready to own attention' },
                      { id: 'Agency', title: 'Agency Representing a Brand', description: 'Creative or media agency pitching on behalf of a client' },
                      { id: 'Media network / IP owner', title: 'Media Network or IP Owner', description: 'Audience, catalog, or story rights to build on' },
                    ]}
                    selectedValue={answers.segment}
                    onSelect={(v) => {
                      updateAnswer('segment', v);
                      updateAnswer('branch', v === 'Media network / IP owner' ? 'media' : 'brand');
                    }}
                    onNext={nextStep}
                  />
                )}

                {step === 2 && (
                  <SingleChoiceStep
                    eyebrow="QUESTION 2 OF 4 · OBJECTIVE"
                    title="WHAT DO YOU WANT THE STORY TO DO?"
                    options={[
                      { id: 'Hero Product Launch', title: 'Launch a Hero Product or Vision', description: 'Position an innovation within an emotional story' },
                      { id: 'Brand Awareness & Cultural Cachet', title: 'Earn Cultural Relevance', description: 'Move beyond interruptive ads with narrative drama' },
                      { id: 'Episodic Content System', title: 'Build a Recurring Series', description: 'Audience anticipation across social channels, episode after episode' },
                      { id: 'Concept Treatment Sprint', title: 'Explore Before Committing', description: 'Find and test the premise before full production' },
                    ]}
                    selectedValue={answers.objective}
                    onSelect={(v) => updateAnswer('objective', v)}
                    onNext={nextStep}
                  />
                )}

                {step === 3 && (
                  <SingleChoiceStep
                    eyebrow="QUESTION 3 OF 4 · INVESTMENT & TIMING"
                    title="WHAT BUDGET ARE YOU PLANNING?"
                    subtitle="Studio production begins at $7,500. Story Opportunity Sprints are $2,500, credited toward production over $15K."
                    options={[
                      { id: '$7.5K–$15K', title: '$7,500 – $15,000', description: 'Audience Proof Pilot' },
                      { id: '$15K–$30K', title: '$15,000 – $30,000', description: 'Branded short film' },
                      { id: '$30K–$75K', title: '$30,000 – $75,000', description: 'Episodic series system' },
                      { id: '$75K+', title: '$75,000+', description: 'Long-form, multi-market, or IP slate' },
                    ]}
                    selectedValue={answers.budget}
                    onSelect={(v) => updateAnswer('budget', v)}
                    onNext={nextStep}
                  />
                )}

                {step === 4 && (
                  <>
                    <div className="mb-8">
                      <span className="eyebrow-text block mb-3">WHEN DO YOU WANT TO START?</span>
                      <div className="flex flex-wrap gap-2">
                        {['Within 30 days', 'Within 60 days', 'This quarter', 'Exploring'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => updateAnswer('timeline', t)}
                            className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                              answers.timeline === t ? 'border-primary bg-primary text-primary-foreground' : 'border-white/20 text-[#f3f3eb] hover:border-primary'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <label className="mt-5 flex items-center gap-2 text-xs text-[#a3a89e]">
                        <input
                          type="checkbox"
                          checked={answers.isDecisionMaker === true}
                          onChange={(e) => updateAnswer('isDecisionMaker', e.target.checked)}
                        />
                        I own or sign off on this budget
                      </label>
                    </div>
                    <ContactStep
                      eyebrow="QUESTION 4 OF 4 · LEADERSHIP CONTACT"
                      title="WHO SHOULD WE BRIEF?"
                      subtitle="No checkout, no obligation. We reply within 24 hours to schedule a private executive briefing."
                      contact={contact}
                      onChange={setContact}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      showOrganizationFields={true}
                      submitLabel="Request Executive Briefing"
                    />
                    {error && <p className="mt-4 text-xs text-red-400">{error}</p>}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
