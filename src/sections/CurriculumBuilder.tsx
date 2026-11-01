import { useDeferredValue, useEffect, useMemo, useState, type DragEvent } from 'react'
import { useInquiry } from './InquiryModal'
import { loadLibrary, type Grade, type LibraryModule, type ModuleLibrary } from '../data/moduleLibrary'

type Sector = 'pub' | 'biz'

const STORE_KEY = 'cdsa-builder-v1'
const MAX_DAYS = 5

const gradeInfo: Record<Grade, { label: string; dot: string }> = {
  g: { label: '그린 · 기초', dot: 'bg-moss-500' },
  b: { label: '블루 · 응용', dot: 'bg-[#3F6C8C]' },
  k: { label: '블랙 · 심화', dot: 'bg-ink-900' },
}

const presets: { name: string; desc: string; days: string[][] }[] = [
  {
    name: 'AI 실무 입문',
    desc: '1일 · 모듈 4개',
    days: [['C-O1', 'C-D1', 'C-R1', 'C-O6']],
  },
  {
    name: '문서·데이터 업무 실습',
    desc: '2일 · 모듈 8개',
    days: [
      ['C-O2', 'C-D1', 'C-D8', 'C-R7'],
      ['C-A1', 'C-A8', 'C-D7', 'C-D5'],
    ],
  },
  {
    name: '업무 도구 직접 만들기',
    desc: '3일 · 모듈 10개',
    days: [
      ['V-VC1', 'V-VC7', 'V-VC3'],
      ['V-VG1', 'V-VG3', 'V-VG2'],
      ['V-VO2', 'V-VK1', 'V-VK3', 'V-VO7'],
    ],
  },
]

function loadSaved(): string[][] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) ?? 'null')
    if (Array.isArray(saved) && saved.length && saved.every(Array.isArray)) return saved
  } catch {
    // 저장 공간을 못 쓰면 빈 구성으로 시작한다.
  }
  return [[]]
}

function GradeTag({ g, inner }: { g: Grade; inner?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-500">
      <span className={`w-1.5 h-1.5 rounded-full ${gradeInfo[g].dot}`} />
      {gradeInfo[g].label}
      {inner && <span className="ml-1 text-clay-700">내부망 대안</span>}
    </span>
  )
}

