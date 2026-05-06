'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppSidebar from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import {
  Plus, FlaskConical, Search, ChevronDown, ShoppingBag,
  MessageSquare, Mail, Globe,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────

type WorkflowStatus = 'active' | 'inactive';

interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  usedByStores: { active: number; total: number };
  storeIds: string[];
  channels: string[];
  used: number;
  resolved: number;
  escalated: number;
  rating: number | null;
}

// ─── Data ─────────────────────────────────────────────────────────────

const STORES = [
  { id: 'us-flagship', label: 'US Flagship' },
  { id: 'uk-store', label: 'UK Store' },
  { id: 'ca-store', label: 'CA Store' },
  { id: 'au-store', label: 'AU Store' },
  { id: 'de-store', label: 'DE Store' },
  { id: 'fr-store', label: 'FR Store' },
  { id: 'sg-store', label: 'SG Store' },
];

const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'refund-handling',
    name: 'Refund Handling Flow',
    status: 'active',
    usedByStores: { active: 6, total: 7 },
    storeIds: ['us-flagship', 'uk-store', 'ca-store', 'au-store', 'de-store', 'fr-store'],
    channels: ['chat', 'email', 'whatsapp'],
    used: 1240, resolved: 84, escalated: 9, rating: 4.6,
  },
  {
    id: 'order-cancellation',
    name: 'Order Cancellation',
    status: 'active',
    usedByStores: { active: 7, total: 7 },
    storeIds: ['us-flagship', 'uk-store', 'ca-store', 'au-store', 'de-store', 'fr-store', 'sg-store'],
    channels: ['chat', 'email'],
    used: 874, resolved: 91, escalated: 6, rating: 4.8,
  },
  {
    id: 'return-exchange',
    name: 'Return & Exchange',
    status: 'active',
    usedByStores: { active: 5, total: 7 },
    storeIds: ['us-flagship', 'uk-store', 'ca-store', 'au-store', 'de-store'],
    channels: ['chat', 'email', 'whatsapp', 'instagram'],
    used: 612, resolved: 78, escalated: 14, rating: 4.2,
  },
  {
    id: 'shipping-inquiry',
    name: 'Shipping Inquiry',
    status: 'active',
    usedByStores: { active: 7, total: 7 },
    storeIds: ['us-flagship', 'uk-store', 'ca-store', 'au-store', 'de-store', 'fr-store', 'sg-store'],
    channels: ['chat', 'whatsapp'],
    used: 2103, resolved: 95, escalated: 3, rating: 4.9,
  },
  {
    id: 'product-recommendation',
    name: 'Product Recommendation',
    status: 'inactive',
    usedByStores: { active: 0, total: 7 },
    storeIds: [],
    channels: ['chat'],
    used: 0, resolved: 0, escalated: 0, rating: null,
  },
  {
    id: 'subscription-management',
    name: 'Subscription Management',
    status: 'inactive',
    usedByStores: { active: 2, total: 7 },
    storeIds: ['us-flagship', 'uk-store'],
    channels: ['chat', 'email'],
    used: 318, resolved: 67, escalated: 22, rating: 3.8,
  },
];

const CHANNEL_CONFIG: Record<string, { label: string; icon: React.ElementType }> = {
  chat: { label: 'Chat', icon: MessageSquare },
  email: { label: 'Email', icon: Mail },
  whatsapp: { label: 'WhatsApp', icon: Globe },
  facebook: { label: 'Facebook', icon: Globe },
  instagram: { label: 'Instagram', icon: Globe },
};

// ─── Toggle ───────────────────────────────────────────────────────────

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(); }}
      className={cn(
        'relative w-9 h-5 rounded-full transition-colors shrink-0',
        enabled ? 'bg-[#16a34a]' : 'bg-[#e4e4e7]',
      )}
      title={enabled ? 'Disable workflow' : 'Enable workflow'}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform',
          enabled ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </button>
  );
}

// ─── Store filter dropdown ─────────────────────────────────────────────

