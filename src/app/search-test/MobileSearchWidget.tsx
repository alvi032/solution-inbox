'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, Clock, LayoutGrid, HandHeart, X, WandSparkles } from 'lucide-react';
import type { SearchConfig, ThemeConfig } from './page';

// ── Static data (mirrors SearchModal) ─────────────────────────────────────────

const CAT_IMGS = [
  'https://www.figma.com/api/mcp/asset/0ab7f4b9-bfc1-4f3c-a212-854b72129d43',
  'https://www.figma.com/api/mcp/asset/d1137e29-43a8-4813-8dd1-9fddf87064f9',
  'https://www.figma.com/api/mcp/asset/909d1ec9-2a7a-4cdd-a91d-ab3f79efb013',
  'https://www.figma.com/api/mcp/asset/700c6348-2c4c-44c4-b7ac-68d106e54984',
  'https://www.figma.com/api/mcp/asset/0459e717-46ba-4ec3-b778-15fd9aaf8a5b',
  'https://www.figma.com/api/mcp/asset/0ab7f4b9-bfc1-4f3c-a212-854b72129d43',
  'https://www.figma.com/api/mcp/asset/d1137e29-43a8-4813-8dd1-9fddf87064f9',
  'https://www.figma.com/api/mcp/asset/909d1ec9-2a7a-4cdd-a91d-ab3f79efb013',
];
const CATEGORIES = ['Gourmand', 'Candy', 'Gourmand Creme', 'Rainforest', 'Perfume Oil', 'Citrus', 'Floral', 'Woody'];

