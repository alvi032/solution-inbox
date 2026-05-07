'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import {
  Inbox,
  AtSign,
  UserRoundX,
  Archive,
  ShieldAlert,
  Crown,
  CircleDollarSign,
  PanelLeft,
  Plus,
  Sparkles,
  CreditCard,
  BarChart2,
  ChevronDown,
  Search,
  FileQuestion,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { tickets } from '@/lib/data';
import CreateSmartViewDialog, { SmartView, ICON_OPTIONS } from './create-smart-view-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const CURRENT_USER = 'Sarah Jones';

const TICKET_BRAND: Record<string, { name: string; store: string }> = {
  '#5195': { name: 'TBS Enterprise', store: 'TBS US'    },
  '#5194': { name: 'Nike Pro',       store: 'Nike US'   },
  '#5193': { name: 'TBS Enterprise', store: 'TBS UK'    },
  '#5192': { name: 'Nike Pro',       store: 'Nike EU'   },
  '#5191': { name: 'TBS Enterprise', store: 'TBS UAE'   },
  '#5190': { name: 'Nike Pro',       store: 'Nike APAC' },
  '#5189': { name: 'TBS Enterprise', store: 'TBS US'    },
  '#5188': { name: 'Nike Pro',       store: 'Nike US'   },
  '#5187': { name: 'TBS Enterprise', store: 'TBS UK'    },
  '#5186': { name: 'Nike Pro',       store: 'Nike EU'   },
  '#5185': { name: 'TBS Enterprise', store: 'TBS UAE'   },
  '#5184': { name: 'Nike Pro',       store: 'Nike APAC' },
  '#5183': { name: 'TBS Enterprise', store: 'TBS US'    },
  '#5182': { name: 'Nike Pro',       store: 'Nike US'   },
  '#5181': { name: 'TBS Enterprise', store: 'TBS UK'    },
  '#5180': { name: 'Nike Pro',       store: 'Nike EU'   },
};

const BRAND_STORES = [
  { brand: 'TBS Enterprise', short: 'TBS', bg: '#18181b', stores: ['TBS US', 'TBS UK', 'TBS UAE'] },
  { brand: 'Nike Pro',       short: 'NK',  bg: '#e2231a', stores: ['Nike US', 'Nike EU', 'Nike APAC'] },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeView?: string;
  onViewChange?: (view: string) => void;
  archivedIds?: Set<string>;
  spamIds?: Set<string>;
  statusOverrides?: Record<string, 'open' | 'closed'>;
}

const navItems = [
  { icon: <Inbox size={16} />, label: 'Inbox' },
  { icon: <AtSign size={16} />, label: 'My Tickets' },
  { icon: <UserRoundX size={16} />, label: 'Unassigned' },
  { icon: <Archive size={16} />, label: 'Archived' },
  { icon: <ShieldAlert size={16} />, label: 'Spam' },
];

const defaultSmartViews = [
  { label: 'VIP Refund Request', iconName: 'Crown' },
  { label: 'High Risk - High Priority', iconName: 'Dollar' },
];

function SmartViewIcon({ iconName, size = 14 }: { iconName: string; size?: number }) {
  const found = ICON_OPTIONS.find((o) => o.name === iconName);
  if (!found) return <Sparkles size={size} />;
  const Icon: LucideIcon = found.icon;
  return <Icon size={size} />;
}

const BRAND_ID_TO_NAME: Record<string, string> = {
  tbs:  'TBS Enterprise',
  nike: 'Nike Pro',
};

