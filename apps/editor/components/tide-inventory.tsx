'use client'

import { useScene } from '@pascal-app/core'
import { useEditor } from '@pascal-app/editor'
import { Search } from 'lucide-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import {
  getCatalogAsset,
  getTideItem,
  RARITY_COLORS,
  RARITY_LABELS,
  type TideCategory,
} from '@/lib/tide-items'
import { useInventory } from '@/store/use-inventory'

/**
 * Tide Estates inventory panel (the prototype's Create Mode sidebar): the
 * item NFTs the user owns, grouped by category with rarity badges. Picking
 * an item arms its token and hands off to Pascal's item placement tool.
 */

const CATEGORY_TABS: { id: TideCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'atmosphere', label: 'Atmosphere' },
]

export function TideInventoryPanel() {
  const owned = useInventory((state) => state.owned)
  const armPlacement = useInventory((state) => state.armPlacement)
  const setSelectedItem = useEditor((state) => state.setSelectedItem)
  const setMode = useEditor((state) => state.setMode)
  const setTool = useEditor((state) => state.setTool)
  // Placed = a live scene node carries the token (see TideNftStamper).
  const sceneNodes = useScene((state) => state.nodes)

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<TideCategory | 'all'>('all')

  const placedTokens = useMemo(() => {
    const tokens = new Set<string>()
    for (const node of Object.values(sceneNodes) as Array<{
      metadata?: { tide?: { nftTokenId?: string } }
    }>) {
      const token = node?.metadata?.tide?.nftTokenId
      if (token) tokens.add(token)
    }
    return tokens
  }, [sceneNodes])

  const entries = useMemo(() => {
    return owned
      .map((ownedItem) => {
        const tide = getTideItem(ownedItem.itemId)
        const asset = getCatalogAsset(ownedItem.itemId)
        return tide && asset
          ? { ownedItem, tide, asset, placed: placedTokens.has(ownedItem.nftTokenId) }
          : null
      })
      .filter((entry) => entry !== null)
      .filter(({ tide }) => category === 'all' || tide.category === category)
      .filter(({ asset }) => asset.name?.toLowerCase().includes(query.toLowerCase()) ?? true)
  }, [owned, category, query, placedTokens])

  const startPlacement = (entry: (typeof entries)[number]) => {
    armPlacement(entry.ownedItem.nftTokenId)
    setSelectedItem(entry.asset)
    setTool('item')
    setMode('build')
  }

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <div>
        <h2 className="font-display text-[15px] italic">My Items</h2>
        <p className="text-[11px] text-sub">
          {owned.length - placedTokens.size} available · {placedTokens.size} placed
        </p>
      </div>

      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-2.5 h-3.5 w-3.5 text-dim" />
        <input
          className="w-full rounded-md border border-border bg-surf py-1.5 pr-2 pl-8 text-[12px] outline-none placeholder:text-dim focus:border-input"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search items…"
          type="text"
          value={query}
        />
      </div>

      <div className="flex flex-wrap gap-1">
        {CATEGORY_TABS.map((tab) => (
          <button
            className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
              category === tab.id
                ? 'border-gold/60 bg-gold/10 text-gold'
                : 'border-border text-sub hover:text-foreground'
            }`}
            key={tab.id}
            onClick={() => setCategory(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid flex-1 auto-rows-min grid-cols-2 gap-2 overflow-y-auto pb-4">
        {entries.length === 0 && (
          <p className="col-span-2 pt-6 text-center text-[12px] text-sub">
            No items here yet — unlock packs to grow your collection.
          </p>
        )}
        {entries.map((entry) => (
          <button
            className={`group rounded-lg border bg-surf text-left transition-all hover:-translate-y-0.5 ${
              entry.placed ? 'opacity-45' : 'hover:border-input'
            } border-border`}
            disabled={entry.placed}
            key={entry.ownedItem.nftTokenId}
            onClick={() => startPlacement(entry)}
            title={entry.placed ? 'Already placed' : `Place ${entry.asset.name}`}
            type="button"
          >
            <div className="relative flex h-20 items-center justify-center overflow-hidden rounded-t-lg bg-surf-2">
              {entry.asset.thumbnail && (
                <Image
                  alt={entry.asset.name ?? entry.tide.itemId}
                  className="h-full w-full object-contain p-1.5"
                  height={80}
                  src={entry.asset.thumbnail}
                  unoptimized
                  width={110}
                />
              )}
              {entry.placed && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 font-semibold text-[10px] text-foreground uppercase tracking-wider">
                  Placed
                </span>
              )}
            </div>
            <div className="px-2 py-1.5">
              <div className="truncate font-medium text-[11.5px]">{entry.asset.name}</div>
              <div className="mt-0.5 flex items-center justify-between">
                <span
                  className="font-semibold text-[10px] uppercase tracking-wide"
                  style={{ color: RARITY_COLORS[entry.tide.rarity] }}
                >
                  {RARITY_LABELS[entry.tide.rarity]}
                </span>
                <span className="text-[10px] text-dim">{entry.ownedItem.nftTokenId}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
