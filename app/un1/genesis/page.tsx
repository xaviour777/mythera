import React from 'react';
import Link from 'next/link';
import ProofMetric from '../../../components/ProofMetric';
import PathSelector from '../../../components/PathSelector';
import { ShieldCheck, Play, ArrowRight, Clock, DollarSign, Users, Award, ExternalLink } from 'lucide-react';

export default function GenesisCaseStudyPage() {
  const chapters = [
    {
      num: '01',
      title: 'THE HISTORY',
      subtitle: 'From 15-Second Prompts to Sustained Tension',
      content: 'For two years, AI video was defined by 5-second novelty clips, distorted hands, and surreal morphing loops. Creators treated AI as a gimmick. MYTHRA began from a fundamentally different question: can narrative craft, character consistency, and emotional pacing sustain audience attention across a full half-hour drama?',
    },
    {
      num: '02',
      title: 'THE PRODUCTION EXPERIMENT',
      subtitle: 'One Director. 28 Minutes. Under 72 Hours.',
      content: 'In August 2026, a single director executed the Genesis Film experiment. Using the 12-Step Drama Method, a character bible was locked, a three-act screenplay was drafted, and over 400 distinct scenes were generated, graded, scored, and edited in under 72 total production hours.',
    },
    {
      num: '03',
      title: 'THE PRODUCTION ECONOMICS',
      subtitle: 'Sub-$2,000 Experimental Compute Ledger',
      content: 'The total third-party compute, software subscriptions, and licensed audio assets required for the master cut amounted to less than $2,000 USD. This does not represent the commercial price of studio commissions; it demonstrates that production economics have fundamentally inverted. The leverage now belongs entirely to story architecture and audience empathy.',
    },
    {
      num: '04',
      title: 'THE OFFICIAL RELEASE & NETWORK EFFECT',
      subtitle: '50M+ Views in 7 Days on the First Episode Alone',
      content: 'Upon official release on MYTHRA channels, Episode 1 alone generated over 50 million verified views in its first 7 days. Subsequently, authorized translation partners added multi-language distributions across global feeds. Beyond owned properties, community-translated cuts and regional social reposts across Instagram, TikTok, and YouTube accumulated an observed 1B+ reported views across third-party social platforms.',
    },
    {
      num: '05',
      title: 'WHAT WAS LEARNED',
      subtitle: 'Creative, Technical & Audience Realities',
      content: '1. Audiences do not care what tool generated a pixel; they care whether the character has something at stake.\n2. Sound design and voice pacing carry 60% of the emotional retention.\n3. The bottleneck is no longer rendering compute—it is story judgment and editorial discipline.',
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-[#000000] text-[#f3f3eb]">
      {/* Hero */}
      <section className="py-20 px-6 sm:px-8 border-b border-[#ffffff15]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-[#080a08] border border-[#ffffff15] rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#d8ff44]" />
            <span className="eyebrow-text text-[10px] text-[#d8ff44]">
              CASE STUDY 01 · AUDITED EXPERIMENT
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight leading-tight">
            THE GENESIS CASE STUDY
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#a3a89e] max-w-2xl mx-auto leading-relaxed">
            How one creator produced a 28-minute emotional drama in under 72 hours—generating 50M views in 7 days on Episode 1 alone.
          </p>
        </div>
      </section>

      {/* Verified Proof Metrics Strip */}
      <ProofMetric showAll={true} />

      {/* Chapter Scroll Narrative */}
      <section className="py-24 px-6 sm:px-8 max-w-4xl mx-auto">
        <div className="space-y-16">
          {chapters.map((ch) => (
            <div
              key={ch.num}
              className="p-8 sm:p-12 bg-[#080a08] border border-[#ffffff15] hover:border-[#d8ff44]/40 transition-colors rounded-2xl relative"
            >
              <span className="font-mono text-xs text-[#d8ff44] font-bold block mb-2">
                CHAPTER {ch.num}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4F0E8] mb-1">
                {ch.title}
              </h2>
              <span className="film-credit text-xs text-[#A7A39B] block mb-6">
                {ch.subtitle}
              </span>
              <p className="text-sm sm:text-base text-[#A7A39B] leading-relaxed whitespace-pre-line">
                {ch.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Three Commercial Doors Navigation */}
      <PathSelector />
    </div>
  );
}
