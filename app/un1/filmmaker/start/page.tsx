'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FunnelShell from '../../../../components/funnels/FunnelShell';
import SingleChoiceStep from '../../../../components/funnels/SingleChoiceStep';
import ContactStep from '../../../../components/funnels/ContactStep';
import RecommendationView from '../../../../components/funnels/RecommendationView';
import { LeadContact, evaluateLead, ScoringResult } from '../../../../lib/lead-scoring';
import { trackEvent } from '../../../../lib/analytics';

const STORAGE_KEY = 'mythra_filmmaker_funnel_state';

export default function FilmmakerFunnelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTier = searchParams.get('tier') || '';
  // If tier is specified from pricing card, jump straight to enrollment contact form
  const hasSpecificTier = Boolean(initialTier && initialTier !== 'film-blueprint');
  const [step, setStep] = useState(hasSpecificTier ? 6 : 1);
  const totalSteps = 6;

  const [answers, setAnswers] = useState<Record<string, any>>({
    ambition: 'AI filmmaker',
    currentStage: initialTier.includes('accelerator')
      ? 'Running a team'
      : initialTier.includes('starter')
      ? 'Beginner'
      : 'Using AI tools',
    biggestBlock: 'Character consistency',
    goal90Days: 'Publish a 2–5 min portfolio short film',
    timeCommitment: initialTier.includes('blueprint') ? 'Workshop only (1 hr)' : '5–10 hrs/week',
    timezone: 'Americas / EMEA',
    selectedTier: initialTier || 'film-cohort',
  });

  const [contact, setContact] = useState<LeadContact>({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    country: 'United States',
    role: 'Creator',
    consentMarketing: true,
  });

  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && !hasSpecificTier) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers((prev) => ({ ...prev, ...parsed.answers }));
        if (parsed.contact) setContact((prev) => ({ ...prev, ...parsed.contact }));
        if (parsed.step) setStep(parsed.step);
      }
    } catch {
      // Local storage error ignored
    }
  }, [hasSpecificTier]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, contact, step }));
    } catch {
      // Local storage full
    }
  }, [answers, contact, step]);

  const updateAnswer = (key: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleContactSubmit = async () => {
    setIsProcessing(true);

    const evaluated = evaluateLead('FILMMAKER', answers, contact);
    if (initialTier) {
      const directOffer = [
        ...mythraOffers.filmmaker,
        ...mythraOffers.you,
        ...mythraOffers.cast,
      ].find((o) => o.id === initialTier || o.id === `film-${initialTier}`);
      if (directOffer) {
        evaluated.recommendedOffer = directOffer;
      }
    }
    setScoringResult(evaluated);

    try {
      // 1. Capture lead in GHL under MYTHRA Leads & dispatch alerts
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: 'FILMMAKER',
          answers: {
            ...answers,
            selectedTier: initialTier || evaluated.recommendedOffer.id,
            recommendedOffer: evaluated.recommendedOffer.name,
          },
          contact,
          scoring: evaluated,
        }),
      });

      trackEvent('lead_created', {
        persona: 'FILMMAKER',
        offerCode: evaluated.recommendedOffer.code,
        qualificationCategory: evaluated.category,
      });

      // Free Blueprint tier routes to confirmation
      if (evaluated.recommendedOffer.price === 0) {
        window.location.href = '/un1/filmmaker?blueprint_unlocked=true';
        return;
      }

      // 2. Direct Outbound Checkout to Whop
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerCode: evaluated.recommendedOffer.code,
          customerEmail: contact.email,
          customerName: `${contact.firstName} ${contact.lastName}`,
          successUrl: `${window.location.origin}/un1/filmmaker?enrolled=true`,
          cancelUrl: `${window.location.origin}/un1/filmmaker`,
        }),
      });

      const data = (await res.json()) as any;
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      window.location.href = 'https://whop.com';
    } catch (e) {
      console.error('Lead sync or checkout error:', e);
      window.location.href = 'https://whop.com';
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <FunnelShell
      title="MYTHRA FILMMAKER · Studio Readiness Quiz"
      persona="FILMMAKER"
      currentStep={step}
      totalSteps={totalSteps}
      onBack={prevStep}
      canBack={step > 1 && step < totalSteps}
    >
      {/* STEP 1: Ambition */}
      {step === 1 && (
        <SingleChoiceStep
          eyebrow="QUESTION 1 OF 6 · YOUR AMBITION"
          title="WHAT DO YOU WANT TO BECOME?"
          subtitle="Select the primary role or studio model you are aiming to build."
          options={[
            { id: 'AI filmmaker', title: 'Independent AI Filmmaker', description: 'Direct original cinematic shorts, trailers, and film festival entries' },
            { id: 'YouTube movie creator', title: 'YouTube Narrative Creator', description: 'Build high-retention long-form storytelling channels' },
            { id: 'Director', title: 'Commercial Director / Producer', description: 'Offer high-end AI cinematic production to commercial clients' },
            { id: 'Studio or agency', title: 'One-Person Studio / Agency', description: 'Scale a complete commercial studio pipeline and service offer' },
            { id: 'Story creator', title: 'Novelist / Comic Creator', description: 'Adapt existing written IP or world bibles into motion cinema' },
          ]}
          selectedValue={answers.ambition}
          onSelect={(v) => updateAnswer('ambition', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 2: Current Stage */}
      {step === 2 && (
        <SingleChoiceStep
          eyebrow="QUESTION 2 OF 6 · CURRENT EXPERIENCE"
          title="WHERE ARE YOU RIGHT NOW IN YOUR JOURNEY?"
          subtitle="Helps us calibrate curriculum difficulty and cohort placement."
          options={[
            { id: 'Beginner', title: 'Complete Beginner to AI & Video', description: 'Starting fresh with high curiosity and a story to tell' },
            { id: 'Using AI tools', title: 'Using AI Tools Independently', description: 'Familiar with Midjourney/Runway but struggling with consistency' },
            { id: 'Publishing shorts', title: 'Publishing Short-Form Video', description: 'Creating TikTok/Reels and wanting to transition to long-form' },
            { id: 'Making films', title: 'Making Independent Films / Edits', description: 'Experienced video editor adding AI generation workflows' },
            { id: 'Running a team', title: 'Running an Agency or Production Team', description: 'Building an agency production pipeline for client delivery' },
          ]}
          selectedValue={answers.currentStage}
          onSelect={(v) => updateAnswer('currentStage', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 3: Biggest Bottleneck */}
      {step === 3 && (
        <SingleChoiceStep
          eyebrow="QUESTION 3 OF 6 · PRIMARY BLOCK"
          title="WHAT IS YOUR BIGGEST BOTTLENECK?"
          subtitle="We focus cohort feedback specifically on solving this problem."
          options={[
            { id: 'Character consistency', title: 'Character & World Consistency', description: 'Keeping the same face, costume, and lighting across scenes' },
            { id: 'Story & screenplay', title: 'Story Engine & Screenplay Arc', description: 'Building dramatic tension that holds audience attention' },
            { id: 'Video quality & motion control', title: 'Video Motion Control & Artifacts', description: 'Getting cinematic, glitch-free camera movements' },
            { id: 'Sound & voice mix', title: 'Voice Synthesis & Orchestral Sound', description: 'Creating cinema-grade audio and dialogue lip-match' },
            { id: 'Workflow & monetization', title: 'Repeatable Pipeline & Monetization', description: 'Turning isolated experiments into a profitable business' },
          ]}
          selectedValue={answers.biggestBlock}
          onSelect={(v) => updateAnswer('biggestBlock', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 4: 90-Day Goal */}
      {step === 4 && (
        <SingleChoiceStep
          eyebrow="QUESTION 4 OF 6 · TANGIBLE MILESTONE"
          title="WHAT DO YOU WANT TO FINISH IN THE NEXT 90 DAYS?"
          subtitle="Choose the specific asset you are committed to publishing."
          options={[
            { id: 'Portfolio short film', title: 'One Complete Portfolio Short Film', description: 'A polished 2–5 minute narrative short ready for release' },
            { id: 'Blockbuster trailer', title: 'A 60–90s Blockbuster Movie Trailer', description: 'A high-impact proof of concept for a larger story universe' },
            { id: 'Pilot episode', title: 'A Pilot Episode for a Series', description: 'The first chapter of a recurring episodic universe' },
            { id: 'Client production pipeline', title: 'A Client-Ready Production Pipeline', description: 'Standardized SOPs, contracts, and pitch deck for clients' },
          ]}
          selectedValue={answers.goal90Days}
          onSelect={(v) => updateAnswer('goal90Days', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 5: Time Commitment */}
      {step === 5 && (
        <SingleChoiceStep
          eyebrow="QUESTION 5 OF 6 · WEEKLY COMMITMENT"
          title="HOW MUCH TIME CAN YOU COMMIT WEEKLY?"
          subtitle="Be realistic so we recommend the right learning format."
          options={[
            { id: '5–10 hrs/week', title: '5–10 Hours / Week (Recommended for Cohort)', description: 'Sufficient for weekly live sessions and production assignments' },
            { id: '10+ hrs/week', title: '10+ Hours / Week (Full Studio Sprint)', description: 'Fast-track completion with intensive iteration and feedback' },
            { id: 'Under 3 hrs/week', title: 'Under 3 Hours / Week (Self-Paced Starter)', description: 'Best suited for independent self-paced learning' },
            { id: 'Workshop only (1 hr)', title: 'Just the 45-Min Blueprint Workshop', description: 'Looking for a high-level overview before investing' },
          ]}
          selectedValue={answers.timeCommitment}
          onSelect={(v) => updateAnswer('timeCommitment', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 6: Contact Capture & Direct Whop Dispatch */}
      {step === 6 && (
        <ContactStep
          eyebrow={hasSpecificTier ? `ENROLLMENT REGISTRATION · ${String(initialTier).toUpperCase().replace(/-/g, ' ')}` : "QUESTION 6 OF 6 · APPLICATION DISPATCH"}
          title={hasSpecificTier ? "CONFIRM YOUR ENROLLMENT DETAILS" : "ENTER YOUR PRODUCTION PROFILE"}
          subtitle="Your registration is logged into our production queue. You will be redirected directly to secure Whop checkout."
          contact={contact}
          onChange={setContact}
          onSubmit={handleContactSubmit}
          isSubmitting={isProcessing}
          showOrganizationFields={true}
          submitLabel={hasSpecificTier ? "Proceed to Secure Whop Checkout &rarr;" : "Submit Application & Proceed to Checkout &rarr;"}
        />
      )}
    </FunnelShell>
  );
}
