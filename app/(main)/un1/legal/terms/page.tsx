import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="pt-28 pb-20 px-6 sm:px-8 bg-[#000000] text-[#F4F0E8]">
      <div className="max-w-4xl mx-auto">
        <a href="/un1" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A7A39B] hover:text-[#d8ff44] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Studio
        </a>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase mb-4">
          TERMS OF SERVICE & CREATIVE EXPECTATIONS
        </h1>
        <p className="text-xs text-[#A7A39B] mb-12">
          Effective Date: August 2026 &bull; MYTHRA Studio Inc.
        </p>

        <div className="space-y-8 text-xs sm:text-sm text-[#A7A39B] leading-relaxed border-t border-[#ffffff15] pt-8">
          <h2 className="font-serif text-xl font-bold text-[#F4F0E8]">1. Creative Scope & Stylization Notice</h2>
          <p>
            MYTHRA produces stylized narrative cinema using cutting-edge AI-native workflows. The customer acknowledges that productions are creative artistic interpretations and does not guarantee counterfeit photorealism.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#F4F0E8]">2. Revisions & Approvals</h2>
          <p>
            Standard orders include consolidated revision rounds as defined in the offer tier (e.g., 1 round for Moment, 2 rounds for Trailer). Additional revision rounds or major screenplay direction changes following draft lock are billed at standard studio hourly rates.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#F4F0E8]">3. Commercial vs. Personal Rights</h2>
          <p>
            Personal orders (MYTHRA YOU) grant personal, non-exclusive, non-commercial display rights. Commercial advertising and broadcast rights must be licensed under a separate studio agreement.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#F4F0E8]">4. Cancellation & Refund Policy</h2>
          <p>
            For fixed-price orders, refunds are available in full prior to the commencement of active asset generation and screenplay drafting. Once pre-production and generation begins, production deposits are non-refundable.
          </p>
        </div>
      </div>
    </div>
  );
}
