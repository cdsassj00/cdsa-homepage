import { useRef, useState } from 'react'
import { site } from '../data/content'
import { series, type Video } from '../data/youtube'

function formatViews(n: number) {
  if (n >= 10000) return `조회 ${(n / 10000).toFixed(1).replace(/\.0$/, '')}만`
  return `조회 ${n.toLocaleString()}`
}

export default function Videos() {
  const [tab, setTab] = useState(0)
  const [active, setActive] = useState<Video | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const cur = series[tab]

  const scroll = (dir: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 640, behavior: 'smooth' })
  }

  const pick = (i: number) => {
    setTab(i)
    scrollRef.current?.scrollTo({ left: 0 })
  }

  return (
    <section id="videos" className="py-28 md:py-36 border-b border-ink-700/10">
      <div className="container-editorial">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <span className="eyebrow">VIDEO · 신성진 · Work by AX</span>
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

        {/* Series tabs */}
        <div className="flex flex-wrap gap-2 mb-6" role="tablist">
          {series.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === tab}
              onClick={() => pick(i)}
              className={`px-4 py-2 rounded-full text-[13px] border transition-colors ${
                i === tab
                  ? 'bg-ink-900 text-cream-50 border-ink-900'
                  : 'bg-cream-50 text-ink-700 border-ink-700/20 hover:border-clay-600 hover:text-clay-700'
              }`}
            >
              {s.label}
              <span className={`ml-2 font-mono text-[10px] ${i === tab ? 'text-clay-300' : 'text-ink-400'}`}>
                {s.videos.length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
          <p className="text-[15px] text-ink-700 max-w-2xl leading-relaxed">{cur.desc}</p>
          <a
            href={cur.more}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-clay-700 font-medium underline underline-offset-4 hover:text-clay-800 shrink-0"
          >
            유튜브에서 이 시리즈 보기 ↗
          </a>
        </div>

        <div className="relative group/slider">
          <button
            onClick={() => scroll(-1)}
            aria-label="이전"
            className="hidden md:flex absolute -left-5 top-[34%] z-10 w-10 h-10 rounded-full border border-ink-700/25 bg-cream-50 items-center justify-center text-ink-700 hover:border-clay-600 hover:text-clay-700 shadow-sm opacity-0 group-hover/slider:opacity-100 transition-opacity"
          >
            ‹
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="다음"
            className="hidden md:flex absolute -right-5 top-[34%] z-10 w-10 h-10 rounded-full border border-ink-700/25 bg-cream-50 items-center justify-center text-ink-700 hover:border-clay-600 hover:text-clay-700 shadow-sm opacity-0 group-hover/slider:opacity-100 transition-opacity"
          >
            ›
          </button>

          <div
            key={cur.key}
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory animate-[fadeUp_0.35s_ease]"
            style={{ scrollbarWidth: 'thin' }}
          >
            {cur.videos.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActive(v)}
                className="group flex-none w-[260px] md:w-[300px] snap-start text-left flex flex-col"
              >
                <div className="aspect-video rounded-sm border border-ink-700/15 overflow-hidden relative bg-ink-900 group-hover:border-clay-500 group-hover:shadow-[0_12px_28px_-12px_rgba(110,55,16,0.35)] transition-all duration-300">
                  <img
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {(v.ep || v.views) && (
                    <span className="absolute top-2 left-2 font-mono text-[10px] tracking-[0.08em] px-2 py-0.5 rounded-sm bg-ink-900/80 text-cream-50">
                      {v.ep ?? formatViews(v.views!)}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-ink-900/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                        <path d="M5 2 L16 9 L5 16 Z" fill="#FAF7F1" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="mt-3 font-serif text-[14px] md:text-[15px] text-ink-900 leading-snug group-hover:text-clay-700 transition-colors line-clamp-2 min-h-[2.6em]">
                  {v.title}
                </p>
              </button>
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
              <span className="font-serif text-[15px] text-ink-900 truncate pr-4">{active.title}</span>
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
                src={`https://www.youtube.com/embed/${active.id}?autoplay=1&rel=0`}
                title={active.title}
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
