'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppSidebar from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import {
  Plus, FlaskConical, Search, ChevronDown, ShoppingBag,
  MessageSquare, Mail, Globe, X, Sparkles, TrendingDown, Zap, AlertTriangle,
  ArrowLeft, Send, GitBranch,
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

// ─── Insights Types ───────────────────────────────────────────────────

type InsightStatus = 'open' | 'ignored' | 'applied';
type InsightCategory = 'automation' | 'escalation' | 'missing' | 'tone' | 'store';
type InsightImpact = 'high' | 'medium' | 'low';

interface Insight {
  id: string;
  category: InsightCategory;
  impact: InsightImpact;
  title: string;
  explanation: string;
  recommendation: string;
  evidence: string[];
  estimatedImpact: string[];
  affectedWorkflow: string;
  affectedStores: string[];
  confidence: 'High' | 'Medium' | 'Low';
  actions: string[];
  status: InsightStatus;
  currentLogic: string;
  suggestedLogic: string;
}

// ─── Insights Mock Data ───────────────────────────────────────────────

const INITIAL_INSIGHTS: Insight[] = [
  {
    id: 'refund-auto',
    category: 'automation',
    impact: 'high',
    title: 'Refund approvals between $50–$100 are repeatedly approved by agents',
    explanation: 'AI noticed that tickets escalated for refunds above $50 are usually approved by human agents when the amount is between $50 and $100.',
    recommendation: 'Update the refund workflow so AI can approve refunds up to $100 when customer risk is low.',
    evidence: ['1,240 tickets analyzed', '92% manually approved', '6 stores affected', 'Observed over last 28 days'],
    estimatedImpact: ['Reduce escalations by 38%', 'Save 21 agent hours/week'],
    affectedWorkflow: 'Refund Handling Flow',
    affectedStores: ['US Store', 'UK Store', 'UAE Store'],
    confidence: 'High',
    actions: ['Preview AI update', 'Apply to workflow', 'Ignore'],
    status: 'open',
    currentLogic: 'Escalate refunds above $50 to a human agent.',
    suggestedLogic: 'Allow AI to approve refunds up to $100 if:\n• Customer has fewer than 2 prior refunds\n• Order was placed within the return window\n• Product is eligible for refund\n• No fraud/risk flag is present',
  },
  {
    id: 'warranty-escalation',
    category: 'escalation',
    impact: 'high',
    title: 'Warranty Claim workflow is escalating most conversations',
    explanation: 'This workflow escalates a majority of conversations before collecting enough information from the customer.',
    recommendation: 'Add missing diagnostic steps for damaged-item verification, photo collection, and order validation.',
    evidence: ['840 tickets analyzed', '84% escalation rate', 'Most common missing step: product damage verification'],
    estimatedImpact: ['Reduce unnecessary escalations by 27%'],
    affectedWorkflow: 'Warranty Claim',
    affectedStores: ['All inherited stores'],
    confidence: 'High',
    actions: ['Preview AI update', 'Generate improved workflow', 'Ignore'],
    status: 'open',
    currentLogic: 'If customer reports damaged item → escalate to agent immediately.',
    suggestedLogic: 'Before escalating:\n1. Ask customer to describe damage\n2. Request photo upload\n3. Validate order number and return window\n4. Check warranty eligibility\nOnly escalate if validation fails.',
  },
  {
    id: 'pause-subscription',
    category: 'missing',
    impact: 'medium',
    title: 'Customers frequently ask to pause subscriptions, but no workflow exists',
    explanation: 'AI detected repeated customer requests for subscription pauses, but there is no dedicated workflow to handle them.',
    recommendation: 'Create a new "Pause Subscription" workflow.',
    evidence: ['312 matching conversations', '71% handled manually', 'Common phrases: "pause my subscription", "skip next month", "hold my order"'],
    estimatedImpact: ['Automate 180 conversations/month'],
    affectedWorkflow: 'None',
    affectedStores: ['US Store', 'UK Store'],
    confidence: 'Medium',
    actions: ['Generate workflow', 'Ignore'],
    status: 'open',
    currentLogic: 'No workflow configured.',
    suggestedLogic: 'New "Pause Subscription" workflow:\n1. Confirm subscription details\n2. Ask for pause duration\n3. Process pause via API\n4. Confirm to customer',
  },
  {
    id: 'late-delivery-tone',
    category: 'tone',
    impact: 'medium',
    title: 'Late Delivery responses may sound too dismissive',
    explanation: 'Customers show negative sentiment after AI responses in late delivery conversations.',
    recommendation: 'Rewrite the response tone to acknowledge inconvenience before giving delivery status.',
    evidence: ['420 conversations analyzed', '34% negative sentiment after AI response', 'Highest issue on WhatsApp'],
    estimatedImpact: ['Improve customer satisfaction for delay-related tickets'],
    affectedWorkflow: 'Late Delivery',
    affectedStores: ['PK Store', 'UAE Store'],
    confidence: 'Medium',
    actions: ['Improve tone with AI', 'Ignore'],
    status: 'open',
    currentLogic: 'Response: "Your order is delayed. Expected delivery: [date]."',
    suggestedLogic: 'Response: "We\'re really sorry for the delay — we know how frustrating this can be. Your order is currently delayed, with an updated delivery estimate of [date]. We\'re monitoring it closely and will keep you updated."',
  },
];

