import { useMemo, useState } from 'react'
import { useInquiry } from './InquiryModal'
import { domainOrder, domains, levels, modules, type Domain, type MatrixModule } from '../data/aiMatrix'

type Level = 1 | 2 | 3 | 4
type Selection = { l: Level; d: Domain } | 'base' | null

const levelOrder: Level[] = [1, 2, 3, 4]

const levelTint: Record<Level, string> = {
  1: 'bg-cream-50',
  2: 'bg-cream-100',
  3: 'bg-clay-50/70',
  4: 'bg-clay-100/50',
}

const gradeLabel = ['', '입문', '기초', '중급', '심화', '프로젝트']

function cellModules(l: Level, d: Domain) {
  return modules.filter((m) => m.l === l && m.d === d)
}

function ModuleCard({ m }: { m: MatrixModule }) {
  return (
    <article className="bg-cream-50 border border-ink-700/10 p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-[10px] tracking-[0.16em] text-clay-700">{m.id}</span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-ink-400">{gradeLabel[m.g]}</span>
      </div>
      <h4 className="font-serif text-[16px] text-ink-900 leading-snug mb-2">{m.name}</h4>
      <p className="text-[13px] text-ink-700 leading-relaxed">{m.desc}</p>
      {m.out && (
        <p className="mt-3 pt-3 border-t border-ink-700/10 text-[12px] text-ink-500">
          <span className="text-clay-700">산출물 · </span>
          {m.out}
        </p>
      )}
    </article>
  )
}

