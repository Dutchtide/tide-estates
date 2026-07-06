'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * The user's item-NFT inventory. Each entry is one owned token of a catalog
 * item edition. Phase 4 feeds this from opened containers; Phase 6 reads it
 * from the connected wallet. Until then it ships with a demo collection.
 *
 * Whether a token is currently *placed* is derived from the scene graph
 * (nodes carrying `metadata.tide.nftTokenId`), not stored here — the scene
 * is the single source of truth and resets with it.
 */
export interface OwnedItem {
  /** Mock chain token id — unique per owned copy. */
  nftTokenId: string
  /** Catalog asset id (joins tide-items.ts / CATALOG_ITEMS). */
  itemId: string
}

interface InventoryState {
  owned: OwnedItem[]
  /**
   * Token armed for placement: set when the user picks an item in the
   * inventory panel. Stays armed until another pick (or explicit disarm) so
   * the NFT stamper can survive Pascal's preview→commit node lifecycle,
   * where the first created node is deleted and recreated on commit.
   */
  pendingTokenId: string | null
  armPlacement: (nftTokenId: string) => void
  disarmPlacement: () => void
}

/** Demo inventory — a few copies of commons, one of each rarer piece. */
const DEMO_INVENTORY: OwnedItem[] = [
  { nftTokenId: 'TIDE-0001', itemId: 'sofa' },
  { nftTokenId: 'TIDE-0002', itemId: 'lounge-chair' },
  { nftTokenId: 'TIDE-0003', itemId: 'coffee-table' },
  { nftTokenId: 'TIDE-0004', itemId: 'coffee-table' },
  { nftTokenId: 'TIDE-0005', itemId: 'bookshelf' },
  { nftTokenId: 'TIDE-0006', itemId: 'double-bed' },
  { nftTokenId: 'TIDE-0007', itemId: 'dining-table' },
  { nftTokenId: 'TIDE-0008', itemId: 'dining-chair' },
  { nftTokenId: 'TIDE-0009', itemId: 'dining-chair' },
  { nftTokenId: 'TIDE-0010', itemId: 'dining-chair' },
  { nftTokenId: 'TIDE-0011', itemId: 'pool-table' },
  { nftTokenId: 'TIDE-0012', itemId: 'guitar' },
  { nftTokenId: 'TIDE-0013', itemId: 'floor-lamp' },
  { nftTokenId: 'TIDE-0014', itemId: 'table-lamp' },
  { nftTokenId: 'TIDE-0015', itemId: 'ceiling-lamp' },
  { nftTokenId: 'TIDE-0016', itemId: 'indoor-plant' },
  { nftTokenId: 'TIDE-0017', itemId: 'cactus' },
  { nftTokenId: 'TIDE-0018', itemId: 'easel' },
  { nftTokenId: 'TIDE-0019', itemId: 'books' },
]

export const useInventory = create<InventoryState>()(
  persist(
    (set) => ({
      owned: DEMO_INVENTORY,
      pendingTokenId: null,
      armPlacement: (nftTokenId) => set({ pendingTokenId: nftTokenId }),
      disarmPlacement: () => set({ pendingTokenId: null }),
    }),
    { name: 'tide-inventory', partialize: (state) => ({ owned: state.owned }) },
  ),
)