// ─── Insights Config ──────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<InsightCategory, { label: string; color: string; bg: string }> = {
  automation: { label: 'Automation opportunity', color: 'text-[#7c3aed]', bg: 'bg-[#faf5ff] border-[#ddd6fe]' },
  escalation:  { label: 'Escalation issue',       color: 'text-[#dc2626]', bg: 'bg-[#fef2f2] border-[#fecaca]' },
  missing:     { label: 'Missing workflow',        color: 'text-[#3b82f6]', bg: 'bg-[#eff6ff] border-[#bfdbfe]' },
  tone:        { label: 'Tone issue',              color: 'text-[#0891b2]', bg: 'bg-[#ecfeff] border-[#a5f3fc]' },
  store:       { label: 'Store inconsistency',     color: 'text-[#71717a]', bg: 'bg-[#f4f4f5] border-[#e4e4e7]' },
};

const IMPACT_CONFIG: Record<InsightImpact, { label: string; color: string; bg: string }> = {
  high:   { label: 'High impact',   color: 'text-[#b45309]', bg: 'bg-[#fffbeb] border-[#fde68a]' },
  medium: { label: 'Medium impact', color: 'text-[#3b82f6]', bg: 'bg-[#eff6ff] border-[#bfdbfe]' },
  low:    { label: 'Low impact',    color: 'text-[#71717a]', bg: 'bg-[#f4f4f5] border-[#e4e4e7]' },
};

// ─── Test Workflow Types ──────────────────────────────────────────────

interface Diagnostics {
  intent: string;
  workflowTriggered: string;
  stepsTriggered: string[];
  toolsUsed: string[];
  inputs: { key: string; value: string }[];
  outputs: { key: string; value: string }[];
  guardrailChecks: { name: string; passed: boolean }[];
}

interface TestMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  triggeredWorkflow?: string;
  isUnmatched?: boolean;
  suggestedWorkflow?: string;
  diagnostics?: Diagnostics;
  rating?: 'good' | 'acceptable' | 'poor';
  feedback?: string;
  showFeedback?: boolean;
}

// ─── Mock workflow responses ──────────────────────────────────────────

const WORKFLOW_MOCK: Record<string, { response: string; diagnostics: Omit<Diagnostics, 'workflowTriggered'> }> = {
  'refund-handling': {
    response: "I've located your order and checked the refund eligibility. Your order qualifies for a full refund of $84.99. The refund will be processed to your original payment method within 3–5 business days.",
    diagnostics: {
      intent: 'Refund Request',
      stepsTriggered: ['Verify order details', 'Check refund eligibility', 'Calculate refund amount', 'Process refund'],
      toolsUsed: ['Order Management API', 'Payment Gateway', 'Customer DB'],
      inputs: [{ key: 'order_id', value: '#48291' }, { key: 'reason', value: 'Customer requested' }],
      outputs: [{ key: 'refund_status', value: 'Approved' }, { key: 'refund_amount', value: '$84.99' }],
      guardrailChecks: [{ name: 'Fraud check', passed: true }, { name: 'Eligibility check', passed: true }, { name: 'Amount validation', passed: true }],
    },
  },
  'shipping-inquiry': {
    response: "Your order #48291 is currently in transit. It was last scanned at the Chicago distribution center and is expected to arrive by Thursday, May 8th. Tracking: 1Z999AA10123456784.",
    diagnostics: {
      intent: 'Order Status Inquiry',
      stepsTriggered: ['Fetch order details', 'Query shipping carrier', 'Format status message'],
      toolsUsed: ['Order Management API', 'Shipping Carrier API'],
      inputs: [{ key: 'order_id', value: '#48291' }],
      outputs: [{ key: 'tracking_number', value: '1Z999AA10123456784' }, { key: 'status', value: 'In Transit' }, { key: 'est_delivery', value: 'May 8th' }],
      guardrailChecks: [{ name: 'Order ownership verification', passed: true }],
    },
  },
  'order-cancellation': {
    response: "I've successfully cancelled order #48291. A full refund of $124.00 has been initiated and will appear on your original payment method within 3–5 business days.",
    diagnostics: {
      intent: 'Order Cancellation',
      stepsTriggered: ['Check order status', 'Verify cancellation window', 'Process cancellation', 'Trigger refund'],
      toolsUsed: ['Order Management API', 'Payment Gateway'],
      inputs: [{ key: 'order_id', value: '#48291' }, { key: 'reason', value: 'Customer request' }],
      outputs: [{ key: 'cancellation_status', value: 'Confirmed' }, { key: 'refund_initiated', value: '$124.00' }],
      guardrailChecks: [{ name: 'Cancellation window check', passed: true }, { name: 'Order status check', passed: true }],
    },
  },
  'return-exchange': {
    response: "Your return request has been approved. I've generated a prepaid shipping label — please check your email. If you'd like to exchange for a different size, let me know and I'll check availability.",
    diagnostics: {
      intent: 'Return / Exchange Request',
      stepsTriggered: ['Verify return eligibility', 'Generate return label', 'Check exchange inventory'],
      toolsUsed: ['Order Management API', 'Returns Portal API', 'Inventory API'],
      inputs: [{ key: 'order_id', value: '#48291' }, { key: 'reason', value: 'Wrong size' }],
      outputs: [{ key: 'return_label', value: 'Sent via email' }, { key: 'exchange_available', value: 'Yes' }],
      guardrailChecks: [{ name: 'Return window check', passed: true }, { name: 'Item condition check', passed: true }],
    },
  },
  'subscription-management': {
    response: "Your subscription has been paused for 30 days. Your next billing date has been pushed to June 6th. You can resume anytime from your account settings.",
    diagnostics: {
      intent: 'Subscription Modification',
      stepsTriggered: ['Fetch subscription details', 'Apply modification', 'Update billing date', 'Confirm to customer'],
      toolsUsed: ['Subscription API', 'Customer DB'],
      inputs: [{ key: 'subscription_id', value: 'SUB-8821' }, { key: 'modification', value: 'Pause 30 days' }],
      outputs: [{ key: 'next_billing_date', value: 'June 6th' }, { key: 'status', value: 'Paused' }],
      guardrailChecks: [{ name: 'Active subscription check', passed: true }, { name: 'Modification limit check', passed: true }],
    },
  },
  'product-recommendation': {
    response: "Based on your browsing history and preferences, I'd recommend the Premium Comfort Bundle — it's our best seller this season and matches your style profile. Would you like to see more options?",
    diagnostics: {
      intent: 'Product Discovery',
      stepsTriggered: ['Analyze customer preferences', 'Query product catalog', 'Rank by relevance', 'Format recommendations'],
      toolsUsed: ['Product Catalog API', 'Recommendation Engine', 'Customer DB'],
      inputs: [{ key: 'query', value: 'product suggestion' }, { key: 'segment', value: 'Returning customer' }],
      outputs: [{ key: 'top_recommendation', value: 'Premium Comfort Bundle' }, { key: 'confidence', value: '94%' }],
      guardrailChecks: [{ name: 'Catalog availability check', passed: true }],
    },
  },
};

