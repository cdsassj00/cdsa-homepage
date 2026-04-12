import { useCallback, useEffect, useRef, useState } from 'react'

export interface FlipItem {
  kicker: string
  title: string
  meta: string
  tag: string
  accent?: string
  bg?: string
}

// Editorial flip-card content: 13 narrative beats telling CDSA's story
const items: FlipItem[] = [
  {
    kicker: 'MANIFESTO · 00',
    title: '수정구슬이 아닙니다.\n골목길의 문제를 풉니다.',
    meta: 'CDSA · MISSION',
    tag: '철학',
  },
  {
    kicker: 'PROBLEM · 01',
    title: '100페이지 PDF에서\n점 불릿 문장만 추출',
    meta: 'CLAUDE × PYTHON · 12분',
    tag: '문서 추출',
  },
  {
    kicker: 'METAPHOR · 02',
    title: '거시 혁신이 고속도로라면,\n우리는 골목길을 설계합니다.',
    meta: '거시 × 미시의 균형',
    tag: '관점',
  },
  {
    kicker: 'PROBLEM · 03',
    title: '회의록에서 결정사항·담당자·\n기한만 To-do로',
    meta: 'CHATGPT × NOTION · 8분',
    tag: '회의 자동화',
  },
  {
    kicker: 'TRACK · 01',
    title: 'AXpert for Practice\n1Day 집중 실습 10개 과정',
    meta: '엑셀·문서·분석·자동화',
    tag: '실무형',
  },
  {
    kicker: 'PRODUCT',
    title: '바이브마켓\n아이디어가 거래되는 곳',
    meta: 'vivecoding.lovable.app',
    tag: '산출물 플랫폼',
  },
  {
    kicker: 'PROBLEM · 04',
    title: '300행 설문에서 주관식 요약\n대표 의견 + 갈등 이슈',
    meta: 'CLAUDE × EXCEL · 20분',
    tag: '설문 분석',
  },
  {
    kicker: 'TRACK · 02',
    title: '바이브 코딩 종합\n비개발자의 풀스택',
    meta: '15세션 · HTML에서 Replit까지',
    tag: '비개발자',
  },
  {
    kicker: 'INSTITUTIONS',
    title: '행정안전부 · NIA\n과기정통부 · 식약처',
    meta: '전문위원 · 자문위원 · 주임교수',
    tag: '정부 공식',
  },
  {
    kicker: 'PRODUCT',
    title: '커리큘럼 빌더\n드래그로 조립하는 교육과정',
    meta: 'aicurri.lovable.app',
    tag: '교육 설계',
  },
  {
    kicker: 'PROBLEM · 05',
    title: '기존 공문 10개에서 문체·구조\n우리 조직 공문 템플릿',
    meta: 'NOTEBOOKLM × CHATGPT · 30분',
    tag: '공문 표준화',
  },
  {
    kicker: 'TRACK · 03',
    title: '민첩한 AI 거버넌스\n행정망·폐쇄망 특화',
    meta: '9유형 오프라인 바이브 코딩',
    tag: '보안·폐쇄망',
  },
  {
    kicker: 'INVITATION',
    title: '협회와 배우면,\n이런 것도 만듭니다.',
    meta: '오늘 당신 책상 위의 문제를 들려주세요',
    tag: '문의',
  },
]

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Generate an editorial card SVG as a data URI.
 * The image is rendered at 500x1000 so that background-size: 100% 200% works
 * (the gallery shows top half = top:0..500 of image, bottom half = 500..1000).
 * We draw the same content stretched to the full 500x1000 so both halves
 * concatenate seamlessly.
 */
