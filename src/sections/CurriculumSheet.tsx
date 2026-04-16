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
      difficulty: vals[headers.indexOf('difficulty')]?.trim() || '',
      duration: vals[headers.indexOf('duration')]?.trim() || '',
    })
  }
  return rows
}

function unique(rows: Row[], key: keyof Row): string[] {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort()
}

/* ── Tag badge component ── */
const orgColors: Record<string, string> = {
  '공공기관': 'bg-clay-100 text-clay-800 border-clay-200',
  '기업': 'bg-cream-200 text-ink-800 border-cream-300',
  '중소기업': 'bg-cream-200 text-ink-700 border-cream-300',
  '스타트업': 'bg-[#e8f0e0] text-moss-600 border-[#c8d8b8]',
}

function Badge({ label, variant }: { label: string; variant?: string }) {
  const cls = variant || 'bg-cream-100 text-ink-600 border-ink-700/10'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${cls}`}>
      {label}
    </span>
  )
}

/* ── Course group: a course + its module count ── */
interface CourseGroup {
  course: Row
  moduleCount: number
  modules: Row[]
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
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

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

  // Build course groups
  const { courses, totalModules } = useMemo(() => {
    const groups: CourseGroup[] = []
    let currentCourse: Row | null = null
    let currentModules: Row[] = []

    for (const row of data) {
      if (row.level === 'course') {
        if (currentCourse) {
          groups.push({ course: currentCourse, moduleCount: currentModules.length, modules: currentModules })
        }
        currentCourse = row
        currentModules = []
      } else {
        currentModules.push(row)
      }
    }
    if (currentCourse) {
      groups.push({ course: currentCourse, moduleCount: currentModules.length, modules: currentModules })
    }

    // If no course-level rows, treat every row as a course
    if (groups.length === 0 && data.length > 0) {
      return {
        courses: data.map((r) => ({ course: r, moduleCount: 0, modules: [] })),
        totalModules: 0,
      }
    }

    return {
      courses: groups,
      totalModules: groups.reduce((sum, g) => sum + g.moduleCount, 0),
    }
  }, [data])

  // Apply filters to courses
  const filtered = useMemo(() => {
    let groups = courses
    if (orgFilter) groups = groups.filter((g) => g.course.organization_type === orgFilter)
    if (industryFilter) groups = groups.filter((g) => g.course.industry === industryFilter)
    if (roleFilter) groups = groups.filter((g) => g.course.job_role === roleFilter)
    if (catFilter) groups = groups.filter((g) => g.course.category === catFilter)
    if (search) {
      const q = search.toLowerCase()
      groups = groups.filter(
        (g) =>
          g.course.name.toLowerCase().includes(q) ||
          g.course.category.toLowerCase().includes(q) ||
          g.course.industry.toLowerCase().includes(q) ||
          g.modules.some((m) => m.name.toLowerCase().includes(q)),
      )
    }
    return groups
  }, [courses, orgFilter, industryFilter, roleFilter, catFilter, search])

  const filteredModuleCount = useMemo(
    () => filtered.reduce((sum, g) => sum + g.moduleCount, 0),
    [filtered],
  )

  const hasFilters = orgFilter || industryFilter || roleFilter || catFilter || search

  const toggleExpand = (idx: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const selectClass =
    'bg-cream-50 border border-ink-700/15 rounded-sm px-3 py-2.5 text-[13px] text-ink-800 font-sans focus:outline-none focus:border-clay-500 appearance-none cursor-pointer'

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
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="eyebrow">CURRICULUM CATALOG</span>
            <h2 className="h-display text-[36px] md:text-[56px] mt-5">
              <span className="text-clay-700">{data.length.toLocaleString()}</span>개의 실습 모듈.
            </h2>
            <p className="mt-5 text-ink-700 text-[17px] max-w-xl leading-relaxed">
              조직 유형·산업·직무·카테고리별로 설계된 교육 모듈을 직접 탐색해보세요.
              필터를 조합하면 우리 조직에 맞는 과정을 바로 찾을 수 있습니다.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
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
          <div className="relative flex-1 min-w-[180px]">
            <input
              type="text"
              placeholder="과정명 검색…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-cream-50 border border-ink-700/15 rounded-sm px-3 py-2.5 text-[13px] text-ink-800 placeholder:text-ink-400 focus:outline-none focus:border-clay-500"
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
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="font-mono text-[11px] tracking-[0.15em] text-ink-500">
            {hasFilters ? (
              <>
                <span className="text-clay-700 font-semibold">{filtered.length}</span>
                <span>개 과정 · </span>
                <span className="text-clay-700 font-semibold">{filteredModuleCount.toLocaleString()}</span>
                <span>개 모듈 매칭</span>
                <span className="text-ink-400"> / 전체 {courses.length}개 과정 · {totalModules.toLocaleString()}개 모듈</span>
              </>
            ) : (
              <>
                <span>{courses.length}개 과정 · {totalModules.toLocaleString()}개 모듈</span>
              </>
            )}
          </div>
          {hasFilters && (
            <button
              onClick={() => {
                setOrgFilter('')
                setIndustryFilter('')
                setRoleFilter('')
                setCatFilter('')
                setSearch('')
                setExpanded(new Set())
              }}
              className="text-xs text-clay-700 hover:text-clay-800 underline underline-offset-2"
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* Course cards */}
        <div className="border border-ink-700/12 rounded-sm overflow-hidden bg-cream-50">
          <div className="overflow-y-auto max-h-[600px]" style={{ scrollbarWidth: 'thin' }}>
            {filtered.slice(0, 200).map((group, idx) => {
              const c = group.course
              const isExpanded = expanded.has(idx)
              return (
                <div key={idx} className="border-b border-ink-700/8 last:border-0">
                  {/* Course row */}
                  <div
                    className={`flex items-center gap-3 px-4 py-3.5 hover:bg-clay-50/40 transition-colors cursor-pointer ${
                      isExpanded ? 'bg-clay-50/30' : ''
                    }`}
                    onClick={() => group.moduleCount > 0 && toggleExpand(idx)}
                  >
                    {/* Expand arrow */}
                    <span className={`text-[10px] text-ink-400 w-4 flex-shrink-0 transition-transform ${
                      group.moduleCount === 0 ? 'invisible' : isExpanded ? 'rotate-90' : ''
                    }`}>
                      ▶
                    </span>

                    {/* Course name */}
                    <span className="font-serif text-[14px] text-ink-900 leading-tight flex-1 min-w-0">
                      {c.name}
                    </span>

                    {/* Tags */}
                    <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                      <Badge label={c.organization_type} variant={orgColors[c.organization_type]} />
                      <Badge label={c.industry} />
                      {c.job_role && <Badge label={c.job_role} />}
                      <Badge label={c.category} variant="bg-clay-50 text-clay-700 border-clay-200" />
                    </div>

                    {/* Difficulty + module count */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-mono text-[10px] text-clay-600">{c.difficulty}</span>
                      {group.moduleCount > 0 && (
                        <span className="font-mono text-[10px] text-ink-400 bg-cream-200 px-1.5 py-0.5 rounded">
                          {group.moduleCount}개 모듈
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile tags (shown below course name on small screens) */}
                  <div className="md:hidden flex flex-wrap gap-1 px-4 pb-2 -mt-1">
                    <Badge label={c.organization_type} variant={orgColors[c.organization_type]} />
                    <Badge label={c.industry} />
                    <Badge label={c.category} variant="bg-clay-50 text-clay-700 border-clay-200" />
                  </div>

                  {/* Expanded modules */}
                  {isExpanded && group.modules.length > 0 && (
                    <div className="bg-cream-100/50 border-t border-ink-700/6">
                      {group.modules.slice(0, 50).map((m, mi) => (
                        <div
                          key={mi}
                          className="flex items-center gap-3 px-4 py-2 pl-12 border-b border-ink-700/4 last:border-0 text-[12px]"
                        >
                          <span className="font-mono text-[9px] text-ink-300 w-6 flex-shrink-0 text-right">
                            {mi + 1}
                          </span>
                          <span className="text-ink-700 flex-1">{m.name}</span>
                          {m.difficulty && (
                            <span className="font-mono text-[9px] text-ink-400 flex-shrink-0">{m.difficulty}</span>
                          )}
                        </div>
                      ))}
                      {group.modules.length > 50 && (
                        <div className="px-4 py-2 pl-12 text-[11px] text-ink-400 font-mono">
                          외 {group.modules.length - 50}개 모듈…
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {filtered.length > 200 && (
            <div className="px-4 py-3 border-t border-ink-700/10 text-center text-[11px] font-mono text-ink-500 tracking-wider">
              상위 200개 과정 표시 중 · 필터를 적용하면 더 정확한 결과를 볼 수 있습니다
            </div>
          )}
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-[13px] text-ink-400">
              조건에 맞는 과정이 없습니다. 필터를 조정해 보세요.
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-ink-500">
            구글 시트 원본에서 실시간 동기화 · 과정 클릭 시 하위 모듈 펼침
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
