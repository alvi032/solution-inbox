'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppSidebar from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, ShoppingBag, Mail, MessageSquare, Globe,
  Check, ChevronDown, Store, ExternalLink, Sparkles, MoreHorizontal,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────

const BRANDS = ['TBS', 'Nike', 'DBS'];

const REGIONS = [
  { flag: '🇺🇸', name: 'United States', tz: 'GMT−05:00 Eastern',        currency: 'USD ($)' },
  { flag: '🇬🇧', name: 'United Kingdom', tz: 'GMT+00:00 Greenwich',       currency: 'GBP (£)' },
  { flag: '🇪🇺', name: 'Europe',          tz: 'GMT+01:00 Central European', currency: 'EUR (€)' },
  { flag: '🇦🇪', name: 'UAE',             tz: 'GMT+04:00 Gulf Standard',    currency: 'AED (د.إ)' },
  { flag: '🇸🇬', name: 'Singapore',       tz: 'GMT+08:00 Singapore',        currency: 'SGD (S$)' },
  { flag: '🇦🇺', name: 'Australia',       tz: 'GMT+10:00 AET',              currency: 'AUD (A$)' },
  { flag: '🇨🇦', name: 'Canada',          tz: 'GMT−05:00 Eastern',          currency: 'CAD (C$)' },
];

const INTEGRATIONS = [
  { id: 'shopify',   name: 'Shopify',   icon: ShoppingBag },
  { id: 'email',     name: 'Email',     icon: Mail },
  { id: 'whatsapp',  name: 'WhatsApp',  icon: MessageSquare },
  { id: 'instagram', name: 'Instagram', icon: Globe },
  { id: 'facebook',  name: 'Facebook',  icon: Globe },
];

const WORKFLOWS = [
  { id: 'order-status',     name: 'Order Status Update',       type: 'Support' },
  { id: 'return-refund',    name: 'Return & Refund Handler',   type: 'Support' },
  { id: 'shipping-delay',   name: 'Shipping Delay Alert',      type: 'Support' },
  { id: 'product-inquiry',  name: 'Product Inquiry Response',  type: 'Support' },
  { id: 'abandoned-cart',   name: 'Abandoned Cart Recovery',   type: 'Sales'   },
  { id: 'post-purchase',    name: 'Post-Purchase Follow-up',   type: 'Sales'   },
];

// ─── Small shared components ──────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-semibold text-[#71717a] uppercase tracking-wider mb-1.5">
      {children}{required && <span className="text-[#dc2626] ml-0.5 normal-case tracking-normal">*</span>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-[#e4e4e7] px-3 py-2 text-sm text-[#18181b] placeholder:text-[#d4d4d8] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/10 transition-colors bg-white"
    />
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'relative w-8 h-4 rounded-full transition-colors shrink-0',
        enabled ? 'bg-[#16a34a]' : 'bg-[#e4e4e7]',
      )}
    >
      <span className={cn(
        'absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform',
        enabled ? 'translate-x-4' : 'translate-x-0',
      )} />
    </button>
  );
}

