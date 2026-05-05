'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AppSidebar from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, ChevronDown, Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Link2, Quote, MoreHorizontal,
  X, Sparkles, Check, Plus, Type,
  FlaskConical, Save, History, Globe, MessageSquare, Mail,
  RotateCcw,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────

const CHANNELS = [
  { id: 'live_chat', label: 'Live Chat', icon: MessageSquare },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'whatsapp', label: 'WhatsApp', icon: Globe },
  { id: 'facebook', label: 'Facebook Messenger', icon: Globe },
  { id: 'instagram', label: 'Instagram DM', icon: Globe },
];

const PERMISSIONS_LIST = [
  { id: 'view_orders', label: 'View orders' },
  { id: 'update_orders', label: 'Update orders' },
  { id: 'issue_refunds', label: 'Issue refunds' },
  { id: 'access_customer', label: 'Access customer details' },
  { id: 'use_order_apis', label: 'Use order APIs' },
];

const STORES = [
  { id: 'all', label: 'All Stores', flag: '🌍' },
  { id: 'us', label: 'US Store', flag: '🇺🇸' },
  { id: 'eu', label: 'EU Store', flag: '🇪🇺' },
  { id: 'uae', label: 'UAE Store', flag: '🇦🇪' },
];

const INITIAL_WORKFLOW_HTML = `<ol>
  <li>
    <strong>Understand the request</strong>
    <ul>
      <li>Greet the customer and understand the reason for the refund.</li>
      <li>Ask for the order number if not provided.</li>
    </ul>
  </li>
  <li>
    <strong>Check order eligibility</strong>
    <ul>
      <li>Look up the order using the provided order number.</li>
      <li>Verify the following:
        <ul>
          <li>Order is within the return window (7 days).</li>
          <li>Items are eligible for return.</li>
          <li>Order status is delivered.</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <strong>Offer resolution</strong>
    <ul>
      <li>If eligible:
        <ul>
          <li>Offer the available options (refund, store credit, or exchange).</li>
          <li>Confirm the customer's preferred resolution.</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <strong>Process refund</strong>
    <ul>
      <li>Initiate the refund using the Refund API.</li>
      <li>Inform the customer that the refund will be processed.</li>
    </ul>
  </li>
</ol>`;

const INITIAL_GUARDRAILS_HTML = `<ul>
  <li>Do not issue refunds for orders older than 7 days.</li>
  <li>Do not issue refunds for non-returnable items.</li>
</ul>`;

// ─── Version history data ─────────────────────────────────────────────

interface VersionAuthor {
  initials: string;
  name: string;
  color: string; // bg color for avatar
}

interface Version {
  id: string;
  label?: string; // named version
  timestamp: string;
  description: string;
  author: VersionAuthor;
  isCurrent?: boolean;
}

const AUTHORS: Record<string, VersionAuthor> = {
  sarah: { initials: 'SJ', name: 'Sarah Jones', color: '#7c3aed' },
  alex:  { initials: 'AK', name: 'Alex Kim',    color: '#0284c7' },
  marcus:{ initials: 'ML', name: 'Marcus Lee',  color: '#d97706' },
  priya: { initials: 'PS', name: 'Priya Singh', color: '#16a34a' },
};