function cardImage(item: FlipItem, index: number, total: number): string {
  const lines = item.title.split('\n')
  const n = String(index + 1).padStart(2, '0')
  const totalS = String(total).padStart(2, '0')

  const accent = item.accent ?? '#A85F25'
  const bg = item.bg ?? '#F5F0E6'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice">
<defs>
<filter id="g${index}">
<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${index + 7}"/>
<feColorMatrix values="0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.07 0"/>
</filter>
<pattern id="dots${index}" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
<circle cx="1.2" cy="1.2" r="0.8" fill="#6E3710" fill-opacity="0.16"/>
</pattern>
</defs>
<rect width="500" height="500" fill="${bg}"/>
<rect width="500" height="500" fill="url(#dots${index})"/>
<rect width="500" height="500" filter="url(#g${index})"/>

<g stroke="${accent}" stroke-opacity="0.22" fill="none">
<circle cx="420" cy="80" r="90"/>
<circle cx="420" cy="80" r="60"/>
<circle cx="420" cy="80" r="30"/>
</g>

<text x="40" y="54" font-family="ui-monospace, monospace" font-size="11" letter-spacing="2.4" fill="#6E3710" fill-opacity="0.7">${escapeXml(item.kicker)}</text>
<line x1="40" y1="68" x2="90" y2="68" stroke="${accent}" stroke-width="1.5"/>

<text x="40" y="220" font-family="'Noto Serif KR','Georgia',serif" font-size="158" font-weight="600" fill="${accent}" letter-spacing="-6">${n}</text>

${lines
  .map(
    (line, i) => `<text x="40" y="${270 + i * 34}" font-family="'Noto Serif KR','Georgia',serif" font-size="26" font-weight="600" fill="#1A1511" letter-spacing="-0.8">${escapeXml(
      line,
    )}</text>`,
  )
  .join('')}

<line x1="40" y1="380" x2="110" y2="380" stroke="#6E3710" stroke-opacity="0.4" stroke-width="1"/>
<text x="40" y="408" font-family="ui-monospace, monospace" font-size="12" letter-spacing="1.4" fill="#6B5540">${escapeXml(item.meta)}</text>
<text x="40" y="432" font-family="ui-monospace, monospace" font-size="10" letter-spacing="1.8" fill="#8A7560">${escapeXml(item.tag.toUpperCase())}</text>

<text x="460" y="54" font-family="ui-monospace, monospace" font-size="10" letter-spacing="1.8" fill="#8A7560" text-anchor="end">${n} / ${totalS}</text>
<text x="460" y="468" font-family="ui-monospace, monospace" font-size="10" letter-spacing="1.8" fill="#8A7560" text-anchor="end">CDSA · VOL.2026</text>
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

export default function FlipGallery({ autoMs = 5200 }: { autoMs?: number }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * items.length))
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const overlayTopRef = useRef<HTMLDivElement>(null)
  const overlayBottomRef = useRef<HTMLDivElement>(null)
  const busyRef = useRef(false)
  const hoverRef = useRef(false)

  const paint = useCallback(
    (idx: number) => {
      const img = cardImage(items[idx], idx, items.length)
      if (topRef.current) topRef.current.style.backgroundImage = img
      if (bottomRef.current) bottomRef.current.style.backgroundImage = img
      if (overlayTopRef.current) overlayTopRef.current.style.backgroundImage = img
      if (overlayBottomRef.current) overlayBottomRef.current.style.backgroundImage = img
    },
    [],
  )

  // initial paint
  useEffect(() => {
    paint(index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const flipTo = useCallback(
    (newIdx: number, reverse: boolean) => {
      if (busyRef.current) return
      busyRef.current = true

      const newImg = cardImage(items[newIdx], newIdx, items.length)
      const topAnim = reverse ? topReverse : topForward
      const bottomAnim = reverse ? bottomReverse : bottomForward

      overlayTopRef.current?.animate(topAnim, { duration: FLIP_SPEED, easing: 'cubic-bezier(0.66, 0, 0.34, 1)' })
      overlayBottomRef.current?.animate(bottomAnim, { duration: FLIP_SPEED, easing: 'cubic-bezier(0.66, 0, 0.34, 1)' })

      // swap the base layer at the "hidden" midpoint so the reveal shows new image
      const baseSwapDelay = reverse ? 0 : FLIP_SPEED - 200
      window.setTimeout(() => {
        if (topRef.current) topRef.current.style.backgroundImage = newImg
        if (bottomRef.current) bottomRef.current.style.backgroundImage = newImg
      }, baseSwapDelay)

      // after the flip completes, make the overlays show the new image too (they'll sit flat on top of base)
      window.setTimeout(() => {
        if (overlayTopRef.current) overlayTopRef.current.style.backgroundImage = newImg
        if (overlayBottomRef.current) overlayBottomRef.current.style.backgroundImage = newImg
        busyRef.current = false
      }, FLIP_SPEED + 20)

      setIndex(newIdx)
    },
    [],
  )

  const next = useCallback(() => {
    const n = (index + 1) % items.length
    flipTo(n, false)
  }, [index, flipTo])

  const prev = useCallback(() => {
    const p = (index - 1 + items.length) % items.length
    flipTo(p, true)
  }, [index, flipTo])

  // auto-advance with hover pause
  useEffect(() => {
    if (autoMs <= 0) return
    const id = window.setTimeout(() => {
      if (!hoverRef.current) next()
    }, autoMs)
    return () => window.clearTimeout(id)
  }, [index, autoMs, next])

  const current = items[index]

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div
        className="flip-gallery"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
        aria-roledescription="carousel"
        aria-label="CDSA story flip gallery"
      >
        <div ref={topRef} className="top unite" />
        <div ref={bottomRef} className="bottom unite" />
        <div ref={overlayTopRef} className="overlay-top unite" />
        <div ref={overlayBottomRef} className="overlay-bottom unite" />
      </div>

      <div className="flex items-center justify-between w-full max-w-[520px] gap-6">
        <div className="text-left min-w-0 flex-1">
          <div className="font-mono text-[10px] tracking-[0.24em] text-clay-600 uppercase mb-1">
            {current.kicker}
          </div>
          <div className="font-serif text-base md:text-lg text-ink-900 leading-snug truncate">
            {current.title.split('\n')[0]}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="font-mono text-[10px] tracking-[0.2em] text-ink-500 mr-2">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </div>
          <button
            type="button"
            onClick={prev}
            aria-label="이전"
            className="w-9 h-9 rounded-full border border-ink-700/25 hover:border-clay-600 hover:text-clay-700 text-ink-700 transition-colors flex items-center justify-center"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="다음"
            className="w-9 h-9 rounded-full border border-ink-700/25 hover:border-clay-600 hover:text-clay-700 text-ink-700 transition-colors flex items-center justify-center"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
