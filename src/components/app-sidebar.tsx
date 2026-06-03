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
  ChevronRight,
  FileQuestion,
  GitBranch,
  Store,
  Plus,
  Check,
  MessageSquare,
  Layers,
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

function WorkflowsNavItem({ isCollapsed, forceCollapsed, pathname, insightsCount }: { isCollapsed: boolean; forceCollapsed: boolean; pathname: string; insightsCount: number }) {
  const isActive = pathname.startsWith('/evo-ai/workflows');
  const [expanded, setExpanded] = useState(isActive);

  return (
    <>
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
            <div className="relative shrink-0">
              <GitBranch size={16} className={cn(isActive ? '' : 'opacity-70 group-hover:opacity-100')} />
              {isCollapsed && insightsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#18181b] text-white text-[9px] font-bold leading-none flex items-center justify-center">
                  {insightsCount}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <>
                <span className="flex-1 truncate">Workflows</span>
                {insightsCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#18181b] text-white text-[10px] font-semibold leading-none mr-1">
                    {insightsCount}
                  </span>
                )}
              </>
            )}
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
            className="flex items-center h-7 px-2 rounded-md text-[13px] text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            Sales Workflows
          </Link>
          <Link
            href="/evo-ai/workflows?tab=insights"
            className="flex items-center gap-1.5 h-7 px-2 rounded-md text-[13px] text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            Insights
            {insightsCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#18181b] text-white text-[9px] font-bold leading-none">
                {insightsCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </>
  );
}

const PROFILES = [
  { id: 'admin', name: 'Sarah Jones', email: 'sarah.jones@example.com', initials: 'SJ', role: 'Admin',  view: 'admin' as DashboardView },
  { id: 'agent', name: 'Tom K.',      email: 'tom.k@example.com',        initials: 'TK', role: 'Agent',  view: 'agent' as DashboardView },
];