const VERSION_HISTORY: { date: string; versions: Version[] }[] = [
  {
    date: 'Today — May 5, 2026',
    versions: [
      {
        id: 'v7',
        label: 'Latest version',
        timestamp: '2:34 PM',
        description: 'Updated guardrails — tightened refund window to 7 days.',
        author: AUTHORS.sarah,
        isCurrent: true,
      },
      {
        id: 'v6',
        timestamp: '11:18 AM',
        description: 'Added store credit as a resolution option.',
        author: AUTHORS.alex,
      },
    ],
  },
  {
    date: 'May 3, 2026',
    versions: [
      {
        id: 'v5',
        label: 'Approved for production',
        timestamp: '4:50 PM',
        description: 'Approved after team review. Minor wording fixes.',
        author: AUTHORS.priya,
      },
      {
        id: 'v4',
        timestamp: '1:22 PM',
        description: 'Added Order Eligibility check step.',
        author: AUTHORS.marcus,
      },
    ],
  },
  {
    date: 'Apr 28, 2026',
    versions: [
      {
        id: 'v3',
        timestamp: '3:05 PM',
        description: 'Restructured workflow into numbered steps.',
        author: AUTHORS.sarah,
      },
      {
        id: 'v2',
        timestamp: '10:40 AM',
        description: 'Initial guardrails added.',
        author: AUTHORS.alex,
      },
    ],
  },
  {
    date: 'Apr 22, 2026',
    versions: [
      {
        id: 'v1',
        label: 'Initial draft',
        timestamp: '9:15 AM',
        description: 'Workflow created.',
        author: AUTHORS.sarah,
      },
    ],
  },
];

// ─── Shared helpers ───────────────────────────────────────────────────

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-xs font-semibold text-[#18181b] uppercase tracking-wider mb-3 text-left', className)}>
      {children}
    </p>
  );
}

function Checkbox({
  checked, onChange, label,
}: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-2.5 w-full text-left group px-3 py-2.5 border-b border-[#f4f4f5] last:border-0 hover:bg-[#faf5ff] transition-colors"
    >
      <div className={cn(
        'w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors mt-0.5',
        checked ? 'bg-[#7c3aed] border-[#7c3aed]' : 'border-[#d4d4d8] group-hover:border-[#a1a1aa]',
      )}>
        {checked && <Check size={10} className="text-white" strokeWidth={3} />}
      </div>
      <span className="text-sm text-[#18181b]">{label}</span>
    </button>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'relative w-9 h-5 rounded-full transition-colors shrink-0',
        enabled ? 'bg-[#16a34a]' : 'bg-[#d4d4d8]',
      )}
    >
      <span className={cn(
        'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform',
        enabled ? 'translate-x-4' : 'translate-x-0',
      )} />
    </button>
  );
}

// ─── Version History Panel ────────────────────────────────────────────

