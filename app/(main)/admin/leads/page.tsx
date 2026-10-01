'use client';

import React, { useState } from 'react';
import { db } from '@/db';
import { Users, Search, Filter, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';

export default function AdminLeadsPage() {
  const [filterPersona, setFilterPersona] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const leads = db.store.leads;

  const filtered = leads.filter((l) => {
    const matchesPersona = filterPersona === 'ALL' || l.persona === filterPersona;
    const matchesSearch =
      l.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.organization && l.organization.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesPersona && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">Leads & Qualification Database</h1>
          <p className="text-xs text-[#A7A39B]">Browse captured contacts, scores, qualification tiers, and CRM tags.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 text-xs">
          {['ALL', 'YOU', 'FILMMAKER', 'STUDIOS'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPersona(p)}
              className={`px-3 py-1.5 font-mono uppercase font-bold border ${
                filterPersona === p
                  ? 'bg-[#C8965B] text-[#090909] border-[#C8965B]'
                  : 'bg-[#121212] text-[#A7A39B] border-[#262522]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 bg-[#121212] border border-[#262522] flex items-center gap-3">
        <Search className="w-4 h-4 text-[#A7A39B]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, or company..."
          className="bg-transparent text-xs text-[#F4F0E8] w-full outline-none"
        />
      </div>

      {/* Table */}
      <div className="p-6 bg-[#121212] border border-[#262522] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#262522] text-[#A7A39B] font-mono uppercase">
              <th className="pb-3">Lead / Company</th>
              <th className="pb-3">Persona</th>
              <th className="pb-3">Score & Category</th>
              <th className="pb-3">Recommended Offer</th>
              <th className="pb-3">Phone / Country</th>
              <th className="pb-3">Captured</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1B19]">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-[#151412]">
                <td className="py-3">
                  <strong className="text-[#F4F0E8] block text-sm">{l.firstName} {l.lastName}</strong>
                  <span className="text-[#727b66] text-[11px] block">{l.email}</span>
                  {l.organization && <span className="text-[#A7A39B] text-[11px] block">{l.role ? `${l.role} · ` : ''}{l.organization}</span>}
                </td>
                <td className="py-3 font-mono font-bold text-[#C8965B]">{l.persona}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#F4F0E8]">{l.score}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      l.qualification === 'priority'
                        ? 'bg-[#6B1F2A] text-white'
                        : l.qualification === 'qualified'
                        ? 'bg-[#C8965B]/20 text-[#C8965B]'
                        : 'bg-[#262522] text-[#A7A39B]'
                    }`}>
                      {l.qualification}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-[#F4F0E8] font-medium">{l.recommendedOffer}</td>
                <td className="py-3 text-[#A7A39B]">
                  <div>{l.whatsapp || 'N/A'}</div>
                  <div className="text-[10px] text-[#727b66]">{l.country || 'Global'}</div>
                </td>
                <td className="py-3 text-[#727b66] font-mono">{new Date(l.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
