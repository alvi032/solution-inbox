'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Check, TrendingUp, Clock, Search, LayoutGrid, HandHeart, WandSparkles, Activity, Users, MousePointerClick, Zap, FlaskConical } from 'lucide-react';
import type { SearchConfig, ThemeConfig } from '../page';

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_THEME: ThemeConfig = {
  fontFamily: 'Inter',
  shadow: 'none',
  widgetBgColor: '#ffffff',
  widgetOpacity: 100,
  widgetBorderColor: '#e5e7eb',
  widgetBorderWidth: 1,
  widgetBorderRadius: 12,
  colorSearchInput: '#18181b',
  searchInputPlaceholderColor: '#a1a1aa',
  searchInputBgColor: '#ffffff',
  searchInputBorderColor: '#e5e7eb',
  searchInputBorderWidth: 0,
  searchInputBorderRadius: 0,
  colorSuggestions: '#64748b',
  colorSuggestionHover: '#f1f5f9',
  colorSuggestionActive: '#e2e8f0',
  colorTrendingText: '#64748b',
  colorSidebarLabel: '#020617',
  colorSectionLabel: '#020617',
  cardBgColor: '#ffffff',
  cardBorderColor: '#e5e7eb',
  cardBorderWidth: 1,
  cardBorderRadius: 6,
  cardHoverEffect: 'none',
  imageRatioW: 1,
  imageRatioH: 1,
  imageFit: 'cover',
  imageHoverZoom: false,
  colorCardName: '#334155',
  showProductPrice: true,
  colorProductPrice: '#020617',
  showProductDescription: false,
  colorProductDesc: '#475569',
  inheritCategoryCardStyling: true,
  categoryCardBgColor: '#ffffff',
  categoryCardBorderColor: '#e5e7eb',
  categoryCardBorderWidth: 1,
  categoryCardBorderRadius: 6,
  colorCategoryName: '#334155',
  showCategoryDescription: false,
  colorCategoryDesc: '#64748b',
  enableProductScroll: false,
};

const VARIANT_A_DEFAULT: SearchConfig = {
  showTrending: true,
  trendingCount: 5,
  showSuggestedCategories: true,
  showHandpickedForYou: true,
  showSearchWithAI: true,
  showLeftSidebar: true,
  showRecentSearches: true,
  recentCount: 5,
  showAutoSuggestions: true,
  mobileShowTrending: true,
  mobileTrendingCount: 8,
  mobileShowSuggestedCategories: true,
  mobileShowHandpickedForYou: true,
  mobileShowRecentSearches: true,
  mobileRecentCount: 8,
  mobileShowAutoSuggestions: true,
  mobileShowSearchWithAI: true,
};

const VARIANT_B_DEFAULT: SearchConfig = {
  showTrending: true,
  trendingCount: 5,
  showSuggestedCategories: true,
  showHandpickedForYou: true,
  showSearchWithAI: true,
  showLeftSidebar: true,
  showRecentSearches: true,
  recentCount: 5,
  showAutoSuggestions: true,
  mobileShowTrending: true,
  mobileTrendingCount: 8,
  mobileShowSuggestedCategories: true,
  mobileShowHandpickedForYou: true,
  mobileShowRecentSearches: true,
  mobileRecentCount: 8,
  mobileShowAutoSuggestions: true,
  mobileShowSearchWithAI: true,
};

// ── Preview data ───────────────────────────────────────────────────────────────

const PREVIEW_CAT_IMGS = [
  'https://www.figma.com/api/mcp/asset/0ab7f4b9-bfc1-4f3c-a212-854b72129d43',
  'https://www.figma.com/api/mcp/asset/d1137e29-43a8-4813-8dd1-9fddf87064f9',
  'https://www.figma.com/api/mcp/asset/909d1ec9-2a7a-4cdd-a91d-ab3f79efb013',
  'https://www.figma.com/api/mcp/asset/700c6348-2c4c-44c4-b7ac-68d106e54984',
];
const PREVIEW_CATEGORIES = ['Gourmand', 'Candy', 'Rainforest', 'Perfume Oil'];
const PREVIEW_PRODUCTS = [
  { name: 'Sweven',        price: '$45', img: 'https://www.figma.com/api/mcp/asset/e74188b9-4157-4ef3-b8ca-7f1c8ba06fee' },
  { name: 'Kalon',         price: '$45', img: 'https://www.figma.com/api/mcp/asset/4e7935f1-a4c9-42fb-9b40-74a315c082b9' },
  { name: 'Sweet Addict',  price: '$45', img: 'https://www.figma.com/api/mcp/asset/354a27f6-2217-44b6-acc1-34b968a66c16' },
  { name: 'Cotton Clouds', price: '$45', img: 'https://www.figma.com/api/mcp/asset/8ea50724-9585-4acb-8523-fd213dbd6afb' },
];
const PREVIEW_RECENT = ['Perfume oil collection', 'Vanilla musk', 'Floral bouquet'];
const PREVIEW_TRENDING = ['Gourmand Citrus', 'Vanilla', 'Floral', 'Amber', 'Jasmine'];

