'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, DollarSign, MousePointerClick, ArrowUpRight } from 'lucide-react';

const evoMetrics = [
  {
    label: 'Total Searches',
    value: '8,341',
    change: '+2.3% from last week',
    icon: Search,
    iconBg: '#faf5ff',
    iconColor: '#8b5cf6',
  },
  {
    label: 'Search to Cart',
    value: '18.4%',
    change: '+2.3% from last week',
    icon: ShoppingCart,
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
  },
  {
    label: 'Revenue from Search',
    value: '$12,458',
    change: '+2.3% from last week',
    icon: DollarSign,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
  },
  {
    label: 'Avg. Results Clicked',
    value: '2.3',
    change: '+2.3% from last week',
    icon: MousePointerClick,
    iconBg: '#fffbeb',
    iconColor: '#d97706',
  },
];

export default function EvoSearchKPIs() {
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(localStorage.getItem('evoSearchInstalled') === 'true');
    const onInstall = () => setInstalled(true);
    const onReset = () => setInstalled(false);
    window.addEventListener('evo-search-installed', onInstall);
    window.addEventListener('evo-search-reset', onReset);
    return () => {
      window.removeEventListener('evo-search-installed', onInstall);
      window.removeEventListener('evo-search-reset', onReset);
    };
  }, []);

  if (!installed) return null;

  return (
    <div className="mb-8">
      <p className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wide mb-3">Evo Search</p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {evoMetrics.map((m) => {
          const Icon = m.icon;
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
                  <ArrowUpRight size={13} style={{ color: '#16a34a' }} />
                  <span className="text-xs" style={{ color: '#16a34a' }}>{m.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
