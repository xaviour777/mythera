'use client';

import React, { useState } from 'react';
import CinematicHero from '@/components/CinematicHero';
import SingleChoiceStep from '@/components/funnels/SingleChoiceStep';
import ContactStep from '@/components/funnels/ContactStep';
import { LeadContact, PersonaType, evaluateLead } from '@/lib/lead-scoring';
import { trackEvent } from '@/lib/analytics';
import { ArrowLeft, ArrowRight, CheckCircle2, Users, BookOpen, Handshake, GraduationCap, Sparkles } from 'lucide-react';

// Partner funnel: creators, IP licensing, collaborations, cohort and academy.
// Routes each track to the matching lead persona and a next-step page.
const TOTAL_STEPS = 4;

type Track = 'creator' | 'ip' | 'collab' | 'cohort' | 'academy';

interface TrackConfig {
  icon: typeof Users;
  title: string;
  description: string;
  persona: PersonaType;
  offer: string;
  nextHref: string;
  nextLabel: string;
  question: string;
  options: { id: string; title: string; description: string }[];
}

const TRACKS: Record<Track, TrackConfig> = {
  creator: {
    icon: Users,
    title: 'Creator Partner',
    description: 'Bring your audience; co-create original stories and share in the upside.',
    persona: 'STUDIOS',
    offer: 'Creator Partnership',
    nextHref: '/un1/cast',
    nextLabel: 'EXPLORE MYTHRA CAST',
    question: 'HOW BIG IS YOUR AUDIENCE?',
    options: [
      { id: '100M+', title: '100M+ reach', description: 'Network or multi-channel ecosystem' },
      { id: '10M–100M', title: '10M – 100M', description: 'Established creator or page network' },
      { id: '1M–10M', title: '1M – 10M', description: 'Growing channel with loyal viewers' },
      { id: 'Under 1M', title: 'Under 1M', description: 'Early-stage but consistent' },
    ],
  },
  ip: {
    icon: BookOpen,
    title: 'IP Licensing',
    description: 'License a book, comic, game, or character universe for cinematic adaptation.',
    persona: 'STUDIOS',
    offer: 'IP Licensing Review',
    nextHref: '/un1/studios',
    nextLabel: 'SEE HOW WE ADAPT IP',
    question: 'WHAT IP ARE YOU BRINGING?',
    options: [
      { id: 'Novel / Book Series', title: 'Novel or Book Series', description: 'Published or manuscript-stage' },
      { id: 'Graphic Novel / Webtoon', title: 'Graphic Novel or Webtoon', description: 'Illustrated panels into motion' },
      { id: 'Original Character / Lore', title: 'Game Universe or Lore', description: 'Characters and worlds with fans' },
      { id: 'Screenplay in Development', title: 'Screenplay', description: 'Feature or series script' },
    ],
  },
  collab: {
    icon: Handshake,
    title: 'Collaboration',
    description: 'Co-production, distribution, or strategic partnership on the MYTHRA slate.',
    persona: 'STUDIOS',
    offer: 'Collaboration Discussion',
    nextHref: '/un1/genesis',
    nextLabel: 'WATCH THE GENESIS CASE STUDY',
    question: 'WHAT DO YOU BRING TO THE TABLE?',
    options: [
      { id: 'Distribution', title: 'Distribution', description: 'Channels, platforms, or FAST/OTT slots' },
      { id: 'Co-production', title: 'Co-production', description: 'Crew, capacity, or production budget' },
      { id: 'Capital', title: 'Capital', description: 'Slate financing or territory rights' },
      { id: 'Technology', title: 'Technology', description: 'Tools, models, or pipeline partnership' },
    ],
  },
  cohort: {
    icon: GraduationCap,
    title: 'Filmmaker Cohort',
    description: '6 weeks, live, finish with a publishable portfolio film.',
    persona: 'FILMMAKER',
    offer: 'MYTHRA FILMMAKER COHORT',
    nextHref: '/un1/filmmaker/start?tier=film-cohort',
    nextLabel: 'RESERVE A COHORT SEAT',
    question: 'WHERE ARE YOU TODAY?',
    options: [
      { id: 'Complete beginner', title: 'Complete Beginner', description: 'New to filmmaking and AI tools' },
      { id: 'Active creator or editor', title: 'Creator or Editor', description: 'Already publishing, want cinema quality' },
      { id: 'Running a team or agency', title: 'Running a Team or Agency', description: 'Want a repeatable studio pipeline' },
    ],
  },
  academy: {
    icon: Sparkles,
    title: 'Academy',
    description: 'Self-paced MYTHRA Starter: learn the one-person studio system on your schedule.',
    persona: 'FILMMAKER',
    offer: 'MYTHRA STARTER',
    nextHref: '/un1/filmmaker/start?tier=film-starter',
    nextLabel: 'START THE ACADEMY',
    question: 'WHERE ARE YOU TODAY?',
    options: [
      { id: 'Complete beginner', title: 'Complete Beginner', description: 'New to filmmaking and AI tools' },
      { id: 'Active creator or editor', title: 'Creator or Editor', description: 'Already publishing, want cinema quality' },
      { id: 'Running a team or agency', title: 'Running a Team or Agency', description: 'Want a repeatable studio pipeline' },
    ],
  },
};

