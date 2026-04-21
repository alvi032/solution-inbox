'use client';

import { useState } from 'react';
import AppSidebar from '@/components/app-sidebar';
import {
  Bot,
  Users,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────

type AgentType = 'ai' | 'human';

const TICKET_TYPES = [
  { id: 'product-query', label: 'Product query' },
  { id: 'general', label: 'General' },
  { id: 'refunds', label: 'Refunds' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'order-tracking', label: 'Order tracking' },
  { id: 'returns', label: 'Returns' },
  { id: 'complaints', label: 'Complaints & disputes' },
  { id: 'cancellations', label: 'Cancellations' },
];

interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: AgentType;
  email?: string;
  ticketPct: number;
  ticketTypes: string[];
  status: 'active' | 'away' | 'offline';
}

// ─── Initial data ────────────────────────────────────────────────────

const initialTeam: TeamMember[] = [
  {
    id: 'sales-agent',
    name: 'Sales Agent',
    role: 'AI · pre-purchase',
    type: 'ai',
    ticketPct: 30,
    ticketTypes: ['product-query', 'general', 'order-tracking'],
    status: 'active',
  },
  {
    id: 'support-agent',
    name: 'Support Agent',
    role: 'AI · post-purchase',
    type: 'ai',
    ticketPct: 30,
    ticketTypes: ['refunds', 'shipping', 'returns', 'order-tracking', 'cancellations'],
    status: 'active',
  },
  {
    id: 'sarah-m',
    name: 'Sarah M.',
    role: 'Human Agent',
    type: 'human',
    email: 'sarah.m@example.com',
    ticketPct: 20,
    ticketTypes: ['complaints', 'refunds', 'general'],
    status: 'active',
  },
  {
    id: 'james-t',
    name: 'James T.',
    role: 'Human Agent',
    type: 'human',
    email: 'james.t@example.com',
    ticketPct: 12,
    ticketTypes: ['shipping', 'order-tracking', 'returns'],
    status: 'away',
  },
  {
    id: 'priya-k',
    name: 'Priya K.',
    role: 'Human Agent',
    type: 'human',
    email: 'priya.k@example.com',
    ticketPct: 8,
    ticketTypes: ['product-query', 'general', 'returns'],
    status: 'active',
  },
];

const statusConfig = {
  active: { dot: 'bg-[#16a34a]', label: 'Active', text: 'text-[#16a34a]' },
  away: { dot: 'bg-[#d97706]', label: 'Away', text: 'text-[#d97706]' },
  offline: { dot: 'bg-[#a1a1aa]', label: 'Offline', text: 'text-[#71717a]' },
};

// ─── Checkbox group ──────────────────────────────────────────────────

function TicketTypeSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (types: string[]) => void;
}) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((t) => t !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {TICKET_TYPES.map((type) => {
        const checked = selected.includes(type.id);
        return (
          <button
            key={type.id}
            onClick={() => toggle(type.id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors border ${
              checked
                ? 'bg-[#f4f4f5] border-[#d1d5db] text-[#18181b]'
                : 'bg-white border-[#e5e7eb] text-[#71717a] hover:border-[#d1d5db] hover:text-[#3f3f46]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                checked ? 'bg-[#18181b] border-[#18181b]' : 'border-[#d1d5db]'
              }`}
            >
              {checked && <Check size={10} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-xs font-medium">{type.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Agent row ───────────────────────────────────────────────────────

function AgentRow({
  member,
  expanded,
  onToggle,
  onChange,
  totalPct,
}: {
  member: TeamMember;
  expanded: boolean;
  onToggle: () => void;
  onChange: (updated: TeamMember) => void;
  totalPct: number;
}) {
  const st = statusConfig[member.status];
  const selectedLabels = member.ticketTypes
    .map((id) => TICKET_TYPES.find((t) => t.id === id)?.label)
    .filter(Boolean)
    .join(', ');

  return (
    <div className="border-b border-[#e5e7eb] last:border-0">
      {/* Summary row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#fafafa] transition-colors text-left"
      >
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            member.type === 'ai' ? 'bg-[#ede9fe]' : 'bg-[#e0e7ff]'
          }`}
        >
          {member.type === 'ai' ? (
            <Bot size={16} className="text-[#7c3aed]" />
          ) : (
            <Users size={16} className="text-[#4338ca]" />
          )}
        </div>

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[#18181b]">{member.name}</p>
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
            <span className={`text-xs ${st.text}`}>{st.label}</span>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-0.5">{member.email ?? member.role}</p>
        </div>

        {/* Ticket % */}
        <div className="text-right shrink-0 w-[80px]">
          <p className="text-sm font-semibold text-[#18181b] tabular-nums">{member.ticketPct}%</p>
          <p className="text-[11px] text-[#a1a1aa]">of tickets</p>
        </div>

        {/* Ticket types preview */}
        <div className="hidden lg:block w-[220px] shrink-0">
          <p className="text-xs text-[#71717a] truncate">
            {selectedLabels || <span className="text-[#a1a1aa] italic">No types assigned</span>}
          </p>
        </div>

        {/* Expand icon */}
        <div className="shrink-0 text-[#a1a1aa]">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>

      {/* Config panel */}
      {expanded && (
        <div className="px-5 pb-5 bg-[#fafafa] border-t border-[#f4f4f5]">
          <div className="grid grid-cols-2 gap-6 pt-4">
            {/* Ticket distribution */}
            <div>
              <p className="text-xs font-semibold text-[#18181b] mb-1">Ticket distribution</p>
              <p className="text-[11px] text-[#71717a] mb-3">
                Percentage of incoming tickets routed to this agent. Team total: {totalPct}%
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={member.ticketPct}
                  onChange={(e) => onChange({ ...member, ticketPct: Number(e.target.value) })}
                  className="flex-1 h-1.5 rounded-full appearance-none bg-[#e5e7eb] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#18181b] [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden bg-white">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={member.ticketPct}
                    onChange={(e) => onChange({ ...member, ticketPct: Math.min(100, Math.max(0, Number(e.target.value))) })}
                    className="w-[48px] px-2 py-1.5 text-sm font-semibold text-[#18181b] text-center outline-none"
                  />
                  <span className="pr-2 text-xs text-[#71717a]">%</span>
                </div>
              </div>
              {/* Distribution bar */}
              <div className="mt-3 h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#18181b] rounded-full transition-all"
                  style={{ width: `${Math.min(100, member.ticketPct)}%` }}
                />
              </div>
            </div>

            {/* Ticket types */}
            <div>
              <p className="text-xs font-semibold text-[#18181b] mb-1">Ticket types</p>
              <p className="text-[11px] text-[#71717a] mb-3">
                Select the types of tickets that can be assigned to this agent.
              </p>
              <TicketTypeSelector
                selected={member.ticketTypes}
                onChange={(types) => onChange({ ...member, ticketTypes: types })}
              />
            </div>
          </div>

          {/* Save indicator */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <span className="text-xs text-[#a1a1aa]">Changes are saved automatically</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalPct = team.reduce((sum, m) => sum + m.ticketPct, 0);

  const updateMember = (id: string, updated: TeamMember) => {
    setTeam((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#18181b]">Team</h1>
              <p className="text-sm text-[#71717a] mt-0.5">
                Configure how tickets are routed across your AI and human agents.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${
                  totalPct === 100
                    ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#16a34a]'
                    : totalPct > 100
                    ? 'bg-[#fef2f2] border-[#fecaca] text-[#dc2626]'
                    : 'bg-[#fffbeb] border-[#fde68a] text-[#92400e]'
                }`}
              >
                {totalPct === 100
                  ? 'Distribution balanced · 100%'
                  : totalPct > 100
                  ? `Over-allocated · ${totalPct}%`
                  : `Under-allocated · ${totalPct}% of 100%`}
              </div>
            </div>
          </div>

          {/* Team table */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden mb-6">
            {/* Table header */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-[#e5e7eb] bg-[#fafafa]">
              <div className="w-9 shrink-0" />
              <div className="flex-1 text-xs font-medium text-[#71717a]">Agent</div>
              <div className="w-[80px] shrink-0 text-right text-xs font-medium text-[#71717a]">Tickets</div>
              <div className="hidden lg:block w-[220px] shrink-0 text-xs font-medium text-[#71717a]">Ticket types</div>
              <div className="w-[24px] shrink-0" />
            </div>

            {team.map((member) => (
              <AgentRow
                key={member.id}
                member={member}
                expanded={expandedId === member.id}
                onToggle={() => setExpandedId(expandedId === member.id ? null : member.id)}
                onChange={(updated) => updateMember(member.id, updated)}
                totalPct={totalPct}
              />
            ))}
          </div>

          {/* Distribution overview */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
            <p className="text-sm font-semibold text-[#18181b] mb-1">Distribution overview</p>
            <p className="text-xs text-[#71717a] mb-4">How incoming tickets are split across your team</p>
            <div className="flex flex-col gap-3">
              {team.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      m.type === 'ai' ? 'bg-[#ede9fe]' : 'bg-[#e0e7ff]'
                    }`}
                  >
                    {m.type === 'ai' ? (
                      <Bot size={12} className="text-[#7c3aed]" />
                    ) : (
                      <Users size={12} className="text-[#4338ca]" />
                    )}
                  </div>
                  <span className="text-sm text-[#3f3f46] w-[120px] shrink-0">{m.name}</span>
                  <div className="flex-1 h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${m.type === 'ai' ? 'bg-[#7c3aed]' : 'bg-[#4338ca]'}`}
                      style={{ width: `${Math.min(100, m.ticketPct)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[#18181b] tabular-nums w-[36px] text-right">{m.ticketPct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
