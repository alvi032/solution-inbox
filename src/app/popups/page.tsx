'use client';

import { useState } from 'react';
import AppSidebar from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import {
  Palette, Monitor, Layers, Code2, Clock, Settings, AlignLeft, Hash,
  Square, X, Link2, ArrowUpDown, Minus, Image as ImageIcon,
  MousePointerClick, GripVertical, Smartphone, ChevronDown, Plus,
  Zap, ArrowLeft, Bold, Italic, Underline, Strikethrough,
  AlignCenter, AlignRight, AlignJustify, List, ListOrdered,
  RotateCcw, RotateCw, Eye, Save, Undo2, Redo2, Copy, Trash2,
  Lock, Unlock, ChevronLeft, ChevronRight, Mail, History,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type PanelKey = 'theme' | 'display' | 'elements' | 'code' | 'layers' | 'history';
type PropTab = 'content' | 'style' | 'display' | 'advanced';
type ElementType = 'cta' | 'text' | 'heading' | 'section' | 'close-button' | 'link' | 'spacer' | 'divider' | 'image' | 'email-input';

interface CanvasItem {
  id: string;
  type: ElementType;
  label?: string;
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const NAV_ITEMS: { key: PanelKey; label: string; icon: React.ReactNode }[] = [
  { key: 'theme',    label: 'Theme',    icon: <Palette size={18} /> },
  { key: 'display',  label: 'Display',  icon: <Monitor size={18} /> },
  { key: 'elements', label: 'Elements', icon: <Layers size={18} /> },
  { key: 'code',     label: 'Code',     icon: <Code2 size={18} /> },
  { key: 'layers',   label: 'Layers',   icon: <Square size={18} /> },
  { key: 'history',  label: 'History',  icon: <History size={18} /> },
];

// ─── Element definitions ──────────────────────────────────────────────────────

const ELEMENTS: { type: ElementType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'heading',      label: 'Heading',      icon: <Hash size={14} />,             description: 'Title or section header' },
  { type: 'text',         label: 'Text',         icon: <AlignLeft size={14} />,        description: 'Body copy or paragraph' },
  { type: 'cta',          label: 'CTA Button',   icon: <MousePointerClick size={14} />, description: 'Call-to-action button' },
  { type: 'email-input',  label: 'Email Input',  icon: <Mail size={14} />,             description: 'Email capture field' },
  { type: 'link',         label: 'Link',         icon: <Link2 size={14} />,            description: 'Hyperlink text' },
  { type: 'image',        label: 'Image',        icon: <ImageIcon size={14} />,        description: 'Photo or graphic' },
  { type: 'section',      label: 'Section',      icon: <Square size={14} />,           description: 'Grouped container' },
  { type: 'divider',      label: 'Divider',      icon: <Minus size={14} />,            description: 'Horizontal rule' },
  { type: 'spacer',       label: 'Spacer',       icon: <ArrowUpDown size={14} />,      description: 'Vertical gap' },
  { type: 'close-button', label: 'Close Button', icon: <X size={14} />,               description: 'Dismiss the popup' },
];

const ELEMENT_LABELS: Record<ElementType, string> = {
  heading: 'Heading', text: 'Text', cta: 'Button', 'email-input': 'Email Input',
  link: 'Link', image: 'Image', section: 'Section', divider: 'Divider',
  spacer: 'Spacer', 'close-button': 'Close Button',
};

// ─── Reusable property panel atoms ───────────────────────────────────────────

function PropSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-[#f4f4f5]">
      <p className="text-[11px] font-semibold text-[#18181b] uppercase tracking-wider mb-3">{title}</p>
      {children}
    </div>
  );
}

function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-2">
      <span className="text-xs text-[#71717a] shrink-0">{label}</span>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  );
}

function PropInput({ value, className }: { value: string | number; className?: string }) {
  return (
    <input
      type="text"
      defaultValue={value}
      className={cn(
        'rounded-md border border-[#e4e4e7] bg-white px-2 py-1 text-xs text-[#18181b] outline-none focus:border-[#7c3aed] w-full',
        className
      )}
    />
  );
}

function NumberInput({ value, suffix }: { value: number; suffix?: string }) {
  return (
    <div className="flex items-center rounded-md border border-[#e4e4e7] bg-white overflow-hidden">
      <input
        type="number"
        defaultValue={value}
        className="w-10 px-2 py-1 text-xs text-[#18181b] outline-none text-center bg-transparent"
      />
      {suffix && <span className="text-[10px] text-[#a1a1aa] pr-1.5">{suffix}</span>}
    </div>
  );
}

