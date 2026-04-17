'use client';

import { useState } from 'react';
import EvoSearchSidebar from '@/components/evo-search-sidebar';
import {
  Monitor,
  Smartphone,
  Search,
  TrendingUp,
  History,
  Heart,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── asset URLs from Figma ───────────────────────────────────────────────────
const imgCBDSoftgels =
  'https://www.figma.com/api/mcp/asset/79dac0db-b6ae-499d-aad6-58d7ccb07716';
const imgCBDBalmFireIce =
  'https://www.figma.com/api/mcp/asset/9e20e0ba-cf43-486d-bd22-62bf2e065452';
const imgDreamCBDOil =
  'https://www.figma.com/api/mcp/asset/5483ff3d-672d-4afd-9149-f6b210773b82';
const imgEnergyGummies =
  'https://www.figma.com/api/mcp/asset/905176bd-8cf6-4681-8bab-81794e5aced0';

// ─── constants ───────────────────────────────────────────────────────────────
const cardShadow =
  '0px 0px 0px 1px rgba(0,0,0,0.06), 0px 0.5px 0.5px 0px rgba(0,0,0,0.04), 0px 1px 1px -0.5px rgba(0,0,0,0.03), 0px 2px 2px -1px rgba(0,0,0,0.02), 0px 3px 3px -1.5px rgba(0,0,0,0.02), 0px 5px 5px -2.5px rgba(0,0,0,0.03)';

const primaryBtnShadow =
  'inset 0px -1px 0px 1px rgba(0,0,0,0.8), inset 0px 0px 0px 1px #303030, inset 0px 0.5px 0px 1.5px rgba(255,255,255,0.25)';

const secondaryBtnShadow =
  'inset 0px -1px 0px 0px #b5b5b5, inset 0px 0px 0px 1px rgba(0,0,0,0.1), inset 0px 0.5px 0px 1.5px white';

// ─── sub-components ──────────────────────────────────────────────────────────

function SelectChevron() {
  return (
    <span className="flex flex-col items-center justify-center w-5 h-5 shrink-0">
      <ChevronUp size={8} className="text-[#616161]" strokeWidth={2.5} />
      <ChevronDown size={8} className="text-[#616161]" strokeWidth={2.5} />
    </span>
  );
}

function SelectField({
  label,
  value,
  details,
}: {
  label?: string;
  value: string;
  details?: string;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <p className="text-[13px] font-medium text-[#303030] leading-5">{label}</p>
      )}
      <div
        className="bg-white border border-[#8a8a8a] rounded-lg flex items-center justify-between px-3 pr-1 py-1.5 w-full overflow-hidden"
        style={{ borderWidth: '0.66px' }}
      >
        <span className="text-[13px] font-medium text-[#616161] leading-5 truncate flex-1">
          {value}
        </span>
        <SelectChevron />
      </div>
      {details && (
        <p className="text-[12px] font-medium text-[#616161] leading-4">{details}</p>
      )}
    </div>
  );
}

