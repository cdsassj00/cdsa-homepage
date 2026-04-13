import { useEffect, useRef, useState } from 'react'
import { useInquiry } from './InquiryModal'

/* ── 8-session data (공공 냄새 제거 버전) ── */
const sessions = [
  {
    num: 1,
    title: 'AI 에이전트 시대의 개막과 구현 지형도',
    sub: '기술 지형 감각 · 환경 세팅 · 거점 미션 선언',
    keywords: ['AI 진화사', '트랜스포머 개념', '9가지 구현 유형', '환경 세팅'],
  },
  {
    num: 2,
    title: '프론티어 모델 심층 탐구와 AI 도구 생태계 50선',
    sub: '재료 창고를 가득 채우는 시간',
    keywords: ['ChatGPT·Claude·Gemini', '로컬 모델 설치', 'AI 도구 50선 투어'],
  },
  {
    num: 3,
    title: '메타 프롬프트 설계와 워크플로우 오케스트레이션',
    sub: '프롬프트를 외우지 않고, 워크플로우를 짠다',
    keywords: ['메타 프롬프트', '교차 검증', '6가지 워크플로우 타입'],
  },
  {
    num: 4,
    title: '어시스트 바이브 코딩 ① 데이터 시각화·분석',
    sub: '보안 환경에서 코드를 받아 실행한다',
    keywords: ['파이썬 시각화', 'Power BI + DAX', '머신러닝 맛보기'],
  },
  {
    num: 5,
    title: '어시스트 바이브 코딩 ② 업무 자동화·로컬 AI',
    sub: '반복 업무를 체질로 줄이는 기술',
    keywords: ['문서 자동화', '엑셀 AI 함수', 'VBA + Ollama'],
  },
  {
    num: 6,
    title: 'AI 에이전트 툴 마스터리와 에이전트 개발 입문',
    sub: '기획서로 말하고 에이전트가 만든다',
    keywords: ['Claude Code·Cursor·Codex', '에이전트에게 일 시키는 법', '독립 앱 개발'],
  },
  {
    num: 7,
    title: 'RAG 파이프라인과 웹서비스 구축',
    sub: '넣기 → 쪼개기 → 찾기 → 답하기',
    keywords: ['로컬 RAG 구현', '웹서비스 3덩어리', '프론트+백엔드+RAG'],
  },
  {
    num: 8,
    title: 'API·MCP 기반 멀티 에이전트 아키텍처',
    sub: '조합의 끝판, 기획자로 완성되는 회차',
    keywords: ['API 카탈로그', 'MCP 표준 콘센트', 'AI 아키텍처 캔버스'],
  },
]

const phases = [
  {
    label: 'PHASE 1',
    title: '재료 창고 채우기',
    desc: 'AI 생태계를 재료 창고로 삼아 워크플로우를 기획하는 구간. 50개 도구를 훑고, 메타 프롬프트로 프롬프트 자체를 설계하며, 여러 AI 서비스를 엮어 하나의 과제를 푸는 경험을 쌓습니다.',
    sessions: [0, 1, 2],
    color: 'clay',
  },
  {
    label: 'PHASE 2',
    title: '바이브 코딩으로 만들기',
    desc: '보안 환경의 현실을 전제로, AI 어시스트로 코드를 받아 실행하는 루틴을 체화합니다. 데이터 시각화부터 문서 자동화, 로컬 AI 연동까지 — 에이전트 없이도 만들 수 있는 범위를 확인합니다.',
    sessions: [3, 4],
    color: 'moss',
  },
  {
    label: 'PHASE 3',
    title: '에이전트로 설계하기',
    desc: '에이전트 도구로 본격 개발에 진입합니다. RAG·웹서비스·API·MCP를 조합해 풀스택 서비스를 기획·구축하고, AI 아키텍처 캔버스를 1장에 그리는 기획자로 완성됩니다.',
    sessions: [5, 6, 7],
    color: 'ink',
  },
]