export default function Sidebar({ collapsed, onToggle, activeView = 'Inbox', onViewChange, archivedIds = new Set(), spamIds = new Set(), statusOverrides = {} }: SidebarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customViews, setCustomViews] = useState<SmartView[]>([]);
  const [evoSearchInstalled, setEvoSearchInstalled] = useState(false);
  const [quizzesInstalled, setQuizzesInstalled] = useState(false);
  const [activeBrandId, setActiveBrandId] = useState<string>('tbs');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setEvoSearchInstalled(localStorage.getItem('evoSearchInstalled') === 'true');
    setQuizzesInstalled(localStorage.getItem('quizzesInstalled') === 'true');
    setActiveBrandId(localStorage.getItem('activeBrand') ?? 'tbs');

    const onBrandChange = (e: Event) => setActiveBrandId((e as CustomEvent<string>).detail);
    window.addEventListener('active-brand-change', onBrandChange);
    return () => window.removeEventListener('active-brand-change', onBrandChange);
  }, []);

  const allSmartViews = [...defaultSmartViews, ...customViews];

  // Per-view ticket counts
  const active = (t: typeof tickets[0]) => !archivedIds.has(t.id) && !spamIds.has(t.id);
  const viewCounts: Record<string, number> = {
    Inbox:           tickets.filter(active).length,
    'My Tickets':    tickets.filter(t => active(t) && t.assignee === CURRENT_USER).length,
    Unassigned:      tickets.filter(t => active(t) && t.assignee === 'Unassigned').length,
    Archived:        archivedIds.size,
    Spam:            spamIds.size,
    // Brand counts
    'TBS Enterprise': tickets.filter(t => active(t) && TICKET_BRAND[t.id]?.name === 'TBS Enterprise').length,
    'Nike Pro':       tickets.filter(t => active(t) && TICKET_BRAND[t.id]?.name === 'Nike Pro').length,
    // Store counts
    'TBS US':    tickets.filter(t => active(t) && TICKET_BRAND[t.id]?.store === 'TBS US').length,
    'TBS UK':    tickets.filter(t => active(t) && TICKET_BRAND[t.id]?.store === 'TBS UK').length,
    'TBS UAE':   tickets.filter(t => active(t) && TICKET_BRAND[t.id]?.store === 'TBS UAE').length,
    'Nike US':   tickets.filter(t => active(t) && TICKET_BRAND[t.id]?.store === 'Nike US').length,
    'Nike EU':   tickets.filter(t => active(t) && TICKET_BRAND[t.id]?.store === 'Nike EU').length,
    'Nike APAC': tickets.filter(t => active(t) && TICKET_BRAND[t.id]?.store === 'Nike APAC').length,
    // Smart views
    'VIP Refund Request':        tickets.filter(t => active(t) && t.category === 'Refund' && t.priority === 'high').length,
    'High Risk - High Priority': tickets.filter(t => active(t) && t.priority === 'high').length,
  };

  const handleSaveView = (view: SmartView) => {
    setCustomViews((prev) => [...prev, view]);
  };

  return (
    <>
      <div
        className={cn(
          'flex flex-col h-full border-r border-[#e5e7eb] bg-[#fafafa] transition-all duration-200 shrink-0',
          collapsed ? 'w-0 overflow-hidden' : 'w-[220px]'
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
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 min-w-0 flex-1 rounded-md px-1 py-0.5 hover:bg-[#f4f4f5] transition-colors text-left">
                <p className="text-sm font-semibold text-[#18181b] leading-none truncate flex-1 min-w-0">Support Inbox</p>
                <ChevronDown size={13} className="text-[#71717a] shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start" className="w-[200px]">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/inbox')}>
                    <Inbox size={14} className="shrink-0" />
                    <span>Ticket Inbox</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(evoSearchInstalled ? '/evo-search/analytics' : '/evo-search/install')}>
                    <Search size={14} className="shrink-0" />
                    <span>Evo Search</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(quizzesInstalled ? '/quizzes' : '/quizzes/install')}>
                    <FileQuestion size={14} className="shrink-0" />
                    <span>Quizzes</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <button
            onClick={onToggle}
            className="w-8 h-8 flex items-center justify-center rounded-md text-[#71717a] hover:text-[#18181b] hover:bg-white transition-colors shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <PanelLeft size={15} />
          </button>
        </div>


        {/* Nav Items */}
        <nav className="flex flex-col gap-0.5 p-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeView === item.label;
            return (
              <button
                key={item.label}
                onClick={() => onViewChange?.(item.label)}
                className={cn(
                  'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors w-full text-left',
                  isActive
                    ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                    : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className={cn('shrink-0', isActive ? '' : 'opacity-70 group-hover:opacity-100')}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {(viewCounts[item.label] ?? 0) > 0 && (
                      <span className="text-[10px] font-semibold tabular-nums text-[#71717a] shrink-0">
                        {viewCounts[item.label]}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}

          {/* Smart Views */}
          <div className={cn('mt-4', collapsed && 'mt-3')}>
            {collapsed ? (
              <div className="border-t border-[#e5e7eb] my-1" />
            ) : (
              <div className="flex items-center justify-between px-2 mb-1">
                <p className="text-[12px] leading-4 font-medium text-[#3f3f46]/70">Smart Views</p>
                <button
                  onClick={() => setDialogOpen(true)}
                  className="w-5 h-5 flex items-center justify-center rounded text-[#a1a1aa] hover:text-[#18181b] hover:bg-white transition-colors"
                  title="Create smart view"
                >
                  <Plus size={13} />
                </button>
              </div>
            )}

            {allSmartViews.map((view) => {
              const isActive = activeView === view.label;
              return (
                <button
                  key={view.label}
                  onClick={() => onViewChange?.(view.label)}
                  className={cn(
                    'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors w-full text-left',
                    isActive
                      ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                      : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                    collapsed && 'justify-center px-0'
                  )}
                  title={collapsed ? view.label : undefined}
                >
                  <span className={cn('shrink-0', isActive ? '' : 'opacity-70 group-hover:opacity-100')}>
                    <SmartViewIcon iconName={view.iconName} size={16} />
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{view.label}</span>
                      {(viewCounts[view.label] ?? 0) > 0 && (
                        <span className="text-[10px] font-semibold tabular-nums text-[#71717a] shrink-0">
                          {viewCounts[view.label]}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}

            {/* Add button in collapsed state */}
            {collapsed && (
              <button
                onClick={() => setDialogOpen(true)}
                className="flex items-center justify-center w-full py-2 rounded-md text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                title="Create smart view"
              >
                <Plus size={14} />
              </button>
            )}
          </div>

          {/* Stores — flat list of regions only */}
          <div className={cn('mt-4', collapsed && 'mt-3')}>
            {collapsed ? (
              <div className="border-t border-[#e5e7eb] my-1" />
            ) : (
              <div className="flex items-center px-2 mb-1">
                <p className="text-[12px] leading-4 font-medium text-[#3f3f46]/70">Stores</p>
              </div>
            )}
            {BRAND_STORES.filter(b => b.brand === BRAND_ID_TO_NAME[activeBrandId]).flatMap((brandData) =>
              brandData.stores.map((store) => {
                const isStoreActive = activeView === store;
                return (
                  <button
                    key={store}
                    onClick={() => onViewChange?.(store)}
                    className={cn(
                      'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors w-full text-left',
                      isStoreActive
                        ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                        : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                      collapsed && 'justify-center px-0'
                    )}
                    title={collapsed ? store : undefined}
                  >
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center text-white font-bold shrink-0"
                      style={{ backgroundColor: brandData.bg, fontSize: 6 }}
                    >
                      {brandData.short}
                    </div>
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{store}</span>
                        {(viewCounts[store] ?? 0) > 0 && (
                          <span className="text-[10px] font-semibold tabular-nums text-[#71717a] shrink-0">
                            {viewCounts[store]}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })
            )}
          </div>

        </nav>

        {/* Workflows + Billing footer */}
        <div className="border-t border-[#e5e7eb] p-2 shrink-0">
          <Link
            href="/inbox/analytics"
            className={cn(
              'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors w-full text-left',
              pathname === '/inbox/analytics'
                ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Analytics' : undefined}
          >
            <span className={cn('shrink-0', pathname === '/inbox/analytics' ? '' : 'opacity-70 group-hover:opacity-100')}><BarChart2 size={16} /></span>
            {!collapsed && <span className="flex-1 truncate">Analytics</span>}
          </Link>
          <button
            className={cn(
              'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors w-full text-left text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Billing' : undefined}
          >
            <span className="shrink-0 opacity-70 group-hover:opacity-100"><CreditCard size={16} /></span>
            {!collapsed && <span className="flex-1 truncate">Billing</span>}
          </button>
        </div>
      </div>

      <CreateSmartViewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveView}
      />
    </>
  );
}
