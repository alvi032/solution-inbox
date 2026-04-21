'use client';

import { useState, useEffect } from 'react';
import AppSidebar, { getDashboardView, type DashboardView } from '@/components/app-sidebar';
import ResetButton from '@/components/reset-button';
import {
  Inbox,
  Clock,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  DollarSign,
  Zap,
  Star,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Bot,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

// ─── Admin view data ────────────────────────────────────────────────

const adminAutomationMetric = {
  label: 'Automation Rate',
  value: '68%',
  change: undefined,
  trend: undefined,
  icon: Zap,
  iconBg: '#faf5ff',
  iconColor: '#8b5cf6',
};

const ticketCategoryStyles: Record<string, { bg: string; text: string }> = {
  Order: { bg: '#ede9fe', text: '#5b21b6' },
  Refund: { bg: '#fef3c7', text: '#92400e' },
  'Shipping Issue': { bg: '#dbeafe', text: '#1e40af' },
  General: { bg: '#dbfedd', text: '#0f6229' },
  'Order Cancellation': { bg: '#ede9fe', text: '#5b21b6' },
};

const agentOpenTickets = [
  {
    customer: 'Maria K.',
    subject: 'Refund for damaged package — order #5821',
    preview: 'The package arrived completely crushed. I need a full refund or replacement ASAP.',
    category: 'Refund',
    priority: 'high' as const,
    source: 'From AI',
    time: '12m ago',
    sla: 'SLA 12m',
    urgent: true,
  },
  {
    customer: 'James L.',
    subject: 'Tracking number not updating for 3 days',
    preview: "My order was supposed to arrive yesterday but the tracking hasn't moved since Tuesday.",
    category: 'Shipping Issue',
    priority: 'normal' as const,
    source: 'From AI',
    time: '34m ago',
    sla: 'SLA 1h',
    urgent: false,
  },
  {
    customer: 'Priya R.',
    subject: 'Wrong colour item delivered — exchange request',
    preview: 'I ordered navy blue but received olive green. Can I exchange without returning first?',
    category: 'Order',
    priority: 'normal' as const,
    source: 'Direct',
    time: '1h ago',
    sla: 'SLA 2h',
    urgent: false,
  },
  {
    customer: 'Tom S.',
    subject: 'Charged twice for the same order #6102',
    preview: 'I see two charges of $89.99 on my bank statement from this morning.',
    category: 'Refund',
    priority: 'high' as const,
    source: 'From AI',
    time: '2h ago',
    sla: 'SLA 30m',
    urgent: true,
  },
  {
    customer: 'Nina W.',
    subject: 'Size guide question before placing order',
    preview: "I'm between M and L in your tops. Which do you recommend for a 5'6\" frame?",
    category: 'General',
    priority: 'normal' as const,
    source: 'Direct',
    time: '3h ago',
    sla: 'SLA 4h',
    urgent: false,
  },
];

const teamStandingData = [
  { name: 'Sarah M.', csat: 4.7, aht: '6m 40s', resolved: '91.9%', you: true },
  { name: 'Priya K.', csat: 4.4, aht: '5m 52s', resolved: '93.8%', you: false },
  { name: 'James T.', csat: 4.1, aht: '8m 12s', resolved: '88.9%', you: false },
];

// ─── Agent Performance data ─────────────────────────────────────────────────

type AgentType = 'ai' | 'human';

interface AgentTopic {
  label: string;
  pct: number;
  color: string;
}

interface AgentPerformance {
  id: string;
  name: string;
  role: string;
  type: AgentType;
  tickets: number;
  resolved: number;
  resolutionRate: number;
  aht: string;
  csat: number;
  revenue: string;
  topics: AgentTopic[];
  resolutionHistory: number[];
  insight: string;
  warn?: boolean;
}

const agentPerformanceData: AgentPerformance[] = [
  {
    id: 'sales-agent',
    name: 'Sales Agent',
    role: 'AI · pre-purchase',
    type: 'ai',
    tickets: 712,
    resolved: 684,
    resolutionRate: 96.0,
    aht: '1m 12s',
    csat: 4.7,
    revenue: '$32,540',
    topics: [
      { label: 'Order tracking', pct: 38, color: '#2d7a5f' },
      { label: 'Returns', pct: 24, color: '#cc785c' },
      { label: 'Product questions', pct: 18, color: '#3d6897' },
      { label: 'Refunds', pct: 12, color: '#b8892d' },
      { label: 'Other', pct: 8, color: '#a1a1aa' },
    ],
    resolutionHistory: [78, 82, 85, 88, 91, 93, 95, 96],
    insight: 'Sales Agent is resolving 96.0% of assigned tickets — well above the 85% target. Escalation quality has improved 14% this month thanks to richer handoff context. Consider expanding its scope to include shipping issues where the current deflection rate sits at 71%.',
  },
  {
    id: 'support-agent',
    name: 'Support Agent',
    role: 'AI · post-purchase',
    type: 'ai',
    tickets: 1021,
    resolved: 724,
    resolutionRate: 70.9,
    aht: '1m 48s',
    csat: 4.5,
    revenue: '$41,200',
    topics: [
      { label: 'Shipping issues', pct: 34, color: '#3d6897' },
      { label: 'Returns & exchanges', pct: 28, color: '#cc785c' },
      { label: 'Order tracking', pct: 21, color: '#2d7a5f' },
      { label: 'Refunds', pct: 11, color: '#b8892d' },
      { label: 'Other', pct: 6, color: '#a1a1aa' },
    ],
    resolutionHistory: [62, 65, 67, 70, 69, 71, 72, 71],
    insight: 'Support Agent is auto-resolving 71% of tickets — on track toward the 75% target. Shipping issue escalations have dropped 22% since last month. Expanding the agent\'s policy scope to cover partial refunds could push the resolution rate above target.',
  },
  {
    id: 'sarah-m',
    name: 'Sarah M.',
    role: 'Human Agent',
    type: 'human',
    tickets: 284,
    resolved: 261,
    resolutionRate: 91.9,
    aht: '6m 40s',
    csat: 4.7,
    revenue: '—',
    topics: [
      { label: 'Complaints & disputes', pct: 40, color: '#dc2626' },
      { label: 'Policy exceptions', pct: 25, color: '#b8892d' },
      { label: 'Complex refunds', pct: 22, color: '#cc785c' },
      { label: 'VIP customers', pct: 13, color: '#3d6897' },
    ],
    resolutionHistory: [88, 90, 89, 92, 91, 93, 91, 92],
    insight: 'Sarah is consistently handling the most complex escalations — her CSAT on dispute tickets is 4.7, 0.3 above team average. She accepted AI drafts 71% of the time this month, saving an estimated 2h 40m of handle time.',
  },
  {
    id: 'james-t',
    name: 'James T.',
    role: 'Human Agent',
    type: 'human',
    tickets: 218,
    resolved: 194,
    resolutionRate: 88.9,
    aht: '8m 12s',
    csat: 4.1,
    revenue: '—',
    topics: [
      { label: 'Shipping issues', pct: 45, color: '#3d6897' },
      { label: 'Order tracking', pct: 28, color: '#2d7a5f' },
      { label: 'Returns', pct: 18, color: '#cc785c' },
      { label: 'Other', pct: 9, color: '#a1a1aa' },
    ],
    resolutionHistory: [85, 86, 87, 88, 87, 89, 88, 89],
    insight: 'James\'s AHT is 8m 12s — 19% above the human team average of 6m 55s. AI draft adoption at 44% leaves significant time-saving opportunity. CSAT on shipping tickets improved from 3.8 to 4.1 over the last 30 days.',
  },
  {
    id: 'priya-k',
    name: 'Priya K.',
    role: 'Human Agent',
    type: 'human',
    tickets: 241,
    resolved: 226,
    resolutionRate: 93.8,
    aht: '5m 52s',
    csat: 4.4,
    revenue: '—',
    topics: [
      { label: 'Product questions', pct: 38, color: '#2d7a5f' },
      { label: 'Returns', pct: 26, color: '#cc785c' },
      { label: 'Order issues', pct: 22, color: '#b8892d' },
      { label: 'Other', pct: 14, color: '#a1a1aa' },
    ],
    resolutionHistory: [89, 91, 92, 93, 92, 94, 94, 94],
    insight: 'Priya has the lowest AHT (5m 52s) among human agents and a solid 4.4 CSAT. Her one-touch resolution rate of 81% is well above team average. Consider pairing her with James for knowledge sharing on shipping resolution best practices.',
  },
  {
    id: 'dan-r',
    name: 'Dan R.',
    role: 'Human Agent',
    type: 'human',
    tickets: 196,
    resolved: 134,
    resolutionRate: 68.4,
    aht: '14m 22s',
    csat: 3.4,
    revenue: '—',
    warn: true,
    topics: [
      { label: 'Complaints & disputes', pct: 52, color: '#dc2626' },
      { label: 'Returns', pct: 24, color: '#cc785c' },
      { label: 'Shipping issues', pct: 16, color: '#3d6897' },
      { label: 'Other', pct: 8, color: '#a1a1aa' },
    ],
    resolutionHistory: [74, 71, 69, 72, 68, 66, 70, 68],
    insight: 'Dan\'s CSAT of 3.4 is significantly below the human team average of 4.4 and his resolution rate of 68.4% is below the 75% target. AHT of 14m 22s is more than double the team average. Recommend immediate coaching intervention and temporary reduction in ticket volume while improvements are tracked.',
  },
];

// ─── Agent view data ────────────────────────────────────────────────

const agentMetrics = [
  {
    label: 'Tickets Resolved',
    value: '261',
    change: '↑ 8% vs prior 30d',
    trend: 'up' as const,
    icon: CheckCircle,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
  },
  {
    label: 'Your CSAT',
    value: '4.7/5',
    change: '↑ 0.3 above team avg (4.4)',
    trend: 'up' as const,
    icon: Star,
    iconBg: '#fffbeb',
    iconColor: '#d97706',
  },
  {
    label: 'Avg. Response Time',
    value: '4m 12s',
    change: '↓ 18% · team avg 5m 8s',
    trend: 'down' as const,
    icon: Clock,
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
  },
  {
    label: 'One-Touch Resolution',
    value: '78%',
    change: '↑ 4pt above team avg',
    trend: 'up' as const,
    icon: TrendingUp,
    iconBg: '#faf5ff',
    iconColor: '#8b5cf6',
  },
];

const shiftMetrics = [
  { label: 'Open · Assigned', value: '6', sub: '3 waiting on customer' },
  { label: 'Overdue SLA', value: '1', sub: 'Attention needed', warn: true },
  { label: 'Handled Today', value: '23', sub: '↑ 4 vs yesterday' },
  { label: 'AI Drafts Accepted', value: '71%', sub: '↑ 6pt vs last week' },
];

const ticketMixByView = {
  all: [
    { label: 'Returns & exchanges', count: 605, pct: '23%', color: '#cc785c' },
    { label: 'Order tracking', count: 547, pct: '20%', color: '#2d7a5f' },
    { label: 'Shipping issues', count: 477, pct: '18%', color: '#3d6897' },
    { label: 'Refunds', count: 401, pct: '15%', color: '#b8892d' },
    { label: 'Complaints & disputes', count: 215, pct: '8%', color: '#dc2626' },
    { label: 'Other', count: 427, pct: '16%', color: '#a1a1aa' },
  ],
  ai: [
    { label: 'Order tracking', count: 485, pct: '28%', color: '#2d7a5f' },
    { label: 'Returns & exchanges', count: 457, pct: '26%', color: '#cc785c' },
    { label: 'Shipping issues', count: 347, pct: '20%', color: '#3d6897' },
    { label: 'Refunds', count: 198, pct: '11%', color: '#b8892d' },
    { label: 'Product questions', count: 139, pct: '8%', color: '#8b5cf6' },
    { label: 'Other', count: 107, pct: '7%', color: '#a1a1aa' },
  ],
  human: [
    { label: 'Complaints & disputes', count: 215, pct: '23%', color: '#dc2626' },
    { label: 'Returns & exchanges', count: 148, pct: '16%', color: '#cc785c' },
    { label: 'Shipping issues', count: 130, pct: '14%', color: '#3d6897' },
    { label: 'Refunds & policy', count: 134, pct: '14%', color: '#b8892d' },
    { label: 'Product questions', count: 93, pct: '10%', color: '#8b5cf6' },
    { label: 'Other', count: 219, pct: '23%', color: '#a1a1aa' },
  ],
};

// ─── Components ────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#71717a]">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: iconBg }}>
          <Icon size={16} style={{ color: iconColor }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#18181b] leading-none">{value}</p>
        {change && trend && (() => {
          const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;
          const trendColor = trend === 'up' ? '#16a34a' : '#3b82f6';
          return (
            <div className="flex items-center gap-1 mt-1.5">
              <TrendIcon size={13} style={{ color: trendColor }} />
              <span className="text-xs" style={{ color: trendColor }}>{change}</span>
            </div>
          );
        })()}
        {change && !trend && (
          <p className="text-xs text-[#71717a] mt-1.5">{change}</p>
        )}
      </div>
    </div>
  );
}

