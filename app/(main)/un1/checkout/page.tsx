'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  CreditCard,
  MessageCircle,
  Mail,
  Film,
  Clapperboard,
  Loader2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { mythraOffers, type OfferTier } from '@/lib/offers';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tierParam = searchParams.get('tier') || '';
  const codeParam = searchParams.get('code') || '';
  const emailParam = searchParams.get('email') || '';
  const nameParam = searchParams.get('name') || '';

  // Find offer across all tiers
  const allOffers: OfferTier[] = [
    ...mythraOffers.you,
    ...mythraOffers.cast,
    ...mythraOffers.filmmaker,
    ...mythraOffers.studios,
  ];

  const matchedOffer =
    allOffers.find(
      (o) =>
        o.id === tierParam ||
        o.code === codeParam ||
        o.id === `you-${tierParam}` ||
        o.id === `cast-${tierParam}` ||
        o.code === `MYTHRA_${tierParam.toUpperCase().replace(/-/g, '_')}` ||
        o.code === `CAST_${tierParam.toUpperCase().replace(/-/g, '_')}`
    ) || mythraOffers.you[1]; // default to MYTHRA Trailer ($299)

  const [customerName, setCustomerName] = useState(nameParam || '');
  const [customerEmail, setCustomerEmail] = useState(emailParam || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'whop' | 'whatsapp'>('whop');

  useEffect(() => {
    if (nameParam && !customerName) setCustomerName(nameParam);
    if (emailParam && !customerEmail) setCustomerEmail(emailParam);
  }, [nameParam, emailParam]);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const order = {
        orderId: `whop_sim_${Date.now()}`,
        tierId: matchedOffer.id,
        tierName: matchedOffer.name,
        amount: matchedOffer.price,
        customerName,
        customerEmail,
        customerPhone,
        paymentStatus: 'paid_simulated',
        timestamp: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('mythra_orders') || '[]');
      existing.unshift(order);
      localStorage.setItem('mythra_orders', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      router.push(`/un1/you/onboarding?tier=${matchedOffer.id}&session_id=whop_sim_${Date.now()}&status=success`);
    }, 1200);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello MYTHRA Studio! I am ready to secure my production slot for ${matchedOffer.name} (${matchedOffer.priceDisplay}). My email is ${customerEmail || '[Enter Email]'}. Please send me the official Whop checkout link.`
  );

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Trust Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
          <Link
            href="/un1/you"
            className="font-mono text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            &larr; Back to MYTHRA
          </Link>
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span className="inline-flex items-center gap-1 text-[#d8ff44]">
              <Lock className="w-3.5 h-3.5" />
              256-Bit SSL Encrypted
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Whop Merchant Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Checkout Form & Payment Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-card border-2 border-border shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Secure Checkout
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#d8ff44]/10 text-[#d8ff44] border border-[#d8ff44]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Whop Gateway
                </span>
              </div>

              <h1 className="font-sans text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight">
                Complete Your Reservation
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-6">
                Your dossier has been synced to our production queue. Complete checkout below to lock in your slot.
              </p>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-secondary rounded-2xl border border-border mb-6 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('whop')}
                  className={`py-2.5 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedMethod === 'whop'
                      ? 'bg-primary text-primary-foreground font-bold shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Whop Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`py-2.5 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedMethod === 'card'
                      ? 'bg-primary text-primary-foreground font-bold shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Card / Apple</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('whatsapp')}
                  className={`py-2.5 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedMethod === 'whatsapp'
                      ? 'bg-[#25D366] text-black font-bold shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {selectedMethod === 'whatsapp' ? (
                /* WhatsApp Manual Link Option */
                <div className="space-y-4 p-5 rounded-2xl bg-[#25D366]/5 border border-[#25D366]/30">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-6 h-6 text-[#25D366] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-sans text-base font-bold text-foreground">
                        Pay via Direct WhatsApp Concierge
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Prefer to receive your direct Whop checkout link or invoice directly via WhatsApp? Chat directly with our executive production lead.
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4 fill-black" />
                    <span>Open WhatsApp Chat &rarr;</span>
                  </a>
                </div>
              ) : (
                /* Primary Whop / Card Simulation Form */
                <form onSubmit={handleSimulatePayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      WhatsApp / Phone (For Production Updates)
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Whop Card Simulation Box */}
                  <div className="p-4 rounded-2xl bg-secondary/80 border border-border space-y-2 mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <span>Gateway Mode</span>
                      <span className="text-[#d8ff44] font-bold">Whop Simulated Checkout</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">
                      💡 <em>Demo / Transition Notice:</em> You can simulate completion here to access the asset onboarding portal immediately. In production, this button connects directly to your live Whop checkout link.
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-pill-primary w-full text-center text-sm !py-4 justify-center cursor-pointer shadow-xl mt-6 disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Authorizing Reservation...</span>
                      </div>
                    ) : (
                      <>
                        <span>Complete Reservation · {matchedOffer.priceDisplay}</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Direct Email fallback */}
              <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
                <span>Need an invoice or bank wire?</span>
                <a
                  href={`mailto:info@zetomate.com?subject=${encodeURIComponent(`Invoice Request for ${matchedOffer.name}`)}`}
                  className="text-primary hover:underline font-mono inline-flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact info@zetomate.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-card border-2 border-primary ring-2 ring-primary/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full bg-primary text-primary-foreground font-black uppercase block w-fit mb-3">
                Selected Experience
              </span>

              <h2 className="font-sans text-2xl sm:text-3xl font-black text-foreground uppercase">
                {matchedOffer.name}
              </h2>

              <p className="text-xs text-primary font-semibold tracking-wide mt-1 mb-4">
                {matchedOffer.tagline}
              </p>

              <div className="p-4 rounded-2xl bg-secondary border border-border mb-6">
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {matchedOffer.description}
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2 mb-6 text-xs text-foreground">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-bold block mb-1">
                  Deliverables Included:
                </span>
                {matchedOffer.features.slice(0, 5).map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-border pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-muted-foreground">
                  <span>Package Tier</span>
                  <span>{matchedOffer.priceDisplay}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Likeness Security Protocol</span>
                  <span className="text-[#d8ff44]">Included ($0)</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Whop Gateway Processing</span>
                  <span className="text-primary">Free ($0)</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-base font-bold text-foreground">
                  <span>Total Due Today:</span>
                  <span className="text-primary font-sans text-xl">{matchedOffer.priceDisplay}</span>
                </div>
              </div>

              {/* Turnaround badge */}
              {matchedOffer.turnaround && (
                <div className="mt-6 p-3 rounded-xl bg-background border border-border text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Estimated Delivery:</span>
                  <strong className="text-foreground font-mono">{matchedOffer.turnaround}</strong>
                </div>
              )}
            </div>

            {/* Whop Instructions Card for Site Admin */}
            <div className="p-5 rounded-2xl bg-secondary/50 border border-border text-xs text-muted-foreground space-y-2">
              <strong className="text-foreground flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-primary" />
                <span>How to connect your live Whop product links:</span>
              </strong>
              <p className="text-[11px] leading-relaxed">
                In your environment or `.env`, set <code className="text-primary bg-background px-1.5 py-0.5 rounded">WHOP_URL_{matchedOffer.code}</code> or <code className="text-primary bg-background px-1.5 py-0.5 rounded">WHOP_CHECKOUT_URL</code> with your product link (e.g. <code className="text-muted-foreground">https://whop.com/un1/checkout/...</code>).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