function ProfileSwitcher({
  isCollapsed,
  dashboardView,
  onSwitch,
}: {
  isCollapsed: boolean;
  dashboardView: DashboardView;
  onSwitch: (view: DashboardView) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = PROFILES.find(p => p.view === dashboardView) ?? PROFILES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Profile list — pops upward */}
      {open && !isCollapsed && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-[#e4e4e7] rounded-xl shadow-lg z-50 overflow-hidden py-1">
          {PROFILES.map(profile => (
            <button
              key={profile.id}
              type="button"
              onClick={() => { onSwitch(profile.view); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#fafafa] transition-colors text-left"
            >
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold',
                profile.view === dashboardView ? 'bg-[#18181b] text-white' : 'bg-[#e4e4e7] text-[#3f3f46]',
              )}>
                {profile.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#18181b] leading-none truncate">{profile.name}</p>
                <p className="text-[10px] text-[#a1a1aa] leading-none mt-0.5 truncate">{profile.email}</p>
              </div>
              <span className={cn(
                'text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0',
                profile.role === 'Admin'
                  ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]'
                  : 'bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]',
              )}>
                {profile.role}
              </span>
              {profile.view === dashboardView && (
                <Check size={12} className="text-[#18181b] shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Trigger */}
      <NavTooltip label={active.name} enabled={isCollapsed}>
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className={cn(
            'w-full flex items-center gap-2 rounded-md p-2 hover:bg-[#f4f4f5] transition-colors',
            isCollapsed && 'justify-center',
          )}
        >
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold',
            'bg-[#18181b] text-white',
          )}>
            {active.initials}
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-[#3f3f46] leading-none truncate">{active.name}</p>
                  <span className={cn(
                    'text-[10px] font-medium px-1 py-px rounded-full border shrink-0',
                    active.role === 'Admin'
                      ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]'
                      : 'bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]',
                  )}>
                    {active.role}
                  </span>
                </div>
                <p className="text-xs text-[#3f3f46]/70 leading-none mt-0.5 truncate">{active.email}</p>
              </div>
              <ChevronDown size={13} className={cn('text-[#a1a1aa] shrink-0 transition-transform', open && 'rotate-180')} />
            </>
          )}
        </button>
      </NavTooltip>
    </div>
  );
}

const BRANDS = [
  { id: 'tbs',  name: 'TBS',  initials: 'TBS', bg: '#18181b', plan: 'Enterprise' },
  { id: 'nike', name: 'Nike', initials: 'NK',  bg: '#e2231a', plan: 'Pro' },
];

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
  const [activeBrand, setActiveBrand] = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem('activeBrand') ?? 'tbs') : 'tbs'
  );
  const ref = useRef<HTMLDivElement>(null);
  const brand = BRANDS.find(b => b.id === activeBrand) ?? BRANDS[0];

  function selectBrand(id: string) {
    setActiveBrand(id);
    localStorage.setItem('activeBrand', id);
    window.dispatchEvent(new CustomEvent('active-brand-change', { detail: id }));
  }

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
        {isCollapsed ? (
          /* Collapsed: brand icon with hover-reveal expand button */
          <div className="relative group mx-auto w-8 h-8">
            <button
              onClick={() => setOpen(v => !v)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[10px]"
              style={{ backgroundColor: brand.bg }}
              title={brand.name}
            >
              <span className={cn('transition-opacity', !forceCollapsed && 'group-hover:opacity-0')}>{brand.initials}</span>
            </button>
            {!forceCollapsed && (
              <button
                onClick={onCollapse}
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#f4f4f5] opacity-0 group-hover:opacity-100 transition-opacity"
                title="Expand sidebar"
              >
                <PanelLeft size={16} className="text-[#18181b]" />
              </button>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => setOpen(v => !v)}
              className="flex items-center gap-2 flex-1 min-w-0 rounded-md px-1 py-1 hover:bg-[#f4f4f5] transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-[10px]"
                style={{ backgroundColor: brand.bg }}
              >
                {brand.initials}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-[#3f3f46] leading-none truncate">{brand.name}</span>
                  <ChevronDown size={14} className={cn('text-[#3f3f46] shrink-0 transition-transform', open && 'rotate-180')} />
                </div>
                <p className="text-xs text-[#3f3f46] leading-none mt-0.5">{brand.plan}</p>
              </div>
            </button>
            {!forceCollapsed && (
              <button
                onClick={onCollapse}
                className="w-8 h-8 flex items-center justify-center rounded-md text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors shrink-0"
                title="Collapse sidebar"
              >
                <PanelLeft size={16} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className={cn(
          "absolute top-full mt-1 bg-white border border-[#e4e4e7] rounded-xl shadow-lg z-50 overflow-hidden",
          isCollapsed ? "left-2 w-[200px]" : "left-2 right-2",
        )}>
          {/* Brand list */}
          <div className="py-1">
            {BRANDS.map(b => (
              <button
                key={b.id}
                onClick={() => { selectBrand(b.id); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-[#fafafa] transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-[9px]"
                  style={{ backgroundColor: b.bg }}
                >
                  {b.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#18181b] leading-none">{b.name}</p>
                  <p className="text-[10px] text-[#a1a1aa] leading-none mt-0.5">{b.plan}</p>
                </div>
                {activeBrand === b.id && (
                  <Check size={13} className="text-[#16a34a] shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Add store */}
          <div className="border-t border-[#f4f4f5] p-1.5">
            <Link
              href="/store-management/new"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-[#3f3f46] hover:bg-[#fafafa] transition-colors"
            >
              <Plus size={14} className="text-[#a1a1aa] shrink-0" />
              Add store
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppSidebar({ forceCollapsed = false, onboardingActive = false, altOnboarding = false }: { forceCollapsed?: boolean; onboardingActive?: boolean; altOnboarding?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const isCollapsed = forceCollapsed || collapsed;
  const showAsCollapsed = isCollapsed;
  const [evoSearchInstalled, setEvoSearchInstalled] = useState(false);
  const [quizzesInstalled, setQuizzesInstalled] = useState(false);
  const [dashboardView, setDashboardViewState] = useState<DashboardView>('admin');
  const [insightsCount, setInsightsCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 4;
    const stored = localStorage.getItem('insightsOpenCount');
    return stored !== null ? parseInt(stored, 10) : 4;
  });
  // In alt onboarding, show Workflows + KB once user has selected a goal
  const [altGoalSet, setAltGoalSet] = useState(() =>
    typeof window !== 'undefined' ? !!localStorage.getItem('altOnboardingGoal') : false
  );
  const pathname = usePathname();
  const insideApp = pathname.startsWith('/inbox') || pathname.startsWith('/evo-search') || pathname.startsWith('/quizzes');

  useEffect(() => {
    setEvoSearchInstalled(localStorage.getItem('evoSearchInstalled') === 'true');
    setQuizzesInstalled(localStorage.getItem('quizzesInstalled') === 'true');
    setDashboardViewState(getDashboardView());

    const onEvoInstall = () => setEvoSearchInstalled(true);
    const onEvoReset = () => setEvoSearchInstalled(false);
    const onQuizzesInstall = () => setQuizzesInstalled(true);
    const onInsightsChange = (e: Event) => setInsightsCount((e as CustomEvent<number>).detail);
    const onGoalSet = () => setAltGoalSet(true);

    window.addEventListener('evo-search-installed', onEvoInstall);
    window.addEventListener('evo-search-reset', onEvoReset);
    window.addEventListener('quizzes-installed', onQuizzesInstall);
    window.addEventListener('insights-count-change', onInsightsChange);
    window.addEventListener('alt-onboarding-goal-set', onGoalSet);
    return () => {
      window.removeEventListener('evo-search-installed', onEvoInstall);
      window.removeEventListener('evo-search-reset', onEvoReset);
      window.removeEventListener('quizzes-installed', onQuizzesInstall);
      window.removeEventListener('insights-count-change', onInsightsChange);
      window.removeEventListener('alt-onboarding-goal-set', onGoalSet);
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
        'relative flex flex-col h-full bg-[#fafafa] border-r border-[#e5e7eb] shrink-0 transition-all duration-200',
        showAsCollapsed ? 'w-[48px]' : 'w-[256px]'
      )}
    >
      {/* Header */}
      <BrandDropdown isCollapsed={showAsCollapsed} forceCollapsed={forceCollapsed} onCollapse={() => setCollapsed(v => !v)} />

      {/* Navigation */}
      <nav className="flex flex-col px-2 pb-2 flex-1 overflow-y-auto overflow-x-hidden">

        {/* Dashboard */}
        <div className={cn('flex flex-col gap-0.5', 'mt-2')}>
          <NavTooltip label="Dashboard" enabled={showAsCollapsed}>
            <Link
              href="/"
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                pathname === '/'
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                showAsCollapsed && 'justify-center px-0'
              )}
            >
              <BarChart2 size={16} className={cn('shrink-0', pathname === '/' ? '' : 'opacity-70 group-hover:opacity-100')} />
              {!showAsCollapsed && <span>Dashboard</span>}
            </Link>
          </NavTooltip>
        </div>

        {/* Apps */}
        {!insideApp && (
          <div className={cn('flex flex-col gap-0.5', 'mt-2', onboardingActive && 'opacity-40 pointer-events-none')}>
            <div className="border-t border-[#e5e7eb] mb-1" />

            {altOnboarding ? (
              /* Alt onboarding: Support Agent as regular nav item */
              <NavTooltip label="Support Agent" enabled={showAsCollapsed}>
                <Link
                  href="/inbox"
                  className={cn(
                    'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                    pathname.startsWith('/inbox')
                      ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                      : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                    showAsCollapsed && 'justify-center px-0'
                  )}
                >
                  <MessageSquare size={16} className={cn('shrink-0', pathname.startsWith('/inbox') ? '' : 'opacity-70 group-hover:opacity-100')} />
                  {!showAsCollapsed && <span>Support Agent</span>}
                </Link>
              </NavTooltip>
            ) : (
              /* Normal: Open Ticket Inbox CTA */
              <NavTooltip label="Open Ticket Inbox" enabled={showAsCollapsed}>
                <Link
                  href="/inbox"
                  className={cn(
                    showAsCollapsed
                      ? cn('group flex items-center justify-center rounded-md h-8 text-[14px] transition-colors w-8',
                          'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]')
                      : 'flex items-center justify-center rounded-md px-2 h-8 text-[13px] font-medium transition-colors bg-[#18181b] text-white hover:bg-[#27272a] mt-2 mb-3'
                  )}
                >
                  {showAsCollapsed
                    ? <Inbox size={15} className="shrink-0 opacity-70 group-hover:opacity-100" />
                    : <span>Open Ticket Inbox</span>}
                </Link>
              </NavTooltip>
            )}

            {/* Evo Search */}
            <NavTooltip label="Evo Search" enabled={showAsCollapsed}>
              <Link
                href={evoSearchInstalled ? '/evo-search/analytics' : '/evo-search/install'}
                className={cn(
                  'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                  'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                  showAsCollapsed && 'justify-center px-0'
                )}
              >
                <Search size={16} className="shrink-0 opacity-70 group-hover:opacity-100" />
                {!showAsCollapsed && <span>Evo Search</span>}
              </Link>
            </NavTooltip>

            {/* Quizzes */}
            <NavTooltip label="Quizzes" enabled={showAsCollapsed}>
              <Link
                href={quizzesInstalled ? '/quizzes' : '/quizzes/install'}
                className={cn(
                  'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                  'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                  showAsCollapsed && 'justify-center px-0'
                )}
              >
                <FileQuestion size={16} className="shrink-0 opacity-70 group-hover:opacity-100" />
                {!showAsCollapsed && <span>Quizzes</span>}
              </Link>
            </NavTooltip>

            {/* Popups */}
            <NavTooltip label="Popups" enabled={showAsCollapsed}>
              <Link
                href="/popups"
                className={cn(
                  'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                  pathname.startsWith('/popups')
                    ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                    : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                  showAsCollapsed && 'justify-center px-0'
                )}
              >
                <Layers size={16} className={cn('shrink-0', pathname.startsWith('/popups') ? '' : 'opacity-70 group-hover:opacity-100')} />
                {!showAsCollapsed && <span>Popups</span>}
              </Link>
            </NavTooltip>

            {/* Search Test */}
            <NavTooltip label="Search Test" enabled={showAsCollapsed}>
              <Link
                href="/search-test"
                className={cn(
                  'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                  pathname.startsWith('/search-test')
                    ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                    : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                  showAsCollapsed && 'justify-center px-0'
                )}
              >
                <Search size={16} className={cn('shrink-0', pathname.startsWith('/search-test') ? '' : 'opacity-70 group-hover:opacity-100')} />
                {!showAsCollapsed && <span>Search Test</span>}
              </Link>
            </NavTooltip>
          </div>
        )}

        {/* Workflows + Knowledge Base — shown normally, or in alt onboarding once goal is selected */}
        {(!altOnboarding || altGoalSet) && (
          <div className={cn('flex flex-col gap-0.5 mt-2', onboardingActive && 'opacity-40 pointer-events-none')}>
            <div className="border-t border-[#e5e7eb] mb-1" />
            <WorkflowsNavItem isCollapsed={showAsCollapsed} forceCollapsed={forceCollapsed} pathname={pathname} insightsCount={insightsCount} />
            <NavTooltip label="Knowledge Base" enabled={showAsCollapsed}>
              <Link
                href="/knowledge-base"
                className={cn(
                  'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                  pathname.startsWith('/knowledge-base')
                    ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                    : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                  showAsCollapsed && 'justify-center px-0'
                )}
              >
                <BookOpen size={16} className={cn('shrink-0', pathname.startsWith('/knowledge-base') ? '' : 'opacity-70 group-hover:opacity-100')} />
                {!showAsCollapsed && <span>Knowledge Base</span>}
              </Link>
            </NavTooltip>
          </div>
        )}

      </nav>

      {/* Footer */}
      <div className="border-t border-[#e5e7eb] bg-[#fafafa] p-2 shrink-0 overflow-x-hidden">

        <div className={cn('flex flex-col gap-0.5 mb-2', onboardingActive && 'opacity-40 pointer-events-none')}>
          <NavTooltip label="Team" enabled={showAsCollapsed}>
            <Link
              href="/team"
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                pathname === '/team'
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                showAsCollapsed && 'justify-center px-0'
              )}
            >
              <UsersRound size={16} className={cn('shrink-0', pathname === '/team' ? '' : 'opacity-70 group-hover:opacity-100')} />
              {!showAsCollapsed && <span>Team</span>}
            </Link>
          </NavTooltip>
          <NavTooltip label="Support" enabled={showAsCollapsed}>
            <button
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors w-full text-left',
                showAsCollapsed && 'justify-center px-0'
              )}
            >
              <HelpCircle size={16} className="shrink-0 opacity-70 group-hover:opacity-100" />
              {!showAsCollapsed && <span>Support</span>}
            </button>
          </NavTooltip>
          <NavTooltip label="Store Management" enabled={showAsCollapsed}>
            <Link
              href="/store-management"
              className={cn(
                'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors',
                pathname === '/store-management'
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                showAsCollapsed && 'justify-center px-0'
              )}
            >
              <Store size={16} className={cn('shrink-0', pathname === '/store-management' ? '' : 'opacity-70 group-hover:opacity-100')} />
              {!showAsCollapsed && <span>Store Management</span>}
            </Link>
          </NavTooltip>
        </div>

        {/* Profile switcher */}
        <ProfileSwitcher
          isCollapsed={showAsCollapsed}
          dashboardView={dashboardView}
          onSwitch={toggleView}
        />
      </div>
    </div>
    </TooltipProvider>
  );
}
