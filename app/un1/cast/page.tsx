'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Clapperboard,
  Shield,
  Film,
  Users,
} from 'lucide-react';
import { mythraOffers } from '../../../lib/offers';

const ROLE_OPTIONS = [
  { id: 'fan-cameo', label: 'Visual Cameo ($500)', tier: 'Fan Cameo', price: '$500' },
  { id: 'speaking-character', label: 'Speaking Character ($2,500)', tier: 'Speaking Character', price: '$2,500' },
  { id: 'featured-character', label: 'Featured Character ($7,500)', tier: 'Featured Character', price: '$7,500' },
  { id: 'guest-hero', label: 'Episode Guest Hero ($15,000+)', tier: 'Episode Guest Hero', price: '$15,000+' },
  { id: 'lower-priced', label: 'I want a lower-priced fan experience', tier: 'Fan Experience', price: 'Under $500' },
];

export default function CastApplicationPage() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get('tier') || 'fan-cameo';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    country: '',
    socialProfile: '',
    preferredRole: initialTier,
    whyStoryMatters: '',
    budgetReadiness: 'ready_now',
    consentGiven: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get('tier')) {
      setFormData((prev) => ({ ...prev, preferredRole: searchParams.get('tier') || prev.preferredRole }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Store in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('mythra_cast_applications') || '[]');
      existing.push({
        ...formData,
        id: 'cast_' + Date.now(),
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('mythra_cast_applications', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    // Capture in GoHighLevel & CRM automation
    const nameParts = (formData.fullName || '').trim().split(/\s+/);
    const selectedOffer = mythraOffers.cast.find((c) => c.id.replace('cast-', '') === formData.preferredRole) || mythraOffers.cast[0];
    const roleTag = 'MYTHRA_CAST_' + (formData.preferredRole || 'cameo').toUpperCase().replace(/-/g, '_');

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: 'YOU',
          contact: {
            fullName: formData.fullName,
            firstName: nameParts[0] || 'Applicant',
            lastName: nameParts.slice(1).join(' ') || '',
            email: formData.email,
            whatsapp: formData.whatsapp,
            country: formData.country,
            website: formData.socialProfile,
            message: formData.whyStoryMatters,
            consentMarketing: formData.consentGiven,
          },
          answers: {
            door: 'cast',
            doorTitle: 'A ROLE INSIDE MYTHRA (Mother’s Monster Casting)',
            preferredRole: formData.preferredRole,
            recommendedOffer: selectedOffer.name,
            budgetReadiness: formData.budgetReadiness,
            socialProfile: formData.socialProfile,
            whyStoryMatters: formData.whyStoryMatters,
            ghlTag: roleTag,
          },
        }),
      });
    } catch (err) {
      console.error('GHL casting application error:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Eyebrow & Headline */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/40 text-primary text-xs font-mono font-bold uppercase tracking-widest mb-4">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Official Canon Casting Call · Mother’s Monster Universe</span>
          </div>

          <h1 className="font-sans text-4xl sm:text-6xl font-black tracking-tight uppercase leading-tight text-foreground">
            WOULD YOU ENTER THE NEXT <br className="hidden sm:inline" />
            <span className="text-primary">MOTHER’S MONSTER</span> STORY?
          </h1>

          <p className="mt-4 text-base sm:text-xl font-bold text-foreground">
            Your face. Your character. Your optional verified voice.
          </p>

          <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            You watched the story. Now become permanent canon inside an upcoming MYTHRA Original. Selected viewers are integrated directly into upcoming episodes.
          </p>
        </div>

        {/* 4 Tier Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {mythraOffers.cast.map((c) => {
            const isSelected = formData.preferredRole === c.id.replace('cast-', '');
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => setFormData({ ...formData, preferredRole: c.id.replace('cast-', '') })}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'bg-card border-primary ring-2 ring-primary/40 shadow-xl'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-primary">
                    {c.name}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
                <div className="font-sans text-2xl font-black text-foreground">
                  {c.priceDisplay}
                </div>
                <span className="text-[10px] text-muted-foreground font-mono block mt-1">
                  Availability: {c.availability}
                </span>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {c.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Story Governance Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1 font-mono">
              <Shield className="w-4 h-4" /> Story Governance Policy
            </div>
            <strong className="text-foreground text-base sm:text-lg block">
              “Your life can inspire the character. MYTHRA protects the story.”
            </strong>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Buyers receive likeness and character input consultation. MYTHRA retains final screenplay, edit, and universe ownership to ensure cinematic quality is never compromised.
            </p>
          </div>
          <Link
            href="/un1/legal/likeness-consent"
            className="text-xs text-primary hover:underline font-mono shrink-0"
          >
            Likeness Policy &rarr;
          </Link>
        </div>

        {/* The Application Form */}
        <div className="p-8 sm:p-12 rounded-3xl bg-card border-2 border-border shadow-2xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="font-sans text-2xl sm:text-3xl font-black text-foreground uppercase">
                  Apply for the Next Casting Cycle
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Fill in your details below. Each role requires identity verification and director review.
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary mb-3">
                  1. Select Your Desired Role Tier *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLE_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.preferredRole === opt.id
                          ? 'border-primary bg-primary/10 text-foreground font-bold'
                          : 'border-border bg-secondary hover:border-primary/50 text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="preferredRole"
                          value={opt.id}
                          checked={formData.preferredRole === opt.id}
                          onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value })}
                          className="accent-[#d8ff44]"
                        />
                        <span className="text-sm">{opt.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    WhatsApp / Direct Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Country of Residence *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. United States, United Kingdom, India..."
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Social Profile */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Public Social Profile / Portfolio URL (Instagram, X, YouTube, LinkedIn)
                </label>
                <input
                  type="url"
                  value={formData.socialProfile}
                  onChange={(e) => setFormData({ ...formData, socialProfile: e.target.value })}
                  placeholder="https://instagram.com/yourhandle or https://x.com/yourhandle"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Why the Story Matters */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Why does the Mother’s Monster story / MYTHRA universe matter to you? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.whyStoryMatters}
                  onChange={(e) => setFormData({ ...formData, whyStoryMatters: e.target.value })}
                  placeholder="Tell us what connected with you, or what personality/traits you'd bring into the story world..."
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none resize-none"
                />
              </div>

              {/* Budget Readiness */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Budget Readiness & Timing *
                </label>
                <select
                  value={formData.budgetReadiness}
                  onChange={(e) => setFormData({ ...formData, budgetReadiness: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                >
                  <option value="ready_now">Ready to proceed immediately upon qualification</option>
                  <option value="next_month">Ready within 30 days for upcoming episode slot</option>
                  <option value="exploring">Exploring options and waiting for lower-priced drops</option>
                </select>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consentGiven}
                    onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                    className="mt-1 accent-[#d8ff44] w-4 h-4 rounded"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    I confirm that I am applying on behalf of myself (or an authorized individual), agree to the likeness consent standards, and understand that MYTHRA protects story integrity and narrative canon.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-pill-primary w-full text-center text-sm !py-4 justify-center"
              >
                <span>{submitting ? 'Submitting Application...' : 'APPLY TO BECOME THE NEXT CHARACTER'}</span>
                <Send className="w-4 h-4 ml-1" />
              </button>
            </form>
          ) : (
            <div className="text-center py-10 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="font-sans text-3xl sm:text-4xl font-black text-foreground uppercase mb-2">
                APPLICATION RECEIVED · THANK YOU!
              </h3>
              <p className="text-primary font-mono text-xs uppercase font-bold tracking-wider mb-4">
                Role: {formData.preferredRole.toUpperCase()} · Status: In Priority Review
              </p>
              <div className="max-w-xl mx-auto p-5 rounded-2xl bg-secondary border border-border text-left mb-6">
                <p className="text-xs sm:text-sm text-foreground leading-relaxed font-semibold">
                  Thank you, {formData.fullName}. Your casting application has been registered into the MYTHRA production queue.
                </p>
                <div className="mt-3 p-3 bg-background/80 rounded-xl border border-primary/40">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-primary font-mono uppercase">Action Required:</strong> We have sent an instant confirmation email to <strong className="text-foreground">{formData.email}</strong>. <strong className="text-foreground">Please reply to that email within 24 hours</strong> to verify your likeness rights and confirm your availability for Episode 02 production.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/un1/checkout"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const res = await fetch('/api/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          offerCode: 'CAST_' + formData.preferredRole.toUpperCase().replace(/-/g, '_'),
                          customerEmail: formData.email,
                          customerName: formData.fullName,
                        }),
                      });
                      const data = (await res.json()) as { url?: string };
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        window.location.href = 'https://whop.com';
                      }
                    } catch {
                      window.location.href = 'https://whop.com';
                    }
                  }}
                  className="btn-pill-primary text-xs !py-3.5 !px-8 cursor-pointer"
                >
                  <span>Proceed to Reservation / Whop Checkout &rarr;</span>
                </a>
                <Link
                  href="/un1/you"
                  className="btn-pill-secondary text-xs !py-3.5 !px-6"
                >
                  Return to MYTHRA YOU
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
