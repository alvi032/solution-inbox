'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Filter, X } from 'lucide-react';

const FILTER_SECTIONS = [
  {
    label: 'Status',
    key: 'status',
    options: ['Open', 'Closed'],
  },
  {
    label: 'Priority',
    key: 'priority',
    options: ['High', 'Low'],
  },
  {
    label: 'Type',
    key: 'type',
    options: ['Order', 'Refund', 'Shipping Issue', 'General', 'Order Cancellation'],
  },
  {
    label: 'Assignee',
    key: 'assignee',
    options: ['Unassigned', 'Assigned to me', 'Sarah Jones', 'Alex M.', 'Lisa R.', 'Tom K.'],
  },
];

export type FilterState = Record<string, string[]>;

interface FilterPanelProps {
  value: FilterState;
  onChange: (filters: FilterState) => void;
}

function FilterPanelContent({ value, onChange }: FilterPanelProps) {
  const toggle = (sectionKey: string, option: string) => {
    const current = value[sectionKey] ?? [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    onChange({ ...value, [sectionKey]: next });
  };

  const totalActive = Object.values(value).flat().length;

  const clearAll = () => {
    onChange(Object.fromEntries(FILTER_SECTIONS.map((s) => [s.key, []])));
  };

  return (
    <div className="w-[300px] bg-white border border-[#e4e4e7] rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#f4f4f5]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#18181b]">Filters</span>
          {totalActive > 0 && (
            <span className="text-[10px] font-bold bg-[#18181b] text-white rounded-full px-1.5 py-0.5 leading-none">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-[#71717a] hover:text-[#18181b] transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sections */}
      <div className="px-4 py-3 space-y-4 max-h-[480px] overflow-y-auto">
        {FILTER_SECTIONS.map((section) => {
          const selected = value[section.key] ?? [];
          return (
            <div key={section.key}>
              <p className="text-xs font-semibold text-[#18181b] mb-2">{section.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {section.options.map((option) => {
                  const active = selected.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggle(section.key, option)}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-xs border transition-colors',
                        active
                          ? 'bg-[#18181b] text-white border-[#18181b]'
                          : 'bg-white text-[#71717a] border-[#e4e4e7] hover:border-[#a1a1aa] hover:text-[#18181b]'
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface FilterButtonProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function FilterButton({ filters, onChange }: FilterButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalActive = Object.values(filters).flat().length;

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'w-8 h-8 flex items-center justify-center rounded-md border transition-colors relative',
          open || totalActive > 0
            ? 'border-[#18181b] bg-[#18181b] text-white'
            : 'border-[#e5e7eb] bg-white text-[#71717a] hover:text-[#18181b]'
        )}
      >
        <Filter size={14} />
        {totalActive > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#18181b] border-2 border-white text-white text-[8px] font-bold flex items-center justify-center">
            {totalActive}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <FilterPanelContent value={filters} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

export { FILTER_SECTIONS };
