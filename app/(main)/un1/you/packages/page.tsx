'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { mythraOffers } from '@/lib/offers';
import OfferCard from '@/components/OfferCard';

export default function YouPackagesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/un1/you"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Story Finder</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="eyebrow-text font-mono block mb-2">COMPLETE OFFER CATALOG</span>
          <h1 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-foreground uppercase">
            COMPARE ALL EXPERIENCES.
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Whether you want a private film tailored around your milestone, or official canon casting inside an upcoming MYTHRA Original.
          </p>
        </div>

        {/* Section 1: Personalized Cinema Packages */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <div>
              <span className="font-mono text-xs uppercase text-primary font-bold">OPTION A</span>
              <h2 className="font-sans text-2xl sm:text-3xl font-black text-foreground">
                Personal Cinema (Made for You)
              </h2>
            </div>
            <Link
              href="/un1/you?intent=personal"
              className="text-xs text-primary font-mono hover:underline hidden sm:inline"
            >
              Take Guided Quiz &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {mythraOffers.you.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>

        {/* Section 2: Official Story Universe (MYTHRA CAST) */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <div>
              <span className="font-mono text-xs uppercase text-primary font-bold">OPTION B</span>
              <h2 className="font-sans text-2xl sm:text-3xl font-black text-foreground">
                MYTHRA CAST (Official Universe Roles)
              </h2>
            </div>
            <Link
              href="/un1/cast"
              className="text-xs text-primary font-mono hover:underline hidden sm:inline"
            >
              Open Casting Call &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {mythraOffers.cast.map((tier) => (
              <OfferCard key={tier.id} offer={tier} />
            ))}
          </div>
        </div>

        {/* Add-ons Row */}
        <div className="p-8 bg-card border-2 border-border rounded-2xl shadow-xl">
          <h3 className="font-sans text-2xl font-black text-foreground mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>Available Production Add-Ons</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {mythraOffers.youAddOns.map((addon) => (
              <div key={addon.id} className="p-5 bg-secondary rounded-xl border border-border">
                <strong className="block text-foreground text-sm mb-1">{addon.name}</strong>
                <span className="text-primary font-mono font-bold block mb-2">{addon.priceDisplay}</span>
                <p className="text-muted-foreground">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA to Finder */}
        <div className="mt-16 text-center">
          <Link
            href="/un1/you"
            className="btn-pill-primary text-xs !py-3 !px-8"
          >
            <span>Need Help Choosing? Use the Guided Story Finder</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
