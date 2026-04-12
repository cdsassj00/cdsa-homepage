import { useMemo, useState } from 'react'
import { curriculum, site } from '../data/content'
import { useInquiry } from './InquiryModal'

// Fisher-Yates seeded shuffle so cards reorder on each mount but stay stable during session
function shuffled<T>(arr: T[], seed: number): T[] {
  const out = [...arr]
  let s = seed
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export default function Tracks() {
  // Random seed from current minute so order shifts periodically
  const { openInquiry } = useInquiry()
  const [seed] = useState(() => Math.floor(Date.now() / 60000))
  const cards = useMemo(() => shuffled(curriculum, seed), [seed])

  return (
    <section id="tracks" className="py-28 md:py-36">
      <div className="container-editorial">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="eyebrow">CURRICULUM</span>
            <h2 className="h-display text-[36px] md:text-[56px] mt-5">
              현장에서 바로 쓰는 <br />
              <span className="text-clay-700">AI 교육 과정.</span>
            </h2>
            <p className="mt-5 text-ink-700 text-lg">
              수준별·직군별 맞춤 설계. 공공기관부터 대기업·중견·스타트업까지,
              리터러시·리더십·실무 자동화·바이브 코딩·직무 심화를 아우릅니다.
              모든 과정은 대표가 직접 설계합니다.
            </p>
          </div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-ink-500 uppercase">
            {curriculum.length} CORE COURSES · 커스텀 설계 가능
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-ink-700/10 border border-ink-700/10">
          {cards.map((c, i) => (
            <article
              key={c.code}
              className="bg-cream-50 p-8 md:p-10 hover:bg-cream-100 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-clay-700 uppercase">
                    {c.code}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-ink-500 uppercase border border-ink-700/20 px-2 py-0.5 rounded-full">
                    {c.level}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-clay-600">{c.hours}</span>
              </div>

              <h3 className="font-serif text-[26px] md:text-[30px] text-ink-900 leading-[1.15] mb-4 group-hover:text-clay-800 transition-colors">
                {c.name}
              </h3>
              <p className="text-[15px] text-ink-700 leading-relaxed mb-6">{c.summary}</p>

              <div className="flex items-center justify-between pt-5 border-t border-ink-700/10">
                <span className="text-xs text-ink-500">
                  <span className="text-ink-400">대상 · </span>
                  {c.target}
                </span>
                <a
                  href={site.curriculumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-clay-700 font-medium hover:text-clay-800 underline underline-offset-4"
                >
                  이 과정 문의 →
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center space-y-3">
          <p className="text-sm text-ink-500 mb-4">
            위 과정 외에도 조직·직무에 맞춘 커스텀 커리큘럼을 무한히 설계할 수 있습니다.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#curriculum-sheet"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-ink-900 text-cream-50 text-sm font-medium hover:bg-clay-700 transition-colors"
            >
              커리큘럼 살펴보기 ↓
            </a>
            <button
              onClick={openInquiry}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-ink-700/30 text-ink-800 text-sm hover:border-clay-700 hover:text-clay-700 transition-colors"
            >
              맞춤 설계 의뢰 →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
