'use client';

import { useState, useEffect } from 'react';
import AppSidebar, { getDashboardView, type DashboardView } from '@/components/app-sidebar';
import ResetButton from '@/components/reset-button';
import EvoSearchKPIs from '@/components/evo-search-kpis';
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
} from 'lucide-react';
import Link from 'next/link';

// ─── Admin view data ────────────────────────────────────────────────

const adminMetrics = [
  {
    label: 'Total Value Delivered',
    value: '$84,720',
    change: '12.4× ROI on Evo',
    trend: 'up' as const,
    icon: DollarSign,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
  },
  {
    label: 'Automation Rate',
    value: '68%',
    change: '↑ 4.2pt vs prior 30d',
    trend: 'up' as const,
    icon: Zap,
    iconBg: '#faf5ff',
    iconColor: '#8b5cf6',
  },
  {
    label: 'Avg. Resolution Time',
    value: '2m 14s',
    change: '↓ 38% vs human',
    trend: 'down' as const,
    icon: Clock,
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
  },
  {
    label: 'Customer Satisfaction',
    value: '4.6/5',
    change: '↑ 0.2 vs human (4.4)',
    trend: 'up' as const,
    icon: Star,
    iconBg: '#fffbeb',
    iconColor: '#d97706',
  },
];

const productCards = [
  {
    name: 'Sales Agent',
    role: 'On-site chat · pre-purchase',
    href: '/sales-agent/analytics',
    stats: [
      { label: 'Revenue', value: '$32.5k', delta: '↑ 18%', pos: true },
      { label: 'Conv. lift', value: '+3.4pt', delta: 'vs no-chat', pos: true },
      { label: 'Sessions', value: '712', delta: '+11%', pos: true },
      { label: 'CSAT', value: '4.7/5', delta: '+0.1', pos: true },
    ],
  },
  {
    name: 'Support Agent',
    role: 'Ticket inbox · post-purchase',
    href: '/inbox/analytics',
    stats: [
      { label: 'Auto-resolved', value: '724', delta: '71% rate', pos: true },
      { label: 'Cost saved', value: '$41.2k', delta: '↑ 9%', pos: true },
      { label: 'Avg. handle', value: '1m 48s', delta: '−62%', pos: true },
      { label: 'Escalated', value: '21%', delta: 'to human', pos: null },
    ],
  },
  {
    name: 'Evo Search',
    role: 'Product discovery · storewide',
    href: '/evo-search/analytics',
    stats: [
      { label: 'Search conv.', value: '7.8%', delta: '3.2× site avg', pos: true },
      { label: 'Rev / search', value: '$1.41', delta: '↑ 22%', pos: true },
      { label: 'Zero-result', value: '1.2%', delta: '−78% vs native', pos: true },
      { label: 'Queries', value: '24.1k', delta: '+8%', pos: true },
    ],
  },
];

const recentActivity = [
  { customer: 'Emma Wilson', subject: 'Order #4821 — missing item', status: 'open', time: '4m ago', category: 'Order' },
  { customer: 'James Liu', subject: 'Refund not received after 7 days', status: 'open', time: '18m ago', category: 'Refund' },
  { customer: 'Priya Sharma', subject: 'Wrong size shipped', status: 'closed', time: '1h ago', category: 'Shipping' },
  { customer: 'Carlos Mendez', subject: 'Cancel order before dispatch', status: 'open', time: '2h ago', category: 'Order' },
  { customer: 'Aisha Rahman', subject: 'Tracking number not updating', status: 'closed', time: '3h ago', category: 'Shipping' },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Order: { bg: '#ede9fe', text: '#5b21b6' },
  Refund: { bg: '#fef3c7', text: '#92400e' },
  Shipping: { bg: '#dbeafe', text: '#1e40af' },
  General: { bg: '#dbfedd', text: '#0f6229' },
};

// ─── Agent view data ────────────────────────────────────────────────

