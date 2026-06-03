'use client';

import Link from 'next/link';
import { Heart, Search, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import SearchModal from './SearchModal';
import type { SearchConfig, ThemeConfig } from './page';

export default function StorefrontNav({ config, theme }: { config: SearchConfig; theme: ThemeConfig }) {
  const [cartCount] = useState(3);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-[#e5e7eb] bg-white flex items-center px-8 shrink-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-auto select-none">
          <div className="w-7 h-7 rounded-md bg-[#18181b] flex items-center justify-center">
            <span className="text-white text-xs font-bold tracking-tight">S</span>
          </div>
          <span className="text-[15px] font-semibold text-[#18181b] tracking-tight">StoreDemo</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-7 mr-10">
          {['Home', 'Shop', 'Collections', 'Sale'].map((label) => (
            <a
              key={label}
              href="#"
              className="text-[13.5px] text-[#52525b] hover:text-[#18181b] transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-md text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors"
          >
            <Search size={18} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-md text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors">
            <Heart size={18} />
          </button>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-md text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-[14px] h-[14px] rounded-full bg-[#18181b] text-white text-[9px] font-semibold flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} config={config} theme={theme} />}
    </>
  );
}