function ModuleCard({
  m,
  sector,
  terms,
  added,
  open,
  parentName,
  onAdd,
  onToggle,
}: {
  m: LibraryModule
  sector: Sector
  terms: string[]
  added: boolean
  open: boolean
  parentName?: string
  onAdd: () => void
  onToggle: () => void
}) {
  const usages = m[sector]
  // 검색어가 들어 있는 활용 예시를 앞세운다.
  const hit = terms.length
    ? usages.find((u) => terms.some((t) => `${u[0]} ${u[1]}`.toLowerCase().includes(t)))
    : undefined
  const sample = hit ?? usages[0]

  return (
    <article
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', m.id)}
      className={`bg-cream-50 border transition-colors ${
        added ? 'border-clay-600' : 'border-ink-700/15 hover:border-ink-700/30'
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] tracking-[0.1em] text-clay-700">{m.id}</span>
            <GradeTag g={m.g} inner={m.inner} />
          </div>
          <h4 className="font-serif text-[16px] text-ink-900 leading-snug mt-1.5">{m.name}</h4>
          <p className={`text-[13px] text-ink-700 leading-relaxed mt-1.5 ${open ? '' : 'line-clamp-2'}`}>{m.desc}</p>
          {sample && !open && (
            <p className="text-[12px] text-ink-500 leading-snug mt-2 line-clamp-1">
              <span className="text-clay-700">{hit ? '업무 예시 · ' : '예 · '}</span>
              {sample[0]}
            </p>
          )}
        </button>
        <button
          type="button"
          onClick={onAdd}
          aria-pressed={added}
          className={`shrink-0 h-9 px-3.5 rounded-full text-[12.5px] font-medium border transition-colors ${
            added
              ? 'bg-clay-800 border-clay-800 text-cream-50'
              : 'bg-transparent border-ink-700/30 text-ink-800 hover:border-clay-700 hover:text-clay-700'
          }`}
        >
          {added ? '담김' : '담기'}
        </button>
      </div>

      {open && (
        <div className="px-4 pb-5 pt-4 border-t border-ink-700/10 grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-[12px] font-semibold text-ink-800 mb-2">직접 해볼 일</div>
            <ul className="space-y-1.5">
              {m.tasks.map((t) => (
                <li key={t} className="text-[13px] text-ink-700 leading-relaxed pl-3.5 relative">
                  <span className="absolute left-0 top-[0.72em] w-1.5 h-px bg-clay-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-5">
            <div>
              <div className="text-[12px] font-semibold text-ink-800 mb-2">이런 업무에 쓸 수 있습니다</div>
              <ul className="space-y-2.5">
                {usages.map((u) => (
                  <li key={u[1]} className="text-[13px] leading-relaxed">
                    <span className="block text-[12px] text-clay-700">{u[0]}</span>
                    <span className="text-ink-700">{u[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-ink-800 mb-1">완성할 결과물</div>
              <p className="text-[13px] text-ink-700 leading-relaxed">{m.out}</p>
            </div>
            {m.tools && (
              <div>
                <div className="text-[12px] font-semibold text-ink-800 mb-1">쓰는 도구 예시</div>
                <p className="text-[13px] text-ink-700 leading-relaxed">{m.tools}</p>
              </div>
            )}
            {parentName && (
              <p className="text-[12px] text-ink-500">
                {parentName}({m.parent})에서 따로 떼어낸 세부 실습입니다.
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

export default function CurriculumBuilder({ onClose }: { onClose?: () => void }) {
  const { openInquiry } = useInquiry()
  const [lib, setLib] = useState<ModuleLibrary | null>(null)
  const [failed, setFailed] = useState(false)

  const [days, setDays] = useState<string[][]>(loadSaved)
  const [activeDay, setActiveDay] = useState(0)

  const [theme, setTheme] = useState<number | null>(null)
  const [grade, setGrade] = useState<Grade | null>(null)
  const [innerOnly, setInnerOnly] = useState(false)
  const [sector, setSector] = useState<Sector>('pub')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<'pick' | 'plan'>('pick')
  const [copied, setCopied] = useState(false)

  const deferredQuery = useDeferredValue(query)

  const fetchLibrary = () => {
    setFailed(false)
    loadLibrary().then(setLib).catch(() => setFailed(true))
  }
  useEffect(fetchLibrary, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(days))
    } catch {
      // 저장 공간을 못 써도 빌더는 그대로 동작한다.
    }
  }, [days])

  const byId = useMemo(() => new Map(lib?.modules.map((m) => [m.id, m])), [lib])
  const picked = useMemo(() => days.flat().filter((id) => byId.has(id)), [days, byId])
  const pickedSet = useMemo(() => new Set(picked), [picked])

  const terms = useMemo(() => deferredQuery.toLowerCase().split(/\s+/).filter(Boolean), [deferredQuery])

  // 대주제를 뺀 조건으로 먼저 거른다. 왼쪽 숫자가 검색 결과를 따라가게 하기 위해서다.
  const matched = useMemo(
    () =>
      (lib?.modules ?? []).filter(
        (m) =>
          (!grade || m.g === grade) &&
          (!innerOnly || m.inner) &&
          terms.every((t) => m.blob.includes(t)),
      ),
    [lib, grade, innerOnly, terms],
  )
  const themeCounts = useMemo(() => {
    const counts: number[] = []
    for (const m of matched) counts[m.t] = (counts[m.t] ?? 0) + 1
    return counts
  }, [matched])
  const visible = theme === null ? matched : matched.filter((m) => m.t === theme)

  const toggleModule = (id: string) => {
    setDays((cur) =>
      cur.flat().includes(id)
        ? cur.map((d) => d.filter((x) => x !== id))
        : cur.map((d, i) => (i === Math.min(activeDay, cur.length - 1) ? [...d, id] : d)),
    )
  }

  const moveModule = (id: string, dir: -1 | 1) => {
    setDays((cur) => {
      const next = cur.map((d) => [...d])
      const dayIdx = next.findIndex((d) => d.includes(id))
      const at = next[dayIdx].indexOf(id)
      const to = at + dir
      if (to >= 0 && to < next[dayIdx].length) {
        next[dayIdx].splice(at, 1)
        next[dayIdx].splice(to, 0, id)
      } else if (next[dayIdx + dir]) {
        // 일차의 끝에서 더 밀면 옆 일차로 넘어간다.
        next[dayIdx].splice(at, 1)
        if (dir < 0) next[dayIdx + dir].push(id)
        else next[dayIdx + dir].unshift(id)
      }
      return next
    })
  }

  const dropModule = (e: DragEvent, dayIdx: number, beforeId?: string) => {
    e.preventDefault()
    e.stopPropagation()
    const id = e.dataTransfer.getData('text/plain')
    if (!byId.has(id) || id === beforeId) return
    setDays((cur) => {
      const next = cur.map((d) => d.filter((x) => x !== id))
      const at = beforeId ? next[dayIdx].indexOf(beforeId) : -1
      next[dayIdx].splice(at < 0 ? next[dayIdx].length : at, 0, id)
      return next
    })
  }

  const setDayCount = (count: number) => {
    setDays((cur) => {
      if (count > cur.length) return [...cur, ...Array.from({ length: count - cur.length }, () => [])]
      // 줄어드는 일차의 모듈은 마지막 일차로 옮긴다.
      const kept = cur.slice(0, count).map((d) => [...d])
      kept[count - 1].push(...cur.slice(count).flat())
      return kept
    })
    setActiveDay((d) => Math.min(d, count - 1))
  }

  const applyPreset = (preset: string[][]) => {
    setDays(preset.map((d) => [...d]))
    setActiveDay(0)
  }

  const clearAll = () => {
    setDays([[]])
    setActiveDay(0)
  }

  const planText = () => {
    const lines = [`CDSA 커리큘럼 구성안 · ${days.length}일 · 모듈 ${picked.length}개`, '']
    days.forEach((d, i) => {
      lines.push(`${i + 1}일차`)
      for (const id of d) {
        const m = byId.get(id)
        if (m) lines.push(`- ${m.name} (${id}) → ${m.out}`)
      }
      lines.push('')
    })
    return lines.join('\n')
  }

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(planText())
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const resetFilters = () => {
    setQuery('')
    setGrade(null)
    setInnerOnly(false)
    setTheme(null)
  }

  const planPanel = (
    <div className="flex flex-col h-full min-h-0 bg-cream-100/70">
      <div className="px-5 pt-4 pb-3 border-b border-ink-700/10 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-[18px] text-ink-900 leading-none">내 커리큘럼</h3>
            <p className="text-[12px] text-ink-500 mt-1.5">모듈 {picked.length}개</p>
          </div>
          <div className="flex items-center gap-1" role="group" aria-label="교육 일수">
            <button
              type="button"
              onClick={() => setDayCount(days.length - 1)}
              disabled={days.length <= 1}
              aria-label="일수 줄이기"
              className="w-8 h-8 rounded-full border border-ink-700/20 text-ink-700 disabled:opacity-30 hover:border-clay-700"
            >
              −
            </button>
            <span className="w-11 text-center text-[13.5px] text-ink-900 font-medium">{days.length}일</span>
            <button
              type="button"
              onClick={() => setDayCount(days.length + 1)}
              disabled={days.length >= MAX_DAYS}
              aria-label="일수 늘리기"
              className="w-8 h-8 rounded-full border border-ink-700/20 text-ink-700 disabled:opacity-30 hover:border-clay-700"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
        {picked.length === 0 && (
          <div className="pb-1">
            <p className="text-[13.5px] text-ink-700 leading-relaxed">
              왼쪽에서 모듈을 담아 보세요. 막막하다면 아래 구성에서 시작해 빼고 더하면 됩니다.
            </p>
            <div className="mt-3 space-y-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p.days)}
                  className="w-full text-left bg-cream-50 border border-ink-700/15 hover:border-clay-600 px-4 py-3 transition-colors"
                >
                  <span className="block font-serif text-[15px] text-ink-900">{p.name}</span>
                  <span className="block text-[12px] text-ink-500 mt-0.5">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {days.map((d, i) => {
          const active = i === activeDay
          return (
            <section
              key={i}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => dropModule(e, i)}
              className={`border transition-colors ${active ? 'border-clay-600 bg-cream-50' : 'border-ink-700/15 bg-cream-50/60'}`}
            >
              <button
                type="button"
                onClick={() => setActiveDay(i)}
                aria-pressed={active}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-left"
              >
                <span className={`text-[13.5px] font-semibold ${active ? 'text-clay-800' : 'text-ink-700'}`}>
                  {i + 1}일차
                </span>
                <span className="text-[11.5px] text-ink-500">
                  {active ? '여기에 담깁니다' : `${d.length}개`}
                </span>
              </button>
              {d.length > 0 && (
                <ol className="border-t border-ink-700/10 divide-y divide-ink-700/10">
                  {d.map((id) => {
                    const m = byId.get(id)
                    if (!m) return null
                    return (
                      <li
                        key={id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => dropModule(e, i, id)}
                        className="flex items-center gap-1 pl-3.5 pr-1.5 py-2 cursor-grab active:cursor-grabbing"
                      >
                        <span className="flex-1 min-w-0 text-[13px] text-ink-800 leading-snug">{m.name}</span>
                        <button
                          type="button"
                          onClick={() => moveModule(id, -1)}
                          aria-label={`${m.name} 위로`}
                          className="w-7 h-7 shrink-0 text-ink-400 hover:text-clay-700"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveModule(id, 1)}
                          aria-label={`${m.name} 아래로`}
                          className="w-7 h-7 shrink-0 text-ink-400 hover:text-clay-700"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleModule(id)}
                          aria-label={`${m.name} 빼기`}
                          className="w-7 h-7 shrink-0 text-ink-400 hover:text-clay-700"
                        >
                          ✕
                        </button>
                      </li>
                    )
                  })}
                </ol>
              )}
            </section>
          )
        })}
      </div>

      <div className="px-5 py-4 border-t border-ink-700/10 bg-cream-50 shrink-0">
        <button
          type="button"
          disabled={picked.length === 0}
          onClick={() => openInquiry(`${planText()}\n교육 대상:\n예상 인원:\n희망 시기:\n`)}
          className="w-full h-11 rounded-full bg-ink-900 text-cream-50 text-[14px] font-medium hover:bg-clay-700 transition-colors disabled:bg-ink-700/25 disabled:text-ink-500"
        >
          이 구성으로 교육 문의 →
        </button>
        <div className="flex items-center justify-center gap-5 mt-2.5">
          <button
            type="button"
            onClick={copyPlan}
            disabled={picked.length === 0}
            className="text-[12.5px] text-ink-600 underline underline-offset-4 hover:text-clay-700 disabled:opacity-40"
          >
            {copied ? '복사했습니다' : '구성안 복사'}
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={picked.length === 0}
            className="text-[12.5px] text-ink-600 underline underline-offset-4 hover:text-clay-700 disabled:opacity-40"
          >
            모두 비우기
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full min-h-0 bg-cream-50 text-ink-900">
      {/* Header */}
      <header className="shrink-0 border-b border-ink-700/10 px-4 md:px-5 py-3 flex items-center gap-3 md:gap-5 flex-wrap">
        <div className="shrink-0">
          <h2 className="font-serif text-[19px] leading-none">커리큘럼 빌더</h2>
          <p className="hidden md:block text-[12px] text-ink-500 mt-1.5">
            내 업무로 찾아서 담고, 일차별로 놓으면 과정이 됩니다
          </p>
        </div>
        <div className="order-last md:order-none w-full md:w-auto md:flex-1 md:max-w-md relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="업무로 찾기 · 민원, 예산, 회의록, 엑셀 취합"
            aria-label="모듈 검색"
            className="w-full h-10 px-4 rounded-full bg-cream-100 border border-ink-700/15 text-[14px] placeholder:text-ink-400 focus:outline-none focus:border-clay-600"
          />
        </div>
        <div className="flex rounded-full border border-ink-700/20 p-0.5 ml-auto" role="group" aria-label="활용 분야">
          {(
            [
              ['pub', '행정·공공'],
              ['biz', '민간'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSector(key)}
              aria-pressed={sector === key}
              className={`px-3 h-8 rounded-full text-[12.5px] transition-colors ${
                sector === key ? 'bg-ink-800 text-cream-50' : 'text-ink-700 hover:text-clay-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="w-9 h-9 shrink-0 rounded-full text-ink-500 hover:text-ink-900 hover:bg-cream-200 transition-colors"
          >
            ✕
          </button>
        )}
      </header>

      {/* Mobile tabs */}
      <div className="lg:hidden shrink-0 grid grid-cols-2 border-b border-ink-700/10" role="tablist">
        {(
          [
            ['pick', '모듈 고르기'],
            ['plan', `내 커리큘럼 ${picked.length}`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mobileView === key}
            onClick={() => setMobileView(key)}
            className={`h-11 text-[13.5px] border-b-2 ${
              mobileView === key ? 'border-clay-700 text-ink-900 font-medium' : 'border-transparent text-ink-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Themes — 데스크톱 */}
        <nav className="hidden lg:block w-[208px] shrink-0 overflow-y-auto border-r border-ink-700/10 py-3 px-2" style={{ scrollbarWidth: 'thin' }}>
          <button
            type="button"
            onClick={() => setTheme(null)}
            aria-pressed={theme === null}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-[13.5px] rounded-sm transition-colors ${
              theme === null ? 'bg-ink-800 text-cream-50' : 'text-ink-700 hover:bg-cream-200/70'
            }`}
          >
            전체
            <span className="font-mono text-[11px] opacity-70">{matched.length}</span>
          </button>
          {lib?.themes.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setTheme(i)}
              aria-pressed={theme === i}
              title={t.desc}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-[13.5px] leading-snug rounded-sm transition-colors ${
                theme === i ? 'bg-ink-800 text-cream-50' : 'text-ink-700 hover:bg-cream-200/70'
              }`}
            >
              {t.name}
              <span className="font-mono text-[11px] opacity-70">{themeCounts[i] ?? 0}</span>
            </button>
          ))}
        </nav>

        {/* Modules */}
        <main className={`flex-1 min-w-0 flex-col ${mobileView === 'pick' ? 'flex' : 'hidden'} lg:flex`}>
          {/* Themes — 모바일 */}
          <div className="lg:hidden shrink-0 flex gap-1.5 overflow-x-auto px-4 pt-3" style={{ scrollbarWidth: 'none' }}>
            {[{ name: '전체', i: null as number | null }, ...(lib?.themes ?? []).map((t, i) => ({ name: t.name, i }))].map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setTheme(t.i)}
                aria-pressed={theme === t.i}
                className={`shrink-0 h-8 px-3 rounded-full text-[12.5px] border ${
                  theme === t.i ? 'bg-ink-800 border-ink-800 text-cream-50' : 'border-ink-700/20 text-ink-700'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="shrink-0 px-4 md:px-5 py-2.5 flex items-center gap-2 flex-wrap">
            {(['g', 'b', 'k'] as Grade[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade((cur) => (cur === g ? null : g))}
                aria-pressed={grade === g}
                className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] border transition-colors ${
                  grade === g ? 'border-clay-700 bg-clay-50 text-clay-800' : 'border-ink-700/15 text-ink-700 hover:border-ink-700/40'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${gradeInfo[g].dot}`} />
                {gradeInfo[g].label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setInnerOnly((v) => !v)}
              aria-pressed={innerOnly}
              className={`h-8 px-3 rounded-full text-[12.5px] border transition-colors ${
                innerOnly ? 'border-clay-700 bg-clay-50 text-clay-800' : 'border-ink-700/15 text-ink-700 hover:border-ink-700/40'
              }`}
            >
              내부망 대안 있음
            </button>
            <span className="ml-auto text-[12.5px] text-ink-500">{visible.length}개</span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-5 pb-5" style={{ scrollbarWidth: 'thin' }}>
            {failed ? (
              <div className="py-16 text-center">
                <p className="text-[14px] text-ink-700">모듈을 불러오지 못했습니다.</p>
                <button type="button" onClick={fetchLibrary} className="mt-3 text-[13.5px] text-clay-700 underline underline-offset-4">
                  다시 시도
                </button>
              </div>
            ) : !lib ? (
              <p className="py-16 text-center text-[14px] text-ink-500">모듈을 펼치는 중입니다</p>
            ) : visible.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-[14px] text-ink-700">조건에 맞는 모듈이 없습니다.</p>
                <button type="button" onClick={resetFilters} className="mt-3 text-[13.5px] text-clay-700 underline underline-offset-4">
                  조건 지우기
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {visible.map((m) => (
                  <ModuleCard
                    key={m.id}
                    m={m}
                    sector={sector}
                    terms={terms}
                    added={pickedSet.has(m.id)}
                    open={openId === m.id}
                    parentName={m.parent ? byId.get(m.parent)?.name : undefined}
                    onAdd={() => toggleModule(m.id)}
                    onToggle={() => setOpenId((cur) => (cur === m.id ? null : m.id))}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Plan */}
        <aside className={`w-full lg:w-[340px] shrink-0 lg:border-l border-ink-700/10 min-h-0 ${mobileView === 'plan' ? 'block' : 'hidden'} lg:block`}>
          {planPanel}
        </aside>
      </div>
    </div>
  )
}
