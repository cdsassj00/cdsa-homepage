import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { MathUtils, Vector2 } from 'three'
import type { Mesh } from 'three'
import { hero } from '../data/content'
import { useInquiry } from './InquiryModal'

/**
 * Hero 3D background — scroll-scrubbed water droplets over warm-brown light.
 *
 * Quality gate (top of the component) picks one of three renderers on mount:
 *   - 'off'       → prefers-reduced-motion; render nothing 3D, keep static overlay
 *   - 'downgrade' → mobile / low-power; current MeshDistortMaterial + scroll scrub only
 *   - 'full'      → desktop; MeshTransmissionMaterial + HDRI + Bloom + ChromaticAberration
 *
 * Layout, text, functionality, and content are untouched — only the visual
 * layer inside <Canvas> changes.
 */

type Quality = 'off' | 'downgrade' | 'full'

// Shared scroll progress ref — hero enter-and-leave normalized to 0..1
type ProgressRef = { current: number }

function useScrollProgress(): ProgressRef {
  const ref = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight || 1
      ref.current = Math.min(1, Math.max(0, window.scrollY / vh))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return ref
}

// Camera moves through the droplets on scroll — dolly + gentle orbit + fov widen
function ScrollCamera({ progress }: { progress: ProgressRef }) {
  const smooth = useRef(0)
  useFrame(({ camera }) => {
    smooth.current = MathUtils.lerp(smooth.current, progress.current, 0.08)
    const p = smooth.current
    // Dolly forward + tiny orbit + fov widen for perspective drama
    camera.position.x = MathUtils.lerp(0, -0.8, p)
    camera.position.y = MathUtils.lerp(0, 0.4, p)
    camera.position.z = MathUtils.lerp(6, 3.2, p)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cam = camera as any
    if (typeof cam.fov === 'number') {
      cam.fov = MathUtils.lerp(48, 60, p)
      cam.updateProjectionMatrix()
    }
    camera.lookAt(1.6 - p * 0.4, -0.1, 0)
  })
  return null
}

// ============ FULL quality — water droplets with transmission ============

function GlassDrop({
  scale,
  position,
  progress,
  speed,
  color,
}: {
  scale: number
  position: [number, number, number]
  progress: ProgressRef
  speed: number
  color: string
}) {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const p = progress.current
    ref.current.rotation.y = t * 0.06 * speed + p * 0.6
    ref.current.rotation.x = Math.sin(t * 0.18 * speed) * 0.22 + p * 0.3
    ref.current.position.x = position[0] + Math.sin(t * 0.3 * speed) * 0.15
    ref.current.position.y = position[1] + Math.cos(t * 0.24 * speed) * 0.18 - p * 0.4
    ref.current.position.z = position[2] + p * 1.2
  })
  return (
    <mesh ref={ref} scale={scale} position={position}>
      <icosahedronGeometry args={[1, 24]} />
      <MeshTransmissionMaterial
        color={color}
        samples={4}
        thickness={1.2}
        roughness={0.14}
        transmission={1}
        ior={1.33}
        chromaticAberration={0.06}
        distortion={0.28}
        distortionScale={0.4}
        temporalDistortion={0.08}
        anisotropy={0.6}
        clearcoat={1}
        clearcoatRoughness={0.1}
        backside={false}
      />
    </mesh>
  )
}

function OrbitRingFull({ progress }: { progress: ProgressRef }) {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const p = progress.current
    ref.current.rotation.x = t * 0.05 + 0.9 + p * 0.3
    ref.current.rotation.z = -t * 0.04 - p * 0.5
  })
  return (
    <mesh ref={ref} position={[1.8, -0.3, 0]} scale={3.6}>
      <torusGeometry args={[1, 0.008, 8, 128]} />
      <meshStandardMaterial color="#6E3710" roughness={0.8} transparent opacity={0.5} />
    </mesh>
  )
}

