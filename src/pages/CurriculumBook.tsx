import { createContext, forwardRef, useCallback, useContext, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { curriculum, site } from '../data/content'
import { useInquiry } from '../sections/InquiryModal'

/*
 * CDSA 커리큘럼 북 — Lovable 플립북 뷰어를 대체하는 자체 구현.
 * 홈에서는 모달로 뜨고(useCurriculumBook), /curriculum 직링크로도 전체 화면으로 열린다.
 * 콘텐츠는 content.ts의 curriculum 배열 + VibeStack 역량 체계(2026-10 실사) 기반.
 * 수정은 이 파일과 content.ts만 고치면 된다 (업로드·백엔드 없음).
 */

const Page = forwardRef<HTMLDivElement, { children: React.ReactNode; dark?: boolean }>(
  ({ children, dark }, ref) => (
    <div
      ref={ref}
      className={`h-full w-full overflow-hidden ${dark ? 'bg-ink-900 text-cream-50' : 'bg-cream-50 text-ink-900'}`}
      style={{ boxShadow: 'inset -14px 0 24px rgba(26,21,17,0.07), inset 0 0 20px rgba(26,21,17,0.04)' }}
    >
      <div className="h-full w-full px-7 py-8 flex flex-col">{children}</div>
    </div>
  ),
)
Page.displayName = 'Page'

function Kicker({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`font-mono text-[9.5px] tracking-[0.25em] uppercase mb-3 ${light ? 'text-clay-500' : 'text-clay-700'}`}>
      {children}
    </div>
  )
}

function PageNo({ n, total }: { n: number; total: number }) {
  return (
    <div className="mt-auto pt-4 font-mono text-[9px] tracking-[0.2em] text-ink-400">
      {String(n).padStart(2, '0')} / {String(total).padStart(2, '0')} · CDSA CURRICULUM
    </div>
  )
}

const LEVELS = [
  { k: 'L1 대화형', d: 'ChatGPT·Claude·Gemini 대화창 안에서 해결 — 검색·요약·초안·표 정리' },
  { k: 'L2 위임형', d: 'NotebookLM·전사·리서치 등 전용 AI 서비스에 통째로 맡기기' },
  { k: 'L3 제작형', d: '코드·스크립트로 나만의 업무 도구를 만들기 — 바이브코딩의 시작' },
  { k: 'L4 구축형', d: 'RAG·챗봇·파이프라인·웹 서비스까지 조직에 심는 단계' },
]

const STAGES = [
  { k: 'S1 로컬 실행', d: '단일 HTML·로컬 스크립트, 내 PC에서 바로' },
  { k: 'S2 프론트 배포', d: '링크로 공유 — GitHub·Vercel 자동 배포' },
  { k: 'S3 외부 데이터', d: '공개 API·수집·알림 연결' },
  { k: 'S4 백엔드·DB', d: '저장·로그인 있는 진짜 서비스' },
  { k: 'S5 AI 연결', d: 'LLM API·RAG·MCP를 내 도구에' },
]

