'use client';

import React, { useState, useRef, useEffect } from 'react';
import AppSidebar from '@/components/app-sidebar';
import Sidebar from '@/components/sidebar';
import { cn } from '@/lib/utils';
import {
  Plus, ArrowLeft, RotateCcw, Package, AlertCircle, RefreshCw,
  Repeat, Tag, Shield, Sparkles, GripVertical, Pencil, Trash2,
  Bot, Send, Download, Upload, Eye, Check, HelpCircle,
  TriangleAlert, X, ChevronDown,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface PlaybookStep {
  id: string;
  description: string;
}

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  template: string;
  trigger?: string;
  active: boolean;
  stepsCount: number;
  modified: string;
  steps?: PlaybookStep[];
  guardrails?: string[];
  selectedActions?: string[];
  selectedPolicies?: string[];
  courtesyWaiveReturn?: boolean;
  courtesyOfferFreebie?: boolean;
  maxCredit?: string;
}

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

// ── Static Data ───────────────────────────────────────────────────────────────

const TEMPLATES = [
  { id: 'return-refund', name: 'Return & Refund Handler', description: 'Handles return requests, refund processing, and exchange coordination', icon: RotateCcw },
  { id: 'delivery-issues', name: 'Order Delivery Issues', description: 'Handles tracking inquiries, shipping delays, and lost/misdelivered packages', icon: Package },
  { id: 'missing-item', name: 'Missing or Wrong Item Handler', description: 'Handles cases where customer received wrong items or items are missing from order', icon: AlertCircle },
  { id: 'order-changes', name: 'Order Changes', description: 'Handles order cancellations, address updates, and size/variant exchanges', icon: RefreshCw },
  { id: 'subscription', name: 'Subscription Manager', description: 'Manages subscription lifecycle: cancellations, pauses, modifications, billing issues', icon: Repeat },
  { id: 'discount', name: 'Discount & Promo Handler', description: 'Handles discount code issues, promotion inquiries, and creates courtesy discounts', icon: Tag },
  { id: 'defect-warranty', name: 'Product Defect & Warranty Handler', description: 'Handles product quality complaints, defect reports, and warranty claims', icon: Shield },
  { id: 'scratch', name: 'Start from scratch', description: 'Build a custom workflow', icon: Sparkles },
];

const TEMPLATE_STEPS: Record<string, PlaybookStep[]> = {
  'return-refund': [
    { id: '1', description: 'Check if the order is within the return window and meets return criteria.' },
    { id: '2', description: 'Ask the customer to select or describe their return reason.' },
    { id: '3', description: 'Present refund, exchange, or store credit options based on policy.' },
    { id: '4', description: 'Create and send a prepaid return shipping label via email.' },
    { id: '5', description: 'Summarise the resolution and confirm next steps with the customer.' },
  ],
  'delivery-issues': [
    { id: '1', description: 'Retrieve the order details and latest carrier tracking status.' },
    { id: '2', description: 'Determine if the package is delayed, lost, or delivered to wrong address.' },
    { id: '3', description: 'Initiate a carrier investigation for lost or significantly delayed packages.' },
    { id: '4', description: 'Reship, refund, or provide store credit depending on outcome.' },
  ],
  'missing-item': [
    { id: '1', description: 'Verify what items were ordered versus what the customer received.' },
    { id: '2', description: 'Request a photo of the package and received items for verification.' },
    { id: '3', description: 'Escalate to the fulfilment team if fraud risk is detected.' },
    { id: '4', description: 'Dispatch the missing item or issue a refund for the affected items.' },
  ],
  'order-changes': [
    { id: '1', description: 'Confirm if the order is still modifiable (not yet picked or shipped).' },
    { id: '2', description: 'Determine if the customer wants to cancel, change address, or swap variants.' },
    { id: '3', description: 'Process the change in the system or escalate to ops if order is locked.' },
    { id: '4', description: 'Send a confirmation of the change with updated order details.' },
  ],
  'subscription': [
    { id: '1', description: 'Look up the active subscription and understand what the customer wants.' },
    { id: '2', description: 'Suggest pausing, downgrading, or adjusting billing before cancelling.' },
    { id: '3', description: 'Apply the pause, modification, or cancellation to the subscription.' },
    { id: '4', description: 'Review and resolve any unexpected charges on the subscription.' },
    { id: '5', description: 'Send confirmation of the changes and explain what happens next.' },
  ],
  'discount': [
    { id: '1', description: 'Check if the code exists, is active, and applies to the customer\'s order.' },
    { id: '2', description: 'Determine if the issue is an expired code, minimum order not met, or exclusion.' },
    { id: '3', description: 'Apply a valid code or generate a one-time courtesy discount if appropriate.' },
    { id: '4', description: 'Confirm the discount has been applied and the customer is satisfied.' },
  ],
  'defect-warranty': [
    { id: '1', description: 'Collect details and photos of the defective product from the customer.' },
    { id: '2', description: 'Verify if the item is within warranty period and what the policy covers.' },
    { id: '3', description: 'Present available options based on warranty terms and defect severity.' },
    { id: '4', description: 'Route complex or high-value claims to the warranty team for review.' },
    { id: '5', description: 'Confirm the resolution and schedule follow-up if a repair is involved.' },
  ],
  'scratch': [{ id: '1', description: '' }],
};

const TEMPLATE_GUARDRAILS: Record<string, string[]> = {
  'return-refund': [
    'Never approve returns for items purchased more than 30 days ago',
    'Never process a refund without verifying order ownership',
    'Never bypass the return policy for international orders',
    'Never issue a refund amount exceeding the original order value',
  ],
  'delivery-issues': [
    'Never promise a specific delivery date without carrier confirmation',
    'Never reship an order without verifying the original has been lost',
    'Never share carrier investigation details with third parties',
  ],
  'subscription': [
    'Never cancel a subscription without confirming the customer\'s intent twice',
    'Never apply subscription discounts retroactively',
    'Never share subscription billing data outside the conversation',
  ],
  'scratch': [],
};

