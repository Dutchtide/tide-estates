'use client'

import { applySceneGraphToEditor, type SceneGraph } from '@pascal-app/editor'
import { Viewer } from '@pascal-app/viewer'
import { CameraControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Lock, RotateCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useApartment } from '@/store/use-apartment'
import { UnlockModal } from './unlock-modal'

/**
 * Sealed-apartment diorama: a read-only Viewer of the apartment scene behind
 * a glass overlay. Left-drag orbits, right-drag pans, scroll zooms (drei
 * CameraControls defaults). No editor tools mount in this state.
 */

/** Injected inside the R3F canvas — orbit controls plus slow auto-rotation. */
function DioramaCameraControls({ autoRotate }: { autoRotate: boolean }) {
  const controls = useRef<CameraControls>(null)
  // The viewer swaps in its own makeDefault camera shortly after mount,
  // which resets the controls' pose — keep re-applying the diorama framing
  // for the first few frames so it survives the swap.
  const settleFrames = useRef(30)

  useFrame((_, delta) => {
    const cameraControls = controls.current
    if (!cameraControls) return
    if (settleFrames.current > 0) {
      settleFrames.current -= 1
      // Raised orbit fitting the demo building (footprint roughly
      // x -4..23, z -7..21).
      cameraControls.setLookAt(34, 20, 32, 9, 1, 7, false)
      return
    }
    if (autoRotate) {
      cameraControls.rotate(delta * 0.25, 0, false)
    }
  })

  return <CameraControls makeDefault maxDistance={120} minDistance={6} ref={controls} />
}

export function LockedApartment() {
  const name = useApartment((state) => state.name)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showUnlock, setShowUnlock] = useState(false)
  const [sceneLoaded, setSceneLoaded] = useState(false)

  // Load the demo apartment into the scene store. Phase 4 swaps this for the
  // apartment NFT's own scene graph.
  useEffect(() => {
    let cancelled = false
    fetch('/demos/demo_1.json')
      .then((response) => response.json())
      .then((graph: SceneGraph) => {
        if (cancelled) return
        applySceneGraphToEditor(graph)
        setSceneLoaded(true)
      })
      .catch(() => {
        // Even without the demo scene, show the (empty) diorama rather than
        // a dead screen.
        if (!cancelled) setSceneLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="relative flex-1 overflow-hidden">
      {sceneLoaded && (
        <Viewer
          // 'solid' ink-edge shading renders identically with and without
          // WebGPU; the viewer context's 'rendered' default needs lighting
          // tuning for the night theme before it can be the diorama look.
          defaultRender={{ shading: 'solid' }}
          renderContext="viewer"
          selectionManager="custom"
        >
          <DioramaCameraControls autoRotate={autoRotate} />
        </Viewer>
      )}

      {/* Glass diorama frame */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(12,24,36,0.55)_100%)]" />
      <div className="pointer-events-none absolute inset-4 rounded-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />

      {/* Auto-rotate toggle */}
      <button
        aria-pressed={autoRotate}
        className={`absolute top-6 left-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg transition-colors ${
          autoRotate
            ? 'border-gold/60 bg-surf text-gold'
            : 'border-border bg-surf text-sub hover:text-foreground'
        }`}
        onClick={() => setAutoRotate((on) => !on)}
        title={autoRotate ? 'Stop rotation' : 'Auto-rotate'}
        type="button"
      >
        <RotateCw className="h-4 w-4" />
      </button>

      {/* Sealed name plate + unlock CTA */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2.5 rounded-full border border-border bg-surf/90 px-5 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,.4)] backdrop-blur">
          <Lock className="h-3.5 w-3.5 text-gold" />
          <span className="font-display text-[17px] italic">{name}</span>
          <span className="text-[11px] text-sub uppercase tracking-[1.5px]">Sealed</span>
        </div>
        <button
          className="pointer-events-auto rounded-full bg-gold px-7 py-2.5 font-semibold text-[#0c1420] text-[14px] shadow-[0_4px_20px_rgba(245,200,66,.35)] transition-transform hover:scale-105"
          onClick={() => setShowUnlock(true)}
          type="button"
        >
          Unlock Apartment
        </button>
      </div>

      {showUnlock && <UnlockModal onClose={() => setShowUnlock(false)} />}
    </div>
  )
}
