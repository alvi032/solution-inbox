'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, TrendingUp, LayoutGrid, HandHeart, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SearchConfig, ThemeConfig } from './page';

// ─── Static data ──────────────────────────────────────────────────────────────

const CAT_IMGS = [
  'https://www.figma.com/api/mcp/asset/0ab7f4b9-bfc1-4f3c-a212-854b72129d43',
  'https://www.figma.com/api/mcp/asset/d1137e29-43a8-4813-8dd1-9fddf87064f9',
  'https://www.figma.com/api/mcp/asset/909d1ec9-2a7a-4cdd-a91d-ab3f79efb013',
  'https://www.figma.com/api/mcp/asset/700c6348-2c4c-44c4-b7ac-68d106e54984',
  'https://www.figma.com/api/mcp/asset/0459e717-46ba-4ec3-b778-15fd9aaf8a5b',
];
const CATEGORIES = ['Gourmand', 'Candy', 'Gourmand Creme', 'Rainforest', 'Perfume Oil'];

const PRODUCTS = [
  { name: 'Sweven',        desc: 'Elegant citrus and amber scent.',  price: '$45', img: 'https://www.figma.com/api/mcp/asset/e74188b9-4157-4ef3-b8ca-7f1c8ba06fee' },
  { name: 'Kalon',         desc: 'Floral musk for lasting charm.',   price: '$45', img: 'https://www.figma.com/api/mcp/asset/4e7935f1-a4c9-42fb-9b40-74a315c082b9' },
  { name: 'Sweet Addict',  desc: 'Vanilla sophisticated fragrance.', price: '$45', img: 'https://www.figma.com/api/mcp/asset/354a27f6-2217-44b6-acc1-34b968a66c16' },
  { name: 'Cotton Clouds', desc: 'Bold woody jasmine allure.',       price: '$45', img: 'https://www.figma.com/api/mcp/asset/8ea50724-9585-4acb-8523-fd213dbd6afb' },
  { name: 'Lumière',       desc: 'Fresh bergamot and white tea.',    price: '$52', img: 'https://www.figma.com/api/mcp/asset/e74188b9-4157-4ef3-b8ca-7f1c8ba06fee' },
  { name: 'Noir Absolu',   desc: 'Deep oud and resinous musk.',     price: '$60', img: 'https://www.figma.com/api/mcp/asset/4e7935f1-a4c9-42fb-9b40-74a315c082b9' },
  { name: 'Bloom',         desc: 'Delicate rose and peony accord.', price: '$38', img: 'https://www.figma.com/api/mcp/asset/354a27f6-2217-44b6-acc1-34b968a66c16' },
  { name: 'Amber Oud',     desc: 'Warm amber and smoky oud.',       price: '$55', img: 'https://www.figma.com/api/mcp/asset/8ea50724-9585-4acb-8523-fd213dbd6afb' },
];

const TRENDING_CHIPS = [
  'Groumand Citrus Collection', 'Vanilla', 'Floral', 'Amber',
  "Creed's Aventus", 'Jasmine', 'Blue', 'Oil',
];

const RECENT_SEARCHES = [
  'Perfume oil collection', 'Vanilla musk', 'Floral bouquet', 'Amber noir',
  'Gourmand creme', 'Jasmine intense', 'Cotton clouds', 'Creed Aventus',
];

