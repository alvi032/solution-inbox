'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Check, Search, Monitor, Smartphone } from 'lucide-react';
import StorefrontNav from './StorefrontNav';
import MobileSearchWidget from './MobileSearchWidget';
import SearchModal from './SearchModal';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SearchConfig = {
  // Desktop
  showTrending: boolean;
  trendingCount: number;
  showSuggestedCategories: boolean;
  categoryCount: 4 | 8;
  showHandpickedForYou: boolean;
  productCount: 4 | 8;
  showSearchWithAI: boolean;
  showLeftSidebar: boolean;
  showRecentSearches: boolean;
  recentCount: number;
  showAutoSuggestions: boolean;
  // Mobile
  mobileShowTrending: boolean;
  mobileTrendingCount: number;
  mobileShowSuggestedCategories: boolean;
  mobileCategoryCount: 4 | 8;
  mobileShowHandpickedForYou: boolean;
  mobileProductCount: 4 | 8;
  mobileShowRecentSearches: boolean;
  mobileRecentCount: number;
  mobileShowAutoSuggestions: boolean;
  mobileShowSearchWithAI: boolean;
};

export type ThemeConfig = {
  // Global
  fontFamily: string;
  shadow: 'none' | 'sm' | 'md' | 'lg';
  // Widget Container
  widgetBgColor: string;
  widgetOpacity: number;
  widgetBorderColor: string;
  widgetBorderWidth: number;
  widgetBorderRadius: number;
  // Search Input
  colorSearchInput: string;
  searchInputPlaceholderColor: string;
  searchInputBgColor: string;
  searchInputBorderColor: string;
  searchInputBorderWidth: number;
  searchInputBorderRadius: number;
  // Suggestions & Sidebar
  colorSuggestions: string;
  colorSuggestionHover: string;
  colorSuggestionActive: string;
  colorTrendingText: string;
  colorSidebarLabel: string;
  // Section Headers
  colorSectionLabel: string;
  // Product Cards
  cardBgColor: string;
  cardBorderColor: string;
  cardBorderWidth: number;
  cardBorderRadius: number;
  cardHoverEffect: 'none' | 'lift' | 'shadow' | 'scale';
  imageRatioW: number;
  imageRatioH: number;
  imageFit: 'cover' | 'contain';
  imageHoverZoom: boolean;
  colorCardName: string;
  showProductPrice: boolean;
  colorProductPrice: string;
  showProductDescription: boolean;
  colorProductDesc: string;
  // Category Cards
  inheritCategoryCardStyling: boolean;
  categoryCardBgColor: string;
  categoryCardBorderColor: string;
  categoryCardBorderWidth: number;
  categoryCardBorderRadius: number;
  colorCategoryName: string;
  showCategoryDescription: boolean;
  colorCategoryDesc: string;
};


// ─── Feature config components ────────────────────────────────────────────────

