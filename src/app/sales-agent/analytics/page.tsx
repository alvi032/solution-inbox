'use client';

import SalesAgentSidebar from '@/components/sales-agent-sidebar';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const heroMetrics = [
  {
    label: 'Assisted revenue',
    value: '$32,540',
    delta: '↑ 18.4% vs prior 30d',
    pos: true,
    featured: true,
  },
  {
    label: 'AOV uplift',
    value: '+$14.80',
    delta: '↑ 22% · chat vs no-chat',
    pos: true,
    featured: false,
  },
  {
    label: 'Conversion lift',
    value: '+3.4pt',
    delta: '4.1% → 7.5% holdout test',
    pos: true,
    featured: false,
  },
  {
    label: 'Pre-sale tickets deflected',
    value: '418',
    delta: '$11.2k saved vs support cost',
    pos: true,
    featured: false,
  },
];

const secondaryMetrics = [
  { label: 'Sessions initiated', value: '712', delta: '↑ 11% vs prior', pos: true },
  { label: 'Purchase conversion', value: '24.6%', delta: '↑ 3.1pt of chatted sessions', pos: true },
  { label: 'Avg. messages / session', value: '5.2', delta: '↓ 0.8 — tighter flows', pos: true },
  { label: 'Handoff to support', value: '8.2%', delta: '↓ 1.4pt better containment', pos: true },
];

const intents = [
  { label: 'Product fit / sizing', pct: 84, display: '28%' },
  { label: 'Shipping & delivery', pct: 66, display: '22%' },
  { label: 'Product comparison', pct: 54, display: '18%' },
  { label: 'Discount / promo', pct: 42, display: '14%' },
  { label: 'Stock availability', pct: 33, display: '11%' },
  { label: 'Other', pct: 21, display: '7%' },
];

const sessionOutcomes = [
  { label: 'Purchase completed', count: 175, pct: '24.6%', color: '#2d7a5f' },
  { label: 'Added to cart, no checkout', count: 142, pct: '19.9%', color: '#cc785c' },
  { label: 'Resolved, no purchase', count: 336, pct: '47.2%', color: '#3d6897' },
  { label: 'Escalated to human', count: 59, pct: '8.2%', color: '#b8892d' },
];

const topProducts = [
  { product: 'Merino crew neck sweater', sessions: 142, conversion: '31.4%', revenue: '$6,840', aov: '$152', csat: '4.8', pos: true },
  { product: 'Everyday runner shoe', sessions: 118, conversion: '28.1%', revenue: '$5,210', aov: '$158', csat: '4.7', pos: true },
  { product: 'Linen summer dress', sessions: 96, conversion: '26.2%', revenue: '$3,890', aov: '$154', csat: '4.6', pos: true },
  { product: 'Performance yoga legging', sessions: 74, conversion: '22.7%', revenue: '$2,100', aov: '$125', csat: '4.5', pos: true },
  { product: 'Weekend canvas tote', sessions: 52, conversion: '19.4%', revenue: '$1,290', aov: '$128', csat: '4.1', pos: false },
];

export default function SalesAgentAnalyticsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <SalesAgentSidebar />

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-8 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-semibold text-[#18181b]">Sales Agent Analytics</h1>
              <p className="text-sm text-[#71717a] mt-0.5">On-site chat bot · converts browsers, deflects pre-purchase tickets</p>
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
                <div className="flex items-center gap-1">
                  <ArrowUpRight size={13} className={m.featured ? 'text-white/70' : 'text-[#16a34a]'} />
                  <span className={`text-xs font-medium ${m.featured ? 'text-white/70' : 'text-[#16a34a]'}`}>
                    {m.delta}
                  </span>
                </div>
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

          {/* Intents + Outcomes */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Top intents */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              <p className="text-sm font-semibold text-[#18181b] mb-0.5">Top shopper intents</p>
              <p className="text-xs text-[#71717a] mb-4">What customers are asking the Sales Agent about</p>
              <div className="flex flex-col gap-1">
                {intents.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 py-2 border-b border-[#f4f4f5] last:border-0">
                    <span className="text-sm text-[#3f3f46] min-w-[160px]">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#18181b] transition-all"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#18181b] tabular-nums w-9 text-right">{item.display}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-3 py-2.5">
                <span className="text-[#16a34a] font-bold text-sm shrink-0">+</span>
                <p className="text-xs text-[#166534]">
                  <span className="font-semibold">Fit & sizing</span> is your #1 intent — sessions that touch this topic convert 2.1× better than average. Consider a more prominent fit guide in PDP.
                </p>
              </div>
            </div>

            {/* Session outcomes */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              <p className="text-sm font-semibold text-[#18181b] mb-0.5">Session outcomes</p>
              <p className="text-xs text-[#71717a] mb-4">What happened after the conversation</p>

              {/* Stacked bar */}
              <div className="flex h-3 rounded-full overflow-hidden mb-5">
                {sessionOutcomes.map((o) => (
                  <div
                    key={o.label}
                    style={{
                      width: o.pct,
                      backgroundColor: o.color,
                    }}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-0">
                {sessionOutcomes.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 py-2.5 border-b border-[#f4f4f5] last:border-0">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-[#3f3f46] flex-1">{item.label}</span>
                    <span className="text-sm font-medium text-[#18181b] tabular-nums">{item.count}</span>
                    <span className="text-xs text-[#71717a] tabular-nums w-10 text-right">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top converting products */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e5e7eb]">
              <p className="text-sm font-semibold text-[#18181b]">Products with strongest chat-assisted sales</p>
              <p className="text-xs text-[#71717a] mt-0.5">Sales Agent is highest-leverage when placed near these SKUs</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Product</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Chat sessions</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Conversion</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Assisted revenue</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">AOV</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">CSAT</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((row, i) => (
                  <tr key={i} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafafa] transition-colors">
                    <td className="px-5 py-3.5 text-sm text-[#18181b]">{row.product}</td>
                    <td className="px-5 py-3.5 text-sm text-right font-medium text-[#18181b] tabular-nums">{row.sessions}</td>
                    <td className="px-5 py-3.5 text-sm text-right text-[#71717a] tabular-nums">{row.conversion}</td>
                    <td className="px-5 py-3.5 text-sm text-right font-medium text-[#18181b] tabular-nums">{row.revenue}</td>
                    <td className="px-5 py-3.5 text-sm text-right text-[#71717a] tabular-nums">{row.aov}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        row.pos ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fef3c7] text-[#92400e]'
                      }`}>
                        {row.csat}
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
