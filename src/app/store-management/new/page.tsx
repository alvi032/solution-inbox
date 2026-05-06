'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppSidebar from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, ShoppingBag, Mail, MessageSquare, Globe,
  Check, ChevronDown, Store, ExternalLink, Sparkles,
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

export default function NewStorePage() {
  const [storeName, setStoreName]   = useState('');
  const [storeUrl, setStoreUrl]     = useState('');
  const [brand, setBrand]           = useState('');
  const [regionKey, setRegionKey]   = useState('');
  const [active, setActive]         = useState(true);
  const [integrations, setIntegrations] = useState<string[]>(['shopify']);
  const [workflow, setWorkflow]     = useState<'inherit' | 'separate'>('inherit');

  const region = REGIONS.find(r => r.name === regionKey) ?? null;

  function toggleIntegration(id: string) {
    setIntegrations(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  const brandOptions = [
    ...BRANDS.map(b => ({ value: b, label: b, dividerAfter: b === BRANDS[BRANDS.length - 1] })),
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
          <Link href="/store-management" className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#18181b] transition-colors shrink-0">
            <ArrowLeft size={13} />
            Stores
          </Link>
          <div className="w-px h-4 bg-[#e4e4e7]" />
          <span className="text-sm font-semibold text-[#18181b]">Add New Store</span>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Link href="/store-management" className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] transition-colors">
              Cancel
            </Link>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors">
              Save Store
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
                      <Dropdown value={brand} onChange={setBrand} options={brandOptions} placeholder="Select brand" />
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
                <div className="bg-white rounded-xl border border-[#e4e4e7] p-4">
                  <p className="text-xs font-semibold text-[#18181b] uppercase tracking-wider mb-3">Integrations</p>
                  <div className="grid grid-cols-3 gap-2">
                    {INTEGRATIONS.map(integration => {
                      const Icon = integration.icon;
                      const enabled = integrations.includes(integration.id);
                      return (
                        <button
                          key={integration.id}
                          type="button"
                          onClick={() => toggleIntegration(integration.id)}
                          className={cn(
                            'flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-left transition-colors',
                            enabled
                              ? 'border-[#7c3aed] bg-[#faf5ff]'
                              : 'border-[#e4e4e7] hover:border-[#a1a1aa] bg-white',
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon size={13} className={enabled ? 'text-[#7c3aed]' : 'text-[#a1a1aa]'} />
                            <span className={cn('text-xs font-medium truncate', enabled ? 'text-[#7c3aed]' : 'text-[#3f3f46]')}>
                              {integration.name}
                            </span>
                          </div>
                          <div className={cn(
                            'relative w-6 h-3.5 rounded-full transition-colors shrink-0',
                            enabled ? 'bg-[#7c3aed]' : 'bg-[#e4e4e7]',
                          )}>
                            <span className={cn(
                              'absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full shadow-sm transition-transform',
                              enabled ? 'translate-x-2.5' : 'translate-x-0',
                            )} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Workflow Setup */}
                <div className="bg-white rounded-xl border border-[#e4e4e7] p-4">
                  <p className="text-xs font-semibold text-[#18181b] uppercase tracking-wider mb-3">Workflow Setup</p>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { value: 'inherit',  label: 'Inherit from brand',    hint: 'Uses brand-level workflows automatically.' },
                      { value: 'separate', label: 'Configure separately',  hint: 'Set up independent store-specific workflows.' },
                    ] as const).map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setWorkflow(opt.value)}
                        className={cn(
                          'flex items-start gap-2.5 p-3 rounded-lg border-2 text-left transition-colors',
                          workflow === opt.value
                            ? 'border-[#18181b] bg-[#fafafa]'
                            : 'border-[#e4e4e7] hover:border-[#a1a1aa]',
                        )}
                      >
                        <div className={cn(
                          'w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                          workflow === opt.value ? 'border-[#18181b]' : 'border-[#d4d4d8]',
                        )}>
                          {workflow === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-[#18181b]" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#18181b]">{opt.label}</p>
                          <p className="text-[11px] text-[#71717a] mt-0.5 leading-snug">{opt.hint}</p>
                        </div>
                      </button>
                    ))}
                  </div>
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
                    {workflow === 'inherit' && (
                      <span className="inline-flex text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#6d28d9] border border-[#ddd6fe]">
                        Inherited
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
                  {integrations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#f4f4f5]">
                      <p className="text-[11px] text-[#a1a1aa] mb-1.5">Integrations</p>
                      <div className="flex flex-wrap gap-1">
                        {integrations.map(id => {
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
                      workflow === 'inherit'
                        ? 'Brand workflows applied automatically'
                        : 'Workflow editor opens for configuration',
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
    </div>
  );
}
