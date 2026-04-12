import { useState } from 'react'
import { showcases, site } from '../data/content'

export default function Showcase() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewTitle, setPreviewTitle] = useState('')

  const openPreview = (href: string, title: string) => {
    setPreviewUrl(href)
    setPreviewTitle(title)
  }

  return (
    <section
      id="showcase"
      className="py-28 md:py-36 bg-gradient-to-b from-cream-50 to-cream-100/80 border-y border-ink-700/10"
    >
      <div className="container-editorial">
        <div className="max-w-2xl mb-16">
          <span className="eyebrow">EDTECH SHOWCASE</span>
          <h2 className="h-display text-[36px] md:text-[56px] mt-5">
            협회와 배우면, <br />
            <span className="text-clay-700">이런 것도 만듭니다.</span>
          </h2>
          <p className="mt-5 text-ink-700 text-lg">
            아래 제품들은 전부 협회 전문가들이 바이브 코딩으로 직접 만들었습니다.
            당신도 우리 교육에서 같은 방식을 배웁니다.
          </p>
          <a
            href="https://vivecoding.lovable.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-7 px-7 py-3 rounded-full bg-ink-900 text-cream-50 text-sm font-medium hover:bg-clay-700 transition-colors"
          >
            교육 후 바이브코딩 산출물 보러가기 →
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {showcases.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => openPreview(s.href, s.title)}
              className="group block bg-cream-50 border border-ink-700/15 rounded-sm overflow-hidden hover:border-clay-500 hover:shadow-[0_18px_40px_-20px_rgba(110,55,16,0.3)] transition-all text-left"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-clay-50 via-cream-100 to-cream-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-paper opacity-40" />
                <div className="relative font-serif text-5xl text-clay-700 group-hover:scale-105 transition-transform">
                  {s.title[0]}
                </div>
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.18em] text-clay-700 border border-clay-500 px-2 py-1 rounded-full bg-cream-50">
                  {s.badge}
                </span>
              </div>
              <div className="p-7">
                <h3 className="font-serif text-2xl text-ink-900 mb-1">{s.title}</h3>
                <p className="text-sm text-clay-700 font-medium mb-4">{s.subtitle}</p>
                <p className="text-[14px] text-ink-700 leading-relaxed mb-5">
                  {s.description}
                </p>
                <span className="text-sm text-ink-900 font-medium underline underline-offset-4 group-hover:text-clay-700">
                  체험해보기 →
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* 커리큘럼 빌더 — 모달로 전환 */}
        <div className="mt-16 p-8 bg-cream-50 border border-ink-700/15 rounded-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl text-ink-900 mb-2">
                직접 조립하는 커리큘럼
              </h3>
              <p className="text-sm text-ink-700 max-w-lg">
                드래그 앤 드랍으로 원하는 모듈을 조합해 나만의 교육과정을 설계해보세요.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openPreview(site.builderUrl, '커리큘럼 빌더')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-ink-900 text-cream-50 text-sm font-medium hover:bg-clay-700 transition-colors"
              >
                빌더 체험하기 →
              </button>
              <a
                href={site.builderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-clay-700 hover:text-clay-800 underline underline-offset-4 whitespace-nowrap"
              >
                전체 화면 ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 — iframe으로 사이트 체험 (화면 절반 크기) */}
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
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-700/10 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-serif text-[15px] text-ink-900 truncate">
                  {previewTitle}
                </span>
                <span className="text-[10px] font-mono text-ink-400 tracking-wider truncate hidden md:inline">
                  {previewUrl}
                </span>
              </div>
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
            {/* iframe */}
            <div className="flex-1 bg-white relative">
              <iframe
                src={previewUrl}
                title={previewTitle}
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