// ── Analytics helpers ──────────────────────────────────────────────────────────

type VariantStats = {
  sessions: number;
  aiEngagement: number;
  categoriesCtr: number;
  productsCtr: number;
  sidebarEngagement: number;
};

function computeStats(config: SearchConfig, seed: number): VariantStats {
  return {
    sessions: seed,
    aiEngagement: !config.showSearchWithAI
      ? 0
      : config.aiDisplayStyle === 'cta' ? 23.1 : 15.4,
    categoriesCtr: config.showSuggestedCategories ? 36.2 : 0,
    productsCtr: config.showHandpickedForYou ? 25.1 : 0,
    sidebarEngagement: !config.showLeftSidebar
      ? 0
      : config.showRecentSearches ? 41.0 : 28.3,
  };
}

// ── Components ────────────────────────────────────────────────────────────────

function MiniToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex items-center h-[20px] w-[36px] rounded-full px-[2px] transition-colors duration-200 shrink-0 ${on ? 'bg-[#18181b]' : 'bg-[#e4e4e7]'}`}
    >
      <span className={`block size-[16px] rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? 'translate-x-[16px]' : 'translate-x-0'}`} />
    </button>
  );
}

function FeatureRow({ label, description, checked, onChange }: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#f1f5f9] last:border-0">
      <div>
        <p className="text-[13px] text-[#334155]">{label}</p>
        {description && <p className="text-[11px] text-[#94a3b8]">{description}</p>}
      </div>
      <MiniToggle on={checked} onToggle={() => onChange(!checked)} />
    </div>
  );
}

function AIStylePicker({ value, onChange }: { value: 'toggle' | 'cta'; onChange: (v: 'toggle' | 'cta') => void }) {
  return (
    <div className="py-2.5 border-b border-[#f1f5f9]">
      <p className="text-[11px] text-[#94a3b8] mb-1.5">Display style</p>
      <div className="flex bg-[#f1f5f9] rounded-lg p-[3px] gap-[3px]">
        {(['toggle', 'cta'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 text-[12px] font-medium py-1 rounded-md transition-all duration-150 ${
              value === opt ? 'bg-white text-[#020617] shadow-sm' : 'text-[#64748b] hover:text-[#334155]'
            }`}
          >
            {opt === 'toggle' ? 'Toggle' : 'CTA Button'}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Inline widget preview ─────────────────────────────────────────────────────

