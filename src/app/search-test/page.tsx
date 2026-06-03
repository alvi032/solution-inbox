'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import AppSidebar from '@/components/app-sidebar';
import StorefrontNav from './StorefrontNav';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SearchConfig = {
  showTrending: boolean;
  trendingCount: number;
  showSuggestedCategories: boolean;
  showHandpickedForYou: boolean;
  showSearchWithAI: boolean;
  aiDisplayStyle: 'toggle' | 'cta';
  showLeftSidebar: boolean;
  showRecentSearches: boolean;
  recentCount: number;
  showAutoSuggestions: boolean;
};

export type ThemeConfig = {
  widgetBorderColor: string;
  widgetBorderWidth: number;
  widgetBorderRadius: number;
  widgetBgColor: string;
  widgetOpacity: number;
  cardBorderWidth: number;
  cardBorderColor: string;
  cardBorderRadius: number;
  cardBgColor: string;
  showProductPrice: boolean;
  showProductDescription: boolean;
  showCategoryDescription: boolean;
  imageRatioW: number;
  imageRatioH: number;
  fontFamily: string;
  colorCardName: string;
  colorProductDesc: string;
  colorProductPrice: string;
  colorSectionLabel: string;
  colorSuggestions: string;
  colorSearchInput: string;
  categoryCount: 4 | 5;
  enableProductScroll: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseHex(hex: string): [number, number, number] {
  const c = hex.replace('#', '').slice(0, 6).padEnd(6, '0');
  return [
    parseInt(c.slice(0, 2), 16) || 0,
    parseInt(c.slice(2, 4), 16) || 0,
    parseInt(c.slice(4, 6), 16) || 0,
  ];
}

function toHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'))
    .join('');
}

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

