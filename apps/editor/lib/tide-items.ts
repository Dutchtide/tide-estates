import type { AssetInput } from '@pascal-app/core'
import { CATALOG_ITEMS } from '@pascal-app/editor'

/**
 * Tide Estates item metadata layered over Pascal's built-in GLB catalog.
 * Each entry is an item *NFT edition*: the catalog asset supplies geometry,
 * this table supplies the game/NFT identity (rarity, price, category).
 *
 * Phase 6 replaces the mock token ids with real chain data.
 */

export type TideRarity = 'common' | 'rare' | 'epic' | 'legendary'

/** Tide game categories (handover §7) mapped onto curated catalog items. */
export type TideCategory = 'furniture' | 'lighting' | 'atmosphere' | 'surfaces'

export interface TideItem {
  /** Catalog asset id — joins to CATALOG_ITEMS for geometry + thumbnail. */
  itemId: string
  rarity: TideRarity
  category: TideCategory
  /** Listing price in ETH shown in marketplace/inventory UI. */
  priceEth: number
}

export const RARITY_COLORS: Record<TideRarity, string> = {
  common: '#8899aa',
  rare: '#4a9eff',
  epic: '#9b59f6',
  legendary: '#f5c842',
}

export const RARITY_LABELS: Record<TideRarity, string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
}

export const TIDE_ITEMS: TideItem[] = [
  { itemId: 'sofa', rarity: 'rare', category: 'furniture', priceEth: 0.08 },
  { itemId: 'lounge-chair', rarity: 'epic', category: 'furniture', priceEth: 0.15 },
  { itemId: 'coffee-table', rarity: 'common', category: 'furniture', priceEth: 0.02 },
  { itemId: 'bookshelf', rarity: 'rare', category: 'furniture', priceEth: 0.06 },
  { itemId: 'double-bed', rarity: 'epic', category: 'furniture', priceEth: 0.12 },
  { itemId: 'dining-table', rarity: 'common', category: 'furniture', priceEth: 0.03 },
  { itemId: 'dining-chair', rarity: 'common', category: 'furniture', priceEth: 0.01 },
  { itemId: 'dresser', rarity: 'rare', category: 'furniture', priceEth: 0.05 },
  { itemId: 'pool-table', rarity: 'legendary', category: 'furniture', priceEth: 0.4 },
  { itemId: 'guitar', rarity: 'legendary', category: 'furniture', priceEth: 0.35 },
  { itemId: 'floor-lamp', rarity: 'common', category: 'lighting', priceEth: 0.02 },
  { itemId: 'table-lamp', rarity: 'common', category: 'lighting', priceEth: 0.015 },
  { itemId: 'ceiling-lamp', rarity: 'rare', category: 'lighting', priceEth: 0.04 },
  { itemId: 'indoor-plant', rarity: 'common', category: 'atmosphere', priceEth: 0.01 },
  { itemId: 'small-indoor-plant', rarity: 'common', category: 'atmosphere', priceEth: 0.008 },
  { itemId: 'cactus', rarity: 'rare', category: 'atmosphere', priceEth: 0.03 },
  { itemId: 'easel', rarity: 'epic', category: 'atmosphere', priceEth: 0.1 },
  { itemId: 'books', rarity: 'common', category: 'atmosphere', priceEth: 0.005 },
]

const catalogById = new Map(CATALOG_ITEMS.map((asset) => [asset.id, asset]))
const tideByItemId = new Map(TIDE_ITEMS.map((item) => [item.itemId, item]))

export function getTideItem(itemId: string): TideItem | undefined {
  return tideByItemId.get(itemId)
}

export function getCatalogAsset(itemId: string): AssetInput | undefined {
  return catalogById.get(itemId)
}
