import { useState } from 'react'
import { alleywayProblems, site } from '../data/content'
import { useInquiry } from './InquiryModal'

export default function Alleyway() {
  // 초기 노출: 공공 3 + 민간 3 = 6개. "더 보기" 클릭 시 전체 15개.
  const { openInquiry } = useInquiry()
  const initialCount = 6
  const [expanded, setExpanded] = useState(false)

  // 공공 먼저 3개, 민간 3개를 번갈아 배치한 뒤 나머지(both)를 뒤에
  const publicItems = alleywayProblems.filter((p) => p.sector === 'public')
  const privateItems = alleywayProblems.filter((p) => p.sector === 'private')
  const bothItems = alleywayProblems.filter((p) => p.sector === 'both')

  // 공3 + 민3 교차 배치 → 나머지 공 → 나머지 민 → both
  const interleaved: typeof alleywayProblems = []
  const maxPair = Math.min(3, publicItems.length, privateItems.length)
  for (let i = 0; i < maxPair; i++) {
    interleaved.push(publicItems[i])
    interleaved.push(privateItems[i])
  }
  // 나머지 공공
  for (let i = maxPair; i < publicItems.length; i++) interleaved.push(publicItems[i])
  // 나머지 민간
  for (let i = maxPair; i < privateItems.length; i++) interleaved.push(privateItems[i])
  // 공통
  interleaved.push(...bothItems)

  const visible = expanded ? interleaved : interleaved.slice(0, initialCount)

  const sectorLabel = (sector: string) => {
    if (sector === 'public') return '공공'
    if (sector === 'private') return '민간'
    return '공통'
  }

  const sectorColor = (sector: string) => {
    if (sector === 'public') return 'bg-clay-100 text-clay-800'
    if (sector === 'private') return 'bg-cream-300 text-ink-800'
    return 'bg-cream-200 text-ink-700'
  }

  return (
    <section id="alleyway" className="py-28 md:py-36 bg-cream-100/60 border-y border-ink-700/10">
      <div className="container-editorial">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="eyebrow">THE ALLEYWAY / 골목길의 목록</span>
            <h2 className="h-display text-[36px] md:text-[56px] mt-5">
              우리가 <span className="text-clay-700">실제로 푸는</span> 문제들.
            </h2>
            <p className="mt-5 text-ink-700 text-lg max-w-xl">
              공공기관의 행정 업무부터 기업의 마케팅·영업·HR까지.
              당신 책상 위의 오늘 해치워야 하는 일들. 대부분 한두 시간 안에 끝납니다.
            </p>
          </div>
          <button
            onClick={openInquiry}
            className="text-sm font-medium text-clay-700 hover:text-clay-800 underline underline-offset-4"
          >
            이 문제들을 우리 팀에서 풀고 싶다면 →
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-700/10">
          {visible.map((p, i) => (
            <article
              key={p.n}
              className="bg-cream-50 p-8 hover:bg-cream-100 transition-colors group"
              style={!expanded && i >= initialCount ? { display: 'none' } : undefined}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-4xl text-clay-600 group-hover:text-clay-700 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-[9px] uppercase tracking-[0.16em] font-medium px-2 py-0.5 rounded-full ${sectorColor(
                      p.sector,
                    )}`}
                  >
                    {sectorLabel(p.sector)}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-ink-500 border border-ink-700/20 px-2 py-1 rounded-full">
                  {p.tag}
                </span>
              </div>
              <h3 className="font-serif text-xl text-ink-900 leading-snug mb-3">
                {p.title}
              </h3>
              <p className="text-sm text-ink-500 mb-6 leading-relaxed">{p.detail}</p>
              <div className="flex items-center justify-between text-[11px] text-ink-500">
                <div className="flex gap-2">
                  {p.tools.map((t) => (
                    <span key={t} className="uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-clay-600">⏱ {p.time}</span>
              </div>
            </article>
          ))}
        </div>

        {!expanded && interleaved.length > initialCount && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-ink-700/30 text-ink-800 hover:border-clay-700 hover:text-clay-700 transition-colors text-sm font-medium"
            >
              the more →
            </button>
          </div>
        )}

        {expanded && (
          <p className="mt-10 text-center text-sm text-ink-500">
            이 외에도 수십 개의 골목길 문제들이 있습니다. 새 문제는 계속 추가됩니다.
          </p>
        )}
      </div>
    </section>
  )
}
