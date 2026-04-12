import { useEffect, useMemo, useState } from 'react'
import { useInquiry } from './InquiryModal'

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTO6mzlE4rcNzmmP4wZ5lFx3S3J7Z83OfWZz5L4iuKbqD94Jge-1OS1eKQ2ZzafB2Wa5nwXyV9Edg3d/pub?output=csv'

interface Row {
  level: string
  parent_name: string
  organization_type: string
  industry: string
  job_role: string
  category: string
  name: string
  details: string
  task_example: string
  workflow: string
  difficulty: string
  duration: string
}

function parseCSV(text: string): Row[] {
  const lines = text.split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.trim())
  const rows: Row[] = []
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',')
    if (vals.length < 7) continue
    rows.push({
      level: vals[headers.indexOf('level')]?.trim() || '',
      parent_name: vals[headers.indexOf('parent_name')]?.trim() || '',
      organization_type: vals[headers.indexOf('organization_type')]?.trim() || '',
      industry: vals[headers.indexOf('industry')]?.trim() || '',
      job_role: vals[headers.indexOf('job_role')]?.trim() || '',
      category: vals[headers.indexOf('category')]?.trim() || '',
      name: vals[headers.indexOf('name')]?.trim() || '',
      details: vals[headers.indexOf('details')]?.trim() || '',
      task_example: vals[headers.indexOf('task_example')]?.trim() || '',
      workflow: vals[headers.indexOf('workflow')]?.trim() || '',
      difficulty: vals[headers.indexOf('difficulty')]?.trim() || '',
      duration: vals[headers.indexOf('duration')]?.trim() || '',
    })
  }
  return rows
}

function unique(rows: Row[], key: keyof Row): string[] {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort()
}