function ColorDot({ color, label }: { color: string; label?: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-[#e4e4e7] bg-white px-2 py-1 cursor-pointer hover:border-[#a1a1aa] transition-colors">
      <div className="w-3.5 h-3.5 rounded shrink-0" style={{ backgroundColor: color }} />
      {label && <span className="text-xs text-[#18181b] font-mono">{label}</span>}
    </div>
  );
}

function SegmentControl({ options, value }: { options: { value: string; label: string }[]; value: string }) {
  const [active, setActive] = useState(value);
  return (
    <div className="flex items-center bg-[#f4f4f5] rounded-md p-0.5 gap-0.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => setActive(o.value)}
          className={cn(
            'px-2.5 py-1 rounded text-xs font-medium transition-colors',
            active === o.value ? 'bg-white text-[#18181b] shadow-sm' : 'text-[#71717a] hover:text-[#18181b]'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Box model (margin / padding) ─────────────────────────────────────────────

function BoxModel({ label, top = 0, right = 0, bottom = 0, left = 0 }: {
  label: string; top?: number; right?: number; bottom?: number; left?: number;
}) {
  const [linked, setLinked] = useState(false);
  const inp = (v: number) => (
    <input
      type="number"
      defaultValue={v}
      className="w-8 h-7 text-center text-xs border border-[#e4e4e7] rounded-md bg-white outline-none focus:border-[#7c3aed] text-[#18181b]"
    />
  );
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#71717a]">{label}</span>
        <div className="flex items-center gap-1">
          <button className="text-[#a1a1aa] hover:text-[#71717a]"><Monitor size={11} /></button>
          <button className="text-[#a1a1aa] hover:text-[#71717a]"><Smartphone size={11} /></button>
        </div>
      </div>
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-[112px] mx-auto place-items-center">
        <div />
        {inp(top)}
        <div />
        {inp(left)}
        <button
          onClick={() => setLinked(v => !v)}
          className="w-7 h-7 rounded-md border border-[#e4e4e7] bg-white flex items-center justify-center text-[#a1a1aa] hover:text-[#71717a] transition-colors"
        >
          {linked ? <Lock size={10} /> : <Unlock size={10} />}
        </button>
        {inp(right)}
        <div />
        {inp(bottom)}
        <div />
      </div>
    </div>
  );
}

// ─── Property tabs content ────────────────────────────────────────────────────

function ContentTab({ item }: { item: CanvasItem }) {
  return (
    <div className="overflow-y-auto flex-1">
      {(item.type === 'cta') && (
        <PropSection title="Button">
          <PropRow label="Label">
            <PropInput value="GET MY 15% OFF" className="w-36" />
          </PropRow>
          <PropRow label="Link URL">
            <PropInput value="https://" className="w-36" />
          </PropRow>
          <PropRow label="Target">
            <SegmentControl options={[{ value: '_self', label: 'Same' }, { value: '_blank', label: 'New' }]} value="_self" />
          </PropRow>
        </PropSection>
      )}
      {item.type === 'heading' && (
        <PropSection title="Heading">
          <div className="mb-2">
            <textarea
              defaultValue="Get 15% Off Your First Order"
              className="w-full rounded-lg border border-[#e4e4e7] bg-white px-3 py-2 text-sm text-[#18181b] outline-none focus:border-[#7c3aed] resize-none leading-snug"
              rows={3}
            />
          </div>
          <PropRow label="Level">
            <SegmentControl options={['H1','H2','H3','H4'].map(h => ({ value: h.toLowerCase(), label: h }))} value="h2" />
          </PropRow>
        </PropSection>
      )}
      {item.type === 'text' && (
        <PropSection title="Text">
          <textarea
            defaultValue="Join our community and receive exclusive offers, new arrivals, and more."
            className="w-full rounded-lg border border-[#e4e4e7] bg-white px-3 py-2 text-xs text-[#18181b] outline-none focus:border-[#7c3aed] resize-none leading-relaxed"
            rows={4}
          />
        </PropSection>
      )}
      {item.type === 'email-input' && (
        <PropSection title="Email Input">
          <PropRow label="Placeholder">
            <PropInput value="Enter your email address" className="w-36" />
          </PropRow>
          <PropRow label="Required">
            <button className="relative w-8 h-4 rounded-full bg-[#18181b]">
              <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
            </button>
          </PropRow>
        </PropSection>
      )}
      {item.type === 'image' && (
        <PropSection title="Image">
          <PropRow label="Source URL">
            <PropInput value="https://" className="w-36" />
          </PropRow>
          <PropRow label="Alt text">
            <PropInput value="" className="w-36" />
          </PropRow>
          <PropRow label="Fit">
            <SegmentControl options={[{ value: 'cover', label: 'Cover' }, { value: 'contain', label: 'Contain' }]} value="cover" />
          </PropRow>
        </PropSection>
      )}
      {item.type === 'link' && (
        <PropSection title="Link">
          <PropRow label="Text"><PropInput value="Click here to learn more" className="w-36" /></PropRow>
          <PropRow label="URL"><PropInput value="https://" className="w-36" /></PropRow>
        </PropSection>
      )}
      {item.type === 'spacer' && (
        <PropSection title="Spacer">
          <PropRow label="Height"><NumberInput value={40} suffix="px" /></PropRow>
        </PropSection>
      )}
      {item.type === 'divider' && (
        <PropSection title="Divider">
          <PropRow label="Style">
            <SegmentControl options={[{ value: 'solid', label: 'Solid' }, { value: 'dashed', label: 'Dashed' }, { value: 'dotted', label: 'Dotted' }]} value="solid" />
          </PropRow>
          <PropRow label="Thickness"><NumberInput value={1} suffix="px" /></PropRow>
        </PropSection>
      )}
      {(item.type === 'section' || item.type === 'close-button') && (
        <PropSection title="Content">
          <p className="text-xs text-[#a1a1aa]">No content options for this element.</p>
        </PropSection>
      )}
    </div>
  );
}

function StyleTab({ item }: { item: CanvasItem }) {
  return (
    <div className="overflow-y-auto flex-1">
      {item.type === 'cta' && (
        <>
          <PropSection title="Colors">
            <PropRow label="Background"><ColorDot color="#e8613a" label="#e8613a" /></PropRow>
            <PropRow label="Text"><ColorDot color="#ffffff" label="#ffffff" /></PropRow>
            <PropRow label="Hover BG"><ColorDot color="#d4522c" label="#d4522c" /></PropRow>
          </PropSection>
          <PropSection title="Typography">
            <PropRow label="Font size"><NumberInput value={14} suffix="px" /></PropRow>
            <PropRow label="Weight">
              <SegmentControl options={[{ value: 'medium', label: 'Med' }, { value: 'semibold', label: 'Semi' }, { value: 'bold', label: 'Bold' }]} value="bold" />
            </PropRow>
            <PropRow label="Letter spacing"><NumberInput value={1} suffix="px" /></PropRow>
          </PropSection>
          <PropSection title="Shape">
            <PropRow label="Border radius"><NumberInput value={6} suffix="px" /></PropRow>
            <PropRow label="Width">
              <SegmentControl options={[{ value: 'auto', label: 'Auto' }, { value: 'full', label: 'Full' }]} value="full" />
            </PropRow>
          </PropSection>
        </>
      )}
      {(item.type === 'heading' || item.type === 'text') && (
        <>
          <PropSection title="Typography">
            <PropRow label="Font size"><NumberInput value={item.type === 'heading' ? 28 : 14} suffix="px" /></PropRow>
            <PropRow label="Line height"><NumberInput value={1} suffix="×" /></PropRow>
            <PropRow label="Color">
              <ColorDot color={item.type === 'heading' ? '#18181b' : '#71717a'} label={item.type === 'heading' ? '#18181b' : '#71717a'} />
            </PropRow>
            <PropRow label="Align">
              <div className="flex items-center bg-[#f4f4f5] rounded-md p-0.5 gap-0.5">
                {[AlignLeft, AlignCenter, AlignRight, AlignJustify].map((Icon, i) => (
                  <button key={i} className={cn('w-6 h-6 rounded flex items-center justify-center text-[#71717a] hover:text-[#18181b] transition-colors', i === 0 && 'bg-white shadow-sm text-[#18181b]')}>
                    <Icon size={11} />
                  </button>
                ))}
              </div>
            </PropRow>
          </PropSection>
          <PropSection title="Background">
            <PropRow label="Color"><ColorDot color="transparent" label="None" /></PropRow>
          </PropSection>
        </>
      )}
      {item.type === 'email-input' && (
        <>
          <PropSection title="Colors">
            <PropRow label="Background"><ColorDot color="#ffffff" label="#ffffff" /></PropRow>
            <PropRow label="Border"><ColorDot color="#e4e4e7" label="#e4e4e7" /></PropRow>
            <PropRow label="Text"><ColorDot color="#18181b" label="#18181b" /></PropRow>
          </PropSection>
          <PropSection title="Shape">
            <PropRow label="Border radius"><NumberInput value={8} suffix="px" /></PropRow>
            <PropRow label="Border width"><NumberInput value={1} suffix="px" /></PropRow>
          </PropSection>
        </>
      )}
      {(item.type === 'image' || item.type === 'section' || item.type === 'close-button' || item.type === 'link' || item.type === 'spacer' || item.type === 'divider') && (
        <PropSection title="Style">
          <PropRow label="Opacity"><NumberInput value={100} suffix="%" /></PropRow>
          {(item.type === 'section') && (
            <PropRow label="Background"><ColorDot color="transparent" label="None" /></PropRow>
          )}
          {item.type === 'link' && (
            <PropRow label="Color"><ColorDot color="#7c3aed" label="#7c3aed" /></PropRow>
          )}
          {item.type === 'divider' && (
            <PropRow label="Color"><ColorDot color="#e4e4e7" label="#e4e4e7" /></PropRow>
          )}
        </PropSection>
      )}
    </div>
  );
}

function DisplayTab() {
  const [visibility, setVisibility] = useState<'all' | 'desktop' | 'mobile'>('all');
  return (
    <div className="overflow-y-auto flex-1">
      {/* Visibility */}
      <PropSection title="Visibility">
        <p className="text-[11px] text-[#71717a] mb-3 leading-relaxed">
          Choose on which devices this element should be visible.
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {([
            { key: 'all',     label: 'All Devices',    icon: <Monitor size={16} /> },
            { key: 'desktop', label: 'Desktop Only',   icon: <Monitor size={16} /> },
            { key: 'mobile',  label: 'Mobile Only',    icon: <Smartphone size={16} /> },
          ] as const).map(opt => (
            <button
              key={opt.key}
              onClick={() => setVisibility(opt.key)}
              className={cn(
                'flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-center transition-all',
                visibility === opt.key
                  ? 'border-[#7c3aed] bg-[#ede9fe] text-[#7c3aed]'
                  : 'border-[#e4e4e7] bg-white text-[#71717a] hover:border-[#a1a1aa]'
              )}
            >
              {opt.icon}
              <span className="text-[10px] font-medium leading-tight">{opt.label}</span>
            </button>
          ))}
        </div>
      </PropSection>

      {/* Spacing */}
      <PropSection title="Spacing">
        <BoxModel label="Margin" top={16} right={0} bottom={16} left={0} />
        <BoxModel label="Padding" top={12} right={24} bottom={12} left={24} />
      </PropSection>
    </div>
  );
}

function AdvancedTab() {
  return (
    <div className="overflow-y-auto flex-1">
      <PropSection title="Identity">
        <PropRow label="CSS Class"><PropInput value="" className="w-36" /></PropRow>
        <PropRow label="Element ID"><PropInput value="" className="w-36" /></PropRow>
      </PropSection>
      <PropSection title="Animation">
        <PropRow label="On Enter">
          <div className="flex items-center justify-between rounded-md border border-[#e4e4e7] bg-white px-2 py-1 w-36 cursor-pointer">
            <span className="text-xs text-[#18181b]">None</span>
            <ChevronDown size={11} className="text-[#a1a1aa]" />
          </div>
        </PropRow>
        <PropRow label="Duration"><NumberInput value={300} suffix="ms" /></PropRow>
        <PropRow label="Delay"><NumberInput value={0} suffix="ms" /></PropRow>
      </PropSection>
      <PropSection title="Interaction">
        <PropRow label="On Click">
          <div className="flex items-center justify-between rounded-md border border-[#e4e4e7] bg-white px-2 py-1 w-36 cursor-pointer">
            <span className="text-xs text-[#18181b]">None</span>
            <ChevronDown size={11} className="text-[#a1a1aa]" />
          </div>
        </PropRow>
      </PropSection>
    </div>
  );
}

// ─── Element property panel ───────────────────────────────────────────────────

function ElementPropertyPanel({
  item,
  onDeselect,
  onRemove,
}: {
  item: CanvasItem;
  onDeselect: () => void;
  onRemove: () => void;
}) {
  const [tab, setTab] = useState<PropTab>('display');
  const label = ELEMENT_LABELS[item.type];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#e4e4e7] shrink-0">
        <button
          onClick={onDeselect}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#18181b] hover:text-[#71717a] transition-colors"
        >
          <ChevronLeft size={14} />
          {label}
        </button>
        <div className="flex items-center gap-0.5">
          <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors">
            <Copy size={13} />
          </button>
          <button
            onClick={onRemove}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#a1a1aa] hover:text-[#dc2626] hover:bg-[#fef2f2] transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[#e4e4e7] shrink-0 px-1">
        {(['content', 'style', 'display', 'advanced'] as PropTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-2.5 py-2 text-[11px] font-medium capitalize border-b-2 -mb-px transition-colors',
              tab === t ? 'border-[#7c3aed] text-[#7c3aed]' : 'border-transparent text-[#71717a] hover:text-[#18181b]'
            )}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'content'  && <ContentTab item={item} />}
      {tab === 'style'    && <StyleTab item={item} />}
      {tab === 'display'  && <DisplayTab />}
      {tab === 'advanced' && <AdvancedTab />}
    </div>
  );
}

// ─── Sidebar panels (when nothing selected) ───────────────────────────────────

function ElementsPanel({ onDragStart }: { onDragStart: (type: ElementType) => void }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-3 pb-2 shrink-0">
        <p className="text-xs font-semibold text-[#18181b]">Elements</p>
        <p className="text-[11px] text-[#a1a1aa] mt-0.5">Drag onto the canvas to add</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="grid grid-cols-2 gap-1.5">
          {ELEMENTS.map(el => (
            <div
              key={el.type}
              draggable
              onDragStart={() => onDragStart(el.type)}
              className="flex flex-col items-start gap-2 p-3 rounded-xl border border-[#e4e4e7] bg-white hover:border-[#7c3aed] hover:shadow-sm transition-all cursor-grab active:cursor-grabbing active:opacity-60 select-none"
            >
              <div className="w-7 h-7 rounded-lg bg-[#f4f4f5] flex items-center justify-center text-[#3f3f46] shrink-0">
                {el.icon}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#18181b] leading-tight">{el.label}</p>
                <p className="text-[10px] text-[#a1a1aa] mt-0.5 leading-snug">{el.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemePanel() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <PropSection title="Colors">
        {[
          { label: 'Background', color: '#ffffff' },
          { label: 'Text',       color: '#18181b' },
          { label: 'Accent',     color: '#e8613a' },
          { label: 'Border',     color: '#e4e4e7' },
        ].map(c => (
          <PropRow key={c.label} label={c.label}><ColorDot color={c.color} label={c.color} /></PropRow>
        ))}
      </PropSection>
      <PropSection title="Typography">
        <PropRow label="Font Family">
          <div className="flex items-center justify-between rounded-md border border-[#e4e4e7] bg-white px-2 py-1 w-36 cursor-pointer">
            <span className="text-xs text-[#18181b]">Inter</span>
            <ChevronDown size={11} className="text-[#a1a1aa]" />
          </div>
        </PropRow>
        <PropRow label="Heading size"><NumberInput value={28} suffix="px" /></PropRow>
        <PropRow label="Body size"><NumberInput value={14} suffix="px" /></PropRow>
      </PropSection>
      <PropSection title="Shape">
        <PropRow label="Border Radius">
          <SegmentControl options={['None','SM','MD','LG'].map(v => ({ value: v.toLowerCase(), label: v }))} value="md" />
        </PropRow>
      </PropSection>
      <PropSection title="Overlay">
        <PropRow label="Show overlay">
          <button className="relative w-8 h-4 rounded-full bg-[#18181b]">
            <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
          </button>
        </PropRow>
        <PropRow label="Opacity"><NumberInput value={60} suffix="%" /></PropRow>
      </PropSection>
    </div>
  );
}

function DisplayPanel() {
  const [trigger, setTrigger] = useState<'load' | 'exit' | 'scroll' | 'delay'>('load');
  const triggers = [
    { key: 'load' as const,   label: 'On Page Load' },
    { key: 'exit' as const,   label: 'Exit Intent' },
    { key: 'scroll' as const, label: 'On Scroll' },
    { key: 'delay' as const,  label: 'After Delay' },
  ];
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <PropSection title="Trigger">
        <div className="flex flex-col gap-1.5">
          {triggers.map(t => (
            <button
              key={t.key}
              onClick={() => setTrigger(t.key)}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all',
                trigger === t.key ? 'border-[#7c3aed] bg-[#ede9fe]' : 'border-[#e4e4e7] bg-white hover:border-[#a1a1aa]'
              )}
            >
              <span className={cn('text-xs font-medium', trigger === t.key ? 'text-[#7c3aed]' : 'text-[#3f3f46]')}>{t.label}</span>
              {trigger === t.key && <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />}
            </button>
          ))}
        </div>
      </PropSection>
      <PropSection title="Frequency">
        {['Once per session', 'Once per day', 'Always show'].map((f, i) => (
          <button key={f} className={cn('flex items-center justify-between w-full px-3 py-2 rounded-lg border mb-1.5 text-left transition-all', i === 0 ? 'border-[#7c3aed] bg-[#ede9fe]' : 'border-[#e4e4e7] bg-white hover:border-[#a1a1aa]')}>
            <span className={cn('text-xs font-medium', i === 0 ? 'text-[#7c3aed]' : 'text-[#3f3f46]')}>{f}</span>
          </button>
        ))}
      </PropSection>
    </div>
  );
}

function CodePanel() {
  const [tab, setTab] = useState<'css' | 'js'>('css');
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-3 pb-0 shrink-0 border-b border-[#e4e4e7]">
        <div className="flex gap-0">
          {(['css', 'js'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-2 text-xs font-medium uppercase tracking-wider border-b-2 -mb-px transition-colors', tab === t ? 'border-[#7c3aed] text-[#7c3aed]' : 'border-transparent text-[#a1a1aa] hover:text-[#3f3f46]')}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-3 overflow-hidden">
        <textarea
          className="w-full h-full resize-none rounded-xl border border-[#e4e4e7] bg-[#18181b] text-[#a8ff78] font-mono text-xs p-4 outline-none leading-relaxed"
          spellCheck={false}
          key={tab}
          defaultValue={tab === 'css' ? `/* Custom CSS */\n.evo-popup {\n  /* your styles here */\n}` : `// Custom JS\ndocument.addEventListener('evo:popup:open', (e) => {\n  console.log('Popup opened', e.detail);\n});`}
        />
      </div>
    </div>
  );
}

function LayersPanel({ items, selectedId, onSelect }: { items: CanvasItem[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-3 pb-2 shrink-0">
        <p className="text-xs font-semibold text-[#18181b]">Layers</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors mb-0.5',
              selectedId === item.id ? 'bg-[#ede9fe] text-[#7c3aed]' : 'hover:bg-[#f4f4f5] text-[#3f3f46]'
            )}
          >
            <span className="text-[10px] text-[#a1a1aa] w-4 shrink-0">{i + 1}</span>
            <div className="w-5 h-5 rounded bg-[#f4f4f5] flex items-center justify-center shrink-0">
              {ELEMENTS.find(e => e.type === item.type)?.icon}
            </div>
            <span className="text-xs font-medium truncate">{ELEMENT_LABELS[item.type]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Canvas element renderer ──────────────────────────────────────────────────

function CanvasElement({
  item,
  selected,
  onClick,
}: {
  item: CanvasItem;
  selected: boolean;
  onClick: () => void;
}) {
  const content: Record<ElementType, React.ReactNode> = {
    heading: <p className="text-[22px] font-bold text-[#18181b] leading-tight px-1 py-1">Get 15% Off Your First Order</p>,
    text: <p className="text-sm text-[#71717a] leading-relaxed px-1 py-1">Join our community and receive exclusive offers, new arrivals, and more.</p>,
    cta: (
      <button className="w-full py-3 px-6 rounded-md bg-[#e8613a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#d4522c] transition-colors">
        GET MY 15% OFF
      </button>
    ),
    'email-input': (
      <div className="flex items-center rounded-md border border-[#e4e4e7] bg-white px-3 h-10">
        <span className="text-sm text-[#a1a1aa]">Enter your email address</span>
      </div>
    ),
    link: <p className="text-xs text-[#71717a] text-center py-1 px-1 flex items-center justify-center gap-1.5"><Lock size={10} className="shrink-0" /> No spam. Unsubscribe anytime.</p>,
    image: (
      <div className="bg-[#f4f4f5] rounded-lg h-28 flex flex-col items-center justify-center gap-2">
        <ImageIcon size={20} className="text-[#a1a1aa]" />
        <span className="text-xs text-[#a1a1aa]">Drop image here</span>
      </div>
    ),
    section: (
      <div className="border-2 border-dashed border-[#d4d4d8] rounded-lg p-4 min-h-[60px] flex items-center justify-center bg-[#fafafa]">
        <span className="text-xs text-[#a1a1aa]">Section — drop elements inside</span>
      </div>
    ),
    divider: <div className="py-3 px-1"><div className="h-px bg-[#e4e4e7] w-full" /></div>,
    spacer: (
      <div className="border border-dashed border-[#e4e4e7] rounded-md mx-1 h-10 flex items-center justify-center bg-[#fafafa]">
        <span className="text-[10px] text-[#d4d4d8] uppercase tracking-wider">Spacer</span>
      </div>
    ),
    'close-button': (
      <div className="flex justify-end px-1 py-1">
        <div className="w-7 h-7 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center">
          <X size={12} className="text-[#71717a]" />
        </div>
      </div>
    ),
  };

  return (
    <div
      onClick={e => { e.stopPropagation(); onClick(); }}
      className={cn('relative group cursor-pointer rounded-md transition-all', selected ? 'ring-2 ring-[#7c3aed]' : 'hover:ring-1 hover:ring-[#a78bfa]')}
    >
      {/* Element type label */}
      {selected && (
        <div className="absolute -top-6 left-0 bg-[#7c3aed] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded z-10 pointer-events-none">
          {ELEMENT_LABELS[item.type]}
        </div>
      )}
      {/* Selection handles */}
      {selected && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-[#7c3aed] rounded-sm z-10 pointer-events-none" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-[#7c3aed] rounded-sm z-10 pointer-events-none" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-[#7c3aed] rounded-sm z-10 pointer-events-none" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-[#7c3aed] rounded-sm z-10 pointer-events-none" />
        </>
      )}
      <div className="px-0.5">{content[item.type]}</div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const INITIAL_ITEMS: CanvasItem[] = [
  { id: 'i-close',  type: 'close-button' },
  { id: 'i-head',   type: 'heading' },
  { id: 'i-text',   type: 'text' },
  { id: 'i-email',  type: 'email-input' },
  { id: 'i-cta',    type: 'cta' },
  { id: 'i-link',   type: 'link' },
];

const STEPS = [
  { id: 1, label: 'Email Capture' },
  { id: 2, label: 'Offer Reveal' },
  { id: 3, label: 'Thank You' },
];

export default function PopupsPage() {
  const [activePanel, setActivePanel] = useState<PanelKey>('elements');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeStep, setActiveStep] = useState(1);
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>(INITIAL_ITEMS);
  const [selectedItemId, setSelectedItemId] = useState<string | null>('i-cta');
  const [isDragOver, setIsDragOver] = useState(false);
  const dragTypeRef = { current: null as ElementType | null };

  const selectedItem = canvasItems.find(i => i.id === selectedItemId) ?? null;

  function handleDragStart(type: ElementType) { dragTypeRef.current = type; }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setIsDragOver(false);
    if (dragTypeRef.current) {
      const newItem: CanvasItem = { id: `item-${Date.now()}`, type: dragTypeRef.current };
      setCanvasItems(prev => [...prev, newItem]);
      setSelectedItemId(newItem.id);
      dragTypeRef.current = null;
    }
  }
  function removeItem(id: string) {
    setCanvasItems(prev => prev.filter(i => i.id !== id));
    if (selectedItemId === id) setSelectedItemId(null);
  }

  const showTextToolbar = selectedItem && (selectedItem.type === 'heading' || selectedItem.type === 'text' || selectedItem.type === 'link');

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── Top bar ── */}
        <header className="flex items-center gap-3 px-4 py-2 border-b border-[#e4e4e7] bg-white shrink-0 h-12">
          <button className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#18181b] transition-colors shrink-0">
            <ArrowLeft size={13} />
            Back
          </button>
          <div className="w-px h-4 bg-[#e4e4e7]" />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-[#18181b]">Welcome Offer Popup</span>
            <button className="text-[#a1a1aa] hover:text-[#71717a] transition-colors"><Settings size={12} /></button>
            <span className="text-[10px] font-medium text-[#a1a1aa] bg-[#f4f4f5] border border-[#e4e4e7] px-2 py-0.5 rounded-full">Draft</span>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-1 ml-2">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="text-[#d4d4d8]" />}
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                    activeStep === step.id
                      ? 'bg-[#18181b] text-white'
                      : 'text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]'
                  )}
                >
                  <span className={cn('w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0', activeStep === step.id ? 'bg-white/20' : 'bg-[#f4f4f5] text-[#71717a]')}>
                    {step.id}
                  </span>
                  {step.label}
                </button>
              </div>
            ))}
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[#a1a1aa] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors ml-1">
              <Plus size={12} />
              Add Step
            </button>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button className="w-7 h-7 flex items-center justify-center rounded-md text-[#a1a1aa] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors"><Undo2 size={13} /></button>
            <button className="w-7 h-7 flex items-center justify-center rounded-md text-[#a1a1aa] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors"><Redo2 size={13} /></button>
            <div className="w-px h-4 bg-[#e4e4e7] mx-1" />
            <button className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-medium text-[#3f3f46] border border-[#e4e4e7] hover:border-[#a1a1aa] transition-colors"><Eye size={12} />Preview</button>
            <button className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-medium text-[#3f3f46] border border-[#e4e4e7] hover:border-[#a1a1aa] transition-colors"><Save size={12} />Save</button>
            <button className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-medium bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors"><Zap size={12} />Publish</button>
          </div>
        </header>

        {/* ── Text formatting toolbar (conditional) ── */}
        {showTextToolbar && (
          <div className="flex items-center gap-1 px-4 h-9 border-b border-[#e4e4e7] bg-white shrink-0">
            <select className="h-6 rounded border border-[#e4e4e7] text-xs text-[#18181b] px-1.5 bg-white outline-none">
              <option>Inter</option><option>Geist</option><option>DM Sans</option>
            </select>
            <select className="h-6 w-14 rounded border border-[#e4e4e7] text-xs text-[#18181b] px-1 bg-white outline-none">
              <option>16px</option><option>14px</option><option>18px</option><option>24px</option><option>28px</option>
            </select>
            <select className="h-6 w-20 rounded border border-[#e4e4e7] text-xs text-[#18181b] px-1.5 bg-white outline-none">
              <option>Medium</option><option>Regular</option><option>SemiBold</option><option>Bold</option>
            </select>
            <div className="w-px h-4 bg-[#e4e4e7] mx-1" />
            {[Bold, Italic, Underline, Strikethrough].map((Icon, i) => (
              <button key={i} className="w-6 h-6 rounded flex items-center justify-center text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors">
                <Icon size={12} />
              </button>
            ))}
            <div className="w-px h-4 bg-[#e4e4e7] mx-1" />
            {[AlignLeft, AlignCenter, AlignRight, AlignJustify].map((Icon, i) => (
              <button key={i} className="w-6 h-6 rounded flex items-center justify-center text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors">
                <Icon size={12} />
              </button>
            ))}
            <div className="w-px h-4 bg-[#e4e4e7] mx-1" />
            {[List, ListOrdered].map((Icon, i) => (
              <button key={i} className="w-6 h-6 rounded flex items-center justify-center text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors">
                <Icon size={12} />
              </button>
            ))}
            <div className="w-px h-4 bg-[#e4e4e7] mx-1" />
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-[#a1a1aa]">1.4</span>
              <ChevronDown size={10} className="text-[#a1a1aa]" />
            </div>
          </div>
        )}

        {/* ── Main content ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* Left icon nav */}
          <div className="w-[52px] border-r border-[#e4e4e7] bg-[#fafafa] flex flex-col items-center py-2 gap-0.5 shrink-0">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                onClick={() => { setActivePanel(item.key); setSelectedItemId(null); }}
                title={item.label}
                className={cn(
                  'w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all',
                  activePanel === item.key && !selectedItem
                    ? 'bg-[#18181b] text-white'
                    : 'text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]'
                )}
              >
                {item.icon}
                <span className="text-[8px] font-semibold tracking-wide leading-none">{item.label.slice(0, 4)}</span>
              </button>
            ))}
            <div className="mt-auto">
              <button title="Settings" className="w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-all">
                <Settings size={18} />
                <span className="text-[8px] font-semibold tracking-wide leading-none">Sett</span>
              </button>
            </div>
          </div>

          {/* Context panel */}
          <div className="w-[300px] shrink-0 border-r border-[#e4e4e7] bg-white flex flex-col overflow-hidden">
            {selectedItem ? (
              <ElementPropertyPanel
                item={selectedItem}
                onDeselect={() => setSelectedItemId(null)}
                onRemove={() => removeItem(selectedItem.id)}
              />
            ) : (
              <>
                {activePanel === 'elements' && <ElementsPanel onDragStart={handleDragStart} />}
                {activePanel === 'theme'    && <ThemePanel />}
                {activePanel === 'display'  && <DisplayPanel />}
                {activePanel === 'code'     && <CodePanel />}
                {activePanel === 'layers'   && <LayersPanel items={canvasItems} selectedId={selectedItemId} onSelect={id => setSelectedItemId(id)} />}
                {activePanel === 'history'  && (
                  <div className="px-4 py-3">
                    <p className="text-xs font-semibold text-[#18181b] mb-3">History</p>
                    {['Added CTA button', 'Changed heading text', 'Added email input', 'Initial layout'].map((h, i) => (
                      <div key={h} className="flex items-center gap-2 py-2 border-b border-[#f4f4f5] last:border-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d4d4d8] shrink-0" />
                        <span className={cn('text-xs', i === 0 ? 'text-[#18181b] font-medium' : 'text-[#a1a1aa]')}>{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#f0f0f0]">

            {/* Canvas toolbar */}
            <div className="flex items-center justify-between px-4 h-10 border-b border-[#e4e4e7] bg-white shrink-0">
              <div className="flex items-center bg-[#f4f4f5] rounded-lg p-0.5">
                <button onClick={() => setDevice('desktop')} className={cn('w-7 h-7 rounded-md flex items-center justify-center transition-colors', device === 'desktop' ? 'bg-white shadow-sm text-[#18181b]' : 'text-[#a1a1aa] hover:text-[#71717a]')}>
                  <Monitor size={13} />
                </button>
                <button onClick={() => setDevice('mobile')} className={cn('w-7 h-7 rounded-md flex items-center justify-center transition-colors', device === 'mobile' ? 'bg-white shadow-sm text-[#18181b]' : 'text-[#a1a1aa] hover:text-[#71717a]')}>
                  <Smartphone size={13} />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 rounded-md border border-[#e4e4e7] bg-white px-2 py-1">
                  <span className="text-[10px] text-[#a1a1aa]">W</span>
                  <input defaultValue="1280" className="w-10 text-xs text-[#18181b] outline-none text-center" />
                  <span className="text-[10px] text-[#a1a1aa]">px</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button className="w-6 h-6 rounded flex items-center justify-center text-[#71717a] hover:bg-[#f4f4f5] transition-colors"><Minus size={11} /></button>
                <span className="text-xs text-[#71717a] w-9 text-center">100%</span>
                <button className="w-6 h-6 rounded flex items-center justify-center text-[#71717a] hover:bg-[#f4f4f5] transition-colors"><Plus size={11} /></button>
              </div>
            </div>

            {/* Canvas area */}
            <div
              className="flex-1 overflow-auto flex items-center justify-center p-12"
              onClick={() => setSelectedItemId(null)}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              {/* Simulated background overlay */}
              <div className="relative">
                <div className="absolute -inset-16 bg-black/25 rounded-3xl pointer-events-none" />

                {/* Popup card */}
                <div
                  className={cn(
                    'relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300',
                    device === 'desktop' ? 'w-[520px]' : 'w-[340px]',
                    isDragOver && 'ring-2 ring-[#7c3aed] ring-offset-2'
                  )}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Drop hint */}
                  {isDragOver && (
                    <div className="absolute inset-0 bg-[#7c3aed]/5 rounded-2xl flex items-center justify-center z-20 pointer-events-none">
                      <div className="flex items-center gap-2 bg-[#7c3aed] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                        <Plus size={12} /> Drop to add
                      </div>
                    </div>
                  )}

                  <div className="p-7 flex flex-col gap-3">
                    {canvasItems.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-12 text-center">
                        <div className="w-10 h-10 rounded-xl bg-[#f4f4f5] flex items-center justify-center">
                          <Layers size={18} className="text-[#a1a1aa]" />
                        </div>
                        <p className="text-sm font-medium text-[#a1a1aa]">Drag elements here</p>
                        <p className="text-xs text-[#d4d4d8]">Select Elements from the left panel</p>
                      </div>
                    ) : (
                      canvasItems.map(item => (
                        <CanvasElement
                          key={item.id}
                          item={item}
                          selected={selectedItemId === item.id}
                          onClick={() => setSelectedItemId(item.id)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
