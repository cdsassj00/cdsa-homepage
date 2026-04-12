import { useRef, useState } from 'react'
import { videos, site } from '../data/content'

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function thumbSvg(title: string, index: number): string {
  const words = title.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > 14) {
      if (cur) lines.push(cur.trim())
      cur = w
    } else {
      cur = (cur + ' ' + w).trim()
    }
  }
  if (cur) lines.push(cur)
  const displayLines = lines.slice(0, 3)
  const accents = ['#C17A3B', '#A85F25', '#8B4A18', '#6E3710']
  const accent = accents[index % accents.length]

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
<defs>
<filter id="vn${index}"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${index + 17}"/><feColorMatrix values="0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.06 0"/></filter>
<pattern id="vd${index}" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.6" fill="#6E3710" fill-opacity="0.12"/></pattern>
</defs>
<rect width="320" height="180" fill="#F5F0E6"/>
<rect width="320" height="180" fill="url(#vd${index})"/>
<rect width="320" height="180" filter="url(#vn${index})"/>
<g stroke="${accent}" stroke-opacity="0.18" fill="none"><circle cx="260" cy="40" r="55"/><circle cx="260" cy="40" r="35"/><circle cx="260" cy="40" r="15"/></g>
<line x1="24" y1="30" x2="60" y2="30" stroke="${accent}" stroke-width="1.5"/>
<text x="24" y="22" font-family="ui-monospace,monospace" font-size="8" letter-spacing="2" fill="#8A7560">WORKBYAX · ${String(index + 1).padStart(2, '0')}</text>
<text x="24" y="72" font-family="'Noto Serif KR','Georgia',serif" font-size="48" font-weight="600" fill="${accent}" letter-spacing="-2" fill-opacity="0.25">${String(index + 1).padStart(2, '0')}</text>
${displayLines.map((line, i) => `<text x="24" y="${95 + i * 22}" font-family="'Noto Serif KR','Georgia',serif" font-size="16" font-weight="600" fill="#1A1511" letter-spacing="-0.5">${escapeXml(line)}</text>`).join('')}
<text x="296" y="168" font-family="ui-monospace,monospace" font-size="7" letter-spacing="1.5" fill="#8A7560" text-anchor="end">CDSA · VOL.2026</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export default function Videos() {
  const [active, setActive] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <section id="videos" className="py-28 md:py-36 border-b border-ink-700/10">
      <div className="container-editorial">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <span className="eyebrow">VIDEO · 생성형 AI 강의 아카이브</span>
            <h2 className="h-display text-[36px] md:text-[52px] mt-5">
              현장에서 쓰는 <span className="text-clay-700">생성형 AI를 영상으로.</span>
            </h2>
          </div>
          <a
            href={site.youtubeChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-ink-900 underline underline-offset-4 hover:text-clay-700"
          >
            @workbyax 채널 전체 보기 ↗
          </a>
        </div>

        {/* 슬라이더 + 좌우 네비게이션 */}
        <div className="relative group/slider">
          {/* 좌측 페이드 + 화살표 */}
          <button
            onClick={() => scroll(-1)}
            aria-label="이전"
            className="absolute left-0 top-0 bottom-[48px] w-12 md:w-16 z-10 flex items-center justify-start pl-1 bg-gradient-to-r from-cream-100/90 via-cream-100/60 to-transparent opacity-0 group-hover/slider:opacity-100 transition-opacity"
          >
            <span className="w-9 h-9 rounded-full border border-ink-700/25 bg-cream-50/90 flex items-center justify-center text-ink-700 hover:border-clay-600 hover:text-clay-700 transition-colors shadow-sm">
              ‹
            </span>
          </button>

          {/* 우측 페이드 + 화살표 */}
          <button
            onClick={() => scroll(1)}
            aria-label="다음"
            className="absolute right-0 top-0 bottom-[48px] w-12 md:w-16 z-10 flex items-center justify-end pr-1 bg-gradient-to-l from-cream-100/90 via-cream-100/60 to-transparent opacity-0 group-hover/slider:opacity-100 transition-opacity"
          >
            <span className="w-9 h-9 rounded-full border border-ink-700/25 bg-cream-50/90 flex items-center justify-center text-ink-700 hover:border-clay-600 hover:text-clay-700 transition-colors shadow-sm">
              ›
            </span>
          </button>

          {/* 카드 트랙 — 스크롤바 숨김 */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <style>{`#videos [data-scroll]::-webkit-scrollbar { display: none; }`}</style>
            {videos.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setActive(v.id)}
                className="group flex-none w-[260px] md:w-[300px] snap-start text-left flex flex-col"
              >
                <div className="aspect-video rounded-sm border border-ink-700/15 overflow-hidden relative group-hover:border-clay-500 group-hover:shadow-[0_12px_28px_-12px_rgba(110,55,16,0.3)] transition-all duration-300 bg-cream-100">
                  <img
                    src={thumbSvg(v.title, i)}
                    alt={v.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/25 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-ink-900/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                        <path d="M5 2 L16 9 L5 16 Z" fill="#FAF7F1" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="h-[48px] mt-3 flex items-start">
                  <p className="font-serif text-[14px] md:text-[15px] text-ink-900 leading-snug group-hover:text-clay-700 transition-colors line-clamp-2">
                    {v.title}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* 하단 진행 인디케이터 */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {videos.map((v, i) => (
              <button
                key={v.id}
                onClick={() => {
                  if (!scrollRef.current) return
                  const cardW = scrollRef.current.querySelector('button')?.offsetWidth || 300
                  scrollRef.current.scrollTo({ left: i * (cardW + 20), behavior: 'smooth' })
                }}
                className="w-1.5 h-1.5 rounded-full bg-ink-700/20 hover:bg-clay-500 transition-colors"
                aria-label={`${v.title}로 이동`}
              />
            ))}
          </div>
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] bg-ink-900/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
          onClick={() => setActive(null)}
        >
          <div
            className="bg-cream-50 rounded-sm max-w-3xl w-full overflow-hidden border border-ink-700/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-700/10">
              <span className="font-serif text-[15px] text-ink-900 truncate pr-4">
                {videos.find((v) => v.id === active)?.title}
              </span>
              <button
                onClick={() => setActive(null)}
                className="text-ink-500 hover:text-ink-900 shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-200 transition-colors"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-ink-900">
              <iframe
                src={`https://www.youtube.com/embed/${active}?autoplay=1&rel=0`}
                title={videos.find((v) => v.id === active)?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
