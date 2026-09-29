'use client';

import React from 'react';
import Link from 'next/link';
import CinematicHero from '../../../components/CinematicHero';
import OfferCard from '../../../components/OfferCard';
import FAQAccordion, { FAQItem } from '../../../components/FAQAccordion';
import StickyMobileCTA from '../../../components/StickyMobileCTA';
import { mythraOffers } from '../../../lib/offers';
import {
  Compass,
  TestTube,
  Sparkles,
  Globe2,
  Building2,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Film,
} from 'lucide-react';

export default function MythraStudiosPage() {
  const faqs: FAQItem[] = [
    {
      question: 'Why do you start with a Story Opportunity Sprint ($2,500)?',
      answer: 'We don’t begin with production—we begin by finding the story worth producing. The Story Opportunity Sprint is a strategic decision product where we analyze cultural whitespace, test three core premises, and deliver a production roadmap. 100% of the $2,500 fee is credited toward your approved production of $15,000+ contracted within 30 days.',
    },
    {
      question: 'What is the goal of an Audience Proof Pilot (From $7,500)?',
      answer: 'You are not buying 45–90 seconds; you are buying evidence. The pilot tests narrative retention, emotional engagement, and hook resonance across agreed channels. It concludes with an audited performance review and an honest recommendation to scale, revise, or stop.',
    },
    {
      question: 'How are series and story-world partnerships scoped?',
      answer: 'Series and original-IP partnerships are custom-scoped after the story concept has been validated with real audience signal. We engineer season bibles, reusable character and world digital asset systems, and high-velocity recurring production SLAs.',
    },
    {
      question: 'Who owns the commercial rights and IP?',
      answer: 'For branded story properties commissioned by your company, you retain commercial rights across agreed distribution channels and territories. For co-productions and licensing of MYTHRA Originals, distribution and revenue models are structured transparently.',
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero with background artwork */}
      <CinematicHero
        backgroundImage="/un1/mythra-world.png"
        eyebrow="MYTHRA STUDIOS · B2B NARRATIVE ARCHITECTURE"
        badge="COMMERCIAL STORY ENGINE"
        headline={
          <>
            DON'T MAKE ANOTHER AD.<br />
            <span className="text-primary">BUILD A STORY PEOPLE CHOOSE TO WATCH.</span>
          </>
        }
        lead="Original films, audience-tested pilots, and scalable story worlds."
        support="Built for forward-thinking brands, media networks, and intellectual property owners."
        primaryCtaText="FIND YOUR STORY OPPORTUNITY"
        primaryCtaHref="#sprint"
        secondaryCtaText="VIEW GENESIS CASE STUDY"
        secondaryCtaHref="/un1/genesis"
      />

      {/* ── THE NEW CORE MANIFESTO HEADLINE ── */}
      <section className="bg-[var(--surface-dim)] border-y border-[var(--border-subtle)] py-14 px-6 sm:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary font-bold block mb-3">
            OUR COMMERCIAL PHILOSOPHY
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase leading-tight">
            WE DON’T BEGIN WITH PRODUCTION.<br />
            <span className="text-primary">WE BEGIN BY FINDING THE STORY WORTH PRODUCING.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
            Start with a Story Opportunity Sprint. Validate the idea through an Audience Proof Pilot. Scale only when the story earns the right to become a film, series or owned entertainment property.
          </p>
        </div>
      </section>

      {/* ── 3-PHASE PROGRESSION ── */}
      <section className="py-24 px-6 sm:px-12 bg-background border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="eyebrow-text text-xs text-primary font-bold">
                THE 3-PHASE PATHWAY
              </span>
            </div>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-foreground uppercase">
              FROM STRATEGY TO STORY WORLD.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              A disciplined, risk-managed progression that ensures your capital is invested only in stories with verified audience appetite.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Phase 1: FIND THE STORY */}
            <div id="sprint" className="p-8 sm:p-10 rounded-2xl bg-card border-2 border-border hover:border-primary/60 transition-all flex flex-col justify-between shadow-xl scroll-mt-24">
              <div>
                <span className="font-mono text-xs uppercase text-primary font-bold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/40 block w-fit mb-4">
                  PHASE 01 · FIND THE STORY
                </span>
                <h3 className="font-sans text-3xl font-black text-foreground mb-2">
                  Story Opportunity Sprint
                </h3>
                <div className="font-sans text-3xl font-black text-foreground mb-1">
                  $2,500
                </div>
                <span className="text-xs text-primary font-mono block mb-4">
                  100% credited toward production over $15K
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Before producing anything, discover which story your audience may actually care about. This is not a “production package.” It is a strategic decision product.
                </p>

                <div className="space-y-2.5 mb-8 text-xs text-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Brand, audience & cultural opportunity analysis</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Three original story territories & core premises</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>One selected concept developed into a treatment</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Pilot budget, timeline & success criteria</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Executive presentation with leadership</span>
                  </div>
                </div>
              </div>

              <a
                href="/un1/studios/start?tier=story-sprint"
                className="btn-pill-primary w-full text-center text-xs justify-center"
              >
                <span>DISCOVER OUR STORY OPPORTUNITY</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>

            {/* Phase 2: PROVE THE STORY */}
            <div className="p-8 sm:p-10 rounded-2xl bg-card border-2 border-primary ring-2 ring-primary/40 shadow-2xl flex flex-col justify-between relative group hover:-translate-y-1 transition-all">
              <div className="absolute -top-3.5 left-8 bg-primary text-primary-foreground text-[10px] uppercase font-mono tracking-widest font-black px-3.5 py-1 rounded-full">
                AUDIENCE SIGNAL TEST
              </div>
              <div>
                <span className="font-mono text-xs uppercase text-primary font-bold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/40 block w-fit mb-4">
                  PHASE 02 · PROVE THE STORY
                </span>
                <h3 className="font-sans text-3xl font-black text-foreground mb-2">
                  Audience Proof Pilot
                </h3>
                <div className="font-sans text-3xl font-black text-foreground mb-1">
                  From $7,500
                </div>
                <span className="text-xs text-muted-foreground font-mono block mb-4">
                  Target standard: $10,000–$20,000
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Test whether the story deserves a larger investment. The customer is not purchasing 45–90 seconds. They are purchasing evidence. We promise a professionally managed test and a clear decision.
                </p>

                <div className="space-y-2.5 mb-8 text-xs text-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>One selected original concept & full screenplay</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Multiple opening-hook variations for testing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Horizontal (16:9) & vertical (9:16) launch versions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Audience testing plan on agreed digital channels</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Clear scale, revise, or stop decision report</span>
                  </div>
                </div>
              </div>

              <a
                href="/un1/studios/start?tier=proof-pilot"
                className="btn-pill-primary w-full text-center text-xs justify-center"
              >
                <span>TEST A STORY WITH MYTHRA</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>

            {/* Phase 3: OWN THE STORY WORLD */}
            <div className="p-8 sm:p-10 rounded-2xl bg-card border-2 border-border hover:border-foreground/50 transition-all flex flex-col justify-between shadow-xl">
              <div>
                <span className="font-mono text-xs uppercase text-primary font-bold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/40 block w-fit mb-4">
                  PHASE 03 · OWN THE STORY WORLD
                </span>
                <h3 className="font-sans text-3xl font-black text-foreground mb-2">
                  Original Entertainment Partnership
                </h3>
                <div className="font-sans text-3xl font-black text-foreground mb-1">
                  Custom Scoped
                </div>
                <span className="text-xs text-muted-foreground font-mono block mb-4">
                  Scoped after story validation
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Turn a validated concept into a story world your company can build on. Series and original-IP partnerships are custom-scoped after the story has been validated.
                </p>

                <div className="space-y-2.5 mb-8 text-xs text-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Original branded entertainment property</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Series & season dramatic architecture</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Reusable character & world digital asset systems</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Localization strategy & worldwide distribution</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Full commercial rights and franchise roadmap</span>
                  </div>
                </div>
              </div>

              <a
                href="/un1/studios/start?tier=story-world"
                className="btn-pill-white w-full text-center text-xs justify-center"
              >
                <span>BUILD AN ORIGINAL STORY WORLD</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEPARATED STRATEGIC PARTNERSHIPS ── */}
      <section className="py-24 px-6 sm:px-12 bg-[var(--surface-dim)] border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <span className="eyebrow-text block mb-2 text-primary font-bold">
              STRATEGIC ALLIANCES
            </span>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-foreground uppercase">
              MEDIA & CO-PRODUCTION PARTNERSHIPS.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              These are not production packages. They are long-term commercial alignments for audience owners, networks, and production investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Partnership 1: License and Localize */}
            <div className="p-8 sm:p-10 rounded-2xl bg-card border-2 border-border shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-secondary border border-primary/30 flex items-center justify-center mb-6 text-primary">
                  <Globe2 className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block mb-2">
                  FOR MEDIA COMPANIES & AUDIENCE OWNERS
                </span>
                <h3 className="font-sans text-3xl font-black text-foreground mb-4">
                  License and Localize MYTHRA Originals
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  License existing MYTHRA stories (such as Mother’s Monster) for your language, channel, or geographic territory. Expand your catalogue with proven AI-native cinema.
                </p>
                <div className="p-4 rounded-xl bg-secondary border border-border mb-8 text-xs text-foreground space-y-2">
                  <strong className="block text-primary font-mono uppercase">
                    Commercial Structures:
                  </strong>
                  <p className="text-muted-foreground">
                    • Minimum guarantee + revenue share<br />
                    • Fixed territory broadcast license<br />
                    • Localization partnership with multi-language dubbing<br />
                    • Exclusive and non-exclusive syndication rights
                  </p>
                </div>
              </div>
              <a
                href="/un1/studios/start?intent=licensing"
                className="btn-pill-primary w-full text-center text-xs justify-center"
              >
                <span>EXPLORE STORY LICENSING</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>

            {/* Partnership 2: Finance or Co-Produce */}
            <div className="p-8 sm:p-10 rounded-2xl bg-card border-2 border-border shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-secondary border border-primary/30 flex items-center justify-center mb-6 text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block mb-2">
                  FOR INVESTORS & STRATEGIC PARTNERS
                </span>
                <h3 className="font-sans text-3xl font-black text-foreground mb-4">
                  Finance or Co-Produce MYTHRA Originals
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Review selected MYTHRA story worlds, upcoming production slates, and global distribution opportunities. This is an executive governance process with dedicated financial modeling.
                </p>
                <div className="p-4 rounded-xl bg-secondary border border-border mb-8 text-xs text-foreground space-y-2">
                  <strong className="block text-primary font-mono uppercase">
                    Evaluation & Access Process:
                  </strong>
                  <p className="text-muted-foreground">
                    • Application and executive qualification<br />
                    • Confidential private slate presentation<br />
                    • Project economics, audience testing data, and modeling<br />
                    • Co-production term sheets and risk governance
                  </p>
                </div>
              </div>
              <a
                href="/un1/studios/start?intent=slate"
                className="btn-pill-white w-full text-center text-xs justify-center"
              >
                <span>REQUEST A PRIVATE SLATE CONVERSATION</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion
        title="STUDIO ENGAGEMENT FAQ"
        subtitle="Commercial terms, IP ownership, rights clearance, and production schedules."
        items={faqs}
      />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA
        label="MYTHRA STUDIOS · Story Sprint"
        price="$2,500"
        href="/un1/studios/start?tier=story-sprint"
      />
    </div>
  );
}