const FALLBACK_MOCK = {
  response: "Thanks for reaching out. I'm here to help with any questions about your orders, products, or account. Could you provide a bit more detail so I can assist you better?",
  diagnostics: {
    intent: 'General Inquiry',
    stepsTriggered: ['Classify intent', 'Route to general handler'],
    toolsUsed: ['Customer DB'],
    inputs: [{ key: 'message', value: '(raw input)' }],
    outputs: [{ key: 'response_type', value: 'Clarification request' }],
    guardrailChecks: [{ name: 'Content moderation', passed: true }],
  },
};

function detectWorkflowId(message: string): string | null {
  const msg = message.toLowerCase();
  if (/refund|money back|reimburse|credit|charged twice/.test(msg)) return 'refund-handling';
  if (/where is|tracking|shipment|shipping|delivery|arrived|dispatched/.test(msg)) return 'shipping-inquiry';
  if (/cancel|cancellation/.test(msg)) return 'order-cancellation';
  if (/return|exchange|swap|replace/.test(msg)) return 'return-exchange';
  if (/subscription|pause|skip next|hold my order/.test(msg)) return 'subscription-management';
  if (/recommend|suggest|looking for a product|find me/.test(msg)) return 'product-recommendation';
  return null;
}

function getMockResponse(message: string, selectedWorkflows: Workflow[], allWorkflows: Workflow[]): {
  content: string;
  triggeredWorkflow: string;
  isUnmatched: boolean;
  suggestedWorkflow?: string;
  diagnostics: Diagnostics;
} {
  const detectedId = detectWorkflowId(message);
  const detectedWorkflow = detectedId ? allWorkflows.find(w => w.id === detectedId) : null;
  const isSelected = detectedId ? selectedWorkflows.some(w => w.id === detectedId) : false;

  if (!detectedId || !detectedWorkflow) {
    return {
      content: FALLBACK_MOCK.response,
      triggeredWorkflow: 'General Inquiry Flow',
      isUnmatched: true,
      suggestedWorkflow: undefined,
      diagnostics: { ...FALLBACK_MOCK.diagnostics, workflowTriggered: 'General Inquiry Flow' },
    };
  }

  const mock = WORKFLOW_MOCK[detectedId];
  if (!isSelected) {
    return {
      content: "No selected workflow matched this message. The simulator detected a relevant workflow but it isn't included in this test session.",
      triggeredWorkflow: detectedWorkflow.name,
      isUnmatched: true,
      suggestedWorkflow: detectedWorkflow.name,
      diagnostics: { ...mock.diagnostics, workflowTriggered: detectedWorkflow.name },
    };
  }

  return {
    content: mock.response,
    triggeredWorkflow: detectedWorkflow.name,
    isUnmatched: false,
    diagnostics: { ...mock.diagnostics, workflowTriggered: detectedWorkflow.name },
  };
}

// ─── DiagnosticSection helper ─────────────────────────────────────────

function DiagnosticSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-medium text-[#a1a1aa] mb-1.5">{label}</p>
      {children}
    </div>
  );
}

// ─── InsightBadge ─────────────────────────────────────────────────────

function InsightBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border', color, bg)}>
      {label}
    </span>
  );
}

// ─── InsightPreviewDrawer ─────────────────────────────────────────────