export default function CurriculumSheet() {
  const { openInquiry } = useInquiry()
  const [data, setData] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [orgFilter, setOrgFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [search, setSearch] = useState('')

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

  const filtered = useMemo(() => {
    let rows = data
    if (orgFilter) rows = rows.filter((r) => r.organization_type === orgFilter)
    if (industryFilter) rows = rows.filter((r) => r.industry === industryFilter)
    if (roleFilter) rows = rows.filter((r) => r.job_role === roleFilter)
    if (catFilter) rows = rows.filter((r) => r.category === catFilter)
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.details.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q),
      )
    }
    return rows
  }, [data, orgFilter, industryFilter, roleFilter, catFilter, search])

  const selectClass =
    'bg-cream-50 border border-ink-700/15 rounded-sm px-3 py-2 text-[13px] text-ink-800 font-sans focus:outline-none focus:border-clay-500 appearance-none cursor-pointer'

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
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="eyebrow">CURRICULUM DATABASE</span>
            <h2 className="h-display text-[36px] md:text-[56px] mt-5">
              <span className="text-clay-700">{data.length.toLocaleString()}</span>개의 실습 모듈.
            </h2>
            <p className="mt-5 text-ink-700 text-[17px] max-w-xl leading-relaxed">
              조직 유형·산업·직무·카테고리별로 설계된 교육 모듈을 직접 탐색해보세요.
              필터를 조합하면 우리 조직에 맞는 과정을 바로 찾을 수 있습니다.
            </p>
          </div>
          <div className="font-mono text-[11px] tracking-[0.18em] text-ink-500">
            {filtered.length === data.length
              ? `${data.length.toLocaleString()} MODULES`
              : `${filtered.length.toLocaleString()} / ${data.length.toLocaleString()} FILTERED`}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select className={selectClass} value={orgFilter} onChange={(e) => setOrgFilter(e.target.value)}>
            <option value="">조직 유형 전체</option>
            {unique(data, 'organization_type').map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <select className={selectClass} value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
            <option value="">산업 전체</option>
            {unique(data, 'industry').map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <select className={selectClass} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">직무 전체</option>
            {unique(data, 'job_role').map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <select className={selectClass} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="">카테고리 전체</option>
            {unique(data, 'category').map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="과정명·설명 검색…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          {(orgFilter || industryFilter || roleFilter || catFilter || search) && (
            <button
              onClick={() => {
                setOrgFilter('')
                setIndustryFilter('')
                setRoleFilter('')
                setCatFilter('')
                setSearch('')
              }}
              className="text-xs text-clay-700 hover:text-clay-800 underline underline-offset-2"
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* Sheet table */}
        <div className="border border-ink-700/15 rounded-sm overflow-hidden bg-cream-50">
          <div className="overflow-x-auto overflow-y-auto max-h-[520px]" style={{ scrollbarWidth: 'thin' }}>
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-ink-900 text-cream-50">
                  <th className="px-3 py-3 text-[10px] font-mono uppercase tracking-[0.2em] font-medium w-[36px]">#</th>
                  <th className="px-3 py-3 text-[10px] font-mono uppercase tracking-[0.2em] font-medium w-[50px]">유형</th>
                  <th className="px-3 py-3 text-[10px] font-mono uppercase tracking-[0.2em] font-medium w-[70px]">조직</th>
                  <th className="px-3 py-3 text-[10px] font-mono uppercase tracking-[0.2em] font-medium w-[60px]">산업</th>
                  <th className="px-3 py-3 text-[10px] font-mono uppercase tracking-[0.2em] font-medium w-[70px]">카테고리</th>
                  <th className="px-3 py-3 text-[10px] font-mono uppercase tracking-[0.2em] font-medium w-[180px]">모듈명</th>
                  <th className="px-3 py-3 text-[10px] font-mono uppercase tracking-[0.2em] font-medium">워크플로우</th>
                  <th className="px-3 py-3 text-[10px] font-mono uppercase tracking-[0.2em] font-medium w-[50px]">난이도</th>
                  <th className="px-3 py-3 text-[10px] font-mono uppercase tracking-[0.2em] font-medium w-[45px]">시간</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 500).map((row, i) => (
                  <tr
                    key={i}
                    className={`border-t border-ink-700/8 hover:bg-clay-50 transition-colors ${
                      row.level === 'course'
                        ? 'bg-clay-50/40 font-medium'
                        : i % 2 === 0
                        ? 'bg-cream-50'
                        : 'bg-cream-100/50'
                    }`}
                  >
                    <td className="px-3 py-2.5 text-[11px] font-mono text-ink-400">{i + 1}</td>
                    <td className="px-3 py-2.5 text-[11px]">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-medium ${
                          row.level === 'course'
                            ? 'bg-clay-500 text-cream-50'
                            : 'bg-cream-200 text-ink-600'
                        }`}
                      >
                        {row.level === 'course' ? '과정' : '모듈'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-ink-700">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-medium ${
                          row.organization_type === '공공기관'
                            ? 'bg-clay-100 text-clay-800'
                            : row.organization_type === '기업'
                            ? 'bg-cream-300 text-ink-800'
                            : row.organization_type === '스타트업'
                            ? 'bg-moss-500/20 text-moss-600'
                            : 'bg-cream-200 text-ink-700'
                        }`}
                      >
                        {row.organization_type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-ink-700">{row.industry}</td>
                    <td className="px-3 py-2.5 text-[11px] text-ink-500">{row.category}</td>
                    <td className="px-3 py-2.5 text-[12px] text-ink-900 font-serif">{row.name}</td>
                    <td className="px-3 py-2.5 text-[11px] text-ink-600">
                      {row.workflow ? (
                        <span className="text-clay-700">{row.workflow}</span>
                      ) : (
                        <span className="text-ink-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-[10px] font-mono text-clay-600">{row.difficulty}</td>
                    <td className="px-3 py-2.5 text-[10px] font-mono text-ink-500">
                      {row.duration ? `${Math.round(Number(row.duration) / 60)}H` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 500 && (
            <div className="px-4 py-3 border-t border-ink-700/10 text-center text-[11px] font-mono text-ink-500 tracking-wider">
              상위 500개 표시 중 · 필터를 적용하면 더 정확한 결과를 볼 수 있습니다
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-ink-500">
            구글 시트 원본에서 실시간 동기화 · 시트 수정 시 자동 반영
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