const AI_ACTION_CATEGORIES: { label: string; actions: string[] }[] = [
  {
    label: 'Orders',
    actions: [
      'Look up orders',
      'Cancel orders',
      'Create replacement orders',
      'Modify orders (add/remove items, change quantities, notes)',
      'Update shipping address',
      'Check tracking status',
    ],
  },
  {
    label: 'Returns & Refunds',
    actions: [
      'Handle returns (eligibility, labels, status)',
      'Process refunds',
      'Issue gift cards',
    ],
  },
  {
    label: 'Subscriptions & Discounts',
    actions: [
      'Manage subscriptions (pause, resume, update, cancel)',
      'Create discount codes',
    ],
  },
  {
    label: 'Products',
    actions: [
      'Check product inventory and availability',
      'Search products and find similar items',
      'Compare products side by side',
      'Cross-sell and product recommendations',
      'Browse and search within collections',
    ],
  },
  {
    label: 'Knowledge & Policies',
    actions: [
      'Search knowledge base',
      'Look up brand policies',
      'Check active advisories',
      'Access store highlights & promotions',
    ],
  },
  {
    label: 'Customer Management',
    actions: [
      'Tag orders/customers',
      'Manage customer profiles',
      'Verify customer identity (email OTP)',
      'Escalate to team',
      'Check approval request status',
    ],
  },
];

const AI_ACTIONS = AI_ACTION_CATEGORIES.flatMap(c => c.actions);

const POLICIES = [
  'Return Policy', 'Shipping Policy',
  'Cancellation Policy', 'Privacy Policy',
  'General Policy', 'Terms Of Service',
  'Warranty Policy',
];

const INITIAL_WORKFLOWS: WorkflowItem[] = [
  {
    id: '1',
    name: 'Return & Refund Handler',
    description: 'Handles return requests, refund processing, and exchange coordination',
    template: 'return-refund',
    active: true,
    stepsCount: 5,
    modified: '2 days ago',
    steps: TEMPLATE_STEPS['return-refund'],
    guardrails: TEMPLATE_GUARDRAILS['return-refund'],
    selectedActions: AI_ACTIONS,
    selectedPolicies: POLICIES,
    courtesyWaiveReturn: false,
    courtesyOfferFreebie: false,
    maxCredit: '0',
  },
  {
    id: '2',
    name: 'Order Delivery Issues',
    description: 'Handles tracking inquiries, shipping delays, and lost/misdelivered packages',
    template: 'delivery-issues',
    active: true,
    stepsCount: 4,
    modified: '1 week ago',
    steps: TEMPLATE_STEPS['delivery-issues'],
    guardrails: TEMPLATE_GUARDRAILS['delivery-issues'],
    selectedActions: AI_ACTIONS,
    selectedPolicies: POLICIES,
    courtesyWaiveReturn: false,
    courtesyOfferFreebie: false,
    maxCredit: '0',
  },
  {
    id: '3',
    name: 'Subscription Manager',
    description: 'Manages subscription lifecycle: cancellations, pauses, modifications, billing issues',
    template: 'subscription',
    active: false,
    stepsCount: 5,
    modified: '2 weeks ago',
    steps: TEMPLATE_STEPS['subscription'],
    guardrails: TEMPLATE_GUARDRAILS['subscription'],
    selectedActions: AI_ACTIONS,
    selectedPolicies: POLICIES,
    courtesyWaiveReturn: false,
    courtesyOfferFreebie: false,
    maxCredit: '0',
  },
];

const WIZARD_STEPS = ['Template', 'Details', 'Playbook & Guardrails', 'Actions & Rules', 'Summary'];

// ── Helper Components ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none',
        checked ? 'bg-[#18181b]' : 'bg-[#e4e4e7]'
      )}
    >
      <span className={cn(
        'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform',
        checked ? 'translate-x-4' : 'translate-x-1'
      )} />
    </button>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 shrink-0">
      {WIZARD_STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors',
                done ? 'bg-[#18181b] text-white' : active ? 'bg-[#18181b] text-white' : 'bg-[#f4f4f5] text-[#a1a1aa]'
              )}>
                {done ? <Check size={12} /> : step}
              </div>
              <span className={cn(
                'text-[11px] whitespace-nowrap',
                active ? 'text-[#18181b] font-medium' : done ? 'text-[#3f3f46]' : 'text-[#a1a1aa]'
              )}>{label}</span>
            </div>
            {i < WIZARD_STEPS.length - 1 && (
              <div className={cn('h-px w-8 mb-4 mx-1 shrink-0', done ? 'bg-[#18181b]' : 'bg-[#e4e4e7]')} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function SectionLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <span className="text-sm font-semibold text-[#18181b]">{children}</span>
      {hint && (
        <button type="button" title={hint} className="text-[#a1a1aa] hover:text-[#71717a]">
          <HelpCircle size={13} />
        </button>
      )}
    </div>
  );
}

// ── Chat Interface (shared by AI Panel + Preview Modal) ───────────────────────

