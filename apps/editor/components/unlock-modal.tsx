'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import { useApartment } from '@/store/use-apartment'

/**
 * Burn-warning modal shown before opening a sealed apartment NFT, ported from
 * the tide-estates_2.html prototype (lock swaps to a key on hover, shine
 * sweep across the button). Phase 6 wires the real burn transaction.
 */
export function UnlockModal({ onClose }: { onClose: () => void }) {
  const unlock = useApartment((state) => state.unlock)
  const [hovering, setHovering] = useState(false)

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/65 backdrop-blur-sm">
      <div className="relative w-[500px] max-w-[94vw] rounded-[14px] border border-white/[.12] bg-[#141e2b] px-8 py-7 text-center">
        <button
          aria-label="Close"
          className="absolute top-3 left-3.5 text-sub transition-colors hover:text-foreground"
          onClick={onClose}
          type="button"
        >
          <X className="h-[18px] w-[18px]" />
        </button>

        <h2 className="mb-3 font-bold text-[16px] uppercase tracking-[2.5px]">Unlock Apartment</h2>
        <p className="mb-3 text-[13px] text-sub leading-[1.7]">
          By unlocking your apartment you gain access to all the features of this NFT including all
          the furniture item NFTs. You can only change and modify your apartment once you unlock.
        </p>
        <p className="mb-5 text-[13px] text-destructive">
          ⚠️ Once you unlock your NFT it will be burned and not exist in its current form ⚠️
        </p>

        <button
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-3xl border border-input bg-surf-2 px-7 py-2.5 font-semibold text-[14px] text-foreground transition-all hover:border-gold hover:text-gold"
          onClick={unlock}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          type="button"
        >
          <span aria-hidden>{hovering ? '🗝️' : '🔒'}</span>
          Unlock
          <span className="-translate-x-full absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-400 group-hover:translate-x-full" />
        </button>
      </div>
    </div>
  )
}
