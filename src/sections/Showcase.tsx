import { useState } from 'react'
import { site } from '../data/content'
import { directory, featured } from '../data/showcase'

const totalSites = featured.length + directory.reduce((n, g) => n + g.items.length, 0)

export default function Showcase() {
  const [showAll, setShowAll] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  return (
    <section
      id="showcase"
      className="py-28 md:py-36 bg-gradient-to-b from-cream-50 to-cream-100/80 border-y border-ink-700/10"
    >
      <div className="container-editorial">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="eyebrow">LIVE SHOWCASE · 실제로 작동하는 사이트</span>
            <h2 className="h-display text-[36px] md:text-[56px] mt-5">
              협회와 배우면, <br />
              <span className="text-clay-700">이런 것도 만듭니다.</span>
            </h2>
            <p className="mt-5 text-ink-700 text-lg leading-relaxed">
              아래 사이트는 전부 협회 전문가들이 바이브 코딩으로 직접 만들어 지금도 운영 중인 것들입니다.
              카드를 누르면 실제 사이트가 열립니다. 우리 교육에서 같은 방식을 배웁니다.
            </p>
          </div>
          <div className="text-right">
            <div className="font-serif text-[44px] md:text-[56px] text-clay-700 leading-none">{totalSites}</div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-ink-500 uppercase mt-2">Live sites · 2026.10 접속 확인</div>
          </div>
        </div>

        {/* Featured — real screenshots */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-cream-50 border border-ink-700/15 rounded-sm overflow-hidden hover:border-clay-500 hover:shadow-[0_18px_40px_-20px_rgba(110,55,16,0.3)] transition-all"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ink-900">
                <img
                  src={`/showcase/${s.shot}.webp`}
                  alt={`${s.name} 화면`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
                {s.tag && (
                  <span className="absolute top-3 left-3 text-[10px] tracking-[0.12em] text-clay-800 border border-clay-500/60 px-2 py-0.5 rounded-full bg-cream-50/95">
                    {s.tag}
                  </span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-[20px] text-ink-900 leading-snug group-hover:text-clay-800 transition-colors">
                    {s.name}
                  </h3>
                  <span className="text-ink-400 group-hover:text-clay-700 transition-colors shrink-0">↗</span>
                </div>
                <p className="text-[13.5px] text-ink-700 leading-relaxed mt-2">{s.desc}</p>
                <p className="font-mono text-[10px] text-ink-400 mt-3 truncate">{s.href.replace(/^https?:\/\//, '').replace(/\/$/, '')}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Directory */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-ink-700/30 text-ink-800 text-sm hover:border-clay-700 hover:text-clay-700 transition-colors"
          >
            {showAll ? '목록 접기 ↑' : `작동하는 사이트 ${totalSites}개 모두 보기 ↓`}
          </button>
        </div>

        {showAll && (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ink-700/10 border border-ink-700/10 animate-[fadeUp_0.35s_ease]">
            {directory.map((g) => (
              <div key={g.label} className="bg-cream-50 p-6">
                <div className="font-mono text-[10px] tracking-[0.18em] text-clay-700 uppercase mb-4">
                  {g.label} · {g.items.length}
                </div>
                <ul className="space-y-3">
                  {g.items.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="group block">
                        <span className="block font-serif text-[14.5px] text-ink-900 group-hover:text-clay-700 transition-colors leading-snug">
                          {s.name} <span className="text-ink-400 text-[11px]">↗</span>
                        </span>
                        <span className="block text-[12px] text-ink-500 leading-snug mt-0.5">{s.desc}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Builder band */}
        <div className="mt-16 p-8 bg-cream-50 border border-ink-700/15 rounded-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl text-ink-900 mb-2">직접 조립하는 커리큘럼</h3>
              <p className="text-sm text-ink-700 max-w-lg">
                드래그 앤 드랍으로 원하는 모듈을 조합해 나만의 교육과정을 설계해보세요.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewUrl(site.builderUrl)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-ink-900 text-cream-50 text-sm font-medium hover:bg-clay-700 transition-colors"
              >
                빌더 체험하기 →
              </button>
              <a
                href="https://vivecoding.lovable.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-clay-700 hover:text-clay-800 underline underline-offset-4 whitespace-nowrap"
              >
                수강생 산출물 보기 ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 z-[100] bg-ink-900/75 backdrop-blur-sm flex items-center justify-center p-6 md:p-10"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="bg-cream-50 rounded-sm w-full max-w-5xl overflow-hidden border border-ink-700/20 shadow-2xl flex flex-col"
            style={{ height: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-700/10 shrink-0">
              <span className="font-serif text-[15px] text-ink-900 truncate">커리큘럼 빌더</span>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-clay-700 hover:text-clay-800 underline underline-offset-2"
                >
                  새 탭 ↗
                </a>
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="text-ink-500 hover:text-ink-900 w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-200 transition-colors"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 bg-white relative">
              <iframe
                src={previewUrl}
                title="커리큘럼 빌더"
                className="absolute inset-0 w-full h-full border-0"
                style={{ transform: 'scale(0.85)', transformOrigin: 'top left', width: '117.6%', height: '117.6%' }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
