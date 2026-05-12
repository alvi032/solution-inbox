'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppSidebar from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import {
  BookOpen, Plus, Search, Upload, FileText, Globe,
  ChevronRight, ArrowRight, MoreHorizontal, Check, X,
} from 'lucide-react';

// ─── Mock data ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'shipping', label: 'Shipping & Delivery', articles: 12 },
  { id: 'returns',  label: 'Returns & Refunds',   articles: 8  },
  { id: 'account',  label: 'Account & Orders',    articles: 15 },
  { id: 'products', label: 'Product Info',        articles: 6  },
];

const ARTICLES = [
  { id: '1', title: 'How long does shipping take?',         category: 'Shipping & Delivery', status: 'published', updated: '2 days ago' },
  { id: '2', title: 'How do I track my order?',             category: 'Shipping & Delivery', status: 'published', updated: '1 week ago' },
  { id: '3', title: 'What is your return policy?',          category: 'Returns & Refunds',   status: 'published', updated: '3 days ago' },
  { id: '4', title: 'How do I start a return?',             category: 'Returns & Refunds',   status: 'draft',     updated: '5 days ago' },
  { id: '5', title: 'How do I change or cancel my order?',  category: 'Account & Orders',    status: 'published', updated: '1 week ago' },
  { id: '6', title: 'Do you ship internationally?',         category: 'Shipping & Delivery', status: 'published', updated: '2 weeks ago' },
];

// ─── Onboarding tooltip ───────────────────────────────────────────────────────

function KBOnboardingGuide({ onDone }: { onDone: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pointer-events-none">
      <div className="relative pointer-events-auto mt-[60px] mr-6 w-[280px] bg-[#18181b] text-white rounded-2xl shadow-xl p-4">
        {/* Arrow pointing up toward the Import button */}
        <div className="absolute -top-2 right-14 w-4 h-4 bg-[#18181b] rotate-45 rounded-sm" />

        <div className="flex items-start gap-3 relative z-10 mb-3">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
            <Upload size={13} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold mb-0.5">Import your knowledge base</p>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Use the <strong className="text-white font-medium">Import</strong> button above to upload your FAQs, product guides, and help articles so EVO AI can answer accurately.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10 mb-3 bg-white/5 rounded-xl px-3 py-2.5">
          <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Globe size={11} className="text-white" />
          </div>
          <p className="text-[11px] text-white/70 leading-relaxed flex-1">
            You can also sync articles directly from your help centre URL.
          </p>
        </div>

        <button
          onClick={onDone}
          className="flex items-center gap-1 text-[11px] font-medium text-white/50 hover:text-white transition-colors relative z-10"
        >
          Done — continue setup <ArrowRight size={10} />
        </button>
      </div>
    </div>
  );
}

// ─── Import modal (triggered from onboarding guide area) ─────────────────────