function Dropdown<T extends string>({
  value, onChange, options, placeholder,
}: {
  value: T; onChange: (v: T) => void;
  options: { value: T; label: string; dividerAfter?: boolean; dim?: boolean }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find(o => o.value === value);

  const filtered = options.filter(o =>
    o.value.startsWith('__') || o.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between rounded-lg border border-[#e4e4e7] px-3 py-2 text-sm text-left bg-white hover:border-[#a1a1aa] transition-colors"
      >
        <span className={selected ? 'text-[#18181b]' : 'text-[#d4d4d8]'}>
          {selected?.label ?? placeholder ?? 'Select…'}
        </span>
        <ChevronDown size={12} className={cn('text-[#a1a1aa] transition-transform shrink-0', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e4e4e7] rounded-xl shadow-lg z-30 overflow-hidden">
          <div className="p-2 border-b border-[#f4f4f5]">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full px-2 py-1.5 text-xs rounded-md border border-[#e4e4e7] outline-none focus:border-[#7c3aed] bg-white placeholder:text-[#a1a1aa]"
            />
          </div>
          <div className="max-h-44 overflow-y-auto py-1">
            {filtered.map((opt, i) => (
              <div key={opt.value}>
                {i > 0 && filtered[i - 1].dividerAfter && (
                  <div className="border-t border-[#f4f4f5] my-1" />
                )}
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); setQuery(''); }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors hover:bg-[#fafafa]',
                    opt.dim ? 'text-[#71717a]' : 'text-[#18181b]',
                  )}
                >
                  {opt.label}
                  {value === opt.value && <Check size={11} className="text-[#7c3aed] shrink-0" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────

// ─── Add Brand Modal ──────────────────────────────────────────────────

function AddBrandModal({ onSave, onClose }: { onSave: (name: string) => void; onClose: () => void }) {
  const [name, setName] = useState('');

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl w-[360px] p-6">
        <p className="text-sm font-semibold text-[#18181b] mb-1">Add New Brand</p>
        <p className="text-xs text-[#71717a] mb-4">Enter a name for the new brand.</p>

        <label className="block text-[11px] font-semibold text-[#71717a] uppercase tracking-wider mb-1.5">
          Brand Name<span className="text-[#dc2626] ml-0.5 normal-case tracking-normal">*</span>
        </label>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onClose(); }}
          placeholder="e.g. Nike"
          className="w-full rounded-lg border border-[#e4e4e7] px-3 py-2 text-sm text-[#18181b] placeholder:text-[#d4d4d8] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/10 transition-colors mb-5"
        />

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add Brand
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────

export default function NewStorePage() {
  const router = useRouter();
  const [isAltOnboarding, setIsAltOnboarding] = useState(false);
  const [storeName, setStoreName]   = useState('');
  const [storeUrl, setStoreUrl]     = useState('');
  const [brands, setBrands]         = useState<string[]>(BRANDS);
  const [brand, setBrand]           = useState('');
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [regionKey, setRegionKey]   = useState('');
  const [active, setActive]           = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsAltOnboarding(params.get('onboarding') === 'alt');
  }, []);
  // configured = has been set up; integEnabled = active/inactive (only for configured)
  const [configured, setConfigured]   = useState<string[]>(['shopify']);
  const [integEnabled, setIntegEnabled] = useState<string[]>(['shopify']);
  const [workflowsOpen, setWorkflowsOpen] = useState(false);
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>(WORKFLOWS.map(w => w.id));

  const region = REGIONS.find(r => r.name === regionKey) ?? null;

  function configureIntegration(id: string) {
    setConfigured(prev => prev.includes(id) ? prev : [...prev, id]);
    setIntegEnabled(prev => prev.includes(id) ? prev : [...prev, id]);
  }

  function toggleIntegEnabled(id: string) {
    setIntegEnabled(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  function toggleWorkflow(id: string) {
    setSelectedWorkflows(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  }

  function toggleAllWorkflows() {
    setSelectedWorkflows(prev => prev.length === WORKFLOWS.length ? [] : WORKFLOWS.map(w => w.id));
  }

  function handleBrandChange(value: string) {
    if (value === '__new__') { setShowAddBrand(true); return; }
    setBrand(value);
  }

  function handleAddBrand(name: string) {
    setBrands(prev => [...prev, name]);
    setBrand(name);
    setShowAddBrand(false);
  }

  function handleSaveStore() {
    if (isAltOnboarding) {
      router.push('/onboarding/alt?completed=connect');
    } else {
      router.push('/store-management');
    }
  }

  const backHref = isAltOnboarding ? '/store-management?onboarding=alt' : '/store-management';

  const brandOptions = [
    ...brands.map((b, i) => ({ value: b, label: b, dividerAfter: i === brands.length - 1 })),
    { value: '__new__',    label: '+ Add New Brand',  dim: true },
    { value: '__manage__', label: 'Manage Brands',    dim: true },
  ] as { value: string; label: string; dividerAfter?: boolean; dim?: boolean }[];

  const regionOptions = REGIONS.map(r => ({ value: r.name, label: `${r.flag} ${r.name}` }));

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── Header ── */}
        <header className="flex items-center gap-4 px-6 py-3 border-b border-[#e4e4e7] bg-white shrink-0">
          <Link href={backHref} className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#18181b] transition-colors shrink-0">
            <ArrowLeft size={13} />
            {isAltOnboarding ? 'Back' : 'Stores'}
          </Link>
          <div className="w-px h-4 bg-[#e4e4e7]" />
          <span className="text-sm font-semibold text-[#18181b]">Add New Store</span>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Link href={backHref} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] transition-colors">
              Cancel
            </Link>
            <button
              onClick={handleSaveStore}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors"
            >
              {isAltOnboarding ? 'Connect Store' : 'Save Store'}
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto bg-[#fafafa]">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex gap-5 items-start">

              {/* ── LEFT COLUMN ── */}
              <div className="flex-1 min-w-0 space-y-4">

                {/* Section 1: Store Details */}
                <div className="bg-white rounded-xl border border-[#e4e4e7] p-4">
                  <p className="text-xs font-semibold text-[#18181b] uppercase tracking-wider mb-3">Store Details</p>
                  <div className="space-y-3">
                    {/* Name + Status row */}
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <FieldLabel required>Store Name</FieldLabel>
                        <TextInput value={storeName} onChange={setStoreName} placeholder="e.g. TBS US Store" />
                      </div>
                      <div className="shrink-0 pb-2">
                        <div className="flex items-center gap-2">
                          <Toggle enabled={active} onChange={() => setActive(v => !v)} />
                          <span className="text-xs text-[#71717a]">{active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                    </div>

                    {/* URL */}
                    <div>
                      <FieldLabel required>Store URL</FieldLabel>
                      <div className="flex rounded-lg border border-[#e4e4e7] overflow-hidden focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/10 transition-colors bg-white">
                        <span className="flex items-center px-3 border-r border-[#e4e4e7] bg-[#fafafa] text-xs text-[#a1a1aa] shrink-0">
                          https://
                        </span>
                        <input
                          type="text"
                          value={storeUrl}
                          onChange={e => setStoreUrl(e.target.value)}
                          placeholder="yourstore.com"
                          className="flex-1 px-3 py-2 text-sm text-[#18181b] placeholder:text-[#d4d4d8] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Brand & Location */}
                <div className="bg-white rounded-xl border border-[#e4e4e7] p-4">
                  <p className="text-xs font-semibold text-[#18181b] uppercase tracking-wider mb-3">Brand & Location</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel required>Brand</FieldLabel>
                      <Dropdown value={brand} onChange={handleBrandChange} options={brandOptions} placeholder="Select brand" />
                    </div>
                    <div>
                      <FieldLabel required>Region</FieldLabel>
                      <Dropdown value={regionKey} onChange={setRegionKey} options={regionOptions} placeholder="Select region" />
                    </div>

                    {region && (
                      <>
                        <div>
                          <FieldLabel>Time Zone</FieldLabel>
                          <div className="rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-xs text-[#71717a]">
                            {region.tz}
                          </div>
                        </div>
                        <div>
                          <FieldLabel>Currency</FieldLabel>
                          <div className="rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-xs text-[#71717a]">
                            {region.currency}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Section 3: Integrations */}
                <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden">
                  <p className="text-xs font-semibold text-[#18181b] uppercase tracking-wider px-4 pt-3 pb-2">Integrations</p>
                  <div className="divide-y divide-[#f4f4f5]">
                    {INTEGRATIONS.map(integration => {
                      const Icon = integration.icon;
                      const isCfg = configured.includes(integration.id);
                      const isOn  = integEnabled.includes(integration.id);
                      return (
                        <div key={integration.id} className="flex items-center gap-3 px-4 py-2.5">
                          {/* Icon + Name */}
                          <Icon size={13} className={isCfg ? 'text-[#7c3aed] shrink-0' : 'text-[#a1a1aa] shrink-0'} />
                          <span className={cn('text-xs font-medium flex-1 min-w-0 truncate', isCfg ? 'text-[#18181b]' : 'text-[#71717a]')}>
                            {integration.name}
                          </span>

                          {/* Configure (unconfigured) OR options + toggle (configured) */}
                          {isCfg ? (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                className="w-6 h-6 flex items-center justify-center rounded-md text-[#a1a1aa] hover:text-[#71717a] hover:bg-[#f4f4f5] transition-colors"
                                title="Options"
                              >
                                <MoreHorizontal size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleIntegEnabled(integration.id)}
                                className={cn(
                                  'relative w-7 h-4 rounded-full transition-colors',
                                  isOn ? 'bg-[#7c3aed]' : 'bg-[#e4e4e7]',
                                )}
                              >
                                <span className={cn(
                                  'absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform',
                                  isOn ? 'translate-x-3' : 'translate-x-0',
                                )} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => configureIntegration(integration.id)}
                              className="text-[11px] font-medium text-[#7c3aed] hover:text-[#6d28d9] transition-colors shrink-0"
                            >
                              Configure
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Workflow Setup */}
                <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden">
                  {/* Header — always visible */}
                  <button
                    type="button"
                    onClick={() => setWorkflowsOpen(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#fafafa] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-[#18181b] uppercase tracking-wider">Workflow Setup</p>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                        {selectedWorkflows.length} / {WORKFLOWS.length} selected
                      </span>
                    </div>
                    <ChevronDown size={13} className={cn('text-[#a1a1aa] transition-transform shrink-0', workflowsOpen && 'rotate-180')} />
                  </button>

                  {/* Expandable workflow list */}
                  {workflowsOpen && (
                    <div className="border-t border-[#f4f4f5]">
                      {/* Select all row */}
                      <button
                        type="button"
                        onClick={toggleAllWorkflows}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#fafafa] transition-colors border-b border-[#f4f4f5]"
                      >
                        <div className={cn(
                          'w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors',
                          selectedWorkflows.length === WORKFLOWS.length
                            ? 'bg-[#18181b] border-[#18181b]'
                            : selectedWorkflows.length > 0
                            ? 'bg-[#18181b] border-[#18181b]'
                            : 'border-[#d4d4d8]',
                        )}>
                          {selectedWorkflows.length === WORKFLOWS.length ? (
                            <Check size={9} className="text-white" strokeWidth={3} />
                          ) : selectedWorkflows.length > 0 ? (
                            <div className="w-1.5 h-px bg-white" />
                          ) : null}
                        </div>
                        <span className="text-xs font-medium text-[#18181b]">Select all</span>
                      </button>

                      {/* Individual workflows */}
                      {WORKFLOWS.map(wf => {
                        const checked = selectedWorkflows.includes(wf.id);
                        return (
                          <button
                            key={wf.id}
                            type="button"
                            onClick={() => toggleWorkflow(wf.id)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#fafafa] transition-colors group"
                          >
                            <div className={cn(
                              'w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors',
                              checked ? 'bg-[#18181b] border-[#18181b]' : 'border-[#d4d4d8] group-hover:border-[#a1a1aa]',
                            )}>
                              {checked && <Check size={9} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className="flex-1 text-xs text-left text-[#3f3f46]">{wf.name}</span>
                            <span className={cn(
                              'text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0',
                              wf.type === 'Support'
                                ? 'bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]'
                                : 'bg-[#fdf4ff] text-[#a855f7] border-[#e9d5ff]',
                            )}>
                              {wf.type}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* ── RIGHT COLUMN — sticky summary ── */}
              <div className="w-[280px] shrink-0 sticky top-0 space-y-3">

                {/* Preview card */}
                <div className="bg-white rounded-xl border border-[#e4e4e7] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">Preview</p>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#f4f4f5] text-[#a1a1aa] border border-[#e4e4e7]">
                      Draft
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#18181b] flex items-center justify-center shrink-0">
                      <Store size={18} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#18181b] truncate leading-tight">
                        {storeName || <span className="text-[#d4d4d8] font-normal">Store name</span>}
                      </p>
                      <p className="text-xs text-[#a1a1aa] truncate mt-0.5">
                        {storeUrl ? `https://${storeUrl}` : <span className="text-[#d4d4d8]">yourstore.com</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <span className={cn(
                      'inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border',
                      active
                        ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]'
                        : 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]',
                    )}>
                      <span className={cn('w-1 h-1 rounded-full', active ? 'bg-[#16a34a]' : 'bg-[#a1a1aa]')} />
                      {active ? 'Active' : 'Inactive'}
                    </span>
                    {selectedWorkflows.length > 0 && (
                      <span className="inline-flex text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#6d28d9] border border-[#ddd6fe]">
                        {selectedWorkflows.length} workflow{selectedWorkflows.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Key details */}
                <div className="bg-white rounded-xl border border-[#e4e4e7] p-4">
                  <p className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider mb-2.5">Details</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Brand',    value: brand || '—' },
                      { label: 'Region',   value: region ? `${region.flag} ${region.name}` : '—' },
                      { label: 'Timezone', value: region ? region.tz : '—' },
                      { label: 'Currency', value: region ? region.currency : '—' },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#a1a1aa] shrink-0">{row.label}</span>
                        <span className="text-[11px] text-[#18181b] font-medium text-right truncate">{row.value}</span>
                      </div>
                    ))}
                    {storeUrl && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#a1a1aa] shrink-0">URL</span>
                        <a href={`https://${storeUrl}`} target="_blank" rel="noreferrer"
                          className="text-[11px] text-[#7c3aed] hover:underline flex items-center gap-0.5 truncate">
                          {storeUrl} <ExternalLink size={9} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Integrations summary */}
                  {configured.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#f4f4f5]">
                      <p className="text-[11px] text-[#a1a1aa] mb-1.5">Integrations</p>
                      <div className="flex flex-wrap gap-1">
                        {configured.map(id => {
                          const cfg = INTEGRATIONS.find(i => i.id === id);
                          if (!cfg) return null;
                          const Icon = cfg.icon;
                          return (
                            <span key={id} className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#f4f4f5] border border-[#e4e4e7] text-[#3f3f46]">
                              <Icon size={9} />
                              {cfg.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* What happens next */}
                <div className="bg-[#faf5ff] rounded-xl border border-[#ddd6fe] p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Sparkles size={13} className="text-[#7c3aed] shrink-0" />
                    <p className="text-[11px] font-semibold text-[#6d28d9] uppercase tracking-wider">What happens next</p>
                  </div>
                  <ul className="space-y-1.5">
                    {[
                      'Store is created and activated',
                      'Selected integrations are connected',
                      selectedWorkflows.length > 0
                        ? `${selectedWorkflows.length} workflow${selectedWorkflows.length !== 1 ? 's' : ''} inherited and activated`
                        : 'No workflows configured — set up later',
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-[#6d28d9] leading-snug">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#7c3aed]/15 flex items-center justify-center shrink-0 mt-px text-[9px] font-bold text-[#7c3aed]">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Add Brand Modal */}
      {showAddBrand && (
        <AddBrandModal
          onSave={handleAddBrand}
          onClose={() => setShowAddBrand(false)}
        />
      )}
    </div>
  );
}
