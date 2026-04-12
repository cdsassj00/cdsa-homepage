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

// Wrap long bio text into multiple SVG lines
function wrapText(text: string, maxCharsPerLine: number, maxLines = 10): string[] {
  // 마침표(.) 기준으로 먼저 분리한 뒤 줄 길이로 재분할
  const sentences = text.replace(/\n/g, ' ').split(/\.\s*/).filter(Boolean)
  const words: string[] = []
  for (const s of sentences) {
    words.push(...s.split(/\s+/))
    words.push('.') // 마침표 복원
  }
  const lines: string[] = []
  let current = ''
  for (const w of words) {
    if (w === '.') {
      current = current.trim() + '.'
      continue
    }
    if ((current + ' ' + w).trim().length > maxCharsPerLine) {
      if (current) lines.push(current.trim())
      current = w
    } else {
      current = (current + ' ' + w).trim()
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, maxLines)
}

interface Tutor {
  name: string
  role: string
  headline: string
  bio: string
  tags: string[]
  photo: string
}

/** Big editorial card — 600x600, 한글 기준 글자 폭 조정 */
function tutorCardImage(t: Tutor, index: number): string {
  // 한글은 영문 대비 ~1.6배 폭 → 한 줄 18자로 제한, 최대 9줄
  const headlineLines = wrapText(t.headline, 22, 2)
  const bio = wrapText(t.bio, 18, 9)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice">
<defs>
<filter id="gt${index}">
<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${index + 13}"/>
<feColorMatrix values="0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.07 0"/>
</filter>
<pattern id="pt${index}" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
<circle cx="1.2" cy="1.2" r="0.8" fill="#6E3710" fill-opacity="0.14"/>
</pattern>
<linearGradient id="pg${index}" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#E4D7BC"/>
<stop offset="55%" stop-color="#C17A3B"/>
<stop offset="100%" stop-color="#6E3710"/>
</linearGradient>
</defs>
<rect width="600" height="600" fill="#F5F0E6"/>
<rect width="600" height="600" fill="url(#pt${index})"/>
<rect width="600" height="600" filter="url(#gt${index})"/>

<g stroke="#C17A3B" stroke-opacity="0.18" fill="none">
<circle cx="510" cy="90" r="80"/>
<circle cx="510" cy="90" r="50"/>
</g>

<!-- Header -->
<text x="40" y="50" font-family="ui-monospace,monospace" font-size="10" letter-spacing="2" fill="#6E3710" fill-opacity="0.7">NETWORK · ${String(index + 1).padStart(2, '0')} / 09</text>
<line x1="40" y1="62" x2="95" y2="62" stroke="#A85F25" stroke-width="1.5"/>
<text x="560" y="50" font-family="ui-monospace,monospace" font-size="9" letter-spacing="1.5" fill="#8A7560" text-anchor="end">CDSA</text>

<!-- Portrait circle -->
<circle cx="90" cy="140" r="48" fill="url(#pg${index})"/>
<text x="90" y="158" font-family="'Noto Serif KR','Georgia',serif" font-size="46" font-weight="600" fill="#FAF7F1" text-anchor="middle">${escapeXml(t.name[0])}</text>

<!-- Name + role -->
<text x="160" y="125" font-family="'Noto Serif KR','Georgia',serif" font-size="32" font-weight="600" fill="#1A1511" letter-spacing="-1">${escapeXml(t.name)}</text>
<text x="160" y="150" font-family="ui-monospace,monospace" font-size="10" letter-spacing="1.5" fill="#A85F25">${escapeXml(t.role.toUpperCase())}</text>

<!-- Headline (줄바꿈 지원) -->
${headlineLines.map((line, i) => `<text x="160" y="${172 + i * 18}" font-family="'Noto Serif KR','Georgia',serif" font-size="13" fill="#3D2E22" font-weight="500">${escapeXml(line)}</text>`).join('')}

<line x1="40" y1="218" x2="120" y2="218" stroke="#6E3710" stroke-opacity="0.35" stroke-width="1"/>
<text x="40" y="238" font-family="ui-monospace,monospace" font-size="9" letter-spacing="1.5" fill="#8A7560">BIOGRAPHY</text>

<!-- Bio lines (13px, 한글 18자/줄) -->
${bio.map((line, i) => `<text x="40" y="${262 + i * 22}" font-family="'Noto Serif KR','Georgia',serif" font-size="13" fill="#3D2E22">${escapeXml(line)}</text>`).join('')}

<!-- Tags -->
<line x1="40" y1="478" x2="100" y2="478" stroke="#6E3710" stroke-opacity="0.35" stroke-width="1"/>
<text x="40" y="498" font-family="ui-monospace,monospace" font-size="9" letter-spacing="1.2" fill="#8A7560">EXPERTISE</text>
<text x="40" y="516" font-family="ui-monospace,monospace" font-size="9" letter-spacing="1" fill="#8A7560">${t.tags.map(tag => escapeXml(tag.toUpperCase())).join(' · ')}</text>

<!-- Footer -->
<text x="560" y="570" font-family="ui-monospace,monospace" font-size="9" letter-spacing="1.5" fill="#8A7560" text-anchor="end">VOL.2026</text>
</svg>`
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
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

const FLIP_SPEED = 720

const topForward: Keyframe[] = [
  { transform: 'rotateX(0deg)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
]
const bottomForward: Keyframe[] = [
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(0deg)' },
]
const topReverse: Keyframe[] = [
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(0deg)' },
]
const bottomReverse: Keyframe[] = [
  { transform: 'rotateX(0deg)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
]

export default function TutorFlip() {
  const [index, setIndex] = useState(0)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const overlayTopRef = useRef<HTMLDivElement>(null)
  const overlayBottomRef = useRef<HTMLDivElement>(null)
  const busyRef = useRef(false)

  const paint = useCallback((idx: number) => {
    const img = tutorCardImage(tutors[idx], idx)
    if (topRef.current) topRef.current.style.backgroundImage = img
    if (bottomRef.current) bottomRef.current.style.backgroundImage = img
    if (overlayTopRef.current) overlayTopRef.current.style.backgroundImage = img
    if (overlayBottomRef.current) overlayBottomRef.current.style.backgroundImage = img
  }, [])

  useEffect(() => {
    paint(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const flipTo = useCallback((newIdx: number, reverse: boolean) => {
    if (busyRef.current || newIdx === index) return
    busyRef.current = true
    const newImg = tutorCardImage(tutors[newIdx], newIdx)
    const topAnim = reverse ? topReverse : topForward
    const bottomAnim = reverse ? bottomReverse : bottomForward

    overlayTopRef.current?.animate(topAnim, {
      duration: FLIP_SPEED,
      easing: 'cubic-bezier(0.66, 0, 0.34, 1)',
    })
    overlayBottomRef.current?.animate(bottomAnim, {
      duration: FLIP_SPEED,
      easing: 'cubic-bezier(0.66, 0, 0.34, 1)',
    })

    const swapDelay = reverse ? 0 : FLIP_SPEED - 200
    window.setTimeout(() => {
      if (topRef.current) topRef.current.style.backgroundImage = newImg
      if (bottomRef.current) bottomRef.current.style.backgroundImage = newImg
    }, swapDelay)

    window.setTimeout(() => {
      if (overlayTopRef.current) overlayTopRef.current.style.backgroundImage = newImg
      if (overlayBottomRef.current) overlayBottomRef.current.style.backgroundImage = newImg
      busyRef.current = false
    }, FLIP_SPEED + 20)

    setIndex(newIdx)
  }, [index])

  const select = (i: number) => flipTo(i, i < index)

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

      {/* Right: flip gallery */}
      <div className="flex flex-col items-center">
        <div className="flip-gallery tutor-flip" aria-roledescription="carousel" aria-label="Selected tutor">
          <div ref={topRef} className="top unite" />
          <div ref={bottomRef} className="bottom unite" />
          <div ref={overlayTopRef} className="overlay-top unite" />
          <div ref={overlayBottomRef} className="overlay-bottom unite" />
        </div>
        <p className="mt-5 text-xs text-ink-500 font-mono tracking-wider text-center">
          왼쪽 썸네일을 누르면 카드가 플립되며 해당 전문가를 보여줍니다
        </p>
      </div>
    </div>
  )
}
