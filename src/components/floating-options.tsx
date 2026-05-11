'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, RotateCcw, Sparkles, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FloatingOptions() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleReset = () => {
    localStorage.removeItem('evoSearchInstalled');
    localStorage.removeItem('quizzesInstalled');
    window.dispatchEvent(new Event('evo-search-reset'));
    setOpen(false);
  };

  const handleOnboarding = () => {
    setOpen(false);
    router.push('/onboarding');
  };

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-52 bg-white border border-[#e4e4e7] rounded-xl shadow-lg overflow-hidden">
          <button
            onClick={handleOnboarding}
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#18181b] hover:bg-[#f4f4f5] transition-colors text-left"
          >
            <Sparkles size={14} className="text-[#71717a] shrink-0" />
            Onboarding
          </button>
          <div className="border-t border-[#f4f4f5]" />
          <button
            onClick={() => { setOpen(false); router.push('/onboarding/alt'); }}
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#18181b] hover:bg-[#f4f4f5] transition-colors text-left"
          >
            <LayoutDashboard size={14} className="text-[#71717a] shrink-0" />
            Alternative Onboarding
          </button>
          <div className="border-t border-[#f4f4f5]" />
          <button
            onClick={handleReset}
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-[#71717a] hover:bg-[#f4f4f5] transition-colors text-left"
          >
            <RotateCcw size={14} className="shrink-0" />
            Reset
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors',
          open ? 'bg-[#18181b] text-white' : 'bg-white border border-[#e4e4e7] text-[#71717a] hover:text-[#18181b]'
        )}
      >
        <MoreVertical size={16} />
      </button>
    </div>
  );
}
