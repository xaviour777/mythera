import React from 'react';
import Link from 'next/link';
import CinematicHero from '../../../components/CinematicHero';
import OfferCard from '../../../components/OfferCard';
import FAQAccordion, { FAQItem } from '../../../components/FAQAccordion';
import StickyMobileCTA from '../../../components/StickyMobileCTA';
import { mythraOffers } from '../../../lib/offers';
import { Film, Sparkles, CheckCircle2, ArrowRight, ArrowUpRight, Play, BookOpen, Layers, Users, Zap, ShieldCheck } from 'lucide-react';

export default function MythraFilmmakerPage() {
  const pipelineStages = [
    { num: '01', title: 'Story Engine & Screenplay', desc: 'Transform raw premise into high-tension three-act screenplay.' },
    { num: '02', title: 'Character & World Bible', desc: 'Anchor visual identity, costumes, and environment seeds.' },
    { num: '03', title: 'Cinematic Storyboard', desc: 'Map camera angles, lens lengths, movement, and emotional pacing.' },
    { num: '04', title: 'Scene Generation & Control', desc: 'Produce high-fidelity coherent shots with motion and lighting controls.' },
    { num: '05', title: 'Voice & Sound Design Mix', desc: 'Score orchestral tracks, synthesize dialogue, and assemble Foley.' },
    { num: '06', title: 'Edit, Polish & Premiere', desc: 'Color grade, pacing rhythm, master delivery, and global localization.' },
  ];

  const targetAudiences = [
    {
      title: 'Storytellers & Writers',
      desc: 'Bring screenplays to life without waiting years for studio funding or massive crew budgets.',
    },
    {
      title: 'YouTube & Social Creators',
      desc: 'Transition from short-form hype into enduring long-form narrative cinema with high retention.',
    },
    {
      title: 'Traditional Editors & Directors',
      desc: 'Upgrade your commercial toolkit with AI-native shot generation and multi-scene consistency.',
    },
    {
      title: 'Freelancers & Agencies',
      desc: 'Package and sell high-margin narrative commercials, pilots, and cinematic trailers to clients.',
    },
    {
      title: 'Boutique Production Teams',
      desc: 'Scale a tight 2–3 person team into a high-output AI drama studio pipeline.',
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: 'Do I need prior filmmaking or VFX experience to join?',
      answer: 'No prior experience is necessary for Starter or the Filmmaker Cohort. We teach the fundamentals of visual storytelling, camera composition, editing, and prompt architectures from scratch.',
    },
    {
      question: 'What additional software and tool compute costs should I expect?',
      answer: 'We believe in complete transparency: tool costs are not included in course tuition. You will need approximately $50–$100 in third-party tool subscriptions and API compute credits (e.g., image generation, video models, voice synthesis, editing software) to complete your portfolio film.',
    },
    {
      question: 'Will I actually finish a complete film during the 6-week cohort?',
      answer: 'Yes. The entire cohort is structured as a milestone-based production sprint. By week 6, every participating student writes, directs, edits, and publishes one complete portfolio short film or cinematic trailer.',
    },
    {
      question: 'Do you promise monetization, virality, or client jobs?',
      answer: 'No. We do not make false earnings, virality, or employment claims. We teach a rigorous, professional production craft. Your commercial success depends on your creativity, execution, and distribution.',
    },
    {
      question: 'How long do I keep access to the training material?',
      answer: 'Starter includes 1-year access. Cohort members receive lifetime access to course recordings and curriculum materials, plus 90 days of community access. An optional $49/month alumni membership is available for ongoing live critiques and updates, but is never required to keep purchased material.',
    },
  ];

  return (
    <div>
      {/* Hero with background artwork */}
      <CinematicHero
        backgroundImage="/un1/mythra-world.png"
        eyebrow="MYTHRA FILMMAKER · ONE-PERSON STUDIO"
        badge="PRODUCTION EDUCATION"
        headline={
          <>
            DON'T JUST WATCH THE AI FILM ERA.<br />
            <span className="text-[#d8ff44]">DIRECT IT.</span>
          </>
        }
        lead="Learn the complete production system behind an AI-native studio."
        support="Finish with a publishable portfolio film, not a folder of tutorials."
        primaryCtaText="FIND MY PROGRAM"
        primaryCtaHref="/un1/filmmaker/start"
        secondaryCtaText="GET THE FREE BLUEPRINT"
        secondaryCtaHref="/un1/filmmaker/start?tier=film-blueprint"
      />

      {/* Transformation Pipeline */}
      <section className="py-24 px-6 sm:px-12 bg-[#000000]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#d8ff44]" />
              <span className="eyebrow-text text-xs text-[#d8ff44]">
                THE TRANSFORMATION
              </span>
            </div>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#f3f3eb] uppercase">
              TOOLS CHANGE. THE PRODUCTION SYSTEM REMAINS.
            </h2>
            <p className="mt-4 text-base text-[#9ea399]">
              We don't teach temporary software hacks. We teach the modular, tool-agnostic studio pipeline that turns an original idea into a finished, published film.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {pipelineStages.map((stage) => (
              <div
                key={stage.num}
                className="p-8 bg-[#080a08] border-2 border-[#ffffff15] hover:border-[#d8ff44] rounded-2xl transition-all shadow-lg relative group"
              >
                <span className="font-mono text-xs text-[#d8ff44] font-bold block mb-4 px-2.5 py-1 bg-[#0d100c] rounded-full border border-[#d8ff44]/30 w-fit">
                  STAGE {stage.num}
                </span>
                <h3 className="font-sans text-2xl font-black text-[#f3f3eb] mb-2 group-hover:text-[#d8ff44] transition-colors">
                  {stage.title}
                </h3>
                <p className="text-xs text-[#9ea399] leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Outcome highlight banner */}
          <div className="p-8 sm:p-10 bg-[#080a08] border-2 border-[#d8ff44]/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-[#0d100c] text-[#d8ff44] border border-[#d8ff44]/40 flex items-center justify-center shrink-0">
                <Film className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-sans text-2xl font-black text-[#f3f3eb]">
                  The Tangible Outcome: 1 Finished Portfolio Master
                </h4>
                <p className="text-xs text-[#9ea399] mt-1">
                  Every cohort graduate completes and publishes a polished film ready for festivals, YouTube, or client pitches.
                </p>
              </div>
            </div>
            <a
              href="/un1/filmmaker/start?tier=film-cohort"
              className="btn-pill-primary text-xs !py-3 !px-6 shrink-0 inline-flex items-center gap-2"
            >
              <span>Enroll in Cohort</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </section>

      {/* Who It Is For */}
      <section className="py-24 px-6 sm:px-12 bg-[#000000] border-t border-[#ffffff15]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <span className="eyebrow-text block mb-3 text-[#d8ff44]">WHO THIS IS BUILT FOR</span>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#f3f3eb] uppercase">
              FIVE CREATOR PATHWAYS.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetAudiences.map((aud, i) => (
              <div key={i} className="p-8 bg-[#080a08] border-2 border-[#ffffff15] hover:border-[#d8ff44] rounded-2xl transition-all shadow-lg">
                <h3 className="font-sans text-xl font-black text-[#f3f3eb] mb-2">
                  {aud.title}
                </h3>
                <p className="text-xs text-[#9ea399] leading-relaxed">
                  {aud.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Ladder */}
      <section id="programs" className="py-24 px-6 sm:px-12 bg-[#000000] border-t border-[#ffffff15]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow-text block mb-3 text-[#d8ff44]">THE EDUCATION LADDER</span>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#f3f3eb] uppercase">
              CHOOSE YOUR LEARNING PATH.
            </h2>
            <p className="mt-4 text-base text-[#9ea399]">
              From free workshop blueprints to intensive 6-week live production cohorts and private studio agency accelerators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
            {mythraOffers.filmmaker.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {/* Alumni info box */}
          <div className="p-6 bg-[#080a08] border-2 border-[#ffffff15] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9ea399] shadow-lg">
            <div>
              <strong className="text-[#f3f3eb] block mb-1 text-sm font-sans">Optional Alumni Mastermind &bull; $49/month</strong>
              <span>Post-cohort critique rooms, workflow updates, and collaborative project opportunities. Never required to retain core course access.</span>
            </div>
            <a href="/un1/filmmaker/start?tier=film-cohort" className="btn-pill-secondary text-xs !py-2 !px-4 shrink-0 inline-flex items-center gap-1">
              <span>Explore Cohort &rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion
        title="FILMMAKER EDUCATION FAQ"
        subtitle="Transparent details on commitments, tool costs, feedback formats, and policies."
        items={faqs}
      />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA
        label="MYTHRA FILMMAKER · Live Cohort"
        price="$749 Founding"
        href="/un1/filmmaker/start?tier=film-cohort"
      />
    </div>
  );
}