function StoreFilter({
  selectedStores,
  onChange,
}: {
  selectedStores: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allSelected = selectedStores.length === 0;
  const label = allSelected
    ? 'All stores'
    : selectedStores.length === 1
      ? STORES.find(s => s.id === selectedStores[0])?.label ?? '1 store'
      : `${selectedStores.length} stores`;

  function toggleStore(id: string) {
    if (selectedStores.includes(id)) {
      onChange(selectedStores.filter(s => s !== id));
    } else {
      onChange([...selectedStores, id]);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors bg-white whitespace-nowrap',
          open || !allSelected
            ? 'border-[#16a34a] text-[#16a34a]'
            : 'border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa]',
        )}
      >
        <span>{label}</span>
        <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-[#e4e4e7] rounded-xl shadow-lg z-50 py-1.5 overflow-hidden">
          {/* All stores */}
          <button
            onClick={() => { onChange([]); setOpen(false); }}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors',
              allSelected ? 'text-[#18181b] font-medium' : 'text-[#3f3f46] hover:bg-[#fafafa]',
            )}
          >
            <span className={cn(
              'w-4 h-4 rounded border flex items-center justify-center shrink-0',
              allSelected ? 'bg-[#18181b] border-[#18181b]' : 'border-[#d4d4d8]',
            )}>
              {allSelected && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            All stores
          </button>

          <div className="border-t border-[#f4f4f5] my-1" />

          {STORES.map(store => {
            const checked = selectedStores.includes(store.id);
            return (
              <button
                key={store.id}
                onClick={() => toggleStore(store.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left text-[#3f3f46] hover:bg-[#fafafa] transition-colors"
              >
                <span className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center shrink-0',
                  checked ? 'bg-[#18181b] border-[#18181b]' : 'border-[#d4d4d8]',
                )}>
                  {checked && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {store.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────

function WorkflowsContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'support' | 'sales'>('support');

  useEffect(() => {
    setTab(searchParams.get('tab') === 'sales' ? 'sales' : 'support');
  }, [searchParams]);

  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

  function toggleStatus(id: string) {
    setWorkflows(prev =>
      prev.map(w =>
        w.id === id
          ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' }
          : w,
      ),
    );
  }

  const filtered = workflows.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || w.status === filter;
    const matchesStore =
      selectedStores.length === 0 ||
      selectedStores.some(s => w.storeIds.includes(s));
    return matchesSearch && matchesFilter && matchesStore;
  });

  const activeCount = workflows.filter(w => w.status === 'active').length;
  const inactiveCount = workflows.filter(w => w.status === 'inactive').length;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-8 py-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-xl font-semibold text-[#18181b]">Workflows</h1>
              <p className="text-sm text-[#71717a] mt-0.5">
                Manage AI workflows across your brands and stores.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] hover:text-[#18181b] transition-colors">
                <FlaskConical size={13} />
                Test workflow
              </button>
              <Link
                href="/evo-ai/workflows/new"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors"
              >
                <Plus size={13} />
                Create workflow
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-[#e4e4e7] mb-8 -mx-8 px-8">
            {([
              { id: 'support', label: 'Support Workflows' },
              { id: 'sales',   label: 'Sales Workflows' },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                  tab === t.id
                    ? 'border-[#18181b] text-[#18181b]'
                    : 'border-transparent text-[#71717a] hover:text-[#3f3f46]',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Sales upgrade banner ── */}
          {tab === 'sales' && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#18181b] flex items-center justify-center mb-5">
                <ShoppingBag size={24} className="text-white" />
              </div>
              <h2 className="text-lg font-semibold text-[#18181b] mb-2">Upgrade to Sales Workflows</h2>
              <p className="text-sm text-[#71717a] max-w-sm leading-relaxed mb-6">
                Sales Workflows let your AI proactively guide customers through product discovery, upsells, and conversion flows. Available on the Growth plan and above.
              </p>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors">
                  Upgrade plan
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] hover:text-[#18181b] transition-colors">
                  Learn more
                </button>
              </div>
            </div>
          )}

          {/* ── Support workflows content ── */}
          {tab === 'support' && <>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total workflows', value: workflows.length, sub: 'across all brands' },
              { label: 'Active', value: activeCount, sub: 'currently running', green: true },
              { label: 'Inactive', value: inactiveCount, sub: 'paused or draft' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-[#e4e4e7] px-5 py-4">
                <p className="text-[10px] uppercase tracking-widest font-medium text-[#a1a1aa] mb-1">{s.label}</p>
                <p className={cn('text-2xl font-semibold leading-none', s.green ? 'text-[#16a34a]' : 'text-[#18181b]')}>{s.value}</p>
                <p className="text-xs text-[#a1a1aa] mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Filters + search */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search workflows…"
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-[#e4e4e7] bg-white outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/10 transition-colors placeholder:text-[#a1a1aa] text-[#18181b]"
              />
            </div>

            <StoreFilter selectedStores={selectedStores} onChange={setSelectedStores} />

            <div className="flex items-center rounded-lg border border-[#e4e4e7] overflow-hidden bg-white">
              {(['all', 'active', 'inactive'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-3 py-2 text-xs font-medium capitalize transition-colors border-r border-[#e4e4e7] last:border-0',
                    filter === f
                      ? 'bg-[#16a34a] text-white'
                      : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#fafafa]',
                  )}
                >
                  {f === 'all' ? `All (${workflows.length})` : f === 'active' ? `Active (${activeCount})` : `Inactive (${inactiveCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e4e4e7] bg-[#fafafa]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#71717a]">Workflow name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#71717a]">Used by stores</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#71717a]">Used</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#71717a]">Resolved</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#71717a]">Escalated</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#71717a]">Rating</th>
                  <th className="px-4 py-3 text-xs font-medium text-[#71717a] text-center">Enabled</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#a1a1aa]">
                      No workflows match your search.
                    </td>
                  </tr>
                ) : filtered.map(w => (
                  <tr key={w.id} className="border-b border-[#e4e4e7] last:border-0 hover:bg-[#fafafa] transition-colors">
                    {/* Name */}
                    <td className="px-5 py-3.5">
                      <Link
                        href="/evo-ai/workflows/create"
                        className="text-sm font-semibold text-[#18181b] hover:text-[#16a34a] transition-colors"
                      >
                        {w.name}
                      </Link>
                    </td>

                    {/* Used by stores */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#18181b] rounded-full"
                            style={{ width: `${(w.usedByStores.active / w.usedByStores.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#18181b] tabular-nums font-medium">
                          {w.usedByStores.active}<span className="text-[#a1a1aa] font-normal">/{w.usedByStores.total}</span>
                        </span>
                      </div>
                    </td>

                    {/* Used */}
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-medium text-[#18181b] tabular-nums">
                        {w.used > 0 ? w.used.toLocaleString() : <span className="text-[#a1a1aa]">—</span>}
                      </span>
                    </td>

                    {/* Resolved */}
                    <td className="px-4 py-3.5 text-right">
                      {w.resolved > 0
                        ? <span className="text-sm font-medium text-[#16a34a] tabular-nums">{w.resolved}%</span>
                        : <span className="text-sm text-[#a1a1aa]">—</span>}
                    </td>

                    {/* Escalated */}
                    <td className="px-4 py-3.5 text-right">
                      {w.escalated > 0
                        ? <span className="text-sm font-medium text-[#d97706] tabular-nums">{w.escalated}%</span>
                        : <span className="text-sm text-[#a1a1aa]">—</span>}
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3.5 text-right">
                      {w.rating !== null
                        ? <span className={cn(
                            'text-sm font-medium tabular-nums',
                            w.rating >= 4.5 ? 'text-[#16a34a]' : w.rating >= 4.0 ? 'text-[#d97706]' : 'text-[#dc2626]'
                          )}>★ {w.rating}</span>
                        : <span className="text-sm text-[#a1a1aa]">—</span>}
                    </td>

                    {/* Enable/disable toggle */}
                    <td className="px-4 py-3.5">
                      <div className="flex justify-center">
                        <Toggle enabled={w.status === 'active'} onToggle={() => toggleStatus(w.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          </> /* end support tab */}

        </div>
      </main>
    </div>
  );
}

export default function WorkflowsPage() {
  return (
    <Suspense>
      <WorkflowsContent />
    </Suspense>
  );
}
