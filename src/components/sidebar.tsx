'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import CreateSmartViewDialog, { SmartView, ICON_OPTIONS } from './create-smart-view-dialog';

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
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {/* Brand icon */}
              <div className="w-7 h-7 rounded-lg bg-[#16a34a] flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold leading-none">A</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#18181b] leading-none truncate">Evo Support</p>
                <p className="text-[10px] text-[#71717a] leading-none mt-0.5">Support Inbox</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
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

        {/* Nav Items */}
        <nav className="flex flex-col gap-0.5 p-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeView === item.label;
            return (
              <button
                key={item.label}
                onClick={() => onViewChange?.(item.label)}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors w-full text-left',
                  isActive
                    ? 'bg-[#f4f4f5] text-[#18181b]'
                    : 'text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
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
                <p className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wide">Smart Views</p>
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
                    'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors w-full text-left',
                    isActive
                      ? 'bg-[#f4f4f5] text-[#18181b]'
                      : 'text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]',
                    collapsed && 'justify-center px-0'
                  )}
                  title={collapsed ? view.label : undefined}
                >
                  <span className="shrink-0 text-[#71717a]">
                    <SmartViewIcon iconName={view.iconName} size={15} />
                  </span>
                  {!collapsed && <span className="flex-1 truncate text-xs">{view.label}</span>}
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
          <button
            className={cn(
              'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors w-full text-left text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Workflows' : undefined}
          >
            <span className="shrink-0"><Network size={16} /></span>
            {!collapsed && <span className="flex-1 truncate">Workflows</span>}
          </button>
          <button
            className={cn(
              'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors w-full text-left text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Billing' : undefined}
          >
            <span className="shrink-0"><CreditCard size={16} /></span>
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