const agentMetrics = [
  {
    label: 'Tickets Resolved',
    value: '284',
    change: '↑ 8% vs prior 30d',
    trend: 'up' as const,
    icon: CheckCircle,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
  },
  {
    label: 'Your CSAT',
    value: '4.7/5',
    change: '↑ 0.2 above team avg',
    trend: 'up' as const,
    icon: Star,
    iconBg: '#fffbeb',
    iconColor: '#d97706',
  },
  {
    label: 'Avg. Response Time',
    value: '4m 12s',
    change: '↓ 18% · team avg 6m 40s',
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

const agentTicketMix = [
  { label: 'Returns & exchanges', count: 98, pct: '35%', color: '#cc785c' },
  { label: 'Order issues', count: 74, pct: '26%', color: '#2d7a5f' },
  { label: 'Complaints & disputes', count: 62, pct: '22%', color: '#3d6897' },
  { label: 'Other', count: 50, pct: '17%', color: '#b8892d' },
];

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
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend === 'up' ? '#16a34a' : '#3b82f6';
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
        <div className="flex items-center gap-1 mt-1.5">
          <TrendIcon size={13} style={{ color: trendColor }} />
          <span className="text-xs" style={{ color: trendColor }}>{change}</span>
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
      <div className="bg-[#18181b] text-white rounded-xl p-6 mb-6 grid grid-cols-3 gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50 font-medium mb-2">Total value delivered · last 30 days</p>
          <p className="text-3xl font-semibold leading-none">$84,720</p>
          <p className="text-xs text-white/50 mt-2">Equiv. 4.2 FTE agents · 12.4× ROI on Evo</p>
        </div>
        <div className="border-l border-white/10 pl-6">
          <p className="text-xs uppercase tracking-widest text-white/50 font-medium mb-2">Cost replaced</p>
          <p className="text-3xl font-semibold leading-none">$52,180</p>
          <p className="text-xs text-white/50 mt-2">1,284 interactions handled without a human</p>
        </div>
        <div className="pl-6">
          <p className="text-xs uppercase tracking-widest text-white/50 font-medium mb-2">Revenue influenced</p>
          <p className="text-3xl font-semibold leading-none">$32,540</p>
          <p className="text-xs text-white/50 mt-2">Upsells, recovered carts, search sessions</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {adminMetrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* Product performance */}
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#18181b]">Product performance</h2>
        <span className="text-xs text-[#71717a]">Last 30 days</span>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {productCards.map((product) => (
          <Link
            key={product.name}
            href={product.href}
            className="bg-white rounded-xl border border-[#e5e7eb] p-5 hover:border-[#d1d5db] hover:shadow-sm transition-all group"
          >
            <p className="text-xs text-[#71717a] mb-0.5 font-medium">{product.name}</p>
            <p className="text-[11px] text-[#a1a1aa] mb-4">{product.role}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
              {product.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wide font-medium">{s.label}</p>
                  <p className="text-base font-semibold text-[#18181b] mt-0.5 leading-none">{s.value}</p>
                  {s.pos !== null && (
                    <p className={`text-[11px] mt-0.5 font-medium ${s.pos ? 'text-[#16a34a]' : 'text-[#71717a]'}`}>{s.delta}</p>
                  )}
                  {s.pos === null && (
                    <p className="text-[11px] mt-0.5 text-[#71717a]">{s.delta}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-[#f4f4f5] flex items-center gap-1 text-xs text-[#18181b] font-medium group-hover:gap-2 transition-all">
              View analytics
              <ChevronRight size={13} />
            </div>
          </Link>
        ))}
      </div>

      <EvoSearchKPIs />

      {/* Recent tickets */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
          <h2 className="text-sm font-semibold text-[#18181b]">Recent Tickets</h2>
          <Link href="/inbox" className="flex items-center gap-1 text-xs text-[#71717a] hover:text-[#18181b] transition-colors">
            View all
            <ChevronRight size={13} />
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Customer</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Subject</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Category</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((row, i) => {
              const cat = categoryColors[row.category] ?? categoryColors.General;
              return (
                <tr key={i} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-[#18181b]">{row.customer}</td>
                  <td className="px-5 py-3.5 text-sm text-[#3f3f46] max-w-[240px] truncate">{row.subject}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: cat.bg, color: cat.text }}>
                      {row.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${row.status === 'open' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#f4f4f5] text-[#71717a]'}`}>
                      {row.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#71717a]">{row.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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

      {/* AI help + ticket mix */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* How AI helped */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
          <p className="text-sm font-semibold text-[#18181b] mb-0.5">How AI helped you this week</p>
          <p className="text-xs text-[#71717a] mb-4">Support Agent handed 34 tickets to you with context</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { v: '126', l: 'Drafts offered' },
              { v: '89', l: 'Accepted / edited' },
              { v: '2m 40s', l: 'Time saved / ticket' },
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
              The AI handled <span className="font-semibold">61 pre-qualifying questions</span> for you before escalating, so you jump straight to resolution.
            </p>
          </div>
        </div>

        {/* Ticket mix */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
          <p className="text-sm font-semibold text-[#18181b] mb-0.5">What you're working on</p>
          <p className="text-xs text-[#71717a] mb-4">Ticket mix · last 30 days</p>
          <div className="flex flex-col gap-2">
            {agentTicketMix.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-[#3f3f46] flex-1">{item.label}</span>
                <span className="text-sm font-medium text-[#18181b] tabular-nums">{item.count}</span>
                <span className="text-xs text-[#71717a] tabular-nums w-8 text-right">{item.pct}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#f4f4f5]">
            <div className="flex items-start gap-3 bg-[#fafafe] border border-[#e5e7eb] rounded-lg px-3 py-2.5">
              <div className="w-6 h-6 rounded-md bg-[#8b5cf6] flex items-center justify-center shrink-0 mt-0.5">
                <Star size={11} className="text-white" />
              </div>
              <p className="text-xs text-[#6d28d9]">
                <span className="font-semibold">Great week</span> — your CSAT on complaint tickets rose from 4.2 to 4.5. Empathetic tone is landing well.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* My open tickets */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
          <h2 className="text-sm font-semibold text-[#18181b]">My open tickets</h2>
          <Link href="/inbox" className="flex items-center gap-1 text-xs text-[#71717a] hover:text-[#18181b] transition-colors">
            Open inbox
            <ChevronRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-[#f4f4f5]">
          {[
            { initials: 'MK', name: 'Maria K.', subject: 'Refund for damaged package — order #5821', tag: 'From AI', tagNote: 'Policy exception — needs manager', sla: 'SLA 12m', urgent: true },
            { initials: 'JL', name: 'James L.', subject: 'Tracking number not updating for 3 days', tag: 'From AI', tagNote: 'Carrier delay confirmed', sla: 'SLA 1h', urgent: false },
            { initials: 'PR', name: 'Priya R.', subject: 'Wrong colour item delivered — exchange request', tag: 'Direct', tagNote: 'Awaiting photo confirmation', sla: 'SLA 2h', urgent: false },
          ].map((t) => (
            <div key={t.subject} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#fafafa] transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-[#e0e7ff] text-[#4338ca] flex items-center justify-center text-xs font-semibold shrink-0">
                {t.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#18181b] truncate">{t.subject}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#a1a1aa] bg-[#f4f4f5] rounded px-1.5 py-0.5">{t.tag}</span>
                  <span className="text-xs text-[#71717a]">·</span>
                  <span className="text-xs text-[#71717a]">{t.name}</span>
                  <span className="text-xs text-[#71717a]">·</span>
                  <span className="text-xs text-[#71717a]">{t.tagNote}</span>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.urgent ? 'bg-[#fee2e2] text-[#dc2626]' : 'bg-[#f4f4f5] text-[#71717a]'}`}>
                {t.sla}
              </span>
            </div>
          ))}
        </div>
      </div>

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
