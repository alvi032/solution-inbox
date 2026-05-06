'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppSidebar from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, ShoppingBag, Mail, MessageSquare, Globe,
  Check, ChevronDown, Store,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────

const BRANDS = ['TBS', 'Nike', 'DBS'];

const REGIONS = [
  { flag: '🇺🇸', name: 'United States', tz: '(GMT−05:00) Eastern Time',   currency: 'USD ($)' },
  { flag: '🇬🇧', name: 'United Kingdom', tz: '(GMT+00:00) Greenwich Mean Time', currency: 'GBP (£)' },
  { flag: '🇪🇺', name: 'Europe',         tz: '(GMT+01:00) Central European Time', currency: 'EUR (€)' },
  { flag: '🇦🇪', name: 'UAE',            tz: '(GMT+04:00) Gulf Standard Time', currency: 'AED (د.إ)' },
  { flag: '🇸🇬', name: 'Singapore',      tz: '(GMT+08:00) Singapore Time', currency: 'SGD (S$)' },
  { flag: '🇦🇺', name: 'Australia',      tz: '(GMT+10:00) Australian Eastern Time', currency: 'AUD (A$)' },
  { flag: '🇨🇦', name: 'Canada',         tz: '(GMT−05:00) Eastern Time',   currency: 'CAD (C$)' },
];

const INTEGRATIONS = [
  { id: 'shopify',   name: 'Shopify',   description: 'Sync orders, products, and customers.', icon: ShoppingBag },
  { id: 'email',     name: 'Email',     description: 'Handle support via email inbox.',        icon: Mail },
  { id: 'whatsapp',  name: 'WhatsApp',  description: 'Connect WhatsApp Business API.',         icon: MessageSquare },
  { id: 'instagram', name: 'Instagram', description: 'Manage Instagram DMs.',                  icon: Globe },
  { id: 'facebook',  name: 'Facebook',  description: 'Connect Facebook Messenger.',            icon: Globe },
];

// ─── Shared components ────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden">
      {children}
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="px-6 py-4 border-b border-[#e4e4e7] bg-[#fafafa]">
      <p className="text-sm font-semibold text-[#18181b]">{title}</p>
      {description && <p className="text-xs text-[#71717a] mt-0.5">{description}</p>}
    </div>
  );
}

function Field({ label, required, children, hint }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#3f3f46] mb-1.5">
        {label}{required && <span className="text-[#dc2626] ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#a1a1aa] mt-1">{hint}</p>}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-[#e4e4e7] px-3 py-2 text-sm text-[#18181b] placeholder:text-[#a1a1aa] outline-none focus:border-[#18181b] focus:ring-2 focus:ring-[#18181b]/5 transition-colors"
    />
  );
}

