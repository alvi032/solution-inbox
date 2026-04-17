import EvoSearchSidebar from '@/components/evo-search-sidebar';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const kpis = [
  { label: 'Total Searches', value: '8,341', delta: '+2.3% from last week' },
  { label: 'Search to Cart', value: '18.4%', delta: '+2.3% from last week' },
  { label: 'Revenue from Search', value: '$12,458', delta: '+2.3% from last week' },
  { label: 'Avg. Results Clicked', value: '2.3', delta: '+2.3% from last week' },
];

// Chart data: values on 0–800 scale
const chartData = [
  { label: 'Sun', value: 600 },
  { label: 'Mon', value: 650 },
  { label: 'Tue', value: 700 },
  { label: 'Wed', value: 550 },
  { label: 'Thu', value: 625 },
  { label: 'Fri', value: 630 },
];

const yTicks = [800, 600, 400, 200, 0];

// SVG chart dimensions
const CHART_W = 440;
const CHART_H = 160;
const Y_MAX = 800;

function toSvgCoords(value: number, index: number, total: number) {
  const x = (index / (total - 1)) * CHART_W;
  const y = CHART_H - (value / Y_MAX) * CHART_H;
  return { x, y };
}

function buildSmoothedPath(points: { x: number; y: number }[]) {
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  return d;
}

const svgPoints = chartData.map((d, i) => toSvgCoords(d.value, i, chartData.length));
const linePath = buildSmoothedPath(svgPoints);

const cardShadow = '0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 1px -0.5px rgba(0,0,0,0.03), 0px 3px 3px -1.5px rgba(0,0,0,0.02), 0px 5px 5px -2.5px rgba(0,0,0,0.03)';

const topQueries = [
  { name: 'Leather Bag', value: '2,708', up: true },
  { name: 'Denims', value: '2,104', up: false },
  { name: 'Active Wear', value: '1,422', up: false },
  { name: 'Rain Boots', value: '706', up: true },
  { name: 'Polo T-Shirt', value: '706', up: true },
];

const noResultsQueries = [
  { name: 'Leather Bag', value: '2,708', up: true },
  { name: 'Denims', value: '2,104', up: false },
  { name: 'Active Wear', value: '1,422', up: false },
  { name: 'Rain Boots', value: '706', up: true },
  { name: 'Polo T-Shirt', value: '706', up: true },
];

const topClicked = [
  { name: 'Leather Bag', clicks: '2,708', conversion: '2.8%', up: true },
  { name: 'Denims', clicks: '2,104', conversion: '3.4%', up: false },
  { name: 'Active Wear', clicks: '1,422', conversion: '1.2%', up: false },
  { name: 'Rain Boots', clicks: '706', conversion: '3.9%', up: true },
  { name: 'Polo T-Shirt', clicks: '706', conversion: '1.9%', up: true },
];

const topPurchased = [
  { name: 'Leather Bag', purchases: '2,708', revenue: '$22,708', up: true },
  { name: 'Denims', purchases: '2,104', revenue: '$22,104', up: false },
  { name: 'Active Wear', purchases: '1,422', revenue: '$12,422', up: false },
  { name: 'Rain Boots', purchases: '706', revenue: '$2,706', up: true },
  { name: 'Polo T-Shirt', purchases: '706', revenue: '$1,610', up: true },
];

