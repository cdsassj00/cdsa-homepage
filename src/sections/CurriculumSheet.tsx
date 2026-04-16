import { useEffect, useMemo, useState } from 'react'
import { useInquiry } from './InquiryModal'

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR3K-dvhpsJnq_1QhxCQdRLxQYhnO6ycfW-lvpDNViysYRvb8vtTSfx-ayFYM-8IYPCxEjJ1K-xfq9M/pub?gid=0&single=true&output=csv'

interface Row {
  industry: string
  role: string
  module: string
  topic: string
  description: string
  tools: string
  workflow: string
}

function parseCSV(text: string): Row[] {
  const lines = text.split('\n')
  if (lines.length < 2) return []
  // Handle CSV with possible commas inside quoted fields
  const rows: Row[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    // Simple CSV split (handles quoted commas)
    const vals: string[] = []
    let current = ''
    let inQuote = false
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; continue }
      if (ch === ',' && !inQuote) { vals.push(current.trim()); current = ''; continue }
      current += ch
    }
    vals.push(current.trim())
    if (vals.length < 4) continue
    rows.push({
      industry: vals[0] || '',
      role: vals[1] || '',
      module: vals[2] || '',
      topic: vals[3] || '',
      description: vals[4] || '',
      tools: vals[5] || '',
      workflow: vals[6] || '',
    })
  }
  return rows
}

function unique(rows: Row[], key: keyof Row): string[] {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort()
}

/* ── Tag filter dimensions ── */
const dims = [
  { key: 'industry' as const, label: '산업영역' },
  { key: 'role' as const, label: '직무' },
  { key: 'module' as const, label: '모듈' },
]

/* ── Tool badge colors ── */
function toolColor(t: string): string {
  const tl = t.toLowerCase().trim()
  if (tl.includes('chatgpt')) return 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]'
  if (tl.includes('claude')) return 'bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]'
  if (tl.includes('python') || tl.includes('colab')) return 'bg-[#e3f2fd] text-[#1565c0] border-[#bbdefb]'
  if (tl.includes('excel') || tl.includes('sheets')) return 'bg-[#e8f5e9] text-[#1b5e20] border-[#c8e6c9]'
  if (tl.includes('gemini')) return 'bg-[#e8eaf6] text-[#283593] border-[#c5cae9]'
  if (tl.includes('power')) return 'bg-[#fce4ec] text-[#c62828] border-[#f8bbd0]'
  return 'bg-cream-100 text-ink-600 border-ink-700/10'
}

