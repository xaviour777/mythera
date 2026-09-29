'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FunnelShell from '../../../../components/funnels/FunnelShell';
import SingleChoiceStep from '../../../../components/funnels/SingleChoiceStep';
import MultiChoiceStep from '../../../../components/funnels/MultiChoiceStep';
import ContactStep from '../../../../components/funnels/ContactStep';
import RecommendationView from '../../../../components/funnels/RecommendationView';
import { LeadContact, evaluateLead, ScoringResult } from '../../../../lib/lead-scoring';
import { trackEvent } from '../../../../lib/analytics';

const STORAGE_KEY = 'mythra_studios_funnel_state';

export default function StudiosFunnelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIntent = searchParams.get('intent') || '';
  const initialTier = searchParams.get('tier') || '';

  // If tier is specified from pricing cards, jump straight to executive brief contact form
  const hasSpecificTier = Boolean(initialTier);
  const [step, setStep] = useState(hasSpecificTier ? 5 : 1);
  const totalSteps = 5;

  const [answers, setAnswers] = useState<Record<string, any>>({
    branch: initialIntent || 'brand',
    objective: 'Create original branded film or pilot',
    stage: 'Have an idea / Brief in development',
    budget: initialTier === 'story-sprint' ? '$2,500' : initialTier === 'proof-pilot' ? '$7,500' : '$15K–$30K',
    timeline: 'Within 60 days',
    isDecisionMaker: true,
    selectedTier: initialTier || '',
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
      // Ignore parse error
    }
  }, [hasSpecificTier]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, contact, step }));
    } catch {
      // Ignore storage error
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

    const evaluated = evaluateLead('STUDIOS', answers, contact);
    if (initialTier) {
      const directOffer = mythraOffers.studios.find(
        (o) =>
          o.id === initialTier ||
          o.id === `studio-${initialTier}` ||
          o.id.includes(initialTier)
      );
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
          persona: 'STUDIOS',
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
        persona: 'STUDIOS',
        offerCode: evaluated.recommendedOffer.code,
        qualificationCategory: evaluated.category,
      });

      // 2. Direct Outbound Checkout to Whop
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerCode: evaluated.recommendedOffer.code,
          customerEmail: contact.email,
          customerName: `${contact.firstName} ${contact.lastName}`,
          successUrl: `${window.location.origin}/un1/studios?brief_submitted=true`,
          cancelUrl: `${window.location.origin}/un1/studios`,
        }),
      });

      const data = (await res.json()) as any;
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      window.location.href = 'https://whop.com';
    } catch (e) {
      console.error('Lead sync/checkout error:', e);
      window.location.href = 'https://whop.com';
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <FunnelShell
      title="MYTHRA STUDIOS · B2B Production Brief"
      persona="STUDIOS"
      currentStep={step}
      totalSteps={totalSteps}
      onBack={prevStep}
      canBack={step > 1 && step < totalSteps}
    >
      {/* STEP 1: What are you bringing? (Branch Selector) */}
      {step === 1 && (
        <SingleChoiceStep
          eyebrow="QUESTION 1 OF 5 · ENGAGEMENT PROFILE"
          title="WHAT ARE YOU BRINGING TO THE STUDIO?"
          subtitle="This tailors our production scoping questions specifically to your organization."
          options={[
            { id: 'brand', title: 'Brand / Commercial Product', description: 'Create branded narrative entertainment that drives real audience retention' },
            { id: 'ip', title: 'Story / Book / Game IP', description: 'Adapt an existing written or comic universe into motion cinema' },
            { id: 'media', title: 'Audience / Media Network', description: 'Syndicate localized original stories across your media channels' },
            { id: 'production', title: 'Complete Film / Series Brief', description: 'Commission a standalone short film, pilot, or multi-episode season' },
            { id: 'finance', title: 'Capital / Strategic Co-Production', description: 'Explore studio slate financing, co-production, and territory rights' },
          ]}
          selectedValue={answers.branch}
          onSelect={(v) => updateAnswer('branch', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 2: Branch-Specific Objective */}
      {step === 2 && (
        <div>
          {answers.branch === 'brand' && (
            <SingleChoiceStep
              eyebrow="QUESTION 2 OF 5 · BRAND GOAL"
              title="WHAT IS YOUR PRIMARY BRAND OBJECTIVE?"
              subtitle="Tell us how this film will connect with your target market."
              options={[
                { id: 'Hero Product Launch', title: 'Hero Product / Vision Launch', description: 'Position an innovation within an emotional story' },
                { id: 'Brand Awareness & Cultural Cachet', title: 'Cultural Cachet & Awareness', description: 'Move beyond interruptive ads with narrative drama' },
                { id: 'Episodic Content System', title: 'Recurring Episodic Series', description: 'Build recurring audience anticipation across social channels' },
                { id: 'Concept Treatment Sprint', title: 'Concept Sprint / Narrative Exploration', description: 'Develop treatment and premise before committing full production' },
              ]}
              selectedValue={answers.objective}
              onSelect={(v) => updateAnswer('objective', v)}
              onNext={nextStep}
            />
          )}

          {answers.branch === 'ip' && (
            <SingleChoiceStep
              eyebrow="QUESTION 2 OF 5 · IP ADAPTATION"
              title="WHAT TYPE OF IP ARE YOU ADAPTING?"
              subtitle="We will review your rights status and source materials."
              options={[
                { id: 'Novel / Book Series', title: 'Published Novel or Book Series', description: 'Adapt text chapters into visual scenes and character bibles' },
                { id: 'Graphic Novel / Webtoon', title: 'Graphic Novel or Webtoon', description: 'Translate illustrated panels into cinematic motion and sound' },
                { id: 'Original Character / Lore', title: 'Original Game Universe or Lore', description: 'Build a cinematic teaser or animated short for game IP' },
                { id: 'Screenplay in Development', title: 'Completed Feature Screenplay', description: 'Create a proof-of-concept pilot for studio pitching' },
              ]}
              selectedValue={answers.objective}
              onSelect={(v) => updateAnswer('objective', v)}
              onNext={nextStep}
            />
          )}

          {answers.branch === 'media' && (
            <SingleChoiceStep
              eyebrow="QUESTION 2 OF 5 · NETWORK DISTRIBUTION"
              title="WHERE DOES YOUR AUDIENCE CURRENTLY LIVE?"
              subtitle="Select your primary audience distribution infrastructure."
              options={[
                { id: 'YouTube 10M+ Network', title: 'YouTube Channel Network (10M+ Reach)', description: 'Multi-language channel syndication with revenue share' },
                { id: 'Social Media / Meta Pages', title: 'Facebook / Meta / TikTok Network', description: 'High-frequency short-form & mid-form drama syndication' },
                { id: 'Streaming / FAST Channel', title: 'FAST / OTT Streaming Platform', description: 'Original slate licensing for digital broadcast' },
                { id: 'Creator Network', title: 'Multi-Creator Talent Network', description: 'Co-producing stories starring roster creators' },
              ]}
              selectedValue={answers.objective}
              onSelect={(v) => updateAnswer('objective', v)}
              onNext={nextStep}
            />
          )}

          {(answers.branch === 'production' || answers.branch === 'finance') && (
            <SingleChoiceStep
              eyebrow="QUESTION 2 OF 5 · PRODUCTION SCOPE"
              title="WHAT FORMAT ARE YOU SCOPING?"
              subtitle="Select the planned narrative scope and runtime."
              options={[
                { id: 'Story Opportunity Sprint', title: 'Story Opportunity Sprint ($2,500)', description: 'Strategic discovery before production · 100% credited toward production' },
                { id: 'Audience Proof Pilot', title: 'Audience Proof Pilot (From $7,500)', description: 'Narrative proof-of-concept to test audience signal' },
                { id: 'Original Entertainment Partnership', title: 'Original Story World Partnership', description: 'Series & entertainment system custom-scoped after validation' },
                { id: 'Original IP / Co-Production', title: 'Private Slate & Co-Production', description: 'Confidential slate presentation & rights partnership' },
              ]}
              selectedValue={answers.objective}
              onSelect={(v) => updateAnswer('objective', v)}
              onNext={nextStep}
            />
          )}
        </div>
      )}

      {/* STEP 3: Assets & Script Prepared */}
      {step === 3 && (
        <SingleChoiceStep
          eyebrow="QUESTION 3 OF 5 · CURRENT PREPARATION"
          title="WHAT MATERIALS DO YOU HAVE READY?"
          subtitle="Helps us estimate pre-production time."
          options={[
            { id: 'Have an idea / Brief in development', title: 'Concept / Core Premise Only', description: 'We will develop the screenplay and character bible from scratch' },
            { id: 'Completed Script / Detailed Brief', title: 'Completed Script or Brand Brief', description: 'Screenplay ready for visual adaptation and scene generation' },
            { id: 'Full Digital Asset Library Ready', title: 'Existing 3D / Brand Assets & Logos', description: 'Assets available to seed into the character and world bible' },
            { id: 'Need Concept Sprint first', title: 'Start with Story Opportunity Sprint ($2,500)', description: 'Find the story before producing · 100% credited toward production' },
          ]}
          selectedValue={answers.stage}
          onSelect={(v) => updateAnswer('stage', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 4: Budget Band & Timeline */}
      {step === 4 && (
        <SingleChoiceStep
          eyebrow="QUESTION 4 OF 5 · SCOPE & INVESTMENT"
          title="INDICATIVE PRODUCTION BUDGET BAND"
          subtitle="Studio production begins at $7,500. Concept sprints are $2,500 (credited to productions over $15K)."
          options={[
            { id: '$7.5K–$15K', title: '$7,500 – $15,000 (Social Drama Pilot)', description: 'Ideal for 45–90s high-impact proof of concept' },
            { id: '$15K–$30K', title: '$15,000 – $30,000 (Branded Short Film)', description: 'Comprehensive 3–5 min original short film master' },
            { id: '$30K–$75K', title: '$30,000 – $75,000 (Episodic Series System)', description: 'Multi-episode world system with reusable character assets' },
            { id: '$75K+', title: '$75,000+ (Long-Form / IP Slate)', description: 'Co-productions, worldwide localization, and multi-format slate' },
            { id: '<$7.5K', title: 'Under $7,500 (Need Guidance / Education)', description: 'Explore Concept Sprints or our Filmmaker Studio system' },
          ]}
          selectedValue={answers.budget}
          onSelect={(v) => updateAnswer('budget', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 5: Contact Capture & Direct Whop Dispatch */}
      {step === 5 && (
        <ContactStep
          eyebrow={hasSpecificTier ? `EXECUTIVE BRIEF · ${String(initialTier).toUpperCase().replace(/-/g, ' ')}` : "QUESTION 5 OF 5 · EXECUTIVE BRIEF DISPATCH"}
          title={hasSpecificTier ? "CONFIRM LEADERSHIP CONTACT & PROCEED" : "COMPANY & LEADERSHIP CONTACT"}
          subtitle="Our executive creative director will review your brief. You will be redirected directly to secure Whop checkout."
          contact={contact}
          onChange={setContact}
          onSubmit={handleContactSubmit}
          isSubmitting={isProcessing}
          showOrganizationFields={true}
          submitLabel={hasSpecificTier ? "Submit Brief & Proceed to Whop Checkout &rarr;" : "Submit Studio Brief & Proceed to Checkout &rarr;"}
        />
      )}
    </FunnelShell>
  );
}
