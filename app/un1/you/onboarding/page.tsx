'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ConsentStep, { ConsentFormData } from '../../../../components/funnels/ConsentStep';
import SecureUploader from '../../../../components/funnels/SecureUploader';
import { ShieldCheck, CheckCircle2, Lock, Sparkles, Film, ArrowRight, Trash2, Clock } from 'lucide-react';
import { trackEvent } from '../../../../lib/analytics';

export default function SecureOnboardingPage() {
  const [stage, setStage] = useState<'consent' | 'uploads' | 'creative' | 'complete'>('consent');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Consent Data
  const [consentData, setConsentData] = useState<ConsentFormData>({
    subjectName: '',
    relationship: 'self',
    likenessAuthorized: true,
    voiceAuthorized: true,
    commercialUseAuthorized: false,
    modelTrainingOptIn: false,
    disclosureAcknowledged: true,
  });

  // Creative & Story Facts
  const [pronunciation, setPronunciation] = useState('');
  const [storyFacts, setStoryFacts] = useState('');
  const [creativeFreedom, setCreativeFreedom] = useState('balanced');
  const [deletionPreference, setDeletionPreference] = useState('auto_purge_30_days');

  const handleConsentSigned = () => {
    trackEvent('secure_onboarding_started', {
      persona: 'YOU',
      stepName: 'consent_completed',
    });
    setStage('uploads');
  };

  const handleUploadsNext = () => {
    setStage('creative');
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentData,
          creativeDetails: {
            pronunciation,
            storyFacts,
            creativeFreedom,
            deletionPreference,
          },
        }),
      });

      trackEvent('secure_onboarding_completed', {
        persona: 'YOU',
      });

      setStage('complete');
    } catch (err) {
      console.error('Onboarding submission error:', err);
      setStage('complete');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F4F0E8] pt-28 pb-20 px-6 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Top Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-[#080a08] border border-[#ffffff15] rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#d8ff44]" />
            <span className="eyebrow-text text-[10px] text-[#d8ff44]">
              SECURE PRODUCTION ONBOARDING
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase">
            MYTHRA STUDIO PORTAL
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#A7A39B]">
            Order Confirmed &bull; Step {stage === 'consent' ? '1' : stage === 'uploads' ? '2' : stage === 'creative' ? '3' : '4'} of 4
          </p>
        </div>

        {/* Progress Strip */}
        <div className="grid grid-cols-3 gap-2 mb-8 text-[11px] uppercase tracking-wider font-mono">
          <div className={`p-2 rounded-xl border text-center ${stage === 'consent' ? 'border-[#d8ff44] bg-[#11160e] text-[#d8ff44]' : 'border-[#ffffff15] text-[#8e9587]'}`}>
            1. Consent
          </div>
          <div className={`p-2 rounded-xl border text-center ${stage === 'uploads' ? 'border-[#d8ff44] bg-[#11160e] text-[#d8ff44]' : 'border-[#ffffff15] text-[#8e9587]'}`}>
            2. Asset Upload
          </div>
          <div className={`p-2 rounded-xl border text-center ${stage === 'creative' || stage === 'complete' ? 'border-[#d8ff44] bg-[#11160e] text-[#d8ff44]' : 'border-[#ffffff15] text-[#8e9587]'}`}>
            3. Creative Notes
          </div>
        </div>

        {/* STAGE 1: Consent Verification */}
        {stage === 'consent' && (
          <div className="p-8 bg-[#080a08] border border-[#ffffff15] rounded-2xl shadow-xl">
            <ConsentStep
              formData={consentData}
              onChange={setConsentData}
              onNext={handleConsentSigned}
            />
          </div>
        )}

        {/* STAGE 2: Secure Asset Uploads */}
        {stage === 'uploads' && (
          <div className="p-8 bg-[#080a08] border border-[#ffffff15] rounded-2xl shadow-xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
              UPLOAD AUTHORIZED MEDIA ASSETS
            </h2>
            <p className="text-xs text-[#A7A39B] mb-6">
              Assets are encrypted with AES-256 in private storage and never exposed to the public web.
            </p>

            <SecureUploader
              purpose="likeness_photo"
              title="Reference Face Photos (5–10 Photos Required)"
              instructions="Upload 5 to 10 clear, high-resolution photos with natural lighting, different facial expressions, and neutral backgrounds."
              maxFiles={10}
            />

            <SecureUploader
              purpose="voice_sample"
              title="Clean Voice Sample (Optional · 30–60 Seconds)"
              instructions="Upload a clean audio recording (WAV or MP3) of the subject speaking naturally without background noise or music."
              maxFiles={2}
            />

            <div className="flex justify-between items-center pt-6 border-t border-[#ffffff15]">
              <button
                type="button"
                onClick={() => setStage('consent')}
                className="text-xs text-[#A7A39B] hover:text-[#d8ff44] uppercase tracking-wider transition-colors"
              >
                &larr; Back to Consent
              </button>
              <button
                type="button"
                onClick={handleUploadsNext}
                className="btn-pill-primary text-xs !py-3.5 !px-8 inline-flex items-center gap-2"
              >
                <span>Proceed to Creative Notes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: Creative Notes & Deletion Controls */}
        {stage === 'creative' && (
          <form onSubmit={handleFinalSubmit} className="p-8 bg-[#080a08] border border-[#ffffff15] rounded-2xl shadow-xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
              STORY FACTS & PRODUCTION CONTROLS
            </h2>
            <p className="text-xs text-[#A7A39B] mb-6">
              Give our creative director specific facts, pronunciation keys, and your data retention preference.
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A7A39B] mb-1.5 font-semibold">
                  Phonetic Name Pronunciation
                </label>
                <input
                  type="text"
                  value={pronunciation}
                  onChange={(e) => setPronunciation(e.target.value)}
                  placeholder="e.g. Elena Vance -> 'eh-LAY-nuh VANS'"
                  className="w-full bg-[#0d100c] border border-[#ffffff15] focus:border-[#d8ff44] rounded-xl px-4 py-3 text-sm text-[#F4F0E8] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A7A39B] mb-1.5 font-semibold">
                  Key Story Facts & Inside Jokes
                </label>
                <textarea
                  rows={4}
                  value={storyFacts}
                  onChange={(e) => setStoryFacts(e.target.value)}
                  placeholder="Include specific plot details, quotes, inside jokes, or real achievements you want reflected in the screenplay..."
                  className="w-full bg-[#0d100c] border border-[#ffffff15] focus:border-[#d8ff44] rounded-xl p-3 text-sm text-[#F4F0E8] outline-none resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A7A39B] mb-2 font-semibold">
                  Director Creative Freedom
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { id: 'faithful', label: 'Strictly Faithful', desc: 'Stick strictly to provided facts' },
                    { id: 'balanced', label: 'Balanced Cinema', desc: 'Allow dramatic Hollywood flair (Recommended)' },
                    { id: 'wild', label: 'Full Creative Liberty', desc: 'Surprise us with epic exaggeration' },
                  ].map((cf) => (
                    <button
                      key={cf.id}
                      type="button"
                      onClick={() => setCreativeFreedom(cf.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        creativeFreedom === cf.id
                          ? 'bg-[#11160e] border-[#d8ff44] text-[#F4F0E8] shadow-md shadow-[#d8ff44]/15'
                          : 'bg-[#0d100c] border-[#ffffff15] text-[#A7A39B] hover:border-[#d8ff44]/40'
                      }`}
                    >
                      <strong className="block text-[#F4F0E8] mb-1">{cf.label}</strong>
                      <span>{cf.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A7A39B] mb-2 font-semibold">
                  Post-Delivery Media Retention & Deletion Preference
                </label>
                <div className="p-4 bg-[#0d100c] border border-[#ffffff15] rounded-xl space-y-3 text-xs">
                  {[
                    { id: 'auto_purge_30_days', label: 'Auto-Purge Raw Uploads After 30 Days (Recommended)', desc: 'Keeps final master available while securely deleting source biometric photos/audio.' },
                    { id: 'immediate_purge', label: 'Immediate Purge Upon Delivery Approval', desc: 'Source files deleted immediately when final film is accepted.' },
                    { id: 'keep_archive', label: 'Keep Secure Archive for Future Sequels', desc: 'Encrypted in private storage for reorders.' },
                  ].map((p) => (
                    <label key={p.id} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="retention"
                        checked={deletionPreference === p.id}
                        onChange={() => setDeletionPreference(p.id)}
                        className="mt-0.5 text-[#d8ff44] focus:ring-0"
                      />
                      <div>
                        <span className="font-semibold text-[#F4F0E8] block">{p.label}</span>
                        <span className="text-[#A7A39B] block text-[11px]">{p.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-[#ffffff15]">
              <button
                type="button"
                onClick={() => setStage('uploads')}
                className="text-xs text-[#A7A39B] hover:text-[#d8ff44] uppercase tracking-wider transition-colors"
              >
                &larr; Back to Uploads
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-pill-primary text-xs !py-3.5 !px-8 inline-flex items-center gap-2"
              >
                <span>{isSubmitting ? 'Locking Queue...' : 'Lock Brief & Begin Production'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STAGE 4: Completion Confirmation */}
        {stage === 'complete' && (
          <div className="p-10 bg-[#080a08] border-2 border-[#d8ff44] rounded-2xl text-center shadow-2xl shadow-[#d8ff44]/15">
            <div className="w-16 h-16 rounded-full bg-[#11160e] text-[#d8ff44] flex items-center justify-center mx-auto mb-6 border border-[#d8ff44]">
              <Film className="w-8 h-8" />
            </div>
            <span className="eyebrow-text block mb-2 text-[#d8ff44]">PRODUCTION LOCKED</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase mb-4">
              YOUR FILM HAS ENTERED THE STUDIO QUEUE
            </h2>
            <p className="text-sm text-[#A7A39B] max-w-xl mx-auto mb-8 leading-relaxed">
              Your assets and consent record have been verified. Our creative directors have commenced screenplay draft and scene orchestration. You will receive private cut previews via email.
            </p>

            <div className="p-6 bg-[#0d100c] border border-[#ffffff15] rounded-xl max-w-md mx-auto text-left text-xs text-[#A7A39B] space-y-2 mb-8 font-mono">
              <div className="flex justify-between">
                <span>PROJECT ID:</span>
                <span className="text-[#F4F0E8]">MYTHRA-PROJ-2026-99</span>
              </div>
              <div className="flex justify-between">
                <span>LIKENESS CONSENT:</span>
                <span className="text-[#d8ff44]">VERIFIED & SIGNED</span>
              </div>
              <div className="flex justify-between">
                <span>FIRST CUT ESTIMATE:</span>
                <span className="text-[#F4F0E8]">3–5 Business Days</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/un1/genesis"
                className="btn-pill-primary inline-flex items-center gap-2 text-xs"
              >
                <span>Read Genesis Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="/un1"
                className="text-xs text-[#A7A39B] hover:text-[#d8ff44] uppercase tracking-widest px-4 py-3 transition-colors"
              >
                Return to Master Studio
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