// ─── Comparison metric card ──────────────────────────────────────────

function ComparisonMetricCard({
  label,
  aiValue,
  humanValue,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  aiValue: string;
  humanValue: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#71717a]">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: iconBg }}>
          <Icon size={16} style={{ color: iconColor }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-0.5">
        <div>
          <p className="text-[10px] uppercase tracking-wide font-medium text-[#a1a1aa] mb-1.5">AI agents</p>
          <p className="text-2xl font-semibold text-[#18181b] leading-none">{aiValue}</p>
        </div>
        <div className="border-l border-[#f4f4f5] pl-3">
          <p className="text-[10px] uppercase tracking-wide font-medium text-[#a1a1aa] mb-1.5">Human agents</p>
          <p className="text-2xl font-semibold text-[#18181b] leading-none">{humanValue}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Resolution chart ───────────────────────────────────────────────

function ResolutionChart({ data }: { data: number[] }) {
  const vw = 540;
  const vh = 160;
  const pl = 36;
  const pr = 12;
  const pt = 10;
  const pb = 26;
  const cw = vw - pl - pr;
  const ch = vh - pt - pb;

  const minY = Math.floor((Math.min(...data) - 4) / 5) * 5;
  const maxY = 100;
  const range = maxY - minY;

  const toX = (i: number) => pl + (i / (data.length - 1)) * cw;
  const toY = (v: number) => pt + ch - ((v - minY) / range) * ch;

  const pathD = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(' ');
  const areaD = `${pathD} L ${toX(data.length - 1).toFixed(1)} ${(pt + ch).toFixed(1)} L ${toX(0).toFixed(1)} ${(pt + ch).toFixed(1)} Z`;

  const yTicks = [minY, minY + range * 0.33, minY + range * 0.66, maxY];
  const weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full h-auto">
      {yTicks.map((v, i) => (
        <g key={i}>
          <line x1={pl} y1={toY(v)} x2={pl + cw} y2={toY(v)} stroke="#f4f4f5" strokeWidth="1" />
          <text x={pl - 6} y={toY(v) + 4} textAnchor="end" fontSize="10" fill="#a1a1aa" fontFamily="Inter, sans-serif">
            {Math.round(v)}%
          </text>
        </g>
      ))}
      <path d={areaD} fill="#18181b" fillOpacity="0.04" />
      <path d={pathD} fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={toX(i)}
          cy={toY(v)}
          r={i === data.length - 1 ? 4 : 2.5}
          fill={i === data.length - 1 ? '#18181b' : 'white'}
          stroke="#18181b"
          strokeWidth="1.5"
        />
      ))}
      {weekLabels.map((label, i) => (
        <text key={i} x={toX(i)} y={vh - 6} textAnchor="middle" fontSize="10" fill="#a1a1aa" fontFamily="Inter, sans-serif">
          {label}
        </text>
      ))}
    </svg>
  );
}

