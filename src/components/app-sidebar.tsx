'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart2,
  Inbox,
  Network,
  Settings2,
  Plug,
  UsersRound,
  PanelLeft,
  ChevronDown,
  Command,
  LayoutGrid,
  BarChart,
  Sliders,
} from 'lucide-react';

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [evoSearchInstalled, setEvoSearchInstalled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setEvoSearchInstalled(localStorage.getItem('evoSearchInstalled') === 'true');
    const onInstall = () => setEvoSearchInstalled(true);
    const onReset = () => setEvoSearchInstalled(false);
    window.addEventListener('evo-search-installed', onInstall);
    window.addEventListener('evo-search-reset', onReset);
    return () => {
      window.removeEventListener('evo-search-installed', onInstall);
      window.removeEventListener('evo-search-reset', onReset);
    };
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-[#fafafa] border-r border-[#e5e7eb] shrink-0 transition-all duration-200',
        collapsed ? 'w-[48px]' : 'w-[256px]'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-2 shrink-0">
        {!collapsed && (
          <>
            <div className="w-8 h-8 rounded-lg bg-[#18181b] flex items-center justify-center shrink-0">
              <Command size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-[#3f3f46] leading-none truncate">Evo</span>
                <ChevronDown size={14} className="text-[#3f3f46] shrink-0" />
              </div>
              <p className="text-xs text-[#3f3f46] leading-none mt-0.5">Enterprise</p>
            </div>
          </>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-md text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors shrink-0',
            collapsed && 'mx-auto'
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelLeft size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-2 pb-2 flex-1 overflow-y-auto">
        {/* Dashboard */}
        <div className="flex flex-col gap-0.5 mt-6">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-sm transition-colors',
              pathname === '/'
                ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Dashboard' : undefined}
          >
            <BarChart2 size={16} className="shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </Link>
        </div>

        {/* Support Agent */}
        <div className="flex flex-col gap-0.5 mt-6">
          {!collapsed && (
            <p className="px-2 pt-1 text-xs font-medium text-[#3f3f46]/70">Support Agent</p>
          )}
          {collapsed && <div className="border-t border-[#e5e7eb] my-1" />}
          <Link
            href="/inbox"
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-sm transition-colors',
              pathname === '/inbox'
                ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Support Inbox' : undefined}
          >
            <Inbox size={16} className="shrink-0" />
            {!collapsed && <span>Support Inbox</span>}
          </Link>
          <button
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-sm text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors w-full text-left',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Workflows' : undefined}
          >
            <Network size={16} className="shrink-0" />
            {!collapsed && <span>Workflows</span>}
          </button>
        </div>

        {/* Sales Agent */}
        <div className="flex flex-col gap-0.5 mt-6">
          {!collapsed && (
            <p className="px-2 pt-1 text-xs font-medium text-[#3f3f46]/70">Sales Agent</p>
          )}
          {collapsed && <div className="border-t border-[#e5e7eb] my-1" />}
          <button
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-sm text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors w-full text-left',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Workflows' : undefined}
          >
            <Network size={16} className="shrink-0" />
            {!collapsed && <span>Workflows</span>}
          </button>
          <button
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-sm text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors w-full text-left',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Configure' : undefined}
          >
            <Settings2 size={16} className="shrink-0" />
            {!collapsed && <span>Configure</span>}
          </button>
        </div>

        {/* Evo Search — shown only after install */}
        {evoSearchInstalled && (
          <div className="flex flex-col gap-0.5 mt-6">
            {!collapsed && (
              <p className="px-2 pt-1 text-xs font-medium text-[#3f3f46]/70">Evo Search</p>
            )}
            {collapsed && <div className="border-t border-[#e5e7eb] my-1" />}
            <Link
              href="/evo-search/analytics"
              className={cn(
                'flex items-center gap-2 rounded-md px-2 h-8 text-sm transition-colors',
                pathname === '/evo-search/analytics'
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? 'Analytics' : undefined}
            >
              <BarChart size={16} className="shrink-0" />
              {!collapsed && <span>Analytics</span>}
            </Link>
            <Link
              href="/evo-search/widget"
              className={cn(
                'flex items-center gap-2 rounded-md px-2 h-8 text-sm transition-colors',
                pathname === '/evo-search/widget'
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? 'Widget Customization' : undefined}
            >
              <Sliders size={16} className="shrink-0" />
              {!collapsed && <span>Widget Customization</span>}
            </Link>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#e5e7eb] bg-[#fafafa] p-2 shrink-0">
        <div className="flex flex-col gap-0.5 mb-2">
          <Link
            href="/apps"
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-xs transition-colors',
              pathname === '/apps'
                ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Apps and Plugins' : undefined}
          >
            <LayoutGrid size={16} className="shrink-0" />
            {!collapsed && <span>Apps and Plugins</span>}
          </Link>
          <button
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-xs text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors w-full text-left',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Integrations' : undefined}
          >
            <Plug size={16} className="shrink-0" />
            {!collapsed && <span>Integrations</span>}
          </button>
          <button
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-xs text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors w-full text-left',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Team' : undefined}
          >
            <UsersRound size={16} className="shrink-0" />
            {!collapsed && <span>Team</span>}
          </button>
        </div>

        {/* User profile */}
        <div
          className={cn(
            'flex items-center gap-2 rounded-md p-2 hover:bg-[#f4f4f5] transition-colors cursor-pointer',
            collapsed && 'justify-center'
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-[#e4e4e7] shrink-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-[#3f3f46]">SJ</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#3f3f46] leading-none truncate">Sarah Jones</p>
              <p className="text-xs text-[#3f3f46]/70 leading-none mt-0.5 truncate">sarah.jones@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