function ImportModal({ onClose, onImport }: { onClose: () => void; onImport: () => void }) {
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);

  function handleImport() {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setDone(true);
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[440px] overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#f4f4f5]">
          <div>
            <p className="text-sm font-semibold text-[#18181b]">Import Knowledge Base</p>
            <p className="text-xs text-[#a1a1aa] mt-0.5">Choose how you'd like to add your content</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors">
            <X size={14} />
          </button>
        </div>

        {done ? (
          <div className="px-5 py-8 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center">
              <Check size={20} className="text-[#16a34a]" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-semibold text-[#18181b]">Import complete</p>
            <p className="text-xs text-[#71717a] text-center leading-relaxed max-w-xs">
              Your articles have been imported and are ready for EVO AI to use.
            </p>
            <button
              onClick={onImport}
              className="mt-2 inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-[#18181b] text-white text-sm font-medium hover:bg-[#27272a] transition-colors"
            >
              Continue to setup
              <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-2.5">
            {[
              { icon: <Upload size={15} />, label: 'Upload files', desc: 'CSV, PDF, or plain text' },
              { icon: <Globe size={15} />, label: 'Sync from URL', desc: 'Import from your help centre' },
              { icon: <FileText size={15} />, label: 'Paste text', desc: 'Copy & paste content directly' },
            ].map(opt => (
              <button
                key={opt.label}
                onClick={handleImport}
                disabled={importing}
                className="flex items-center gap-3 rounded-xl border border-[#e4e4e7] bg-[#fafafa] hover:border-[#18181b] hover:bg-white px-4 py-3 transition-all text-left disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center shrink-0 text-[#3f3f46]">
                  {importing ? (
                    <div className="w-3 h-3 rounded-full border-2 border-[#18181b] border-t-transparent animate-spin" />
                  ) : opt.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#18181b]">{opt.label}</p>
                  <p className="text-[11px] text-[#a1a1aa]">{opt.desc}</p>
                </div>
                <ChevronRight size={13} className="text-[#a1a1aa] ml-auto shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Inner page ───────────────────────────────────────────────────────────────

function KnowledgeBaseInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOnboarding = searchParams.get('onboarding') === 'alt';
  const [search, setSearch] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  function handleImportDone() {
    setShowImportModal(false);
    router.push('/onboarding/alt?completed=knowledge-base');
  }

  const filtered = ARTICLES.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      {/* Onboarding guide */}
      {isOnboarding && !showImportModal && (
        <KBOnboardingGuide onDone={() => router.push('/onboarding/alt?completed=knowledge-base')} />
      )}

      {/* Import modal */}
      {showImportModal && (
        <ImportModal onClose={() => setShowImportModal(false)} onImport={handleImportDone} />
      )}

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-8 py-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-xl font-semibold text-[#18181b]">Knowledge Base</h1>
              <p className="text-sm text-[#71717a] mt-0.5">
                Manage articles and content that power your AI support agent.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] hover:text-[#18181b] transition-colors"
                id="import-kb-btn"
              >
                <Upload size={13} />
                Import
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors">
                <Plus size={13} />
                New article
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total articles', value: '41' },
              { label: 'Published',      value: '35' },
              { label: 'Drafts',         value: '6'  },
              { label: 'Categories',     value: '4'  },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-[#e4e4e7] px-5 py-4">
                <p className="text-2xl font-bold text-[#18181b]">{stat.value}</p>
                <p className="text-xs text-[#71717a] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[220px_1fr] gap-6">

            {/* Sidebar: categories */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a1a1aa] mb-2 px-2">Categories</p>
              <div className="flex flex-col gap-0.5">
                <button className="flex items-center justify-between px-2 py-2 rounded-lg bg-[#f4f4f5] text-xs font-medium text-[#18181b] text-left">
                  <span>All articles</span>
                  <span className="text-[#a1a1aa]">41</span>
                </button>
                {CATEGORIES.map(cat => (
                  <button key={cat.id} className="flex items-center justify-between px-2 py-2 rounded-lg text-xs text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors text-left">
                    <span>{cat.label}</span>
                    <span className="text-[#a1a1aa]">{cat.articles}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Articles list */}
            <div>
              {/* Search */}
              <div className="relative mb-4">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
                <input
                  type="text"
                  placeholder="Search articles…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 h-8 text-xs rounded-lg border border-[#e4e4e7] bg-white outline-none focus:border-[#18181b] placeholder:text-[#d4d4d8]"
                />
              </div>

              <div className="flex flex-col gap-1">
                {filtered.map(article => (
                  <div
                    key={article.id}
                    className="flex items-center gap-3 rounded-xl border border-[#e4e4e7] bg-white px-4 py-3 hover:border-[#a1a1aa] transition-colors group cursor-pointer"
                  >
                    <FileText size={14} className="text-[#a1a1aa] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#18181b] truncate">{article.title}</p>
                      <p className="text-[11px] text-[#a1a1aa] mt-0.5">{article.category} · Updated {article.updated}</p>
                    </div>
                    <span className={cn(
                      'text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0',
                      article.status === 'published'
                        ? 'bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]'
                        : 'bg-[#f4f4f5] text-[#a1a1aa] border border-[#e4e4e7]'
                    )}>
                      {article.status}
                    </span>
                    <button className="w-6 h-6 flex items-center justify-center rounded-md text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] opacity-0 group-hover:opacity-100 transition-all shrink-0">
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default function KnowledgeBasePage() {
  return (
    <Suspense>
      <KnowledgeBaseInner />
    </Suspense>
  );
}
