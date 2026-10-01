'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FunnelShell from '@/components/funnels/FunnelShell';
import SingleChoiceStep from '@/components/funnels/SingleChoiceStep';
import MultiChoiceStep from '@/components/funnels/MultiChoiceStep';
import ContactStep from '@/components/funnels/ContactStep';
import RecommendationView from '@/components/funnels/RecommendationView';
import { LeadContact, evaluateLead, ScoringResult } from '@/lib/lead-scoring';
import { trackEvent } from '@/lib/analytics';

const STORAGE_KEY = 'mythra_you_funnel_state';

export default function MythraYouFunnelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTier = searchParams.get('tier') || '';

  const [step, setStep] = useState(1);
  const totalSteps = 9;

  // Funnel State
  const [answers, setAnswers] = useState<Record<string, any>>({
    format: initialTier.includes('moment')
      ? 'Moment'
      : initialTier.includes('story')
      ? 'Story'
      : initialTier.includes('legacy')
      ? 'Legacy'
      : 'Trailer',
    genre: 'Fantasy',
    star: 'Me',
    occasion: 'Personal milestone',
    features: ['Face', 'Name', 'Authorized voice'],
    visualStyle: 'Cinematic Anamorphic & Warm Tone',
    urgency: 'Standard Turnaround',
    authorizationStatus: 'I am the depicted adult',
  });

  const [contact, setContact] = useState<LeadContact>({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    country: 'United States',
    consentMarketing: true,
  });

  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Restore saved progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers((prev) => ({ ...prev, ...parsed.answers }));
        if (parsed.contact) setContact((prev) => ({ ...prev, ...parsed.contact }));
        if (parsed.step) setStep(parsed.step);
      }
    } catch {
      // Ignore local storage parse error
    }
  }, []);

  // Save progress on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, contact, step })
      );
    } catch {
      // Local storage disabled or full
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

  // Submit Contact & Calculate Recommendation
  const handleContactSubmit = async () => {
    setIsProcessing(true);

    const evaluated = evaluateLead('YOU', answers, contact);
    setScoringResult(evaluated);

    try {
      // Send lead to server API
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: 'YOU',
          answers,
          contact,
          scoring: evaluated,
        }),
      });

      trackEvent('lead_created', {
        persona: 'YOU',
        offerCode: evaluated.recommendedOffer.code,
        qualificationCategory: evaluated.category,
      });
    } catch (e) {
      console.error('Lead sync error:', e);
    } finally {
      setIsProcessing(false);
      setStep(totalSteps); // Show recommendation step
    }
  };

  // Handle Checkout / Scope Trigger
  const handleCheckout = async () => {
    if (!scoringResult) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerCode: scoringResult.recommendedOffer.code,
          customerEmail: contact.email,
          customerName: `${contact.firstName} ${contact.lastName}`,
          successUrl: `${window.location.origin}/un1/you/onboarding?session_id=session_active`,
          cancelUrl: `${window.location.origin}/un1/you/start`,
        }),
      });

      const data = (await res.json()) as any;
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push('/un1/you/onboarding');
      }
    } catch (e) {
      console.error('Checkout error:', e);
      router.push('/un1/you/onboarding');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <FunnelShell
      title="MYTHRA YOU · Film Creator Funnel"
      persona="YOU"
      currentStep={step}
      totalSteps={totalSteps}
      onBack={prevStep}
      canBack={step > 1 && step < totalSteps}
    >
      {/* STEP 1: Film Genre */}
      {step === 1 && (
        <SingleChoiceStep
          eyebrow="QUESTION 1 OF 8 · GENRE & WORLD"
          title="WHAT KIND OF FILM DO YOU WANT TO CREATE?"
          subtitle="Choose the cinematic universe and atmospheric tone for your project."
          options={[
            { id: 'Fantasy', title: 'Epic Fantasy / Mythic Lore', description: 'Ancient kingdoms, sorcery, dragons, and mystical quests' },
            { id: 'Sci-fi', title: 'Sci-Fi / Cyberpunk Odyssey', description: 'Neon megacities, deep space exploration, and futuristic tech' },
            { id: 'Action', title: 'High-Stakes Action & Espionage', description: 'Chases, secret operatives, cinematic heists, and tension' },
            { id: 'Romance', title: 'Cinematic Romance & Love Story', description: 'Golden-hour European romance, vows, and anniversary cinema' },
            { id: 'Founder story', title: 'Founder & Builder Journey', description: 'Dramatic chronicle of innovation, breakthroughs, and vision' },
            { id: 'Life story', title: 'Life Story / Milestone Tribute', description: 'Generational reflection, birthdays, and legacy documentaries' },
            { id: 'Wedding', title: 'Wedding Feature Premiere', description: 'Transform your special day into a timeless cinema masterpiece' },
            { id: 'Surprise me', title: 'Director’s Choice / Surprise Me', description: 'Let MYTHRA’s creative team design a bespoke original concept' },
          ]}
          selectedValue={answers.genre}
          onSelect={(v) => updateAnswer('genre', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 2: Who is the Star? */}
      {step === 2 && (
        <SingleChoiceStep
          eyebrow="QUESTION 2 OF 8 · THE LEAD CHARACTER"
          title="WHO IS THE STAR OF THIS FILM?"
          subtitle="All stars must have documented or direct likeness authorization before production."
          options={[
            { id: 'Me', title: 'Starring Myself', description: 'I will provide my own photos and optional voice sample' },
            { id: 'Another consenting adult', title: 'Consenting Adult (Gift / Surprise)', description: 'I will obtain their written consent before production begins' },
            { id: 'Couple', title: 'Couple (Two Lead Stars)', description: 'A dual-star story for weddings, anniversaries, or co-founders' },
            { id: 'Family', title: 'Family Group (Multi-Character)', description: 'Best suited for Story or Legacy bespoke packages' },
            { id: 'Founder or creator', title: 'Founder or Creator Avatar', description: 'Starring in a brand chronicle or audience-facing trailer' },
          ]}
          selectedValue={answers.star}
          onSelect={(v) => updateAnswer('star', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 3: Occasion or Purpose */}
      {step === 3 && (
        <SingleChoiceStep
          eyebrow="QUESTION 3 OF 8 · OCCASION"
          title="WHAT IS THE OCCASION OR PURPOSE?"
          subtitle="Helps our screenwriters calibrate the emotional arc and dramatic climax."
          options={[
            { id: 'Personal milestone', title: 'Personal Milestone or Birthday', description: 'Celebrating an achievement, new era, or milestone age' },
            { id: 'Gift for someone special', title: 'Unforgettable Gift Experience', description: 'A high-impact cinematic surprise for someone you love' },
            { id: 'Wedding or anniversary', title: 'Wedding or Anniversary Premiere', description: 'Premiering at a reception or immortalizing a relationship' },
            { id: 'Founder story', title: 'Founder / Company Narrative', description: 'Showcasing the philosophy and origin story behind a venture' },
            { id: 'Pure entertainment', title: 'Pure Fun & Artistic Expression', description: 'Because starring in your own movie trailer is legendary' },
          ]}
          selectedValue={answers.occasion}
          onSelect={(v) => updateAnswer('occasion', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 4: Real Person Cues & Features */}
      {step === 4 && (
        <MultiChoiceStep
          eyebrow="QUESTION 4 OF 8 · LIKENESS DEPTH"
          title="HOW MUCH OF THE REAL PERSON SHOULD APPEAR?"
          subtitle="Select all elements you want our directors to integrate into the script."
          options={[
            { id: 'Face', label: 'Facial Likeness', desc: 'Exact facial structure and recognizable expressions' },
            { id: 'Name', label: 'Real Name & Title', desc: 'Personalized title card, hero names, and screenplay dialogue' },
            { id: 'Real story', label: 'Real Story Elements', desc: 'Specific memories, inside jokes, and real-life achievements' },
            { id: 'Authorized voice', label: 'Authorized Voice Clone', desc: 'Synthesized voice match for cinematic dialogue lines' },
            { id: 'Personality cues', label: 'Signature Style / Mannerisms', desc: 'Favorite clothes, catchphrases, or personality nuances' },
          ]}
          selectedValues={answers.features || []}
          onChange={(v) => updateAnswer('features', v)}
          onNext={nextStep}
          minSelections={1}
        />
      )}

      {/* STEP 5: Choose Format */}
      {step === 5 && (
        <SingleChoiceStep
          eyebrow="QUESTION 5 OF 8 · FORMAT SELECTION"
          title="CHOOSE YOUR DESIRED PRODUCTION FORMAT"
          subtitle="You can upgrade or adjust your package at any time during onboarding."
          options={[
            { id: 'Trailer', title: 'MYTHRA TRAILER — $299 (Recommended)', description: '60–90s movie trailer, custom premise, 5–8 story beats, score & voice option', badge: 'RECOMMENDED' },
            { id: 'Moment', title: 'MYTHRA MOMENT — $79', description: '20–30s template-led scene, 1 star, 1080p master, no cloned voice' },
            { id: 'Story', title: 'MYTHRA STORY — From $1,500', description: '3–5 min bespoke short film, custom world & screenplay, 2 stars' },
            { id: 'Legacy', title: 'MYTHRA LEGACY — From $5,000', description: '8–15 min premium documentary heirloom with Creative Director research' },
          ]}
          selectedValue={answers.format}
          onSelect={(v) => updateAnswer('format', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 6: Visual Direction */}
      {step === 6 && (
        <SingleChoiceStep
          eyebrow="QUESTION 6 OF 8 · VISUAL PALETTE"
          title="CHOOSE THE VISUAL DIRECTION"
          subtitle="Our colorists and prompt artists will style your film in this aesthetic."
          options={[
            { id: 'Cinematic Anamorphic & Warm Tone', title: 'Anamorphic & Warm Gold', description: 'Rich film grain, golden flares, and deep atmospheric shadows' },
            { id: 'Dark Moody & High Contrast', title: 'Dark Neo-Noir & High Contrast', description: 'Chiaroscuro lighting, deep blacks, and sharp dramatic focus' },
            { id: 'Vibrant Neon & Cyberpunk', title: 'Vibrant Neon & Technicolor', description: 'Cyber-futuristic cyan/magenta contrast and vivid particle light' },
            { id: 'Vintage 1970s Panavision', title: 'Vintage 1970s Panavision Reel', description: 'Soft vintage lens bloom, tactile film emulsion, and warm hues' },
          ]}
          selectedValue={answers.visualStyle}
          onSelect={(v) => updateAnswer('visualStyle', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 7: Turnaround & Urgency */}
      {step === 7 && (
        <SingleChoiceStep
          eyebrow="QUESTION 7 OF 8 · TIMELINE"
          title="WHEN IS THE FINAL MASTER NEEDED?"
          subtitle="Helps us assign director queue priority."
          options={[
            { id: 'Standard Turnaround', title: 'Standard Turnaround (7–10 business days for Trailer)', description: 'Default schedule with complete revision buffer' },
            { id: 'Within 2 Weeks', title: 'Within 2 Weeks (Specific upcoming event)', description: 'We will confirm milestone dates on queue assignment' },
            { id: 'Fast Track Priority', title: 'Fast-Track Priority Delivery (Quoted upon review)', description: 'Requires director capacity confirmation' },
          ]}
          selectedValue={answers.urgency}
          onSelect={(v) => updateAnswer('urgency', v)}
          onNext={nextStep}
        />
      )}

      {/* STEP 8: Contact Capture & Pre-Authorization Check */}
      {step === 8 && (
        <div>
          <div className="mb-6 p-4 bg-[#080a08] border border-[#ffffff15] rounded-2xl">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#d8ff44] font-bold block mb-2">
              AUTHORIZATION PRE-CHECK
            </span>
            <label className="flex items-start gap-3 cursor-pointer text-xs text-[#F4F0E8]">
              <input
                type="checkbox"
                required
                defaultChecked
                className="mt-0.5 rounded bg-[#000000] border-[#ffffff15] text-[#d8ff44] focus:ring-0"
              />
              <span>
                I confirm that I am the depicted adult, or I have written authority to commission this film for a consenting loved one / child as legal guardian.
              </span>
            </label>
          </div>

          <ContactStep
            contact={contact}
            onChange={setContact}
            onSubmit={handleContactSubmit}
            isSubmitting={isProcessing}
            showOrganizationFields={false}
            submitLabel="Review My Production Offer &rarr;"
          />
        </div>
      )}

      {/* STEP 9: Tailored Recommendation & Next Action */}
      {step === 9 && scoringResult && (
        <RecommendationView
          scoring={scoringResult}
          onCheckout={handleCheckout}
          onBookCall={() => router.push('/un1/you/onboarding?call=true')}
          isProcessing={isProcessing}
        />
      )}
    </FunnelShell>
  );
}
