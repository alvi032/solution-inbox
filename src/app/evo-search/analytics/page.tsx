import EvoSearchSidebar from '@/components/evo-search-sidebar';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const heroMetrics = [
  {
    label: 'Search-attributed revenue',
    value: '$34,028',
    delta: '↑ 24% vs prior 30d',
    pos: true,
    featured: true,
  },
  {
    label: 'Search conversion rate',
    value: '7.8%',
    delta: '3.2× site avg · searchers vs non',
    pos: true,
    featured: false,
  },
  {
    label: 'Revenue per search',
    value: '$1.41',
    delta: '↑ $0.26 vs native search',
    pos: true,
    featured: false,
  },
  {
    label: 'Zero-result rate',
    value: '1.2%',
    delta: '↓ 78% vs 5.4% baseline',
    pos: true,
    featured: false,
  },
];

const secondaryMetrics = [
  { label: 'Total searches', value: '24,120', delta: '↑ 8% vs prior', pos: true },
  { label: 'Click-through rate', value: '58%', delta: '↑ 11pt vs 47% native', pos: true },
  { label: 'Avg. result position clicked', value: '2.4', delta: '↓ from 4.1 — top results fit better', pos: true },
  { label: 'Search abandonment', value: '14%', delta: '↓ 9pt vs 23% native', pos: true },
];

const aiInterventions = [
  { label: 'Typo auto-correction', count: '1,842', pct: '38%', color: '#cc785c' },
  { label: 'Synonym / intent match', count: '1,521', pct: '31%', color: '#2d7a5f' },
  { label: 'Personalized ranking', count: '982', pct: '20%', color: '#3d6897' },
  { label: 'Fallback recommendations', count: '542', pct: '11%', color: '#b8892d' },
];

const topQueries = [
  { query: 'merino sweater', searches: '412', ctr: '72%', conv: '12.4%', revenue: '$4,204' },
  { query: 'running shoes size 10', searches: '338', ctr: '68%', conv: '9.8%', revenue: '$3,621' },
  { query: 'linen dress summer', searches: '287', ctr: '65%', conv: '8.1%', revenue: '$2,890' },
  { query: 'yoga pants', searches: '254', ctr: '71%', conv: '10.2%', revenue: '$2,204' },
  { query: 'canvas tote bag', searches: '198', ctr: '62%', conv: '7.4%', revenue: '$1,420' },
  { query: 'waterproof jacket', searches: '176', ctr: '58%', conv: '6.9%', revenue: '$1,312' },
];

const recoveredQueries = [
  { original: 'marino sweter', interpreted: 'merino sweater', conv: '10.2%', saved: '$612' },
  { original: 'jumper', interpreted: 'sweater (synonym)', conv: '8.4%', saved: '$487' },
  { original: 'shoes for flat feet', interpreted: 'support footwear', conv: '7.1%', saved: '$421' },
  { original: 'warm winter coat', interpreted: 'insulated parkas', conv: '9.3%', saved: '$398' },
  { original: 'pants stretchy', interpreted: 'yoga + active pants', conv: '6.8%', saved: '$342' },
];

const unconvertedSearches = [
  { query: 'petite dresses', searches: 142, ctr: '41%', conv: '1.2%', cause: 'Size availability', causeType: 'warn' },
  { query: 'organic cotton tee', searches: 98, ctr: '52%', conv: '2.4%', cause: 'Price sensitive', causeType: 'info' },
  { query: 'sustainable brands', searches: 76, ctr: '38%', conv: '0.9%', cause: 'Content gap', causeType: 'neutral' },
  { query: 'gift under 50', searches: 68, ctr: '44%', conv: '1.8%', cause: 'Filter missing', causeType: 'neutral' },
  { query: 'matching sets', searches: 54, ctr: '48%', conv: '2.1%', cause: 'Merchandising', causeType: 'neutral' },
];

// Chart data
const chartData = [
  { label: 'Sun', evo: 7.2, native: 2.4 },
  { label: 'Mon', evo: 8.1, native: 2.6 },
  { label: 'Tue', evo: 7.6, native: 2.3 },
  { label: 'Wed', evo: 8.4, native: 2.5 },
  { label: 'Thu', evo: 7.9, native: 2.2 },
  { label: 'Fri', evo: 8.8, native: 2.7 },
  { label: 'Sat', evo: 7.8, native: 2.4 },
];

const CHART_H = 120;
const Y_MAX = 12;

function toY(v: number) { return CHART_H - (v / Y_MAX) * CHART_H; }

function buildPath(points: { x: number; y: number }[]) {
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const cx = (p1.x + p2.x) / 2;
    d += ` C ${cx},${p1.y} ${cx},${p2.y} ${p2.x},${p2.y}`;
  }
  return d;
}

const CHART_W = 480;
const evoPoints = chartData.map((d, i) => ({ x: (i / (chartData.length - 1)) * CHART_W, y: toY(d.evo) }));
const nativePoints = chartData.map((d, i) => ({ x: (i / (chartData.length - 1)) * CHART_W, y: toY(d.native) }));

const tagStyles: Record<string, string> = {
  warn: 'bg-[#fef3c7] text-[#92400e]',
  info: 'bg-[#dbeafe] text-[#1e40af]',
  neutral: 'bg-[#f4f4f5] text-[#71717a]',
};

