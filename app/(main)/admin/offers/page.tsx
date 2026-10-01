'use client';

import React, { useState } from 'react';
import { mythraOffers, OfferTier } from '@/lib/offers';
import { DollarSign, Save } from 'lucide-react';

export default function AdminOffersPage() {
  const [youOffers, setYouOffers] = useState<OfferTier[]>(mythraOffers.you);
  const [filmmakerOffers, setFilmmakerOffers] = useState<OfferTier[]>(mythraOffers.filmmaker);
  const [studiosOffers, setStudiosOffers] = useState<OfferTier[]>(mythraOffers.studios);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handlePriceChange = (
    persona: 'YOU' | 'FILMMAKER' | 'STUDIOS',
    id: string,
    newPrice: number,
    newDisplay: string
  ) => {
    if (persona === 'YOU') {
      setYouOffers((prev) =>
        prev.map((o) => (o.id === id ? { ...o, price: newPrice, priceDisplay: newDisplay } : o))
      );
    } else if (persona === 'FILMMAKER') {
      setFilmmakerOffers((prev) =>
        prev.map((o) => (o.id === id ? { ...o, price: newPrice, priceDisplay: newDisplay } : o))
      );
    } else {
      setStudiosOffers((prev) =>
        prev.map((o) => (o.id === id ? { ...o, price: newPrice, priceDisplay: newDisplay } : o))
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">Offer & Pricing Architecture</h1>
          <p className="text-xs text-[#A7A39B]">Central control for fixed-price tiers, starting points, and checkout paths.</p>
        </div>
        {saveStatus && <span className="text-xs text-[#C8965B] font-mono">{saveStatus}</span>}
      </div>

      {/* YOU OFFERS */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#C8965B]">MYTHRA YOU — Personalized Cinema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {youOffers.map((o) => (
            <div key={o.id} className="p-6 bg-[#121212] border border-[#262522] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-[#A7A39B]">{o.code}</span>
                  <h3 className="font-serif text-lg font-bold text-[#F4F0E8]">{o.name}</h3>
                </div>
                <div className="font-serif text-2xl font-bold text-[#C8965B]">{o.priceDisplay}</div>
              </div>
              <p className="text-xs text-[#A7A39B]">{o.description}</p>
              <div className="text-[11px] text-[#727b66] border-t border-[#1C1B19] pt-2">
                Turnaround: {o.turnaround} &bull; Revisions: {o.revisions}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILMMAKER OFFERS */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#C8965B]">MYTHRA FILMMAKER — Education & Studio Building</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filmmakerOffers.map((o) => (
            <div key={o.id} className="p-6 bg-[#121212] border border-[#262522] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-[#A7A39B]">{o.code}</span>
                  <h3 className="font-serif text-lg font-bold text-[#F4F0E8]">{o.name}</h3>
                </div>
                <div className="font-serif text-2xl font-bold text-[#C8965B]">{o.priceDisplay}</div>
              </div>
              <p className="text-xs text-[#A7A39B]">{o.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* STUDIOS OFFERS */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#C8965B]">MYTHRA STUDIOS — B2B Productions & IP</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {studiosOffers.map((o) => (
            <div key={o.id} className="p-6 bg-[#121212] border border-[#262522] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-[#A7A39B]">{o.code}</span>
                  <h3 className="font-serif text-lg font-bold text-[#F4F0E8]">{o.name}</h3>
                </div>
              </div>
              <div className="font-serif text-2xl font-bold text-[#C8965B]">{o.priceDisplay}</div>
              <p className="text-xs text-[#A7A39B]">{o.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
