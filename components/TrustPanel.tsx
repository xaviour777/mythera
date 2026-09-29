'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Trash2, Sliders, Ban, ArrowRight } from 'lucide-react';

export default function TrustPanel() {
  const commitments = [
    {
      icon: Lock,
      title: 'Private, Encrypted Storage',
      desc: 'Your photos and voice clips are never stored in public buckets, never exposed to search engines, and only accessed via short-lived signed URLs.',
    },
    {
      icon: Ban,
      title: 'Zero Model Training by Default',
      desc: 'We never train public, foundation, or third-party AI models on your face or voice. Model training opt-in is strictly separate and disabled by default.',
    },
    {
      icon: ShieldCheck,
      title: 'Explicit Multi-Step Authorization',
      desc: 'We require documented consent from every depicted adult and strict guardian authorization for minors. Public figures and non-consenting parties are rejected.',
    },
    {
      icon: Trash2,
      title: 'Right to Deletion & Data Purge',
      desc: 'Once your film is completed and approved, you can choose automated asset purging after 30 days or request immediate permanent deletion at any time.',
    },
  ];

  return (
    <section className="py-20 px-6 sm:px-12 bg-[#000000] border-t border-[#ffffff15]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#d8ff44]" />
            <span className="eyebrow-text text-xs text-[#d8ff44]">
              LIKENESS SECURITY & ETHICAL AI
            </span>
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-[#f3f3eb] uppercase leading-tight">
            YOUR LIKENESS IS NOT A PROMPT FOR ANYONE ELSE.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#9ea399] leading-relaxed">
            MYTHRA treats likeness and voice as protected personal assets. We operate under strict purpose limitation, zero automated training leaks, and complete customer deletion rights.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {commitments.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="p-8 bg-[#080a08] border-2 border-[#ffffff15] hover:border-[#d8ff44] rounded-2xl transition-all shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-[#0d100c] border border-[#d8ff44]/30 flex items-center justify-center mb-6 text-[#d8ff44]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#f3f3eb] mb-2 font-sans">
                  {c.title}
                </h3>
                <p className="text-xs text-[#9ea399] leading-relaxed">
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Expectation & Legal Notice Box */}
        <div className="p-8 bg-[#080a08] border-2 border-[#ffffff15] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#f3f3eb] uppercase tracking-wider mb-2 font-mono">
              <Sliders className="w-4 h-4 text-[#d8ff44]" />
              <span>Creative Style & Likeness Expectation Notice</span>
            </div>
            <p className="text-xs text-[#9ea399] max-w-3xl leading-relaxed">
              MYTHRA films are stylized cinematic expressions, not synthetic counterfeit clones. We balance recognizable likeness with dramatic world aesthetic, lighting, and genre stylization.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="/un1/legal/likeness-consent"
              className="btn-pill-secondary text-xs !py-2.5 !px-5 inline-flex items-center gap-2"
            >
              <span>Read Likeness Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
