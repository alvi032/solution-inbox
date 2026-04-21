'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

type AnalyticsView = 'all' | 'ai' | 'human';

// ─── AI view data ────────────────────────────────────────────────────

const aiHero = [
  { label: 'Support cost saved', value: '$41,180', delta: '↑ 9.2% vs prior 30d', pos: true, featured: true },
  { label: 'Auto-resolution rate', value: '71%', delta: '↑ 5.1pt · target: 75%', pos: true, featured: false },
  { label: 'Avg. resolution time', value: '1m 48s', delta: '↓ 62% vs 4m 42s human', pos: true, featured: false },
  { label: 'Tickets handled', value: '1,021', delta: '724 auto · 297 escalated', pos: null, featured: false },
];

const aiSecondary = [
  { label: 'First response time', value: '18s', delta: '↓ 96% vs 8m human avg', pos: true },
  { label: 'CSAT (AI-handled)', value: '4.5/5', delta: '+0.1 vs 4.4 human', pos: true },
  { label: 'One-touch resolution', value: '83%', delta: '↑ 2.3pt — no reopens', pos: true },
  { label: 'Escalation rate', value: '29%', delta: '↓ 5.1pt — better coverage', pos: true },
];

const aiIntents = [
  { label: 'Order status / WISMO', pct: 96, color: '#2d7a5f' },
  { label: 'Returns / exchanges', pct: 82, color: '#2d7a5f' },
  { label: 'Product questions', pct: 74, color: '#2d7a5f' },
  { label: 'Address / order changes', pct: 68, color: '#2d7a5f' },
  { label: 'Refund requests', pct: 58, color: '#b8892d' },
  { label: 'Technical / account', pct: 45, color: '#b8892d' },
  { label: 'Complaints / disputes', pct: 22, color: '#dc2626' },
];

const aiIntentInsight = {
  type: 'warn' as const,
  text: <><span className="font-semibold">Refund requests</span> are escalating at 42%. Adding a refund-policy snippet to the knowledge base could push auto-resolution above 75%.</>,
};

const aiEscalation = [
  { label: 'Customer requested human', count: 98, pct: '33%', color: '#dc2626' },
  { label: 'Out of AI scope / policy', count: 83, pct: '28%', color: '#b8892d' },
  { label: 'Low confidence response', count: 62, pct: '21%', color: '#cc785c' },
  { label: 'Multi-issue complexity', count: 38, pct: '13%', color: '#8b8a85' },
  { label: 'Sentiment trigger', count: 16, pct: '5%', color: '#565654' },
];

const aiTable = [
  { intent: 'Order status / WISMO', handled: 312, handleTime: '42s', costAvoided: '$4,368', csat: '4.8', status: 'Excellent', pos: true },
  { intent: 'Returns & exchanges', handled: 198, handleTime: '2m 10s', costAvoided: '$2,772', csat: '4.6', status: 'Strong', pos: true },
  { intent: 'Product questions', handled: 104, handleTime: '1m 34s', costAvoided: '$1,456', csat: '4.5', status: 'Strong', pos: true },
  { intent: 'Address / order changes', handled: 58, handleTime: '58s', costAvoided: '$812', csat: '4.6', status: 'Strong', pos: true },
  { intent: 'Refund requests', handled: 32, handleTime: '3m 20s', costAvoided: '$448', csat: '4.2', status: 'Review', pos: false },
  { intent: 'Technical / account', handled: 20, handleTime: '4m 02s', costAvoided: '$280', csat: '4.0', status: 'Coaching', pos: false },
];

// ─── Human view data ─────────────────────────────────────────────────

const humanHero = [
  { label: 'Tickets handled', value: '939', delta: '297 escalated from AI · 642 direct', pos: null, featured: true },
  { label: 'Resolution rate', value: '86.8%', delta: '↑ 2.1pt vs prior 30d', pos: true, featured: false },
  { label: 'Avg. handle time', value: '8m 25s', delta: '↑ vs AI (1m 48s)', pos: false, featured: false },
  { label: 'Team CSAT', value: '4.2/5', delta: '↓ 0.3 vs AI-handled (4.5)', pos: false, featured: false },
];

