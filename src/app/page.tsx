import AppSidebar from '@/components/app-sidebar';
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
} from 'lucide-react';
import Link from 'next/link';

const metrics = [
  {
    label: 'Open Tickets',
    value: '24',
    change: '+3 from yesterday',
    trend: 'up',
    icon: Inbox,
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
  },
  {
    label: 'Avg. Response Time',
    value: '2.4h',
    change: '−12% this week',
    trend: 'down',
    icon: Clock,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
  },
  {
    label: 'Resolution Rate',
    value: '87%',
    change: '+5% this month',
    trend: 'up',
    icon: TrendingUp,
    iconBg: '#faf5ff',
    iconColor: '#8b5cf6',
  },
  {
    label: 'Active Customers',
    value: '142',
    change: '+8 this week',
    trend: 'up',
    icon: Users,
    iconBg: '#fffbeb',
    iconColor: '#d97706',
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

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-[#18181b]">Dashboard</h1>
            <p className="text-sm text-[#71717a] mt-0.5">Welcome back, Sarah. Here's what's happening.</p>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
            {metrics.map((m) => {
              const Icon = m.icon;
              const TrendIcon = m.trend === 'up' ? ArrowUpRight : ArrowDownRight;
              const trendColor = m.trend === 'up' ? '#16a34a' : '#dc2626';
              return (
                <div
                  key={m.label}
                  className="bg-white rounded-xl border border-[#e5e7eb] p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#71717a]">{m.label}</span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: m.iconBg }}
                    >
                      <Icon size={16} style={{ color: m.iconColor }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-[#18181b] leading-none">{m.value}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <TrendIcon size={13} style={{ color: trendColor }} />
                      <span className="text-xs" style={{ color: trendColor }}>{m.change}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <EvoSearchKPIs />

          {/* Recent tickets */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
              <h2 className="text-sm font-semibold text-[#18181b]">Recent Tickets</h2>
              <Link
                href="/inbox"
                className="flex items-center gap-1 text-xs text-[#71717a] hover:text-[#18181b] transition-colors"
              >
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
                    <tr
                      key={i}
                      className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm font-medium text-[#18181b]">{row.customer}</td>
                      <td className="px-5 py-3.5 text-sm text-[#3f3f46] max-w-[240px] truncate">{row.subject}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: cat.bg, color: cat.text }}
                        >
                          {row.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.status === 'open'
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : 'bg-[#f4f4f5] text-[#71717a]'
                          }`}
                        >
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
        </div>
      </main>
      <ResetButton />
    </div>
  );
}
