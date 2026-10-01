'use client';

import React from 'react';
import { db } from '@/db';
import { Film, User, Clock, CheckCircle } from 'lucide-react';

export default function AdminProjectsPage() {
  const projects = db.store.projects;
  const consentRecords = db.store.consentRecords;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold">Active Productions & Delivery Queue</h1>
        <p className="text-xs text-[#A7A39B]">Directorial milestone tracking, revision rounds, and signed likeness consent links.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((p) => {
          const consent = consentRecords.find((c) => c.projectId === p.id);
          return (
            <div key={p.id} className="p-6 bg-[#121212] border border-[#262522]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C1B19]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#C8965B] block mb-1">
                    {p.projectType} &bull; ID: {p.id}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#F4F0E8]">{p.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#A7A39B]">Director: <strong className="text-[#F4F0E8]">{p.assignedOwner || 'Unassigned'}</strong></span>
                  <span className="px-2.5 py-1 bg-[#1C1B19] border border-[#262522] text-[#C8965B] text-xs font-mono font-bold">
                    Round {p.revisionRound}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-[#A7A39B]">
                <div>
                  <span className="block text-[#727b66] mb-1">LIKENESS CONSENT STATUS:</span>
                  <span className="text-[#C8965B] font-semibold">
                    {consent ? `Signed by ${consent.subjectName} (${consent.relationshipToCustomer})` : 'Pending Signature'}
                  </span>
                </div>
                <div>
                  <span className="block text-[#727b66] mb-1">VOICE CLONE STATUS:</span>
                  <span className="text-[#F4F0E8]">
                    {consent?.voiceAuthorized ? 'Authorized & Cleared' : 'Narration / Text Only'}
                  </span>
                </div>
                <div>
                  <span className="block text-[#727b66] mb-1">PRODUCTION STATUS:</span>
                  <span className="text-[#F4F0E8] uppercase font-mono">{p.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