const COMMITMENT_OPTIONS = [
  { id: '10+ hours / week', title: '10+ hours a week', description: 'Ready to go all in' },
  { id: '5–10 hours / week', title: '5 – 10 hours a week', description: 'Serious side project' },
  { id: 'Under 5 hours / week', title: 'Under 5 hours a week', description: 'Exploring for now' },
];

const TIMELINE_OPTIONS = [
  { id: 'Within 30 days', title: 'Within 30 days', description: 'Ready to start now' },
  { id: 'Within 60 days', title: 'Within 60 days', description: 'Planning the next quarter' },
  { id: 'Exploring', title: 'Just exploring', description: 'Opening a conversation' },
];

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [track, setTrack] = useState<Track | ''>('');
  const [detail, setDetail] = useState('');
  const [readiness, setReadiness] = useState('');
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

  const config = track ? TRACKS[track] : null;
  const isLearner = config?.persona === 'FILMMAKER';

  const nextStep = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Map answers onto the keys lib/lead-scoring.ts reads for each persona.
  const buildAnswers = (): Record<string, string | boolean> => {
    const base = { door: `join-${track}`, funnel: 'join-partner', track: String(track), recommendedOffer: config?.offer || '' };
    if (isLearner) {
      return { ...base, currentStage: detail, timeCommitment: readiness };
    }
    return {
      ...base,
      branch: track === 'ip' ? 'ip' : track === 'creator' ? 'media' : 'finance',
      audienceSize: track === 'creator' ? detail : '',
      objective: detail,
      strategicContribution: track === 'collab' ? detail : '',
      timeline: readiness,
    };
  };

  const handleSubmit = async () => {
    if (!config) return;
    setIsSubmitting(true);
    setError('');
    const answers = buildAnswers();
    const evaluated = evaluateLead(config.persona, answers, contact);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona: config.persona, answers, contact }),
      });
      if (!res.ok) throw new Error(`Lead capture failed (${res.status})`);
      trackEvent('lead_created', {
        persona: config.persona,
        offerCode: `JOIN_${String(track).toUpperCase()}`,
        qualificationCategory: evaluated.category,
      });
      setSubmitted(true);
    } catch (e) {
      console.error('Join lead capture error:', e);
      setError('Something went wrong sending your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <CinematicHero
        backgroundImage="/un1/mythra-world.png"
        eyebrow="MYTHRA · PARTNERS, CREATORS & FILMMAKERS"
        badge="JOIN THE STUDIO"
        headline={
          <>
            STORIES ANYONE CAN ENTER.<br />
            <span className="text-primary">STUDIOS ANYONE CAN BUILD.</span>
          </>
        }
        lead="Partner with MYTHRA as a creator, license your IP, collaborate on the slate, or learn the one-person studio system."
        support="Pick your track. Four quick answers. We reply within 24 hours."
        primaryCtaText="CHOOSE YOUR TRACK"
        primaryCtaHref="#apply"
        secondaryCtaText="VIEW GENESIS CASE STUDY"
        secondaryCtaHref="/un1/genesis"
      />

      <section className="py-20 px-6 sm:px-12 bg-background border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(Object.keys(TRACKS) as Track[]).map((id) => {
            const { icon: Icon, title, description } = TRACKS[id];
            return (
              <a
                key={id}
                href="#apply"
                onClick={() => {
                  setTrack(id);
                  setStep(2);
                }}
                className="p-6 rounded-2xl bg-card border-2 border-border hover:border-primary transition-all shadow-xl no-underline group"
              >
                <Icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-sans text-lg font-black text-foreground mb-2 group-hover:text-primary">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section id="apply" className="py-24 px-6 sm:px-12 bg-[#000000] scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <span className="eyebrow-text text-xs text-primary font-bold block mb-3">APPLY · 60 SECONDS</span>
            <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-[#f3f3eb] uppercase">
              JOIN MYTHRA.
            </h2>
          </div>

          <div className="p-6 sm:p-10 rounded-2xl border-2 border-primary/40 bg-[#0a0a0a] shadow-2xl">
            {submitted && config ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-sans text-2xl sm:text-3xl font-black text-[#f3f3eb] mb-3 uppercase">Application received.</h3>
                <p className="text-sm text-[#a3a89e] max-w-md mx-auto mb-8">
                  Thank you{contact.firstName ? `, ${contact.firstName}` : ''}. Our team will reply within 24 hours about {config.title.toLowerCase()}.
                </p>
                <a href={config.nextHref} className="btn-pill-primary text-xs !py-3 !px-6 inline-flex">
                  <span>{config.nextLabel}</span>
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
                    eyebrow="QUESTION 1 OF 4 · YOUR TRACK"
                    title="HOW DO YOU WANT TO WORK WITH MYTHRA?"
                    options={(Object.keys(TRACKS) as Track[]).map((id) => ({
                      id,
                      title: TRACKS[id].title,
                      description: TRACKS[id].description,
                    }))}
                    selectedValue={track}
                    onSelect={(v) => {
                      setTrack(v as Track);
                      setDetail('');
                    }}
                    onNext={nextStep}
                  />
                )}

                {step === 2 && config && (
                  <SingleChoiceStep
                    eyebrow={`QUESTION 2 OF 4 · ${config.title.toUpperCase()}`}
                    title={config.question}
                    options={config.options}
                    selectedValue={detail}
                    onSelect={setDetail}
                    onNext={nextStep}
                  />
                )}

                {step === 3 && config && (
                  <SingleChoiceStep
                    eyebrow="QUESTION 3 OF 4 · READINESS"
                    title={isLearner ? 'HOW MUCH TIME CAN YOU COMMIT?' : 'WHEN DO YOU WANT TO START?'}
                    options={isLearner ? COMMITMENT_OPTIONS : TIMELINE_OPTIONS}
                    selectedValue={readiness}
                    onSelect={setReadiness}
                    onNext={nextStep}
                  />
                )}

                {step === 4 && config && (
                  <>
                    <ContactStep
                      eyebrow="QUESTION 4 OF 4 · CONTACT"
                      title="WHERE SHOULD WE REACH YOU?"
                      subtitle="No payment now. We reply within 24 hours with your next step."
                      contact={contact}
                      onChange={setContact}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      showOrganizationFields={!isLearner}
                      submitLabel="Send My Application"
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
