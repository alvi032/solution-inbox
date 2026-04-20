'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart2,
  Inbox,
  ShoppingBag,
  Search,
  HelpCircle,
  BookOpen,
  UsersRound,
  PanelLeft,
  ChevronDown,
  Command,
  FileQuestion,
} from 'lucide-react';

export type DashboardView = 'admin' | 'agent';

const STORAGE_KEY = 'dashboardView';

export function getDashboardView(): DashboardView {
  if (typeof window === 'undefined') return 'admin';
  return (localStorage.getItem(STORAGE_KEY) as DashboardView) ?? 'admin';
}

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [evoSearchInstalled, setEvoSearchInstalled] = useState(false);
  const [quizzesInstalled, setQuizzesInstalled] = useState(false);
  const [dashboardView, setDashboardViewState] = useState<DashboardView>('admin');
  const pathname = usePathname();

  useEffect(() => {
    setEvoSearchInstalled(localStorage.getItem('evoSearchInstalled') === 'true');
    setQuizzesInstalled(localStorage.getItem('quizzesInstalled') === 'true');
    setDashboardViewState(getDashboardView());

    const onEvoInstall = () => setEvoSearchInstalled(true);
    const onEvoReset = () => setEvoSearchInstalled(false);
    const onQuizzesInstall = () => setQuizzesInstalled(true);

    window.addEventListener('evo-search-installed', onEvoInstall);
    window.addEventListener('evo-search-reset', onEvoReset);
    window.addEventListener('quizzes-installed', onQuizzesInstall);
    return () => {
      window.removeEventListener('evo-search-installed', onEvoInstall);
      window.removeEventListener('evo-search-reset', onEvoReset);
      window.removeEventListener('quizzes-installed', onQuizzesInstall);
    };
  }, []);

  function toggleView(view: DashboardView) {
    setDashboardViewState(view);
    localStorage.setItem(STORAGE_KEY, view);
    window.dispatchEvent(new CustomEvent('dashboard-view-change', { detail: view }));
  }

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

        {/* Apps */}
        <div className="flex flex-col gap-0.5 mt-6">
          {!collapsed && (
            <p className="px-2 pt-1 text-xs font-medium text-[#3f3f46]/70">Apps</p>
          )}
          {collapsed && <div className="border-t border-[#e5e7eb] my-1" />}

          {/* Support Agent */}
          <Link
            href="/inbox"
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-sm transition-colors',
              pathname.startsWith('/inbox')
                ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Support Agent' : undefined}
          >
            <Inbox size={16} className="shrink-0" />
            {!collapsed && <span>Support Agent</span>}
          </Link>

          {/* Sales Agent */}
          <Link
            href="/sales-agent/analytics"
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-sm transition-colors',
              pathname.startsWith('/sales-agent')
                ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Sales Agent' : undefined}
          >
            <ShoppingBag size={16} className="shrink-0" />
            {!collapsed && <span>Sales Agent</span>}
          </Link>

          {/* Evo Search */}
          <Link
            href={evoSearchInstalled ? '/evo-search/analytics' : '/evo-search/install'}
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-sm transition-colors',
              pathname.startsWith('/evo-search')
                ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Evo Search' : undefined}
          >
            <Search size={16} className="shrink-0" />
            {!collapsed && <span>Evo Search</span>}
          </Link>

          {/* Quizzes */}
          <Link
            href={quizzesInstalled ? '/quizzes' : '/quizzes/install'}
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-sm transition-colors',
              pathname.startsWith('/quizzes')
                ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Quizzes' : undefined}
          >
            <FileQuestion size={16} className="shrink-0" />
            {!collapsed && <span>Quizzes</span>}
          </Link>
        </div>

        {/* Knowledge Base */}
        <div className="flex flex-col gap-0.5 mt-6">
          {collapsed && <div className="border-t border-[#e5e7eb] my-1" />}
          <button
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-sm text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors w-full text-left',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Knowledge Base' : undefined}
          >
            <BookOpen size={16} className="shrink-0" />
            {!collapsed && <span>Knowledge Base</span>}
          </button>
        </div>

      </nav>

      {/* Footer */}
      <div className="border-t border-[#e5e7eb] bg-[#fafafa] p-2 shrink-0">

        {/* Admin / Agent toggle */}
        {!collapsed && (
          <div className="mb-3">
            <p className="px-2 text-[10px] font-medium text-[#a1a1aa] uppercase tracking-wide mb-1.5">Dashboard view</p>
            <div className="flex items-center bg-[#f4f4f5] rounded-lg p-0.5 gap-0.5">
              <button
                onClick={() => toggleView('admin')}
                className={cn(
                  'flex-1 text-xs font-medium rounded-md px-2 py-1.5 transition-all',
                  dashboardView === 'admin'
                    ? 'bg-white text-[#18181b] shadow-sm'
                    : 'text-[#71717a] hover:text-[#3f3f46]'
                )}
              >
                Admin
              </button>
              <button
                onClick={() => toggleView('agent')}
                className={cn(
                  'flex-1 text-xs font-medium rounded-md px-2 py-1.5 transition-all',
                  dashboardView === 'agent'
                    ? 'bg-white text-[#18181b] shadow-sm'
                    : 'text-[#71717a] hover:text-[#3f3f46]'
                )}
              >
                Agent
              </button>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="flex flex-col gap-0.5 mb-2">
            <button
              onClick={() => toggleView('admin')}
              className={cn(
                'w-full h-7 rounded-md text-[10px] font-bold transition-colors',
                dashboardView === 'admin'
                  ? 'bg-[#18181b] text-white'
                  : 'text-[#71717a] hover:bg-[#f4f4f5]'
              )}
              title="Admin view"
            >
              A
            </button>
            <button
              onClick={() => toggleView('agent')}
              className={cn(
                'w-full h-7 rounded-md text-[10px] font-bold transition-colors',
                dashboardView === 'agent'
                  ? 'bg-[#18181b] text-white'
                  : 'text-[#71717a] hover:bg-[#f4f4f5]'
              )}
              title="Agent view"
            >
              Ag
            </button>
          </div>
        )}

        <div className="flex flex-col gap-0.5 mb-2">
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
          <button
            className={cn(
              'flex items-center gap-2 rounded-md px-2 h-8 text-xs text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors w-full text-left',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Support' : undefined}
          >
            <HelpCircle size={16} className="shrink-0" />
            {!collapsed && <span>Support</span>}
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
