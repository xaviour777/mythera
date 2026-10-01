import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function LikenessConsentLegalPage() {
  return (
    <div className="pt-28 pb-20 px-6 sm:px-8 bg-[#000000] text-[#F4F0E8]">
      <div className="max-w-4xl mx-auto">
        <a href="/un1" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A7A39B] hover:text-[#d8ff44] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Studio
        </a>

        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-[#d8ff44]" />
          <span className="eyebrow-text text-[#d8ff44]">LEGAL & ETHICAL PROTOCOL</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase mb-4">
          LIKENESS & VOICE AUTHORIZATION POLICY
        </h1>
        <p className="text-xs text-[#A7A39B] mb-12">
          Effective Date: August 15, 2026 &bull; Version 1.0 (Strict Purpose Limitation)
        </p>

        <div className="space-y-10 text-xs sm:text-sm text-[#A7A39B] leading-relaxed border-t border-[#ffffff15] pt-8">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#F4F0E8] mb-3">1. Mandatory Consent Requirement</h2>
            <p>
              MYTHRA requires explicit, documented authorization for every identifiable individual whose facial structure, voice, or biographical likeness appears in a produced film. We reject all commissions involving non-consenting public figures, unauthorized third parties, or synthetic defamation.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-[#F4F0E8] mb-3">2. Representation of Minors</h2>
            <p>
              Depiction of individuals under 18 years of age requires documented verified parent or legal guardian consent. We enforce strict content guidelines prohibiting any depiction of minors in violent, hazardous, or compromising scenarios.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-[#F4F0E8] mb-3">3. Private Storage & Non-Training Guarantee</h2>
            <p>
              All customer-uploaded reference photographs and audio voice recordings are placed directly into private, encrypted cloud storage buckets accessed strictly via temporary short-lived signed URLs. <strong>By default, MYTHRA does not train public, foundation, or third-party AI models on customer likeness or voice assets.</strong>
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-[#F4F0E8] mb-3">4. Right to Deletion & Consent Withdrawal</h2>
            <p>
              Any authorized subject may withdraw consent or request the immediate permanent deletion of their source media assets and generative seeds by submitting a request to <span className="text-[#d8ff44]">privacy@mythra.com</span>. Deletions are processed within 7 business days.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-[#F4F0E8] mb-3">5. Prohibited Uses & Zero-Tolerance Violations</h2>
            <p>
              Prohibited uses include political persuasion/impersonation, deceptive corporate endorsements, explicit adult content, hate speech, and harassment. Any attempt to use MYTHRA systems for fraudulent impersonation will result in immediate termination without refund and reporting to relevant legal authorities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