function ColorField({ label, hex, color }: { label: string; hex: string; color: string }) {
  return (
    <div className="flex gap-4 items-center w-full">
      <p
        className="text-[13px] font-medium text-black leading-5 w-[100px] shrink-0"
        style={{ fontFeatureSettings: "'cv10' 1" }}
      >
        {label}
      </p>
      <div
        className="bg-white border rounded-lg flex items-center px-3 pr-1 py-1.5 w-full overflow-hidden flex-1"
        style={{ borderWidth: '0.66px', borderColor: '#8a8a8a' }}
      >
        <div
          className="w-4 h-4 rounded-[3px] border border-[#ebebeb] shrink-0 mr-1.5"
          style={{ backgroundColor: color }}
        />
        <span className="text-[13px] font-medium text-[#616161] leading-5 truncate">
          {hex}
        </span>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between h-8 w-full">
      <p
        className="text-[13px] font-medium text-black leading-5 w-[150px]"
        style={{ fontFeatureSettings: "'cv10' 1" }}
      >
        {label}
      </p>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200',
          checked ? 'bg-[#303030]' : 'bg-[#d4d4d8]'
        )}
      >
        <span
          className={cn(
            'inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-4' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}

// ─── product card in the search preview ──────────────────────────────────────
function ProductCard({
  image,
  name,
  description,
  price,
}: {
  image: string;
  name: string;
  description: string;
  price: string;
}) {
  return (
    <div className="border border-[#cbd5e1] rounded-[6px] flex flex-col items-center pt-1 pb-2.5 shrink-0 overflow-hidden">
      <div className="w-[94px] h-[100px] rounded-[4px] overflow-hidden mb-2">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="w-full border-t border-[#cbd5e1] pt-2 px-2 pr-0.5 flex flex-col gap-0.5">
        <p className="text-[12px] font-semibold text-[#334155] leading-4 w-[120px] truncate">{name}</p>
        <p className="text-[12px] font-normal text-[#475569] leading-4 w-[150px]">{description}</p>
        <p className="text-[12px] font-semibold text-[#020617] leading-4">{price}</p>
      </div>
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────
export default function WidgetCustomizationPage() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [rollout, setRollout] = useState(50);
  const [customCss, setCustomCss] = useState('');
  const [visibility, setVisibility] = useState({
    productImages: true,
    price: true,
    descriptions: true,
    sectionTitles: true,
    sectionTitleIcons: true,
    trendingSearches: true,
    handpickedForYou: true,
  });

  const toggleVisibility = (key: keyof typeof visibility) => (val: boolean) =>
    setVisibility((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <EvoSearchSidebar />

      <main className="flex-1 overflow-y-auto bg-[#f6f6f7]">
        <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col gap-4">

          {/* ── Top action bar ── */}
          <div className="flex items-end justify-end">
            <button
              type="button"
              className="relative flex items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg overflow-hidden text-white text-[12px] font-semibold leading-4 whitespace-nowrap"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(48,48,48,0) 63.532%, rgba(255,255,255,0.15) 100%), linear-gradient(90deg, #303030 0%, #303030 100%)',
                boxShadow: primaryBtnShadow,
              }}
            >
              Save and Deploy
            </button>
          </div>

          {/* ── Search Volume Trend card ── */}
          <div
            className="bg-white rounded-lg overflow-hidden flex flex-col"
            style={{ boxShadow: cardShadow }}
          >
            {/* Card header */}
            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                {/* Title */}
                <p className="text-[14px] font-semibold text-[#303030] leading-5">
                  Search Volume Trend
                </p>

                {/* Desktop / Mobile toggle */}
                <div className="flex items-center gap-2">
                  {/* Desktop button — active */}
                  <button
                    type="button"
                    onClick={() => setViewMode('desktop')}
                    className={cn(
                      'relative flex items-center gap-0.5 px-3 py-1.5 rounded-lg text-[12px] font-medium leading-4 whitespace-nowrap overflow-hidden',
                      viewMode === 'desktop'
                        ? 'bg-white text-[#303030]'
                        : 'bg-transparent text-[#303030]'
                    )}
                    style={
                      viewMode === 'desktop'
                        ? { boxShadow: secondaryBtnShadow }
                        : {}
                    }
                  >
                    <Monitor size={16} className="shrink-0" />
                    <span>Desktop</span>
                    {viewMode === 'desktop' && (
                      <span className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{ boxShadow: secondaryBtnShadow }} />
                    )}
                  </button>

                  {/* Mobile button */}
                  <button
                    type="button"
                    onClick={() => setViewMode('mobile')}
                    className={cn(
                      'relative flex items-center gap-0.5 px-3 py-1.5 rounded-lg text-[12px] font-medium leading-4 whitespace-nowrap overflow-hidden',
                      viewMode === 'mobile'
                        ? 'bg-white text-[#303030]'
                        : 'bg-transparent text-[#303030]'
                    )}
                    style={
                      viewMode === 'mobile'
                        ? { boxShadow: secondaryBtnShadow }
                        : {}
                    }
                  >
                    <Smartphone size={16} className="shrink-0" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* Search widget preview area */}
              <div className="bg-gray-50 rounded-lg flex flex-col items-center gap-2.5 py-4">
                {/* Search input */}
                <div className="w-[706px] max-w-full">
                  <div className="bg-white border border-[#e4e4e7] rounded-md flex items-center gap-1 h-10 px-3 py-2 w-full">
                    <Search size={16} className="text-[#71717a] shrink-0" />
                    <span className="text-[14px] text-[#71717a] leading-5 flex-1">Search</span>
                  </div>
                </div>

                {/* Dropdown results panel */}
                <div
                  className="bg-white border border-[#e5e7eb] rounded-[10px] flex flex-col gap-4 px-5 py-3.5 w-[706px] max-w-full"
                  style={{
                    boxShadow:
                      '0px 4px 6px 0px rgba(0,0,0,0.1), 0px 2px 4px 0px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Trending section */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} className="text-[#020617]" />
                      <p className="text-[14px] font-semibold text-[#020617] leading-5">
                        Trending searches near you
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        'Oils for peaceful sleep',
                        'Energy Gummies',
                        'Pet Gummies',
                        'Dream Tincture for peaceful sleep',
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-1">
                          <History size={14} className="text-[#020617] shrink-0" />
                          <p className="text-[14px] font-normal text-[#020617] leading-5 whitespace-nowrap">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Handpicked section */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <Heart size={16} className="text-[#020617]" />
                      <p className="text-[14px] font-semibold text-[#020617] leading-5">
                        Handpicked for you
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProductCard
                        image={imgCBDSoftgels}
                        name="CBD Softgels"
                        description="AI-generated product description in two lines"
                        price="$45"
                      />
                      <ProductCard
                        image={imgCBDBalmFireIce}
                        name="CBD Balm Fire & Ice"
                        description="AI-generated product description in two lines"
                        price="$30"
                      />
                      <ProductCard
                        image={imgDreamCBDOil}
                        name="Dream CBD Oil Tincture"
                        description="AI-generated product description in two lines"
                        price="$40"
                      />
                      <ProductCard
                        image={imgEnergyGummies}
                        name="Energy Gummies"
                        description="AI-generated product description in two lines"
                        price="$40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 2: Appearance + Content Visibility ── */}
          <div className="flex gap-4 items-start">

            {/* Appearance */}
            <div
              className="bg-white flex flex-col gap-4 p-4 rounded-xl overflow-hidden flex-1 min-w-0"
              style={{ boxShadow: cardShadow }}
            >
              <div className="flex flex-col gap-0.5">
                <p className="text-[14px] font-semibold text-[#303030] leading-5">Appearance</p>
                <p className="text-[13px] font-medium text-[#616161] leading-5">
                  Set global look and font style.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {/* Font Family */}
                <div className="flex gap-4 items-center w-full">
                  <p
                    className="text-[13px] font-medium text-black leading-5 w-[100px] shrink-0"
                    style={{ fontFeatureSettings: "'cv10' 1" }}
                  >
                    Font Family
                  </p>
                  <SelectField value="Inter" />
                </div>

                {/* Corner Radius */}
                <div className="flex gap-4 items-center w-full">
                  <p
                    className="text-[13px] font-medium text-black leading-5 w-[100px] shrink-0"
                    style={{ fontFeatureSettings: "'cv10' 1" }}
                  >
                    Corner Radius
                  </p>
                  <div
                    className="bg-white border rounded-lg px-3 py-1.5 w-full flex-1 overflow-hidden"
                    style={{ borderWidth: '0.66px', borderColor: '#8a8a8a' }}
                  >
                    <span className="text-[13px] font-medium text-[#616161] leading-5">10px</span>
                  </div>
                </div>

                {/* Color fields */}
                <ColorField label="Background" hex="#FFFFFF" color="#FFFFFF" />
                <ColorField label="Title" hex="#303030" color="#303030" />
                <ColorField label="Description" hex="#475569" color="#475569" />
                <ColorField label="Price" hex="#303030" color="#303030" />
                <ColorField label="Icons" hex="EA580C" color="#ea580c" />
              </div>
            </div>

            {/* Content Visibility */}
            <div
              className="bg-white flex flex-col gap-4 p-4 rounded-xl overflow-hidden flex-1 min-w-0"
              style={{ boxShadow: cardShadow }}
            >
              <div className="flex flex-col gap-0.5">
                <p className="text-[14px] font-semibold text-[#303030] leading-5">Content Visibility</p>
                <p className="text-[13px] font-medium text-[#616161] leading-5">
                  Choose which sections to display.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <ToggleRow
                  label="Product images"
                  checked={visibility.productImages}
                  onChange={toggleVisibility('productImages')}
                />
                <ToggleRow
                  label="Price"
                  checked={visibility.price}
                  onChange={toggleVisibility('price')}
                />
                <ToggleRow
                  label="Descriptions"
                  checked={visibility.descriptions}
                  onChange={toggleVisibility('descriptions')}
                />
                <ToggleRow
                  label="Section titles"
                  checked={visibility.sectionTitles}
                  onChange={toggleVisibility('sectionTitles')}
                />
                <ToggleRow
                  label="Section title icons"
                  checked={visibility.sectionTitleIcons}
                  onChange={toggleVisibility('sectionTitleIcons')}
                />
                <ToggleRow
                  label="Trending searches"
                  checked={visibility.trendingSearches}
                  onChange={toggleVisibility('trendingSearches')}
                />
                <ToggleRow
                  label="Handpicked for you"
                  checked={visibility.handpickedForYou}
                  onChange={toggleVisibility('handpickedForYou')}
                />
              </div>
            </div>
          </div>

          {/* ── Row 3: Appearance (Geographic/Rollout) + Custom CSS ── */}
          <div className="flex gap-4 items-start">

            {/* Appearance — region + rollout */}
            <div
              className="bg-white flex flex-col gap-4 p-4 rounded-xl overflow-hidden flex-1 min-w-0"
              style={{ boxShadow: cardShadow }}
            >
              <div className="flex flex-col gap-0.5">
                <p className="text-[14px] font-semibold text-[#303030] leading-5">Appearance</p>
                <p className="text-[13px] font-medium text-[#616161] leading-5">
                  Set global look and font style.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Geographic Region select */}
                <SelectField
                  label="Geographic Region"
                  value="All Regions (Global)"
                  details="Choose where your search widget will be available"
                />

                {/* User rollout slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[13px] leading-5">
                      <p
                        className="font-medium text-[#303030]"
                        style={{ fontFeatureSettings: "'cv10' 1" }}
                      >
                        User rollout
                      </p>
                      <p className="font-bold text-[#303030]">{rollout}%</p>
                    </div>

                    {/* Slider track */}
                    <div className="relative w-full h-8 flex items-center">
                      {/* Track background */}
                      <div className="absolute w-full h-2 bg-[#f4f4f5] rounded-full" />
                      {/* Filled track */}
                      <div
                        className="absolute h-2 bg-[#18181b] rounded-full"
                        style={{ width: `${rollout}%` }}
                      />
                      {/* Native range input (invisible but interactive) */}
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={rollout}
                        onChange={(e) => setRollout(Number(e.target.value))}
                        className="absolute w-full opacity-0 cursor-pointer h-8"
                        aria-label="User rollout percentage"
                      />
                      {/* Thumb */}
                      <div
                        className="absolute w-5 h-5 bg-white border-2 border-[#18181b] rounded-full shadow pointer-events-none -translate-x-1/2"
                        style={{ left: `${rollout}%` }}
                      />
                    </div>

                    {/* Tick labels */}
                    <div className="flex items-start justify-between text-[12px] font-normal text-[#71717a] leading-4">
                      <span className="w-[31px]">0%</span>
                      <span className="w-[31px] text-center">50%</span>
                      <span className="w-[31px] text-right">100%</span>
                    </div>
                  </div>
                  <p
                    className="text-[12px] font-medium text-[#616161] leading-4"
                    style={{ fontFeatureSettings: "'cv10' 1" }}
                  >
                    Start with a small percentage and gradually increase
                  </p>
                </div>
              </div>
            </div>

            {/* Custom CSS */}
            <div
              className="bg-white flex flex-col gap-4 p-4 rounded-xl overflow-hidden flex-1 min-w-0 self-stretch"
              style={{ boxShadow: cardShadow }}
            >
              <div className="flex flex-col gap-0.5">
                <p className="text-[14px] font-semibold text-[#303030] leading-5">Custom CSS</p>
                <p className="text-[13px] font-medium text-[#616161] leading-5">
                  Set the dimentions for the layer.
                </p>
              </div>

              <textarea
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                placeholder=""
                className="flex-1 min-h-[120px] w-full bg-white border rounded-lg resize-none outline-none focus:border-[#8a8a8a] transition-colors"
                style={{ borderWidth: '0.66px', borderColor: '#8a8a8a' }}
                spellCheck={false}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
