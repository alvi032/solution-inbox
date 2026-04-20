'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart2,
  SlidersHorizontal,
  CreditCard,
  HelpCircle,
  PanelLeft,
} from 'lucide-react';

const navItems = [
  { icon: BarChart2, label: 'Analytics', href: '/sales-agent/analytics' },
  { icon: SlidersHorizontal, label: 'Chat Settings', href: '/sales-agent/settings' },
  { icon: CreditCard, label: 'Plans and Billing', href: '/sales-agent/billing' },
  { icon: HelpCircle, label: 'Support', href: '/sales-agent/support' },
];

export default function SalesAgentSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'flex flex-col h-full border-r border-[#e5e7eb] bg-[#fafafa] transition-all duration-200 shrink-0',
        collapsed ? 'w-[48px]' : 'w-[220px]'
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center h-[48px] border-b border-[#e5e7eb] shrink-0 px-2',
          collapsed ? 'justify-center' : 'justify-between gap-2'
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-lg bg-[#ea580c] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold leading-none">S</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#18181b] leading-none truncate">Sales Agent</p>
              <p className="text-[10px] text-[#71717a] leading-none mt-0.5">On-site chat</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#71717a] hover:text-[#18181b] hover:bg-white transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelLeft size={15} />
        </button>
      </div>

      {/* Return to Dashboard CTA */}
      {!collapsed && (
        <div className="px-2 pb-2 mt-4 shrink-0">
          <a
            href="/"
            className="flex items-center justify-center w-full h-9 rounded-md bg-[#18181b] text-[#fafafa] text-sm font-medium px-3 hover:bg-[#27272a] transition-colors no-underline"
          >
            Return to Dashboard
          </a>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 p-2 flex-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors w-full',
                isActive
                  ? 'bg-[#f4f4f5] text-[#18181b]'
                  : 'text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? label : undefined}
            >
              <span className="shrink-0"><Icon size={16} /></span>
              {!collapsed && <span className="flex-1 truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
