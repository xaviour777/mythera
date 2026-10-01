'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Users, ShoppingCart, Film, Award, DollarSign, RefreshCw, Beaker, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin', icon: ShieldCheck },
    { name: 'Leads & Scores', href: '/admin/leads', icon: Users },
    { name: 'Orders & Payments', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Active Projects', href: '/admin/projects', icon: Film },
    { name: 'Proof & Truth', href: '/admin/proof', icon: Award },
    { name: 'Offers & Pricing', href: '/admin/offers', icon: DollarSign },
    { name: 'CRM Sync Logs', href: '/admin/crm-sync', icon: RefreshCw },
    { name: 'Funnel Simulator', href: '/admin/funnel-test', icon: Beaker },
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-[#F4F0E8] pt-24 pb-20">
      {/* Admin Top Navigation */}
      <header className="border-b border-[#1C1B19] bg-[#0C0B0A] px-6 sm:px-8 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-[#A7A39B] hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Studio
            </Link>
            <span className="text-[#262522]">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8965B] animate-pulse" />
              <strong className="font-serif text-lg tracking-wide text-[#F4F0E8]">MYTHRA OPERATING SYSTEM</strong>
              <span className="text-[10px] bg-[#262522] text-[#A7A39B] px-2 py-0.5 rounded font-mono">ADMIN V1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 text-xs">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#C8965B] text-[#090909] font-bold shadow-sm'
                      : 'text-[#A7A39B] hover:text-white hover:bg-[#151412]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8">
        {children}
      </main>
    </div>
  );
}
