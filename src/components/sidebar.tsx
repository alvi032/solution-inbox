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
  Network,
  CreditCard,
  BarChart2,
  ChevronDown,
  ShoppingBag,
  Search,
  FileQuestion,
  BookOpen,
  HelpCircle,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import CreateSmartViewDialog, { SmartView, ICON_OPTIONS } from './create-smart-view-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeView?: string;
  onViewChange?: (view: string) => void;
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

export default function Sidebar({ collapsed, onToggle, activeView = 'Inbox', onViewChange }: SidebarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customViews, setCustomViews] = useState<SmartView[]>([]);
  const [evoSearchInstalled, setEvoSearchInstalled] = useState(false);
  const [quizzesInstalled, setQuizzesInstalled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setEvoSearchInstalled(localStorage.getItem('evoSearchInstalled') === 'true');
    setQuizzesInstalled(localStorage.getItem('quizzesInstalled') === 'true');
  }, []);

  const allSmartViews = [...defaultSmartViews, ...customViews];

  const handleSaveView = (view: SmartView) => {
    setCustomViews((prev) => [...prev, view]);
  };

  return (
    <>
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
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 min-w-0 flex-1 rounded-md px-1 py-0.5 hover:bg-[#f4f4f5] transition-colors text-left">
                {/* Brand icon */}
                <div className="w-7 h-7 rounded-lg bg-[#16a34a] flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold leading-none">A</span>
                </div>
                <p className="text-sm font-semibold text-[#18181b] leading-none truncate flex-1 min-w-0">Support Inbox</p>
                <ChevronDown size={13} className="text-[#71717a] shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start" className="w-[200px]">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[10px] font-medium text-[#a1a1aa] uppercase tracking-wide px-2 py-1">Navigate to</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => router.push('/')}>
                    <BarChart2 size={14} className="shrink-0" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[10px] font-medium text-[#a1a1aa] uppercase tracking-wide px-2 py-1">Apps</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => router.push('/inbox')}>
                    <Inbox size={14} className="shrink-0" />
                    <span>Support Agent</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/sales-agent/analytics')}>
                    <ShoppingBag size={14} className="shrink-0" />
                    <span>Sales Agent</span>
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
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BookOpen size={14} className="shrink-0" />
                    <span>Knowledge Base</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/team')}>
                    <UsersRound size={14} className="shrink-0" />
                    <span>Team</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle size={14} className="shrink-0" />
                    <span>Support</span>
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
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
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
                  {!collapsed && <span className="flex-1 truncate">{view.label}</span>}
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
          <Link
            href="/inbox/workflows"
            className={cn(
              'group flex items-center gap-2 rounded-md px-2 h-8 text-[14px] transition-colors w-full text-left',
              pathname === '/inbox/workflows'
                ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                : 'text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Workflows' : undefined}
          >
            <span className={cn('shrink-0', pathname === '/inbox/workflows' ? '' : 'opacity-70 group-hover:opacity-100')}><Network size={16} /></span>
            {!collapsed && <span className="flex-1 truncate">Workflows</span>}
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