export default function EvoSearchAnalyticsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <EvoSearchSidebar />

      <main className="flex-1 overflow-y-auto bg-[#f6f6f7]">
        <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col gap-4">

          {/* Page header */}
          <div className="mb-2">
            <h1 className="text-xl font-semibold text-[#18181b]">Analytics</h1>
            <p className="text-sm text-[#71717a] mt-0.5">Search performance for the past 7 days.</p>
          </div>

          {/* Section 1 — KPI tiles */}
          <div
            className="bg-white rounded-xl overflow-hidden flex"
            style={{ boxShadow: cardShadow }}
          >
            {kpis.map((kpi, i) => (
              <div key={kpi.label} className="flex-1 flex flex-col gap-1 px-4 py-3" style={i > 0 ? { borderLeft: '1px solid #ebebeb' } : {}}>
                <p className="text-[12px] font-medium text-[#303030] leading-4">{kpi.label}</p>
                <p className="text-[14px] font-semibold text-[#303030] leading-5">{kpi.value}</p>
                <p className="text-[12px] leading-4">
                  <span className="text-[#16a34a] font-medium">+2.3%</span>
                  <span className="text-[#616161] font-medium"> from last week</span>
                </p>
              </div>
            ))}
          </div>

          {/* Section 2 — Line Chart */}
          <div
            className="bg-white rounded-xl p-4 flex flex-col gap-2"
            style={{ boxShadow: cardShadow }}
          >
            <div>
              <p className="text-[14px] font-semibold text-[#303030] leading-5">Search Volume Trend</p>
              <p className="text-[13px] font-medium text-[#616161] leading-5">Daily search activity over the past week</p>
            </div>

            {/* Chart */}
            <div className="relative pl-9 pb-6 pt-4">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-4 bottom-6 flex flex-col justify-between">
                {yTicks.map((tick) => (
                  <span key={tick} className="text-[12px] text-[#71717a] leading-none w-8 text-right block">
                    {tick}
                  </span>
                ))}
              </div>

              {/* SVG chart */}
              <svg
                viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                className="w-full"
                style={{ height: 194 }}
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {yTicks.map((tick) => {
                  const y = CHART_H - (tick / Y_MAX) * CHART_H;
                  return (
                    <line
                      key={tick}
                      x1={0} y1={y} x2={CHART_W} y2={y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      strokeDasharray="4 3"
                    />
                  );
                })}

                {/* Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Dots */}
                {svgPoints.map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#0d9488" />
                ))}
              </svg>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-9 right-0 flex justify-between">
                {chartData.map((d) => (
                  <span key={d.label} className="text-[12px] text-[#71717a] leading-none">{d.label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3 — Query breakdown */}
          <div
            className="bg-white rounded-xl p-4 flex flex-col gap-4"
            style={{ boxShadow: cardShadow }}
          >
            <div>
              <p className="text-[14px] font-semibold text-[#303030] leading-5">Search query breakdown</p>
              <p className="text-[13px] font-medium text-[#616161] leading-5">
                Review what users are searching and driving the most conversion on your site
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Table 1 — Top Search Queries */}
              <QueryTable
                title="Top search queries"
                colHeader="Queries"
                rows={topQueries.map((r) => ({ name: r.name, up: r.up, cols: [r.value] }))}
                extraHeaders={[]}
              />

              {/* Table 2 — No Results */}
              <QueryTable
                title="No results queries"
                colHeader="Queries"
                rows={noResultsQueries.map((r) => ({ name: r.name, up: r.up, cols: [r.value] }))}
                extraHeaders={[]}
              />

              {/* Table 3 — Top Clicked */}
              <QueryTable
                title="Top clicked products"
                colHeader="Clicks"
                rows={topClicked.map((r) => ({ name: r.name, up: r.up, cols: [r.clicks, r.conversion] }))}
                extraHeaders={['Conversion']}
              />

              {/* Table 4 — Top Purchased */}
              <QueryTable
                title="Top purchased products"
                colHeader="Purchases"
                rows={topPurchased.map((r) => ({ name: r.name, up: r.up, cols: [r.purchases, r.revenue] }))}
                extraHeaders={['Revenue']}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function QueryTable({
  title,
  colHeader,
  extraHeaders,
  rows,
}: {
  title: string;
  colHeader: string;
  extraHeaders: string[];
  rows: { name: string; up: boolean; cols: string[] }[];
}) {
  return (
    <div className="rounded-xl border border-[#e3e3e3] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#f7f7f7] border-b border-[#ebebeb]">
            <th className="px-3 py-1.5 text-left text-[12px] font-semibold text-[#616161]">{title}</th>
            <th className="px-3 py-1.5 text-left text-[12px] font-semibold text-[#616161]">{colHeader}</th>
            {extraHeaders.map((h) => (
              <th key={h} className="px-3 py-1.5 text-left text-[12px] font-semibold text-[#616161]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#ebebeb] last:border-0">
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  {row.up ? (
                    <ArrowUpRight size={14} className="text-[#0d9488] shrink-0" />
                  ) : (
                    <ArrowDownRight size={14} className="text-[#ef4444] shrink-0" />
                  )}
                  <span className="text-[12px] font-medium text-[#616161]">{row.name}</span>
                </div>
              </td>
              {row.cols.map((val, j) => (
                <td key={j} className="px-3 py-2 text-[12px] font-medium text-[#616161]">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
