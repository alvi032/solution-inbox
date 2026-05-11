'use client';

import { useState } from 'react';
import AppSidebar from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import {
  Palette,
  Monitor,
  Layers,
  Code2,
  AlignLeft,
  Hash,
  Square,
  X,
  Link2,
  ArrowUpDown,
  Minus,
  Image as ImageIcon,
  MousePointerClick,
  GripVertical,
  Smartphone,
  ChevronDown,
  Plus,
  Settings,
  Zap,
  Clock,
  ArrowDown,
  LogOut,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type PanelKey = 'theme' | 'display' | 'elements' | 'code';
type ElementType = 'cta' | 'text' | 'heading' | 'section' | 'close-button' | 'link' | 'spacer' | 'divider' | 'image';

interface CanvasItem {
  id: string;
  type: ElementType;
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const NAV_ITEMS: { key: PanelKey; label: string; icon: React.ReactNode }[] = [
  { key: 'theme',    label: 'Theme',    icon: <Palette size={16} /> },
  { key: 'display',  label: 'Display',  icon: <Monitor size={16} /> },
  { key: 'elements', label: 'Elements', icon: <Layers size={16} /> },
  { key: 'code',     label: 'Code',     icon: <Code2 size={16} /> },
];

// ─── Element definitions ──────────────────────────────────────────────────────

const ELEMENTS: { type: ElementType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'heading',      label: 'Heading',      icon: <Hash size={15} />,             description: 'Title or section header' },
  { type: 'text',         label: 'Text',         icon: <AlignLeft size={15} />,        description: 'Body copy or paragraph' },
  { type: 'cta',          label: 'CTA Button',   icon: <MousePointerClick size={15} />, description: 'Call-to-action button' },
  { type: 'link',         label: 'Link',         icon: <Link2 size={15} />,            description: 'Hyperlink text' },
  { type: 'image',        label: 'Image',        icon: <ImageIcon size={15} />,        description: 'Photo or graphic' },
  { type: 'section',      label: 'Section',      icon: <Square size={15} />,           description: 'Grouped container' },
  { type: 'divider',      label: 'Divider',      icon: <Minus size={15} />,            description: 'Horizontal rule' },
  { type: 'spacer',       label: 'Spacer',       icon: <ArrowUpDown size={15} />,      description: 'Vertical gap' },
  { type: 'close-button', label: 'Close Button', icon: <X size={15} />,               description: 'Dismiss the popup' },
];

// ─── Canvas element renderer ──────────────────────────────────────────────────

function CanvasElement({ item, onRemove }: { item: CanvasItem; onRemove: () => void }) {
  const content: Record<ElementType, React.ReactNode> = {
    heading: (
      <p className="text-xl font-bold text-[#18181b] leading-tight py-1 px-1">
        Your Popup Heading
      </p>
    ),
    text: (
      <div className="space-y-2 py-1 px-1">
        <div className="h-2.5 bg-[#e4e4e7] rounded-full w-full" />
        <div className="h-2.5 bg-[#e4e4e7] rounded-full w-5/6" />
        <div className="h-2.5 bg-[#e4e4e7] rounded-full w-2/3" />
      </div>
    ),
    cta: (
      <div className="flex justify-center py-1 px-1">
        <button className="px-6 py-2.5 rounded-lg bg-[#18181b] text-white text-sm font-semibold hover:bg-[#27272a] transition-colors">
          Get Started
        </button>
      </div>
    ),
    link: (
      <div className="py-1 px-1">
        <span className="text-sm text-[#7c3aed] underline underline-offset-2 cursor-pointer hover:text-[#6d28d9] transition-colors">
          Click here to learn more →
        </span>
      </div>
    ),
    image: (
      <div className="bg-[#f4f4f5] rounded-xl h-28 flex flex-col items-center justify-center gap-2 mx-1">
        <ImageIcon size={22} className="text-[#a1a1aa]" />
        <span className="text-xs text-[#a1a1aa]">Drop image here</span>
      </div>
    ),
    section: (
      <div className="border-2 border-dashed border-[#d4d4d8] rounded-xl p-4 mx-1 min-h-[64px] flex items-center justify-center bg-[#fafafa]">
        <span className="text-xs text-[#a1a1aa]">Section — drop elements inside</span>
      </div>
    ),
    divider: (
      <div className="py-3 px-1">
        <div className="h-px bg-[#e4e4e7] w-full" />
      </div>
    ),
    spacer: (
      <div className="border border-dashed border-[#e4e4e7] rounded-lg mx-1 h-10 flex items-center justify-center bg-[#fafafa]">
        <span className="text-[10px] text-[#d4d4d8] uppercase tracking-wider font-medium">Spacer · 40px</span>
      </div>
    ),
    'close-button': (
      <div className="flex justify-end py-1 px-1">
        <div className="w-7 h-7 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center cursor-pointer hover:bg-[#e4e4e7] transition-colors">
          <X size={13} className="text-[#71717a]" />
        </div>
      </div>
    ),
  };

  return (
    <div className="group relative py-0.5">
      {/* Drag handle */}
      <div className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical size={13} className="text-[#d4d4d8]" />
      </div>
      {/* Remove */}
      <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={onRemove}
          className="w-5 h-5 rounded flex items-center justify-center text-[#a1a1aa] hover:text-[#dc2626] hover:bg-[#fef2f2] transition-colors"
        >
          <X size={11} />
        </button>
      </div>
      {/* Hover outline */}
      <div className="rounded-lg ring-1 ring-transparent group-hover:ring-[#d4d4d8] transition-all">
        {content[item.type]}
      </div>
    </div>
  );
}

// ─── Context panels ───────────────────────────────────────────────────────────

function ElementsPanel({ onDragStart }: { onDragStart: (type: ElementType) => void }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-3 pt-3 pb-2 shrink-0">
        <p className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">Elements</p>
        <p className="text-xs text-[#a1a1aa] mt-0.5">Drag onto the canvas to add</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="grid grid-cols-2 gap-1.5">
          {ELEMENTS.map(el => (
            <div
              key={el.type}
              draggable
              onDragStart={() => onDragStart(el.type)}
              className="flex flex-col items-start gap-2 p-3 rounded-xl border border-[#e4e4e7] bg-white hover:border-[#18181b] hover:shadow-sm transition-all cursor-grab active:cursor-grabbing active:opacity-60 select-none"
            >
              <div className="w-7 h-7 rounded-lg bg-[#f4f4f5] flex items-center justify-center text-[#3f3f46] shrink-0">
                {el.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#18181b] leading-tight">{el.label}</p>
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
  const colors = [
    { label: 'Background', value: '#ffffff', swatch: 'bg-white border border-[#e4e4e7]' },
    { label: 'Text',       value: '#18181b', swatch: 'bg-[#18181b]' },
    { label: 'Accent',     value: '#7c3aed', swatch: 'bg-[#7c3aed]' },
    { label: 'Border',     value: '#e4e4e7', swatch: 'bg-[#e4e4e7]' },
  ];

  const fonts = ['Inter', 'Geist', 'Satoshi', 'DM Sans', 'Sora'];
  const radii = ['None', 'Small', 'Medium', 'Large', 'Full'];

  return (
    <div className="flex flex-col h-full overflow-y-auto px-3 py-3 gap-5">
      {/* Colors */}
      <div>
        <p className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2.5">Colors</p>
        <div className="flex flex-col gap-2">
          {colors.map(c => (
            <div key={c.label} className="flex items-center justify-between">
              <span className="text-xs text-[#3f3f46]">{c.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#a1a1aa]">{c.value}</span>
                <div className={cn('w-6 h-6 rounded-md cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-[#18181b] transition-all', c.swatch)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <p className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2.5">Typography</p>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-[11px] text-[#71717a] mb-1">Font Family</p>
            <div className="flex items-center justify-between rounded-lg border border-[#e4e4e7] bg-white px-3 py-2 cursor-pointer hover:border-[#a1a1aa] transition-colors">
              <span className="text-xs text-[#18181b] font-medium">Inter</span>
              <ChevronDown size={12} className="text-[#a1a1aa]" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-[11px] text-[#71717a] mb-1">Heading size</p>
              <div className="rounded-lg border border-[#e4e4e7] bg-white px-3 py-2 text-xs text-[#18181b]">24px</div>
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-[#71717a] mb-1">Body size</p>
              <div className="rounded-lg border border-[#e4e4e7] bg-white px-3 py-2 text-xs text-[#18181b]">14px</div>
            </div>
          </div>
        </div>
      </div>

      {/* Border radius */}
      <div>
        <p className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2.5">Border Radius</p>
        <div className="flex gap-1.5 flex-wrap">
          {radii.map((r, i) => (
            <button
              key={r}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors',
                i === 2
                  ? 'border-[#18181b] bg-[#18181b] text-white'
                  : 'border-[#e4e4e7] text-[#71717a] hover:border-[#a1a1aa] hover:text-[#18181b]'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div>
        <p className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2.5">Overlay</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#3f3f46]">Show overlay</span>
            <button className="relative w-8 h-4 rounded-full bg-[#18181b] transition-colors">
              <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#3f3f46]">Overlay opacity</span>
            <span className="text-xs font-medium text-[#18181b]">60%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DisplayPanel() {
  const [trigger, setTrigger] = useState<'load' | 'exit' | 'scroll' | 'delay'>('load');
  const [frequency, setFrequency] = useState<'session' | 'day' | 'always'>('session');

  const triggers = [
    { key: 'load',  label: 'On Page Load',   icon: <Zap size={13} /> },
    { key: 'exit',  label: 'Exit Intent',     icon: <LogOut size={13} /> },
    { key: 'scroll', label: 'On Scroll',      icon: <ArrowDown size={13} /> },
    { key: 'delay', label: 'After Delay',     icon: <Clock size={13} /> },
  ] as const;

  const frequencies = [
    { key: 'session', label: 'Once per session' },
    { key: 'day',     label: 'Once per day' },
    { key: 'always',  label: 'Always show' },
  ] as const;

  return (
    <div className="flex flex-col h-full overflow-y-auto px-3 py-3 gap-5">
      {/* Trigger */}
      <div>
        <p className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2.5">Trigger</p>
        <div className="flex flex-col gap-1.5">
          {triggers.map(t => (
            <button
              key={t.key}
              onClick={() => setTrigger(t.key)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all',
                trigger === t.key
                  ? 'border-[#18181b] bg-[#18181b] text-white'
                  : 'border-[#e4e4e7] bg-white text-[#3f3f46] hover:border-[#a1a1aa]'
              )}
            >
              <span className="shrink-0">{t.icon}</span>
              <span className="text-xs font-medium">{t.label}</span>
              {trigger === t.key && <span className="ml-auto text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">Active</span>}
            </button>
          ))}
        </div>
        {trigger === 'delay' && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-[#e4e4e7] bg-white px-3 py-2 text-xs text-[#18181b] font-medium">5</div>
            <span className="text-xs text-[#71717a]">seconds</span>
          </div>
        )}
        {trigger === 'scroll' && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-[#e4e4e7] bg-white px-3 py-2 text-xs text-[#18181b] font-medium">50</div>
            <span className="text-xs text-[#71717a]">% scrolled</span>
          </div>
        )}
      </div>

      {/* Frequency */}
      <div>
        <p className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2.5">Show Frequency</p>
        <div className="flex flex-col gap-1.5">
          {frequencies.map(f => (
            <button
              key={f.key}
              onClick={() => setFrequency(f.key)}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all',
                frequency === f.key
                  ? 'border-[#18181b] bg-[#fafafa]'
                  : 'border-[#e4e4e7] bg-white hover:border-[#a1a1aa]'
              )}
            >
              <span className="text-xs font-medium text-[#18181b]">{f.label}</span>
              <div className={cn(
                'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                frequency === f.key ? 'border-[#18181b]' : 'border-[#d4d4d8]'
              )}>
                {frequency === f.key && <div className="w-2 h-2 rounded-full bg-[#18181b]" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Position */}
      <div>
        <p className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2.5">Position</p>
        <div className="grid grid-cols-3 gap-1.5">
          {['Top Left', 'Top Center', 'Top Right', 'Center Left', 'Center', 'Center Right', 'Bottom Left', 'Bottom Center', 'Bottom Right'].map((pos, i) => (
            <button
              key={pos}
              className={cn(
                'h-9 rounded-lg border text-[10px] font-medium transition-all',
                i === 4
                  ? 'border-[#18181b] bg-[#18181b] text-white'
                  : 'border-[#e4e4e7] text-[#a1a1aa] hover:border-[#a1a1aa] hover:text-[#18181b]'
              )}
            >
              {pos.split(' ').map(w => w[0]).join('')}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-[#a1a1aa] mt-1.5 text-center">Center (selected)</p>
      </div>
    </div>
  );
}

function CodePanel() {
  const [tab, setTab] = useState<'css' | 'js'>('css');
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-3 pt-3 pb-0 shrink-0">
        <p className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2.5">Custom Code</p>
        <div className="flex items-center gap-0 border-b border-[#e4e4e7]">
          {(['css', 'js'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-3 py-2 text-xs font-medium uppercase tracking-wider border-b-2 -mb-px transition-colors',
                tab === t ? 'border-[#18181b] text-[#18181b]' : 'border-transparent text-[#a1a1aa] hover:text-[#3f3f46]'
              )}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-3 overflow-hidden">
        <textarea
          className="w-full h-full resize-none rounded-xl border border-[#e4e4e7] bg-[#18181b] text-[#a8ff78] font-mono text-xs p-4 outline-none focus:border-[#71717a] transition-colors leading-relaxed"
          spellCheck={false}
          defaultValue={tab === 'css'
            ? `/* Custom CSS */\n.evo-popup {\n  /* your styles here */\n}\n\n.evo-popup__overlay {\n  backdrop-filter: blur(4px);\n}`
            : `// Custom JS\ndocument.addEventListener('evo:popup:open', (e) => {\n  console.log('Popup opened', e.detail);\n});`
          }
          key={tab}
        />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PopupsPage() {
  const [activePanel, setActivePanel] = useState<PanelKey>('elements');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([
    { id: 'init-1', type: 'heading' },
    { id: 'init-2', type: 'text' },
    { id: 'init-3', type: 'cta' },
  ]);
  const [isDragOver, setIsDragOver] = useState(false);
  const draggingType = useState<ElementType | null>(null);
  const dragTypeRef = { current: null as ElementType | null };

  function handleDragStart(type: ElementType) {
    dragTypeRef.current = type;
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (dragTypeRef.current) {
      setCanvasItems(prev => [...prev, { id: `item-${Date.now()}`, type: dragTypeRef.current! }]);
      dragTypeRef.current = null;
    }
  }

  function removeItem(id: string) {
    setCanvasItems(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />

      {/* ── Popups sidebar nav ── */}
      <div className="w-[48px] shrink-0 flex flex-col items-center py-3 gap-1 border-r border-[#e4e4e7] bg-[#fafafa]">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => setActivePanel(activePanel === item.key ? activePanel : item.key)}
            title={item.label}
            className={cn(
              'w-9 h-9 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all',
              activePanel === item.key
                ? 'bg-[#18181b] text-white'
                : 'text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]'
            )}
          >
            {item.icon}
            <span className="text-[8px] font-semibold leading-none tracking-wide">{item.label.slice(0, 4)}</span>
          </button>
        ))}
      </div>

      {/* ── Context panel ── */}
      <div className="w-[220px] shrink-0 border-r border-[#e4e4e7] bg-white flex flex-col overflow-hidden">
        {activePanel === 'elements' && <ElementsPanel onDragStart={handleDragStart} />}
        {activePanel === 'theme'    && <ThemePanel />}
        {activePanel === 'display'  && <DisplayPanel />}
        {activePanel === 'code'     && <CodePanel />}
      </div>

      {/* ── Canvas ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f4f4f5]">

        {/* Canvas toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#e4e4e7] bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#18181b]">Untitled Popup</span>
            <span className="text-[10px] font-medium text-[#a1a1aa] bg-[#f4f4f5] border border-[#e4e4e7] px-2 py-0.5 rounded-full">Draft</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Device toggle */}
            <div className="flex items-center bg-[#f4f4f5] rounded-lg p-0.5">
              <button
                onClick={() => setDevice('desktop')}
                className={cn('w-7 h-7 rounded-md flex items-center justify-center transition-colors', device === 'desktop' ? 'bg-white shadow-sm text-[#18181b]' : 'text-[#a1a1aa] hover:text-[#71717a]')}
              >
                <Monitor size={13} />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={cn('w-7 h-7 rounded-md flex items-center justify-center transition-colors', device === 'mobile' ? 'bg-white shadow-sm text-[#18181b]' : 'text-[#a1a1aa] hover:text-[#71717a]')}
              >
                <Smartphone size={13} />
              </button>
            </div>

            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-[#e4e4e7] text-[#3f3f46] hover:border-[#a1a1aa] transition-colors">
              <Settings size={12} />
              Settings
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-[#18181b] text-white hover:bg-[#27272a] transition-colors">
              <Zap size={12} />
              Publish
            </button>
          </div>
        </div>

        {/* Canvas area */}
        <div
          className="flex-1 overflow-auto flex items-center justify-center p-8"
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          {/* Popup preview */}
          <div className={cn(
            'relative transition-all duration-300',
            device === 'desktop' ? 'w-[480px]' : 'w-[340px]'
          )}>
            {/* Simulated overlay hint */}
            <div className="absolute -inset-12 rounded-3xl bg-black/10 pointer-events-none" />

            {/* Popup card */}
            <div className={cn(
              'relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-all',
              isDragOver && 'ring-2 ring-[#7c3aed] ring-offset-2'
            )}>
              {/* Drop hint */}
              {isDragOver && (
                <div className="absolute inset-0 bg-[#7c3aed]/5 rounded-2xl flex items-center justify-center z-20 pointer-events-none">
                  <div className="flex items-center gap-2 bg-[#7c3aed] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                    <Plus size={12} />
                    Drop to add
                  </div>
                </div>
              )}

              <div className={cn('p-6 flex flex-col gap-1', canvasItems.length === 0 && 'min-h-[200px] items-center justify-center')}>
                {canvasItems.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 text-center">
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
                      onRemove={() => removeItem(item.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
