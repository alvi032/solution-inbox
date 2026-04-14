'use client';

import { Ticket } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface AiConfidenceTooltipProps {
  ticket: Ticket;
}

export default function AiConfidenceTooltip({ ticket }: AiConfidenceTooltipProps) {
  const badgeStyle =
    ticket.aiConfidenceLabel === 'Likely Trustworthy'
      ? 'bg-lime-50 border border-lime-200 text-[#0f6229]'
      : ticket.aiConfidenceLabel === 'Moderate Risk'
      ? 'bg-amber-50 border border-amber-200 text-amber-700'
      : 'bg-red-50 border border-red-200 text-red-700';

  return (
    <div className="w-[340px] bg-white rounded-lg shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.06)] border border-[#e4e4e7] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e4e4e7]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style={{ backgroundColor: ticket.customer.avatarColor }}
          >
            {ticket.customer.initials}
          </div>
          <div>
            <p className="text-sm font-medium text-[#18181b]">{ticket.customer.name}</p>
            <p className="text-xs text-[#71717a]">
              {ticket.id} · {ticket.subject}
            </p>
          </div>
        </div>
        <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', badgeStyle)}>
          {ticket.aiConfidenceLabel}
        </span>
      </div>

      {/* Signals */}
      <div className="divide-y divide-[#e4e4e7]">
        {ticket.aiSignals.map((signal, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3">
            <div className="mt-0.5 shrink-0">
              {signal.type === 'positive' ? (
                <CheckCircle2 size={16} className="text-green-600" />
              ) : (
                <XCircle size={16} className="text-red-500" />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-[#18181b]">{signal.heading}</p>
              <p className="text-xs text-[#71717a] mt-0.5">{signal.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
