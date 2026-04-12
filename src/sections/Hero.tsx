import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import type { Mesh } from 'three'
import { hero } from '../data/content'
import { useInquiry } from './InquiryModal'

/**
 * Hero geometric 3D background.
 * Two organic distorted meshes floating in warm-brown light —
 * "예술적이면서 기술적인" (editorial + geometric) feel.
 * Palette stays Anthropic-cream so the 3D never competes with the title.
 */
function MorphBlob() {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t * 0.08
    ref.current.rotation.x = Math.sin(t * 0.18) * 0.22
    ref.current.position.y = Math.sin(t * 0.3) * 0.2
  })
  return (
    <mesh ref={ref} scale={2.5} position={[1.6, -0.2, 0]}>
      <icosahedronGeometry args={[1, 24]} />
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

function SmallSatellite() {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = -t * 0.14
    ref.current.rotation.x = t * 0.1
    ref.current.position.x = 3.8 + Math.sin(t * 0.4) * 0.2
    ref.current.position.y = 1.7 + Math.cos(t * 0.3) * 0.15
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

function OrbitRing() {
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

export default function Hero() {
  const { openInquiry } = useInquiry()
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

      {/* Three.js geometric background — watermark opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.32, mixBlendMode: 'multiply' }}
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 48 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[6, 6, 5]} intensity={1.1} color="#FAF7F1" />
          <directionalLight position={[-5, -2, 3]} intensity={0.4} color="#F4DBB9" />
          <pointLight position={[3, -2, 4]} intensity={0.3} color="#C17A3B" />
          <Suspense fallback={null}>
            <MorphBlob />
            <SmallSatellite />
            <OrbitRing />
          </Suspense>
        </Canvas>
      </div>

      {/* soft overlay to protect text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(250,247,241,0.55) 0%, rgba(250,247,241,0.35) 45%, rgba(250,247,241,0.08) 72%, transparent 100%)',
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
            <span className="highlight">한국데이터사이언티스트협회</span>와 함께{'\n'}
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
