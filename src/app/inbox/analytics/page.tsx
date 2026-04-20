'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const heroMetrics = [
  {
    label: 'Support cost saved',
    value: '$41,180',
    delta: '↑ 9.2% vs prior 30d',
    pos: true,
    featured: true,
  },
  {
    label: 'Auto-resolution rate',
    value: '71%',
    delta: '↑ 5.1pt · target: 75%',
    pos: true,
    featured: false,
  },
  {
    label: 'Avg. resolution time',
    value: '1m 48s',
    delta: '↓ 62% vs 4m 42s human',
    pos: true,
    featured: false,
  },
  {
    label: 'Tickets handled',
    value: '1,021',
    delta: '724 auto · 297 escalated',
    pos: null,
    featured: false,
  },
];

const secondaryMetrics = [
  { label: 'First response time', value: '18s', delta: '↓ 96% vs 8m human avg', pos: true },
  { label: 'CSAT (AI-handled)', value: '4.5/5', delta: '+0.1 vs 4.4 human', pos: true },
  { label: 'One-touch resolution', value: '83%', delta: '↑ 2.3pt — no reopens', pos: true },
  { label: 'Escalation rate', value: '29%', delta: '↓ 5.1pt — better coverage', pos: true },
];

const intents = [
  { label: 'Order status / WISMO', pct: 96, color: '#2d7a5f' },
  { label: 'Returns / exchanges', pct: 82, color: '#2d7a5f' },
  { label: 'Product questions', pct: 74, color: '#2d7a5f' },
  { label: 'Address / order changes', pct: 68, color: '#2d7a5f' },
  { label: 'Refund requests', pct: 58, color: '#b8892d' },
  { label: 'Technical / account', pct: 45, color: '#b8892d' },
  { label: 'Complaints / disputes', pct: 22, color: '#dc2626' },
];

const escalationReasons = [
  { label: 'Customer requested human', count: 98, pct: '33%', color: '#dc2626' },
  { label: 'Out of AI scope / policy', count: 83, pct: '28%', color: '#b8892d' },
  { label: 'Low confidence response', count: 62, pct: '21%', color: '#cc785c' },
  { label: 'Multi-issue complexity', count: 38, pct: '13%', color: '#8b8a85' },
  { label: 'Sentiment trigger', count: 16, pct: '5%', color: '#565654' },
];

const costTable = [
  { intent: 'Order status / WISMO', handled: 312, handleTime: '42s', costAvoided: '$4,368', csat: '4.8', status: 'Excellent', pos: true },
  { intent: 'Returns & exchanges', handled: 198, handleTime: '2m 10s', costAvoided: '$2,772', csat: '4.6', status: 'Strong', pos: true },
  { intent: 'Product questions', handled: 104, handleTime: '1m 34s', costAvoided: '$1,456', csat: '4.5', status: 'Strong', pos: true },
  { intent: 'Address / order changes', handled: 58, handleTime: '58s', costAvoided: '$812', csat: '4.6', status: 'Strong', pos: true },
  { intent: 'Refund requests', handled: 32, handleTime: '3m 20s', costAvoided: '$448', csat: '4.2', status: 'Review', pos: false },
  { intent: 'Technical / account', handled: 20, handleTime: '4m 02s', costAvoided: '$280', csat: '4.0', status: 'Coaching', pos: false },
];