export default function CurriculumMatrix() {
  const { openInquiry } = useInquiry()
  const [sel, setSel] = useState<Selection>(null)

  const baseModules = useMemo(() => modules.filter((m) => m.d === 'O'), [])
  const selected = useMemo(() => {
    if (sel === null) return []
    if (sel === 'base') return baseModules
    return cellModules(sel.l, sel.d)
  }, [sel, baseModules])

  const selTitle =
    sel === null
      ? ''
      : sel === 'base'
        ? '공통 기반 · 모든 단계의 바탕'
        : `L${sel.l} ${levels[sel.l].name} × ${domains[sel.d].name}`

  const toggle = (next: Selection) =>
    setSel((cur) => {
      if (cur === next) return null
      if (cur && next && cur !== 'base' && next !== 'base' && cur.l === next.l && cur.d === next.d) return null
      return next
    })

  const isSel = (l: Level, d: Domain) => sel !== null && sel !== 'base' && sel.l === l && sel.d === d

  return (
    <section id="curriculum" className="py-28 md:py-36 border-y border-ink-700/10">
      <div className="container-editorial">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="eyebrow">CURRICULUM · AI 활용 매트릭스</span>
            <h2 className="h-display text-[34px] md:text-[54px] mt-5 leading-[1.12]">
              우리 조직은 지금 <br />
              <span className="text-clay-700">어느 칸에 있습니까?</span>
            </h2>
            <p className="mt-5 text-ink-700 text-lg leading-relaxed">
              AI를 쓰는 방법 네 단계와 업무 영역 다섯 가지. CDSA의 모든 과정은 이 표 위에서 설계합니다.
              칸을 눌러 실습 모듈을 확인해 보세요.
            </p>
          </div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-ink-500 uppercase">
            {modules.length} MODULES · 4 LEVELS · 5 DOMAINS
          </div>
        </div>

        {/* Matrix */}
        <p className="md:hidden mb-3 font-mono text-[10px] tracking-[0.16em] text-ink-400">← 표를 옆으로 밀어 보세요 →</p>
        <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0" style={{ scrollbarWidth: 'thin' }}>
          <div className="min-w-[780px] border border-ink-700/15">
            {/* Column headers */}
            <div className="grid grid-cols-[190px_repeat(5,1fr)] border-b border-ink-800 bg-ink-800">
              <div className="p-4 flex flex-col justify-end">
                <span className="font-mono text-[9px] tracking-[0.18em] text-clay-300 uppercase">업무 영역 →</span>
                <span className="font-mono text-[9px] tracking-[0.18em] text-clay-300 uppercase mt-1">↓ AI 활용 방법</span>
              </div>
              {domainOrder.map((d) => (
                <div key={d} className="p-4 border-l border-cream-50/10">
                  <div className="font-serif text-[15px] text-cream-50 leading-tight">{domains[d].name}</div>
                  <div className="text-[11px] text-cream-200/60 mt-1 leading-snug">{domains[d].desc}</div>
                </div>
              ))}
            </div>

            {/* Rows */}
            {levelOrder.map((l) => (
              <div key={l} className="grid grid-cols-[190px_repeat(5,1fr)] border-b border-ink-700/10 last:border-b-0">
                <div className={`p-4 ${levelTint[l]}`}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[12px] font-semibold tracking-[0.12em] text-clay-700">L{l}</span>
                    <span className="font-serif text-[18px] text-ink-900">{levels[l].name}</span>
                  </div>
                  <p className="text-[12px] text-ink-600 mt-1.5 leading-snug">{levels[l].tagline}</p>
                </div>
                {domainOrder.map((d) => {
                  const ms = cellModules(l, d)
                  const active = isSel(l, d)
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => ms.length && toggle({ l, d })}
                      disabled={!ms.length}
                      aria-pressed={active}
                      className={`text-left p-4 border-l border-ink-700/10 transition-colors ${
                        active
                          ? 'bg-clay-800 text-cream-50'
                          : ms.length
                            ? `${levelTint[l]} hover:bg-cream-200/70 cursor-pointer`
                            : `${levelTint[l]} cursor-default`
                      }`}
                    >
                      <div className={`font-mono text-[11px] tracking-[0.12em] mb-2 ${active ? 'text-clay-300' : 'text-clay-700'}`}>
                        {String(ms.length).padStart(2, '0')}
                      </div>
                      <ul className="space-y-1">
                        {ms.slice(0, 3).map((m) => (
                          <li key={m.id} className={`text-[12.5px] leading-snug ${active ? 'text-cream-50' : 'text-ink-700'}`}>
                            {m.short}
                          </li>
                        ))}
                        {ms.length > 3 && (
                          <li className={`text-[11px] ${active ? 'text-cream-200' : 'text-ink-400'}`}>+{ms.length - 3}개 더</li>
                        )}
                      </ul>
                    </button>
                  )
                })}
              </div>
            ))}

            {/* Base strip */}
            <button
              type="button"
              onClick={() => toggle('base')}
              aria-pressed={sel === 'base'}
              className={`w-full text-left grid grid-cols-[190px_1fr] border-t border-ink-700/15 transition-colors ${
                sel === 'base' ? 'bg-clay-800 text-cream-50' : 'bg-cream-100/60 hover:bg-cream-200/70'
              }`}
            >
              <div className="p-4">
                <span className={`font-mono text-[11px] tracking-[0.12em] ${sel === 'base' ? 'text-clay-300' : 'text-clay-700'}`}>
                  BASE · {String(baseModules.length).padStart(2, '0')}
                </span>
                <div className="font-serif text-[16px] mt-1">공통 기반</div>
              </div>
              <div className="p-4 flex flex-wrap gap-1.5 items-center">
                {baseModules.map((m) => (
                  <span
                    key={m.id}
                    className={`text-[11.5px] px-2.5 py-1 rounded-full border ${
                      sel === 'base' ? 'border-cream-50/30 text-cream-100' : 'border-ink-700/15 text-ink-700 bg-cream-50'
                    }`}
                  >
                    {m.short}
                  </span>
                ))}
              </div>
            </button>
          </div>
        </div>

        {/* Detail */}
        {sel === null ? (
          <p className="mt-5 text-[13px] text-ink-500">
            L1은 대화창 안에서, L4는 조직에 시스템을 심는 단계입니다. 아래로 내려갈수록 AI가 일하는 범위가 넓어집니다.
          </p>
        ) : (
          <div className="mt-8 border border-ink-700/10 bg-cream-100/50 p-6 md:p-8 animate-[fadeUp_0.3s_ease]">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-clay-700 uppercase">
                  {selected.length} MODULES
                </span>
                <h3 className="font-serif text-[22px] md:text-[26px] text-ink-900 mt-2">{selTitle}</h3>
                {sel !== 'base' && <p className="text-[13px] text-ink-600 mt-2 max-w-3xl">{levels[sel.l].tools}</p>}
              </div>
              <button
                type="button"
                onClick={() => setSel(null)}
                className="shrink-0 text-[12px] text-ink-500 hover:text-clay-700 underline underline-offset-4"
              >
                닫기
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {selected.map((m) => (
                <ModuleCard key={m.id} m={m} />
              ))}
            </div>
            <div className="mt-6 text-right">
              <button
                type="button"
                onClick={() =>
                  openInquiry(`[${selTitle}] 단계 교육 문의드립니다.\n\n교육 대상:\n예상 인원:\n희망 시기:\n`)
                }
                className="text-sm text-clay-700 font-medium hover:text-clay-800 underline underline-offset-4"
              >
                이 칸으로 교육 설계 문의 →
              </button>
            </div>
          </div>
        )}

        {/* Paths */}
        <div className="mt-14 grid md:grid-cols-2 gap-px bg-ink-700/10 border border-ink-700/10">
          <a href="/fullcourse.html" className="group bg-cream-50 hover:bg-cream-100 transition-colors p-8 md:p-10">
            <span className="font-mono text-[10px] tracking-[0.2em] text-clay-700 uppercase">8 WEEKS · FULL COURSE</span>
            <h3 className="font-serif text-[22px] md:text-[26px] text-ink-900 mt-3 leading-snug group-hover:text-clay-800 transition-colors">
              기획하는 리더를 위한 8주 AI 실전 여정
            </h3>
            <p className="text-[14px] text-ink-700 mt-3 leading-relaxed">
              L1 대화형에서 L4 구축형까지, 8회차로 한 번에 올라가는 대표 과정입니다.
            </p>
            <span className="inline-block mt-5 text-sm text-clay-700 font-medium underline underline-offset-4">과정 자세히 보기 →</span>
          </a>
          <a href="/modules" className="group bg-cream-50 hover:bg-cream-100 transition-colors p-8 md:p-10">
            <span className="font-mono text-[10px] tracking-[0.2em] text-clay-700 uppercase">MODULE EXPLORER</span>
            <h3 className="font-serif text-[22px] md:text-[26px] text-ink-900 mt-3 leading-snug group-hover:text-clay-800 transition-colors">
              실습모듈 다양하게 살펴보기
            </h3>
            <p className="text-[14px] text-ink-700 mt-3 leading-relaxed">
              산업·직무·주제별로 분류한 실습 모듈을 태그와 검색으로 찾아볼 수 있습니다.
            </p>
            <span className="inline-block mt-5 text-sm text-clay-700 font-medium underline underline-offset-4">모듈 탐색기 열기 →</span>
          </a>
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => openInquiry()}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-ink-900 text-cream-50 text-sm font-medium hover:bg-clay-700 transition-colors"
          >
            우리 조직 맞춤 설계 의뢰 →
          </button>
        </div>
      </div>
    </section>
  )
}