const humanSecondary = [
  { label: 'AI draft acceptance', value: '56%', delta: '↑ 4pt vs prior 30d', pos: true },
  { label: 'SLA compliance', value: '82%', delta: '↓ 3pt — 1 agent flagged', pos: false },
  { label: 'One-touch resolution', value: '68%', delta: '↓ 10pt vs AI (83%)', pos: false },
  { label: 'AI context used', value: '91%', delta: 'of escalations had full AI handoff', pos: true },
];

const humanIntents = [
  { label: 'Complaints & disputes', pct: 23, color: '#dc2626' },
  { label: 'Returns & exchanges', pct: 16, color: '#cc785c' },
  { label: 'Shipping issues', pct: 14, color: '#3d6897' },
  { label: 'Refunds & policy exceptions', pct: 14, color: '#b8892d' },
  { label: 'Product questions', pct: 10, color: '#2d7a5f' },
  { label: 'Other', pct: 23, color: '#a1a1aa' },
];

const humanIntentInsight = {
  type: 'info' as const,
  text: <><span className="font-semibold">Complaints & disputes</span> at 23% — these are genuinely complex and correct for human handling. AI escalation context is reducing resolution time by an estimated 2m per case.</>,
};

const humanWorkload = [
  { label: 'Escalated from AI', count: 297, pct: '32%', color: '#8b5cf6' },
  { label: 'Direct / unrouted', count: 642, pct: '68%', color: '#3d6897' },
];

const humanTable = [
  { agent: 'Sarah M.', tickets: 284, resolved: 261, resRate: '91.9%', aht: '6m 40s', csat: '4.7', drafts: '71%', status: 'Strong', pos: true },
  { agent: 'Priya K.', tickets: 241, resolved: 226, resRate: '93.8%', aht: '5m 52s', csat: '4.4', drafts: '62%', status: 'Strong', pos: true },
  { agent: 'James T.', tickets: 218, resolved: 194, resRate: '88.9%', aht: '8m 12s', csat: '4.1', drafts: '44%', status: 'Review', pos: false },
  { agent: 'Dan R.', tickets: 196, resolved: 134, resRate: '68.4%', aht: '14m 22s', csat: '3.4', drafts: '38%', status: 'Coaching', pos: false },
];

// ─── All view data ───────────────────────────────────────────────────

const allHero = [
  { label: 'Total tickets', value: '1,960', delta: '1,021 AI · 939 human-handled', pos: null, featured: true },
  { label: 'Overall resolution rate', value: '78.5%', delta: '724 AI auto · 815 human resolved', pos: null, featured: false },
  { label: 'Cost impact', value: '$52,180', delta: '$41.2k cost saved · $11k cost incurred', pos: null, featured: false },
  { label: 'Blended CSAT', value: '4.3/5', delta: 'AI 4.5 · Human 4.2', pos: null, featured: false },
];

const allSecondary = [
  { label: 'AI auto-resolved', value: '37%', delta: '724 of 1,960 tickets', pos: true },
  { label: 'Human-resolved', value: '42%', delta: '815 of 1,960 tickets', pos: true },
  { label: 'Unresolved / open', value: '21%', delta: '421 tickets still in progress', pos: false },
  { label: 'Escalation rate', value: '29%', delta: '297 AI → human handoffs', pos: false },
];

const allIntents = [
  { label: 'Returns & exchanges', pct: 23, color: '#cc785c' },
  { label: 'Order tracking', pct: 20, color: '#2d7a5f' },
  { label: 'Shipping issues', pct: 18, color: '#3d6897' },
  { label: 'Refunds', pct: 15, color: '#b8892d' },
  { label: 'Complaints & disputes', pct: 8, color: '#dc2626' },
  { label: 'Other', pct: 16, color: '#a1a1aa' },
];

const allIntentInsight = {
  type: 'info' as const,
  text: <><span className="font-semibold">Returns & exchanges</span> lead at 23% of all volume. AI resolves 82% of these — expanding AI policy coverage on complex returns could reduce human load by ~30 tickets/month.</>,
};

const allHandling = [
  { label: 'AI auto-resolved', count: 724, pct: '37%', color: '#7c3aed' },
  { label: 'Human-resolved (direct)', count: 642, pct: '33%', color: '#4338ca' },
  { label: 'Human-resolved (escalated)', count: 173, pct: '9%', color: '#6366f1' },
  { label: 'Open / in progress', count: 421, pct: '21%', color: '#a1a1aa' },
];