// ─── Agent detail panel ──────────────────────────────────────────────

function AgentDetailPanel({ agent }: { agent: AgentPerformance }) {
  const kpiCards: { label: string; value: string; icon: React.ElementType; iconBg: string; iconColor: string }[] = [
    { label: 'Tickets', value: agent.tickets.toLocaleString(), icon: Inbox, iconBg: '#eff6ff', iconColor: '#3b82f6' },
    { label: 'Resolved', value: `${agent.resolved.toLocaleString()} (${agent.resolutionRate.toFixed(1)}%)`, icon: CheckCircle, iconBg: '#f0fdf4', iconColor: '#16a34a' },
    { label: 'AHT', value: agent.aht, icon: Clock, iconBg: '#faf5ff', iconColor: '#8b5cf6' },
    { label: 'CSAT', value: `${agent.csat}/5`, icon: Star, iconBg: '#fffbeb', iconColor: '#d97706' },
  ];
  if (agent.revenue !== '—') {
    kpiCards.push({ label: 'Revenue', value: agent.revenue, icon: DollarSign, iconBg: '#f0fdf4', iconColor: '#16a34a' });
  }

  return (
    <div className="mt-1 mb-1 border border-[#e5e7eb] rounded-xl bg-[#fafafa] p-4">
      {/* KPI cards */}
      <div className={`grid gap-3 mb-4 ${kpiCards.length === 5 ? 'grid-cols-5' : 'grid-cols-4'}`}>
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-[#e5e7eb] p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#71717a]">{card.label}</span>
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: card.iconBg }}>
                <card.icon size={12} style={{ color: card.iconColor }} />
              </div>
            </div>
            <p className="text-base font-semibold text-[#18181b] leading-tight">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Topics */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-4">
          <p className="text-xs font-semibold text-[#18181b] mb-0.5">Ticket resolution over time</p>
          <p className="text-[11px] text-[#a1a1aa] mb-3">Resolution rate · last 8 weeks</p>
          <ResolutionChart data={agent.resolutionHistory} />
        </div>
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-4">
          <p className="text-xs font-semibold text-[#18181b] mb-0.5">Topics handled</p>
          <p className="text-[11px] text-[#a1a1aa] mb-4">Breakdown by ticket intent</p>
          <div className="flex flex-col gap-3">
            {agent.topics.map((topic) => (
              <div key={topic.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: topic.color }} />
                    <span className="text-xs text-[#3f3f46]">{topic.label}</span>
                  </div>
                  <span className="text-xs font-medium text-[#18181b] tabular-nums">{topic.pct}%</span>
                </div>
                <div className="h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${topic.pct}%`, backgroundColor: topic.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evo Insight */}
      <div className="bg-[#fafafe] border border-[#e5e7eb] rounded-xl px-4 py-3.5 flex items-start gap-3">
        <div className="w-6 h-6 rounded-md bg-[#ede9fe] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles size={12} className="text-[#7c3aed]" />
        </div>
        <div>
          <p className="text-xs font-semibold text-[#18181b] mb-1">Evo Insight</p>
          <p className="text-xs text-[#71717a] leading-relaxed">{agent.insight}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Agent performance table ─────────────────────────────────────────

function AgentPerformanceTable() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = agentPerformanceData.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#18181b]">Agent performance</h2>
        <span className="text-xs text-[#71717a]">Last 30 days · click a row to expand</span>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Agent</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Tickets</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Resolved</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">AHT</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">CSAT</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {agentPerformanceData.map((agent) => {
              const isSelected = agent.id === selectedId;
              return (
                <tr
                  key={agent.id}
                  onClick={() => setSelectedId(isSelected ? null : agent.id)}
                  className={`border-b border-[#e5e7eb] last:border-0 cursor-pointer transition-colors ${agent.warn ? 'bg-[#fff8f8]' : isSelected ? 'bg-[#fafafa]' : 'hover:bg-[#fafafa]'}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${agent.warn ? 'bg-[#fee2e2]' : agent.type === 'ai' ? 'bg-[#ede9fe]' : 'bg-[#e0e7ff]'}`}>
                        {agent.warn ? (
                          <AlertTriangle size={13} className="text-[#dc2626]" />
                        ) : agent.type === 'ai' ? (
                          <Bot size={13} className="text-[#7c3aed]" />
                        ) : (
                          <Users size={13} className="text-[#4338ca]" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${agent.warn ? 'text-[#dc2626]' : 'text-[#18181b]'}`}>{agent.name}</p>
                        <p className="text-[11px] text-[#a1a1aa]">{agent.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#3f3f46] text-right tabular-nums">{agent.tickets.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-sm font-medium tabular-nums ${agent.warn ? 'text-[#dc2626]' : 'text-[#18181b]'}`}>{agent.resolved.toLocaleString()}</span>
                    <span className="text-xs text-[#71717a] ml-1">({agent.resolutionRate.toFixed(1)}%)</span>
                  </td>
                  <td className={`px-5 py-3.5 text-sm text-right tabular-nums ${agent.warn ? 'text-[#dc2626]' : 'text-[#3f3f46]'}`}>{agent.aht}</td>
                  <td className={`px-5 py-3.5 text-sm text-right tabular-nums ${agent.warn ? 'text-[#dc2626]' : 'text-[#3f3f46]'}`}>{agent.csat}/5</td>
                  <td className="px-5 py-3.5 text-sm text-right">
                    <span className={agent.revenue === '—' ? 'text-[#a1a1aa]' : 'text-[#18181b] font-medium tabular-nums'}>
                      {agent.revenue}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && <AgentDetailPanel agent={selected} />}
    </div>
  );
}

// ─── Agent open tickets ──────────────────────────────────────────────

function AgentOpenTickets() {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden mb-4">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e5e7eb]">
        <h2 className="text-sm font-semibold text-[#18181b]">My open tickets</h2>
        <Link href="/inbox" className="flex items-center gap-1 text-xs text-[#71717a] hover:text-[#18181b] transition-colors">
          View all
          <ChevronRight size={13} />
        </Link>
      </div>
      <div>
        {agentOpenTickets.map((t, i) => {
          const cat = ticketCategoryStyles[t.category] ?? ticketCategoryStyles.General;
          return (
            <div
              key={i}
              className={`relative flex items-center gap-4 px-4 py-3 border-b border-[#f4f4f5] last:border-0 cursor-pointer hover:bg-[#fafafa] transition-colors ${t.priority === 'high' ? 'border-l-4 border-l-[#ff6666]' : 'border-l-4 border-l-transparent'}`}
            >
              <div className="w-[88px] shrink-0">
                <p className="text-sm text-[#18181b] truncate">{t.customer}</p>
                <p className="text-[11px] text-[#71717a]">Customer</p>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p className="text-sm font-medium text-[#18181b] truncate">{t.subject}</p>
                <p className="text-xs text-[#71717a] truncate">{t.preview}</p>
              </div>
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium shrink-0"
                style={{ backgroundColor: cat.bg, color: cat.text }}
              >
                {t.category}
              </span>
              <span className="text-xs text-[#a1a1aa] bg-[#f4f4f5] rounded px-1.5 py-0.5 shrink-0">{t.source}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${t.urgent ? 'bg-[#fee2e2] text-[#dc2626]' : 'bg-[#f4f4f5] text-[#71717a]'}`}>
                {t.sla}
              </span>
              <span className="text-xs text-[#71717a] shrink-0 w-[56px] text-right">{t.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Team standing ───────────────────────────────────────────────────

function TeamStanding() {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden mb-4">
      <div className="flex items-baseline justify-between px-5 py-3.5 border-b border-[#e5e7eb]">
        <h2 className="text-sm font-semibold text-[#18181b]">Where you stand</h2>
        <span className="text-xs text-[#71717a]">Human agents · last 30 days</span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#f4f4f5]">
            <th className="text-left px-5 py-2.5 text-xs font-medium text-[#71717a]">Agent</th>
            <th className="text-right px-5 py-2.5 text-xs font-medium text-[#71717a]">CSAT</th>
            <th className="text-right px-5 py-2.5 text-xs font-medium text-[#71717a]">AHT</th>
            <th className="text-right px-5 py-2.5 text-xs font-medium text-[#71717a]">Resolved</th>
          </tr>
        </thead>
        <tbody>
          {teamStandingData.map((agent, i) => (
            <tr key={agent.name} className={`border-b border-[#f4f4f5] last:border-0 ${agent.you ? 'bg-[#fafafe]' : ''}`}>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-[#a1a1aa] tabular-nums w-4">#{i + 1}</span>
                  <span className={`text-sm ${agent.you ? 'font-semibold text-[#18181b]' : 'text-[#3f3f46]'}`}>{agent.name}</span>
                  {agent.you && (
                    <span className="text-[10px] bg-[#ede9fe] text-[#5b21b6] rounded px-1.5 py-0.5 font-medium">You</span>
                  )}
                </div>
              </td>
              <td className={`px-5 py-3 text-sm text-right tabular-nums ${agent.you ? 'font-semibold text-[#18181b]' : 'text-[#3f3f46]'}`}>{agent.csat}/5</td>
              <td className={`px-5 py-3 text-sm text-right tabular-nums ${agent.you ? 'font-semibold text-[#18181b]' : 'text-[#3f3f46]'}`}>{agent.aht}</td>
              <td className={`px-5 py-3 text-sm text-right tabular-nums ${agent.you ? 'font-semibold text-[#18181b]' : 'text-[#3f3f46]'}`}>{agent.resolved}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Ticket mix widget ───────────────────────────────────────────────

type TicketMixView = 'all' | 'ai' | 'human';

function TicketMixWidget() {
  const [active, setActive] = useState<TicketMixView>('all');
  const items = ticketMixByView[active];

  const tabs: { key: TicketMixView; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'ai', label: 'AI' },
    { key: 'human', label: 'Human' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-[#18181b] mb-0.5">What agents are working on</p>
          <p className="text-xs text-[#71717a]">Team ticket mix · last 30 days</p>
        </div>
        <div className="flex items-center bg-[#f4f4f5] rounded-lg p-0.5 gap-0.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                active === t.key
                  ? 'bg-white text-[#18181b] shadow-sm'
                  : 'text-[#71717a] hover:text-[#3f3f46]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-[#3f3f46] flex-1">{item.label}</span>
            <span className="text-sm font-medium text-[#18181b] tabular-nums">{item.count.toLocaleString()}</span>
            <span className="text-xs text-[#71717a] tabular-nums w-8 text-right">{item.pct}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-[#f4f4f5]">
        <div className="flex items-start gap-3 bg-[#fafafe] border border-[#e5e7eb] rounded-lg px-3 py-2.5">
          <div className="w-6 h-6 rounded-md bg-[#8b5cf6] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={11} className="text-white" />
          </div>
          <p className="text-xs text-[#6d28d9]">
            {active === 'ai' && <><span className="font-semibold">Order tracking & returns</span> dominate AI ticket volume — expanding AI policy coverage on refunds could further reduce escalations.</>}
            {active === 'human' && <><span className="font-semibold">Complaints & disputes</span> make up 23% of human workload. These are high-complexity tickets where AI escalation context is most valuable.</>}
            {active === 'all' && <><span className="font-semibold">Returns & exchanges</span> are the top category at 23% — consider expanding AI scope here to reduce human load.</>}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ────────────────────────────────────────────────

function AdminDashboard() {
  return (
    <>
      {/* Value band */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 mb-6 grid grid-cols-3 gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#a1a1aa] font-medium mb-2">Total value delivered · last 30 days</p>
          <p className="text-3xl font-semibold leading-none text-[#18181b]">$84,720</p>
          <p className="text-xs text-[#a1a1aa] mt-2">Equiv. 4.2 FTE agents · 12.4× ROI on Evo</p>
        </div>
        <div className="border-l border-[#e5e7eb] pl-6">
          <p className="text-xs uppercase tracking-widest text-[#a1a1aa] font-medium mb-2">Cost replaced</p>
          <p className="text-3xl font-semibold leading-none text-[#18181b]">$52,180</p>
          <p className="text-xs text-[#a1a1aa] mt-2">1,284 interactions handled without a human</p>
        </div>
        <div className="pl-6">
          <p className="text-xs uppercase tracking-widest text-[#a1a1aa] font-medium mb-2">Revenue influenced</p>
          <p className="text-3xl font-semibold leading-none text-[#18181b]">$32,540</p>
          <p className="text-xs text-[#a1a1aa] mt-2">Upsells, recovered carts, search sessions</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard {...adminAutomationMetric} />
        <ComparisonMetricCard
          label="Avg. Resolution Time"
          aiValue="1m 33s"
          humanValue="6m 55s"
          icon={Clock}
          iconBg="#eff6ff"
          iconColor="#3b82f6"
        />
        <ComparisonMetricCard
          label="Customer Satisfaction"
          aiValue="4.6/5"
          humanValue="4.4/5"
          icon={Star}
          iconBg="#fffbeb"
          iconColor="#d97706"
        />
      </div>

      {/* AI impact + ticket mix */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* How AI helped the team */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
          <p className="text-sm font-semibold text-[#18181b] mb-0.5">How AI helped the team this week</p>
          <p className="text-xs text-[#71717a] mb-4">Support Agent pre-qualified 312 tickets before human handoff</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { v: '843', l: 'Drafts offered' },
              { v: '601', l: 'Accepted / edited' },
              { v: '2m 44s', l: 'Time saved / ticket' },
            ].map((s) => (
              <div key={s.l} className="bg-[#f9fafb] rounded-lg p-3 text-center">
                <p className="text-xl font-semibold text-[#18181b] leading-none">{s.v}</p>
                <p className="text-[10px] text-[#71717a] uppercase tracking-wide mt-1.5">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-3 py-2.5">
            <div className="w-6 h-6 rounded-md bg-[#16a34a] flex items-center justify-center shrink-0 mt-0.5">
              <Bot size={13} className="text-white" />
            </div>
            <p className="text-xs text-[#166534]">
              AI handled <span className="font-semibold">312 pre-qualifying questions</span> before escalating — human agents receive cases ready to resolve.
            </p>
          </div>
        </div>

        <TicketMixWidget />
      </div>

      <AgentPerformanceTable />
    </>
  );
}

// ─── Agent Dashboard ────────────────────────────────────────────────

function AgentDashboard() {
  return (
    <>
      {/* Agent header */}
      <div className="flex items-center gap-3 mb-6 bg-white rounded-xl border border-[#e5e7eb] px-5 py-4">
        <div className="w-2 h-2 rounded-full bg-[#16a34a] shadow-[0_0_0_3px_rgba(22,163,74,0.2)]" />
        <div>
          <p className="text-sm font-semibold text-[#18181b]">Good afternoon, Sarah</p>
          <p className="text-xs text-[#71717a] mt-0.5">On shift · 6 open tickets assigned to you · 23 resolved today</p>
        </div>
        <div className="ml-auto flex gap-2">
          {['Today', 'This week', 'Last 30 days'].map((p, i) => (
            <button key={p} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${i === 2 ? 'bg-[#18181b] text-white' : 'border border-[#e5e7eb] text-[#71717a] hover:text-[#18181b]'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Agent KPI cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {agentMetrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* Shift snapshot */}
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#18181b]">Shift snapshot</h2>
        <span className="text-xs text-[#71717a]">Live · updates every 60s</span>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {shiftMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-[#e5e7eb] px-4 py-4">
            <p className="text-[10px] uppercase tracking-wide font-medium text-[#a1a1aa] mb-1">{m.label}</p>
            <p className={`text-2xl font-semibold leading-none ${m.warn ? 'text-[#dc2626]' : 'text-[#18181b]'}`}>{m.value}</p>
            <p className={`text-xs mt-1.5 ${m.warn ? 'text-[#dc2626]' : 'text-[#71717a]'}`}>{m.sub}</p>
          </div>
        ))}
      </div>

      <TeamStanding />

      <AgentOpenTickets />

      {/* CSAT insight */}
      <div className="mt-4 bg-white rounded-xl border border-[#e5e7eb] px-5 py-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-[#8b5cf6] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#18181b]">This week's standout</p>
          <p className="text-sm text-[#71717a] mt-0.5">
            Shipping inquiries spiked 34% Tuesday — AI handled 89% automatically, keeping FRT under 30s despite the volume surge.
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Page ────────────────────────────────────────────────

export default function DashboardPage() {
  const [view, setView] = useState<DashboardView>('admin');

  useEffect(() => {
    setView(getDashboardView());
    const handler = (e: Event) => {
      setView((e as CustomEvent<DashboardView>).detail);
    };
    window.addEventListener('dashboard-view-change', handler);
    return () => window.removeEventListener('dashboard-view-change', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {/* Page header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#18181b]">Dashboard</h1>
              <p className="text-sm text-[#71717a] mt-0.5">
                {view === 'admin'
                  ? 'Unified view across Sales Agent, Support Agent, and Evo Search'
                  : 'Welcome back, Sarah. Here\'s your personal performance.'}
              </p>
            </div>
            <span className="text-xs text-[#a1a1aa] bg-[#f4f4f5] rounded-lg px-2.5 py-1.5 font-medium capitalize">
              {view} view
            </span>
          </div>

          {view === 'admin' ? <AdminDashboard /> : <AgentDashboard />}
        </div>
      </main>
      <ResetButton />
    </div>
  );
}
