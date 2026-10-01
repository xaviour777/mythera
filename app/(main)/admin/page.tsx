'use client';

import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { Users, ShoppingCart, Film, Award, TrendingUp, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const leads = db.store.leads;
  const orders = db.store.orders;
  const projects = db.store.projects;
  const crmLogs = db.store.crmSyncEvents;

  const priorityLeads = leads.filter((l) => l.qualification === 'priority');
  const qualifiedLeads = leads.filter((l) => l.qualification === 'qualified');
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0) / 100;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 bg-[#121212] border border-[#262522] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="eyebrow-text block mb-1 text-[#C8965B]">STUDIO OPERATIONS OVERVIEW</span>
          <h1 className="font-serif text-3xl font-bold text-[#F4F0E8]">
            Studio Intelligence & Funnel Telemetry
          </h1>
          <p className="text-xs text-[#A7A39B] mt-1">
            Real-time pipeline monitoring, automated qualification scoring, and private storage health.
          </p>
        </div>
        <Link
          href="/admin/funnel-test"
          className="bg-[#C8965B] hover:bg-[#d8a66b] text-[#090909] px-6 py-3 text-xs uppercase tracking-widest font-bold inline-flex items-center gap-2"
        >
          <span>Open Funnel Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-[#121212] border border-[#262522]">
          <div className="flex items-center justify-between text-[#A7A39B] mb-2 text-xs uppercase font-mono">
            <span>Total Leads</span>
            <Users className="w-4 h-4 text-[#C8965B]" />
          </div>
          <div className="font-serif text-4xl font-bold text-[#F4F0E8]">{leads.length}</div>
          <span className="text-[11px] text-[#C8965B] block mt-1">
            {priorityLeads.length} Priority &bull; {qualifiedLeads.length} Qualified
          </span>
        </div>

        <div className="p-6 bg-[#121212] border border-[#262522]">
          <div className="flex items-center justify-between text-[#A7A39B] mb-2 text-xs uppercase font-mono">
            <span>Confirmed Orders</span>
            <ShoppingCart className="w-4 h-4 text-[#C8965B]" />
          </div>
          <div className="font-serif text-4xl font-bold text-[#F4F0E8]">{orders.length}</div>
          <span className="text-[11px] text-[#A7A39B] block mt-1">
            ${totalRevenue.toLocaleString()} USD Total Volume
          </span>
        </div>

        <div className="p-6 bg-[#121212] border border-[#262522]">
          <div className="flex items-center justify-between text-[#A7A39B] mb-2 text-xs uppercase font-mono">
            <span>Active Productions</span>
            <Film className="w-4 h-4 text-[#C8965B]" />
          </div>
          <div className="font-serif text-4xl font-bold text-[#F4F0E8]">{projects.length}</div>
          <span className="text-[11px] text-[#727b66] block mt-1">
            100% on schedule
          </span>
        </div>

        <div className="p-6 bg-[#121212] border border-[#262522]">
          <div className="flex items-center justify-between text-[#A7A39B] mb-2 text-xs uppercase font-mono">
            <span>CRM Sync Health</span>
            <CheckCircle className="w-4 h-4 text-[#C8965B]" />
          </div>
          <div className="font-serif text-4xl font-bold text-[#F4F0E8]">100%</div>
          <span className="text-[11px] text-[#C8965B] block mt-1">
            {crmLogs.length} Events Processed
          </span>
        </div>
      </div>

      {/* Recent High Priority Leads Table */}
      <div className="p-6 bg-[#121212] border border-[#262522]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold text-[#F4F0E8]">Recent Leads Across All Doors</h2>
          <Link href="/admin/leads" className="text-xs text-[#C8965B] hover:underline">
            View All Leads &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#262522] text-[#A7A39B] font-mono uppercase">
                <th className="pb-3">Name / Organization</th>
                <th className="pb-3">Persona</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Recommended Offer</th>
                <th className="pb-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1B19]">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-[#151412]">
                  <td className="py-3">
                    <strong className="text-[#F4F0E8] block">{l.firstName} {l.lastName}</strong>
                    <span className="text-[#727b66] text-[11px]">{l.email} {l.organization ? `&bull; ${l.organization}` : ''}</span>
                  </td>
                  <td className="py-3 font-mono text-[#C8965B]">{l.persona}</td>
                  <td className="py-3 font-mono font-bold text-[#F4F0E8]">{l.score}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      l.qualification === 'priority'
                        ? 'bg-[#6B1F2A] text-white'
                        : l.qualification === 'qualified'
                        ? 'bg-[#C8965B]/20 text-[#C8965B]'
                        : 'bg-[#262522] text-[#A7A39B]'
                    }`}>
                      {l.qualification}
                    </span>
                  </td>
                  <td className="py-3 text-[#A7A39B]">{l.recommendedOffer}</td>
                  <td className="py-3 text-[#727b66] font-mono">{new Date(l.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