const allTable = [
  { category: 'Order status / WISMO', total: 362, aiHandled: 312, humanHandled: 50, aiRate: '86%', csat: '4.7' },
  { category: 'Returns & exchanges', total: 451, aiHandled: 198, humanHandled: 253, aiRate: '44%', csat: '4.5' },
  { category: 'Shipping issues', total: 352, aiHandled: 178, humanHandled: 174, aiRate: '51%', csat: '4.3' },
  { category: 'Refunds', total: 294, aiHandled: 32, humanHandled: 262, aiRate: '11%', csat: '4.2' },
  { category: 'Product questions', total: 272, aiHandled: 104, humanHandled: 168, aiRate: '38%', csat: '4.4' },
  { category: 'Complaints & disputes', total: 157, aiHandled: 0, humanHandled: 157, aiRate: '0%', csat: '4.1' },
];

// ─── Page ────────────────────────────────────────────────────────────

export default function SupportAnalyticsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState<AnalyticsView>('all');

  const tabs: { key: AnalyticsView; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'ai', label: 'AI' },
    { key: 'human', label: 'Human' },
  ];

  const hero = view === 'ai' ? aiHero : view === 'human' ? humanHero : allHero;
  const secondary = view === 'ai' ? aiSecondary : view === 'human' ? humanSecondary : allSecondary;
  const intents = view === 'ai' ? aiIntents : view === 'human' ? humanIntents : allIntents;
  const intentInsight = view === 'ai' ? aiIntentInsight : view === 'human' ? humanIntentInsight : allIntentInsight;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        activeView=""
      />

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-8 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-semibold text-[#18181b]">Support Agent Analytics</h1>
              <p className="text-sm text-[#71717a] mt-0.5">Ticket inbox · AI auto-resolution and human agent performance</p>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex items-center bg-[#f4f4f5] rounded-lg p-0.5 gap-0.5 mr-1">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setView(t.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      view === t.key
                        ? 'bg-white text-[#18181b] shadow-sm'
                        : 'text-[#71717a] hover:text-[#3f3f46]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e5e7eb] text-[#71717a] hover:text-[#18181b] transition-colors">Last 30 days</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors">Export</button>
            </div>
          </div>

          {/* Hero metrics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {hero.map((m) => (
              <div
                key={m.label}
                className={`rounded-xl border p-5 flex flex-col gap-2 ${
                  m.featured ? 'bg-[#18181b] border-[#18181b] text-white' : 'bg-white border-[#e5e7eb]'
                }`}
              >
                <p className={`text-[10px] uppercase tracking-widest font-medium ${m.featured ? 'text-white/50' : 'text-[#a1a1aa]'}`}>
                  {m.label}
                </p>
                <p className={`text-2xl font-semibold leading-none ${m.featured ? 'text-white' : 'text-[#18181b]'}`}>
                  {m.value}
                </p>
                {m.pos !== null ? (
                  <div className="flex items-center gap-1">
                    {m.pos
                      ? <ArrowUpRight size={13} className={m.featured ? 'text-white/70' : 'text-[#16a34a]'} />
                      : <ArrowDownRight size={13} className={m.featured ? 'text-white/70' : 'text-[#3b82f6]'} />
                    }
                    <span className={`text-xs font-medium ${m.featured ? 'text-white/70' : m.pos ? 'text-[#16a34a]' : 'text-[#3b82f6]'}`}>
                      {m.delta}
                    </span>
                  </div>
                ) : (
                  <p className={`text-xs ${m.featured ? 'text-white/50' : 'text-[#71717a]'}`}>{m.delta}</p>
                )}
              </div>
            ))}
          </div>

          {/* Secondary metrics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {secondary.map((m) => (
              <div key={m.label} className="bg-[#f9fafb] rounded-xl border border-[#e5e7eb] px-4 py-4">
                <p className="text-[10px] uppercase tracking-widest font-medium text-[#a1a1aa] mb-1">{m.label}</p>
                <p className="text-xl font-semibold text-[#18181b] leading-none">{m.value}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {m.pos
                    ? <ArrowUpRight size={12} className="text-[#16a34a]" />
                    : <ArrowDownRight size={12} className="text-[#3b82f6]" />
                  }
                  <span className={`text-xs font-medium ${m.pos ? 'text-[#16a34a]' : 'text-[#3b82f6]'}`}>{m.delta}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Intents + right panel */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Ticket intents */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              <p className="text-sm font-semibold text-[#18181b] mb-0.5">
                {view === 'ai' ? 'Ticket intents handled' : view === 'human' ? 'What humans are handling' : 'Ticket intents · all agents'}
              </p>
              <p className="text-xs text-[#71717a] mb-4">
                {view === 'ai' ? 'Auto-resolution rate per topic' : view === 'human' ? 'Breakdown by ticket type · last 30 days' : 'Volume share by category · last 30 days'}
              </p>
              <div className="flex flex-col gap-1">
                {intents.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 py-2 border-b border-[#f4f4f5] last:border-0">
                    <span className="text-sm text-[#3f3f46] min-w-[170px]">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                    <span className="text-sm font-medium text-[#18181b] tabular-nums w-9 text-right">{item.pct}%</span>
                  </div>
                ))}
              </div>
              <div className={`mt-4 flex items-start gap-3 rounded-lg px-3 py-2.5 border ${
                intentInsight.type === 'warn'
                  ? 'bg-[#fffbeb] border-[#fde68a]'
                  : 'bg-[#fafafe] border-[#e5e7eb]'
              }`}>
                <span className={`font-bold text-sm shrink-0 ${intentInsight.type === 'warn' ? 'text-[#d97706]' : 'text-[#8b5cf6]'}`}>
                  {intentInsight.type === 'warn' ? '!' : '↗'}
                </span>
                <p className={`text-xs ${intentInsight.type === 'warn' ? 'text-[#92400e]' : 'text-[#6d28d9]'}`}>
                  {intentInsight.text}
                </p>
              </div>
            </div>

            {/* Right panel: escalation / workload / handling breakdown */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              {view === 'ai' && (
                <>
                  <p className="text-sm font-semibold text-[#18181b] mb-0.5">Escalation reasons</p>
                  <p className="text-xs text-[#71717a] mb-4">Why 297 tickets went to humans</p>
                  <div className="flex h-3 rounded-full overflow-hidden mb-4">
                    {aiEscalation.map((r) => (
                      <div key={r.label} style={{ width: r.pct, backgroundColor: r.color }} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-0">
                    {aiEscalation.map((item) => (
                      <div key={item.label} className="flex items-center gap-3 py-2.5 border-b border-[#f4f4f5] last:border-0">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-[#3f3f46] flex-1">{item.label}</span>
                        <span className="text-sm font-medium text-[#18181b] tabular-nums">{item.count}</span>
                        <span className="text-xs text-[#71717a] tabular-nums w-8 text-right">{item.pct}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {view === 'human' && (
                <>
                  <p className="text-sm font-semibold text-[#18181b] mb-0.5">Ticket source</p>
                  <p className="text-xs text-[#71717a] mb-4">Where human tickets originate</p>
                  <div className="flex h-3 rounded-full overflow-hidden mb-4">
                    {humanWorkload.map((r) => (
                      <div key={r.label} style={{ width: r.pct, backgroundColor: r.color }} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-0 mb-4">
                    {humanWorkload.map((item) => (
                      <div key={item.label} className="flex items-center gap-3 py-2.5 border-b border-[#f4f4f5] last:border-0">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-[#3f3f46] flex-1">{item.label}</span>
                        <span className="text-sm font-medium text-[#18181b] tabular-nums">{item.count}</span>
                        <span className="text-xs text-[#71717a] tabular-nums w-8 text-right">{item.pct}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#fafafe] border border-[#e5e7eb] rounded-lg px-3 py-2.5">
                    <p className="text-xs text-[#6d28d9]">
                      <span className="font-semibold">91%</span> of escalated tickets arrive with full AI-generated context, reducing human handle time by an estimated 2m 10s per case.
                    </p>
                  </div>
                </>
              )}

              {view === 'all' && (
                <>
                  <p className="text-sm font-semibold text-[#18181b] mb-0.5">Ticket handling breakdown</p>
                  <p className="text-xs text-[#71717a] mb-4">How 1,960 tickets were resolved</p>
                  <div className="flex h-3 rounded-full overflow-hidden mb-4">
                    {allHandling.map((r) => (
                      <div key={r.label} style={{ width: r.pct, backgroundColor: r.color }} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-0">
                    {allHandling.map((item) => (
                      <div key={item.label} className="flex items-center gap-3 py-2.5 border-b border-[#f4f4f5] last:border-0">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-[#3f3f46] flex-1">{item.label}</span>
                        <span className="text-sm font-medium text-[#18181b] tabular-nums">{item.count.toLocaleString()}</span>
                        <span className="text-xs text-[#71717a] tabular-nums w-8 text-right">{item.pct}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom table */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
            {view === 'ai' && (
              <>
                <div className="px-5 py-4 border-b border-[#e5e7eb]">
                  <p className="text-sm font-semibold text-[#18181b]">Cost replacement breakdown</p>
                  <p className="text-xs text-[#71717a] mt-0.5">Human cost avoided · based on $14/ticket agent cost</p>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e5e7eb]">
                      <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Intent category</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">AI handled</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Avg. handle time</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Cost avoided</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">CSAT</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiTable.map((row, i) => (
                      <tr key={i} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafafa] transition-colors">
                        <td className="px-5 py-3.5 text-sm text-[#18181b]">{row.intent}</td>
                        <td className="px-5 py-3.5 text-sm text-right font-medium text-[#18181b] tabular-nums">{row.handled}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-[#71717a] tabular-nums">{row.handleTime}</td>
                        <td className="px-5 py-3.5 text-sm text-right font-medium text-[#18181b] tabular-nums">{row.costAvoided}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-[#71717a] tabular-nums">{row.csat}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${row.pos ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fef3c7] text-[#92400e]'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {view === 'human' && (
              <>
                <div className="px-5 py-4 border-b border-[#e5e7eb]">
                  <p className="text-sm font-semibold text-[#18181b]">Agent performance</p>
                  <p className="text-xs text-[#71717a] mt-0.5">Individual metrics · last 30 days</p>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e5e7eb]">
                      <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Agent</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Tickets</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Resolved</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">AHT</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">CSAT</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">AI drafts</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {humanTable.map((row, i) => (
                      <tr key={i} className={`border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafafa] transition-colors ${!row.pos ? 'bg-[#fff8f8]' : ''}`}>
                        <td className="px-5 py-3.5 text-sm font-medium text-[#18181b]">{row.agent}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-[#3f3f46] tabular-nums">{row.tickets}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-[#3f3f46] tabular-nums">{row.resRate}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-[#3f3f46] tabular-nums">{row.aht}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-[#3f3f46] tabular-nums">{row.csat}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-[#3f3f46] tabular-nums">{row.drafts}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${row.pos ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fef3c7] text-[#92400e]'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {view === 'all' && (
              <>
                <div className="px-5 py-4 border-b border-[#e5e7eb]">
                  <p className="text-sm font-semibold text-[#18181b]">AI vs human handling by category</p>
                  <p className="text-xs text-[#71717a] mt-0.5">Volume and handling split per ticket type</p>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e5e7eb]">
                      <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Category</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Total</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">AI handled</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Human handled</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">AI rate</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">CSAT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTable.map((row, i) => (
                      <tr key={i} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafafa] transition-colors">
                        <td className="px-5 py-3.5 text-sm text-[#18181b]">{row.category}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-[#3f3f46] tabular-nums">{row.total}</td>
                        <td className="px-5 py-3.5 text-sm text-right font-medium text-[#18181b] tabular-nums">{row.aiHandled}</td>
                        <td className="px-5 py-3.5 text-sm text-right text-[#3f3f46] tabular-nums">{row.humanHandled}</td>
                        <td className="px-5 py-3.5 text-right">
                          <span className={`text-xs font-medium tabular-nums px-2 py-0.5 rounded-md ${
                            parseInt(row.aiRate) >= 70 ? 'bg-[#dcfce7] text-[#15803d]' :
                            parseInt(row.aiRate) >= 30 ? 'bg-[#fef3c7] text-[#92400e]' :
                            'bg-[#fee2e2] text-[#dc2626]'
                          }`}>{row.aiRate}</span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-right text-[#71717a] tabular-nums">{row.csat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
