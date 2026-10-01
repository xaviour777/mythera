'use client';

import React from 'react';
import { db } from '@/db';
import { ShoppingCart, CheckCircle, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const orders = db.store.orders;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold">Orders & Payment Transactions</h1>
        <p className="text-xs text-[#A7A39B]">Verified Stripe checkout sessions, deposit logs, and customer receipts.</p>
      </div>

      <div className="p-6 bg-[#121212] border border-[#262522] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#262522] text-[#A7A39B] font-mono uppercase">
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Offer Code</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Payment Status</th>
              <th className="pb-3">Production Status</th>
              <th className="pb-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1B19]">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-[#151412]">
                <td className="py-3 font-mono text-[#C8965B]">{o.id}</td>
                <td className="py-3 font-semibold text-[#F4F0E8]">{o.offerCode}</td>
                <td className="py-3 font-mono font-bold text-[#F4F0E8]">${(o.amount / 100).toFixed(2)} USD</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#C8965B] bg-[#C8965B]/10 px-2 py-0.5 rounded border border-[#C8965B]/30">
                    <CheckCircle className="w-3 h-3" /> {o.paymentStatus}
                  </span>
                </td>
                <td className="py-3 text-[#A7A39B] font-mono">{o.productionStatus}</td>
                <td className="py-3 text-[#727b66] font-mono">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