export default function SupportAnalyticsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
              <p className="text-sm text-[#71717a] mt-0.5">Ticket inbox AI · auto-resolves, escalates when out of scope</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e5e7eb] text-[#71717a] hover:text-[#18181b] transition-colors">All channels</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e5e7eb] text-[#71717a] hover:text-[#18181b] transition-colors">Last 30 days</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors">Export</button>
            </div>
          </div>

          {/* Hero metrics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {heroMetrics.map((m) => (
              <div
                key={m.label}
                className={`rounded-xl border p-5 flex flex-col gap-2 ${
                  m.featured
                    ? 'bg-[#18181b] border-[#18181b] text-white'
                    : 'bg-white border-[#e5e7eb]'
                }`}
              >
                <p className={`text-[10px] uppercase tracking-widest font-medium ${m.featured ? 'text-white/50' : 'text-[#a1a1aa]'}`}>
                  {m.label}
                </p>
                <p className={`text-2xl font-semibold leading-none ${m.featured ? 'text-white' : 'text-[#18181b]'}`}>
                  {m.value}
                </p>
                {m.pos !== null && (
                  <div className="flex items-center gap-1">
                    {m.pos
                      ? <ArrowUpRight size={13} className={m.featured ? 'text-white/70' : 'text-[#16a34a]'} />
                      : <ArrowDownRight size={13} className={m.featured ? 'text-white/70' : 'text-[#3b82f6]'} />
                    }
                    <span className={`text-xs font-medium ${m.featured ? 'text-white/70' : m.pos ? 'text-[#16a34a]' : 'text-[#3b82f6]'}`}>
                      {m.delta}
                    </span>
                  </div>
                )}
                {m.pos === null && (
                  <p className={`text-xs ${m.featured ? 'text-white/50' : 'text-[#71717a]'}`}>{m.delta}</p>
                )}
              </div>
            ))}
          </div>

          {/* Secondary metrics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {secondaryMetrics.map((m) => (
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

          {/* Intents + Escalation */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Ticket intents */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              <p className="text-sm font-semibold text-[#18181b] mb-0.5">Ticket intents handled</p>
              <p className="text-xs text-[#71717a] mb-4">What's coming in · auto-resolution rate per topic</p>
              <div className="flex flex-col gap-1">
                {intents.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 py-2 border-b border-[#f4f4f5] last:border-0">
                    <span className="text-sm text-[#3f3f46] min-w-[170px]">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#18181b] tabular-nums w-9 text-right">{item.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg px-3 py-2.5">
                <span className="text-[#d97706] font-bold text-sm shrink-0">!</span>
                <p className="text-xs text-[#92400e]">
                  <span className="font-semibold">Refund requests</span> are escalating at 42%. Adding a refund-policy snippet to the knowledge base could push auto-resolution above 75%.
                </p>
              </div>
            </div>

            {/* Escalation reasons */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              <p className="text-sm font-semibold text-[#18181b] mb-0.5">Escalation reasons</p>
              <p className="text-xs text-[#71717a] mb-4">Why 297 tickets went to humans</p>

              {/* Simple visual bar */}
              <div className="flex h-3 rounded-full overflow-hidden mb-4">
                {escalationReasons.map((r) => (
                  <div key={r.label} style={{ width: r.pct, backgroundColor: r.color }} />
                ))}
              </div>

              <div className="flex flex-col gap-0">
                {escalationReasons.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 py-2.5 border-b border-[#f4f4f5] last:border-0">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-[#3f3f46] flex-1">{item.label}</span>
                    <span className="text-sm font-medium text-[#18181b] tabular-nums">{item.count}</span>
                    <span className="text-xs text-[#71717a] tabular-nums w-8 text-right">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cost replacement table */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
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
                {costTable.map((row, i) => (
                  <tr key={i} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafafa] transition-colors">
                    <td className="px-5 py-3.5 text-sm text-[#18181b]">{row.intent}</td>
                    <td className="px-5 py-3.5 text-sm text-right font-medium text-[#18181b] tabular-nums">{row.handled}</td>
                    <td className="px-5 py-3.5 text-sm text-right text-[#71717a] tabular-nums">{row.handleTime}</td>
                    <td className="px-5 py-3.5 text-sm text-right font-medium text-[#18181b] tabular-nums">{row.costAvoided}</td>
                    <td className="px-5 py-3.5 text-sm text-right text-[#71717a] tabular-nums">{row.csat}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        row.pos
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : 'bg-[#fef3c7] text-[#92400e]'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}
