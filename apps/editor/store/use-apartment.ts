'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Tide Estates apartment state — whether the current apartment NFT is still
 * sealed (locked diorama view) or has been burned open (editable).
 *
 * Phase 6 replaces `unlock()` with the real burn transaction; until then it
 * only flips local state.
 */
interface ApartmentState {
  status: 'locked' | 'unlocked'
  name: string
  unlock: () => void
  relock: () => void
}

export const useApartment = create<ApartmentState>()(
  persist(
    (set) => ({
      status: 'locked',
      name: 'Oceanview #042',
      unlock: () => set({ status: 'unlocked' }),
      relock: () => set({ status: 'locked' }),
    }),
    { name: 'tide-apartment' },
  ),
)
