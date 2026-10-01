'use client';

import React, { useState } from 'react';
import { evaluateLead, LeadContact, PersonaType, ScoringResult } from '@/lib/lead-scoring';
import { buildGhlContactPayload, buildGhlOpportunityPayload } from '@/lib/ghl-mapping';
import { ShieldCheck, Play, RefreshCw, Sparkles, CheckCircle2, Code, Send } from 'lucide-react';

export default function AdminFunnelTestPage() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('STUDIOS');

  // Interactive Simulator Form States
  const [answers, setAnswers] = useState<Record<string, any>>({
    branch: 'brand',
    budget: '$30K–$75K',
    timeline: 'Within 60 days',
    stage: 'Completed Script / Detailed Brief',
    audienceSize: '10M+',
    isDecisionMaker: true,
    strategicContribution: 'Global Distribution Syndicate',
  });

  const [contact, setContact] = useState<LeadContact>({
    firstName: 'Harrison',
    lastName: 'Ford',
    email: 'harrison@nexusbrands.com',
    whatsapp: '+14155550199',
    country: 'United States',
    organization: 'Nexus Global Media',
    role: 'Chief Marketing Officer',
    website: 'https://nexusbrands.test',
    message: 'We are seeking an original 3-part sci-fi narrative pilot to anchor our Q4 product universe release.',
    consentMarketing: true,
  });

  const [simulatedResult, setSimulatedResult] = useState<ScoringResult>(() =>
    evaluateLead(selectedPersona, answers, contact)
  );

  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Recalculate score on form change
  const handleRecalculate = (updatedPersona: PersonaType, updatedAnswers: any, updatedContact: any) => {
    const res = evaluateLead(updatedPersona, updatedAnswers, updatedContact);
    setSimulatedResult(res);
  };

  const setPreset = (presetName: string) => {
    if (presetName === 'high_value_studio') {
      setSelectedPersona('STUDIOS');
      const newAnswers = {
        branch: 'brand',
        budget: '$75K+',
        timeline: 'Immediate',
        stage: 'Script & Assets Ready',
        audienceSize: '100M+',
        isDecisionMaker: true,
        strategicContribution: 'Global FAST syndication',
      };
      const newContact = {
        firstName: 'Alexandra',
        lastName: 'Sterling',
        email: 'a.sterling@paramountbrands.com',
        whatsapp: '+12125550144',
        country: 'United States',
        organization: 'Paramount Global Ventures',
        role: 'VP Brand Entertainment',
        website: 'https://paramountbrands.test',
        message: 'Looking to produce a high-fidelity 5-minute episodic drama universe with localized worldwide release.',
        consentMarketing: true,
      };
      setAnswers(newAnswers);
      setContact(newContact);
      handleRecalculate('STUDIOS', newAnswers, newContact);
    } else if (presetName === 'you_trailer') {
      setSelectedPersona('YOU');
      const newAnswers = {
        format: 'Trailer',
        star: 'Me',
        genre: 'Fantasy',
        features: ['Face', 'Name', 'Authorized voice'],
      };
      const newContact = {
        firstName: 'Daniel',
        lastName: 'Craig',
        email: 'daniel@example.com',
        whatsapp: '+447911123456',
        country: 'United Kingdom',
        role: 'Individual',
        consentMarketing: true,
      };
      setAnswers(newAnswers);
      setContact(newContact);
      handleRecalculate('YOU', newAnswers, newContact);
    } else if (presetName === 'filmmaker_cohort') {
      setSelectedPersona('FILMMAKER');
      const newAnswers = {
        ambition: 'AI filmmaker',
        currentStage: 'Making films',
        biggestBlock: 'Character consistency',
        timeCommitment: '10+ hrs/week',
        goal90Days: 'Publish portfolio short film',
      };
      const newContact = {
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah@indiefilm.io',
        whatsapp: '+14155550188',
        country: 'Canada',
        organization: 'Chen Cinema Labs',
        role: 'Independent Director',
        consentMarketing: true,
      };
      setAnswers(newAnswers);
      setContact(newContact);
      handleRecalculate('FILMMAKER', newAnswers, newContact);
    }
  };

  const handleTestDispatch = async () => {
    setSyncStatus('Dispatching live API test...');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: selectedPersona,
          answers,
          contact,
          scoring: simulatedResult,
        }),
      });
      const data = (await res.json()) as any;
      setSyncStatus(`Dispatched successfully! Lead ID: ${data.leadId}`);
    } catch (e: any) {
      setSyncStatus(`Dispatch error: ${e.message}`);
    }
  };

  const ghlContactPayload = buildGhlContactPayload(selectedPersona, contact, simulatedResult, answers);
  const ghlOppPayload = buildGhlOpportunityPayload(selectedPersona, contact, simulatedResult);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-8 bg-[#121212] border border-[#262522] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="eyebrow-text block mb-1 text-[#C8965B]">DEBUGGER & SIMULATOR</span>
          <h1 className="font-serif text-3xl font-bold text-[#F4F0E8]">
            Funnel Decision Table & Scoring Simulator
          </h1>
          <p className="text-xs text-[#A7A39B] mt-1">
            Simulate user inputs, inspect weighted scoring rules, verify tag generation, and preview outbound CRM payloads.
          </p>
        </div>

        {/* Preset Triggers */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPreset('high_value_studio')}
            className="px-3 py-1.5 bg-[#1C1B19] hover:bg-[#262522] border border-[#262522] text-xs font-mono text-[#C8965B]"
          >
            Load Studios ($75K+ Lead)
          </button>
          <button
            onClick={() => setPreset('you_trailer')}
            className="px-3 py-1.5 bg-[#1C1B19] hover:bg-[#262522] border border-[#262522] text-xs font-mono text-[#F4F0E8]"
          >
            Load YOU (Trailer Lead)
          </button>
          <button
            onClick={() => setPreset('filmmaker_cohort')}
            className="px-3 py-1.5 bg-[#1C1B19] hover:bg-[#262522] border border-[#262522] text-xs font-mono text-[#A7A39B]"
          >
            Load Filmmaker (Cohort Lead)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Inputs Simulator */}
        <div className="lg:col-span-6 p-6 bg-[#121212] border border-[#262522] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[#F4F0E8]">1. Persona & Inputs Simulator</h2>
            <div className="flex gap-1 text-xs">
              {(['YOU', 'FILMMAKER', 'STUDIOS'] as PersonaType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setSelectedPersona(p);
                    handleRecalculate(p, answers, contact);
                  }}
                  className={`px-3 py-1 font-mono uppercase font-bold rounded ${
                    selectedPersona === p
                      ? 'bg-[#C8965B] text-[#090909]'
                      : 'bg-[#1C1B19] text-[#A7A39B]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Quick inputs for simulation */}
          <div className="space-y-4 text-xs">
            {selectedPersona === 'STUDIOS' && (
              <>
                <div>
                  <label className="block text-[#A7A39B] mb-1 font-mono">STUDIOS BUDGET BAND</label>
                  <select
                    value={answers.budget || '$30K–$75K'}
                    onChange={(e) => {
                      const updated = { ...answers, budget: e.target.value };
                      setAnswers(updated);
                      handleRecalculate(selectedPersona, updated, contact);
                    }}
                    className="w-full bg-[#181715] border border-[#262522] p-2 text-[#F4F0E8]"
                  >
                    <option value="$75K+">$75K+ (High Priority +30)</option>
                    <option value="$30K–$75K">$30K–$75K (+30)</option>
                    <option value="$15K–$30K">$15K–$30K (+20)</option>
                    <option value="$7.5K–$15K">$7.5K–$15K (+10)</option>
                    <option value="<$7.5K">&lt;$7.5K (Nurture +0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7A39B] mb-1 font-mono">TIMELINE READINESS</label>
                  <select
                    value={answers.timeline || 'Within 60 days'}
                    onChange={(e) => {
                      const updated = { ...answers, timeline: e.target.value };
                      setAnswers(updated);
                      handleRecalculate(selectedPersona, updated, contact);
                    }}
                    className="w-full bg-[#181715] border border-[#262522] p-2 text-[#F4F0E8]"
                  >
                    <option value="Within 60 days">Within 60 days (+20)</option>
                    <option value="Immediate">Immediate (+20)</option>
                    <option value="Exploring for next year">Exploring for next year (+0)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-[#A7A39B] mb-1 font-mono">CORPORATE EMAIL (NON-FREE DOMAIN)</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => {
                  const updated = { ...contact, email: e.target.value };
                  setContact(updated);
                  handleRecalculate(selectedPersona, answers, updated);
                }}
                className="w-full bg-[#181715] border border-[#262522] p-2 text-[#F4F0E8]"
              />
            </div>

            <div>
              <label className="block text-[#A7A39B] mb-1 font-mono">ORGANIZATION / COMPANY</label>
              <input
                type="text"
                value={contact.organization || ''}
                onChange={(e) => {
                  const updated = { ...contact, organization: e.target.value };
                  setContact(updated);
                  handleRecalculate(selectedPersona, answers, updated);
                }}
                className="w-full bg-[#181715] border border-[#262522] p-2 text-[#F4F0E8]"
              />
            </div>
          </div>
        </div>

        {/* Right Output: Score & GHL Tags */}
        <div className="lg:col-span-6 space-y-6">
          {/* Score Card */}
          <div className="p-6 bg-[#181715] border-2 border-[#C8965B]">
            <span className="eyebrow-text block mb-1 text-[#C8965B]">CALCULATED SCORE & CATEGORY</span>
            <div className="flex items-center justify-between mb-4">
              <div className="font-serif text-5xl font-bold text-[#F4F0E8]">
                {simulatedResult.score} <span className="text-sm font-mono text-[#A7A39B]">PTS</span>
              </div>
              <span className={`px-4 py-1 text-xs uppercase font-extrabold tracking-widest ${
                simulatedResult.category === 'priority'
                  ? 'bg-[#6B1F2A] text-white'
                  : simulatedResult.category === 'qualified'
                  ? 'bg-[#C8965B] text-[#090909]'
                  : 'bg-[#262522] text-[#A7A39B]'
              }`}>
                {simulatedResult.category} LEAD
              </span>
            </div>

            <div className="space-y-1 text-xs text-[#A7A39B] border-t border-[#262522] pt-3">
              <div>Recommended Offer: <strong className="text-[#F4F0E8]">{simulatedResult.recommendedOffer.name}</strong></div>
              <div>Pipeline Stage: <strong className="text-[#C8965B] font-mono">{simulatedResult.pipelineStage}</strong></div>
            </div>

            {/* Generated CRM Tags */}
            <div className="mt-4 pt-3 border-t border-[#262522]">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#A7A39B] block mb-2">
                ACTIVE GHL TAGS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {simulatedResult.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-[#121212] border border-[#262522] text-[10px] font-mono text-[#C8965B]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Test Dispatch Button */}
          <div className="flex items-center justify-between gap-4 p-4 bg-[#121212] border border-[#262522]">
            <button
              onClick={handleTestDispatch}
              className="bg-[#C8965B] hover:bg-[#d8a66b] text-[#090909] px-6 py-2.5 text-xs uppercase font-bold tracking-widest inline-flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Test Live Dispatch to API</span>
            </button>
            {syncStatus && <span className="text-xs text-[#C8965B] font-mono">{syncStatus}</span>}
          </div>

          {/* Outbound CRM Payload Preview */}
          <div className="p-4 bg-[#121212] border border-[#262522]">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#A7A39B] block mb-2">
              OUTBOUND GHL PAYLOAD PREVIEW (JSON)
            </span>
            <pre className="text-[11px] font-mono bg-[#090909] p-3 border border-[#262522] overflow-x-auto text-[#A7A39B] max-h-48">
              {JSON.stringify({ contact: ghlContactPayload, opportunity: ghlOppPayload }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