function SelectInput<T extends string>({
  value, onChange, options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between rounded-lg border border-[#e4e4e7] px-3 py-2 text-sm text-left bg-white outline-none focus:border-[#18181b] hover:border-[#a1a1aa] transition-colors"
      >
        <span className={selected ? 'text-[#18181b]' : 'text-[#a1a1aa]'}>
          {selected?.label ?? 'Select…'}
        </span>
        <ChevronDown size={13} className={cn('text-[#a1a1aa] transition-transform shrink-0', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e4e4e7] rounded-xl shadow-lg z-20 py-1 max-h-52 overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-[#18181b] hover:bg-[#fafafa] transition-colors"
            >
              {opt.label}
              {value === opt.value && <Check size={12} className="text-[#16a34a] shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={onChange}
        className={cn(
          'relative w-9 h-5 rounded-full transition-colors shrink-0',
          enabled ? 'bg-[#16a34a]' : 'bg-[#e4e4e7]',
        )}
      >
        <span className={cn(
          'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform',
          enabled ? 'translate-x-4' : 'translate-x-0',
        )} />
      </button>
      {label && <span className="text-sm text-[#3f3f46]">{label}</span>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────

export default function NewStorePage() {
  // Store details
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [brand, setBrand] = useState('');
  const [regionIdx, setRegionIdx] = useState<number | null>(null);
  const [active, setActive] = useState(true);

  // Integrations
  const [enabledIntegrations, setEnabledIntegrations] = useState<string[]>([]);

  // Workflow setup
  const [workflowSetup, setWorkflowSetup] = useState<'inherit' | 'separate'>('inherit');

  const selectedRegion = regionIdx !== null ? REGIONS[regionIdx] : null;

  function toggleIntegration(id: string) {
    setEnabledIntegrations(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  }

  const regionOptions = REGIONS.map((r, i) => ({ value: String(i), label: `${r.flag} ${r.name}` }));

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[#fafafa]">

        {/* ── Header ── */}
        <header className="flex items-center gap-4 px-8 py-4 border-b border-[#e4e4e7] bg-white shrink-0">
          <Link
            href="/store-management"
            className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#18181b] transition-colors shrink-0"
          >
            <ArrowLeft size={14} />
            Back to Stores
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-[#18181b] leading-none">Add Store</h1>
            <p className="text-xs text-[#71717a] mt-0.5">Connect a new store to your brand.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/store-management"
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] hover:text-[#18181b] transition-colors"
            >
              Cancel
            </Link>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors">
              Create Store
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-8 space-y-6">

            {/* ── Store Details ── */}
            <SectionCard>
              <SectionHeader
                title="Store Details"
                description="Basic information about this store."
              />
              <div className="px-6 py-5 space-y-5">

                <Field label="Store name" required hint="This is how the store will appear across the platform.">
                  <TextInput
                    value={storeName}
                    onChange={setStoreName}
                    placeholder="e.g. TBS US Store"
                  />
                </Field>

                <Field label="Store URL" required hint="The primary domain for this store.">
                  <div className="flex rounded-lg border border-[#e4e4e7] overflow-hidden focus-within:border-[#18181b] focus-within:ring-2 focus-within:ring-[#18181b]/5 transition-colors">
                    <span className="flex items-center px-3 border-r border-[#e4e4e7] bg-[#fafafa] text-xs text-[#a1a1aa] shrink-0">
                      https://
                    </span>
                    <input
                      type="text"
                      value={storeUrl}
                      onChange={e => setStoreUrl(e.target.value)}
                      placeholder="yourstore.com"
                      className="flex-1 px-3 py-2 text-sm text-[#18181b] placeholder:text-[#a1a1aa] outline-none bg-white"
                    />
                  </div>
                </Field>

                <Field label="Status">
                  <Toggle enabled={active} onChange={() => setActive(v => !v)} label={active ? 'Active' : 'Inactive'} />
                </Field>

              </div>
            </SectionCard>

            {/* ── Brand & Location ── */}
            <SectionCard>
              <SectionHeader
                title="Brand & Location"
                description="Associate this store with a brand and set its regional settings."
              />
              <div className="px-6 py-5 space-y-5">

                <Field label="Brand" required>
                  <SelectInput
                    value={brand}
                    onChange={setBrand}
                    options={[
                      ...BRANDS.map(b => ({ value: b, label: b })),
                      { value: '__new__', label: '+ Create new brand' },
                    ]}
                  />
                </Field>

                <Field label="Region" required>
                  <SelectInput
                    value={regionIdx !== null ? String(regionIdx) : ''}
                    onChange={v => setRegionIdx(Number(v))}
                    options={regionOptions}
                  />
                </Field>

                {selectedRegion && (
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Time Zone">
                      <div className="rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#71717a]">
                        {selectedRegion.tz}
                      </div>
                    </Field>
                    <Field label="Currency">
                      <div className="rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-sm text-[#71717a]">
                        {selectedRegion.currency}
                      </div>
                    </Field>
                  </div>
                )}

              </div>
            </SectionCard>

            {/* ── Integrations ── */}
            <SectionCard>
              <SectionHeader
                title="Integrations"
                description="Choose which channels and platforms to connect to this store."
              />
              <div className="divide-y divide-[#f4f4f5]">
                {INTEGRATIONS.map(integration => {
                  const Icon = integration.icon;
                  const enabled = enabledIntegrations.includes(integration.id);
                  return (
                    <div
                      key={integration.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-[#fafafa] transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#f4f4f5] flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-[#3f3f46]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#18181b]">{integration.name}</p>
                        <p className="text-xs text-[#71717a]">{integration.description}</p>
                      </div>
                      <Toggle
                        enabled={enabled}
                        onChange={() => toggleIntegration(integration.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* ── Workflow Setup ── */}
            <SectionCard>
              <SectionHeader
                title="Workflow Setup"
                description="Choose how AI workflows should be configured for this store."
              />
              <div className="px-6 py-5 space-y-3">

                {/* Inherit option */}
                <button
                  type="button"
                  onClick={() => setWorkflowSetup('inherit')}
                  className={cn(
                    'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-colors',
                    workflowSetup === 'inherit'
                      ? 'border-[#18181b] bg-[#fafafa]'
                      : 'border-[#e4e4e7] hover:border-[#a1a1aa]',
                  )}
                >
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                    workflowSetup === 'inherit' ? 'border-[#18181b]' : 'border-[#d4d4d8]',
                  )}>
                    {workflowSetup === 'inherit' && (
                      <div className="w-2 h-2 rounded-full bg-[#18181b]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#18181b]">Inherit from brand</p>
                    <p className="text-xs text-[#71717a] mt-0.5 leading-relaxed">
                      This store will use the same workflows defined at the brand level. Any updates to brand workflows will automatically apply here.
                    </p>
                  </div>
                </button>

                {/* Separate option */}
                <button
                  type="button"
                  onClick={() => setWorkflowSetup('separate')}
                  className={cn(
                    'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-colors',
                    workflowSetup === 'separate'
                      ? 'border-[#18181b] bg-[#fafafa]'
                      : 'border-[#e4e4e7] hover:border-[#a1a1aa]',
                  )}
                >
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                    workflowSetup === 'separate' ? 'border-[#18181b]' : 'border-[#d4d4d8]',
                  )}>
                    {workflowSetup === 'separate' && (
                      <div className="w-2 h-2 rounded-full bg-[#18181b]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#18181b]">Configure separately</p>
                    <p className="text-xs text-[#71717a] mt-0.5 leading-relaxed">
                      Set up independent workflows for this store. Useful for stores with unique policies or regional requirements.
                    </p>
                  </div>
                </button>

              </div>
            </SectionCard>

            {/* Bottom spacer for scroll breathing room */}
            <div className="h-4" />

          </div>
        </div>

      </div>
    </div>
  );
}