function InlineWidget({ config }: { config: SearchConfig }) {
  const [aiEnabled, setAiEnabled] = useState(false);

  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-[#e5e7eb] shadow-sm bg-white text-[13px]">
      {/* Search bar */}
      <div className="flex items-center gap-2 px-3 h-[40px] border-b border-[#e5e7eb]">
        <Search size={13} className="text-[#a1a1aa] shrink-0" />
        <span className="text-[12px] text-[#a1a1aa] flex-1 select-none">Search products…</span>
      </div>

      {/* Body */}
      <div className="flex">
        {/* Sidebar */}
        {config.showLeftSidebar && (
          <div className="w-[155px] shrink-0 border-r border-[#e5e7eb]">
            {/* AI */}
            {config.showSearchWithAI && (
              <div className={`border-b border-[#e5e7eb] ${config.aiDisplayStyle === 'toggle' ? 'flex items-center justify-between px-3 py-2' : 'p-2'}`}>
                {config.aiDisplayStyle === 'toggle' ? (
                  <>
                    <span className="text-[11.5px] font-semibold text-[#0f172a]">Search with AI</span>
                    <MiniToggle on={aiEnabled} onToggle={() => setAiEnabled(v => !v)} />
                  </>
                ) : (
                  <button
                    onClick={() => setAiEnabled(true)}
                    className="w-full flex items-center gap-1.5 bg-white border border-[#e5e7eb] hover:border-[#d0d0d4] text-[#334155] text-[11px] px-2 py-1.5 rounded-md transition-colors"
                  >
                    <WandSparkles size={11} className="text-[#94a3b8] shrink-0" />
                    <span className="truncate">Search with AI</span>
                  </button>
                )}
              </div>
            )}

            {/* Recent searches */}
            {config.showRecentSearches && (
              <div className={`pt-2 pb-1 ${config.showTrending ? 'border-b border-[#e5e7eb]' : ''}`}>
                {PREVIEW_RECENT.map((item) => (
                  <div key={item} className="flex items-center gap-1.5 px-3 py-[3px]">
                    <Clock size={9} className="shrink-0 text-[#a1a1aa]" />
                    <p className="text-[11px] text-[#64748b] truncate">{item}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Trending */}
            {config.showTrending && (
              <div className="pt-2 pb-2">
                <div className="flex items-center gap-1 px-3 pb-1">
                  <TrendingUp size={10} className="text-[#EF4444] shrink-0" />
                  <span className="text-[10.5px] font-semibold text-[#020617]">Trending</span>
                </div>
                {PREVIEW_TRENDING.slice(0, Math.min(config.trendingCount, 4)).map((chip) => (
                  <div key={chip} className="px-3 py-[3px]">
                    <p className="text-[11px] text-[#64748b] truncate">{chip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right panel */}
        <div className="flex-1 min-w-0 p-2.5 flex flex-col gap-2.5">
          {/* AI response */}
          {aiEnabled && (
            <div className="border-l-2 border-[#ef4444] pl-2">
              <p className="text-[10.5px] leading-[15px] text-[#020617]">AI-powered results for your search.</p>
            </div>
          )}

          {/* Categories */}
          {config.showSuggestedCategories && (
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <LayoutGrid size={11} className="text-[#EF4444]" />
                <span className="text-[11px] font-semibold text-[#020617]">Suggested Categories</span>
              </div>
              <div className="flex gap-1.5">
                {PREVIEW_CATEGORIES.map((cat, i) => (
                  <div key={cat} className="flex-1 min-w-0 border border-[#e5e7eb] rounded overflow-hidden">
                    <img src={PREVIEW_CAT_IMGS[i]} alt={cat} className="w-full aspect-square object-cover" />
                    <p className="px-1 py-0.5 text-[9.5px] font-medium text-[#334155] truncate">{cat}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {config.showHandpickedForYou && (
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <HandHeart size={11} className="text-[#EF4444]" />
                <span className="text-[11px] font-semibold text-[#020617]">Handpicked for you</span>
              </div>
              <div className="flex gap-1.5">
                {PREVIEW_PRODUCTS.map((p) => (
                  <div key={p.name} className="flex-1 min-w-0 border border-[#e5e7eb] rounded overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full aspect-square object-cover" />
                    <div className="px-1 py-1">
                      <p className="text-[9.5px] font-semibold text-[#334155] truncate">{p.name}</p>
                      <p className="text-[9.5px] text-[#020617]">{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty fallback */}
          {!config.showSuggestedCategories && !config.showHandpickedForYou && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-[11px] text-[#94a3b8]">All content sections disabled</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Analytics ─────────────────────────────────────────────────────────────────

function MetricBar({ label, a, b, unit = '%', higherIsBetter = true }: {
  label: string;
  a: number;
  b: number;
  unit?: string;
  higherIsBetter?: boolean;
}) {
  const max = Math.max(a, b, 0.1) * 1.25;
  const aWins = higherIsBetter ? a > b : a < b;
  const bWins = higherIsBetter ? b > a : b < a;
  const diff = a > 0 ? Math.abs((b - a) / a * 100) : 0;
  const significant = diff >= 5;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#334155]">{label}</span>
        {significant && (
          <span className={`text-[10.5px] font-medium px-1.5 py-0.5 rounded-full ${
            bWins ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fef9c3] text-[#854d0e]'
          }`}>
            {bWins ? `B +${diff.toFixed(0)}%` : `A +${diff.toFixed(0)}%`}
          </span>
        )}
      </div>
      {[{ label: 'A', value: a, wins: aWins, color: '#64748b' }, { label: 'B', value: b, wins: bWins, color: '#18181b' }].map(row => (
        <div key={row.label} className="flex items-center gap-2">
          <span className="text-[11px] text-[#94a3b8] w-3.5 shrink-0">{row.label}</span>
          <div className="flex-1 h-[6px] bg-[#f1f5f9] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(row.value / max) * 100}%`, backgroundColor: row.color }}
            />
          </div>
          <span className={`text-[12px] font-medium tabular-nums w-10 text-right ${row.wins ? 'text-[#020617]' : 'text-[#94a3b8]'}`}>
            {row.value > 0 ? `${row.value}${unit}` : '—'}
          </span>
          {row.wins && row.value > 0 && <span className="text-[10px] text-[#16a34a] font-bold w-3">↑</span>}
          {!row.wins && <span className="w-3" />}
        </div>
      ))}
    </div>
  );
}

// ── Variant card ──────────────────────────────────────────────────────────────

function VariantCard({
  label,
  badge,
  badgeColor,
  sessions,
  config,
  onChange,
}: {
  label: string;
  badge: string;
  badgeColor: string;
  sessions: number;
  config: SearchConfig;
  onChange: (c: SearchConfig) => void;
}) {
  function update<K extends keyof SearchConfig>(key: K, value: SearchConfig[K]) {
    onChange({ ...config, [key]: value });
  }

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden flex flex-col">
      {/* Card header */}
      <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[#020617]">Variant {label}</span>
          <span className={`text-[10.5px] font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={12} className="text-[#94a3b8]" />
          <span className="text-[12px] text-[#64748b] tabular-nums">{sessions.toLocaleString()} sessions</span>
          <span className="text-[11px] text-[#94a3b8]">· 50%</span>
        </div>
      </div>

      {/* Config */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-[10.5px] font-semibold text-[#94a3b8] uppercase tracking-wide mb-1">Features</p>

        <div className="mb-1">
          <p className="text-[10px] text-[#c0c9d4] uppercase tracking-wide pt-1 pb-0.5">Default view</p>
          <FeatureRow label="Suggested Categories" checked={config.showSuggestedCategories} onChange={v => update('showSuggestedCategories', v)} />
          <FeatureRow label="Handpicked for you" checked={config.showHandpickedForYou} onChange={v => update('showHandpickedForYou', v)} />
        </div>

        <div className="mb-1">
          <p className="text-[10px] text-[#c0c9d4] uppercase tracking-wide pt-1 pb-0.5">Left sidebar</p>
          <FeatureRow label="Show left sidebar" checked={config.showLeftSidebar} onChange={v => update('showLeftSidebar', v)} />
          {config.showLeftSidebar && (
            <>
              <FeatureRow label="Trending" description="Shown in default state" checked={config.showTrending} onChange={v => update('showTrending', v)} />
              <FeatureRow label="Recent searches" description="Shown in default state" checked={config.showRecentSearches} onChange={v => update('showRecentSearches', v)} />
              <FeatureRow label="Auto-suggestions" description="Shown while typing" checked={config.showAutoSuggestions} onChange={v => update('showAutoSuggestions', v)} />
            </>
          )}
        </div>

        <div>
          <p className="text-[10px] text-[#c0c9d4] uppercase tracking-wide pt-1 pb-0.5">Search with AI</p>
          <FeatureRow label="Enable Search with AI" checked={config.showSearchWithAI} onChange={v => update('showSearchWithAI', v)} />
          {config.showSearchWithAI && (
            <AIStylePicker value={config.aiDisplayStyle} onChange={v => update('aiDisplayStyle', v)} />
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="px-4 py-3 border-t border-[#f1f5f9] mt-2">
        <p className="text-[10.5px] font-semibold text-[#94a3b8] uppercase tracking-wide mb-2">Preview</p>
        <InlineWidget config={config} />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ABTestPage() {
  const [configA, setConfigA] = useState<SearchConfig>(VARIANT_A_DEFAULT);
  const [configB, setConfigB] = useState<SearchConfig>(VARIANT_B_DEFAULT);

  const statsA = useMemo(() => computeStats(configA, 12242), [configA]);
  const statsB = useMemo(() => computeStats(configB, 12605), [configB]);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">

        {/* Tab strip */}
        <div className="border-b border-[#e5e7eb] bg-white h-10 shrink-0">
          <div className="max-w-[1280px] mx-auto h-full flex items-center gap-0.5 px-5">
            <Link
              href="/search-test"
              className="px-3 h-7 flex items-center text-[13px] rounded-md text-[#71717a] hover:text-[#334155] hover:bg-[#f4f4f5] transition-colors"
            >
              Configuration
            </Link>
            <Link
              href="/search-test/ab-test"
              className="px-3 h-7 flex items-center text-[13px] rounded-md font-medium text-[#020617] bg-[#f4f4f5]"
            >
              A/B Testing
            </Link>
          </div>
        </div>

        <main className="flex-1 overflow-auto bg-[#f9f9f9] p-6">
          <div className="flex flex-col gap-4 max-w-[1280px] mx-auto">

            {/* ── Test overview ── */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] flex items-center justify-center shrink-0">
                  <FlaskConical size={16} className="text-[#16a34a]" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#020617]">Search Widget A/B Test</p>
                  <p className="text-[12px] text-[#64748b]">Started Jun 1, 2026 · 3 days running</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#64748b]" />
                    <span className="text-[12px] text-[#64748b]">Variant A · 50%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#18181b]" />
                    <span className="text-[12px] text-[#64748b]">Variant B · 50%</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-[#f0fdf4] text-[#16a34a] px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
                  <span className="text-[12px] font-medium">Running</span>
                </div>
              </div>
            </div>

            {/* ── Variant cards ── */}
            <div className="grid grid-cols-2 gap-4">
              <VariantCard
                label="A"
                badge="Baseline"
                badgeColor="bg-[#f1f5f9] text-[#475569]"
                sessions={statsA.sessions}
                config={configA}
                onChange={setConfigA}
              />
              <VariantCard
                label="B"
                badge="Challenger"
                badgeColor="bg-[#fef3c7] text-[#92400e]"
                sessions={statsB.sessions}
                config={configB}
                onChange={setConfigB}
              />
            </div>

            {/* ── Analytics ── */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={15} className="text-[#64748b]" />
                  <p className="text-[13px] font-semibold text-[#020617]">Analytics</p>
                </div>
                <span className="text-[11px] text-[#94a3b8]">24,847 total sessions · last 3 days</span>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-4 divide-x divide-[#f1f5f9] border-b border-[#e5e7eb]">
                {[
                  { icon: <Users size={14} />, label: 'Sessions A', value: statsA.sessions.toLocaleString() },
                  { icon: <Users size={14} />, label: 'Sessions B', value: statsB.sessions.toLocaleString() },
                  {
                    icon: <Zap size={14} />,
                    label: 'AI Engagement A',
                    value: statsA.aiEngagement > 0 ? `${statsA.aiEngagement}%` : '—',
                  },
                  {
                    icon: <Zap size={14} />,
                    label: 'AI Engagement B',
                    value: statsB.aiEngagement > 0 ? `${statsB.aiEngagement}%` : '—',
                    highlight: statsB.aiEngagement > statsA.aiEngagement,
                  },
                ].map((s, i) => (
                  <div key={i} className="px-5 py-4">
                    <div className={`flex items-center gap-1.5 mb-1 ${(s as any).highlight ? 'text-[#16a34a]' : 'text-[#94a3b8]'}`}>
                      {s.icon}
                      <span className="text-[11px]">{s.label}</span>
                      {(s as any).highlight && <span className="text-[10px] font-bold">↑ Winner</span>}
                    </div>
                    <p className={`text-[20px] font-semibold tabular-nums ${(s as any).highlight ? 'text-[#16a34a]' : 'text-[#020617]'}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Metric bars */}
              <div className="px-5 py-5 grid grid-cols-2 gap-x-10 gap-y-5">
                <MetricBar
                  label="AI Engagement Rate"
                  a={statsA.aiEngagement}
                  b={statsB.aiEngagement}
                />
                <MetricBar
                  label="Sidebar Engagement"
                  a={statsA.sidebarEngagement}
                  b={statsB.sidebarEngagement}
                />
                <MetricBar
                  label="Categories CTR"
                  a={statsA.categoriesCtr}
                  b={statsB.categoriesCtr}
                />
                <MetricBar
                  label="Products CTR"
                  a={statsA.productsCtr}
                  b={statsB.productsCtr}
                />
              </div>

              <div className="px-5 pb-4">
                <p className="text-[11px] text-[#94a3b8]">
                  Analytics update in real time as you change variant configurations. Metrics reflect simulated traffic patterns based on feature enablement and AI display style.
                </p>
              </div>
            </div>

          </div>
        </main>
    </div>
  );
}
