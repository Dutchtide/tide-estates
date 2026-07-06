'use client'

import { Heart, Search } from 'lucide-react'
import Link from 'next/link'

/**
 * Tide Estates top navigation, ported from the tide-estates_2.html prototype.
 * Marketplace/Minting and the wallet button are visual placeholders until
 * their phases land (Phase 5 marketplace, Phase 6 wallet).
 */
export function TideNav() {
  return (
    <nav className="z-50 flex h-[60px] shrink-0 items-center gap-[18px] border-border border-b bg-sidebar px-6">
      <Link className="flex items-baseline" href="/">
        <span className="font-display text-[21px] italic">
          T<span className="text-gold">~</span>de
        </span>
        <span className="ml-1.5 font-semibold text-[21px]">Estates</span>
      </Link>

      <div className="relative max-w-[440px] flex-1">
        <Search className="-translate-y-1/2 absolute top-1/2 left-[11px] h-4 w-4 text-dim" />
        <input
          className="w-full rounded-[7px] border border-border bg-surf py-2 pr-3 pl-[34px] text-[13px] text-foreground shadow-[0_2px_8px_rgba(0,0,0,.3)] outline-none placeholder:text-dim focus:border-input"
          placeholder="Search items, apartments, creators…"
          type="text"
        />
      </div>

      <div className="ml-auto flex items-center gap-[22px]">
        <button
          className="font-medium text-[13.5px] text-sub transition-colors hover:text-foreground"
          type="button"
        >
          Marketplace
        </button>
        <Link className="font-medium text-[13.5px] text-gold" href="/">
          Home
        </Link>
        <button
          className="font-medium text-[13.5px] text-sub transition-colors hover:text-foreground"
          type="button"
        >
          Minting
        </button>
        <button
          aria-label="Favorites"
          className="text-sub transition-transform hover:scale-110 hover:text-destructive"
          type="button"
        >
          <Heart className="h-[17px] w-[17px]" />
        </button>
        <button
          className="rounded-full border border-border bg-surf px-4 py-[7px] font-semibold text-[13px] text-foreground shadow-[0_2px_8px_rgba(0,0,0,.3)] transition-colors hover:border-input"
          type="button"
        >
          Connect Wallet
        </button>
      </div>
    </nav>
  )
}