const SUGGESTION_LABELS = [
  'perfume oil', 'praise the perfume', 'peach',
  'perfume de marly valaya', 'peach rings', 'Perfume Oil Collection',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function highlightSuggestion(label: string, query: string) {
  if (!query) return [{ text: label, highlight: false }];
  const idx = label.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return [{ text: label, highlight: false }];
  return [
    { text: label.slice(0, idx), highlight: false },
    { text: label.slice(idx, idx + query.length), highlight: true },
    { text: label.slice(idx + query.length), highlight: false },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="shrink-0 text-[#EF4444]">{icon}</span>
      <span className="text-[16px] leading-[24px] font-semibold whitespace-nowrap" style={{ color }}>{label}</span>
    </div>
  );
}

function CategoryCard({ name, img, theme }: { name: string; img: string; theme: ThemeConfig }) {
  return (
    <div
      className="flex-1 min-w-0 overflow-hidden flex flex-col cursor-pointer"
      style={{
        border: `${theme.cardBorderWidth}px solid ${theme.cardBorderColor}`,
        borderRadius: `${theme.cardBorderRadius}px`,
        backgroundColor: theme.cardBgColor,
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: `${theme.imageRatioW} / ${theme.imageRatioH}`,
          borderBottom: `${theme.cardBorderWidth}px solid ${theme.cardBorderColor}`,
        }}
      >
        <img src={img} alt={name} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="px-2 pt-2 pb-[10px]">
        <p className="text-[14px] leading-[20px] font-semibold truncate" style={{ color: theme.colorCardName }}>{name}</p>
      </div>
    </div>
  );
}

function ProductCard({ name, desc, price, img, theme, scrollable = false }: {
  name: string; desc: string; price: string; img: string;
  theme: ThemeConfig; scrollable?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden flex flex-col cursor-pointer ${scrollable ? 'shrink-0' : 'flex-1 min-w-0'}`}
      style={{
        ...(scrollable ? { width: 'calc((100% - 30px) / 4)' } : {}),
        border: `${theme.cardBorderWidth}px solid ${theme.cardBorderColor}`,
        borderRadius: `${theme.cardBorderRadius}px`,
        backgroundColor: theme.cardBgColor,
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: `${theme.imageRatioW} / ${theme.imageRatioH}`,
          borderBottom: `${theme.cardBorderWidth}px solid ${theme.cardBorderColor}`,
        }}
      >
        <img src={img} alt={name} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="px-2 pt-2 pb-[10px] flex flex-col gap-0.5">
        <p className="text-[14px] leading-[20px] font-semibold" style={{ color: theme.colorCardName }}>{name}</p>
        {theme.showProductDescription && (
          <p className="text-[14px] leading-[20px] font-normal" style={{ color: theme.colorProductDesc }}>{desc}</p>
        )}
        {theme.showProductPrice && (
          <p className="text-[14px] leading-[20px] font-semibold" style={{ color: theme.colorProductPrice }}>{price}</p>
        )}
      </div>
    </div>
  );
}


function WandGradientIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="wand-color-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E45231" />
          <stop offset="100%" stopColor="#F04BF4" />
        </linearGradient>
      </defs>
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" stroke="url(#wand-color-grad)" />
      <path d="m14 7 3 3" stroke="url(#wand-color-grad)" />
      <path d="M5 6v4" stroke="url(#wand-color-grad)" />
      <path d="M19 14v4" stroke="url(#wand-color-grad)" />
      <path d="M10 2v2" stroke="url(#wand-color-grad)" />
      <path d="M7 8H3" stroke="url(#wand-color-grad)" />
      <path d="M21 16h-4" stroke="url(#wand-color-grad)" />
      <path d="M11 3H9" stroke="url(#wand-color-grad)" />
    </svg>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Bone({ className }: { className?: string }) {
  return <div className={cn('bg-[#f1f5f9] rounded-md animate-pulse', className)} />;
}

function RightPanelSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Bone className="h-[20px] w-[180px]" />
        <div className="flex gap-[10px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1 min-w-0 border border-[#e5e7eb] rounded-[6px] overflow-hidden">
              <Bone className="aspect-square w-full rounded-none" />
              <div className="px-2 pt-2 pb-[10px]"><Bone className="h-[14px] w-3/4" /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Bone className="h-[20px] w-[160px]" />
        <div className="flex gap-[10px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-1 min-w-0 border border-[#e5e7eb] rounded-[6px] overflow-hidden">
              <Bone className="aspect-square w-full rounded-none" />
              <div className="px-2 pt-2 pb-[10px] flex flex-col gap-1.5">
                <Bone className="h-[14px] w-2/3" />
                <Bone className="h-[12px] w-full" />
                <Bone className="h-[12px] w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onEnableAI }: { onEnableAI: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-[18px] leading-[28px] font-semibold text-[#020617]">No search results</p>
        <p className="text-[14px] leading-[20px] text-[#64748b] max-w-[280px]">
          We couldn't find anything matching your search. Try searching with AI for smarter results.
        </p>
      </div>
      <button
        onClick={onEnableAI}
        className="flex items-center gap-2 bg-[#020617] hover:bg-[#1e293b] text-white text-[14px] leading-[20px] font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        <Search size={14} />
        Search with AI
      </button>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function SearchModal({ onClose, config, theme, preview = false }: {
  onClose: () => void;
  config: SearchConfig;
  theme: ThemeConfig;
  preview?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const productsScrollRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isTyping = query.length > 0;

  const visibleCategories = CATEGORIES.slice(0, 4);
  const visibleCatImgs = CAT_IMGS.slice(0, 4);
  const visibleProducts = theme.enableProductScroll ? PRODUCTS : PRODUCTS.slice(0, 4);
  const visibleRecent = recentSearches.slice(0, config.recentCount);
  const visibleTrending = TRENDING_CHIPS.slice(0, config.trendingCount);

  function scrollProducts(dir: 'left' | 'right') {
    const el = productsScrollRef.current;
    if (!el) return;
    const pageSize = el.clientWidth + 10; // clientWidth + gap so next page aligns to card edge
    el.scrollBy({ left: dir === 'right' ? pageSize : -pageSize, behavior: 'smooth' });
  }

  function handleProductsScroll() {
    const el = productsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  const outerBorder = `${theme.widgetBorderWidth}px solid ${theme.widgetBorderColor}`;
  const topRadius = `${theme.widgetBorderRadius}px ${theme.widgetBorderRadius}px 0 0`;
  const bottomRadius = `0 0 ${theme.widgetBorderRadius}px ${theme.widgetBorderRadius}px`;
  const widgetShadow = { none: 'none', sm: '0 2px 8px rgba(0,0,0,0.08)', md: '0 8px 24px rgba(0,0,0,0.12)', lg: '0 16px 48px rgba(0,0,0,0.18)' }[theme.shadow];

  function renderRightPanel() {
    if (isLoading) return <RightPanelSkeleton />;
    if (showEmpty && !aiEnabled) return <EmptyState onEnableAI={() => setAiEnabled(true)} />;
    return (
      <>
        {/* AI response */}
        {isTyping && aiEnabled && (
          <div className="border-l-[2.5px] border-[#ef4444] pl-3">
            <p className="text-[16px] leading-[24px] text-[#020617]">
              Popular vanilla perfumes are leaning richer, warmer, and longer-lasting than ever.
              <br />
              Discover customer favorites across <strong>sweet gourmand</strong> and sophisticated <strong>amber-vanilla</strong> profiles.
            </p>
          </div>
        )}

        {/* Categories */}
        {(!isTyping && !config.showSuggestedCategories) ? null : (
          <div className="flex flex-col gap-2">
            <SectionLabel
              icon={<LayoutGrid size={16} />}
              label={isTyping ? 'Recommended Categories' : 'Suggested Categories'}
              color={theme.colorSectionLabel}
            />
            <div className="flex gap-[10px]">
              {visibleCategories.map((cat, i) => (
                <CategoryCard key={cat} name={cat} img={visibleCatImgs[i]} theme={theme} />
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {(!isTyping && !config.showHandpickedForYou) ? null : (
          <div className="flex flex-col gap-2">
            <SectionLabel
              icon={isTyping ? <Search size={16} /> : <HandHeart size={16} />}
              label={isTyping ? 'Matching Products' : 'Handpicked for you'}
              color={theme.colorSectionLabel}
            />
            <div className="relative">
              <div
                ref={productsScrollRef}
                onScroll={handleProductsScroll}
                className={`flex gap-[10px] ${theme.enableProductScroll ? 'overflow-x-auto scrollbar-hide' : ''}`}
              >
                {visibleProducts.map((p) => (
                  <ProductCard key={p.name} {...p} theme={theme} scrollable={theme.enableProductScroll} />
                ))}
              </div>
              {theme.enableProductScroll && canScrollLeft && (
                <button
                  onClick={() => scrollProducts('left')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-[#e5e7eb] rounded-full flex items-center justify-center shadow-md hover:bg-[#f4f4f5] transition-colors"
                >
                  <ChevronLeft size={14} className="text-[#334155]" />
                </button>
              )}
              {theme.enableProductScroll && canScrollRight && (
                <button
                  onClick={() => scrollProducts('right')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-[#e5e7eb] rounded-full flex items-center justify-center shadow-md hover:bg-[#f4f4f5] transition-colors"
                >
                  <ChevronRight size={14} className="text-[#334155]" />
                </button>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  useEffect(() => {
    if (preview) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, preview]);

  useEffect(() => {
    if (!isTyping) { setShowEmpty(false); return; }
    setIsLoading(true);
    setShowEmpty(false);
    const t = setTimeout(() => {
      setIsLoading(false);
      setShowEmpty(query.trim().toLowerCase() === 'empty');
    }, 1000);
    return () => clearTimeout(t);
  }, [query]);

  const widget = (
    <div
      className={`w-full flex flex-col ${preview ? '' : (config.showLeftSidebar ? 'max-w-[1000px]' : 'max-w-[775px]')}`}
      style={{ fontFamily: theme.fontFamily, opacity: theme.widgetOpacity / 100, borderRadius: `${theme.widgetBorderRadius}px`, boxShadow: widgetShadow }}
    >
        {/* Search bar */}
        <div
          className="flex items-center gap-3 px-5 h-[60px]"
          style={{
            backgroundColor: theme.widgetBgColor,
            border: outerBorder,
            borderBottom: 'none',
            borderRadius: topRadius,
          }}
        >
          <Search size={20} className="text-[#a1a1aa] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="flex-1 text-[16px] placeholder:text-[#a1a1aa] bg-transparent outline-none"
            style={{ color: theme.colorSearchInput }}
          />
          {isTyping && (
            <button
              onClick={() => setQuery('')}
              className="shrink-0 w-[20px] h-[20px] rounded-full bg-[#e4e4e7] hover:bg-[#d4d4d8] flex items-center justify-center transition-colors"
            >
              <X size={11} className="text-[#71717a]" />
            </button>
          )}
          {!preview && (
            <button
              onClick={onClose}
              className="text-[#a1a1aa] hover:text-[#18181b] transition-colors pl-4 ml-1"
              style={{ borderLeft: outerBorder }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Results panel */}
        <div
          className="flex overflow-hidden"
          style={{
            backgroundColor: theme.widgetBgColor,
            border: outerBorder,
            borderRadius: bottomRadius,
          }}
        >
          {/* ── Left sidebar ── */}
          {config.showLeftSidebar && (
            <div className="w-[225px] shrink-0 border-r border-[#e5e7eb] flex flex-col">
              {isTyping ? (
                <>
                  {/* Search with AI */}
                  {config.showSearchWithAI && (
                    <div className="px-3 pt-3 pb-2">
                      <button
                        onClick={() => setAiEnabled(true)}
                        className="search-ai-btn w-full flex items-center gap-2 border border-[#dfc49a] text-[#334155] text-[13px] font-normal px-3 py-2 rounded-lg group/ai"
                      >
                        <span className="text-left flex-1 leading-[18px]">
                          Search "{query}" with AI
                        </span>
                        <span className="wand-icon relative shrink-0 w-4 h-4" style={{ transform: 'scaleX(-1)' }}>
                          <WandGradientIcon size={16} />
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Autocomplete suggestions */}
                  {config.showAutoSuggestions && (
                    <div className="flex flex-col pb-4">
                      {SUGGESTION_LABELS.map((label) => {
                        const parts = highlightSuggestion(label, query);
                        return (
                          <button
                            key={label}
                            onClick={() => { setQuery(label); inputRef.current?.focus(); }}
                            className="flex items-center px-4 pt-[6px] pb-1 hover:bg-[#f8f8f8] text-left w-full"
                          >
                            <p className="text-[14px] leading-[20px] font-normal whitespace-nowrap overflow-hidden text-ellipsis">
                              {parts.map((part, i) =>
                                part.highlight
                                  ? <span key={i} className="text-[#020617]">{part.text}</span>
                                  : <span key={i} style={{ color: theme.colorSuggestions }}>{part.text}</span>
                              )}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                /* Default state: Recent Searches + Trending */
                <div className="flex flex-col">
                  {config.showRecentSearches && visibleRecent.length > 0 && (
                    <div className={`flex flex-col pt-3 pb-2 ${config.showTrending ? 'border-b border-[#e5e7eb]' : 'pb-4'}`}>
                      {visibleRecent.map((item) => (
                        <div key={item} className="group flex items-center px-4 pt-[6px] pb-1 hover:bg-[#f8f8f8]">
                          <Clock size={13} className="shrink-0 text-[#a1a1aa] mr-2" />
                          <button
                            onClick={() => { setQuery(item); inputRef.current?.focus(); }}
                            className="flex-1 text-left min-w-0"
                          >
                            <p className="text-[14px] leading-[20px] font-normal whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: theme.colorSuggestions }}>
                              {item}
                            </p>
                          </button>
                          <button
                            onClick={() => setRecentSearches(prev => prev.filter(r => r !== item))}
                            className="shrink-0 ml-2 text-[#a1a1aa] hover:text-[#64748b] opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {config.showTrending && (
                    <div className="flex flex-col pt-3 pb-4">
                      <div className="flex items-center gap-1.5 px-4 pb-1">
                        <TrendingUp size={14} className="shrink-0 text-[#EF4444]" />
                        <span className="text-[13px] font-semibold" style={{ color: theme.colorSectionLabel }}>Trending</span>
                      </div>
                      {visibleTrending.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => { setQuery(chip); inputRef.current?.focus(); }}
                          className="flex items-center px-4 pt-[6px] pb-1 hover:bg-[#f8f8f8] text-left w-full"
                        >
                          <p className="text-[14px] leading-[20px] font-normal whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: theme.colorSuggestions }}>
                            {chip}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Right content panel ── */}
          <div className="flex-1 min-w-0 p-4 flex flex-col gap-4">
            {renderRightPanel()}
          </div>
        </div>
    </div>
  );

  if (preview) return widget;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col items-center pt-16 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {widget}
    </div>
  );
}
