'use client';

import { useState, useRef, useEffect } from 'react';
import AppSidebar from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import {
  Search, Plus, X, MoreHorizontal, ShoppingBag,
  Mail, MessageSquare, Globe, ExternalLink, ChevronRight,
  Check,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────

type WorkflowState = 'inherited' | 'overridden' | 'not_configured';
type StoreStatus = 'active' | 'inactive';

interface Integration {
  id: string;
  name: string;
  connected: boolean;
  icon: React.ElementType;
}

interface Store {
  id: string;
  name: string;
  url: string;
  brand: string;
  brandInitials: string;
  region: { flag: string; name: string };
  timezone: string;
  currency: string;
  integrations: Integration[];
  workflowState: WorkflowState;
  workflowCount: number;
  status: StoreStatus;
}

// ─── Data ─────────────────────────────────────────────────────────────

const ALL_INTEGRATIONS: Record<string, { name: string; icon: React.ElementType }> = {
  shopify:    { name: 'Shopify',    icon: ShoppingBag },
  email:      { name: 'Email',      icon: Mail },
  whatsapp:   { name: 'WhatsApp',   icon: MessageSquare },
  instagram:  { name: 'Instagram',  icon: Globe },
  facebook:   { name: 'Facebook',   icon: Globe },
};

function makeIntegrations(ids: string[], connected: string[]): Integration[] {
  return Object.entries(ALL_INTEGRATIONS).map(([id, cfg]) => ({
    id,
    name: cfg.name,
    icon: cfg.icon,
    connected: ids.includes(id) && connected.includes(id),
  })).filter(i => ids.includes(i.id));
}

const STORES: Store[] = [
  {
    id: 'tbs-us',
    name: 'TBS US Store',
    url: 'tbsgroup.com/us',
    brand: 'TBS',
    brandInitials: 'TB',
    region: { flag: '🇺🇸', name: 'United States' },
    timezone: '(GMT−05:00) Eastern Time',
    currency: 'USD ($)',
    integrations: makeIntegrations(['shopify', 'email', 'whatsapp'], ['shopify', 'email', 'whatsapp']),
    workflowState: 'inherited',
    workflowCount: 6,
    status: 'active',
  },
  {
    id: 'tbs-eu',
    name: 'TBS EU Store',
    url: 'tbsgroup.com/eu',
    brand: 'TBS',
    brandInitials: 'TB',
    region: { flag: '🇪🇺', name: 'Europe' },
    timezone: '(GMT+01:00) Central European Time',
    currency: 'EUR (€)',
    integrations: makeIntegrations(['shopify', 'email', 'instagram'], ['shopify', 'email']),
    workflowState: 'overridden',
    workflowCount: 3,
    status: 'active',
  },
  {
    id: 'tbs-uae',
    name: 'TBS UAE Store',
    url: 'tbsgroup.com/uae',
    brand: 'TBS',
    brandInitials: 'TB',
    region: { flag: '🇦🇪', name: 'UAE' },
    timezone: '(GMT+04:00) Gulf Standard Time',
    currency: 'AED (د.إ)',
    integrations: makeIntegrations(['shopify', 'whatsapp'], ['shopify', 'whatsapp']),
    workflowState: 'inherited',
    workflowCount: 6,
    status: 'active',
  },
  {
    id: 'tbs-sg',
    name: 'TBS SG Store',
    url: 'tbsgroup.com/sg',
    brand: 'TBS',
    brandInitials: 'TB',
    region: { flag: '🇸🇬', name: 'Singapore' },
    timezone: '(GMT+08:00) Singapore Time',
    currency: 'SGD (S$)',
    integrations: makeIntegrations(['shopify', 'email', 'whatsapp', 'facebook'], ['shopify']),
    workflowState: 'not_configured',
    workflowCount: 0,
    status: 'active',
  },
  {
    id: 'nike-us',
    name: 'Nike US Store',
    url: 'nike.com/us',
    brand: 'Nike',
    brandInitials: 'NK',
    region: { flag: '🇺🇸', name: 'United States' },
    timezone: '(GMT−08:00) Pacific Time',
    currency: 'USD ($)',
    integrations: makeIntegrations(['shopify', 'email'], ['shopify', 'email']),
    workflowState: 'inherited',
    workflowCount: 4,
    status: 'active',
  },
  {
    id: 'nike-eu',
    name: 'Nike EU Store',
    url: 'nike.com/eu',
    brand: 'Nike',
    brandInitials: 'NK',
    region: { flag: '🇪🇺', name: 'Europe' },
    timezone: '(GMT+01:00) Central European Time',
    currency: 'EUR (€)',
    integrations: makeIntegrations(['shopify', 'instagram'], ['shopify']),
    workflowState: 'overridden',
    workflowCount: 2,
    status: 'active',
  },
  {
    id: 'dbs-eu',
    name: 'DBS EU Store',
    url: 'dbs.com/eu',
    brand: 'DBS',
    brandInitials: 'DB',
    region: { flag: '🇪🇺', name: 'Europe' },
    timezone: '(GMT+01:00) Central European Time',
    currency: 'EUR (€)',
    integrations: makeIntegrations(['email', 'whatsapp'], ['email']),
    workflowState: 'inherited',
    workflowCount: 6,
    status: 'inactive',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────

const WORKFLOW_STATE_CONFIG: Record<WorkflowState, { label: string; className: string }> = {
  inherited:      { label: 'Inherited',      className: 'bg-[#ede9fe] text-[#6d28d9] border border-[#ddd6fe]' },
  overridden:     { label: 'Overridden',     className: 'bg-[#fef9c3] text-[#854d0e] border border-[#fde047]' },
  not_configured: { label: 'Not configured', className: 'bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]' },
};

function WorkflowBadge({ state }: { state: WorkflowState }) {
  const cfg = WORKFLOW_STATE_CONFIG[state];
  return (
    <span className={cn('inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full', cfg.className)}>
      {cfg.label}
    </span>
  );
}

function StatusDot({ status }: { status: StoreStatus }) {
  return (
    <span className="flex items-center gap-1.5 text-sm">
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', status === 'active' ? 'bg-[#16a34a]' : 'bg-[#dc2626]')} />
      <span className={status === 'active' ? 'text-[#15803d]' : 'text-[#dc2626]'}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </span>
    </span>
  );
}

function IntegrationIcons({ integrations }: { integrations: Integration[] }) {
  const connected = integrations.filter(i => i.connected);
  const visible = connected.slice(0, 2);
  const extra = connected.length - 2;
  return (
    <div className="flex items-center gap-1">
      {visible.map(i => {
        const Icon = i.icon;
        return (
          <span key={i.id} title={i.name} className="w-6 h-6 rounded-md bg-[#f4f4f5] flex items-center justify-center">
            <Icon size={12} className="text-[#3f3f46]" />
          </span>
        );
      })}
      {extra > 0 && (
        <span className="text-[11px] text-[#a1a1aa] font-medium">+{extra}</span>
      )}
      {connected.length === 0 && (
        <span className="text-[11px] text-[#a1a1aa]">None</span>
      )}
    </div>
  );
}

function BrandBadge({ initials }: { initials: string }) {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#18181b] flex items-center justify-center shrink-0">
      <span className="text-[11px] font-bold text-white">{initials}</span>
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────

type PanelTab = 'overview' | 'integrations' | 'workflows' | 'details';

function StorePanel({ store, onClose }: { store: Store; onClose: () => void }) {
  const [tab, setTab] = useState<PanelTab>('overview');

  return (
    <div className="w-[400px] shrink-0 border-l border-[#e4e4e7] bg-white flex flex-col overflow-hidden">
      {/* Panel header */}
      <div className="px-5 pt-5 pb-0 shrink-0">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-3 min-w-0">
            <BrandBadge initials={store.brandInitials} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#18181b] leading-tight truncate">{store.name}</p>
              <a
                href={`https://${store.url}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#71717a] hover:text-[#18181b] flex items-center gap-0.5 transition-colors"
              >
                {store.url}
                <ExternalLink size={10} className="shrink-0" />
              </a>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-[#e4e4e7] mt-4">
          {(['overview', 'integrations', 'workflows', 'details'] as PanelTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-3 py-2 text-xs font-medium capitalize border-b-2 -mb-px transition-colors',
                tab === t
                  ? 'border-[#18181b] text-[#18181b]'
                  : 'border-transparent text-[#71717a] hover:text-[#3f3f46]',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {tab === 'overview' && <OverviewTab store={store} />}
        {tab === 'integrations' && <IntegrationsTab store={store} />}
        {tab === 'workflows' && <WorkflowsTab store={store} />}
        {tab === 'details' && <DetailsTab store={store} />}
      </div>

      {/* Danger action */}
      <div className="px-5 py-4 border-t border-[#e4e4e7] shrink-0">
        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-[#fca5a5] text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2] transition-colors">
          {store.status === 'active' ? 'Deactivate Store' : 'Activate Store'}
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-[#18181b] uppercase tracking-wider">{title}</p>
      {action && (
        <button className="text-xs font-medium text-[#71717a] hover:text-[#18181b] transition-colors">{action}</button>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-[#f4f4f5] last:border-0 gap-4">
      <span className="text-xs text-[#71717a] shrink-0 pt-px">{label}</span>
      <span className="text-xs text-[#18181b] font-medium text-right">{value}</span>
    </div>
  );
}

function OverviewTab({ store }: { store: Store }) {
  const wfCfg = WORKFLOW_STATE_CONFIG[store.workflowState];
  return (
    <div className="px-5 py-5 space-y-6">

      {/* Store Information */}
      <div>
        <SectionHeader title="Store Information" action="Edit" />
        <div className="bg-[#fafafa] rounded-xl border border-[#e4e4e7] px-4">
          <InfoRow label="Brand" value={store.brand} />
          <InfoRow label="Region" value={<span>{store.region.flag} {store.region.name}</span>} />
          <InfoRow label="Time Zone" value={store.timezone} />
          <InfoRow label="Currency" value={store.currency} />
          <InfoRow
            label="Store URL"
            value={
              <a href={`https://${store.url}`} target="_blank" rel="noreferrer"
                className="text-[#7c3aed] hover:underline flex items-center gap-1">
                {store.url} <ExternalLink size={10} />
              </a>
            }
          />
          <InfoRow
            label="Status"
            value={
              <span className={cn(
                'inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border',
                store.status === 'active'
                  ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]'
                  : 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]',
              )}>
                <span className={cn('w-1.5 h-1.5 rounded-full', store.status === 'active' ? 'bg-[#16a34a]' : 'bg-[#dc2626]')} />
                {store.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            }
          />
        </div>
      </div>

      {/* Integrations */}
      <div>
        <SectionHeader title="Integrations" action="Manage" />
        <div className="bg-[#fafafa] rounded-xl border border-[#e4e4e7] overflow-hidden">
          {store.integrations.map(integration => {
            const Icon = integration.icon;
            return (
              <div key={integration.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-[#f4f4f5] last:border-0">
                <div className="w-7 h-7 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-[#3f3f46]" />
                </div>
                <span className="text-sm text-[#18181b] flex-1">{integration.name}</span>
                <span className={cn(
                  'text-[11px] font-medium px-2 py-0.5 rounded-full border',
                  integration.connected
                    ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]'
                    : 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]',
                )}>
                  {integration.connected ? 'Connected' : 'Not configured'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workflow State */}
      <div>
        <SectionHeader title="Workflow State" action="Manage" />
        <div className="bg-[#fafafa] rounded-xl border border-[#e4e4e7] px-4 py-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#71717a]">
              {store.workflowState === 'overridden'
                ? 'This store has customized workflows.'
                : store.workflowState === 'inherited'
                  ? 'This store inherits workflows from its brand.'
                  : 'No workflows configured for this store.'}
            </p>
          </div>
          <WorkflowBadge state={store.workflowState} />
          {store.workflowCount > 0 && (
            <p className="text-xs text-[#a1a1aa]">
              {store.workflowCount} workflow{store.workflowCount !== 1 ? 's' : ''} {store.workflowState === 'overridden' ? 'overridden' : 'inherited'}
            </p>
          )}
        </div>
      </div>

    </div>
  );
}

function IntegrationsTab({ store }: { store: Store }) {
  return (
    <div className="px-5 py-5">
      <SectionHeader title="All Integrations" action="Add" />
      <div className="bg-[#fafafa] rounded-xl border border-[#e4e4e7] overflow-hidden">
        {store.integrations.map(integration => {
          const Icon = integration.icon;
          return (
            <div key={integration.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#f4f4f5] last:border-0 group hover:bg-white transition-colors">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center shrink-0">
                <Icon size={15} className="text-[#3f3f46]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#18181b]">{integration.name}</p>
                <p className="text-xs text-[#a1a1aa]">{integration.connected ? 'Syncing data' : 'Setup required'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-[11px] font-medium px-2 py-0.5 rounded-full border',
                  integration.connected
                    ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]'
                    : 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]',
                )}>
                  {integration.connected ? 'Connected' : 'Not configured'}
                </span>
                <ChevronRight size={13} className="text-[#d4d4d8] group-hover:text-[#a1a1aa] transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkflowsTab({ store }: { store: Store }) {
  const workflows = [
    'Refund Handling Flow',
    'Order Cancellation',
    'Return & Exchange',
    'Shipping Inquiry',
    'Product Recommendation',
    'Subscription Management',
  ].slice(0, store.workflowCount || 3);

  return (
    <div className="px-5 py-5">
      <SectionHeader title="Workflows" action="Manage" />
      {store.workflowState === 'not_configured' ? (
        <div className="bg-[#fafafa] rounded-xl border border-[#e4e4e7] px-4 py-8 text-center">
          <p className="text-sm text-[#a1a1aa]">No workflows configured.</p>
          <button className="mt-3 text-xs font-medium text-[#7c3aed] hover:underline">Set up workflows →</button>
        </div>
      ) : (
        <div className="bg-[#fafafa] rounded-xl border border-[#e4e4e7] overflow-hidden">
          {workflows.map(name => (
            <div key={name} className="flex items-center gap-3 px-4 py-3 border-b border-[#f4f4f5] last:border-0 hover:bg-white transition-colors group">
              <div className={cn(
                'w-1.5 h-1.5 rounded-full shrink-0',
                store.workflowState === 'overridden' ? 'bg-[#d97706]' : 'bg-[#7c3aed]',
              )} />
              <span className="text-sm text-[#18181b] flex-1">{name}</span>
              <WorkflowBadge state={store.workflowState} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailsTab({ store }: { store: Store }) {
  return (
    <div className="px-5 py-5 space-y-6">
      <div>
        <SectionHeader title="Technical Details" action="Edit" />
        <div className="bg-[#fafafa] rounded-xl border border-[#e4e4e7] px-4">
          <InfoRow label="Store ID" value={<span className="font-mono text-[11px]">{store.id}</span>} />
          <InfoRow label="Brand" value={store.brand} />
          <InfoRow label="Time Zone" value={store.timezone} />
          <InfoRow label="Currency" value={store.currency} />
          <InfoRow label="Created" value="Jan 14, 2025" />
          <InfoRow label="Last updated" value="May 5, 2026" />
        </div>
      </div>
      <div>
        <SectionHeader title="Danger Zone" />
        <div className="bg-[#fef2f2] rounded-xl border border-[#fecaca] px-4 py-3.5">
          <p className="text-xs text-[#dc2626] leading-relaxed">
            Deactivating this store will disable all AI features and integrations. This can be reversed at any time.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Actions dropdown ─────────────────────────────────────────────────

function ActionsMenu({ store }: { store: Store }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref} onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-7 h-7 flex items-center justify-center rounded-md text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#e4e4e7] rounded-xl shadow-lg z-20 py-1.5 overflow-hidden">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#3f3f46] hover:bg-[#fafafa] transition-colors text-left">
            <Check size={12} className="text-[#71717a] shrink-0" />
            View details
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#3f3f46] hover:bg-[#fafafa] transition-colors text-left">
            <ExternalLink size={12} className="text-[#71717a] shrink-0" />
            Open store URL
          </button>
          <div className="border-t border-[#f4f4f5] my-1" />
          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#dc2626] hover:bg-[#fef2f2] transition-colors text-left">
            {store.status === 'active' ? 'Deactivate store' : 'Activate store'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────

export default function StoreManagementPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'inactive'>('all');
  const [selectedStore, setSelectedStore] = useState<Store | null>(STORES[0]);

  const filtered = STORES.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.brand.toLowerCase().includes(search.toLowerCase()) ||
      s.url.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || s.status === 'inactive';
    return matchesSearch && matchesTab;
  });

  const inactiveCount = STORES.filter(s => s.status === 'inactive').length;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[#fafafa]">
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ── Main content ── */}
          <div className="flex-1 overflow-y-auto min-w-0">
            <div className="px-8 py-8">

              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-xl font-semibold text-[#18181b]">Stores</h1>
                  <p className="text-sm text-[#71717a] mt-0.5">View and manage all stores across your brands.</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors shrink-0">
                  <Plus size={13} />
                  Add Store
                </button>
              </div>

              {/* Search */}
              <div className="relative max-w-sm mb-4">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search stores..."
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-[#e4e4e7] bg-white outline-none focus:border-[#18181b] focus:ring-2 focus:ring-[#18181b]/5 transition-colors placeholder:text-[#a1a1aa] text-[#18181b]"
                />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-0 border-b border-[#e4e4e7] mb-5">
                <button
                  onClick={() => setActiveTab('all')}
                  className={cn(
                    'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                    activeTab === 'all'
                      ? 'border-[#18181b] text-[#18181b]'
                      : 'border-transparent text-[#71717a] hover:text-[#3f3f46]',
                  )}
                >
                  All Stores ({STORES.length})
                </button>
                <button
                  onClick={() => setActiveTab('inactive')}
                  className={cn(
                    'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                    activeTab === 'inactive'
                      ? 'border-[#18181b] text-[#18181b]'
                      : 'border-transparent text-[#71717a] hover:text-[#3f3f46]',
                  )}
                >
                  Inactive Stores ({inactiveCount})
                </button>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e4e4e7] bg-[#fafafa]">
                      <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Store</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-[#71717a]">Brand</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-[#71717a]">Region</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-[#71717a]">Integrations</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-[#71717a]">Workflow State</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-[#71717a]">Status</th>
                      <th className="px-4 py-3 w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#a1a1aa]">
                          No stores match your search.
                        </td>
                      </tr>
                    ) : filtered.map(store => {
                      const isSelected = selectedStore?.id === store.id;
                      return (
                        <tr
                          key={store.id}
                          onClick={() => setSelectedStore(store)}
                          className={cn(
                            'border-b border-[#e4e4e7] last:border-0 transition-colors cursor-pointer group',
                            isSelected ? 'bg-[#fafafa]' : 'hover:bg-[#fafafa]',
                          )}
                        >
                          {/* Store */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              {isSelected && (
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#18181b] rounded-r" />
                              )}
                              <BrandBadge initials={store.brandInitials} />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#18181b] truncate">{store.name}</p>
                                <p className="text-xs text-[#a1a1aa] truncate">{store.url}</p>
                              </div>
                            </div>
                          </td>

                          {/* Brand */}
                          <td className="px-4 py-3.5">
                            <span className="text-sm text-[#3f3f46]">{store.brand}</span>
                          </td>

                          {/* Region */}
                          <td className="px-4 py-3.5">
                            <span className="text-sm text-[#3f3f46]">
                              {store.region.flag} {store.region.name}
                            </span>
                          </td>

                          {/* Integrations */}
                          <td className="px-4 py-3.5">
                            <IntegrationIcons integrations={store.integrations} />
                          </td>

                          {/* Workflow State */}
                          <td className="px-4 py-3.5">
                            <WorkflowBadge state={store.workflowState} />
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <StatusDot status={store.status} />
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5">
                            <ActionsMenu store={store} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* ── Right panel ── */}
          {selectedStore && (
            <StorePanel
              store={selectedStore}
              onClose={() => setSelectedStore(null)}
            />
          )}

        </div>
      </div>
    </div>
  );
}