export default function EvoSearchAnalyticsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <EvoSearchSidebar />

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col gap-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#18181b]">Evo Search Analytics</h1>
              <p className="text-sm text-[#71717a] mt-0.5">AI product search · personalized results, auto-correction, intent understanding</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e5e7eb] text-[#71717a] hover:text-[#18181b] transition-colors">All devices</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e5e7eb] text-[#71717a] hover:text-[#18181b] transition-colors">Last 30 days</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors">Export</button>
            </div>
          </div>

          {/* Hero metrics */}
          <div className="grid grid-cols-4 gap-4">
            {heroMetrics.map((m) => (
              <div
                key={m.label}
                className={`rounded-xl border p-5 flex flex-col gap-2 ${
                  m.featured ? 'bg-[#18181b] border-[#18181b]' : 'bg-white border-[#e5e7eb]'
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
                  <span className={`text-xs font-medium ${m.featured ? 'text-white/70' : 'text-[#16a34a]'}`}>{m.delta}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary metrics */}
          <div className="grid grid-cols-4 gap-4">
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

          {/* Chart + AI interventions */}
          <div className="grid grid-cols-2 gap-4">
            {/* Performance chart */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-[#18181b]">Search performance vs native baseline</p>
                  <p className="text-xs text-[#71717a] mt-0.5">Search conversion rate, daily</p>
                </div>
                <div className="flex gap-3 text-xs text-[#71717a]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#cc785c]" />
                    Evo Search
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#d1d5db]" />
                    Native
                  </div>
                </div>
              </div>
              <div className="relative">
                <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full" style={{ height: 140 }} preserveAspectRatio="none">
                  {[3, 6, 9, 12].map((tick) => (
                    <line key={tick} x1={0} y1={toY(tick)} x2={CHART_W} y2={toY(tick)} stroke="#f4f4f5" strokeWidth="1" />
                  ))}
                  <path d={buildPath(nativePoints)} fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
                  <path d={buildPath(evoPoints)} fill="none" stroke="#cc785c" strokeWidth="2" strokeLinecap="round" />
                  {evoPoints.map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#cc785c" />
                  ))}
                </svg>
                <div className="flex justify-between mt-2">
                  {chartData.map((d) => (
                    <span key={d.label} className="text-[11px] text-[#71717a]">{d.label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI interventions */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              <p className="text-sm font-semibold text-[#18181b] mb-0.5">AI interventions</p>
              <p className="text-xs text-[#71717a] mb-4">Searches that would've failed on native search</p>

              {/* Stacked bar */}
              <div className="flex h-3 rounded-full overflow-hidden mb-5">
                {aiInterventions.map((item) => (
                  <div key={item.label} style={{ width: item.pct, backgroundColor: item.color }} />
                ))}
              </div>

              <div className="flex flex-col gap-0">
                {aiInterventions.map((item) => (
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

          {/* Top queries + Recovered queries */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top performing */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
              <div className="px-4 py-3.5 border-b border-[#e5e7eb]">
                <p className="text-sm font-semibold text-[#18181b]">Top performing queries</p>
                <p className="text-xs text-[#71717a] mt-0.5">Sorted by attributed revenue</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">Query</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-[#71717a]">Searches</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-[#71717a]">CTR</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-[#71717a]">Conv.</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-[#71717a]">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topQueries.map((row, i) => (
                    <tr key={i} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafafa] transition-colors">
                      <td className="px-4 py-2.5 text-xs font-mono text-[#18181b]">{row.query}</td>
                      <td className="px-4 py-2.5 text-xs text-right text-[#71717a] tabular-nums">{row.searches}</td>
                      <td className="px-4 py-2.5 text-xs text-right text-[#71717a] tabular-nums">{row.ctr}</td>
                      <td className="px-4 py-2.5 text-xs text-right text-[#71717a] tabular-nums">{row.conv}</td>
                      <td className="px-4 py-2.5 text-xs text-right font-medium text-[#18181b] tabular-nums">{row.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recovered queries */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
              <div className="px-4 py-3.5 border-b border-[#e5e7eb]">
                <p className="text-sm font-semibold text-[#18181b]">Recovered queries</p>
                <p className="text-xs text-[#71717a] mt-0.5">Searches AI rescued from zero-result</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">Original</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">AI interpreted as</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-[#71717a]">Conv.</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-[#71717a]">Saved</th>
                  </tr>
                </thead>
                <tbody>
                  {recoveredQueries.map((row, i) => (
                    <tr key={i} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafafa] transition-colors">
                      <td className="px-4 py-2.5 text-xs font-mono text-[#18181b]">{row.original}</td>
                      <td className="px-4 py-2.5 text-xs font-mono text-[#71717a]">{row.interpreted}</td>
                      <td className="px-4 py-2.5 text-xs text-right text-[#71717a] tabular-nums">{row.conv}</td>
                      <td className="px-4 py-2.5 text-xs text-right font-medium text-[#16a34a] tabular-nums">{row.saved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Opportunity: unconverted searches */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e5e7eb]">
              <p className="text-sm font-semibold text-[#18181b]">Opportunity: unconverted searches</p>
              <p className="text-xs text-[#71717a] mt-0.5">High-volume queries where shoppers browsed but didn't buy — content or inventory gaps</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Query</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Searches</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">CTR</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[#71717a]">Conversion</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Likely cause</th>
                </tr>
              </thead>
              <tbody>
                {unconvertedSearches.map((row, i) => (
                  <tr key={i} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafafa] transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono text-[#18181b]">{row.query}</td>
                    <td className="px-5 py-3.5 text-sm text-right text-[#71717a] tabular-nums">{row.searches}</td>
                    <td className="px-5 py-3.5 text-sm text-right text-[#71717a] tabular-nums">{row.ctr}</td>
                    <td className="px-5 py-3.5 text-sm text-right text-[#71717a] tabular-nums">{row.conv}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tagStyles[row.causeType]}`}>
                        {row.cause}
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