function InsightPreviewDrawer({
  insight,
  onClose,
  onApply,
}: {
  insight: Insight;
  onClose: () => void;
  onApply: (id: string) => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white border-l border-[#e4e4e7] z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e4e7]">
          <h2 className="text-sm font-semibold text-[#18181b]">Preview Update</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title */}
          <p className="text-sm font-semibold text-[#18181b] leading-snug">{insight.title}</p>

          {/* Current logic */}
          <div>
            <p className="text-[11px] uppercase tracking-widest font-medium text-[#a1a1aa] mb-2">Current logic</p>
            <div className="bg-[#f4f4f5] rounded-lg p-3.5">
              <pre className="text-xs text-[#3f3f46] whitespace-pre-wrap font-mono leading-relaxed">{insight.currentLogic}</pre>
            </div>
          </div>

          {/* Suggested logic */}
          <div>
            <p className="text-[11px] uppercase tracking-widest font-medium text-[#a1a1aa] mb-2">Suggested logic</p>
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-3.5">
              <pre className="text-xs text-[#15803d] whitespace-pre-wrap font-mono leading-relaxed">{insight.suggestedLogic}</pre>
            </div>
          </div>

          {/* Changes label */}
          <div>
            <p className="text-[11px] uppercase tracking-widest font-medium text-[#a1a1aa] mb-2">Changes</p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-xs text-[#dc2626]">
                <span className="mt-0.5 shrink-0 font-mono">−</span>
                <span className="line-through text-[#a1a1aa]">{insight.currentLogic.split('\n')[0]}</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-[#16a34a]">
                <span className="mt-0.5 shrink-0 font-mono">+</span>
                <span>{insight.suggestedLogic.split('\n')[0]}</span>
              </div>
            </div>
          </div>

          {/* Store impact */}
          <div>
            <p className="text-[11px] uppercase tracking-widest font-medium text-[#a1a1aa] mb-2">Store impact</p>
            <div className="flex flex-wrap gap-1.5">
              {insight.affectedStores.map(store => (
                <span key={store} className="px-2 py-1 rounded-md text-xs border border-[#e4e4e7] text-[#3f3f46] bg-white">
                  {store}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e4e4e7] flex items-center gap-2">
          <button
            onClick={() => { onApply(insight.id); onClose(); }}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors"
          >
            Apply update
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] hover:text-[#18181b] transition-colors">
            Save as draft
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#71717a] hover:text-[#18181b] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

// ─── InsightCard ──────────────────────────────────────────────────────

function InsightCard({
  insight,
  onAction,
}: {
  insight: Insight;
  onAction: (insight: Insight, action: string) => void;
}) {
  const catCfg = CATEGORY_CONFIG[insight.category];
  const impCfg = IMPACT_CONFIG[insight.impact];
  const isIgnored = insight.status === 'ignored';
  const isApplied = insight.status === 'applied';

  return (
    <div className={cn(
      'bg-white border border-[#e4e4e7] rounded-xl p-5 relative overflow-hidden transition-opacity',
      isIgnored && 'opacity-50',
      isApplied && 'border-t-2 border-t-[#16a34a]',
    )}>
      {/* Ignored banner */}
      {isIgnored && (
        <div className="absolute top-0 left-0 right-0 bg-[#f4f4f5] px-5 py-1.5 flex items-center gap-2">
          <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-widest">Ignored</span>
        </div>
      )}
      {/* Applied badge row */}
      {isApplied && (
        <div className="absolute top-0 right-5 translate-y-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-b-md text-[11px] font-medium bg-[#f0fdf4] border border-t-0 border-[#bbf7d0] text-[#16a34a]">
            Applied
          </span>
        </div>
      )}

      <div className={cn(isIgnored && 'mt-6')}>
        {/* Top row */}
        <div className="flex items-center gap-2">
          <InsightBadge label={impCfg.label} color={impCfg.color} bg={impCfg.bg} />
          <InsightBadge label={catCfg.label} color={catCfg.color} bg={catCfg.bg} />
          <span className="ml-auto text-[11px] text-[#a1a1aa]">2 days ago</span>
        </div>

        {/* Title */}
        <p className="text-sm font-semibold text-[#18181b] mt-2 leading-snug">{insight.title}</p>

        {/* Explanation */}
        <p className="text-xs text-[#71717a] mt-1 leading-relaxed">{insight.explanation}</p>

        {/* Divider */}
        <div className="border-t border-[#f4f4f5] mt-3 pt-3">
          <div className="grid grid-cols-3 gap-4">
            {/* Recommendation */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-medium text-[#a1a1aa] mb-1.5">Recommendation</p>
              <p className="text-xs text-[#3f3f46] leading-relaxed">{insight.recommendation}</p>
            </div>
            {/* Evidence */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-medium text-[#a1a1aa] mb-1.5">Evidence</p>
              <ul className="space-y-0.5">
                {insight.evidence.map((e, i) => (
                  <li key={i} className="text-xs text-[#3f3f46] flex items-start gap-1.5">
                    <span className="mt-1 w-1 h-1 rounded-full bg-[#a1a1aa] shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            {/* Estimated impact */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-medium text-[#a1a1aa] mb-1.5">Estimated impact</p>
              <ul className="space-y-0.5">
                {insight.estimatedImpact.map((e, i) => (
                  <li key={i} className="text-xs text-[#3f3f46] flex items-start gap-1.5">
                    <span className="mt-1 w-1 h-1 rounded-full bg-[#16a34a] shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider + meta row */}
        <div className="border-t border-[#f4f4f5] mt-3 pt-3 flex items-center gap-2 flex-wrap">
          {/* Affected workflow pill */}
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] border border-[#e4e4e7] text-[#3f3f46] bg-[#fafafa]">
            <Zap size={10} className="text-[#a1a1aa]" />
            {insight.affectedWorkflow}
          </span>
          {/* Affected stores pill */}
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] border border-[#e4e4e7] text-[#3f3f46] bg-[#fafafa]">
            <ShoppingBag size={10} className="text-[#a1a1aa]" />
            {insight.affectedStores.length === 1 ? insight.affectedStores[0] : `${insight.affectedStores.length} stores`}
          </span>
          {/* Confidence */}
          <span className={cn(
            'inline-flex items-center px-2 py-1 rounded-md text-[11px] border font-medium',
            insight.confidence === 'High' ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#16a34a]' :
            insight.confidence === 'Medium' ? 'bg-[#fffbeb] border-[#fde68a] text-[#b45309]' :
            'bg-[#f4f4f5] border-[#e4e4e7] text-[#71717a]',
          )}>
            {insight.confidence} confidence
          </span>

          {/* Spacer */}
          <span className="flex-1" />

          {/* Action buttons */}
          {isIgnored ? (
            <button
              onClick={() => onAction(insight, 'Restore')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e4e4e7] text-[#71717a] hover:border-[#a1a1aa] hover:text-[#3f3f46] transition-colors"
            >
              Restore
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              {insight.actions.map((action, i) => (
                <button
                  key={action}
                  onClick={() => onAction(insight, action)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    i === 0
                      ? 'bg-[#18181b] text-white hover:bg-[#27272a]'
                      : 'border border-[#e4e4e7] text-[#71717a] hover:border-[#a1a1aa] hover:text-[#3f3f46]',
                  )}
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── InsightsTab ──────────────────────────────────────────────────────

function InsightsTab({ insights, setInsights }: {
  insights: Insight[];
  setInsights: React.Dispatch<React.SetStateAction<Insight[]>>;
}) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [impactFilter, setImpactFilter] = useState<'all' | InsightImpact>('all');
  const [previewInsightId, setPreviewInsightId] = useState<string | null>(null);

  function handleIgnore(id: string) {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, status: 'ignored' } : i));
  }

  function handleApply(id: string) {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, status: 'applied' } : i));
  }

  function handleRestore(id: string) {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, status: 'open' } : i));
  }

  function handleAction(insight: Insight, action: string) {
    if (action === 'Preview AI update') {
      setPreviewInsightId(insight.id);
    } else if (action === 'Apply to workflow') {
      handleApply(insight.id);
    } else if (action === 'Ignore') {
      handleIgnore(insight.id);
    } else if (action === 'Restore') {
      handleRestore(insight.id);
    }
    // Others are no-op for now
  }

  // Filter logic
  let filtered = insights.filter(i => {
    if (categoryFilter === 'ignored') return i.status === 'ignored';
    if (categoryFilter === 'applied') return i.status === 'applied';
    if (categoryFilter === 'all') return i.status === 'open' || i.status === 'applied';
    return i.category === categoryFilter && i.status === 'open';
  });

  if (impactFilter !== 'all') {
    filtered = filtered.filter(i => i.impact === impactFilter);
  }

  const previewInsight = previewInsightId ? insights.find(i => i.id === previewInsightId) ?? null : null;

  const filterOptions: { id: string; label: string }[] = [
    { id: 'all',        label: 'All' },
    { id: 'automation', label: 'Automation opportunities' },
    { id: 'escalation', label: 'Escalation issues' },
    { id: 'missing',    label: 'Missing workflows' },
    { id: 'tone',       label: 'Tone issues' },
    { id: 'store',      label: 'Store inconsistencies' },
    { id: 'ignored',    label: 'Ignored' },
    { id: 'applied',    label: 'Applied' },
  ];

  const activeFilterLabel = filterOptions.find(f => f.id === categoryFilter)?.label ?? 'All';
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      {/* Filter row */}
      <div className="flex items-center gap-3 mb-5">
        {/* Category filter dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(v => !v)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border transition-colors bg-white whitespace-nowrap',
              categoryFilter !== 'all'
                ? 'border-[#18181b] text-[#18181b] font-medium'
                : 'border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa]',
            )}
          >
            {activeFilterLabel}
            <ChevronDown size={12} className={cn('transition-transform', filterOpen && 'rotate-180')} />
          </button>

          {filterOpen && (
            <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-[#e4e4e7] rounded-xl shadow-lg z-50 py-1 overflow-hidden">
              {filterOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setCategoryFilter(opt.id); setFilterOpen(false); }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors',
                    categoryFilter === opt.id
                      ? 'bg-[#fafafa] text-[#18181b] font-medium'
                      : 'text-[#3f3f46] hover:bg-[#fafafa]',
                  )}
                >
                  {opt.label}
                  {categoryFilter === opt.id && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Impact dropdown */}
        <select
          value={impactFilter}
          onChange={e => setImpactFilter(e.target.value as 'all' | InsightImpact)}
          className="px-3 py-1.5 text-xs rounded-lg border border-[#e4e4e7] text-[#3f3f46] bg-white outline-none focus:border-[#a1a1aa] shrink-0 cursor-pointer"
        >
          <option value="all">All impact</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#f4f4f5] flex items-center justify-center mb-4">
            <Sparkles size={20} className="text-[#a1a1aa]" />
          </div>
          <p className="text-sm font-medium text-[#18181b] mb-1">No insights found</p>
          <p className="text-xs text-[#71717a]">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(insight => (
            <InsightCard key={insight.id} insight={insight} onAction={handleAction} />
          ))}
        </div>
      )}

      {/* Preview drawer */}
      {previewInsight && (
        <InsightPreviewDrawer
          insight={previewInsight}
          onClose={() => setPreviewInsightId(null)}
          onApply={handleApply}
        />
      )}
    </div>
  );
}

// ─── TestWorkflowModal ────────────────────────────────────────────────

function TestWorkflowModal({
  workflows,
  onClose,
  onStart,
}: {
  workflows: Workflow[];
  onClose: () => void;
  onStart: (selected: Workflow[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const filtered = workflows.filter(w => w.name.toLowerCase().includes(search.toLowerCase()));

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-[#e4e4e7]">
            <div>
              <h2 className="text-base font-semibold text-[#18181b]">Test Workflows</h2>
              <p className="text-xs text-[#71717a] mt-0.5">Select one or more workflows to test in the simulator.</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors mt-0.5">
              <X size={15} />
            </button>
          </div>

          {/* Search */}
          <div className="px-6 pt-4 pb-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search workflows…"
                autoFocus
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-[#e4e4e7] bg-[#fafafa] outline-none focus:border-[#a1a1aa] focus:bg-white transition-colors placeholder:text-[#a1a1aa] text-[#18181b]"
              />
            </div>
          </div>

          {/* Workflow list */}
          <div className="flex-1 overflow-y-auto px-3 pb-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-[#a1a1aa] text-center py-8">No workflows found</p>
            ) : filtered.map(w => {
              const isChecked = selected.has(w.id);
              return (
                <button
                  key={w.id}
                  onClick={() => toggle(w.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors',
                    isChecked ? 'bg-[#fafafa]' : 'hover:bg-[#fafafa]',
                  )}
                >
                  <div className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors',
                    isChecked ? 'bg-[#18181b] border-[#18181b]' : 'border-[#d4d4d8]',
                  )}>
                    {isChecked && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-[#f4f4f5] flex items-center justify-center shrink-0">
                    <GitBranch size={13} className="text-[#71717a]" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-[#18181b] truncate">{w.name}</span>
                  <span className={cn(
                    'text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0',
                    w.status === 'active'
                      ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'
                      : 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]',
                  )}>
                    {w.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#e4e4e7] flex items-center justify-between">
            <p className="text-xs text-[#71717a]">
              {selected.size === 0 ? 'No workflows selected' : `${selected.size} workflow${selected.size > 1 ? 's' : ''} selected`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] hover:text-[#18181b] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onStart(workflows.filter(w => selected.has(w.id)))}
                disabled={selected.size === 0}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  selected.size > 0
                    ? 'bg-[#18181b] text-white hover:bg-[#27272a]'
                    : 'bg-[#f4f4f5] text-[#a1a1aa] cursor-not-allowed',
                )}
              >
                Start Testing
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── WorkflowTestingInterface ─────────────────────────────────────────

function WorkflowTestingInterface({
  selectedWorkflows,
  allWorkflows,
  onBack,
}: {
  selectedWorkflows: Workflow[];
  allWorkflows: Workflow[];
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [input, setInput] = useState('');
  const [activeDiagnostics, setActiveDiagnostics] = useState<Diagnostics | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const userMsg: TestMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
    const result = getMockResponse(text, selectedWorkflows, allWorkflows);
    const aiMsg: TestMessage = {
      id: `a-${Date.now()}`,
      role: 'ai',
      content: result.content,
      triggeredWorkflow: result.triggeredWorkflow,
      isUnmatched: result.isUnmatched,
      suggestedWorkflow: result.suggestedWorkflow,
      diagnostics: result.diagnostics,
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setActiveDiagnostics(result.diagnostics);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function setRating(id: string, rating: 'good' | 'acceptable' | 'poor') {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, rating, showFeedback: m.showFeedback } : m));
  }

  function toggleFeedback(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, showFeedback: !m.showFeedback } : m));
  }

  function setFeedback(id: string, feedback: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, feedback } : m));
  }

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#e4e4e7] px-6 py-3 flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#18181b] transition-colors shrink-0"
        >
          <ArrowLeft size={13} />
          Back to Workflows
        </button>
        <div className="w-px h-4 bg-[#e4e4e7] shrink-0" />
        <span className="text-sm font-semibold text-[#18181b] shrink-0">Workflow Testing</span>
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          {selectedWorkflows.map(w => (
            <span key={w.id} className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border whitespace-nowrap',
              w.status === 'active'
                ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'
                : 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]',
            )}>
              <GitBranch size={9} />
              {w.name}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden bg-[#fafafa]">

        {/* Chat panel */}
        <div className="flex flex-col flex-1 overflow-hidden border-r border-[#e4e4e7]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#e4e4e7] flex items-center justify-center mb-3">
                  <FlaskConical size={18} className="text-[#a1a1aa]" />
                </div>
                <p className="text-sm font-medium text-[#18181b] mb-1">Start the simulation</p>
                <p className="text-xs text-[#71717a] max-w-xs leading-relaxed">
                  Type a customer message below to see which workflows are triggered and inspect the response diagnostics.
                </p>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id}>
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[65%]">
                      <p className="text-[10px] text-[#a1a1aa] text-right mb-1">You</p>
                      <div className="bg-[#18181b] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] space-y-2">
                      {/* Label row */}
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-[#a1a1aa]">AI</p>
                        {msg.isUnmatched ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#fffbeb] border border-[#fde68a] text-[#b45309]">
                            <AlertTriangle size={9} />
                            {msg.suggestedWorkflow ? `Suggested: ${msg.suggestedWorkflow}` : 'No workflow matched'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a]">
                            <GitBranch size={9} />
                            Triggered: {msg.triggeredWorkflow}
                          </span>
                        )}
                      </div>
                      {/* Bubble — click to inspect diagnostics */}
                      <button
                        onClick={() => msg.diagnostics && setActiveDiagnostics(msg.diagnostics)}
                        className={cn(
                          'text-left rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed transition-colors w-full',
                          msg.isUnmatched
                            ? 'bg-[#fffbeb] border border-[#fde68a] text-[#92400e]'
                            : 'bg-white border border-[#e4e4e7] text-[#18181b] hover:border-[#a1a1aa]',
                        )}
                      >
                        {msg.content}
                        {msg.isUnmatched && msg.suggestedWorkflow && (
                          <p className="text-[11px] text-[#b45309] mt-1.5 font-medium">
                            Add "{msg.suggestedWorkflow}" to this test session to handle this message.
                          </p>
                        )}
                      </button>
                      {/* Rating */}
                      <div className="flex items-center gap-1.5 flex-wrap pl-0.5">
                        {(['good', 'acceptable', 'poor'] as const).map(r => (
                          <button
                            key={r}
                            onClick={() => setRating(msg.id, r)}
                            className={cn(
                              'px-2.5 py-1 rounded-lg text-[11px] font-medium border capitalize transition-colors',
                              msg.rating === r
                                ? r === 'good' ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#16a34a]'
                                  : r === 'acceptable' ? 'bg-[#fffbeb] border-[#fde68a] text-[#b45309]'
                                  : 'bg-[#fef2f2] border-[#fecaca] text-[#dc2626]'
                                : 'bg-white border-[#e4e4e7] text-[#71717a] hover:border-[#a1a1aa] hover:text-[#3f3f46]',
                            )}
                          >
                            {r === 'good' ? 'Good' : r === 'acceptable' ? 'Acceptable' : 'Poor'}
                          </button>
                        ))}
                        {msg.rating && (
                          <button
                            onClick={() => toggleFeedback(msg.id)}
                            className="text-[11px] text-[#a1a1aa] hover:text-[#71717a] transition-colors ml-1"
                          >
                            {msg.showFeedback ? 'Hide feedback' : 'Add feedback'}
                          </button>
                        )}
                      </div>
                      {/* Feedback */}
                      {msg.showFeedback && (
                        <textarea
                          value={msg.feedback ?? ''}
                          onChange={e => setFeedback(msg.id, e.target.value)}
                          placeholder="What could be improved?"
                          rows={2}
                          className="w-full text-xs rounded-lg border border-[#e4e4e7] bg-white px-3 py-2 outline-none focus:border-[#a1a1aa] placeholder:text-[#a1a1aa] text-[#18181b] resize-none"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="px-6 py-4 border-t border-[#e4e4e7] bg-white shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Type a customer message…"
                rows={1}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-[#e4e4e7] bg-[#fafafa] outline-none focus:border-[#a1a1aa] focus:bg-white transition-colors placeholder:text-[#a1a1aa] text-[#18181b] resize-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                  input.trim() ? 'bg-[#18181b] text-white hover:bg-[#27272a]' : 'bg-[#f4f4f5] text-[#a1a1aa] cursor-not-allowed',
                )}
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[10px] text-[#a1a1aa] mt-2">Enter to send · Shift+Enter for new line · Click a response to inspect diagnostics</p>
          </div>
        </div>

        {/* Diagnostics panel */}
        <div className="w-[288px] shrink-0 flex flex-col bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e4e4e7] shrink-0">
            <h3 className="text-xs font-semibold text-[#18181b] uppercase tracking-widest">Diagnostics</h3>
            <p className="text-[10px] text-[#a1a1aa] mt-0.5">Click any AI response to inspect it</p>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {!activeDiagnostics ? (
              <p className="text-xs text-[#a1a1aa] text-center py-10">Send a message to see diagnostics here.</p>
            ) : (
              <div className="space-y-4">
                <DiagnosticSection label="Intent detected">
                  <p className="text-xs text-[#3f3f46] font-medium">{activeDiagnostics.intent}</p>
                </DiagnosticSection>

                <DiagnosticSection label="Workflow triggered">
                  <div className="flex items-center gap-1.5">
                    <GitBranch size={11} className="text-[#a1a1aa] shrink-0" />
                    <p className="text-xs text-[#3f3f46] font-medium">{activeDiagnostics.workflowTriggered}</p>
                  </div>
                </DiagnosticSection>

                <DiagnosticSection label="Steps triggered">
                  <ol className="space-y-1.5">
                    {activeDiagnostics.stepsTriggered.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#3f3f46]">
                        <span className="shrink-0 w-4 h-4 rounded-full bg-[#f4f4f5] text-[#71717a] text-[9px] font-semibold flex items-center justify-center mt-px">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </DiagnosticSection>

                <DiagnosticSection label="Tools / connections used">
                  <div className="flex flex-wrap gap-1">
                    {activeDiagnostics.toolsUsed.map(tool => (
                      <span key={tool} className="px-2 py-0.5 rounded-md text-[10px] border border-[#e4e4e7] text-[#3f3f46] bg-[#fafafa]">{tool}</span>
                    ))}
                  </div>
                </DiagnosticSection>

                <DiagnosticSection label="Inputs">
                  <div className="space-y-1">
                    {activeDiagnostics.inputs.map(({ key, value }) => (
                      <div key={key} className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-[#a1a1aa] font-mono">{key}</span>
                        <span className="text-[#d4d4d8]">→</span>
                        <span className="text-[#3f3f46] font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </DiagnosticSection>

                <DiagnosticSection label="Outputs">
                  <div className="space-y-1">
                    {activeDiagnostics.outputs.map(({ key, value }) => (
                      <div key={key} className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-[#a1a1aa] font-mono">{key}</span>
                        <span className="text-[#d4d4d8]">→</span>
                        <span className="text-[#3f3f46] font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </DiagnosticSection>

                <DiagnosticSection label="Guardrail checks">
                  <div className="space-y-2">
                    {activeDiagnostics.guardrailChecks.map(({ name, passed }) => (
                      <div key={name} className="flex items-center gap-2">
                        <div className={cn(
                          'w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0',
                          passed ? 'bg-[#f0fdf4]' : 'bg-[#fef2f2]',
                        )}>
                          {passed
                            ? <svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M1 2.5L2.5 4L6 1" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            : <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1 1l5 5M6 1L1 6" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" /></svg>
                          }
                        </div>
                        <span className="text-[10px] text-[#3f3f46] flex-1">{name}</span>
                        <span className={cn('text-[9px] font-semibold uppercase tracking-wide', passed ? 'text-[#16a34a]' : 'text-[#dc2626]')}>
                          {passed ? 'Pass' : 'Fail'}
                        </span>
                      </div>
                    ))}
                  </div>
                </DiagnosticSection>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
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
  const router = useRouter();
  const [tab, setTab] = useState<'support' | 'sales' | 'insights'>('support');

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'sales') setTab('sales');
    else if (t === 'insights') setTab('insights');
    else setTab('support');
  }, [searchParams]);

  // Test workflow state — driven by ?test=1 URL param
  const [showTestModal, setShowTestModal] = useState(false);
  const [testWorkflows, setTestWorkflows] = useState<Workflow[] | null>(null);

  useEffect(() => {
    if (searchParams.get('test') === '1') {
      const stored = sessionStorage.getItem('testWorkflows');
      if (stored) setTestWorkflows(JSON.parse(stored));
      else router.push('/evo-ai/workflows'); // no workflows stored, bail out
    } else {
      setTestWorkflows(null);
    }
  }, [searchParams]);

  // Insights state lifted here so the tab badge count is always current
  const [insights, setInsights] = useState<Insight[]>(INITIAL_INSIGHTS);
  const openInsightsCount = insights.filter(i => i.status === 'open').length;

  useEffect(() => {
    localStorage.setItem('insightsOpenCount', String(openInsightsCount));
    window.dispatchEvent(new CustomEvent('insights-count-change', { detail: openInsightsCount }));
  }, [openInsightsCount]);

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

      {/* Test workflow modal */}
      {showTestModal && (
        <TestWorkflowModal
          workflows={workflows}
          onClose={() => setShowTestModal(false)}
          onStart={selected => {
            sessionStorage.setItem('testWorkflows', JSON.stringify(selected));
            setShowTestModal(false);
            router.push('/evo-ai/workflows?test=1');
          }}
        />
      )}

      {/* Testing interface — replaces main content */}
      {testWorkflows && (
        <WorkflowTestingInterface
          selectedWorkflows={testWorkflows}
          allWorkflows={workflows}
          onBack={() => router.push('/evo-ai/workflows')}
        />
      )}

      {!testWorkflows && <main className="flex-1 overflow-y-auto bg-[#fafafa]">
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
              <button
                onClick={() => setShowTestModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] hover:text-[#18181b] transition-colors"
              >
                <FlaskConical size={13} />
                Test Workflow
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
              { id: 'support',  label: 'Support Workflows', badge: 0 },
              { id: 'sales',    label: 'Sales Workflows',   badge: 0 },
              { id: 'insights', label: 'Insights',          badge: openInsightsCount },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                  tab === t.id
                    ? 'border-[#18181b] text-[#18181b]'
                    : 'border-transparent text-[#71717a] hover:text-[#3f3f46]',
                )}
              >
                {t.label}
                {t.badge > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#18181b] text-white text-[10px] font-semibold leading-none">
                    {t.badge}
                  </span>
                )}
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

          {/* ── Insights tab ── */}
          {tab === 'insights' && <InsightsTab insights={insights} setInsights={setInsights} />}

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
      </main>}
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
