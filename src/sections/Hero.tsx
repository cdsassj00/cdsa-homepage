import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MarchingCubes, MarchingCube } from '@react-three/drei'
import { MathUtils } from 'three'
import type { Group, Mesh } from 'three'
import { hero } from '../data/content'
import { useInquiry } from './InquiryModal'

/**
 * Hero fluid 3D background — metaball droplets in the warm-clay palette.
 *
 * At the top of the page the droplets sit fused into one soft blob on the
 * right (the familiar 몽글몽글 silhouette). As the reader scrolls, the blob
 * shrinks and splits into separate droplets that drift apart, gain depth
 * (per-droplet z parallax + camera dolly), and increasingly chase the
 * mouse like a trailing fluid. The canvas is a fixed viewport layer at
 * z-index -1 with multiply blend, so text/layout above is never touched.
 * prefers-reduced-motion falls back to a calm, hero-only fused blob.
 */

type ProgressRef = { current: number }

function useScrollProgress(): ProgressRef {
  const ref = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      ref.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return ref
}

// Per-droplet character: split direction, wobble speed/phase, follow lag.
// dir is in marching-cubes local space (kept within ±0.85 to avoid clipping).
const DROPLETS = [
  { dir: [0.55, 0.12, -0.2], speed: 0.9, phase: 0.0, lag: 0.055 },
  { dir: [-0.62, 0.42, 0.35], speed: 1.3, phase: 1.1, lag: 0.04 },
  { dir: [0.28, -0.6, 0.3], speed: 1.1, phase: 2.3, lag: 0.07 },
  { dir: [-0.4, -0.38, -0.45], speed: 0.8, phase: 3.4, lag: 0.03 },
  { dir: [0.5, 0.55, 0.25], speed: 1.5, phase: 4.2, lag: 0.05 },
  { dir: [-0.72, -0.1, 0.15], speed: 1.0, phase: 5.0, lag: 0.06 },
  { dir: [0.08, 0.68, 0.4], speed: 1.2, phase: 0.7, lag: 0.038 },
  { dir: [-0.2, 0.16, -0.6], speed: 0.7, phase: 2.9, lag: 0.075 },
  { dir: [0.6, -0.3, 0.5], speed: 1.4, phase: 4.8, lag: 0.048 },
]

const clamp = (v: number, lim: number) => Math.max(-lim, Math.min(lim, v))

// The canvas wrapper is pointer-events:none, so R3F never receives pointer
// events itself — track the mouse globally instead (normalized -1..1).
function useMouse(): { current: { x: number; y: number } } {
  const ref = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1
      ref.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return ref
}

function FluidDroplets({
  progress,
  count,
  resolution,
  interactive,
}: {
  progress?: ProgressRef
  count: number
  resolution: number
  interactive: boolean
}) {
  const cubeRefs = useRef<(Group | null)[]>([])
  const smoothP = useRef(0)
  const center = useRef({ x: 0.35, y: 0.05 })
  const mouse = useMouse()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    smoothP.current = MathUtils.lerp(smoothP.current, progress?.current ?? 0, 0.06)
    const p = smoothP.current
    const eased = p * p * (3 - 2 * p) // smoothstep — gentle start, gentle end

    // fused blob (0.1) → scattered droplets (0.62)
    const spread = MathUtils.lerp(0.1, 0.62, eased)
    // mouse pull ramps in once the hero is left behind
    const follow = interactive ? Math.min(1, p * 2.2) * 0.8 : 0

    const tx = MathUtils.lerp(0.35, mouse.current.x * 0.7, follow)
    const ty = MathUtils.lerp(0.05, mouse.current.y * 0.55, follow)
    center.current.x = MathUtils.lerp(center.current.x, tx, 0.04)
    center.current.y = MathUtils.lerp(center.current.y, ty, 0.04)

    const wob = 0.05 + spread * 0.14
    for (let i = 0; i < count; i++) {
      const d = DROPLETS[i]
      const cube = cubeRefs.current[i]
      if (!cube) continue
      const gx = center.current.x + d.dir[0] * spread + Math.sin(t * d.speed + d.phase) * wob
      const gy =
        center.current.y + d.dir[1] * spread * 0.85 + Math.cos(t * d.speed * 0.9 + d.phase) * wob
      const gz = d.dir[2] * spread * 0.9 + Math.sin(t * d.speed * 0.6 + d.phase * 2) * 0.08
      // per-droplet lag → trailing, fluid-like chase
      const k = d.lag + eased * 0.05
      cube.position.x = clamp(MathUtils.lerp(cube.position.x, gx, k), 0.85)
      cube.position.y = clamp(MathUtils.lerp(cube.position.y, gy, k), 0.8)
      cube.position.z = clamp(MathUtils.lerp(cube.position.z, gz, k), 0.8)
    }
  })

  return (
    <MarchingCubes
      resolution={resolution}
      maxPolyCount={40000}
      scale={[4.6, 2.9, 2.2]}
    >
      <meshStandardMaterial color="#C17A3B" roughness={0.42} metalness={0.14} />
      {DROPLETS.slice(0, count).map((d, i) => (
        <MarchingCube
          key={i}
          ref={(el) => {
            cubeRefs.current[i] = el
          }}
          strength={0.42}
          subtract={11}
          position={[0.35 + d.dir[0] * 0.1, 0.05 + d.dir[1] * 0.1, 0]}
        />
      ))}
    </MarchingCubes>
  )
}