function ConfigToggle({ label, description, checked, onChange }: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9] last:border-0">
      <div className="flex flex-col">
        <span className="text-[14px] leading-[20px] text-[#334155]">{label}</span>
        {description && <span className="text-[12px] text-[#94a3b8]">{description}</span>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative flex items-center h-[22px] w-[40px] rounded-full px-[2px] transition-colors duration-200 shrink-0 ml-4 ${checked ? 'bg-[#18181b]' : 'bg-[#e4e4e7]'}`}
      >
        <span className={`block size-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

// ─── Theme config components ──────────────────────────────────────────────────

function ThemeRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-[7px] border-b border-[#f8fafc] last:border-0 gap-3">
      <span className="text-[12px] text-[#64748b] leading-none shrink-0">{label}</span>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function MiniToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative flex items-center h-[22px] w-[40px] rounded-full px-[2px] transition-colors duration-200 shrink-0 ${checked ? 'bg-[#18181b]' : 'bg-[#e4e4e7]'}`}
    >
      <span className={`block size-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`} />
    </button>
  );
}

function ImageFitControl({ value, onChange }: { value: 'cover' | 'contain'; onChange: (v: 'cover' | 'contain') => void }) {
  return (
    <div className="flex bg-[#f1f5f9] rounded-lg p-[3px] gap-[2px]">
      {(['cover', 'contain'] as const).map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-2.5 text-[11px] font-medium py-[5px] rounded-md transition-all duration-150 capitalize ${
            value === opt ? 'bg-white text-[#020617] shadow-sm' : 'text-[#64748b] hover:text-[#334155]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function HoverEffectControl({ value, onChange }: { value: 'none' | 'lift' | 'shadow' | 'scale'; onChange: (v: 'none' | 'lift' | 'shadow' | 'scale') => void }) {
  return (
    <div className="flex bg-[#f1f5f9] rounded-lg p-[3px] gap-[2px]">
      {(['none', 'lift', 'shadow', 'scale'] as const).map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 text-[11px] font-medium py-[5px] rounded-md transition-all duration-150 capitalize ${
            value === opt ? 'bg-white text-[#020617] shadow-sm' : 'text-[#64748b] hover:text-[#334155]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function CountToggle({ value, onChange }: { value: 4 | 8; onChange: (v: 4 | 8) => void }) {
  return (
    <div className="flex bg-[#f1f5f9] rounded-lg p-[3px] gap-[2px]">
      {([4, 8] as const).map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 text-[11px] font-medium py-[5px] rounded-md transition-all duration-150 ${
            value === opt ? 'bg-white text-[#020617] shadow-sm' : 'text-[#64748b] hover:text-[#334155]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ThemeSubLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold text-[#334155] uppercase tracking-wide mt-4 mb-0.5 first:mt-0">{children}</p>;
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="px-4 py-3 border-t border-[#f1f5f9] bg-[#fafafa]">
      <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide">{label}</p>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-[#94a3b8] mb-1.5">{children}</p>;
}

function CheckItem({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center gap-2 py-1 cursor-pointer select-none"
      onClick={() => onChange(!checked)}
    >
      <div className={`w-[15px] h-[15px] rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${
        checked ? 'bg-[#18181b] border-[#18181b]' : 'border-[#d1d5db] bg-white'
      }`}>
        {checked && <Check size={9} strokeWidth={3} className="text-white" />}
      </div>
      <span className="text-[13px] text-[#334155]">{label}</span>
    </div>
  );
}

function NumberInput({ value, onChange, min = 0, max = 99, suffix }: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  const [raw, setRaw] = useState(String(value));

  useEffect(() => { setRaw(String(value)); }, [value]);

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min={min}
        max={max}
        value={raw}
        onChange={e => {
          setRaw(e.target.value);
          const n = parseInt(e.target.value);
          onChange(isNaN(n) ? min : Math.max(min, Math.min(max, n)));
        }}
        onBlur={() => {
          const n = parseInt(raw);
          const clamped = isNaN(n) ? min : Math.max(min, Math.min(max, n));
          setRaw(String(clamped));
          onChange(clamped);
        }}
        className="w-[44px] text-[12px] border border-[#e5e7eb] rounded-md px-1.5 py-[3px] text-center text-[#334155] outline-none focus:border-[#a1a1aa]"
      />
      {suffix && <span className="text-[11px] text-[#94a3b8]">{suffix}</span>}
    </div>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [hexText, setHexText] = useState(value);

  useEffect(() => { setHexText(value); }, [value]);

  return (
    <div className="flex items-center gap-1.5">
      <label className="relative cursor-pointer shrink-0">
        <span className="block w-[20px] h-[20px] rounded-[3px] border border-[#d1d5db]" style={{ background: value }} />
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
      </label>
      <input
        value={hexText}
        onChange={e => {
          setHexText(e.target.value);
          if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChange(e.target.value);
        }}
        onBlur={() => { if (!/^#[0-9a-fA-F]{6}$/.test(hexText)) setHexText(value); }}
        placeholder="#000000"
        maxLength={7}
        className="w-[70px] text-[12px] font-mono border border-[#e5e7eb] rounded-md px-1.5 py-[3px] text-[#334155] outline-none focus:border-[#a1a1aa]"
      />
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3 py-[6px] border-b border-[#f8fafc] last:border-0">
      <span className="text-[12px] text-[#64748b] shrink-0 w-[90px]">{label}</span>
      <ColorPicker value={value} onChange={onChange} />
    </div>
  );
}

// ─── Scaled preview wrapper ───────────────────────────────────────────────────

function ScaledPreview({ children, naturalWidth }: { children: React.ReactNode; naturalWidth: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [leftOffset, setLeftOffset] = useState(0);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const update = () => {
      const cw = container.clientWidth;
      const s = Math.min(1, (cw * 0.95) / naturalWidth);
      setScale(s);
      setLeftOffset((cw - naturalWidth * s) / 2);
      // +48 gives the shadow room to bleed below without being clipped
      setScaledHeight(inner.scrollHeight * s + 48);
    };

    const ro = new ResizeObserver(update);
    ro.observe(container);
    ro.observe(inner);
    update();
    return () => ro.disconnect();
  }, [naturalWidth]);

  return (
    <div ref={containerRef} className="w-full" style={{ height: scaledHeight }}>
      <div
        ref={innerRef}
        style={{
          width: naturalWidth,
          transformOrigin: 'top left',
          transform: `translate(${leftOffset}px, 0) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SearchTestPage() {
  const [activeTab, setActiveTab] = useState<'features' | 'theme'>('features');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const [config, setConfig] = useState<SearchConfig>({
    showTrending: true,
    trendingCount: 5,
    showSuggestedCategories: true,
    categoryCount: 4,
    showHandpickedForYou: true,
    productCount: 4,
    showSearchWithAI: true,
    showLeftSidebar: true,
    showRecentSearches: true,
    recentCount: 5,
    showAutoSuggestions: true,
    mobileShowTrending: true,
    mobileTrendingCount: 8,
    mobileShowSuggestedCategories: true,
    mobileCategoryCount: 4,
    mobileShowHandpickedForYou: true,
    mobileProductCount: 4,
    mobileShowRecentSearches: true,
    mobileRecentCount: 8,
    mobileShowAutoSuggestions: true,
    mobileShowSearchWithAI: true,
  });

  const [theme, setTheme] = useState<ThemeConfig>({
    // Global
    fontFamily: 'Inter',
    shadow: 'none',
    // Widget Container
    widgetBgColor: '#ffffff',
    widgetOpacity: 100,
    widgetBorderColor: '#e5e7eb',
    widgetBorderWidth: 1,
    widgetBorderRadius: 12,
    // Search Input
    colorSearchInput: '#18181b',
    searchInputPlaceholderColor: '#a1a1aa',
    searchInputBgColor: '#ffffff',
    searchInputBorderColor: '#e5e7eb',
    searchInputBorderWidth: 0,
    searchInputBorderRadius: 0,
    // Suggestions & Sidebar
    colorSuggestions: '#64748b',
    colorSuggestionHover: '#f1f5f9',
    colorSuggestionActive: '#e2e8f0',
    colorTrendingText: '#64748b',
    colorSidebarLabel: '#020617',
    // Section Headers
    colorSectionLabel: '#020617',
    // Product Cards
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
    showProductDescription: true,
    colorProductDesc: '#475569',
    // Category Cards
    inheritCategoryCardStyling: true,
    categoryCardBgColor: '#ffffff',
    categoryCardBorderColor: '#e5e7eb',
    categoryCardBorderWidth: 1,
    categoryCardBorderRadius: 6,
    colorCategoryName: '#334155',
    showCategoryDescription: false,
    colorCategoryDesc: '#64748b',
  });

  function update<K extends keyof SearchConfig>(key: K, value: SearchConfig[K]) {
    setConfig(prev => ({ ...prev, [key]: value }));
  }

  function updateTheme<K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) {
    setTheme(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <StorefrontNav config={config} theme={theme} />

      {/* Page tab strip */}
      <div className="border-b border-[#e5e7eb] bg-white h-10 shrink-0">
        <div className="max-w-[1280px] mx-auto h-full flex items-center gap-0.5 px-5">
          <Link href="/search-test" className="px-3 h-7 flex items-center text-[13px] rounded-md font-medium text-[#020617] bg-[#f4f4f5]">
            Configuration
          </Link>
          <Link href="/search-test/ab-test" className="px-3 h-7 flex items-center text-[13px] rounded-md text-[#71717a] hover:text-[#334155] hover:bg-[#f4f4f5] transition-colors">
            A/B Testing
          </Link>
        </div>
      </div>

      <main className="flex-1 overflow-hidden bg-[#f9f9f9]">
        <div className="h-full max-w-[1280px] mx-auto flex gap-4 p-6">

          {/* Left panel: Features / Theme tabs */}
          <div className="w-[400px] shrink-0 bg-white rounded-xl border border-[#e5e7eb] flex flex-col overflow-hidden">
            <div className="flex border-b border-[#e5e7eb] shrink-0">
              {(['features', 'theme'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 h-10 text-[13px] font-medium border-b-2 -mb-px transition-colors capitalize ${
                    activeTab === tab
                      ? 'text-[#020617] border-[#18181b]'
                      : 'text-[#71717a] border-transparent hover:text-[#334155]'
                  }`}
                >
                  {tab === 'features' ? 'Features' : 'Theme'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'features' ? (
                <>
                  {/* Device sub-tabs — synced with live preview mode */}
                  <div className="flex border-b border-[#e5e7eb] px-4 bg-white sticky top-0 z-10">
                    {(['desktop', 'mobile'] as const).map(device => (
                      <button
                        key={device}
                        onClick={() => setPreviewMode(device)}
                        className={`flex items-center gap-1.5 mr-5 py-3 text-[12px] font-medium border-b-2 -mb-px transition-colors capitalize ${
                          previewMode === device
                            ? 'text-[#020617] border-[#18181b]'
                            : 'text-[#71717a] border-transparent hover:text-[#334155]'
                        }`}
                      >
                        {device === 'desktop' ? <Monitor size={12} /> : <Smartphone size={12} />}
                        {device}
                      </button>
                    ))}
                  </div>

                  <div className="px-4 pb-6">
                    {previewMode === 'desktop' ? (
                      <>
                        <div className="pt-3">
                          <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wide mb-1">Default view</p>
                          <ConfigToggle label="Suggested Categories" checked={config.showSuggestedCategories} onChange={v => update('showSuggestedCategories', v)} />
                          <ConfigToggle label="Handpicked for you" checked={config.showHandpickedForYou} onChange={v => update('showHandpickedForYou', v)} />
                        </div>
                        <div className="pt-4">
                          <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wide mb-1">Search results</p>
                          <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9]">
                            <span className="text-[14px] text-[#334155]">Recommended Categories</span>
                            <CountToggle value={config.categoryCount} onChange={v => update('categoryCount', v)} />
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9]">
                            <span className="text-[14px] text-[#334155]">Matching Products</span>
                            <CountToggle value={config.productCount} onChange={v => update('productCount', v)} />
                          </div>
                        </div>
                        <div className="pt-4">
                          <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wide mb-1">Left sidebar</p>
                          <ConfigToggle label="Show left sidebar" checked={config.showLeftSidebar} onChange={v => update('showLeftSidebar', v)} />
                          <ConfigToggle label="Trending" description="Shown in default state" checked={config.showTrending} onChange={v => update('showTrending', v)} />
                          {config.showTrending && (
                            <div className="flex items-center gap-2 py-2 border-b border-[#f1f5f9] pl-1">
                              <span className="text-[12px] text-[#94a3b8]">Show</span>
                              <NumberInput value={config.trendingCount} onChange={v => update('trendingCount', v)} min={1} max={8} />
                              <span className="text-[12px] text-[#94a3b8]">items</span>
                            </div>
                          )}
                          <ConfigToggle label="Recent searches" description="Shown in default state" checked={config.showRecentSearches} onChange={v => update('showRecentSearches', v)} />
                          {config.showLeftSidebar && config.showRecentSearches && (
                            <div className="flex items-center gap-2 py-2 border-b border-[#f1f5f9] pl-1">
                              <span className="text-[12px] text-[#94a3b8]">Show</span>
                              <NumberInput value={config.recentCount} onChange={v => update('recentCount', v)} min={1} max={8} />
                              <span className="text-[12px] text-[#94a3b8]">items</span>
                            </div>
                          )}
                          <ConfigToggle label="Auto-suggestions" description="Shown while typing" checked={config.showAutoSuggestions} onChange={v => update('showAutoSuggestions', v)} />
                        </div>
                        <div className="pt-4">
                          <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wide mb-1">Search with AI</p>
                          <ConfigToggle label="Enable Search with AI" checked={config.showSearchWithAI} onChange={v => update('showSearchWithAI', v)} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="pt-3">
                          <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wide mb-1">Default view</p>
                          <ConfigToggle label="Suggested Categories" checked={config.mobileShowSuggestedCategories} onChange={v => update('mobileShowSuggestedCategories', v)} />
                          <ConfigToggle label="Handpicked for you" checked={config.mobileShowHandpickedForYou} onChange={v => update('mobileShowHandpickedForYou', v)} />
                        </div>
                        <div className="pt-4">
                          <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wide mb-1">Search results</p>
                          <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9]">
                            <span className="text-[14px] text-[#334155]">Recommended Categories</span>
                            <CountToggle value={config.mobileCategoryCount} onChange={v => update('mobileCategoryCount', v)} />
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9]">
                            <span className="text-[14px] text-[#334155]">Matching Products</span>
                            <CountToggle value={config.mobileProductCount} onChange={v => update('mobileProductCount', v)} />
                          </div>
                        </div>
                        <div className="pt-4">
                          <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wide mb-1">Suggestions</p>
                          <ConfigToggle label="Trending" checked={config.mobileShowTrending} onChange={v => update('mobileShowTrending', v)} />
                          {config.mobileShowTrending && (
                            <div className="flex items-center gap-2 py-2 border-b border-[#f1f5f9] pl-1">
                              <span className="text-[12px] text-[#94a3b8]">Show</span>
                              <NumberInput value={config.mobileTrendingCount} onChange={v => update('mobileTrendingCount', v)} min={1} max={20} />
                              <span className="text-[12px] text-[#94a3b8]">chips</span>
                            </div>
                          )}
                          <ConfigToggle label="Recent searches" checked={config.mobileShowRecentSearches} onChange={v => update('mobileShowRecentSearches', v)} />
                          {config.mobileShowRecentSearches && (
                            <div className="flex items-center gap-2 py-2 border-b border-[#f1f5f9] pl-1">
                              <span className="text-[12px] text-[#94a3b8]">Show</span>
                              <NumberInput value={config.mobileRecentCount} onChange={v => update('mobileRecentCount', v)} min={1} max={20} />
                              <span className="text-[12px] text-[#94a3b8]">chips</span>
                            </div>
                          )}
                          <ConfigToggle label="Auto-suggestions" description="Shown while typing" checked={config.mobileShowAutoSuggestions} onChange={v => update('mobileShowAutoSuggestions', v)} />
                        </div>
                        <div className="pt-4">
                          <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wide mb-1">Search with AI</p>
                          <ConfigToggle label="Enable Search with AI" checked={config.mobileShowSearchWithAI} onChange={v => update('mobileShowSearchWithAI', v)} />
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="pb-6">

                  {/* Global */}
                  <SectionDivider label="Global" />
                  <div className="px-4 py-2">
                    <ThemeRow label="Shadow">
                      <div className="flex bg-[#f1f5f9] rounded-lg p-[3px] gap-[2px]">
                        {(['none', 'sm', 'md', 'lg'] as const).map(opt => (
                          <button
                            key={opt}
                            onClick={() => updateTheme('shadow', opt)}
                            className={`px-2.5 text-[11px] font-medium py-[5px] rounded-md transition-all duration-150 capitalize ${
                              theme.shadow === opt ? 'bg-white text-[#020617] shadow-sm' : 'text-[#64748b] hover:text-[#334155]'
                            }`}
                          >
                            {opt === 'none' ? 'None' : opt === 'sm' ? 'Small' : opt === 'md' ? 'Medium' : 'Large'}
                          </button>
                        ))}
                      </div>
                    </ThemeRow>
                    <ThemeRow label="Font Family">
                      <select
                        value={theme.fontFamily}
                        onChange={e => updateTheme('fontFamily', e.target.value)}
                        className="text-[12px] border border-[#e5e7eb] rounded-md px-2 py-[4px] text-[#334155] bg-white outline-none focus:border-[#a1a1aa] w-[140px]"
                      >
                        <optgroup label="Sans-serif">
                          {['Inter', 'Roboto', 'Poppins', 'Montserrat'].map(f => <option key={f}>{f}</option>)}
                        </optgroup>
                        <optgroup label="Serif">
                          {['Playfair Display', 'Merriweather', 'Lora', 'EB Garamond'].map(f => <option key={f}>{f}</option>)}
                        </optgroup>
                      </select>
                    </ThemeRow>
                  </div>

                  {/* Widget Container */}
                  <SectionDivider label="Widget Container" />
                  <div className="px-4 py-2">
                    <ThemeRow label="Background Color"><ColorPicker value={theme.widgetBgColor} onChange={v => updateTheme('widgetBgColor', v)} /></ThemeRow>
                    <ThemeRow label="Background Opacity"><NumberInput value={theme.widgetOpacity} onChange={v => updateTheme('widgetOpacity', v)} min={0} max={100} suffix="%" /></ThemeRow>
                    <ThemeRow label="Border Color"><ColorPicker value={theme.widgetBorderColor} onChange={v => updateTheme('widgetBorderColor', v)} /></ThemeRow>
                    <ThemeRow label="Border Width"><NumberInput value={theme.widgetBorderWidth} onChange={v => updateTheme('widgetBorderWidth', v)} min={0} max={8} suffix="px" /></ThemeRow>
                    <ThemeRow label="Border Radius"><NumberInput value={theme.widgetBorderRadius} onChange={v => updateTheme('widgetBorderRadius', v)} min={0} max={40} suffix="px" /></ThemeRow>
                  </div>

                  {/* Search Input */}
                  <SectionDivider label="Search Input" />
                  <div className="px-4 py-2">
                    <ThemeRow label="Text Color"><ColorPicker value={theme.colorSearchInput} onChange={v => updateTheme('colorSearchInput', v)} /></ThemeRow>
                    <ThemeRow label="Placeholder Color"><ColorPicker value={theme.searchInputPlaceholderColor} onChange={v => updateTheme('searchInputPlaceholderColor', v)} /></ThemeRow>
                    <ThemeRow label="Background Color"><ColorPicker value={theme.searchInputBgColor} onChange={v => updateTheme('searchInputBgColor', v)} /></ThemeRow>
                    <ThemeRow label="Border Color"><ColorPicker value={theme.searchInputBorderColor} onChange={v => updateTheme('searchInputBorderColor', v)} /></ThemeRow>
                    <ThemeRow label="Border Width"><NumberInput value={theme.searchInputBorderWidth} onChange={v => updateTheme('searchInputBorderWidth', v)} min={0} max={8} suffix="px" /></ThemeRow>
                    <ThemeRow label="Border Radius"><NumberInput value={theme.searchInputBorderRadius} onChange={v => updateTheme('searchInputBorderRadius', v)} min={0} max={40} suffix="px" /></ThemeRow>
                  </div>

                  {/* Suggestions & Sidebar */}
                  <SectionDivider label="Suggestions & Sidebar" />
                  <div className="px-4 py-2">
                    <ThemeSubLabel>Suggestions</ThemeSubLabel>
                    <ThemeRow label="Text Color"><ColorPicker value={theme.colorSuggestions} onChange={v => updateTheme('colorSuggestions', v)} /></ThemeRow>
                    <ThemeRow label="Hover Color"><ColorPicker value={theme.colorSuggestionHover} onChange={v => updateTheme('colorSuggestionHover', v)} /></ThemeRow>
                    <ThemeRow label="Active Color"><ColorPicker value={theme.colorSuggestionActive} onChange={v => updateTheme('colorSuggestionActive', v)} /></ThemeRow>
                    <ThemeSubLabel>Trending Searches</ThemeSubLabel>
                    <ThemeRow label="Text Color"><ColorPicker value={theme.colorTrendingText} onChange={v => updateTheme('colorTrendingText', v)} /></ThemeRow>
                    <ThemeSubLabel>Section Labels</ThemeSubLabel>
                    <ThemeRow label="Text Color"><ColorPicker value={theme.colorSidebarLabel} onChange={v => updateTheme('colorSidebarLabel', v)} /></ThemeRow>
                  </div>

                  {/* Product Cards */}
                  <SectionDivider label="Product Cards" />
                  <div className="px-4 py-2">
                    <ThemeSubLabel>Card Appearance</ThemeSubLabel>
                    <ThemeRow label="Background Color"><ColorPicker value={theme.cardBgColor} onChange={v => updateTheme('cardBgColor', v)} /></ThemeRow>
                    <ThemeRow label="Border Color"><ColorPicker value={theme.cardBorderColor} onChange={v => updateTheme('cardBorderColor', v)} /></ThemeRow>
                    <ThemeRow label="Border Width"><NumberInput value={theme.cardBorderWidth} onChange={v => updateTheme('cardBorderWidth', v)} min={0} max={8} suffix="px" /></ThemeRow>
                    <ThemeRow label="Border Radius"><NumberInput value={theme.cardBorderRadius} onChange={v => updateTheme('cardBorderRadius', v)} min={0} max={99} suffix="px" /></ThemeRow>
                    <ThemeRow label="Hover Effect">
                      <HoverEffectControl value={theme.cardHoverEffect} onChange={v => updateTheme('cardHoverEffect', v)} />
                    </ThemeRow>
                    <ThemeSubLabel>Product Image</ThemeSubLabel>
                    <ThemeRow label="Aspect Ratio">
                      <div className="flex items-center gap-1.5">
                        <NumberInput value={theme.imageRatioW} onChange={v => updateTheme('imageRatioW', v)} min={1} max={99} />
                        <span className="text-[12px] text-[#94a3b8]">:</span>
                        <NumberInput value={theme.imageRatioH} onChange={v => updateTheme('imageRatioH', v)} min={1} max={99} />
                      </div>
                    </ThemeRow>
                    <ThemeRow label="Image Fit"><ImageFitControl value={theme.imageFit} onChange={v => updateTheme('imageFit', v)} /></ThemeRow>
                    <ThemeRow label="Hover Zoom"><MiniToggle checked={theme.imageHoverZoom} onChange={v => updateTheme('imageHoverZoom', v)} /></ThemeRow>
                    <ThemeSubLabel>Product Name</ThemeSubLabel>
                    <ThemeRow label="Text Color"><ColorPicker value={theme.colorCardName} onChange={v => updateTheme('colorCardName', v)} /></ThemeRow>
                    <ThemeSubLabel>Product Price</ThemeSubLabel>
                    <ThemeRow label="Show"><MiniToggle checked={theme.showProductPrice} onChange={v => updateTheme('showProductPrice', v)} /></ThemeRow>
                    {theme.showProductPrice && (
                      <ThemeRow label="Text Color"><ColorPicker value={theme.colorProductPrice} onChange={v => updateTheme('colorProductPrice', v)} /></ThemeRow>
                    )}
                    <ThemeSubLabel>Product Description</ThemeSubLabel>
                    <ThemeRow label="Show"><MiniToggle checked={theme.showProductDescription} onChange={v => updateTheme('showProductDescription', v)} /></ThemeRow>
                    {theme.showProductDescription && (
                      <ThemeRow label="Text Color"><ColorPicker value={theme.colorProductDesc} onChange={v => updateTheme('colorProductDesc', v)} /></ThemeRow>
                    )}
                  </div>

                  {/* Category Cards */}
                  <SectionDivider label="Category Cards" />
                  <div className="px-4 py-2">
                    <ThemeSubLabel>Card Appearance</ThemeSubLabel>
                    <ThemeRow label="Inherit product styling"><MiniToggle checked={theme.inheritCategoryCardStyling} onChange={v => updateTheme('inheritCategoryCardStyling', v)} /></ThemeRow>
                    {!theme.inheritCategoryCardStyling && (
                      <>
                        <ThemeRow label="Background Color"><ColorPicker value={theme.categoryCardBgColor} onChange={v => updateTheme('categoryCardBgColor', v)} /></ThemeRow>
                        <ThemeRow label="Border Color"><ColorPicker value={theme.categoryCardBorderColor} onChange={v => updateTheme('categoryCardBorderColor', v)} /></ThemeRow>
                        <ThemeRow label="Border Width"><NumberInput value={theme.categoryCardBorderWidth} onChange={v => updateTheme('categoryCardBorderWidth', v)} min={0} max={8} suffix="px" /></ThemeRow>
                        <ThemeRow label="Border Radius"><NumberInput value={theme.categoryCardBorderRadius} onChange={v => updateTheme('categoryCardBorderRadius', v)} min={0} max={99} suffix="px" /></ThemeRow>
                      </>
                    )}
                    <ThemeSubLabel>Category Name</ThemeSubLabel>
                    <ThemeRow label="Text Color"><ColorPicker value={theme.colorCategoryName} onChange={v => updateTheme('colorCategoryName', v)} /></ThemeRow>
                    <ThemeSubLabel>Category Description</ThemeSubLabel>
                    <ThemeRow label="Show"><MiniToggle checked={theme.showCategoryDescription} onChange={v => updateTheme('showCategoryDescription', v)} /></ThemeRow>
                    {theme.showCategoryDescription && (
                      <ThemeRow label="Text Color"><ColorPicker value={theme.colorCategoryDesc} onChange={v => updateTheme('colorCategoryDesc', v)} /></ThemeRow>
                    )}
                  </div>

                  {/* Section Headers */}
                  <SectionDivider label="Section Headers" />
                  <div className="px-4 py-2">
                    <ThemeRow label="Text Color"><ColorPicker value={theme.colorSectionLabel} onChange={v => updateTheme('colorSectionLabel', v)} /></ThemeRow>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* Right panel: live preview */}
          <div className="flex-1 min-w-0 bg-white rounded-xl border border-[#e5e7eb] flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between shrink-0">
              <p className="text-[13px] font-semibold text-[#020617]">Live Preview</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-[#f4f4f5] text-[#020617]' : 'text-[#a1a1aa] hover:text-[#64748b]'}`}
                >
                  <Monitor size={15} />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-[#f4f4f5] text-[#020617]' : 'text-[#a1a1aa] hover:text-[#64748b]'}`}
                >
                  <Smartphone size={15} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {previewMode === 'desktop' ? (
                <ScaledPreview naturalWidth={config.showLeftSidebar ? 1000 : 775}>
                  <SearchModal preview onClose={() => {}} config={config} theme={theme} />
                </ScaledPreview>
              ) : (
                <div
                  className="rounded-[44px] border-[10px] border-[#18181b] shadow-2xl overflow-hidden flex flex-col shrink-0"
                  style={{ width: 390, height: 844 }}
                >
                  {/* Mock mobile nav */}
                  <div className="h-16 border-b border-[#e5e7eb] bg-white shrink-0 flex items-center px-5">
                    <div className="w-7 h-7 rounded-md bg-[#18181b] flex items-center justify-center mr-auto">
                      <span className="text-white text-xs font-bold tracking-tight">S</span>
                    </div>
                    <Search size={18} className="text-[#52525b]" />
                  </div>
                  {/* Interactive mobile widget */}
                  <MobileSearchWidget preview onClose={() => {}} config={config} theme={theme} />
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
