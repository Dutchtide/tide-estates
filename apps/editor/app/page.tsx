'use client'

import { Editor, type SceneGraph } from '@pascal-app/editor'
import { Hammer, Layers, Package, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BuildTab } from '@/components/build-tab'
import { LockedApartment } from '@/components/locked-apartment'
import { TideInventoryPanel } from '@/components/tide-inventory'
import { TideNav } from '@/components/tide-nav'
import { TideNftStamper } from '@/components/tide-nft-stamper'
import {
  CommunityViewerToolbarLeft,
  CommunityViewerToolbarRight,
} from '@/components/viewer-toolbar'
import { useApartment } from '@/store/use-apartment'

// Tide Estates: the Items tab shows the user's NFT inventory instead of the
// raw catalog — placement is gated on ownership.
function EditorItemsPanel() {
  return <TideInventoryPanel />
}

const SIDEBAR_TABS = [
  {
    id: 'site',
    label: 'Scene',
    component: () => null,
    mobileDefaultSnap: 0.5,
    mobileIcon: <Layers className="h-5 w-5" />,
    icon: (
      <Image
        alt=""
        className="h-8 w-8 object-contain"
        height={32}
        src="/icons/scene.webp"
        width={32}
      />
    ),
  },
  {
    id: 'build',
    label: 'Build',
    component: BuildTab,
    mobileDefaultSnap: 0.5,
    mobileIcon: <Hammer className="h-5 w-5" />,
    icon: (
      <Image
        alt=""
        className="h-8 w-8 object-contain"
        height={32}
        src="/icons/build.webp"
        width={32}
      />
    ),
  },
  {
    id: 'items',
    label: 'Items',
    component: EditorItemsPanel,
    mobileDefaultSnap: 0.5,
    mobileIcon: <Package className="h-5 w-5" />,
    icon: (
      <Image
        alt=""
        className="h-8 w-8 object-contain"
        height={32}
        src="/icons/couch.webp"
        width={32}
      />
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    component: () => null,
    mobileDefaultSnap: 0.5,
    mobileIcon: <Settings className="h-5 w-5" />,
    icon: (
      <Image
        alt=""
        className="h-8 w-8 object-contain"
        height={32}
        src="/icons/settings.webp"
        width={32}
      />
    ),
  },
]

const PROJECT_ID = 'local-editor'

// The unlocked apartment is the same scene the locked diorama shows —
// Phase 4 swaps this for the apartment NFT's own graph.
async function loadApartmentScene(): Promise<SceneGraph> {
  const response = await fetch('/demos/demo_1.json')
  return (await response.json()) as SceneGraph
}

export default function Home() {
  const status = useApartment((state) => state.status)
  const relock = useApartment((state) => state.relock)
  // Zustand's persist rehydrates after mount; render nothing model-specific
  // until then so the server and client trees match.
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  if (!hydrated) {
    return (
      <div className="flex h-screen w-screen flex-col">
        <TideNav />
        <div className="flex-1" />
      </div>
    )
  }

  if (status === 'locked') {
    return (
      <div className="flex h-screen w-screen flex-col">
        <TideNav />
        <LockedApartment />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen flex-col">
      <TideNav />
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute top-3 left-1/2 z-40 -translate-x-1/2">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-border/60 bg-background/90 px-4 py-1.5 text-xs shadow-sm backdrop-blur">
            <span className="text-muted-foreground">Local editor — scenes are not saved.</span>
            <Link className="font-medium text-foreground hover:underline" href="/scenes">
              Open recent scenes
            </Link>
            <span aria-hidden className="text-muted-foreground">
              ·
            </span>
            <button
              className="font-medium text-foreground hover:underline"
              onClick={relock}
              type="button"
            >
              Re-seal (demo)
            </button>
          </div>
        </div>
        <TideNftStamper />
        <Editor
          layoutVersion="v2"
          onLoad={loadApartmentScene}
          projectId={PROJECT_ID}
          sidebarTabs={SIDEBAR_TABS}
          viewerToolbarLeft={<CommunityViewerToolbarLeft />}
          viewerToolbarRight={<CommunityViewerToolbarRight />}
        />
      </div>
    </div>
  )
}