function SegmentedControl({ value, onChange }: {
  value: 'toggle' | 'cta';
  onChange: (v: 'toggle' | 'cta') => void;
}) {
  return (
    <div className="py-3">
      <p className="text-[12px] text-[#94a3b8] mb-2">Display style</p>
      <div className="flex bg-[#f1f5f9] rounded-lg p-[3px] gap-[3px]">
        {(['toggle', 'cta'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 text-[13px] font-medium py-1.5 rounded-md transition-all duration-150 ${
              value === opt ? 'bg-white text-[#020617] shadow-sm' : 'text-[#64748b] hover:text-[#334155]'
            }`}
          >
            {opt === 'toggle' ? 'Toggle' : 'CTA'}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-[#94a3b8] mt-2 leading-[16px]">
        {value === 'toggle'
          ? 'Shows a toggle switch the user can flip on/off.'
          : 'Shows a "Search [query] with AI" button the user can click.'}
      </p>
    </div>
  );
}

// ─── Theme config components ──────────────────────────────────────────────────

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
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={e => {
          const n = parseInt(e.target.value);
          if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
        }}
        className="w-[44px] text-[12px] border border-[#e5e7eb] rounded-md px-1.5 py-[3px] text-center text-[#334155] outline-none focus:border-[#a1a1aa]"
      />
      {suffix && <span className="text-[11px] text-[#94a3b8]">{suffix}</span>}
    </div>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [format, setFormat] = useState<'hex' | 'rgb'>('hex');
  const [hexText, setHexText] = useState(value);

  useEffect(() => { setHexText(value); }, [value]);

  const [r, g, b] = parseHex(value);

  const handleHexChange = (text: string) => {
    setHexText(text);
    if (/^#[0-9a-fA-F]{6}$/.test(text)) onChange(text);
  };

  const handleRgbChange = (ch: 0 | 1 | 2, val: number) => {
    const rgb: [number, number, number] = [r, g, b];
    rgb[ch] = Math.max(0, Math.min(255, isNaN(val) ? 0 : val));
    onChange(toHex(...rgb));
  };

  return (
    <div className="flex items-center gap-1.5">
      <label className="relative cursor-pointer shrink-0">
        <span
          className="block w-[20px] h-[20px] rounded-[3px] border border-[#d1d5db]"
          style={{ background: value }}
        />
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </label>

      {format === 'hex' ? (
        <input
          value={hexText}
          onChange={e => handleHexChange(e.target.value)}
          placeholder="#000000"
          maxLength={7}
          className="w-[70px] text-[12px] font-mono border border-[#e5e7eb] rounded-md px-1.5 py-[3px] text-[#334155] outline-none focus:border-[#a1a1aa]"
        />
      ) : (
        <div className="flex items-center gap-1">
          {(['R', 'G', 'B'] as const).map((ch, i) => (
            <div key={ch} className="flex items-center gap-0.5">
              <span className="text-[10px] text-[#94a3b8]">{ch}</span>
              <input
                type="number"
                min={0}
                max={255}
                value={[r, g, b][i]}
                onChange={e => handleRgbChange(i as 0 | 1 | 2, parseInt(e.target.value))}
                className="w-[30px] text-[11px] border border-[#e5e7eb] rounded px-1 py-[3px] text-center text-[#334155] outline-none"
              />
            </div>
          ))}
        </div>
      )}

      <select
        value={format}
        onChange={e => setFormat(e.target.value as 'hex' | 'rgb')}
        className="text-[11px] border border-[#e5e7eb] rounded-md px-1 py-[3px] text-[#64748b] bg-white cursor-pointer outline-none"
      >
        <option value="hex">HEX</option>
        <option value="rgb">RGB</option>
      </select>
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

// ─── Live card preview ────────────────────────────────────────────────────────

const PREVIEW_IMG = 'https://www.figma.com/api/mcp/asset/e74188b9-4157-4ef3-b8ca-7f1c8ba06fee';

function LiveProductCard({ theme }: { theme: ThemeConfig }) {
  return (
    <div
      className="overflow-hidden flex flex-col w-[150px] transition-all duration-150"
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
        <img
          src={PREVIEW_IMG}
          alt="Preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="px-2 pt-2 pb-[10px] flex flex-col gap-0.5">
        <p className="text-[13px] leading-[18px] font-semibold truncate transition-colors duration-150" style={{ color: theme.colorCardName }}>
          Sweven
        </p>
        {theme.showProductDescription && (
          <p className="text-[12px] leading-[17px] font-normal transition-colors duration-150" style={{ color: theme.colorProductDesc }}>
            Elegant citrus and amber scent.
          </p>
        )}
        {theme.showProductPrice && (
          <p className="text-[13px] leading-[18px] font-semibold transition-colors duration-150" style={{ color: theme.colorProductPrice }}>
            $45
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SearchTestPage() {
  const [config, setConfig] = useState<SearchConfig>({
    showTrending: true,
    trendingCount: 5,
    showSuggestedCategories: true,
    showHandpickedForYou: true,
    showSearchWithAI: true,
    aiDisplayStyle: 'toggle',
    showLeftSidebar: true,
    showRecentSearches: true,
    recentCount: 5,
    showAutoSuggestions: true,
  });

  const [theme, setTheme] = useState<ThemeConfig>({
    widgetBorderColor: '#e5e7eb',
    widgetBorderWidth: 1,
    widgetBorderRadius: 12,
    widgetBgColor: '#ffffff',
    widgetOpacity: 100,
    cardBorderWidth: 1,
    cardBorderColor: '#e5e7eb',
    cardBorderRadius: 6,
    cardBgColor: '#ffffff',
    showProductPrice: true,
    showProductDescription: true,
    showCategoryDescription: false,
    imageRatioW: 1,
    imageRatioH: 1,
    fontFamily: 'Inter',
    colorCardName: '#334155',
    colorProductDesc: '#475569',
    colorProductPrice: '#020617',
    colorSectionLabel: '#020617',
    colorSuggestions: '#64748b',
    colorSearchInput: '#18181b',
    categoryCount: 5,
    enableProductScroll: false,
  });

  function update<K extends keyof SearchConfig>(key: K, value: SearchConfig[K]) {
    setConfig(prev => ({ ...prev, [key]: value }));
  }

  function updateTheme<K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) {
    setTheme(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <StorefrontNav config={config} theme={theme} />
        <main className="flex-1 overflow-auto bg-[#f9f9f9] p-6">
          <div className="flex flex-col gap-4">

            {/* ── Features ── */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-[#e5e7eb]">
                <p className="text-[13px] font-semibold text-[#020617]">Features</p>
              </div>
              <div className="flex divide-x divide-[#f1f5f9]">
                <div className="flex-1 px-4 pt-3 pb-4">
                  <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wide mb-1">Default view</p>
                  <ConfigToggle label="Suggested Categories" checked={config.showSuggestedCategories} onChange={v => update('showSuggestedCategories', v)} />
                  <ConfigToggle label="Handpicked for you" checked={config.showHandpickedForYou} onChange={v => update('showHandpickedForYou', v)} />
                </div>
                <div className="flex-1 px-4 pt-3 pb-4">
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
                  {config.showLeftSidebar && (
                    <>
                      <ConfigToggle label="Recent searches" description="Shown in default state" checked={config.showRecentSearches} onChange={v => update('showRecentSearches', v)} />
                      {config.showRecentSearches && (
                        <div className="flex items-center gap-2 py-2 border-b border-[#f1f5f9] pl-1">
                          <span className="text-[12px] text-[#94a3b8]">Show</span>
                          <NumberInput value={config.recentCount} onChange={v => update('recentCount', v)} min={1} max={8} />
                          <span className="text-[12px] text-[#94a3b8]">items</span>
                        </div>
                      )}
                      <ConfigToggle label="Auto-suggestions" description="Shown while typing" checked={config.showAutoSuggestions} onChange={v => update('showAutoSuggestions', v)} />
                    </>
                  )}
                </div>
                <div className="flex-1 px-4 pt-3 pb-4">
                  <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wide mb-1">Search with AI</p>
                  <ConfigToggle label="Enable Search with AI" checked={config.showSearchWithAI} onChange={v => update('showSearchWithAI', v)} />
                  {config.showSearchWithAI && (
                    <SegmentedControl value={config.aiDisplayStyle} onChange={v => update('aiDisplayStyle', v)} />
                  )}
                </div>
              </div>
            </div>

            {/* ── Theme ── */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-[#e5e7eb]">
                <p className="text-[13px] font-semibold text-[#020617]">Theme</p>
              </div>

              {/* Widget */}
              <SectionDivider label="Widget" />
              <div className="px-4 py-4 flex flex-col gap-4">
                <div className="flex items-end gap-8">
                  <div>
                    <FieldLabel>Border color</FieldLabel>
                    <ColorPicker value={theme.widgetBorderColor} onChange={v => updateTheme('widgetBorderColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Border thickness</FieldLabel>
                    <NumberInput value={theme.widgetBorderWidth} onChange={v => updateTheme('widgetBorderWidth', v)} min={0} max={8} suffix="px" />
                  </div>
                  <div>
                    <FieldLabel>Border radius</FieldLabel>
                    <NumberInput value={theme.widgetBorderRadius} onChange={v => updateTheme('widgetBorderRadius', v)} min={0} max={40} suffix="px" />
                  </div>
                </div>
                <div className="flex items-end gap-8">
                  <div>
                    <FieldLabel>Background</FieldLabel>
                    <ColorPicker value={theme.widgetBgColor} onChange={v => updateTheme('widgetBgColor', v)} />
                  </div>
                  <div>
                    <FieldLabel>Opacity</FieldLabel>
                    <NumberInput value={theme.widgetOpacity} onChange={v => updateTheme('widgetOpacity', v)} min={0} max={100} suffix="%" />
                  </div>
                </div>
              </div>

              {/* Cards */}
              <SectionDivider label="Cards" />
              <div className="px-4 py-4">
                <div className="flex items-start gap-10">

                  {/* Controls */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-[11px] font-medium text-[#334155] mb-2">Product cards</p>
                      <div className="flex items-end gap-6">
                        <div>
                          <FieldLabel>Border width</FieldLabel>
                          <NumberInput value={theme.cardBorderWidth} onChange={v => updateTheme('cardBorderWidth', v)} min={0} max={8} suffix="px" />
                        </div>
                        <div>
                          <FieldLabel>Border color</FieldLabel>
                          <ColorPicker value={theme.cardBorderColor} onChange={v => updateTheme('cardBorderColor', v)} />
                        </div>
                        <div>
                          <FieldLabel>Border radius</FieldLabel>
                          <NumberInput value={theme.cardBorderRadius} onChange={v => updateTheme('cardBorderRadius', v)} min={0} max={99} suffix="px" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <FieldLabel>Background</FieldLabel>
                        <ColorPicker value={theme.cardBgColor} onChange={v => updateTheme('cardBgColor', v)} />
                      </div>
                      <div className="flex gap-5 mt-2">
                        <CheckItem label="Show price" checked={theme.showProductPrice} onChange={v => updateTheme('showProductPrice', v)} />
                        <CheckItem label="Show description" checked={theme.showProductDescription} onChange={v => updateTheme('showProductDescription', v)} />
                      </div>
                    </div>

                    <div className="border-t border-[#f1f5f9] pt-3">
                      <p className="text-[11px] font-medium text-[#334155] mb-1">Category cards</p>
                      <CheckItem label="Show description" checked={theme.showCategoryDescription} onChange={v => updateTheme('showCategoryDescription', v)} />
                    </div>
                  </div>

                  {/* Live preview */}
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wide">Preview</p>
                    <LiveProductCard theme={theme} />
                  </div>

                </div>
              </div>

              {/* Typography */}
              <SectionDivider label="Typography" />
              <div className="px-4 py-4">
                <div className="flex items-start gap-10">
                  <div>
                    <FieldLabel>Font family</FieldLabel>
                    <select
                      value={theme.fontFamily}
                      onChange={e => updateTheme('fontFamily', e.target.value)}
                      className="text-[12px] border border-[#e5e7eb] rounded-md px-2 py-[5px] text-[#334155] bg-white outline-none focus:border-[#a1a1aa] w-[160px]"
                    >
                      <optgroup label="Sans-serif">
                        {['Inter', 'Roboto', 'Poppins', 'Montserrat'].map(f => (
                          <option key={f}>{f}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Serif">
                        {['Playfair Display', 'Merriweather', 'Lora', 'EB Garamond'].map(f => (
                          <option key={f}>{f}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div className="flex-1">
                    <FieldLabel>Colors</FieldLabel>
                    <div className="flex flex-col">
                      <ColorRow label="Card name"     value={theme.colorCardName}     onChange={v => updateTheme('colorCardName', v)} />
                      <ColorRow label="Section label" value={theme.colorSectionLabel} onChange={v => updateTheme('colorSectionLabel', v)} />
                      <ColorRow label="Description"   value={theme.colorProductDesc}  onChange={v => updateTheme('colorProductDesc', v)} />
                      <ColorRow label="Suggestions"   value={theme.colorSuggestions}  onChange={v => updateTheme('colorSuggestions', v)} />
                      <ColorRow label="Price"         value={theme.colorProductPrice} onChange={v => updateTheme('colorProductPrice', v)} />
                      <ColorRow label="Search input"  value={theme.colorSearchInput}  onChange={v => updateTheme('colorSearchInput', v)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Images & Layout */}
              <SectionDivider label="Images & Layout" />
              <div className="px-4 py-4">
                <div className="flex items-end gap-10">
                  <div>
                    <FieldLabel>Image size</FieldLabel>
                    <div className="flex items-center gap-2">
                      <NumberInput value={theme.imageRatioW} onChange={v => updateTheme('imageRatioW', v)} min={1} max={99} />
                      <span className="text-[13px] text-[#94a3b8]">:</span>
                      <NumberInput value={theme.imageRatioH} onChange={v => updateTheme('imageRatioH', v)} min={1} max={99} />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Categories shown</FieldLabel>
                    <div className="flex bg-[#f1f5f9] rounded-lg p-[2px] gap-[2px] w-fit">
                      {([4, 5] as const).map(n => (
                        <button
                          key={n}
                          onClick={() => updateTheme('categoryCount', n)}
                          className={`w-8 text-[12px] font-medium py-1 rounded-md transition-all duration-150 ${
                            theme.categoryCount === n
                              ? 'bg-white text-[#020617] shadow-sm'
                              : 'text-[#64748b] hover:text-[#334155]'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Product scroll</FieldLabel>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateTheme('enableProductScroll', !theme.enableProductScroll)}
                        className={`relative flex items-center h-[22px] w-[40px] rounded-full px-[2px] transition-colors duration-200 shrink-0 ${theme.enableProductScroll ? 'bg-[#18181b]' : 'bg-[#e4e4e7]'}`}
                      >
                        <span className={`block size-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${theme.enableProductScroll ? 'translate-x-[18px]' : 'translate-x-0'}`} />
                      </button>
                      <span className="text-[12px] text-[#334155]">Enable scroll</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