// Thin editorial ring from the original hero — fades away as droplets scatter
function OrbitRing({ progress }: { progress?: ProgressRef }) {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const p = progress?.current ?? 0
    ref.current.rotation.x = t * 0.05 + 0.9
    ref.current.rotation.z = -t * 0.04
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mat = ref.current.material as any
    if (mat) mat.opacity = 0.55 * Math.max(0, 1 - p * 1.6)
  })
  return (
    <mesh ref={ref} position={[1.8, -0.3, 0]} scale={3.6}>
      <torusGeometry args={[1, 0.008, 8, 128]} />
      <meshStandardMaterial color="#6E3710" roughness={0.8} transparent opacity={0.55} />
    </mesh>
  )
}

// Camera scrub — noticeable dolly + orbit + fov widen for real depth change
function ScrollCamera({ progress }: { progress: ProgressRef }) {
  const smooth = useRef(0)
  useFrame(({ camera }) => {
    smooth.current = MathUtils.lerp(smooth.current, progress.current, 0.07)
    const p = smooth.current
    camera.position.x = MathUtils.lerp(0, -0.7, p)
    camera.position.y = MathUtils.lerp(0, 0.35, p)
    camera.position.z = MathUtils.lerp(6, 3.8, p)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cam = camera as any
    if (typeof cam.fov === 'number') {
      cam.fov = MathUtils.lerp(48, 60, p)
      cam.updateProjectionMatrix()
    }
    camera.lookAt(MathUtils.lerp(1.6, 0, p), MathUtils.lerp(-0.2, 0.1, p), 0)
  })
  return null
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 6, 5]} intensity={1.1} color="#FAF7F1" />
      <directionalLight position={[-5, -2, 3]} intensity={0.4} color="#F4DBB9" />
      <pointLight position={[3, -2, 4]} intensity={0.3} color="#C17A3B" />
    </>
  )
}

function useDisplayMode(): { reducedMotion: boolean; isMobile: boolean } {
  const [mode, setMode] = useState({ reducedMotion: false, isMobile: false })
  useEffect(() => {
    setMode({
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      isMobile: window.matchMedia('(max-width: 768px)').matches,
    })
  }, [])
  return mode
}

export default function Hero() {
  const { openInquiry } = useInquiry()
  const progress = useScrollProgress()
  const { reducedMotion, isMobile } = useDisplayMode()

  const dropletCount = isMobile ? 6 : 9
  const resolution = isMobile ? 28 : 42

  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* warm paper glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 78% 32%, rgba(193,122,59,0.14) 0%, transparent 55%), radial-gradient(ellipse at 14% 80%, rgba(139,74,24,0.09) 0%, transparent 62%)',
        }}
      />

      {/* Fluid metaball layer — fixed to the viewport so it follows the whole
          page scroll; z-[-1] keeps it beneath every section's content. */}
      <div
        className={`${reducedMotion ? 'absolute' : 'fixed -z-10'} inset-0 pointer-events-none opacity-[0.18] md:opacity-[0.32]`}
        style={{ mixBlendMode: 'multiply' }}
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 48 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <SceneLights />
          <Suspense fallback={null}>
            <FluidDroplets
              progress={reducedMotion ? undefined : progress}
              count={dropletCount}
              resolution={resolution}
              interactive={!reducedMotion && !isMobile}
            />
            <OrbitRing progress={reducedMotion ? undefined : progress} />
          </Suspense>
          {!reducedMotion && <ScrollCamera progress={progress} />}
        </Canvas>
      </div>

      {/* soft overlay to protect text legibility (desktop) */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background:
            'linear-gradient(to right, rgba(250,247,241,0.55) 0%, rgba(250,247,241,0.35) 45%, rgba(250,247,241,0.08) 72%, transparent 100%)',
        }}
      />

      {/* stronger overlay for mobile readability */}
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(250,247,241,0.75) 0%, rgba(250,247,241,0.55) 35%, rgba(250,247,241,0.35) 70%, rgba(250,247,241,0.55) 100%)',
        }}
      />

      {/* Main content */}
      <div className="container-editorial relative z-10 pt-36 md:pt-48 pb-32">
        <div className="max-w-[52rem]">
          <div className="flex items-center gap-3 mb-6">
            <span className="rule" />
            <span className="eyebrow">{hero.eyebrow}</span>
          </div>
          <h1 className="h-display text-[32px] md:text-[48px] lg:text-[60px]">
            {hero.title1}
            <br />
            <span className="text-clay-700">{hero.title2}</span>
          </h1>
          <p className="mt-6 font-serif text-[20px] md:text-[26px] text-ink-900/85 leading-[1.45] max-w-2xl">
            <span className="highlight">한국데이터사이언티스트협회</span>와 함께
            <br className="hidden md:inline" />
            변화하는 AX시대, <span className="highlight">개인과 조직의 역량</span>을 증폭시키세요.
          </p>
          <p className="mt-5 text-[15px] md:text-[17px] text-ink-700 max-w-2xl leading-relaxed">
            {hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3 md:gap-4">
            <button
              onClick={openInquiry}
              className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 rounded-full bg-ink-900 text-cream-50 text-sm md:text-base font-medium hover:bg-clay-700 transition-colors"
            >
              {hero.ctaPrimary.label}
              <span aria-hidden>→</span>
            </button>
            <a
              href={hero.ctaSecondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-6 md:px-7 py-3 md:py-3.5 text-sm md:text-base"
            >
              {hero.ctaSecondary.label}
            </a>
          </div>
        </div>
      </div>

      {/* footer fade */}
      <div className="absolute left-0 right-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-cream-50 pointer-events-none z-[2]" />
    </section>
  )
}