export default function CurriculumSheet() {
  const { openInquiry } = useInquiry()
  const [data, setData] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')
  const [showCount, setShowCount] = useState(60)

  useEffect(() => {
    fetch(CSV_URL)
      .then((r) => r.text())
      .then((text) => {
        setData(parseCSV(text))
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  const toggle = (key: string, val: string) => {
    setSelected((prev) => {
      const next = { ...prev }
      if (next[key] === val) delete next[key]
      else next[key] = val
      return next
    })
    setShowCount(60)
  }

  const filtered = useMemo(() => {
    let rows = data
    for (const [key, val] of Object.entries(selected)) {
      rows = rows.filter((r) => r[key as keyof Row] === val)
    }
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (r) =>
          r.topic.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tools.toLowerCase().includes(q) ||
          r.module.toLowerCase().includes(q),
      )
    }
    return rows
  }, [data, selected, search])

  // Available values per dimension (cross-filtered)
  const availableValues = useMemo(() => {
    const result: Record<string, Set<string>> = {}
    for (const dim of dims) {
      let rows = data
      for (const [key, val] of Object.entries(selected)) {
        if (key !== dim.key) rows = rows.filter((r) => r[key as keyof Row] === val)
      }
      result[dim.key] = new Set(rows.map((r) => r[dim.key]).filter(Boolean))
    }
    return result
  }, [data, selected])

  const hasFilters = Object.keys(selected).length > 0 || search

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-6 h-6 border-2 border-clay-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-ink-500 font-mono tracking-wider">LOADING CURRICULUM DATA…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center text-sm text-ink-500">
        데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
      </div>
    )
  }

  return (
    <section id="curriculum-sheet" className="py-28 md:py-36 border-y border-ink-700/10">
      <div className="container-editorial">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="eyebrow">CURRICULUM EXPLORER</span>
          <h2 className="h-display text-[36px] md:text-[56px] mt-5">
            <span className="text-clay-700">{data.length.toLocaleString()}</span>개의 실습 모듈.
          </h2>
          <p className="mt-5 text-ink-700 text-[17px] max-w-xl mx-auto leading-relaxed">
            산업·직무·모듈별 태그를 눌러 보세요.
            우리 조직에 맞는 AI 교육 실습 과정이 바로 나타납니다.
          </p>
        </div>

        {/* Tag filter rows */}
        <div className="space-y-4 mb-6">
          {dims.map((dim) => {
            const allValues = unique(data, dim.key)
            const available = availableValues[dim.key]
            const selectedVal = selected[dim.key]
            // For modules (many values), collapse into scrollable row
            const isWide = allValues.length > 12
            return (
              <div key={dim.key}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-ink-500 uppercase">
                    {dim.label}
                  </span>
                  {selectedVal && (
                    <button
                      onClick={() => toggle(dim.key, selectedVal)}
                      className="text-[10px] text-clay-600 hover:text-clay-800 underline"
                    >
                      해제
                    </button>
                  )}
                </div>
                <div className={`flex gap-1.5 ${isWide ? 'flex-nowrap overflow-x-auto pb-2' : 'flex-wrap'}`}
                  style={isWide ? { scrollbarWidth: 'thin' } : undefined}
                >
                  {allValues.map((val) => {
                    const isSelected = selectedVal === val
                    const isAvailable = available.has(val)
                    return (
                      <button
                        key={val}
                        onClick={() => isAvailable && toggle(dim.key, val)}
                        disabled={!isAvailable}
                        className={`px-3 py-1.5 rounded-sm text-[12px] font-medium border transition-all whitespace-nowrap flex-shrink-0 ${
                          isSelected
                            ? 'bg-clay-600 text-cream-50 border-clay-700 shadow-sm'
                            : isAvailable
                            ? 'bg-cream-50 text-ink-700 border-ink-700/15 hover:border-clay-500 hover:text-clay-700 cursor-pointer'
                            : 'bg-cream-100/50 text-ink-300 border-transparent cursor-not-allowed'
                        }`}
                      >
                        {val}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Search + stats bar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[180px] max-w-[360px]">
            <input
              type="text"
              placeholder="주제·설명·도구 검색…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowCount(60) }}
              className="w-full bg-cream-50 border border-ink-700/15 rounded-sm px-3 py-2 text-[13px] text-ink-800 placeholder:text-ink-400 focus:outline-none focus:border-clay-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-800 text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <span className="font-mono text-[11px] tracking-[0.12em] text-ink-500">
            {hasFilters ? (
              <>
                <span className="text-clay-700 font-semibold">{filtered.length}</span>
                <span>개 매칭</span>
                <span className="text-ink-400"> / 전체 {data.length}</span>
              </>
            ) : (
              <>{data.length}개 모듈</>
            )}
          </span>
          {hasFilters && (
            <button
              onClick={() => { setSelected({}); setSearch(''); setShowCount(60) }}
              className="text-[11px] text-clay-600 hover:text-clay-800 underline underline-offset-2"
            >
              전체 초기화
            </button>
          )}
        </div>

        {/* Results */}
        <div className="border border-ink-700/12 rounded-sm bg-cream-50 overflow-hidden">
          <div className="overflow-y-auto max-h-[560px]" style={{ scrollbarWidth: 'thin' }}>
            {filtered.length === 0 ? (
              <div className="px-4 py-12 text-center text-[13px] text-ink-400">
                조건에 맞는 모듈이 없습니다. 필터를 조정해 보세요.
              </div>
            ) : (
              filtered.slice(0, showCount).map((row, i) => (
                <div
                  key={i}
                  className="px-5 py-4 border-b border-ink-700/6 last:border-0 hover:bg-clay-50/30 transition-colors"
                >
                  {/* Row 1: topic + tools */}
                  <div className="flex items-start justify-between gap-4 mb-1.5">
                    <h4 className="font-serif text-[15px] text-ink-900 leading-snug">
                      {row.topic || row.module}
                    </h4>
                    {row.tools && (
                      <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                        {row.tools.split(',').filter(Boolean).map((t, ti) => (
                          <span
                            key={ti}
                            className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-medium border whitespace-nowrap ${toolColor(t)}`}
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Row 2: description */}
                  {row.description && (
                    <p className="text-[13px] text-ink-600 leading-relaxed mb-2">{row.description}</p>
                  )}
                  {/* Row 3: meta tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {row.industry && (
                      <span className="text-[9px] font-mono tracking-wider text-clay-600 bg-clay-50 border border-clay-200 px-1.5 py-0.5 rounded">
                        {row.industry}
                      </span>
                    )}
                    {row.role && (
                      <span className="text-[9px] font-mono tracking-wider text-ink-500 bg-cream-200 border border-cream-300 px-1.5 py-0.5 rounded">
                        {row.role}
                      </span>
                    )}
                    {row.module && row.topic !== row.module && (
                      <span className="text-[9px] font-mono tracking-wider text-ink-400 bg-cream-100 border border-ink-700/8 px-1.5 py-0.5 rounded">
                        {row.module}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load more / pagination info */}
          {filtered.length > showCount && (
            <div className="px-4 py-3 border-t border-ink-700/8 text-center">
              <button
                onClick={() => setShowCount((c) => c + 60)}
                className="text-[12px] text-clay-700 font-medium hover:text-clay-800 underline underline-offset-2"
              >
                {filtered.length - showCount}개 더 보기
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-ink-500">
            구글 시트 원본에서 실시간 동기화
          </p>
          <button
            onClick={openInquiry}
            className="text-sm text-clay-700 font-medium hover:text-clay-800 underline underline-offset-4"
          >
            우리 조직 맞춤 커리큘럼 문의 →
          </button>
        </div>
      </div>
    </section>
  )
}
