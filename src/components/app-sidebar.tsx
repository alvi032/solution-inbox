'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
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
  GitBranch,
  Store,
  Plus,
  Check,
} from 'lucide-react';

export type DashboardView = 'admin' | 'agent';

const STORAGE_KEY = 'dashboardView';

export function getDashboardView(): DashboardView {
  if (typeof window === 'undefined') return 'admin';
  return (localStorage.getItem(STORAGE_KEY) as DashboardView) ?? 'admin';
}

function NavTooltip({ label, enabled, children }: { label: string; enabled: boolean; children: React.ReactElement }) {
  if (!enabled) return children;
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="right" sideOffset={8}>{label}</TooltipContent>
    </Tooltip>
  );
}

function WorkflowsNavItem({ isCollapsed, forceCollapsed, pathname }: { isCollapsed: boolean; forceCollapsed: boolean; pathname: string }) {
  const isActive = pathname.startsWith('/evo-ai/workflows');
  const [expanded, setExpanded] = useState(isActive);

  return (
    <div className={cn('flex flex-col gap-0.5', !forceCollapsed && 'mt-6')}>
      {isCollapsed && <div className="border-t border-[#e5e7eb] my-1" />}

      {/* Parent row: icon+label is a link, chevron toggles expand */}
      <div className={cn(
        'group flex items-center rounded-md h-8 text-[14px] transition-colors',
        isActive ? 'bg-[#f4f4f5] text-[#18181b] font-medium' : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
        isCollapsed && 'justify-center',
      )}>
        <NavTooltip label="Workflows" enabled={isCollapsed}>
          <Link
            href="/evo-ai/workflows"
            className={cn('flex items-center gap-2 flex-1 min-w-0 px-2 h-full', isCollapsed && 'justify-center px-0')}
          >
            <GitBranch size={16} className={cn('shrink-0', isActive ? '' : 'opacity-70 group-hover:opacity-100')} />
            {!isCollapsed && <span className="flex-1 truncate">Workflows</span>}
          </Link>
        </NavTooltip>

        {!isCollapsed && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-6 h-6 flex items-center justify-center mr-1 shrink-0 text-[#a1a1aa] hover:text-[#18181b] transition-colors"
          >
            <ChevronDown size={13} className={cn('transition-transform', expanded ? 'rotate-0' : '-rotate-90')} />
          </button>
        )}
      </div>

      {/* Sub-items */}
      {!isCollapsed && expanded && (
        <div className="flex flex-col gap-0.5 ml-5 pl-2 border-l border-[#e5e7eb]">
          <Link
            href="/evo-ai/workflows?tab=support"
            className="flex items-center h-7 px-2 rounded-md text-[13px] text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            Support Workflows
          </Link>
          <Link
            href="/evo-ai/workflows?tab=sales"
            className={cn(
              'flex items-center h-7 px-2 rounded-md text-[13px] transition-colors',
              'text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5]',
            )}
          >
            Sales Workflows
          </Link>
        </div>
      )}
    </div>
  );
}

const BRAND = {
  name: 'TBS',
  plan: 'Enterprise',
  stores: [
    { id: 'us', label: 'US Store', flag: '🇺🇸' },
    { id: 'eu', label: 'EU Store', flag: '🇪🇺' },
    { id: 'uae', label: 'UAE Store', flag: '🇦🇪' },
    { id: 'sg', label: 'SG Store', flag: '🇸🇬' },
  ],
};