function FullScene({ progress }: { progress: ProgressRef }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 6, 5]} intensity={1.0} color="#FAF7F1" />
      <directionalLight position={[-5, -2, 3]} intensity={0.35} color="#F4DBB9" />
      <pointLight position={[3, -2, 4]} intensity={0.35} color="#C17A3B" />
      <Suspense fallback={null}>
        <Environment preset="sunset" background={false} />
        <GlassDrop
          scale={2.5}
          position={[1.6, -0.2, 0]}
          progress={progress}
          speed={1.0}
          color="#F4DBB9"
        />
        <GlassDrop
          scale={0.82}
          position={[3.8, 1.7, -0.4]}
          progress={progress}
          speed={1.4}
          color="#E8C39A"
        />
        <GlassDrop
          scale={0.6}
          position={[-2.4, 1.2, -0.2]}
          progress={progress}
          speed={1.7}
          color="#F1D1AB"
        />
        <OrbitRingFull progress={progress} />
      </Suspense>
      <ScrollCamera progress={progress} />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.45}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <ChromaticAberration
          offset={new Vector2(0.0009, 0.0014)}
          radialModulation={false}
          modulationOffset={0}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  )
}

// ============ DOWNGRADE quality — current distort material + scrub ============

function DowngradeBlob({ progress }: { progress: ProgressRef }) {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const p = progress.current
    ref.current.rotation.y = t * 0.08 + p * 0.4
    ref.current.rotation.x = Math.sin(t * 0.18) * 0.22
    ref.current.position.y = Math.sin(t * 0.3) * 0.2 - p * 0.4
  })
  return (
    <mesh ref={ref} scale={2.5} position={[1.6, -0.2, 0]}>
      <icosahedronGeometry args={[1, 16]} />
      <MeshDistortMaterial
        color="#C17A3B"
        distort={0.45}
        speed={1.1}
        roughness={0.42}
        metalness={0.14}
      />
    </mesh>
  )
}

function DowngradeSatellite({ progress }: { progress: ProgressRef }) {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const p = progress.current
    ref.current.rotation.y = -t * 0.14 - p * 0.3
    ref.current.rotation.x = t * 0.1
    ref.current.position.x = 3.8 + Math.sin(t * 0.4) * 0.2
    ref.current.position.y = 1.7 + Math.cos(t * 0.3) * 0.15 - p * 0.3
  })
  return (
    <mesh ref={ref} scale={0.82} position={[3.8, 1.7, -0.4]}>
      <octahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color="#8B4A18"
        distort={0.28}
        speed={0.9}
        roughness={0.55}
        metalness={0.08}
      />
    </mesh>
  )
}

function DowngradeRing() {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.x = t * 0.05 + 0.9
    ref.current.rotation.z = -t * 0.04
  })
  return (
    <mesh ref={ref} position={[1.8, -0.3, 0]} scale={3.6}>
      <torusGeometry args={[1, 0.008, 8, 128]} />
      <meshStandardMaterial color="#6E3710" roughness={0.8} transparent opacity={0.55} />
    </mesh>
  )
}

function DowngradeScene({ progress }: { progress: ProgressRef }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 6, 5]} intensity={1.1} color="#FAF7F1" />
      <directionalLight position={[-5, -2, 3]} intensity={0.4} color="#F4DBB9" />
      <pointLight position={[3, -2, 4]} intensity={0.3} color="#C17A3B" />
      <Suspense fallback={null}>
        <DowngradeBlob progress={progress} />
        <DowngradeSatellite progress={progress} />
        <DowngradeRing />
      </Suspense>
      <ScrollCamera progress={progress} />
    </>
  )
}

// ============ Quality detector ============

function useQuality(): Quality {
  const [q, setQ] = useState<Quality>('downgrade')
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setQ('off')
      return
    }
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const cores = navigator.hardwareConcurrency ?? 4
    if (isMobile || cores < 4) {
      setQ('downgrade')
      return
    }
    setQ('full')
  }, [])
  return q
}

// ============ Hero ============

export default function Hero() {
  const { openInquiry } = useInquiry()
  const progress = useScrollProgress()
  const quality = useQuality()

  const canvasOpacityClass =
    quality === 'full'
      ? 'opacity-[0.55]'
      : 'opacity-[0.18] md:opacity-[0.32]'
  const canvasBlendMode = quality === 'full' ? 'normal' : 'multiply'

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

      {/* Three.js scroll-scrubbed 3D layer — skipped entirely when quality === 'off' */}
      {quality !== 'off' && (
        <div
          className={`absolute inset-0 pointer-events-none ${canvasOpacityClass}`}
          style={{ mixBlendMode: canvasBlendMode }}
        >
          <Canvas
            camera={{ position: [0, 0, 6], fov: 48 }}
            dpr={quality === 'full' ? [1, 1.5] : [1, 1]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}
          >
            {quality === 'full' ? (
              <FullScene progress={progress} />
            ) : (
              <DowngradeScene progress={progress} />
            )}
          </Canvas>
        </div>
      )}

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