const phaseColors: Record<string, { dot: string; bg: string; border: string; text: string; line: string }> = {
  clay: {
    dot: 'bg-clay-600',
    bg: 'bg-clay-50',
    border: 'border-clay-200',
    text: 'text-clay-700',
    line: 'bg-clay-300',
  },
  moss: {
    dot: 'bg-moss-600',
    bg: 'bg-[#f0f4ec]',
    border: 'border-[#c8d8b8]',
    text: 'text-moss-600',
    line: 'bg-moss-500/40',
  },
  ink: {
    dot: 'bg-ink-800',
    bg: 'bg-ink-800/[0.04]',
    border: 'border-ink-700/15',
    text: 'text-ink-800',
    line: 'bg-ink-400/40',
  },
}

export default function FullCourse() {
  const { openInquiry } = useInquiry()
  const sectionRef = useRef<HTMLElement>(null)
  const [activeSession, setActiveSession] = useState<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add('revealed')
            observer.unobserve(e.target)
          }
        }),
      { threshold: 0.08 },
    )
    section.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="fullcourse" className="py-28 md:py-36">
      <div className="container-editorial">
        {/* ── Header ── */}
        <div className="max-w-3xl mb-20 scroll-reveal">
          <span className="eyebrow">8 WEEKS · 8 SESSIONS · FULL COURSE</span>
          <h2 className="h-display text-[32px] md:text-[52px] mt-5 leading-[1.12]">
            기획하는 리더를 위한 <br />
            <span className="text-clay-700">8주 AI 실전 여정.</span>
          </h2>
          <p className="mt-5 text-ink-700 text-lg leading-relaxed max-w-2xl">
            기술자를 키우는 과정이 아닙니다.
            자기 조직의 문제를 가장 잘 이해하고, AI 활용을 설계·확산할 수 있는 사람을 키우는 과정입니다.
            구현은 에이전트가 합니다.
          </p>
        </div>

        {/* ── Timeline (desktop) ── */}
        <div className="hidden md:block mb-20 scroll-reveal" style={{ transitionDelay: '200ms' }}>
          <div className="relative flex items-center justify-between px-6">
            {/* connecting line */}
            <div className="absolute left-6 right-6 top-1/2 h-px bg-ink-700/15 -translate-y-1/2" />

            {sessions.map((s, i) => {
              const phase = phases.find((p) => p.sessions.includes(i))!
              const colors = phaseColors[phase.color]
              const isActive = activeSession === i
              return (
                <button
                  key={s.num}
                  onClick={() => setActiveSession(isActive ? null : i)}
                  className="relative z-10 flex flex-col items-center gap-3 group cursor-pointer"
                >
                  {/* dot */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-mono font-semibold transition-all duration-300 ${
                      isActive
                        ? `${colors.dot} text-cream-50 scale-110 shadow-lg`
                        : `bg-cream-100 border-2 ${colors.border} ${colors.text} group-hover:scale-105`
                    }`}
                  >
                    {s.num}
                  </div>
                  {/* label */}
                  <span
                    className={`text-[11px] leading-tight text-center max-w-[100px] transition-colors ${
                      isActive ? 'text-ink-900 font-medium' : 'text-ink-500'
                    }`}
                  >
                    {s.title.length > 18 ? s.title.slice(0, 18) + '…' : s.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Phase labels under timeline */}
          <div className="flex mt-6 px-6">
            {phases.map((p) => {
              const colors = phaseColors[p.color]
              const widthPercent = (p.sessions.length / 8) * 100
              return (
                <div key={p.label} className="flex items-center gap-2" style={{ width: `${widthPercent}%` }}>
                  <div className={`h-[3px] flex-1 rounded-full ${colors.line}`} />
                  <span className={`text-[10px] font-mono tracking-[0.15em] uppercase whitespace-nowrap ${colors.text}`}>
                    {p.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Expanded session detail */}
          {activeSession !== null && (
            <div className="mt-8 p-8 bg-cream-100/60 border border-ink-700/10 rounded-sm animate-[fadeUp_0.3s_ease]">
              <div className="flex items-start gap-4">
                <span className="font-mono text-[12px] tracking-[0.18em] text-clay-700 uppercase shrink-0 mt-1">
                  SESSION {String(sessions[activeSession].num).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="font-serif text-[20px] text-ink-900 leading-tight mb-2">
                    {sessions[activeSession].title}
                  </h4>
                  <p className="text-[14px] text-ink-600 italic mb-4">{sessions[activeSession].sub}</p>
                  <div className="flex flex-wrap gap-2">
                    {sessions[activeSession].keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[12px] px-3 py-1 bg-cream-50 border border-ink-700/10 text-ink-700 rounded-full"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 3-Phase progression cards ── */}
        <div className="space-y-6">
          {phases.map((phase, pi) => {
            const colors = phaseColors[phase.color]
            return (
              <div
                key={phase.label}
                className={`scroll-reveal ${colors.bg} border ${colors.border} p-8 md:p-10`}
                style={{ transitionDelay: `${(pi + 1) * 150}ms` }}
              >
                {/* phase header */}
                <div className="flex flex-wrap items-baseline gap-4 mb-6">
                  <span className={`font-mono text-[11px] tracking-[0.2em] uppercase ${colors.text} font-semibold`}>
                    {phase.label}
                  </span>
                  <h3 className="font-serif text-[24px] md:text-[30px] text-ink-900 leading-tight">
                    {phase.title}
                  </h3>
                </div>
                <p className="text-[15px] text-ink-700 leading-relaxed mb-8 max-w-3xl">{phase.desc}</p>

                {/* session cards within phase */}
                <div className="grid md:grid-cols-auto gap-4">
                  <div
                    className={`grid gap-4 ${
                      phase.sessions.length === 2
                        ? 'md:grid-cols-2'
                        : 'md:grid-cols-3'
                    }`}
                  >
                    {phase.sessions.map((si) => {
                      const s = sessions[si]
                      return (
                        <div
                          key={s.num}
                          className="bg-cream-50/80 border border-ink-700/8 p-6 hover:border-ink-700/20 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <span
                              className={`w-8 h-8 rounded-full ${colors.dot} text-cream-50 flex items-center justify-center text-[12px] font-mono font-semibold`}
                            >
                              {s.num}
                            </span>
                            <span className="font-mono text-[10px] tracking-[0.18em] text-ink-500 uppercase">
                              SESSION {String(s.num).padStart(2, '0')}
                            </span>
                          </div>
                          <h4 className="font-serif text-[16px] md:text-[18px] text-ink-900 leading-snug mb-2">
                            {s.title}
                          </h4>
                          <p className="text-[13px] text-ink-500 italic mb-4">{s.sub}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {s.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="text-[11px] px-2 py-0.5 bg-cream-100 border border-ink-700/8 text-ink-600 rounded-full"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Design philosophy callout ── */}
        <div className="scroll-reveal mt-10 border-l-[3px] border-clay-500 bg-clay-50/50 p-8" style={{ transitionDelay: '400ms' }}>
          <span className="font-mono text-[10px] tracking-[0.2em] text-clay-700 uppercase font-semibold">설계 철학</span>
          <div className="mt-3 text-[15px] text-ink-800 leading-relaxed space-y-1.5">
            <p>이론은 개념 수준까지만. 깊이 있는 기술은 에이전트가 담당한다.</p>
            <p>9가지 구현 유형을 어시스트 버전과 에이전트 버전으로 두 번 경험한다.</p>
            <p>모든 회차는 문제 제시 → 도구 조합 → 산출물 → 공유·축적 사이클로 끝난다.</p>
            <p>최종 목표는 비즈니스 모델 캔버스처럼 AI 아키텍처를 1장에 기획하는 역량이다.</p>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-14 text-center scroll-reveal" style={{ transitionDelay: '500ms' }}>
          <p className="text-sm text-ink-500 mb-5">
            조직 규모·수준·보안 환경에 맞춰 커리큘럼을 재설계합니다.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="/fullcourse.html"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-ink-900 text-cream-50 text-sm font-medium hover:bg-clay-700 transition-colors"
            >
              커리큘럼 상세 보기
            </a>
            <button
              onClick={openInquiry}
              className="btn-outline inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm"
            >
              Full Course 문의하기 →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