function BrandDropdown({
  isCollapsed,
  forceCollapsed,
  onCollapse,
}: {
  isCollapsed: boolean;
  forceCollapsed: boolean;
  onCollapse: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeStore, setActiveStore] = useState('us');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <div className="flex items-center gap-2 p-2">
        {!isCollapsed && (
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2 flex-1 min-w-0 rounded-md px-1 py-1 hover:bg-[#f4f4f5] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#18181b] flex items-center justify-center shrink-0">
              <Command size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-[#3f3f46] leading-none truncate">{BRAND.name}</span>
                <ChevronDown size={14} className={cn('text-[#3f3f46] shrink-0 transition-transform', open && 'rotate-180')} />
              </div>
              <p className="text-xs text-[#3f3f46] leading-none mt-0.5">{BRAND.plan}</p>
            </div>
          </button>
        )}
        {!forceCollapsed && (
          <button
            onClick={onCollapse}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-md text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors shrink-0',
              isCollapsed && 'mx-auto'
            )}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <PanelLeft size={16} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && !isCollapsed && (
        <div className="absolute left-2 right-2 top-full mt-1 bg-white border border-[#e4e4e7] rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Brand header */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#f4f4f5]">
            <div className="w-7 h-7 rounded-lg bg-[#18181b] flex items-center justify-center shrink-0">
              <Command size={13} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#18181b] leading-none">{BRAND.name}</p>
              <p className="text-[10px] text-[#a1a1aa] leading-none mt-0.5">{BRAND.plan}</p>
            </div>
          </div>

          {/* Stores */}
          <div className="py-1">
            <p className="px-3 pt-1 pb-1 text-[10px] font-semibold text-[#a1a1aa] uppercase tracking-wider">Stores</p>
            {BRAND.stores.map(store => (
              <button
                key={store.id}
                onClick={() => { setActiveStore(store.id); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-[#fafafa] transition-colors"
              >
                <span className="text-base leading-none">{store.flag}</span>
                <span className="flex-1 text-[#18181b]">{store.label}</span>
                {activeStore === store.id && (
                  <Check size={13} className="text-[#16a34a] shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Add store */}
          <div className="border-t border-[#f4f4f5] p-1.5">
            <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-[#3f3f46] hover:bg-[#fafafa] transition-colors">
              <Plus size={14} className="text-[#a1a1aa] shrink-0" />
              Add store
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppSidebar({ forceCollapsed = false }: { forceCollapsed?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const isCollapsed = forceCollapsed || collapsed;
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
    <TooltipProvider delay={0}>
    <div
      className={cn(
        'flex flex-col h-full bg-[#fafafa] border-r border-[#e5e7eb] shrink-0 transition-all duration-200',
        isCollapsed ? 'w-[48px]' : 'w-[256px]'
      )}
    >
      {/* Header */}
      <BrandDropdown isCollapsed={isCollapsed} forceCollapsed={forceCollapsed} onCollapse={() => setCollapsed(v => !v)} />

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-2 pb-2 flex-1 overflow-y-auto">

        {/* Dashboard */}
        <div className={cn('flex flex-col gap-0.5', !forceCollapsed && 'mt-6')}>
          <NavTooltip label="Dashboard" enabled={isCollapsed}>
            <Link
              href="/"
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                pathname === '/'
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                isCollapsed && 'justify-center px-0'
              )}
            >
              <BarChart2 size={16} className={cn('shrink-0', pathname === '/' ? '' : 'opacity-70 group-hover:opacity-100')} />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </NavTooltip>
        </div>

        {/* Apps */}
        <div className={cn('flex flex-col gap-0.5', !forceCollapsed && 'mt-6')}>
          {!isCollapsed && (
            <p className="px-2 pt-1 text-[12px] leading-4 font-medium text-[#3f3f46]/70">Apps</p>
          )}
          {isCollapsed && <div className="border-t border-[#e5e7eb] my-1" />}

          {/* Support Agent */}
          <NavTooltip label="Support Agent" enabled={isCollapsed}>
            <Link
              href="/inbox"
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                pathname.startsWith('/inbox')
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                isCollapsed && 'justify-center px-0'
              )}
            >
              <Inbox size={16} className={cn('shrink-0', pathname.startsWith('/inbox') ? '' : 'opacity-70 group-hover:opacity-100')} />
              {!isCollapsed && <span>Support Agent</span>}
            </Link>
          </NavTooltip>

          {/* Sales Agent */}
          <NavTooltip label="Sales Agent" enabled={isCollapsed}>
            <Link
              href="/sales-agent/analytics"
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                pathname.startsWith('/sales-agent')
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                isCollapsed && 'justify-center px-0'
              )}
            >
              <ShoppingBag size={16} className={cn('shrink-0', pathname.startsWith('/sales-agent') ? '' : 'opacity-70 group-hover:opacity-100')} />
              {!isCollapsed && <span>Sales Agent</span>}
            </Link>
          </NavTooltip>

          {/* Evo Search */}
          <NavTooltip label="Evo Search" enabled={isCollapsed}>
            <Link
              href={evoSearchInstalled ? '/evo-search/analytics' : '/evo-search/install'}
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                pathname.startsWith('/evo-search')
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                isCollapsed && 'justify-center px-0'
              )}
            >
              <Search size={16} className={cn('shrink-0', pathname.startsWith('/evo-search') ? '' : 'opacity-70 group-hover:opacity-100')} />
              {!isCollapsed && <span>Evo Search</span>}
            </Link>
          </NavTooltip>

          {/* Quizzes */}
          <NavTooltip label="Quizzes" enabled={isCollapsed}>
            <Link
              href={quizzesInstalled ? '/quizzes' : '/quizzes/install'}
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                pathname.startsWith('/quizzes')
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                isCollapsed && 'justify-center px-0'
              )}
            >
              <FileQuestion size={16} className={cn('shrink-0', pathname.startsWith('/quizzes') ? '' : 'opacity-70 group-hover:opacity-100')} />
              {!isCollapsed && <span>Quizzes</span>}
            </Link>
          </NavTooltip>
        </div>

        {/* Workflows */}
        <WorkflowsNavItem isCollapsed={isCollapsed} forceCollapsed={forceCollapsed} pathname={pathname} />

        {/* Knowledge Base */}
        <div className={cn('flex flex-col gap-0.5', !forceCollapsed && 'mt-6')}>
          {isCollapsed && <div className="border-t border-[#e5e7eb] my-1" />}
          <NavTooltip label="Knowledge Base" enabled={isCollapsed}>
            <button
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors w-full text-left',
                isCollapsed && 'justify-center px-0'
              )}
            >
              <BookOpen size={16} className="shrink-0 opacity-70 group-hover:opacity-100" />
              {!isCollapsed && <span>Knowledge Base</span>}
            </button>
          </NavTooltip>
        </div>

      </nav>

      {/* Footer */}
      <div className="border-t border-[#e5e7eb] bg-[#fafafa] p-2 shrink-0">

        {/* Admin / Agent toggle */}
        {!isCollapsed && (
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

        {isCollapsed && !forceCollapsed && (
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
          <NavTooltip label="Team" enabled={isCollapsed}>
            <Link
              href="/team"
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                pathname === '/team'
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                isCollapsed && 'justify-center px-0'
              )}
            >
              <UsersRound size={16} className={cn('shrink-0', pathname === '/team' ? '' : 'opacity-70 group-hover:opacity-100')} />
              {!isCollapsed && <span>Team</span>}
            </Link>
          </NavTooltip>
          <NavTooltip label="Support" enabled={isCollapsed}>
            <button
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors w-full text-left',
                isCollapsed && 'justify-center px-0'
              )}
            >
              <HelpCircle size={16} className="shrink-0 opacity-70 group-hover:opacity-100" />
              {!isCollapsed && <span>Support</span>}
            </button>
          </NavTooltip>
          <NavTooltip label="Store Management" enabled={isCollapsed}>
            <Link
              href="/store-management"
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                pathname === '/store-management'
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                isCollapsed && 'justify-center px-0'
              )}
            >
              <Store size={16} className={cn('shrink-0', pathname === '/store-management' ? '' : 'opacity-70 group-hover:opacity-100')} />
              {!isCollapsed && <span>Store Management</span>}
            </Link>
          </NavTooltip>
        </div>

        {/* User profile */}
        <div
          className={cn(
            'flex items-center gap-2 rounded-md p-2 hover:bg-[#f4f4f5] transition-colors cursor-pointer',
            isCollapsed && 'justify-center'
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-[#e4e4e7] shrink-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-[#3f3f46]">SJ</span>
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#3f3f46] leading-none truncate">Sarah Jones</p>
              <p className="text-xs text-[#3f3f46]/70 leading-none mt-0.5 truncate">sarah.jones@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
