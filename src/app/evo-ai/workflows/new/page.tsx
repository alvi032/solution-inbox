'use client';

import Link from 'next/link';
import AppSidebar from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  RotateCcw,
  XCircle,
  ArrowLeftRight,
  Truck,
  Sparkles,
  RefreshCw,
  GitBranch,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    name: 'Refund Handling',
    icon: RotateCcw,
    iconBg: 'bg-[#eff6ff]',
    iconColor: 'text-[#2563eb]',
    desc: 'Guide customers through refund requests with eligibility checks and resolution options.',
  },
  {
    name: 'Order Cancellation',
    icon: XCircle,
    iconBg: 'bg-[#fef2f2]',
    iconColor: 'text-[#dc2626]',
    desc: 'Handle cancellation requests before fulfilment with automated confirmations.',
  },
  {
    name: 'Return & Exchange',
    icon: ArrowLeftRight,
    iconBg: 'bg-[#f0fdf4]',
    iconColor: 'text-[#16a34a]',
    desc: 'Manage return windows, exchange options, and shipping label generation.',
  },
  {
    name: 'Shipping Inquiry',
    icon: Truck,
    iconBg: 'bg-[#fff7ed]',
    iconColor: 'text-[#ea580c]',
    desc: 'Answer shipping status questions and escalate delays to the fulfilment team.',
  },
  {
    name: 'Product Recommendation',
    icon: Sparkles,
    iconBg: 'bg-[#fdf4ff]',
    iconColor: 'text-[#9333ea]',
    desc: 'Suggest products based on customer context, preferences, and order history.',
  },
  {
    name: 'Subscription Management',
    icon: RefreshCw,
    iconBg: 'bg-[#f0f9ff]',
    iconColor: 'text-[#0284c7]',
    desc: 'Handle pause, cancel, and upgrade requests for subscription orders.',
  },
];

const EXISTING_WORKFLOWS = [
  { name: 'Refund Handling Flow', active: true },
  { name: 'Order Cancellation', active: true },
  { name: 'Return & Exchange', active: true },
  { name: 'Shipping Inquiry', active: true },
  { name: 'Product Recommendation', active: false },
  { name: 'Subscription Management', active: false },
];

// ─── Page ─────────────────────────────────────────────────────────────

export default function NewWorkflowPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar forceCollapsed />

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-8 py-10">

          {/* Back link */}
          <Link
            href="/evo-ai/workflows"
            className="inline-flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#18181b] transition-colors mb-6"
          >
            <ArrowLeft size={13} />
            Back to Workflows
          </Link>

          {/* Header */}
          <h1 className="text-2xl font-semibold text-[#18181b]">New Workflow</h1>
          <p className="text-sm text-[#71717a] mt-1 mb-10">
            Choose how you&apos;d like to get started.
          </p>

          <div className="space-y-10">

            {/* ── Section 1: Start from scratch ── */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-3">
                Start from scratch
              </p>

              <Link
                href="/evo-ai/workflows/create"
                className="flex items-center gap-5 px-6 py-5 bg-white border border-[#e4e4e7] rounded-xl hover:border-[#a1a1aa] hover:shadow-sm transition-all cursor-pointer group"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-[#3f3f46]" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#18181b]">Blank Workflow</p>
                  <p className="text-xs text-[#71717a] mt-0.5">
                    Start with an empty canvas and define your own steps and guardrails.
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={16}
                  className="text-[#a1a1aa] group-hover:text-[#18181b] transition-colors shrink-0"
                />
              </Link>
            </div>

            {/* ── Section 2: Start from a template ── */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-3">
                Start from a template
              </p>

              <div className="grid grid-cols-3 gap-4">
                {TEMPLATES.map((tpl) => {
                  const Icon = tpl.icon;
                  return (
                    <Link
                      key={tpl.name}
                      href="/evo-ai/workflows/create"
                      className="bg-white border border-[#e4e4e7] rounded-xl p-5 hover:border-[#a1a1aa] hover:shadow-sm transition-all cursor-pointer group flex flex-col gap-3"
                    >
                      {/* Top row: icon + name */}
                      <div className="flex items-center gap-3">
                        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', tpl.iconBg)}>
                          <Icon size={16} className={tpl.iconColor} />
                        </div>
                        <p className="text-sm font-semibold text-[#18181b] leading-snug">{tpl.name}</p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#71717a] leading-relaxed flex-1">{tpl.desc}</p>

                      {/* CTA */}
                      <p className="text-xs font-medium text-[#7c3aed] group-hover:underline mt-auto">
                        Use template →
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Section 3: Inherit from existing ── */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-1">
                Inherit from an existing workflow
              </p>
              <p className="text-xs text-[#a1a1aa] mb-3">
                Copy an existing workflow and customise it — useful for store-specific variations.
              </p>

              <div className="bg-white border border-[#e4e4e7] rounded-xl overflow-hidden">
                {EXISTING_WORKFLOWS.map((wf) => (
                  <Link
                    key={wf.name}
                    href="/evo-ai/workflows/create"
                    className="flex items-center gap-3 px-5 py-3.5 border-b border-[#f4f4f5] last:border-0 hover:bg-[#fafafa] transition-colors group cursor-pointer"
                  >
                    {/* Icon */}
                    <GitBranch size={14} className="text-[#a1a1aa] shrink-0" />

                    {/* Name */}
                    <span className="text-sm text-[#18181b] flex-1">{wf.name}</span>

                    {/* Status badge */}
                    {wf.active ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]">
                        Inactive
                      </span>
                    )}

                    {/* Clone CTA */}
                    <span className="text-xs text-[#7c3aed] opacity-0 group-hover:opacity-100 transition-opacity font-medium ml-3 shrink-0">
                      Clone &amp; edit →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