const PRODUCTS = [
  { name: 'Sweven',        desc: 'Elegant citrus and amber scent.',  price: '$45', img: 'https://www.figma.com/api/mcp/asset/e74188b9-4157-4ef3-b8ca-7f1c8ba06fee' },
  { name: 'Kalon',         desc: 'Floral musk for lasting charm.',   price: '$45', img: 'https://www.figma.com/api/mcp/asset/4e7935f1-a4c9-42fb-9b40-74a315c082b9' },
  { name: 'Sweet Addict',  desc: 'Vanilla sophisticated fragrance.', price: '$45', img: 'https://www.figma.com/api/mcp/asset/354a27f6-2217-44b6-acc1-34b968a66c16' },
  { name: 'Cotton Clouds', desc: 'Bold woody jasmine allure.',       price: '$45', img: 'https://www.figma.com/api/mcp/asset/8ea50724-9585-4acb-8523-fd213dbd6afb' },
  { name: 'Lumière',       desc: 'Fresh bergamot and white tea.',    price: '$52', img: 'https://www.figma.com/api/mcp/asset/e74188b9-4157-4ef3-b8ca-7f1c8ba06fee' },
  { name: 'Noir Absolu',   desc: 'Deep oud and resinous musk.',      price: '$60', img: 'https://www.figma.com/api/mcp/asset/4e7935f1-a4c9-42fb-9b40-74a315c082b9' },
  { name: 'Bloom',         desc: 'Delicate rose and peony accord.',  price: '$38', img: 'https://www.figma.com/api/mcp/asset/354a27f6-2217-44b6-acc1-34b968a66c16' },
  { name: 'Amber Oud',     desc: 'Warm amber and smoky oud.',        price: '$55', img: 'https://www.figma.com/api/mcp/asset/8ea50724-9585-4acb-8523-fd213dbd6afb' },
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

// ── Wand gradient icon (matches desktop) ──────────────────────────────────────

function WandGradientIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="wand-mob-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E45231" />
          <stop offset="100%" stopColor="#F04BF4" />
        </linearGradient>
      </defs>
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" stroke="url(#wand-mob-grad)" />
      <path d="m14 7 3 3" stroke="url(#wand-mob-grad)" />
      <path d="M5 6v4" stroke="url(#wand-mob-grad)" />
      <path d="M19 14v4" stroke="url(#wand-mob-grad)" />
      <path d="M10 2v2" stroke="url(#wand-mob-grad)" />
      <path d="M7 8H3" stroke="url(#wand-mob-grad)" />
      <path d="M21 16h-4" stroke="url(#wand-mob-grad)" />
      <path d="M11 3H9" stroke="url(#wand-mob-grad)" />
    </svg>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Bone({ className }: { className?: string }) {
  return <div className={`bg-[#f1f5f9] rounded-md animate-pulse ${className ?? ''}`} />;
}

function MobileSkeleton() {
  return (
    <div className="px-4 pt-4 pb-8 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Bone className="h-[20px] w-[180px]" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-[#e5e7eb]">
              <Bone className="aspect-square w-full rounded-none" />
              <div className="p-1.5"><Bone className="h-[12px] w-3/4" /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Bone className="h-[20px] w-[160px]" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-[#e5e7eb]">
              <Bone className="aspect-square w-full rounded-none" />
              <div className="p-3 flex flex-col gap-1.5">
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

// ── Empty state ───────────────────────────────────────────────────────────────

function MobileEmptyState({ onEnableAI }: { onEnableAI: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 gap-4 text-center">
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-[18px] leading-[28px] font-semibold text-[#020617]">No search results</p>
        <p className="text-[14px] leading-[20px] text-[#64748b]">
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

// ── Sub-components ─────────────────────────────────────────────────────────────

function MobileCategoryCard({ name, img, theme }: { name: string; img: string; theme: ThemeConfig }) {
  return (
    <div
      className="overflow-hidden flex flex-col"
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
      <p className="px-1.5 py-1.5 text-[12px] font-semibold truncate" style={{ color: theme.colorCardName }}>{name}</p>
    </div>
  );
}

function MobileProductCard({ name, desc, price, img, theme }: {
  name: string; desc: string; price: string; img: string; theme: ThemeConfig;
}) {
  return (
    <div
      className="overflow-hidden flex flex-col"
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
      <div className="px-3 pt-2 pb-3 flex flex-col gap-0.5">
        <p className="text-[14px] font-semibold" style={{ color: theme.colorCardName }}>{name}</p>
        {theme.showProductDescription && (
          <p className="text-[13px] leading-[18px]" style={{ color: theme.colorProductDesc }}>{desc}</p>
        )}
        {theme.showProductPrice && (
          <p className="text-[14px] font-semibold" style={{ color: theme.colorProductPrice }}>{price}</p>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="shrink-0 text-[#EF4444]">{icon}</span>
      <span className="text-[16px] leading-[24px] font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function MobileSearchWidget({ onClose, config, theme, preview = false }: {
  onClose: () => void;
  config: SearchConfig;
  theme: ThemeConfig;
  preview?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isTyping = query.length > 0;

  const mobileCatCount = isTyping ? config.mobileCategoryCount : 4;
  const mobileProductCount = isTyping ? config.mobileProductCount : 4;
  const visibleCategories = CATEGORIES.slice(0, mobileCatCount);
  const visibleCatImgs = CAT_IMGS.slice(0, mobileCatCount);

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

  useEffect(() => {
    if (!preview) inputRef.current?.focus();
    if (preview) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, preview]);

  useEffect(() => {
    if (preview) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [preview]);

  return (
    <div
      className={preview ? 'flex-1 bg-white flex flex-col overflow-hidden' : 'fixed inset-x-0 bottom-0 bg-white z-50 flex flex-col'}
      style={{ ...(preview ? {} : { top: 64 }), fontFamily: theme.fontFamily }}
    >
      {/* Sticky search bar */}
      <div className="flex items-center gap-3 px-4 h-[52px] border-b border-[#e5e7eb] bg-white shrink-0">
        <Search size={18} className="text-[#a1a1aa] shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products…"
          className="flex-1 text-[16px] placeholder:text-[#a1a1aa] bg-transparent outline-none"
          style={{ color: theme.colorSearchInput }}
        />
        {isTyping && (
          <button
            onClick={() => setQuery('')}
            className="shrink-0 w-[20px] h-[20px] rounded-full bg-[#e4e4e7] flex items-center justify-center"
          >
            <X size={11} className="text-[#71717a]" />
          </button>
        )}
        {!preview && (
          <button
            onClick={onClose}
            className="text-[#a1a1aa] hover:text-[#18181b] transition-colors ml-1 pl-3 border-l border-[#e5e7eb]"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {isTyping ? (
          isLoading ? <MobileSkeleton /> :
          showEmpty && !aiEnabled ? <MobileEmptyState onEnableAI={() => setAiEnabled(true)} /> :
          <div className="px-4 pt-4 pb-8 flex flex-col gap-6">

            {/* Search with AI + AI response + Auto-suggestions grouped tightly */}
            <div className="flex flex-col gap-2">
              {config.mobileShowSearchWithAI && (
                <button
                  onClick={() => setAiEnabled(v => !v)}
                  className={`flex items-center gap-2 text-[14px] px-4 py-3 rounded-xl w-full text-left group/ai ${aiEnabled ? 'border border-[#18181b] bg-white text-[#18181b]' : 'search-ai-btn border border-[#dfc49a] text-[#334155]'}`}
                >
                  <span className="wand-icon shrink-0" style={{ transform: 'scaleX(-1)' }}>
                    {aiEnabled ? <WandSparkles size={16} className="text-[#18181b]" /> : <WandGradientIcon size={16} />}
                  </span>
                  <span className={aiEnabled ? 'font-medium' : ''}>{aiEnabled ? 'AI search enabled' : `Search "${query}" with AI`}</span>
                </button>
              )}

              {config.mobileShowAutoSuggestions && (
                <div className="flex flex-col">
                  {SUGGESTION_LABELS.map(label => (
                    <button
                      key={label}
                      onClick={() => { setQuery(label); inputRef.current?.focus(); }}
                      className="flex items-center gap-3 py-3 border-b border-[#f8f8f8] text-left"
                    >
                      <span className="text-[15px]" style={{ color: theme.colorSuggestions }}>{label}</span>
                    </button>
                  ))}
                </div>
              )}

              {aiEnabled && (
                <div className="border-l-[2.5px] border-[#ef4444] pl-3 py-1">
                  <p className="text-[15px] leading-[22px] text-[#020617]">
                    Popular results for <strong>"{query}"</strong> based on customer favorites.
                  </p>
                </div>
              )}
            </div>

            {/* Recommended categories — 4 per row */}
            {config.mobileShowSuggestedCategories && (
              <div className="flex flex-col gap-3">
                <SectionHeading icon={<LayoutGrid size={16} />} label="Recommended Categories" color={theme.colorSectionLabel} />
                <div className="grid grid-cols-4 gap-2">
                  {visibleCategories.map((cat, i) => (
                    <MobileCategoryCard key={cat} name={cat} img={visibleCatImgs[i]} theme={theme} />
                  ))}
                </div>
              </div>
            )}

            {/* Matching products — 2 per row */}
            <div className="flex flex-col gap-3">
              <SectionHeading icon={<Search size={16} />} label="Matching Products" color={theme.colorSectionLabel} />
              <div className="grid grid-cols-2 gap-3">
                {PRODUCTS.slice(0, mobileProductCount).map(p => (
                  <MobileProductCard key={p.name} {...p} theme={theme} />
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="px-4 pt-4 pb-8 flex flex-col gap-6">

            {/* Recent searches */}
            {config.mobileShowRecentSearches && recentSearches.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="shrink-0 text-[#a1a1aa]" />
                  <span className="text-[14px] font-semibold" style={{ color: theme.colorSectionLabel }}>Recent searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, config.mobileRecentCount).map(item => (
                    <div key={item} className="flex items-center gap-1 bg-[#f8f5f3] rounded-[4px] pl-[10px] pr-[6px] py-[6px]">
                      <button
                        onClick={() => { setQuery(item); inputRef.current?.focus(); }}
                        className="text-[14px] text-[#334155] leading-[20px]"
                      >
                        {item}
                      </button>
                      <button
                        onClick={() => setRecentSearches(prev => prev.filter(r => r !== item))}
                        className="text-[#a1a1aa] hover:text-[#64748b] ml-0.5"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending */}
            {config.mobileShowTrending && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-[#EF4444]" />
                  <span className="text-[14px] font-semibold" style={{ color: theme.colorSectionLabel }}>Trending searches near you</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_CHIPS.slice(0, config.mobileTrendingCount).map(chip => (
                    <button
                      key={chip}
                      onClick={() => { setQuery(chip); inputRef.current?.focus(); }}
                      className="bg-[#f8f5f3] rounded-[4px] px-[10px] py-[6px] text-[14px] text-[#334155] leading-[20px]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested categories — 4 per row */}
            {config.mobileShowSuggestedCategories && (
              <div className="flex flex-col gap-3">
                <SectionHeading icon={<LayoutGrid size={16} />} label="Suggested Categories" color={theme.colorSectionLabel} />
                <div className="grid grid-cols-4 gap-2">
                  {visibleCategories.map((cat, i) => (
                    <MobileCategoryCard key={cat} name={cat} img={visibleCatImgs[i]} theme={theme} />
                  ))}
                </div>
              </div>
            )}

            {/* Handpicked for you — 2 per row */}
            {config.mobileShowHandpickedForYou && (
              <div className="flex flex-col gap-3">
                <SectionHeading icon={<HandHeart size={16} />} label="Handpicked for you" color={theme.colorSectionLabel} />
                <div className="grid grid-cols-2 gap-3">
                  {PRODUCTS.slice(0, mobileProductCount).map(p => (
                    <MobileProductCard key={p.name} {...p} theme={theme} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
