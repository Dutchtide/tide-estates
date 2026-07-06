'use client'

import { useScene } from '@pascal-app/core'
import { useEffect } from 'react'
import { getTideItem } from '@/lib/tide-items'
import { useInventory } from '@/store/use-inventory'

type NodeWithTide = {
  id: string
  type?: string
  asset?: { id?: string }
  metadata?: { tide?: { nftTokenId: string } } & Record<string, unknown>
}

/**
 * Binds placed item nodes to the owned NFT that placed them, by reconciling
 * on every scene change: while a token is armed and *no* live node carries
 * it, the first unstamped item node of the matching catalog item gets
 * `metadata.tide = { nftTokenId, rarity }`.
 *
 * Reconciliation (rather than stamp-on-create) survives Pascal's placement
 * lifecycle, where a preview node is created, deleted, and recreated on
 * commit — whichever node ends up live gets the stamp. The token stays
 * armed after stamping; if its node is deleted the next matching node is
 * re-stamped, and repeat placements beyond the owned copy stay unstamped.
 *
 * Headless — mount once alongside the editor.
 */
export function TideNftStamper() {
  useEffect(() => {
    const reconcile = () => {
      const pendingTokenId = useInventory.getState().pendingTokenId
      if (!pendingTokenId) return
      const pending = useInventory
        .getState()
        .owned.find((item) => item.nftTokenId === pendingTokenId)
      if (!pending) return

      const nodes = useScene.getState().nodes as Record<string, NodeWithTide>
      let candidate: NodeWithTide | null = null
      for (const node of Object.values(nodes)) {
        if (node?.type !== 'item') continue
        // Token already lives on a node — nothing to reconcile.
        if (node.metadata?.tide?.nftTokenId === pendingTokenId) return
        if (!candidate && !node.metadata?.tide && node.asset?.id === pending.itemId) {
          candidate = node
        }
      }
      if (!candidate) return

      const tide = getTideItem(pending.itemId)
      useScene.getState().updateNode(
        candidate.id as never,
        {
          metadata: {
            ...(candidate.metadata ?? {}),
            tide: { nftTokenId: pending.nftTokenId, rarity: tide?.rarity ?? 'common' },
          },
        } as never,
      )
    }

    reconcile()
    const unsubscribeScene = useScene.subscribe(reconcile)
    const unsubscribeInventory = useInventory.subscribe(reconcile)
    return () => {
      unsubscribeScene()
      unsubscribeInventory()
    }
  }, [])

  return null
}