function BookInner({ compact }: { compact?: boolean }) {
  const bookRef = useRef<any>(null)
  const { openInquiry } = useInquiry()
  const [page, setPage] = useState(0)

  const trackPages: (typeof curriculum)[] = []
  for (let i = 0; i < curriculum.length; i += 3) trackPages.push(curriculum.slice(i, i + 3))
  const totalPages = 6 + trackPages.length

  const flip = (dir: number) => {
    const b = bookRef.current?.pageFlip?.()
    if (!b) return
    dir > 0 ? b.flipNext() : b.flipPrev()
  }

  let pn = 0
  const no = () => ++pn

  return (
    <div className="flex flex-col items-center">
      <HTMLFlipBook
        ref={bookRef}
        width={400}
        height={560}
        size="stretch"
        minWidth={270}
        maxWidth={compact ? 420 : 460}
        minHeight={400}
        maxHeight={compact ? 580 : 640}
        showCover
        mobileScrollSupport
        maxShadowOpacity={0.4}
        onFlip={(e: any) => setPage(e.data)}
        className="shadow-2xl"
        style={{}}
        startPage={0}
        drawShadow
        flippingTime={750}
        usePortrait
        startZIndex={0}
        autoSize
        clickEventForward
        useMouseEvents
        swipeDistance={30}
        showPageCorners
        disableFlipByClick={false}
      >
        {/* 표지 */}
        <Page dark>
          <div className="h-full flex flex-col">
            <div className="font-mono text-[10px] tracking-[0.3em] text-clay-500 uppercase">Citizen Data Scientist Association</div>
            <div className="mt-auto">
              <h1 className="font-serif text-[34px] leading-[1.2]">CDSA<br />커리큘럼 북</h1>
              <p className="mt-4 text-[13.5px] text-cream-50/70 leading-relaxed">
                도구의 소비자가 아니라,<br />창작자를 만드는 교육의 설계도.
              </p>
              <div className="mt-8 pt-4 border-t border-cream-50/20 font-mono text-[9px] tracking-[0.2em] text-cream-50/50">
                2026 EDITION · 600+ ORGANIZATIONS PROVEN
              </div>
            </div>
          </div>
        </Page>

        {/* 철학 */}
        <Page>
          <Kicker>PHILOSOPHY · {String(no()).padStart(2, '0')}</Kicker>
          <h2 className="font-serif text-[23px] leading-[1.3] mb-4">수정구슬이 아니라,<br />골목길의 문제를 풉니다.</h2>
          <p className="text-[13px] text-ink-700 leading-[1.8]">
            거시 혁신이 고속도로라면 우리는 골목길을 설계합니다. AI 전망을 예언하는 교육이 아니라,
            오늘 당신 책상 위의 100페이지 PDF, 300행 설문, 매주 반복되는 공문에서 시작하는 교육입니다.
          </p>
          <p className="mt-4 text-[13px] text-ink-700 leading-[1.8]">
            행정안전부 공무원 AI역량 인증평가 <strong>AI챔피언의 역량체계를 설계</strong>하고 대표강사로
            교육해온 CDSA가, 그 체계를 민간과 개인에게 같은 깊이로 전합니다.
          </p>
          <PageNo n={pn} total={totalPages} />
        </Page>

        {/* 체계: L1~L4 */}
        <Page>
          <Kicker>FRAMEWORK · {String(no()).padStart(2, '0')}</Kicker>
          <h2 className="font-serif text-[21px] leading-[1.3] mb-1">AI 활용 4단계 체계</h2>
          <p className="text-[11.5px] text-ink-500 mb-4">역량 모듈 83개 · 실습 예시 591개 — 업무 영역 × 활용 방법 매트릭스</p>
          <div className="space-y-3">
            {LEVELS.map((l) => (
              <div key={l.k} className="border-l-2 border-clay-500 pl-3">
                <div className="font-mono text-[11px] font-bold text-clay-700">{l.k}</div>
                <div className="text-[12px] text-ink-700 leading-snug mt-0.5">{l.d}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11.5px] text-ink-500 leading-relaxed">
            폐쇄망 기관은 모듈마다 로컬 LLM·반입 대안이 함께 설계됩니다.
          </p>
          <PageNo n={pn} total={totalPages} />
        </Page>

        {/* 체계: 바이브코딩 S1~S5 */}
        <Page>
          <Kicker>VIBE CODING · {String(no()).padStart(2, '0')}</Kicker>
          <h2 className="font-serif text-[21px] leading-[1.3] mb-1">바이브코딩 5단계 구조</h2>
          <p className="text-[11.5px] text-ink-500 mb-4">역량 모듈 71개 · 실습 예시 498개 — 챗 AI·앱 생성·에이전트·코딩에이전트 4가지 방식</p>
          <div className="space-y-2.5">
            {STAGES.map((s) => (
              <div key={s.k} className="flex items-baseline gap-2.5">
                <span className="font-mono text-[10.5px] font-bold text-clay-700 shrink-0 w-[92px]">{s.k}</span>
                <span className="text-[12px] text-ink-700 leading-snug">{s.d}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11.5px] text-ink-500 leading-relaxed">
            전체 체계는 VibeStack(무료 공개)에서 직접 탐색할 수 있습니다 — 스택 진단 8문항, 용어 100개, 브라우저 능력 사전 146가지.
          </p>
          <PageNo n={pn} total={totalPages} />
        </Page>

        {/* 트랙 페이지들 */}
        {trackPages.map((group, gi) => (
          <Page key={gi}>
            <Kicker>TRACKS · {String(no()).padStart(2, '0')}</Kicker>
            <h2 className="font-serif text-[19px] mb-4">{gi === 0 ? '대표 교육 트랙 12' : '대표 교육 트랙 (계속)'}</h2>
            <div className="space-y-4">
              {group.map((c) => (
                <div key={c.code} className="pb-3 border-b border-ink-700/10 last:border-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-serif text-[15px] text-ink-900">{c.name}</span>
                    <span className="font-mono text-[10px] text-clay-600 shrink-0">{c.hours}</span>
                  </div>
                  <div className="text-[10.5px] text-ink-400 mt-0.5">대상 · {c.target}</div>
                  <p className="text-[11.5px] text-ink-700 leading-snug mt-1.5">{c.summary}</p>
                </div>
              ))}
            </div>
            <PageNo n={pn} total={totalPages} />
          </Page>
        ))}

        {/* 검증 */}
        <Page>
          <Kicker>PROOF · {String(no()).padStart(2, '0')}</Kicker>
          <h2 className="font-serif text-[21px] leading-[1.3] mb-4">600개 기관의 현장에서<br />검증된 커리큘럼</h2>
          <p className="text-[13px] text-ink-700 leading-[1.8]">
            행정안전부·NIA·인사혁신처·삼성전자 인재개발원·SK텔레콤·LG에너지솔루션·KAIST·국민건강보험공단 —
            중앙정부와 지자체, 대기업과 학계의 현장에서 같은 체계로 교육해 왔습니다.
          </p>
          <p className="mt-4 text-[13px] text-ink-700 leading-[1.8]">
            공개 과정 두 가지도 늘 열려 있습니다. <strong>AI챔피언 전문강사 양성과정</strong>과
            하루 만에 포트폴리오 4종을 만드는 <strong>취업준비 AI 역량강화 과정</strong>입니다.
          </p>
          <PageNo n={pn} total={totalPages} />
        </Page>

        {/* 뒷표지 — 초대 */}
        <Page dark>
          <div className="h-full flex flex-col">
            <Kicker light>INVITATION</Kicker>
            <h2 className="font-serif text-[24px] leading-[1.35]">이 책의 다음 장은<br />당신의 조직에서 쓰입니다.</h2>
            <p className="mt-4 text-[13px] text-cream-50/70 leading-[1.8]">
              위 트랙은 조립 블록입니다. 조직·직무·망 환경에 맞춰
              반나절 특강부터 수개월 양성과정까지 맞춤 설계해 드립니다.
            </p>
            <div className="mt-auto space-y-3">
              <button
                onClick={() => openInquiry('커리큘럼 북을 보고 문의드립니다.\n\n교육 대상:\n예상 인원:\n희망 시기:\n')}
                className="w-full py-3.5 rounded bg-clay-600 text-cream-50 text-[15px] font-medium hover:bg-clay-500 transition-colors"
              >
                맞춤 커리큘럼 문의하기 →
              </button>
              <div className="text-center font-mono text-[9px] tracking-[0.2em] text-cream-50/40">
                {site.email} · CDSA.KR
              </div>
            </div>
          </div>
        </Page>
      </HTMLFlipBook>

      {/* 하단 내비게이션 */}
      <div className="flex items-center justify-center gap-5 mt-4">
        <button
          onClick={() => flip(-1)}
          className="w-10 h-10 rounded-full border border-cream-50/30 bg-ink-900/40 text-cream-50 hover:border-clay-500 hover:text-clay-500 transition-colors text-lg backdrop-blur-sm"
          aria-label="이전 페이지"
        >
          ‹
        </button>
        <span className="font-mono text-[11px] text-cream-50/70 tracking-wider min-w-[60px] text-center">
          {page + 1} / {totalPages + 2}
        </span>
        <button
          onClick={() => flip(1)}
          className="w-10 h-10 rounded-full border border-cream-50/30 bg-ink-900/40 text-cream-50 hover:border-clay-500 hover:text-clay-500 transition-colors text-lg backdrop-blur-sm"
          aria-label="다음 페이지"
        >
          ›
        </button>
        <span className="hidden md:inline font-mono text-[10px] text-cream-50/40 tracking-wide ml-3">
          페이지 모서리를 잡아 넘겨보세요
        </span>
      </div>
    </div>
  )
}

/* ── 모달 컨텍스트: 홈 어디서든 openBook()으로 종이책 모달을 띄운다 ── */

const BookCtx = createContext<{ openBook: () => void }>({ openBook: () => {} })

export function useCurriculumBook() {
  return useContext(BookCtx)
}

export function CurriculumBookProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const openBook = useCallback(() => setOpen(true), [])

  return (
    <BookCtx.Provider value={{ openBook }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[99] bg-ink-900/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-8 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-cream-50/10 border border-cream-50/25 text-cream-50 hover:bg-clay-600 hover:border-clay-600 transition-colors text-lg z-10"
            aria-label="닫기"
          >
            ✕
          </button>
          <div className="my-auto" onClick={(e) => e.stopPropagation()}>
            <BookInner compact />
          </div>
        </div>
      )}
    </BookCtx.Provider>
  )
}

/* ── /curriculum 직링크용 전체 화면 ── */

export default function CurriculumBook() {
  const { openInquiry } = useInquiry()
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg,#241B14,#3A2C20)' }}>
      <header className="flex items-center justify-between px-5 md:px-8 py-4">
        <a href="/" className="flex items-center gap-2 text-cream-50/80 hover:text-clay-500 transition-colors">
          <span aria-hidden>←</span>
          <span className="font-serif text-[15px]">CDSA 홈으로</span>
        </a>
        <span className="font-mono text-[10px] tracking-[0.25em] text-cream-50/50 uppercase hidden sm:block">
          CDSA Curriculum Book · 2026
        </span>
        <button
          onClick={() => openInquiry()}
          className="px-4 py-2 rounded-full bg-clay-600 text-cream-50 text-[13px] hover:bg-clay-500 transition-colors"
        >
          교육 문의
        </button>
      </header>
      <div className="flex-1 flex items-center justify-center px-3 pb-8">
        <BookInner />
      </div>
    </div>
  )
}
