'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import AppSidebar from '@/components/app-sidebar';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Store,
  MessageSquare,
  Search,
  Sparkles,
  Zap,
  ArrowRight,
  X,
  Send,
  BookOpen,
  GitBranch,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type StepKey = 'connect' | 'select-goal' | 'pricing' | 'configure' | 'test-golive' | 'unlock';

const STEPS: { key: StepKey; number: number; title: string; description: string }[] = [
  {
    key: 'connect',
    number: 1,
    title: 'Connect Store',
    description: 'Link your e-commerce platform so EVO AI can access your catalog, orders, and customer data.',
  },
  {
    key: 'select-goal',
    number: 2,
    title: 'Select Goal / App',
    description: 'Choose which capability you want to set up first.',
  },
  {
    key: 'pricing',
    number: 3,
    title: 'Choose a Plan',
    description: 'All plans include a 30-day free trial. No credit card required to start.',
  },
  {
    key: 'configure',
    number: 4,
    title: 'Complete App-Specific Setup',
    description: 'Configure your selected app with the settings that match your business.',
  },
  {
    key: 'test-golive',
    number: 5,
    title: 'Test and Go Live',
    description: 'Preview your setup and activate it for real customers.',
  },
  {
    key: 'unlock',
    number: 6,
    title: 'Unlock Additional Capabilities',
    description: 'Add more EVO AI apps to grow your business further.',
  },
];

// ─── Step row ─────────────────────────────────────────────────────────────────

