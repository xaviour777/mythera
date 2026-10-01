'use client';

import React, { useState } from 'react';
import { mythraProof, ProofMetricItem } from '@/lib/proof';
import { ShieldCheck, ExternalLink, Save, CheckCircle2 } from 'lucide-react';

export default function AdminProofPage() {
  const [metrics, setMetrics] = useState<Record<string, ProofMetricItem>>({ ...mythraProof });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const toggleVerified = (key: string) => {
    setMetrics((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        verified: !prev[key].verified,
      },
    }));
  };

  const handleUpdate = async (key: string) => {
    const item = metrics[key];
    setSaveStatus(`Saving ${key}...`);

    try {
      const res = await fetch('/api/proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          verified: item.verified,
          evidenceUrl: item.evidenceUrl,
          evidenceRef: item.evidenceRef,
        }),
      });
      if (res.ok) {
        setSaveStatus(`Saved ${item.label} successfully!`);
      }
    } catch {
      setSaveStatus('Failed to update.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">Proof & Truth Governance</h1>
          <p className="text-xs text-[#A7A39B]">
            Strict rule: Unverified claims are blocked from production public display until verified: true.
          </p>
        </div>
        {saveStatus && <span className="text-xs text-[#C8965B] font-mono">{saveStatus}</span>}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {Object.values(metrics).map((m) => (
          <div key={m.key} className="p-6 bg-[#121212] border border-[#262522] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#A7A39B] block mb-1">
                  KEY: {m.key} &bull; CATEGORY: {m.category}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#F4F0E8]">{m.label}</h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="font-serif text-3xl font-bold text-[#C8965B]">{m.value}</div>
                <button
                  type="button"
                  onClick={() => toggleVerified(m.key)}
                  className={`px-4 py-2 text-xs uppercase font-bold tracking-wider rounded border ${
                    m.verified
                      ? 'bg-[#C8965B] text-[#090909] border-[#C8965B]'
                      : 'bg-[#1C1B19] text-[#727b66] border-[#262522]'
                  }`}
                >
                  {m.verified ? 'Verified (Public)' : 'Unverified (Hidden)'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-[#1C1B19]">
              <div>
                <label className="block text-[#A7A39B] mb-1 font-mono">EVIDENCE AUDIT URL</label>
                <input
                  type="text"
                  value={m.evidenceUrl || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMetrics((prev) => ({
                      ...prev,
                      [m.key]: { ...prev[m.key], evidenceUrl: val },
                    }));
                  }}
                  placeholder="https://..."
                  className="w-full bg-[#181715] border border-[#262522] p-2 text-[#F4F0E8]"
                />
              </div>
              <div>
                <label className="block text-[#A7A39B] mb-1 font-mono">AUDIT REFERENCE CODE</label>
                <input
                  type="text"
                  value={m.evidenceRef || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMetrics((prev) => ({
                      ...prev,
                      [m.key]: { ...prev[m.key], evidenceRef: val },
                    }));
                  }}
                  placeholder="AUD-GEN-001"
                  className="w-full bg-[#181715] border border-[#262522] p-2 text-[#F4F0E8]"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <p className="text-[11px] text-[#727b66] max-w-xl">{m.methodologyNote}</p>
              <button
                type="button"
                onClick={() => handleUpdate(m.key)}
                className="bg-[#1C1B19] hover:bg-[#262522] border border-[#262522] text-[#C8965B] px-4 py-1.5 text-xs font-mono uppercase font-bold inline-flex items-center gap-1.5"
              >
                <Save className="w-3 h-3" /> Save Changes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
