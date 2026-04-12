import { useCallback, useEffect, useRef, useState } from 'react'
import { tutors } from '../data/content'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

interface Tutor {
  name: string
  role: string
  headline: string
  bio: string
  tags: string[]
  photo: string
}

/** Small thumb image — simplified for tiny sizes. */
function tutorThumbImage(t: Tutor, index: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
<defs>
<filter id="th${index}">
<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${index + 5}"/>
<feColorMatrix values="0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.06 0"/>
</filter>
<linearGradient id="pgt${index}" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#E4D7BC"/>
<stop offset="60%" stop-color="#C17A3B"/>
<stop offset="100%" stop-color="#6E3710"/>
</linearGradient>
</defs>
<rect width="200" height="200" fill="#F5F0E6"/>
<rect width="200" height="200" filter="url(#th${index})"/>
<circle cx="100" cy="88" r="44" fill="url(#pgt${index})"/>
<text x="100" y="106" font-family="'Noto Serif KR','Georgia',serif" font-size="46" font-weight="600" fill="#FAF7F1" text-anchor="middle">${escapeXml(
    t.name[0],
  )}</text>
<text x="100" y="160" font-family="ui-monospace, monospace" font-size="10" letter-spacing="1.5" fill="#6E3710" text-anchor="middle">${escapeXml(
    t.role.toUpperCase().slice(0, 14),
  )}</text>
<text x="100" y="178" font-family="'Noto Serif KR','Georgia',serif" font-size="13" font-weight="600" fill="#1A1511" text-anchor="middle">${escapeXml(
    t.name,
  )}</text>
</svg>`
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
}

/** HTML-based tutor card content */
function TutorCard({ tutor, index }: { tutor: Tutor; index: number }) {
  return (
    <div className="bg-cream-100 border border-ink-700/15 rounded-sm p-8 w-full max-w-[560px] min-h-[500px] flex flex-col relative overflow-hidden">
      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='${index + 13}'/><feColorMatrix values='0 0 0 0 0.16 0 0 0 0 0.12 0 0 0 0 0.08 0 0 0 1 0'/></filter><rect width='200' height='200' filter='url(#g)'/></svg>`,
          )}")`,
        }}
      />

      {/* Decorative circles — top right */}
      <div className="absolute top-4 right-6 pointer-events-none">
        <svg width="160" height="160" viewBox="0 0 160 160" className="opacity-[0.12]">
          <circle cx="80" cy="80" r="80" stroke="#C17A3B" strokeWidth="1" fill="none" />
          <circle cx="80" cy="80" r="50" stroke="#C17A3B" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Header: NETWORK label + CDSA */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <span className="font-mono text-[10px] tracking-[2px] text-clay-700/70">
            NETWORK &middot; {String(index + 1).padStart(2, '0')} / {String(tutors.length).padStart(2, '0')}
          </span>
          <div className="mt-1.5 w-14 h-[1.5px] bg-clay-600" />
        </div>
        <span className="font-mono text-[9px] tracking-[1.5px] text-ink-500">CDSA</span>
      </div>

      {/* Portrait + Name + Role */}
      <div className="flex items-center gap-5 mb-4 relative z-10">
        {/* Portrait circle */}
        <div className="w-24 h-24 rounded-full flex-shrink-0 overflow-hidden relative">
          {tutor.photo ? (
            <img
              src={tutor.photo}
              alt={tutor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, #E4D7BC 0%, #C17A3B 55%, #6E3710 100%)`,
              }}
            >
              <span className="font-serif text-[46px] font-semibold text-cream-50">
                {tutor.name[0]}
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-serif text-[28px] font-semibold text-ink-900 leading-tight tracking-tight">
            {tutor.name}
          </h3>
          <span className="font-mono text-[10px] tracking-[1.5px] text-clay-600 uppercase">
            {tutor.role}
          </span>
        </div>
      </div>

      {/* Headline */}
      <p className="font-serif text-[14px] text-ink-800 font-medium leading-relaxed mb-4 relative z-10">
        {tutor.headline}
      </p>

      {/* Divider */}
      <div className="w-20 h-px bg-clay-700/35 mb-3 relative z-10" />

      {/* BIOGRAPHY label */}
      <span className="font-mono text-[9px] tracking-[1.5px] text-ink-500 mb-2 relative z-10">
        BIOGRAPHY
      </span>

      {/* Bio text — auto-wrapping HTML, the whole point of this conversion */}
      <p className="font-serif text-[13px] text-ink-800 leading-[1.7] mb-auto relative z-10">
        {tutor.bio}
      </p>

      {/* Divider */}
      <div className="w-16 h-px bg-clay-700/35 mt-4 mb-3 relative z-10" />

      {/* EXPERTISE label + tags */}
      <div className="relative z-10">
        <span className="font-mono text-[9px] tracking-[1.2px] text-ink-500 block mb-2">
          EXPERTISE
        </span>
        <div className="flex flex-wrap gap-1.5">
          {tutor.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] tracking-[1px] text-ink-500 bg-cream-200/60 px-2 py-0.5 rounded-sm border border-ink-700/10"
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-4 relative z-10">
        <span className="font-mono text-[9px] tracking-[1.5px] text-ink-500">VOL.2026</span>
      </div>
    </div>
  )
}

export default function TutorFlip() {
  const [index, setIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const busyRef = useRef(false)

  // Initial paint
  useEffect(() => {
    setDisplayIndex(0)
  }, [])

  const select = useCallback(
    (newIdx: number) => {
      if (busyRef.current || newIdx === index) return
      busyRef.current = true
      setFlipping(true)
      setIndex(newIdx)

      // At 300ms (halfway through 600ms transition), swap content
      window.setTimeout(() => {
        setDisplayIndex(newIdx)
        setFlipping(false)
      }, 300)

      // Release lock after full animation completes
      window.setTimeout(() => {
        busyRef.current = false
      }, 620)
    },
    [index],
  )

  return (
    <div className="grid md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr] gap-8 lg:gap-12">
      {/* Left: thumbnail grid — 실제 사진 사용 */}
      <div className="grid grid-cols-3 gap-3 content-start">
        {tutors.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => select(i)}
            aria-label={`${t.name} 카드 보기`}
            className={`aspect-square rounded-sm overflow-hidden transition-all duration-300 relative group ${
              i === index
                ? 'scale-100 ring-2 ring-clay-600 ring-offset-2 ring-offset-cream-100 z-10'
                : 'scale-95 opacity-75 hover:opacity-100 hover:scale-100 ring-1 ring-ink-700/15'
            }`}
          >
            {t.photo ? (
              <img
                src={t.photo}
                alt={t.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: tutorThumbImage(t, i) }}
              />
            )}
            {/* 이름 오버레이 — 호버 시 표시 */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/80 to-transparent pt-8 pb-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="block text-[11px] text-cream-50 text-center font-serif truncate">
                {t.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Right: HTML card with 3D flip transition */}
      <div className="flex flex-col items-center">
        <div
          className="tutor-card-flip"
          style={{ perspective: '1200px' }}
        >
          <div
            className={`tutor-card-inner${flipping ? ' flipping' : ''}`}
            style={{
              transition: 'transform 0.3s cubic-bezier(0.66, 0, 0.34, 1)',
              transformStyle: 'preserve-3d',
            }}
          >
            <TutorCard tutor={tutors[displayIndex]} index={displayIndex} />
          </div>
        </div>
        <p className="mt-5 text-xs text-ink-500 font-mono tracking-wider text-center">
          왼쪽 썸네일을 누르면 카드가 플립되며 해당 전문가를 보여줍니다
        </p>
      </div>
    </div>
  )
}