function StepRow({
  step,
  status,
  isExpanded,
  onToggle,
  children,
}: {
  step: typeof STEPS[0];
  status: 'done' | 'active' | 'locked';
  isExpanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn(
      'rounded-2xl border transition-all',
      status === 'done'   ? 'border-[#e4e4e7] bg-white'      :
      status === 'active' ? 'border-[#18181b] bg-white shadow-sm' :
                            'border-[#e4e4e7] bg-[#fafafa] opacity-50'
    )}>
      <button
        onClick={status !== 'locked' ? onToggle : undefined}
        disabled={status === 'locked'}
        className="w-full flex items-center gap-4 px-6 py-5 text-left"
      >
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors',
          status === 'done'   ? 'bg-[#18181b] border-[#18181b]' :
          status === 'active' ? 'border-[#18181b] bg-white'     :
                                'border-[#d4d4d8] bg-white'
        )}>
          {status === 'done'
            ? <Check size={14} className="text-white" strokeWidth={2.5} />
            : <span className={cn('text-xs font-bold', status === 'active' ? 'text-[#18181b]' : 'text-[#a1a1aa]')}>{step.number}</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-semibold',
            status === 'done' ? 'text-[#71717a] line-through' :
            status === 'active' ? 'text-[#18181b]' : 'text-[#a1a1aa]'
          )}>
            {step.title}
          </p>
          {(status === 'active' || isExpanded) && status !== 'locked' && (
            <p className="text-xs text-[#71717a] mt-0.5 leading-relaxed">{step.description}</p>
          )}
        </div>

        {status === 'done' && (
          <span className="text-[11px] font-medium text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-full shrink-0">
            Complete
          </span>
        )}
        {status === 'active' && !isExpanded && (
          <span className="text-[11px] font-medium text-[#18181b] bg-[#f4f4f5] px-2 py-0.5 rounded-full shrink-0">
            In progress
          </span>
        )}

        {status !== 'locked' && (
          <ChevronDown size={15} className={cn('text-[#a1a1aa] transition-transform shrink-0', isExpanded && 'rotate-180')} />
        )}
      </button>

      {isExpanded && status !== 'locked' && children && (
        <div className="px-6 pb-6 pt-0 border-t border-[#f4f4f5]">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Step 1: Connect Store ────────────────────────────────────────────────────

function ConnectStorePanel() {
  return (
    <div className="pt-4">
      <p className="text-sm text-[#71717a] mb-5 leading-relaxed max-w-lg">
        Connect your e-commerce store to give EVO AI access to your product catalog, order history, and customer data. This powers all AI capabilities.
      </p>
      <Link
        href="/store-management?onboarding=alt"
        className="inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors"
      >
        <Store size={14} />
        Add Your First Store
        <ChevronRight size={13} />
      </Link>
    </div>
  );
}

// ─── Step 2: Select Goal ──────────────────────────────────────────────────────

const GOALS = [
  {
    key: 'support-agent',
    icon: <MessageSquare size={18} className="text-[#18181b]" />,
    tag: 'Support Agent',
    tagColor: 'bg-[#18181b] text-white',
    heading: 'Reduce your support tickets',
    desc: 'AI agents that resolve customer questions instantly, 24/7.',
    comingSoon: false,
  },
  {
    key: 'evo-search',
    icon: <Search size={18} className="text-[#18181b]" />,
    tag: 'Evo Search',
    tagColor: 'bg-[#18181b] text-white',
    heading: 'Improve product discovery',
    desc: 'AI search that helps shoppers find what they need.',
    comingSoon: false,
  },
  {
    key: 'quizzes',
    icon: <Sparkles size={18} className="text-[#a1a1aa]" />,
    tag: 'Quizzes',
    tagColor: 'bg-[#f4f4f5] text-[#a1a1aa] border border-[#e4e4e7]',
    heading: 'Personalized shopping experience',
    desc: 'Quizzes that recommend the right product for every shopper.',
    comingSoon: true,
  },
];

function SelectGoalPanel({ onSelect }: { onSelect: (goal: string) => void }) {
  return (
    <div className="pt-4">
      <p className="text-sm text-[#71717a] mb-5">Choose the capability you want to activate first.</p>
      <div className="grid grid-cols-3 gap-3 max-w-2xl">
        {GOALS.map(g => (
          <button
            key={g.key}
            onClick={g.comingSoon ? undefined : () => onSelect(g.key)}
            disabled={g.comingSoon}
            className={cn(
              'relative flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all',
              g.comingSoon
                ? 'border-[#e4e4e7] bg-[#fafafa] opacity-60 cursor-default'
                : 'border-[#e4e4e7] bg-[#fafafa] hover:border-[#18181b] hover:bg-white hover:shadow-sm cursor-pointer'
            )}
          >
            {g.comingSoon && (
              <span className="absolute top-3 right-3 text-[9px] font-semibold uppercase tracking-wider text-[#a1a1aa] bg-[#f4f4f5] border border-[#e4e4e7] px-1.5 py-0.5 rounded-full">
                Soon
              </span>
            )}
            <div className="w-9 h-9 rounded-xl bg-white border border-[#e4e4e7] flex items-center justify-center shrink-0">
              {g.icon}
            </div>
            <div>
              <span className={cn('inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full mb-1.5', g.tagColor)}>
                {g.tag}
              </span>
              <p className="text-xs font-semibold text-[#18181b] leading-snug">{g.heading}</p>
              <p className="text-[11px] text-[#71717a] mt-1 leading-relaxed">{g.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Pricing ─────────────────────────────────────────────────────────

const PLANS = [
  {
    name: 'Starter',
    price: '$49',
    period: '/ store / mo',
    description: 'For small stores getting started with AI support.',
    features: [
      'Up to 500 tickets / month',
      '3 pre-built workflows',
      'Email support',
      'Basic analytics',
    ],
    cta: 'Start free trial',
    popular: false,
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$149',
    period: '/ store / mo',
    description: 'For scaling brands that need more power and flexibility.',
    features: [
      'Up to 5,000 tickets / month',
      'Unlimited workflows',
      'Priority support',
      'Advanced analytics',
      'Custom AI tone & branding',
    ],
    cta: 'Start free trial',
    popular: true,
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '/ store',
    description: 'For large teams with high volume and enterprise requirements.',
    features: [
      'Unlimited tickets',
      'Dedicated success manager',
      'SLA & uptime guarantee',
      'SSO & advanced security',
      'Custom integrations',
    ],
    cta: 'Contact sales',
    popular: false,
    highlight: false,
  },
];

function PricingPanel({ onSelect }: { onSelect: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="pt-4">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm text-[#71717a]">All plans include a</p>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-full">
          <Check size={10} strokeWidth={3} />
          30-day free trial
        </span>
      </div>
      <p className="text-xs text-[#a1a1aa] mb-5">Pricing is per store. No credit card required to start.</p>

      <div className="grid grid-cols-3 gap-3 max-w-3xl mb-5">
        {PLANS.map(plan => (
          <button
            key={plan.name}
            onClick={() => setSelected(plan.name)}
            className={cn(
              'relative flex flex-col items-start rounded-2xl border p-5 text-left transition-all',
              plan.highlight
                ? 'border-[#18181b] bg-[#18181b] text-white shadow-lg'
                : selected === plan.name
                ? 'border-[#18181b] bg-white shadow-sm'
                : 'border-[#e4e4e7] bg-white hover:border-[#a1a1aa] hover:shadow-sm'
            )}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-[#18181b] text-white px-3 py-1 rounded-full border-2 border-white">
                Most Popular
              </span>
            )}

            {/* Plan name */}
            <p className={cn('text-xs font-semibold uppercase tracking-wider mb-3', plan.highlight ? 'text-white/60' : 'text-[#a1a1aa]')}>
              {plan.name}
            </p>

            {/* Price */}
            <div className="flex flex-col mb-2">
              <span className={cn('text-3xl font-bold leading-none', plan.highlight ? 'text-white' : 'text-[#18181b]')}>
                {plan.price}
              </span>
              {plan.period && (
                <span className={cn('text-[11px] mt-1', plan.highlight ? 'text-white/50' : 'text-[#a1a1aa]')}>
                  {plan.period}
                </span>
              )}
            </div>

            <p className={cn('text-[11px] leading-relaxed mb-4', plan.highlight ? 'text-white/70' : 'text-[#71717a]')}>
              {plan.description}
            </p>

            {/* Features */}
            <ul className="flex flex-col gap-2 mb-5 w-full">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2">
                  <div className={cn(
                    'w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-px',
                    plan.highlight ? 'bg-white/20' : 'bg-[#f0fdf4]'
                  )}>
                    <Check size={9} strokeWidth={3} className={plan.highlight ? 'text-white' : 'text-[#16a34a]'} />
                  </div>
                  <span className={cn('text-[11px] leading-snug', plan.highlight ? 'text-white/80' : 'text-[#3f3f46]')}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            {/* Selected indicator */}
            {selected === plan.name && !plan.highlight && (
              <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#18181b] flex items-center justify-center">
                <Check size={10} className="text-white" strokeWidth={3} />
              </div>
            )}
            {plan.highlight && selected === plan.name && (
              <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Check size={10} className="text-white" strokeWidth={3} />
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={onSelect}
        disabled={!selected}
        className="inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {selected ? `Continue with ${selected}` : 'Select a plan to continue'}
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

// ─── Step 4: Configure (checklist) ───────────────────────────────────────────

type ItemStatus = 'pending' | 'done' | 'skipped';

interface SupportItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  // inline items have content; redirect items have href + ctaLabel
  content?: React.ReactNode;
  href?: string;
  ctaLabel?: string;
}

const SUPPORT_AGENT_ITEMS: SupportItem[] = [
  {
    id: 'inbox-config',
    title: 'Configure Support Inbox',
    description: 'Set your AI response language, tone of voice, and escalation threshold.',
    icon: <MessageSquare size={13} className="text-[#18181b]" />,
    content: (
      <div className="flex flex-col gap-2">
        {[
          { label: 'Response Language',    value: 'English (US)' },
          { label: 'Tone of Voice',        value: 'Friendly & Professional' },
          { label: 'Escalation Threshold', value: 'Medium' },
        ].map(s => (
          <div key={s.label} className="flex items-center justify-between rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-4 py-2.5">
            <span className="text-xs text-[#71717a]">{s.label}</span>
            <span className="text-xs font-medium text-[#18181b] bg-white border border-[#e4e4e7] rounded-md px-2.5 py-1">{s.value}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'knowledge-base',
    title: 'Import Knowledge Base',
    description: 'Add your FAQs, product guides, and help articles so EVO AI can answer customer questions accurately.',
    icon: <BookOpen size={13} className="text-[#18181b]" />,
    href: '/knowledge-base?onboarding=alt',
    ctaLabel: 'Go to Knowledge Base',
  },
  {
    id: 'import-workflows',
    title: 'Set Up Workflows',
    description: 'Create or import pre-built workflow templates for common support scenarios like refunds, order status, and returns.',
    icon: <GitBranch size={13} className="text-[#18181b]" />,
    href: '/evo-ai/workflows?onboarding=alt',
    ctaLabel: 'Go to Workflows',
  },
];

function ConfigurePanel({
  onComplete,
  externalCompleted = new Set<string>(),
}: {
  onComplete: () => void;
  externalCompleted?: Set<string>;
}) {
  const [expandedItem, setExpandedItem] = useState<string | null>('inbox-config');
  const [itemStatus, setItemStatus] = useState<Record<string, ItemStatus>>({
    'inbox-config':    'pending',
    'knowledge-base':  'pending',
    'import-workflows': 'pending',
  });

  // Sync externally-completed items (returned from KB / Workflows workspace)
  useEffect(() => {
    if (externalCompleted.size === 0) return;
    setItemStatus(prev => {
      const updated = { ...prev };
      let changed = false;
      externalCompleted.forEach(id => {
        if (updated[id] === 'pending') { updated[id] = 'done'; changed = true; }
      });
      if (!changed) return prev;
      const nextPending = SUPPORT_AGENT_ITEMS.find(i => updated[i.id] === 'pending');
      setExpandedItem(nextPending?.id ?? null);
      return updated;
    });
  }, [externalCompleted]);

  const allResolved = Object.values(itemStatus).every(s => s !== 'pending');

  function resolveItem(id: string, status: 'done' | 'skipped') {
    const updated = { ...itemStatus, [id]: status };
    setItemStatus(updated);
    const idx = SUPPORT_AGENT_ITEMS.findIndex(i => i.id === id);
    const next = SUPPORT_AGENT_ITEMS.slice(idx + 1).find(i => updated[i.id] === 'pending');
    setExpandedItem(next?.id ?? null);
  }

  return (
    <div className="pt-4">
      <p className="text-sm text-[#71717a] mb-4 max-w-lg">
        Work through each setup item below. You can skip any step and configure it later from Settings.
      </p>
      <div className="flex flex-col gap-2.5 mb-5 max-w-xl">
        {SUPPORT_AGENT_ITEMS.map(item => {
          const status = itemStatus[item.id];
          const isExpanded = expandedItem === item.id && status === 'pending';
          const isRedirect = !!item.href;
          return (
            <div
              key={item.id}
              className={cn(
                'rounded-xl border transition-all',
                status === 'done'    ? 'border-[#bbf7d0] bg-[#f0fdf4]'           :
                status === 'skipped' ? 'border-[#e4e4e7] bg-[#fafafa] opacity-60' :
                isExpanded           ? 'border-[#18181b] bg-white shadow-sm'      :
                                       'border-[#e4e4e7] bg-[#fafafa]'
              )}
            >
              <button
                onClick={() => status === 'pending' ? setExpandedItem(isExpanded ? null : item.id) : undefined}
                disabled={status !== 'pending'}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <div className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors',
                  status === 'done'    ? 'bg-[#16a34a] border-[#16a34a]' :
                  status === 'skipped' ? 'border-[#d4d4d8] bg-white'     :
                  isExpanded           ? 'border-[#18181b] bg-white'      :
                                         'border-[#d4d4d8] bg-white'
                )}>
                  {status === 'done'    && <Check size={10} className="text-white" strokeWidth={3} />}
                  {status === 'skipped' && <div className="w-1.5 h-px bg-[#a1a1aa]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-xs font-semibold',
                    status === 'done'    ? 'text-[#15803d]'             :
                    status === 'skipped' ? 'text-[#a1a1aa] line-through' :
                                           'text-[#18181b]'
                  )}>
                    {item.title}
                  </p>
                  {!isExpanded && status === 'pending' && (
                    <p className="text-[11px] text-[#a1a1aa] mt-0.5 truncate">{item.description}</p>
                  )}
                </div>
                {status === 'done'    && <span className="text-[11px] font-medium text-[#15803d] shrink-0">Done</span>}
                {status === 'skipped' && <span className="text-[11px] font-medium text-[#a1a1aa] shrink-0">Skipped</span>}
                {status === 'pending' && (
                  <ChevronDown size={13} className={cn('text-[#a1a1aa] transition-transform shrink-0', isExpanded && 'rotate-180')} />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-[#f4f4f5]">
                  <p className="text-xs text-[#71717a] mt-3 mb-3 leading-relaxed">{item.description}</p>

                  {isRedirect ? (
                    /* Redirect-type item: CTA that navigates to workspace */
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => resolveItem(item.id, 'skipped')}
                        className="text-xs font-medium text-[#a1a1aa] hover:text-[#71717a] transition-colors"
                      >
                        Skip for now
                      </button>
                      <Link
                        href={item.href!}
                        className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#18181b] text-white text-xs font-medium hover:bg-[#27272a] transition-colors"
                      >
                        {item.icon}
                        {item.ctaLabel}
                        <ChevronRight size={11} />
                      </Link>
                    </div>
                  ) : (
                    /* Inline item: show content + save/skip */
                    <>
                      {item.content}
                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={() => resolveItem(item.id, 'skipped')}
                          className="text-xs font-medium text-[#a1a1aa] hover:text-[#71717a] transition-colors"
                        >
                          Skip for now
                        </button>
                        <button
                          onClick={() => resolveItem(item.id, 'done')}
                          className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#18181b] text-white text-xs font-medium hover:bg-[#27272a] transition-colors"
                        >
                          <Check size={11} strokeWidth={2.5} />
                          Save & Continue
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allResolved && (
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors"
        >
          Continue to Testing
          <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

// ─── Step 4: Test & Go Live ───────────────────────────────────────────────────

type ChatMsg = { role: 'user' | 'bot'; text: string };

function TicketModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[480px] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[#f4f4f5]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[#a1a1aa]">#T-0001</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-full">Open</span>
            </div>
            <p className="text-sm font-semibold text-[#18181b]">Test conversation</p>
            <p className="text-xs text-[#a1a1aa] mt-0.5">Created just now · via Live Preview</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-3 divide-x divide-[#f4f4f5] border-b border-[#f4f4f5]">
          {[
            { label: 'Channel',  value: 'Live Preview' },
            { label: 'Priority', value: 'Normal' },
            { label: 'Assigned', value: 'EVO Agent' },
          ].map(m => (
            <div key={m.label} className="px-4 py-3">
              <p className="text-[10px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-0.5">{m.label}</p>
              <p className="text-xs font-medium text-[#18181b]">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Message thread */}
        <div className="px-5 py-4 flex flex-col gap-3 max-h-52 overflow-y-auto">
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#f4f4f5] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-[#71717a]">C</div>
            <div>
              <p className="text-[10px] text-[#a1a1aa] mb-1">Customer · just now</p>
              <div className="bg-[#f4f4f5] rounded-xl rounded-tl-sm px-3 py-2 text-xs text-[#18181b] inline-block">
                This is a test message from the Live Preview.
              </div>
            </div>
          </div>
          <div className="flex gap-2.5 flex-row-reverse">
            <div className="w-6 h-6 rounded-full bg-[#18181b] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-white">E</div>
            <div className="flex flex-col items-end">
              <p className="text-[10px] text-[#a1a1aa] mb-1">EVO Agent · just now</p>
              <div className="bg-[#18181b] rounded-xl rounded-tr-sm px-3 py-2 text-xs text-white inline-block">
                Got it! I've looked into that for you. Is there anything else I can help with?
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#f4f4f5] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] transition-colors">
            Close
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors">
            Open in Inbox
          </button>
        </div>
      </div>
    </div>
  );
}

function TestGoLivePanel({ onComplete }: { onComplete: () => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'bot', text: "Hi! I'm your EVO support agent. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [ticketCreated, setTicketCreated] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: "Got it! I've looked into that for you. Is there anything else I can help with?" },
      ]);
      setTicketCreated(true);
    }, 1400);
  }

  return (
    <div className="pt-4">
      <p className="text-sm text-[#71717a] mb-5 max-w-lg">
        Send a test message to see how your support agent responds and confirm tickets are being generated.
      </p>

      {/* Chat window */}
      <div className="rounded-xl border border-[#e4e4e7] bg-white overflow-hidden max-w-md mb-4">
        {/* Bar */}
        <div className="bg-[#18181b] px-4 py-2.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
          <span className="text-xs text-white/60">Support Agent · Live Preview</span>
        </div>

        {/* Messages */}
        <div className="p-4 flex flex-col gap-2.5 max-h-48 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'px-3 py-2 text-xs max-w-[80%] rounded-xl leading-relaxed',
                msg.role === 'user'
                  ? 'bg-[#18181b] text-white rounded-tr-sm'
                  : 'bg-[#f4f4f5] text-[#18181b] rounded-tl-sm'
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-[#f4f4f5] px-3 py-2.5 rounded-xl rounded-tl-sm flex items-center gap-1">
                {[0, 150, 300].map(delay => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 pb-3 border-t border-[#f4f4f5] pt-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a test message…"
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#e4e4e7] outline-none focus:border-[#18181b] placeholder:text-[#d4d4d8] bg-white"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-lg bg-[#18181b] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#27272a] transition-colors"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Ticket created */}
      {ticketCreated && (
        <div className="flex items-center gap-3 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 max-w-md mb-5">
          <div className="w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center shrink-0">
            <Check size={10} className="text-white" strokeWidth={3} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#15803d]">Ticket #T-0001 created</p>
            <p className="text-[11px] text-[#166534] mt-0.5">Your support agent is working correctly.</p>
          </div>
          <button
            onClick={() => setShowTicketModal(true)}
            className="text-[11px] font-medium text-[#15803d] underline underline-offset-2 hover:text-[#166534] transition-colors shrink-0"
          >
            View ticket
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-[#16a34a] text-white text-sm font-medium hover:bg-[#15803d] transition-colors"
        >
          <Zap size={13} />
          Go Live
        </button>
        <button
          onClick={onComplete}
          className="text-sm font-medium text-[#a1a1aa] hover:text-[#71717a] transition-colors"
        >
          Skip for now
        </button>
      </div>

      {showTicketModal && <TicketModal onClose={() => setShowTicketModal(false)} />}
    </div>
  );
}

// ─── Step 5: Unlock Additional Capabilities ───────────────────────────────────

const ADDONS = [
  {
    icon: <MessageSquare size={16} />,
    title: 'Sales Agent',
    desc: 'Proactively engage visitors with personalised offers. Includes sales-specific workflows and conversion tracking.',
    comingSoon: false,
  },
  {
    icon: <Sparkles size={16} />,
    title: 'Quizzes',
    desc: 'Guided product recommendation quizzes that boost conversion and average order value.',
    comingSoon: true,
  },
];

function UnlockPanel() {
  const router = useRouter();
  return (
    <div className="pt-4">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
          <Check size={18} className="text-[#16a34a]" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#18181b]">Support Agent is live!</p>
          <p className="text-xs text-[#71717a]">Want to add more capabilities while you're here?</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 max-w-xl mb-6">
        {ADDONS.map(addon => (
          <div
            key={addon.title}
            className={cn(
              'flex items-start gap-4 rounded-xl border p-4 transition-all',
              addon.comingSoon
                ? 'border-[#e4e4e7] bg-[#fafafa] opacity-50'
                : 'border-[#e4e4e7] bg-[#fafafa] hover:border-[#18181b] hover:bg-white hover:shadow-sm cursor-pointer'
            )}
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-[#e4e4e7] flex items-center justify-center text-[#18181b] shrink-0">
              {addon.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-semibold text-[#18181b]">{addon.title}</p>
                {addon.comingSoon && (
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-[#a1a1aa] bg-[#f4f4f5] border border-[#e4e4e7] px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#71717a] leading-relaxed">{addon.desc}</p>
            </div>
            {!addon.comingSoon && (
              <span className="text-[11px] font-medium text-[#18181b] flex items-center gap-1 shrink-0 mt-1">
                Set up <ArrowRight size={10} />
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/inbox')}
        className="inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors"
      >
        Complete Setup
        <ArrowRight size={13} />
      </button>
    </div>
  );
}

// ─── Inner page (uses useSearchParams) ───────────────────────────────────────

function AltOnboardingInner() {
  const searchParams = useSearchParams();
  const [completedSteps, setCompletedSteps] = useState<Set<StepKey>>(new Set());
  const [expandedStep, setExpandedStep] = useState<StepKey>('connect');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [completedConfigItems, setCompletedConfigItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const completed = searchParams.get('completed');

    if (completed === 'connect') {
      setCompletedSteps(prev => new Set([...prev, 'connect']));
      setExpandedStep('select-goal');
      setShowSuccessToast(true);
      const t = setTimeout(() => setShowSuccessToast(false), 4000);
      return () => clearTimeout(t);
    }

    if (completed === 'knowledge-base' || completed === 'workflows') {
      // Ensure prior steps are marked complete so configure step is accessible
      setCompletedSteps(prev => {
        const s = new Set(prev);
        (['connect', 'select-goal', 'pricing'] as StepKey[]).forEach(k => s.add(k));
        return s;
      });
      setExpandedStep('configure');
      setCompletedConfigItems(prev =>
        new Set([...prev, completed === 'knowledge-base' ? 'knowledge-base' : 'import-workflows'])
      );
    }
  }, [searchParams]);

  const markDone = (key: StepKey) => {
    setCompletedSteps(prev => new Set([...prev, key]));
    const idx = STEPS.findIndex(s => s.key === key);
    if (idx < STEPS.length - 1) setExpandedStep(STEPS[idx + 1].key);
  };

  const getStatus = (key: StepKey): 'done' | 'active' | 'locked' => {
    if (completedSteps.has(key)) return 'done';
    const idx = STEPS.findIndex(s => s.key === key);
    const prevKey = idx > 0 ? STEPS[idx - 1].key : null;
    if (prevKey === null || completedSteps.has(prevKey)) return 'active';
    return 'locked';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar altOnboarding />

      {/* Success toast */}
      {showSuccessToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#18181b] text-white text-sm px-4 py-3 rounded-xl shadow-lg">
          <div className="w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center shrink-0">
            <Check size={11} strokeWidth={3} />
          </div>
          <span>Store connected successfully!</span>
          <button onClick={() => setShowSuccessToast(false)} className="ml-1 text-white/50 hover:text-white transition-colors">
            <X size={13} />
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-3xl mx-auto px-8 py-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-[#18181b]">Welcome to EVO AI</h1>
            <p className="text-sm text-[#71717a] mt-1">Complete the steps below to activate your first capability.</p>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-1 mb-8">
            {STEPS.map(s => (
              <div
                key={s.key}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  completedSteps.has(s.key) ? 'bg-[#18181b]' :
                  getStatus(s.key) === 'active' ? 'bg-[#d4d4d8]' : 'bg-[#e4e4e7]'
                )}
              />
            ))}
          </div>

          {/* Checklist rows */}
          <div className="flex flex-col gap-3">
            {STEPS.map(step => {
              const status = getStatus(step.key);
              const isExpanded = expandedStep === step.key && status !== 'done';

              return (
                <StepRow
                  key={step.key}
                  step={step}
                  status={status}
                  isExpanded={isExpanded}
                  onToggle={() => setExpandedStep(isExpanded ? ('' as StepKey) : step.key)}
                >
                  {step.key === 'connect' && <ConnectStorePanel />}
                  {step.key === 'select-goal' && (
                    <SelectGoalPanel onSelect={(goal) => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('altOnboardingGoal', goal);
                        window.dispatchEvent(new CustomEvent('alt-onboarding-goal-set', { detail: goal }));
                      }
                      markDone('select-goal');
                    }} />
                  )}
                  {step.key === 'pricing' && (
                    <PricingPanel onSelect={() => markDone('pricing')} />
                  )}
                  {step.key === 'configure' && (
                    <ConfigurePanel
                      onComplete={() => markDone('configure')}
                      externalCompleted={completedConfigItems}
                    />
                  )}
                  {step.key === 'test-golive' && (
                    <TestGoLivePanel onComplete={() => markDone('test-golive')} />
                  )}
                  {step.key === 'unlock' && <UnlockPanel />}
                </StepRow>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AltOnboardingPage() {
  return (
    <Suspense>
      <AltOnboardingInner />
    </Suspense>
  );
}
