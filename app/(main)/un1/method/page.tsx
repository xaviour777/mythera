'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PathSelector from '@/components/PathSelector';
import { ArrowRight, ChevronRight, Layers, Sparkles } from 'lucide-react';

const METHOD_STEPS = [
  {
    num: '01',
    name: 'Audience Psychology',
    summary: 'Understand what your audience feels, fears, and hopes for before writing a single prompt.',
    detail: 'We dissect the emotional baseline of the target viewer. Every drama must confront a universal human dilemma: sacrifice, redemption, love, or the price of ambition.',
  },
  {
    num: '02',
    name: 'The Drama Method',
    summary: 'Build narrative tension through high-stakes choices where every decision has an irreversible consequence.',
    detail: 'We reject passive exposition. The Drama Method forces the protagonist into escalating moral dilemmas, ensuring audience retention remains high across long-form runtimes.',
  },
  {
    num: '03',
    name: 'The Story Engine',
    summary: 'Develop an original premise into an extensible world that can sustain recurring episodic stories.',
    detail: 'A story engine produces endless dramatic friction by locking contrasting world rules and character desires into a single narrative arena.',
  },
  {
    num: '04',
    name: 'Character & World Bible',
    summary: 'Keep character identity, costume, lighting, and behavior coherent across 50+ scenes.',
    detail: 'We establish multi-angle image seeds, lighting schemas, and costume parameters that guarantee facial identity locks across complex camera angles.',
  },
  {
    num: '05',
    name: 'Storyboard & Shot System',
    summary: 'Turn a deliberate screenplay into controlled visual framing, lens selections, and camera motions.',
    detail: 'We specify lens focal lengths (24mm, 50mm, 85mm anamorphic), camera movements (push-in, orbit, tracking), and depth of field before generating a single frame.',
  },
  {
    num: '06',
    name: 'AI-Native Production',
    summary: 'Generate high-fidelity visual and motion assets using controlled diffusion pipelines.',
    detail: 'Tools change every month; our prompt structures and motion anchors remain stable across generative models.',
  },
  {
    num: '07',
    name: 'Long-Form Edit & Sound Design',
    summary: 'Shape emotional rhythm, dialogue cadence, and orchestral score into a coherent master cut.',
    detail: 'Audio carries 60% of emotional weight. We compose custom leitmotifs, realistic room acoustics, and Foley that pull the viewer directly into the scene.',
  },
  {
    num: '08',
    name: 'Audience Testing',
    summary: 'Read audience drop-off and engagement telemetry to identify which story choices resonate.',
    detail: 'We test rough cuts against initial audience cohorts to measure retention curves and refine pacing before wide release.',
  },
  {
    num: '09',
    name: 'Translation & Localization',
    summary: 'Carry the cultural meaning and emotion of the story into international languages.',
    detail: 'Translation is not word substitution; it is cultural adaptation. We match localized idiom, nuance, and emotional cadence.',
  },
  {
    num: '10',
    name: 'Distribution Network',
    summary: 'Syndicate the right cut across social networks, YouTube channels, and streaming platforms.',
    detail: 'We optimize masters for both 16:9 cinematic screens and 9:16 vertical feeds with native aspect ratio framing.',
  },
  {
    num: '11',
    name: 'Audience Feedback Loop',
    summary: 'Use comment responses and metrics to refine future creative decisions.',
    detail: 'Audience response is not just data—it is creative feedback for the next story beat.',
  },
  {
    num: '12',
    name: 'The Next Story',
    summary: 'Carry what was learned directly into the next original production.',
    detail: 'Each completed film compounds our asset library, character consistency bibles, and production speed.',
  },
];

export default function MethodPage() {
  const [activeStep, setActiveStep] = useState(0);
  const current = METHOD_STEPS[activeStep];

  return (
    <div className="pt-24 pb-20 bg-[#000000] text-[#F4F0E8]">
      {/* Hero */}
      <section className="py-20 px-6 sm:px-8 border-b border-[#ffffff15]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="eyebrow-text block mb-3 text-[#d8ff44]">THE PRODUCTION ARCHITECTURE</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold uppercase tracking-tight leading-tight">
            THE DRAMA METHOD
          </h1>
          <p className="mt-4 font-serif text-xl sm:text-2xl text-[#d8ff44] italic font-normal">
            &ldquo;The tools will change. The story system remains.&rdquo;
          </p>
          <p className="mt-6 text-sm sm:text-base text-[#A7A39B] max-w-2xl mx-auto leading-relaxed">
            A high-level overview of MYTHRA’s 12-step proprietary story engine, character consistency framework, and global distribution loop.
          </p>
        </div>
      </section>

      {/* Interactive 12-Step Explorer */}
      <section className="py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Step List */}
          <div className="lg:col-span-6 space-y-2">
            {METHOD_STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#080a08] border-2 border-[#d8ff44] text-[#F4F0E8] shadow-lg shadow-[#d8ff44]/10'
                      : 'bg-[#080a08] border border-[#ffffff15] text-[#A7A39B] hover:border-[#d8ff44]/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#d8ff44] font-bold">
                      {step.num}
                    </span>
                    <span className="text-sm font-semibold">
                      {step.name}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-[#d8ff44] translate-x-1' : 'text-[#8e9587]'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Stage Detail Box (Sticky) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 h-fit">
            <div className="p-8 sm:p-12 bg-[#080a08] border-2 border-[#d8ff44] rounded-2xl shadow-2xl relative shadow-[#d8ff44]/10">
              <span className="font-mono text-6xl sm:text-8xl font-bold text-[#d8ff44]/15 absolute top-4 right-8 select-none">
                {current.num}
              </span>
              <span className="film-credit text-[#d8ff44] block mb-2">STAGE {current.num}</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F4F0E8] mb-4">
                {current.name}
              </h2>
              <p className="text-sm sm:text-base font-semibold text-[#F4F0E8] mb-6 leading-relaxed">
                {current.summary}
              </p>
              <div className="pt-6 border-t border-[#ffffff15] text-xs sm:text-sm text-[#A7A39B] leading-relaxed">
                {current.detail}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Commercial Doors */}
      <PathSelector />
    </div>
  );
}
