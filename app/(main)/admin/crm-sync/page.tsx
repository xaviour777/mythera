'use client';

import React from 'react';
import { db } from '@/db';
import { RefreshCw, CheckCircle, AlertCircle, Send } from 'lucide-react';

export default function AdminCrmSyncPage() {
  const syncLogs = db.store.crmSyncEvents;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">GoHighLevel CRM Sync Logs</h1>
          <p className="text-xs text-[#A7A39B]">Real-time synchronization logs, contact creation, tag application, and pipeline opportunities.</p>
        </div>
      </div>

      <div className="p-6 bg-[#121212] border border-[#262522] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#262522] text-[#A7A39B] font-mono uppercase">
              <th className="pb-3">Sync ID</th>
              <th className="pb-3">Lead ID</th>
              <th className="pb-3">Provider</th>
              <th className="pb-3">Contact ID</th>
              <th className="pb-3">Opportunity ID</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1B19]">
            {syncLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#151412]">
                <td className="py-3 font-mono text-[#A7A39B]">{log.id}</td>
                <td className="py-3 font-mono text-[#C8965B]">{log.leadId || 'N/A'}</td>
                <td className="py-3 font-mono text-[#F4F0E8]">{log.provider}</td>
                <td className="py-3 font-mono text-[#A7A39B]">{log.contactId || 'synced'}</td>
                <td className="py-3 font-mono text-[#A7A39B]">{log.opportunityId || 'created'}</td>
                <td className="py-3">
                  <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    log.status === 'success'
                      ? 'bg-[#C8965B]/15 text-[#C8965B]'
                      : 'bg-[#8A2B35]/20 text-[#ff9999]'
                  }`}>
                    {log.status === 'success' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {log.status}
                  </span>
                </td>
                <td className="py-3 font-mono text-[#727b66]">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