function VersionHistoryPanel({ onClose }: { onClose: () => void }) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [restored, setRestored] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleRestore(id: string) {
    setOpenMenuId(null);
    setRestored(id);
    setTimeout(() => setRestored(null), 2000);
  }

  return (
    <div className="absolute inset-y-0 right-0 w-[300px] bg-white border-l border-[#e4e4e7] flex flex-col shadow-xl z-30">
      {/* Header */}
      <div className="bg-[#18181b] px-4 py-3.5 shrink-0 flex items-center gap-2.5">
        <History size={14} className="text-white/70 shrink-0" />
        <span className="text-sm font-semibold text-white flex-1">Version History</span>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto min-h-0" ref={menuRef}>
        {VERSION_HISTORY.map(group => (
          <div key={group.date}>
            <div className="sticky top-0 bg-[#fafafa] border-b border-[#e4e4e7] px-4 py-2 z-10">
              <p className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">{group.date}</p>
            </div>

            {group.versions.map(v => (
              <div
                key={v.id}
                className="relative px-4 py-3.5 border-b border-[#f4f4f5] hover:bg-[#fafafa] transition-colors group"
              >
                {/* Restored flash */}
                {restored === v.id && (
                  <div className="absolute inset-0 bg-[#f0fdf4] border-l-2 border-l-[#16a34a] flex items-center justify-center pointer-events-none z-10">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#16a34a]">
                      <Check size={12} />
                      Restored
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    {v.label && (
                      <span className={cn(
                        'text-[10px] font-semibold px-1.5 py-0.5 rounded-md border shrink-0',
                        v.isCurrent
                          ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]'
                          : 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]',
                      )}>
                        {v.label}
                      </span>
                    )}
                    <span className="text-xs font-medium text-[#18181b]">{v.timestamp}</span>
                  </div>

                  {/* ⋯ options menu */}
                  {!v.isCurrent && (
                    <div className="relative shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === v.id ? null : v.id); }}
                        className="w-6 h-6 flex items-center justify-center rounded-md text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreHorizontal size={13} />
                      </button>
                      {openMenuId === v.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#e4e4e7] rounded-lg shadow-lg z-20 py-1 overflow-hidden">
                          <button
                            onClick={() => handleRestore(v.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#18181b] hover:bg-[#fafafa] transition-colors text-left"
                          >
                            <RotateCcw size={12} className="text-[#71717a] shrink-0" />
                            Restore this version
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-[#71717a] leading-relaxed">{v.description}</p>
                <p className="text-[10px] text-[#a1a1aa] mt-1">{v.author.name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────

function ToolbarDivider() {
  return <div className="w-px h-4 bg-[#e4e4e7] shrink-0" />;
}

function ToolbarBtn({
  onClick, title, children, active,
}: { onClick?: () => void; title?: string; children: React.ReactNode; active?: boolean }) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick?.(); }}
      title={title}
      className={cn(
        'w-7 h-7 flex items-center justify-center rounded-md text-[#3f3f46] hover:bg-[#f4f4f5] transition-colors shrink-0',
        active && 'bg-[#ede9fe] text-[#7c3aed]',
      )}
    >
      {children}
    </button>
  );
}

function EditorToolbar({ editorRef }: { editorRef: React.RefObject<HTMLDivElement | null> }) {
  const exec = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  };

  return (
    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[#e4e4e7] flex-wrap bg-white sticky top-0 z-10">
      <button
        onMouseDown={e => e.preventDefault()}
        className="flex items-center gap-1 px-2 h-7 rounded-md text-xs font-medium text-[#3f3f46] hover:bg-[#f4f4f5] transition-colors"
      >
        <Type size={13} />
        <span>Normal</span>
        <ChevronDown size={11} className="text-[#a1a1aa]" />
      </button>

      <ToolbarDivider />

      <ToolbarBtn title="Bold" onClick={() => exec('bold')}><Bold size={13} /></ToolbarBtn>
      <ToolbarBtn title="Italic" onClick={() => exec('italic')}><Italic size={13} /></ToolbarBtn>
      <ToolbarBtn title="Underline" onClick={() => exec('underline')}><Underline size={13} /></ToolbarBtn>
      <ToolbarBtn title="Strikethrough" onClick={() => exec('strikeThrough')}><Strikethrough size={13} /></ToolbarBtn>

      <ToolbarDivider />

      <ToolbarBtn title="Bullet list" onClick={() => exec('insertUnorderedList')}><List size={13} /></ToolbarBtn>
      <ToolbarBtn title="Numbered list" onClick={() => exec('insertOrderedList')}><ListOrdered size={13} /></ToolbarBtn>
      <ToolbarBtn title="Indent" onClick={() => exec('indent')}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/><polyline points="17 8 21 12 17 16"/>
        </svg>
      </ToolbarBtn>
      <ToolbarBtn title="Outdent" onClick={() => exec('outdent')}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/><polyline points="7 8 3 12 7 16"/>
        </svg>
      </ToolbarBtn>

      <ToolbarDivider />

      <ToolbarBtn title="Link" onClick={() => {
        const url = window.prompt('Enter URL');
        if (url) exec('createLink', url);
      }}><Link2 size={13} /></ToolbarBtn>
      <ToolbarBtn title="Blockquote" onClick={() => exec('formatBlock', 'blockquote')}><Quote size={13} /></ToolbarBtn>

      <ToolbarDivider />

      <ToolbarBtn title="More"><MoreHorizontal size={13} /></ToolbarBtn>
    </div>
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────

interface LeftPanelProps {
  workflowName: string; setWorkflowName: (v: string) => void;
  whenToUse: string; setWhenToUse: (v: string) => void;
  channels: string[]; toggleChannel: (id: string) => void; setAllChannels: (all: boolean) => void;
  permissions: string[]; togglePermission: (id: string) => void;
  selectedStores: string[]; toggleStore: (id: string) => void;
}

function LeftPanel({
  workflowName, setWorkflowName,
  whenToUse, setWhenToUse,
  channels, toggleChannel, setAllChannels,
  permissions, togglePermission,
  selectedStores, toggleStore,
}: LeftPanelProps) {
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [storesOpen, setStoresOpen] = useState(false);
  const MAX_NAME = 60;

  return (
    <div className="w-[300px] shrink-0 border-r border-[#e4e4e7] overflow-y-auto bg-white flex flex-col">
      <div className="px-5 py-5 space-y-6">

        {/* ── Workflow Details ── */}
        <div>
          <SectionTitle>Workflow Details</SectionTitle>

          <div className="mb-4">
            <label className="block text-xs font-medium text-[#3f3f46] mb-1.5">Workflow name</label>
            <div className="relative">
              <input
                type="text"
                value={workflowName}
                onChange={e => setWorkflowName(e.target.value.slice(0, MAX_NAME))}
                placeholder="e.g. Refund Handling Flow"
                className="w-full rounded-lg border border-[#e4e4e7] px-3 py-2 text-sm text-[#18181b] placeholder:text-[#a1a1aa] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/10 transition-colors pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#a1a1aa] tabular-nums">
                {workflowName.length}/{MAX_NAME}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-[#3f3f46] mb-1">When to use this workflow</label>
            <p className="text-[11px] text-[#a1a1aa] mb-1.5">Define when this workflow should be triggered.</p>
            <textarea
              value={whenToUse}
              onChange={e => setWhenToUse(e.target.value)}
              rows={3}
              placeholder="e.g. Use this workflow when a customer requests a refund, return, or exchange for an order."
              className="w-full rounded-lg border border-[#e4e4e7] px-3 py-2 text-sm text-[#18181b] placeholder:text-[#a1a1aa] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/10 transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="border-t border-[#e4e4e7]" />

        {/* ── Applies to Channels ── */}
        <div>
          <button
            onClick={() => setChannelsOpen(p => !p)}
            className="w-full flex items-center justify-between mb-1"
          >
            <SectionTitle className="mb-0">Applies to Channels</SectionTitle>
            <div className="flex items-center gap-2 shrink-0">
              {!channelsOpen && (
                <span className="text-[11px] text-[#7c3aed] bg-[#ede9fe] border border-[#ddd6fe] rounded-md px-1.5 py-0.5 font-medium">
                  {channels.length === CHANNELS.length ? 'All channels' : `${channels.length} selected`}
                </span>
              )}
              <ChevronDown
                size={14}
                className={cn('text-[#a1a1aa] transition-transform', channelsOpen ? 'rotate-0' : '-rotate-90')}
              />
            </div>
          </button>
          {channelsOpen && (
            <div className="rounded-xl border border-[#e4e4e7] overflow-hidden divide-y divide-[#f4f4f5] mt-2">
              <Checkbox
                checked={channels.length === CHANNELS.length}
                onChange={() => setAllChannels(channels.length !== CHANNELS.length)}
                label="All channels"
              />
              {CHANNELS.map(ch => (
                <Checkbox
                  key={ch.id}
                  checked={channels.includes(ch.id)}
                  onChange={() => toggleChannel(ch.id)}
                  label={ch.label}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#e4e4e7]" />

        {/* ── Store Linking ── */}
        <div>
          <button
            onClick={() => setStoresOpen(p => !p)}
            className="w-full flex items-center justify-between mb-1"
          >
            <SectionTitle className="mb-0">Store Linking</SectionTitle>
            <div className="flex items-center gap-2 shrink-0">
              {!storesOpen && (
                <span className="text-[11px] text-[#7c3aed] bg-[#ede9fe] border border-[#ddd6fe] rounded-md px-1.5 py-0.5 font-medium">
                  {selectedStores.includes('all') || selectedStores.length === STORES.length
                    ? 'All stores'
                    : `${selectedStores.length} selected`}
                </span>
              )}
              <ChevronDown
                size={14}
                className={cn('text-[#a1a1aa] transition-transform', storesOpen ? 'rotate-0' : '-rotate-90')}
              />
            </div>
          </button>
          {storesOpen && (
            <div className="rounded-xl border border-[#e4e4e7] overflow-hidden divide-y divide-[#f4f4f5] bg-white mt-2">
              {STORES.map(store => {
                const checked = selectedStores.includes(store.id);
                return (
                  <button
                    key={store.id}
                    onClick={() => toggleStore(store.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#faf5ff] transition-colors text-left"
                  >
                    <div className={cn(
                      'w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors',
                      checked ? 'bg-[#7c3aed] border-[#7c3aed]' : 'border-[#d4d4d8]',
                    )}>
                      {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-sm shrink-0">{store.flag}</span>
                    <span className="text-sm text-[#18181b] flex-1 text-left">{store.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-[#e4e4e7]" />

        {/* ── Permissions ── */}
        <div>
          <button
            onClick={() => setPermissionsOpen(p => !p)}
            className="w-full flex items-center justify-between mb-1"
          >
            <SectionTitle className="mb-0">Permissions</SectionTitle>
            <ChevronDown
              size={14}
              className={cn('text-[#a1a1aa] transition-transform shrink-0', permissionsOpen ? 'rotate-0' : '-rotate-90')}
            />
          </button>
          <p className="text-[11px] text-[#a1a1aa] mb-2 leading-relaxed">
            Actions and data the AI is allowed to access in this workflow.
          </p>
          {permissionsOpen && (
            <div className="rounded-xl border border-[#e4e4e7] overflow-hidden divide-y divide-[#f4f4f5]">
              {PERMISSIONS_LIST.map(p => (
                <Checkbox
                  key={p.id}
                  checked={permissions.includes(p.id)}
                  onChange={() => togglePermission(p.id)}
                  label={p.label}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Center Panel ─────────────────────────────────────────────────────

const EDITOR_CLASSES = cn(
  'px-6 py-4 outline-none text-[#18181b] text-sm leading-relaxed w-full',
  '[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-[#18181b] [&_h3]:mt-3 [&_h3]:mb-1',
  '[&_p]:mb-2 [&_p]:text-[#3f3f46]',
  '[&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1.5 [&_ol]:list-decimal',
  '[&_ul]:pl-5 [&_ul]:mb-2 [&_ul]:space-y-1 [&_ul]:list-disc',
  '[&_li]:text-[#3f3f46]',
  '[&_strong]:font-semibold [&_strong]:text-[#18181b]',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-[#7c3aed] [&_blockquote]:pl-4 [&_blockquote]:text-[#71717a] [&_blockquote]:italic [&_blockquote]:my-2',
  '[&_a]:text-[#7c3aed] [&_a]:underline',
);

function CenterPanel() {
  const workflowRef = useRef<HTMLDivElement>(null);
  const guardrailsRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (workflowRef.current) workflowRef.current.innerHTML = INITIAL_WORKFLOW_HTML;
    if (guardrailsRef.current) guardrailsRef.current.innerHTML = INITIAL_GUARDRAILS_HTML;
    countWords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countWords = useCallback(() => {
    const w = workflowRef.current?.innerText || '';
    const g = guardrailsRef.current?.innerText || '';
    const words = (w + ' ' + g).trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#fafafa]">
      <div className="px-8 py-5 border-b border-[#e4e4e7] bg-white shrink-0">
        <p className="text-sm font-semibold text-[#18181b]">Workflow Definition</p>
        <p className="text-xs text-[#71717a] mt-0.5">Define the steps, actions, and guidance for this workflow.</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6">
          <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden shadow-sm">
            <EditorToolbar editorRef={workflowRef} />

            <div className="flex items-center gap-3 px-6 py-2 border-b border-[#e4e4e7] bg-[#fafafa]">
              <span className="text-[11px] font-semibold text-[#16a34a] uppercase tracking-wider shrink-0">Workflow</span>
              <span className="text-[11px] text-[#a1a1aa]">Steps the AI should follow</span>
            </div>
            <div
              ref={workflowRef}
              contentEditable
              suppressContentEditableWarning
              onInput={countWords}
              spellCheck={false}
              className={cn(EDITOR_CLASSES, 'min-h-[240px]')}
            />

            <div className="flex items-center gap-3 px-6 py-2 border-t border-b border-[#e4e4e7] bg-[#fafafa]">
              <span className="text-[11px] font-semibold text-[#dc2626] uppercase tracking-wider shrink-0">Guardrails</span>
              <span className="text-[11px] text-[#a1a1aa]">Rules the AI must not break</span>
            </div>
            <div
              ref={guardrailsRef}
              contentEditable
              suppressContentEditableWarning
              onInput={countWords}
              spellCheck={false}
              className={cn(EDITOR_CLASSES, 'min-h-[140px]')}
            />

            <div className="border-t border-[#e4e4e7] px-6 py-2.5 bg-[#fafafa] flex items-center justify-between">
              <input
                type="text"
                placeholder="Type '/' for commands, @ to link workflows…"
                className="flex-1 text-xs text-[#18181b] bg-transparent outline-none placeholder:text-[#a1a1aa]"
              />
              <span className="text-[11px] text-[#a1a1aa] shrink-0 tabular-nums ml-3">{wordCount} words</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel (AI) ─────────────────────────────────────────────────

function RightPanel() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
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
        content: 'Got it — I\'ve noted your request. Would you like me to update the workflow steps or add a guardrail for this?',
      }]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="w-[280px] shrink-0 border-l border-[#e4e4e7] flex flex-col bg-white overflow-hidden">
      <div className="bg-[#18181b] px-4 py-3.5 shrink-0 flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <Sparkles size={11} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-white flex-1">AI Assistant</span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-5 text-center">
            <div className="w-8 h-8 rounded-full bg-[#18181b] flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <p className="text-xs text-[#71717a] leading-relaxed">
              Ask me to add steps, write guardrails, or improve this workflow using plain English.
            </p>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={cn('flex gap-2.5', m.role === 'user' ? 'justify-end' : 'justify-start items-start')}>
                {m.role === 'ai' && (
                  <div className="w-5 h-5 rounded-full bg-[#18181b] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={10} className="text-white" />
                  </div>
                )}
                <div className={cn(
                  'max-w-[82%] text-xs leading-relaxed',
                  m.role === 'user'
                    ? 'bg-[#f4f4f5] text-[#18181b] rounded-2xl rounded-br-sm px-3 py-2'
                    : 'text-[#3f3f46]',
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="px-3 pb-3 pt-2 shrink-0">
        <div className="rounded-2xl border border-[#e4e4e7] bg-white shadow-sm overflow-hidden">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="How can I help you today?"
            className="w-full px-3.5 pt-3 pb-2 text-xs bg-transparent outline-none placeholder:text-[#a1a1aa] text-[#18181b] resize-none leading-relaxed block"
            style={{ height: 'auto', minHeight: '40px' }}
          />
          <div className="flex items-center justify-end px-2.5 pb-2">
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#18181b] text-white disabled:opacity-25 hover:bg-[#27272a] transition-colors shrink-0"
            >
              <Plus size={13} className="rotate-45" />
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

// ─── Validation modal ─────────────────────────────────────────────────

function ValidationModal({ errors, onClose }: { errors: string[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-xl w-[400px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e4e7]">
          <p className="text-sm font-semibold text-[#18181b]">Required fields missing</p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f4f4f5] transition-colors text-[#71717a]">
            <X size={14} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-2">
          {errors.map((e, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] text-[#dc2626] font-bold">!</span>
              </div>
              <p className="text-sm text-[#3f3f46]">{e}</p>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-[#e4e4e7] bg-[#fafafa] flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors">
            Fix issues
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────

export default function CreateWorkflowPage() {
  const [workflowName, setWorkflowName] = useState('Refund Handling Flow');
  const [whenToUse, setWhenToUse] = useState('Use this workflow when a customer requests a refund, return, or exchange for an order.');
  const [channels, setChannels] = useState(CHANNELS.map(c => c.id));
  const [permissions, setPermissions] = useState(['view_orders', 'issue_refunds', 'access_customer']);
  const [selectedStores, setSelectedStores] = useState(STORES.map(s => s.id));
  const [enabled, setEnabled] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[] | null>(null);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setOptionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleChannel = (id: string) =>
    setChannels(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  const setAllChannels = (all: boolean) =>
    setChannels(all ? CHANNELS.map(c => c.id) : []);
  const togglePermission = (id: string) =>
    setPermissions(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  const toggleStore = (id: string) => {
    if (id === 'all') {
      setSelectedStores(prev => prev.includes('all') ? [] : STORES.map(s => s.id));
    } else {
      setSelectedStores(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    }
  };

  const validate = () => {
    const errors: string[] = [];
    if (!workflowName.trim()) errors.push('Workflow name is required.');
    if (!whenToUse.trim()) errors.push('"When to use" description is required.');
    if (channels.length === 0) errors.push('At least one channel must be selected.');
    if (selectedStores.length === 0) errors.push('At least one store must be selected.');
    return errors;
  };

  const handleSave = () => {
    const errors = validate();
    if (errors.length > 0) { setValidationErrors(errors); return; }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar forceCollapsed />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── Header ── */}
        <header className="flex items-center gap-3 px-5 py-3 border-b border-[#e4e4e7] bg-white shrink-0">
          <Link href="/evo-ai/workflows" className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#18181b] transition-colors shrink-0 mr-2">
            <ArrowLeft size={14} />
            Back to Workflows
          </Link>

          <div className="flex-1 flex items-center justify-center gap-2.5">
            <span className="text-sm font-semibold text-[#18181b]">Create Workflow</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#fef9c3] text-[#854d0e] border border-[#fde047]">
              Draft
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 border-r border-[#e4e4e7] pr-3 mr-1">
              <span className="text-xs text-[#a1a1aa]">Last saved 2:34 PM</span>
              <div className="w-px h-3.5 bg-[#e4e4e7]" />
              <span className="text-xs text-[#71717a]">{enabled ? 'Enabled' : 'Disabled'}</span>
              <Toggle enabled={enabled} onChange={() => setEnabled(p => !p)} />
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] hover:text-[#18181b] transition-colors">
              <FlaskConical size={13} />
              Test Workflow
            </button>

            {/* Save Workflow */}
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors"
            >
              <Save size={13} />
              Save Workflow
            </button>

            {/* Options */}
            <div className="relative" ref={optionsRef}>
              <button
                onClick={() => setOptionsOpen(p => !p)}
                className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-lg border transition-colors',
                  optionsOpen
                    ? 'border-[#18181b] text-[#18181b] bg-[#f4f4f5]'
                    : 'border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] hover:text-[#18181b]',
                )}
              >
                <MoreHorizontal size={14} />
              </button>

              {optionsOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#e4e4e7] rounded-xl shadow-lg z-50 py-1.5 overflow-hidden">
                  <button
                    onClick={() => { setVersionHistoryOpen(p => !p); setOptionsOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#3f3f46] hover:bg-[#fafafa] transition-colors text-left"
                  >
                    <History size={14} className="text-[#71717a] shrink-0" />
                    Version History
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Three-column body ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          <LeftPanel
            workflowName={workflowName} setWorkflowName={setWorkflowName}
            whenToUse={whenToUse} setWhenToUse={setWhenToUse}
            channels={channels} toggleChannel={toggleChannel} setAllChannels={setAllChannels}
            permissions={permissions} togglePermission={togglePermission}
            selectedStores={selectedStores} toggleStore={toggleStore}
          />
          <CenterPanel />
          <RightPanel />

          {/* Version history drawer — overlays from the right */}
          {versionHistoryOpen && (
            <VersionHistoryPanel onClose={() => setVersionHistoryOpen(false)} />
          )}
        </div>
      </div>

      {validationErrors && (
        <ValidationModal errors={validationErrors} onClose={() => setValidationErrors(null)} />
      )}
    </div>
  );
}