function ChatInterface({ placeholder, systemPrompt, className, compact }: { placeholder: string; systemPrompt?: string; className?: string; compact?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    systemPrompt ? [{ role: 'ai', content: systemPrompt }] : []
  );
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Got it — I\'ve noted your request and will update the playbook accordingly. Is there anything else you\'d like to refine?',
      }]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  if (compact) {
    // compact layout used inside preview modal
    return (
      <div className={cn('flex flex-col', className)}>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <p className="text-xs text-[#a1a1aa] text-center mt-8">Send a message to test the workflow</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={cn('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start items-start')}>
              {m.role === 'ai' && (
                <div className="w-5 h-5 rounded-full bg-[#18181b] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={11} className="text-white" />
                </div>
              )}
              <div className={cn(
                'max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed',
                m.role === 'user' ? 'bg-[#18181b] text-white rounded-br-sm' : 'bg-[#f4f4f5] text-[#3f3f46] rounded-bl-sm'
              )}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="px-3 pb-3 pt-2 border-t border-[#e4e4e7]">
          <div className="flex items-end gap-2 rounded-xl border border-[#e4e4e7] bg-white px-3 py-2.5 shadow-sm">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 text-xs bg-transparent outline-none placeholder:text-[#a1a1aa] text-[#18181b] resize-none leading-relaxed"
              style={{ height: 'auto', minHeight: '18px' }}
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-[#18181b] text-white disabled:opacity-30 hover:bg-[#27272a] transition-colors shrink-0"
            >
              <Send size={10} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-5 text-center">
            <div className="w-8 h-8 rounded-full bg-[#18181b] flex items-center justify-center">
              <Bot size={15} className="text-white" />
            </div>
            <p className="text-xs text-[#71717a] leading-relaxed">Ask me anything about this workflow — I can suggest steps, write guardrails, or review your setup.</p>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={cn('flex gap-2.5', m.role === 'user' ? 'justify-end' : 'justify-start items-start')}>
                {m.role === 'ai' && (
                  <div className="w-5 h-5 rounded-full bg-[#18181b] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={11} className="text-white" />
                  </div>
                )}
                <div className={cn(
                  'max-w-[82%] text-xs leading-relaxed',
                  m.role === 'user'
                    ? 'bg-[#f4f4f5] text-[#18181b] rounded-2xl rounded-br-sm px-3 py-2'
                    : 'text-[#3f3f46]'
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-3 pb-3 pt-2 shrink-0">
        <div className="rounded-2xl border border-[#e4e4e7] bg-white shadow-sm overflow-hidden">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-3.5 pt-3 pb-2 text-xs bg-transparent outline-none placeholder:text-[#a1a1aa] text-[#18181b] resize-none leading-relaxed block"
            style={{ height: 'auto', minHeight: '40px' }}
          />
          <div className="flex items-center justify-end px-2.5 pb-2">
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#18181b] text-white disabled:opacity-25 hover:bg-[#27272a] transition-colors shrink-0"
            >
              <Send size={11} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-[#a1a1aa] text-center mt-2 leading-snug">
          AI can make mistakes. Double-check important details.
        </p>
      </div>
    </div>
  );
}

// ── Wizard Steps ──────────────────────────────────────────────────────────────

function TemplateCard({ t, selected, onSelect }: { t: typeof TEMPLATES[number]; selected: string; onSelect: (id: string) => void }) {
  const Icon = t.icon;
  const isSelected = selected === t.id;
  return (
    <button
      onClick={() => onSelect(t.id)}
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 text-left transition-all w-full',
        isSelected
          ? 'border-[#18181b] bg-[#fafafa] shadow-sm'
          : 'border-[#e4e4e7] bg-white hover:border-[#a1a1aa] hover:bg-[#fafafa]'
      )}
    >
      <div className={cn(
        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
        t.id === 'scratch' ? 'bg-[#f4f4f5]' : 'bg-[#fff1ee]'
      )}>
        <Icon size={16} className={t.id === 'scratch' ? 'text-[#71717a]' : 'text-[#e05c2e]'} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#18181b] leading-snug">{t.name}</p>
        <p className="text-xs text-[#71717a] mt-0.5 leading-relaxed">{t.description}</p>
      </div>
      {isSelected && (
        <div className="ml-auto shrink-0 w-4 h-4 rounded-full bg-[#18181b] flex items-center justify-center">
          <Check size={10} className="text-white" />
        </div>
      )}
    </button>
  );
}

function Step1Templates({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const templates = TEMPLATES.filter(t => t.id !== 'scratch');
  const scratch = TEMPLATES.find(t => t.id === 'scratch')!;

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <h2 className="text-sm font-semibold text-[#18181b] mb-4">Start from a template</h2>
      <div className="max-w-sm mb-6">
        <TemplateCard t={scratch} selected={selected} onSelect={onSelect} />
      </div>
      <div className="border-t border-[#e4e4e7] pt-5">
        <p className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wide mb-3">Or use a template</p>
        <div className="grid grid-cols-2 gap-3">
          {templates.map(t => (
            <TemplateCard key={t.id} t={t} selected={selected} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2Details({
  name, setName, description, setDescription, trigger, setTrigger,
}: {
  name: string; setName: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  trigger: string; setTrigger: (v: string) => void;
}) {
  return (
    <div className="p-8 max-w-2xl mx-auto w-full space-y-5">
      <div>
        <label className="text-xs font-medium text-[#18181b] block mb-1.5">Workflow name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Return & Refund Handler"
          className="w-full h-9 rounded-lg border border-[#e4e4e7] px-3 text-sm text-[#18181b] placeholder:text-[#a1a1aa] outline-none focus:border-[#a1a1aa] transition-colors"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-[#18181b] block mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Briefly describe what this workflow does…"
          rows={3}
          className="w-full rounded-lg border border-[#e4e4e7] px-3 py-2 text-sm text-[#18181b] placeholder:text-[#a1a1aa] outline-none focus:border-[#a1a1aa] resize-none transition-colors"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-[#18181b] block mb-1.5">When to activate this workflow</label>
        <textarea
          value={trigger}
          onChange={e => setTrigger(e.target.value)}
          placeholder="Describe the conditions that should trigger this workflow. e.g. When a customer mentions a return or refund request…"
          rows={3}
          className="w-full rounded-lg border border-[#e4e4e7] px-3 py-2 text-sm text-[#18181b] placeholder:text-[#a1a1aa] outline-none focus:border-[#a1a1aa] resize-none transition-colors"
        />
      </div>
    </div>
  );
}

interface StepItemProps {
  step: PlaybookStep;
  index: number;
  isDragging: boolean;
  onChange: (desc: string) => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

function PlaybookStepItem({ step, index, isDragging, onChange, onDelete, onDragStart, onDragOver, onDrop, onDragEnd }: StepItemProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        'flex items-start gap-3 rounded-xl border bg-white p-4 transition-all',
        isDragging ? 'opacity-40' : 'opacity-100 border-[#e4e4e7]'
      )}
    >
      <div className="shrink-0 cursor-grab active:cursor-grabbing text-[#c4c4c4] hover:text-[#71717a] mt-2 transition-colors">
        <GripVertical size={16} />
      </div>
      <div className="w-6 h-6 rounded-full bg-[#f4f4f5] flex items-center justify-center text-xs font-semibold text-[#3f3f46] shrink-0 mt-1.5">
        {index + 1}
      </div>
      <textarea
        value={step.description}
        onChange={e => onChange(e.target.value)}
        placeholder="Describe what the AI should do in this step…"
        rows={2}
        className="flex-1 rounded-md border border-[#e4e4e7] px-2.5 py-1.5 text-sm text-[#18181b] placeholder:text-[#a1a1aa] outline-none focus:border-[#a1a1aa] resize-none transition-colors"
      />
      <button
        onClick={onDelete}
        className="w-7 h-7 flex items-center justify-center rounded-md text-[#a1a1aa] hover:text-red-500 hover:bg-red-50 transition-colors mt-0.5 shrink-0"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

// ── Guardrails Section (internal helper) ──────────────────────────────────────

function GuardrailsSection({ guardrails, setGuardrails }: { guardrails: string[]; setGuardrails: (g: string[]) => void }) {
  const update = (i: number, val: string) => {
    const next = [...guardrails];
    next[i] = val;
    setGuardrails(next);
  };
  const remove = (i: number) => setGuardrails(guardrails.filter((_, idx) => idx !== i));
  const add = () => setGuardrails([...guardrails, '']);

  return (
    <div>
      <h2 className="text-sm font-semibold text-[#18181b]">Guardrails</h2>
      <p className="text-xs text-[#71717a] mt-1 mb-5">Define hard boundaries that the AI must never violate, regardless of customer requests or other instructions.</p>

      <div className="space-y-2">
        {guardrails.map((rule, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#e4e4e7]" />
            </div>
            <input
              value={rule}
              onChange={e => update(i, e.target.value)}
              placeholder="e.g. Never approve returns after 30 days"
              className="flex-1 h-9 rounded-lg border border-[#e4e4e7] px-3 text-sm text-[#18181b] placeholder:text-[#a1a1aa] outline-none focus:border-[#a1a1aa] transition-colors"
            />
            <button
              onClick={() => remove(i)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-[#a1a1aa] hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={add} className="mt-3 flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#18181b] transition-colors">
        <Plus size={13} />
        Add guardrail
      </button>
    </div>
  );
}

// ── Step 3: Combined Playbook & Guardrails ────────────────────────────────────

function Step3PlaybookGuardrails({
  steps, setSteps, guardrails, setGuardrails,
}: {
  steps: PlaybookStep[];
  setSteps: (s: PlaybookStep[]) => void;
  guardrails: string[];
  setGuardrails: (g: string[]) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addStep = () => {
    setSteps([...steps, { id: Date.now().toString(), description: '' }]);
  };

  const updateStep = (id: string, desc: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, description: desc } : s));
  };

  const deleteStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };
  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const reordered = [...steps];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setSteps(reordered);
    setDragIndex(null);
  };
  const handleDragEnd = () => setDragIndex(null);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      <div className="p-8">
        {/* Playbook section */}
        <div className="max-w-2xl w-full mx-auto">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-[#18181b]">Playbook</h2>
            <p className="text-xs text-[#71717a] mt-0.5">Define step-by-step instructions for the AI to follow.</p>
          </div>

          <div className="space-y-2">
            {steps.map((step, i) => (
              <PlaybookStepItem
                key={step.id}
                step={step}
                index={i}
                isDragging={dragIndex === i}
                onChange={(desc) => updateStep(step.id, desc)}
                onDelete={() => deleteStep(step.id)}
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={() => handleDrop(i)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>

          <button
            onClick={addStep}
            className="mt-3 flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#18181b] transition-colors"
          >
            <Plus size={13} />
            Add step
          </button>
        </div>

        {/* Guardrails section */}
        <div className="border-t border-[#e4e4e7] mt-8 pt-8 max-w-2xl mx-auto w-full">
          <GuardrailsSection guardrails={guardrails} setGuardrails={setGuardrails} />
        </div>
      </div>
    </div>
  );
}

function Step5Actions({
  selectedActions, setSelectedActions,
  selectedPolicies, setSelectedPolicies,
  courtesyWaiveReturn, setCourtesyWaiveReturn,
  courtesyOfferFreebie, setCourtesyOfferFreebie,
  maxCredit, setMaxCredit,
}: {
  selectedActions: string[]; setSelectedActions: (a: string[]) => void;
  selectedPolicies: string[]; setSelectedPolicies: (p: string[]) => void;
  courtesyWaiveReturn: boolean; setCourtesyWaiveReturn: (v: boolean) => void;
  courtesyOfferFreebie: boolean; setCourtesyOfferFreebie: (v: boolean) => void;
  maxCredit: string; setMaxCredit: (v: string) => void;
}) {
  const toggleAction = (a: string) =>
    setSelectedActions(selectedActions.includes(a) ? selectedActions.filter(x => x !== a) : [...selectedActions, a]);
  const togglePolicy = (p: string) =>
    setSelectedPolicies(selectedPolicies.includes(p) ? selectedPolicies.filter(x => x !== p) : [...selectedPolicies, p]);

  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set([AI_ACTION_CATEGORIES[0].label])
  );
  const toggleCategory = (label: string) =>
    setOpenCategories(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });

  return (
    <div className="p-8 max-w-2xl mx-auto w-full space-y-8">
      {/* Actions */}
      <div>
        <SectionLabel hint="Select what actions the AI is permitted to take when handling this workflow.">What can the AI do?</SectionLabel>
        <div className="rounded-xl border border-[#e4e4e7] overflow-hidden divide-y divide-[#e4e4e7]">
          {AI_ACTION_CATEGORIES.map((category, idx) => {
            const allSelected = category.actions.every(a => selectedActions.includes(a));
            const someSelected = category.actions.some(a => selectedActions.includes(a));
            const isOpen = openCategories.has(category.label);
            const toggleAll = () => {
              if (allSelected) {
                setSelectedActions(selectedActions.filter(a => !category.actions.includes(a)));
              } else {
                setSelectedActions(Array.from(new Set([...selectedActions, ...category.actions])));
              }
            };
            return (
              <div key={category.label}>
                <button
                  onClick={() => toggleCategory(category.label)}
                  className="w-full flex items-center gap-2.5 px-4 py-3 bg-[#fafafa] hover:bg-[#f4f4f5] transition-colors text-left"
                >
                  <ChevronDown
                    size={14}
                    className={cn('text-[#a1a1aa] transition-transform shrink-0', isOpen ? 'rotate-0' : '-rotate-90')}
                  />
                  <span className="text-sm font-medium text-[#18181b] flex-1">{category.label}</span>
                  {someSelected && (
                    <span className="text-[11px] font-medium text-[#3f3f46] bg-[#f4f4f5] rounded-full px-1.5 py-0.5">
                      {category.actions.filter(a => selectedActions.includes(a)).length}/{category.actions.length}
                    </span>
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-2 bg-white">
                    {/* Select all row */}
                    <label
                      className="flex items-center gap-2.5 py-2 border-b border-[#e4e4e7] mb-1 cursor-pointer group"
                      onClick={e => { e.preventDefault(); toggleAll(); }}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors',
                          allSelected
                            ? 'bg-[#18181b] border-[#18181b]'
                            : someSelected
                            ? 'bg-[#18181b] border-[#18181b]'
                            : 'border-[#d4d4d8] group-hover:border-[#a1a1aa]'
                        )}
                      >
                        {allSelected
                          ? <Check size={10} className="text-white" />
                          : someSelected
                          ? <div className="w-2 h-0.5 bg-white rounded-full" />
                          : null
                        }
                      </div>
                      <span className="text-sm font-medium text-[#3f3f46]">Select all</span>
                    </label>
                    {category.actions.map(action => (
                      <label key={action} className="flex items-center gap-2.5 py-2 border-b border-[#f4f4f5] last:border-0 cursor-pointer group">
                        <div
                          onClick={() => toggleAction(action)}
                          className={cn(
                            'w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors cursor-pointer',
                            selectedActions.includes(action) ? 'bg-[#18181b] border-[#18181b]' : 'border-[#d4d4d8] group-hover:border-[#a1a1aa]'
                          )}
                        >
                          {selectedActions.includes(action) && <Check size={10} className="text-white" />}
                        </div>
                        <span className="text-sm text-[#3f3f46] leading-snug">{action}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Policies */}
      <div>
        <SectionLabel hint="Select which policy documents the AI can reference in this workflow.">Which policies apply?</SectionLabel>
        <div className="grid grid-cols-2 gap-x-8 gap-y-0">
          {POLICIES.map(policy => (
            <label key={policy} className="flex items-start gap-2.5 py-2 border-b border-[#f4f4f5] cursor-pointer group">
              <div
                onClick={() => togglePolicy(policy)}
                className={cn(
                  'w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors cursor-pointer',
                  selectedPolicies.includes(policy) ? 'bg-[#18181b] border-[#18181b]' : 'border-[#d4d4d8] group-hover:border-[#a1a1aa]'
                )}
              >
                {selectedPolicies.includes(policy) && <Check size={10} className="text-white" />}
              </div>
              <span className="text-sm text-[#3f3f46]">{policy}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Courtesy & Flexibility */}
      <div>
        <SectionLabel hint="Define how much flexibility the AI has when resolving edge cases.">Courtesy & Flexibility</SectionLabel>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#18181b] font-medium">AI can waive the return requirement</p>
              <p className="text-xs text-[#71717a] mt-0.5">Let the AI approve a refund without requiring the item back</p>
            </div>
            <Toggle checked={courtesyWaiveReturn} onChange={setCourtesyWaiveReturn} />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#18181b] font-medium">AI can offer a freebie or sample</p>
              <p className="text-xs text-[#71717a] mt-0.5">Send a small gift to make up for a bad experience</p>
            </div>
            <Toggle checked={courtesyOfferFreebie} onChange={setCourtesyOfferFreebie} />
          </div>
          <div>
            <p className="text-sm font-medium text-[#18181b] mb-2">Maximum courtesy credit/discount</p>
            <div className="flex items-center h-9 w-32 rounded-lg border border-[#e4e4e7] overflow-hidden">
              <span className="px-2.5 text-sm text-[#3f3f46] border-r border-[#e4e4e7] h-full flex items-center bg-[#fafafa]">$</span>
              <input
                type="number"
                min="0"
                value={maxCredit}
                onChange={e => setMaxCredit(e.target.value)}
                className="flex-1 h-full px-2.5 text-sm text-[#18181b] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Targets */}
      <div>
        <SectionLabel hint="Define which team or agent should receive escalated tickets from this workflow.">Escalation targets</SectionLabel>
        <div className="flex items-center gap-2 text-xs text-[#a1a1aa] py-3 px-4 rounded-lg border border-[#e4e4e7] bg-[#fafafa]">
          <TriangleAlert size={13} className="shrink-0 text-[#f59e0b]" />
          No escalation targets configured yet.
        </div>
      </div>
    </div>
  );
}

type VerifyStatus = 'idle' | 'checking' | 'done';

interface VerifyFinding {
  type: 'overlap' | 'gap';
  severity: 'warning' | 'info';
  message: string;
}

function Step6Summary({
  name, description, trigger, template, steps, guardrails, selectedActions, selectedPolicies,
  existingWorkflows,
}: {
  name: string; description: string; trigger: string; template: string;
  steps: PlaybookStep[]; guardrails: string[]; selectedActions: string[]; selectedPolicies: string[];
  existingWorkflows: WorkflowItem[];
}) {
  const tpl = TEMPLATES.find(t => t.id === template);
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>('idle');
  const [findings, setFindings] = useState<VerifyFinding[]>([]);

  const runVerify = () => {
    setVerifyStatus('checking');
    setFindings([]);
    setTimeout(() => {
      const results: VerifyFinding[] = [];

      // Overlap detection: compare against existing workflows by template
      const overlapping = existingWorkflows.filter(w => w.template === template && w.name !== name);
      overlapping.forEach(w => {
        results.push({
          type: 'overlap',
          severity: 'warning',
          message: `This workflow overlaps with "${w.name}" — both handle the same scenario type. Consider merging or differentiating their triggers.`,
        });
      });
      if (overlapping.length === 0 && existingWorkflows.length > 0) {
        results.push({
          type: 'overlap',
          severity: 'info',
          message: 'No overlapping workflows detected. Triggers and scope appear distinct.',
        });
      }

      // Gap detection: heuristics on steps and guardrails
      if (steps.length < 3) {
        results.push({
          type: 'gap',
          severity: 'warning',
          message: 'Playbook has fewer than 3 steps. The AI may not have enough guidance to handle edge cases reliably.',
        });
      }
      if (guardrails.filter(Boolean).length === 0) {
        results.push({
          type: 'gap',
          severity: 'warning',
          message: 'No guardrails defined. Without hard limits, the AI may take unintended actions in edge cases.',
        });
      }
      if (!trigger) {
        results.push({
          type: 'gap',
          severity: 'warning',
          message: 'No activation trigger set. The workflow won\'t know when to activate automatically.',
        });
      }
      const hasEscalation = steps.some(s => /escalat/i.test(s.description)) || selectedActions.includes('Escalate to team');
      if (!hasEscalation) {
        results.push({
          type: 'gap',
          severity: 'info',
          message: 'No escalation path found in the playbook or actions. Consider adding a fallback escalation step for unresolved cases.',
        });
      }
      if (steps.length >= 3 && guardrails.filter(Boolean).length > 0 && trigger && hasEscalation) {
        results.push({
          type: 'gap',
          severity: 'info',
          message: 'Workflow coverage looks complete. No obvious gaps detected.',
        });
      }

      setFindings(results);
      setVerifyStatus('done');
    }, 1800);
  };

  const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="py-4 border-b border-[#f4f4f5] last:border-0">
      <p className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wide mb-2">{label}</p>
      {children}
    </div>
  );

  const warnings = findings.filter(f => f.severity === 'warning');

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-[#18181b]">Summary</h2>
          <p className="text-xs text-[#71717a] mt-0.5">Review your workflow before going live.</p>
        </div>
        <button
          onClick={runVerify}
          disabled={verifyStatus === 'checking'}
          className={cn(
            'flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-medium transition-colors',
            verifyStatus === 'checking'
              ? 'border-[#e4e4e7] text-[#a1a1aa] cursor-not-allowed'
              : verifyStatus === 'done'
              ? 'border-[#18181b] bg-[#18181b] text-white hover:bg-[#27272a]'
              : 'border-[#e4e4e7] text-[#3f3f46] hover:bg-[#f4f4f5]'
          )}
        >
          <Sparkles size={13} className={verifyStatus === 'checking' ? 'animate-pulse' : ''} />
          {verifyStatus === 'checking' ? 'Verifying…' : verifyStatus === 'done' ? 'Re-verify' : 'AI Verify'}
        </button>
      </div>

      {/* Verify results */}
      {verifyStatus === 'checking' && (
        <div className="mb-5 rounded-xl border border-[#e4e4e7] bg-[#fafafa] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full border-2 border-[#18181b] border-t-transparent animate-spin shrink-0" />
            <p className="text-sm text-[#3f3f46]">Analysing workflow for overlaps and gaps…</p>
          </div>
        </div>
      )}

      {verifyStatus === 'done' && findings.length > 0 && (
        <div className="mb-5 rounded-xl border border-[#e4e4e7] overflow-hidden">
          <div className="px-4 py-3 bg-[#fafafa] border-b border-[#e4e4e7] flex items-center gap-2">
            <Sparkles size={13} className="text-[#3f3f46]" />
            <span className="text-xs font-semibold text-[#18181b]">AI Verification</span>
            {warnings.length > 0 && (
              <span className="ml-auto text-[11px] font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                {warnings.length} issue{warnings.length > 1 ? 's' : ''} found
              </span>
            )}
            {warnings.length === 0 && (
              <span className="ml-auto text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                Looks good
              </span>
            )}
          </div>
          <div className="divide-y divide-[#f4f4f5]">
            {findings.map((f, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3 bg-white">
                <div className={cn(
                  'mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center',
                  f.severity === 'warning' ? 'bg-amber-50' : 'bg-[#f4f4f5]'
                )}>
                  {f.severity === 'warning'
                    ? <TriangleAlert size={11} className="text-amber-500" />
                    : <Check size={11} className="text-[#71717a]" />
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide mb-0.5 text-[#a1a1aa]">
                    {f.type === 'overlap' ? 'Overlap' : 'Gap'}
                  </p>
                  <p className="text-xs text-[#3f3f46] leading-relaxed">{f.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[#e4e4e7] bg-white overflow-hidden">
        <div className="px-5 py-4 bg-[#fafafa] border-b border-[#e4e4e7]">
          <div className="flex items-center gap-2.5">
            {tpl && <div className="w-8 h-8 rounded-lg bg-[#fff1ee] flex items-center justify-center shrink-0"><tpl.icon size={15} className="text-[#e05c2e]" /></div>}
            <div>
              <p className="text-sm font-semibold text-[#18181b]">{name || 'Untitled workflow'}</p>
              {description && <p className="text-xs text-[#71717a] mt-0.5">{description}</p>}
            </div>
          </div>
        </div>

        <div className="px-5">
          {trigger && (
            <Section label="Activation trigger">
              <p className="text-sm text-[#3f3f46]">{trigger}</p>
            </Section>
          )}

          <Section label={`Playbook · ${steps.length} steps`}>
            {steps.length === 0 ? (
              <p className="text-sm text-[#a1a1aa]">No steps defined</p>
            ) : (
              <ol className="space-y-1.5">
                {steps.map((s, i) => (
                  <li key={s.id} className="flex items-start gap-2 text-sm text-[#3f3f46]">
                    <span className="shrink-0 text-[#a1a1aa] tabular-nums">{i + 1}.</span>
                    <span>{s.description}</span>
                  </li>
                ))}
              </ol>
            )}
          </Section>

          {guardrails.filter(Boolean).length > 0 && (
            <Section label={`Guardrails · ${guardrails.filter(Boolean).length}`}>
              <ul className="space-y-1">
                {guardrails.filter(Boolean).map((g, i) => (
                  <li key={i} className="text-sm text-[#3f3f46] flex gap-2">
                    <span className="text-[#a1a1aa] shrink-0">—</span>{g}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {selectedActions.length > 0 && (
            <Section label={`AI Actions · ${selectedActions.length} enabled`}>
              <p className="text-sm text-[#3f3f46]">{selectedActions.slice(0, 3).join(', ')}{selectedActions.length > 3 ? ` +${selectedActions.length - 3} more` : ''}</p>
            </Section>
          )}

          {selectedPolicies.length > 0 && (
            <Section label={`Policies · ${selectedPolicies.length}`}>
              <p className="text-sm text-[#3f3f46]">{selectedPolicies.join(', ')}</p>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────

function PreviewModal({ workflowName, onClose }: { workflowName: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[420px] h-[580px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#e4e4e7]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e4e7]">
          <div>
            <p className="text-sm font-semibold text-[#18181b]">Preview workflow</p>
            <p className="text-xs text-[#71717a] mt-0.5">Testing: {workflowName || 'Untitled workflow'}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors">
            <X size={14} />
          </button>
        </div>
        <ChatInterface
          compact
          className="flex-1 min-h-0"
          placeholder="Ask a question to test the workflow…"
          systemPrompt="Hi! I'm ready to help. Ask me anything to test how this workflow handles customer requests."
        />
      </div>
    </div>
  );
}

// ── Persistent AI Panel ───────────────────────────────────────────────────────

function WorkflowAIPanel({ context }: { context: string }) {
  return (
    <div className="w-72 shrink-0 border-l border-[#e4e4e7] flex flex-col bg-white">
      {/* Header — dark, like Claude sidebar */}
      <div className="bg-[#18181b] px-4 py-3.5 shrink-0 flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <Bot size={11} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-white flex-1">AI Assistant</span>
      </div>
      <ChatInterface
        className="flex-1 min-h-0"
        placeholder="How can I help you today?"
        systemPrompt={context}
      />
    </div>
  );
}

// ── Wizard ────────────────────────────────────────────────────────────────────

function WorkflowWizard({ onBack, onFinish, existingWorkflows }: { onBack: () => void; onFinish: (w: Partial<WorkflowItem>) => void; existingWorkflows: WorkflowItem[] }) {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState('');
  const [playbookSteps, setPlaybookSteps] = useState<PlaybookStep[]>([{ id: '1', description: '' }]);
  const [guardrails, setGuardrails] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [courtesyWaiveReturn, setCourtesyWaiveReturn] = useState(false);
  const [courtesyOfferFreebie, setCourtesyOfferFreebie] = useState(false);
  const [maxCredit, setMaxCredit] = useState('0');
  const [previewOpen, setPreviewOpen] = useState(false);

  const selectTemplate = (id: string) => {
    setTemplate(id);
    const tpl = TEMPLATES.find(t => t.id === id);
    if (tpl && !name) setName(tpl.name);
    if (tpl && !description) setDescription(tpl.description);
    setPlaybookSteps(TEMPLATE_STEPS[id] || []);
    setGuardrails((TEMPLATE_GUARDRAILS[id] || []).map(g => g));
    setStep(2);
  };

  const goNext = () => setStep(s => Math.min(s + 1, 5));
  const goBack = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const finish = () => {
    onFinish({
      name: name || 'Untitled workflow',
      description,
      template,
      trigger,
      active: true,
      stepsCount: playbookSteps.length,
      modified: 'just now',
      steps: playbookSteps,
      guardrails,
      selectedActions,
      selectedPolicies,
      courtesyWaiveReturn,
      courtesyOfferFreebie,
      maxCredit,
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Wizard Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#e4e4e7] shrink-0">
        <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-[#3f3f46] hover:text-[#18181b] transition-colors">
          <ArrowLeft size={15} />
          {step === 1 ? 'Back to workflows' : 'Back'}
        </button>
        <StepIndicator current={step} />
        <div className="w-32" />
      </div>

      {/* Step Content + AI Panel */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={cn('flex-1 min-h-0', step === 3 ? 'overflow-y-auto flex flex-col' : 'overflow-y-auto')}>
          {step === 1 && <Step1Templates selected={template} onSelect={selectTemplate} />}
          {step === 2 && <Step2Details name={name} setName={setName} description={description} setDescription={setDescription} trigger={trigger} setTrigger={setTrigger} />}
          {step === 3 && <Step3PlaybookGuardrails steps={playbookSteps} setSteps={setPlaybookSteps} guardrails={guardrails} setGuardrails={setGuardrails} />}
          {step === 4 && <Step5Actions selectedActions={selectedActions} setSelectedActions={setSelectedActions} selectedPolicies={selectedPolicies} setSelectedPolicies={setSelectedPolicies} courtesyWaiveReturn={courtesyWaiveReturn} setCourtesyWaiveReturn={setCourtesyWaiveReturn} courtesyOfferFreebie={courtesyOfferFreebie} setCourtesyOfferFreebie={setCourtesyOfferFreebie} maxCredit={maxCredit} setMaxCredit={setMaxCredit} />}
          {step === 5 && <Step6Summary name={name} description={description} trigger={trigger} template={template} steps={playbookSteps} guardrails={guardrails} selectedActions={selectedActions} selectedPolicies={selectedPolicies} existingWorkflows={existingWorkflows} />}

          {/* Nav buttons — inline below step content */}
          {step > 1 && (
            <div className="max-w-2xl w-full mx-auto px-8 py-6 flex items-center justify-between shrink-0">
              <button onClick={goBack} className="h-8 px-4 rounded-lg border border-[#e4e4e7] text-sm text-[#3f3f46] hover:bg-[#f4f4f5] transition-colors">
                Back
              </button>
              <div className="flex items-center gap-2">
                {step === 5 && (
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="flex items-center gap-1.5 h-8 px-4 rounded-lg border border-[#e4e4e7] text-sm text-[#3f3f46] hover:bg-[#f4f4f5] transition-colors"
                  >
                    <Eye size={13} />
                    Preview
                  </button>
                )}
                {step < 5 && (
                  <button onClick={goNext} className="h-8 px-4 rounded-lg bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors">
                    Next
                  </button>
                )}
                {step === 5 && (
                  <button onClick={finish} className="h-8 px-4 rounded-lg bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors">
                    Finish
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <WorkflowAIPanel context="Hi! I'm here to help you build this workflow. I can suggest playbook steps, write guardrails, or answer questions about any part of the setup." />
      </div>

      {previewOpen && <PreviewModal workflowName={name} onClose={() => setPreviewOpen(false)} />}
    </div>
  );
}

// ── Edit View ─────────────────────────────────────────────────────────────────

function WorkflowEditView({ workflow, allWorkflows, onBack, onSave }: {
  workflow: WorkflowItem;
  allWorkflows: WorkflowItem[];
  onBack: () => void;
  onSave: (updated: WorkflowItem) => void;
}) {
  const [activeTab, setActiveTab] = useState<'details' | 'playbook' | 'actions' | 'summary'>('details');

  // Editable fields initialised from workflow prop, falling back to template data
  const [name, setName] = useState(workflow.name);
  const [description, setDescription] = useState(workflow.description);
  const [trigger, setTrigger] = useState(workflow.trigger || '');
  const [steps, setSteps] = useState<PlaybookStep[]>(
    workflow.steps || TEMPLATE_STEPS[workflow.template] || [{ id: '1', description: '' }]
  );
  const [guardrails, setGuardrails] = useState<string[]>(
    workflow.guardrails || TEMPLATE_GUARDRAILS[workflow.template] || []
  );
  const [selectedActions, setSelectedActions] = useState<string[]>(
    workflow.selectedActions || AI_ACTIONS
  );
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>(
    workflow.selectedPolicies || POLICIES
  );
  const [courtesyWaiveReturn, setCourtesyWaiveReturn] = useState(workflow.courtesyWaiveReturn ?? false);
  const [courtesyOfferFreebie, setCourtesyOfferFreebie] = useState(workflow.courtesyOfferFreebie ?? false);
  const [maxCredit, setMaxCredit] = useState(workflow.maxCredit ?? '0');

  const handleSave = () => {
    onSave({
      ...workflow,
      name,
      description,
      trigger,
      steps,
      guardrails,
      selectedActions,
      selectedPolicies,
      courtesyWaiveReturn,
      courtesyOfferFreebie,
      maxCredit,
      stepsCount: steps.length,
      modified: 'just now',
    });
  };

  const TABS: { id: typeof activeTab; label: string }[] = [
    { id: 'details', label: 'Details' },
    { id: 'playbook', label: 'Playbook & Guardrails' },
    { id: 'actions', label: 'Actions & Rules' },
    { id: 'summary', label: 'Summary' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-8 py-4 border-b border-[#e4e4e7] shrink-0">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-[#3f3f46] hover:text-[#18181b] transition-colors shrink-0"
          >
            <ArrowLeft size={15} />
            Back to workflows
          </button>
          <p className="text-sm font-semibold text-[#18181b] truncate">{name || 'Untitled workflow'}</p>
          <button
            onClick={handleSave}
            className="shrink-0 h-8 px-4 rounded-lg bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors"
          >
            Save changes
          </button>
        </div>
        {/* Tab bar */}
        <div className="flex items-center gap-1 mt-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'h-8 px-3 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-[#f4f4f5] text-[#18181b]'
                  : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#fafafa]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content + AI Panel */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
      <div className={cn('flex-1 min-h-0', activeTab === 'playbook' ? 'overflow-y-auto flex flex-col' : 'overflow-y-auto')}>
        {activeTab === 'details' && (
          <Step2Details
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            trigger={trigger}
            setTrigger={setTrigger}
          />
        )}
        {activeTab === 'playbook' && (
          <Step3PlaybookGuardrails
            steps={steps}
            setSteps={setSteps}
            guardrails={guardrails}
            setGuardrails={setGuardrails}
          />
        )}
        {activeTab === 'actions' && (
          <Step5Actions
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
            selectedPolicies={selectedPolicies}
            setSelectedPolicies={setSelectedPolicies}
            courtesyWaiveReturn={courtesyWaiveReturn}
            setCourtesyWaiveReturn={setCourtesyWaiveReturn}
            courtesyOfferFreebie={courtesyOfferFreebie}
            setCourtesyOfferFreebie={setCourtesyOfferFreebie}
            maxCredit={maxCredit}
            setMaxCredit={setMaxCredit}
          />
        )}
        {activeTab === 'summary' && (
          <Step6Summary
            name={name}
            description={description}
            trigger={trigger}
            template={workflow.template}
            steps={steps}
            guardrails={guardrails}
            selectedActions={selectedActions}
            selectedPolicies={selectedPolicies}
            existingWorkflows={allWorkflows}
          />
        )}
      </div>
      <WorkflowAIPanel context="Hi! I'm here to help you refine this workflow. Ask me to suggest improvements, rewrite guardrails, or review any part of the configuration." />
      </div>
    </div>
  );
}

// ── List View ─────────────────────────────────────────────────────────────────

function WorkflowList({ workflows, onCreate, onEdit, onToggle, onRemove }: {
  workflows: WorkflowItem[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[#e4e4e7] shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-[#18181b]">Support Workflows</h1>
            <p className="text-sm text-[#71717a] mt-1">Define how your AI handles support requests — returns, tracking, cancellations, and more.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#e4e4e7] text-sm text-[#3f3f46] hover:bg-[#f4f4f5] transition-colors">
              <Download size={13} />
              Export
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#e4e4e7] text-sm text-[#3f3f46] hover:bg-[#f4f4f5] transition-colors">
              <Upload size={13} />
              Import
            </button>
            <button onClick={onCreate} className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors">
              <Plus size={13} />
              Create
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        {workflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-sm text-[#71717a]">No workflows yet</p>
            <button onClick={onCreate} className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors">
              <Plus size={13} />
              Create your first workflow
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e4e4e7]">
                <th className="px-8 py-3 text-left text-[12px] leading-4 font-medium text-[#3f3f46]/70">Workflow</th>
                <th className="px-4 py-3 text-left text-[12px] leading-4 font-medium text-[#3f3f46]/70">Steps</th>
                <th className="px-4 py-3 text-left text-[12px] leading-4 font-medium text-[#3f3f46]/70">Status</th>
                <th className="px-4 py-3" />
                <th className="px-8 py-3 text-left text-[12px] leading-4 font-medium text-[#3f3f46]/70">Modified</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map(w => {
                const tpl = TEMPLATES.find(t => t.id === w.template);
                const Icon = tpl?.icon ?? Sparkles;
                return (
                  <tr key={w.id} className="border-b border-[#f4f4f5] hover:bg-[#fafafa] group transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#fff1ee] flex items-center justify-center shrink-0">
                          <Icon size={14} className="text-[#e05c2e]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#18181b]">{w.name}</p>
                          <p className="text-xs text-[#71717a] mt-0.5 max-w-sm truncate">{w.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[#3f3f46]">{w.stepsCount}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Toggle checked={w.active} onChange={() => onToggle(w.id)} />
                        <span className="text-xs text-[#71717a]">{w.active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(w.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-md text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => onRemove(w.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-md text-[#a1a1aa] hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm text-[#71717a]">{w.modified}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WorkflowsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState<'list' | 'wizard' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(INITIAL_WORKFLOWS);

  const handleFinish = (w: Partial<WorkflowItem>) => {
    setWorkflows(prev => [...prev, {
      id: Date.now().toString(),
      name: w.name || 'Untitled workflow',
      description: w.description || '',
      template: w.template || 'scratch',
      trigger: w.trigger,
      active: true,
      stepsCount: w.stepsCount || 0,
      modified: 'just now',
      steps: w.steps,
      guardrails: w.guardrails,
      selectedActions: w.selectedActions,
      selectedPolicies: w.selectedPolicies,
      courtesyWaiveReturn: w.courtesyWaiveReturn,
      courtesyOfferFreebie: w.courtesyOfferFreebie,
      maxCredit: w.maxCredit,
    }]);
    setView('list');
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setView('edit');
  };

  const handleToggle = (id: string) => {
    setWorkflows(ws => ws.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  const handleRemove = (id: string) => {
    setWorkflows(ws => ws.filter(w => w.id !== id));
  };

  const handleSaveEdit = (updated: WorkflowItem) => {
    setWorkflows(ws => ws.map(w => w.id === updated.id ? updated : w));
    setEditingId(null);
    setView('list');
  };

  const editingWorkflow = editingId ? workflows.find(w => w.id === editingId) : null;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar forceCollapsed />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
      />
      <main className="flex flex-col flex-1 overflow-hidden">
        {view === 'list' && (
          <WorkflowList
            workflows={workflows}
            onCreate={() => setView('wizard')}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onRemove={handleRemove}
          />
        )}
        {view === 'wizard' && (
          <WorkflowWizard
            onBack={() => setView('list')}
            onFinish={handleFinish}
            existingWorkflows={workflows}
          />
        )}
        {view === 'edit' && editingWorkflow && (
          <WorkflowEditView
            workflow={editingWorkflow}
            allWorkflows={workflows}
            onBack={() => { setEditingId(null); setView('list'); }}
            onSave={handleSaveEdit}
          />
        )}
      </main>
    </div>
  );
}
