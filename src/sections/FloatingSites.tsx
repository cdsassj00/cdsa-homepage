import { useEffect, useState } from 'react'
import { announcePanel, onPanelChange } from './floatingBus'

type Site = { name: string; desc: string; href: string }

// 2026-10 전수 등재: Vercel·Cloudflare·Firebase에 배포된 공개 사이트 (HTTP 200 확인분만)
const groups: { label: string; items: Site[] }[] = [
  {
    label: '핵심 서비스',
    items: [
      { name: 'Shinsungjin.com', desc: '신성진 대표 개인 홈페이지', href: 'https://shinsungjin.com/' },
      { name: 'VibeStack', desc: '바이브코딩 스택 진단 · 시나리오 · 용어사전', href: 'https://ag-firebase-board-2026.web.app/' },
      { name: 'OpenCabinet', desc: '열린국무회의 — KTV 국무회의 아카이브', href: 'https://opencabinet.cc/' },
      { name: 'StockOntology', desc: '3D 세계지도 금융뉴스 · 시세 · 온톨로지', href: 'https://stockontology.cc/' },
      { name: 'Skills.sh', desc: '에이전트 스킬 디렉토리 — 검색·설치 MCP', href: 'https://skills.sh' },
      { name: 'CDSA.site', desc: 'CDSADROP — 드래그앤드롭 무료 정적 호스팅', href: 'https://cdsa.site/' },
      { name: '계산모아', desc: '기념일·디데이·연봉·대출 일상 계산기 모음', href: 'https://calcmoa.site/' },
      { name: '계산기 & 툴', desc: '연봉·건강·금융 계산기 모음', href: 'https://calcmoa.com/' },
      { name: 'AICAPA', desc: 'AI챔피언 역량인증 시스템', href: 'https://aicapa.kr/' },
    ],
  },
  {
    label: '공공 · 기관 프로젝트',
    items: [
      { name: 'AI챔피언 명예의 전당', desc: '공공 AI 챔피언 아카이브', href: 'https://aichampion.site/' },
      { name: 'C-RISK', desc: '산업통상자원부 자원안보 모니터링', href: 'https://motie-climate-risk.vercel.app/' },
      { name: '생태 시뮬레이터', desc: '국립생태원 3D 생태계 계산도구', href: 'https://nie-eco-simulator.vercel.app/' },
      { name: '의성군 AI 교육 아카이브', desc: '지자체 AI 교육 기록', href: 'https://eusung-lms.vercel.app/' },
      { name: '제주보수교육 LMS', desc: '사전 온라인 학습 시스템', href: 'https://jeju-ai-expert-lms.vercel.app/' },
      { name: '서울시 예약 AI 챗봇', desc: '교육 공공서비스 예약 챗봇 데모', href: 'https://html-ai-openrouter-chatbot.vercel.app/' },
      { name: '공공 AX PoC 과제계획서', desc: '기술 과제계획서 샘플', href: 'https://task-rust-one.vercel.app/' },
      { name: '스마트팩토리 제안', desc: '제조 현장 자동화 제안 데모', href: 'https://poonsan.vercel.app/' },
    ],
  },
  {
    label: '바이브코딩 산출물 · 데모',
    items: [
      { name: 'AI 영상 스튜디오', desc: '주제만 던지면 유튜브까지', href: 'https://youtubeauto-iota.vercel.app/' },
      { name: '강의 콘텐츠 지도', desc: '강의 자료 내비게이션', href: 'https://ai-lecture-iota.vercel.app/' },
      { name: 'TypeSafe Jev', desc: '시스템1 AI 의사결정 쇼케이스', href: 'https://jev-automation-showcase.vercel.app/' },
      { name: 'AI 견적서 자동완성', desc: '견적서 자동 생성 시스템', href: 'https://autodocs-pi.vercel.app/' },
      { name: '업무 통합 워크스페이스', desc: '업무 컨트롤룸', href: 'https://work-control-room-2026.vercel.app/' },
      { name: 'SNS 자동배포 대시보드', desc: 'SNS 멀티채널 발행 자동화', href: 'https://sns-automation-eight.vercel.app/' },
      { name: 'AX 강사양성 커뮤니티', desc: '교육 커뮤니티 데모', href: 'https://ax-inky.vercel.app/' },
      { name: 'AURA Lounge', desc: 'Supabase 실시간 커뮤니티', href: 'https://aura-community-board.vercel.app/' },
      { name: '법령 아카이브', desc: '법령 통합 검색', href: 'https://total-three-alpha.vercel.app/' },
      { name: '교육 이수 현황 관리', desc: '이수 현황 대시보드', href: 'https://preview-2-chi.vercel.app/' },
      { name: 'Dayflow', desc: '일정과 프로젝트를 한곳에', href: 'https://dayflowsinglefile.vercel.app/' },
      { name: '책 빌더 스튜디오', desc: '원고를 책으로', href: 'https://book-builder-web.vercel.app/' },
      { name: 'GPT 동시통역', desc: 'Realtime API 동시통역 데모', href: 'https://gist-peach-one.vercel.app/' },
      { name: 'CSV Smart Dashboard', desc: 'CSV 올리면 대시보드 자동 생성', href: 'https://dashboardtest-liard.vercel.app/' },
      { name: 'AI Competency Compass', desc: '조직 AI 역량 진단', href: 'https://aicapa.vercel.app/' },
      { name: '일정 플래너', desc: '캘린더 · 간트 스케줄러', href: 'https://v0-calendar-gantt-scheduler.vercel.app/' },
      { name: '경제 연쇄반응 시뮬레이터', desc: 'Economic Engine', href: 'https://v0-ssjeco.vercel.app/' },
      { name: 'JS 라이브러리 쇼룸', desc: '코딩 에이전트 생성 데모', href: 'https://javascriptdemo.vercel.app/' },
      { name: 'AICE Associate 학습 도우미', desc: '기초 문법 · 기출 모의문제', href: 'https://aiceassociate.vercel.app/' },
      { name: '먹플릭스', desc: '오늘 뭐 먹지?', href: 'https://mukflix.vercel.app/' },
      { name: 'Maflix 맛집 검색', desc: '맛집 탐색 데모', href: 'https://matjib-search.vercel.app/' },
      { name: 'NEO COREA 동물병원', desc: '병원 홈페이지 시안', href: 'https://neocorea.vercel.app/' },
      { name: '파종시기 계산기', desc: '몽글몽글 텃밭 계산기', href: 'https://ssj-six.vercel.app/' },
      { name: 'KAK', desc: '브랜드 랜딩 시안', href: 'https://kak-five.vercel.app/' },
      { name: '교육 관리 시스템', desc: '학습 플랫폼 프로토타입', href: 'https://v0-korean-learning-platform.vercel.app/' },
      { name: 'AI 학습 플랫폼', desc: '영상 학습 사이트 프로토타입', href: 'https://v0-youtube-video-website-navy.vercel.app/' },
      { name: '멘토-멘티 매칭', desc: '매칭 플랫폼 프로토타입', href: 'https://v0-mentor-mentee-matching-platform.vercel.app/' },
      { name: 'Learning Roadmap Editor', desc: '학습 로드맵 에디터', href: 'https://oliveyoung-one.vercel.app/' },
      { name: '간단한 게시판', desc: '게시판 실습 데모', href: 'https://board-six-green.vercel.app/' },
      { name: '견적서 템플릿', desc: '웹 견적서 실습', href: 'https://html-1-livid.vercel.app/' },
      { name: 'free-for-dev MCP', desc: '무료 개발 리소스 MCP 서버', href: 'https://free-for-dev-mcp-vercel.vercel.app/' },
      { name: '매치3 게임', desc: '퍼즐 게임 실습', href: 'https://v0-match-3-game-sable.vercel.app/' },
      { name: '명예의 전당 (아카이브)', desc: '행안부 AI챔피온 구버전', href: 'https://v0-ai-phi-orpin.vercel.app/' },
      { name: 'v0 프로토타입', desc: '실험 프로젝트', href: 'https://v0-new-project-6bwnhvxrt42.vercel.app/' },
    ],
  },
]

export default function FloatingSites() {
  const [open, setOpenRaw] = useState(false)
  const setOpen = (next: boolean) => {
    setOpenRaw(next)
    announcePanel(next ? 'sites' : null)
  }
  useEffect(() => onPanelChange((id) => {
    if (id && id !== 'sites') setOpenRaw(false)
  }), [])

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-[92px] right-6 z-[90] flex items-center gap-2.5 shadow-lg transition-all duration-300 ${
          open
            ? 'bg-ink-700 text-cream-50 px-5 py-4 rounded-full'
            : 'bg-cream-50 text-ink-700 border border-ink-700/20 hover:border-clay-500 hover:text-clay-700 px-6 py-4 rounded-full'
        }`}
        aria-label="연관 사이트 열기"
      >
        <svg
          width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
        >
          <circle cx="10" cy="10" r="7" />
          <line x1="10" y1="6" x2="10" y2="14" />
          <line x1="6" y1="10" x2="14" y2="10" />
        </svg>
        {!open && (
          <span className="text-[15px] font-medium tracking-wide">연관 사이트</span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[85]"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-[160px] right-6 z-[95] w-[min(360px,calc(100vw-24px))] bg-cream-50 border border-ink-700/15 rounded-sm shadow-2xl overflow-hidden animate-slideUp flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="px-4 py-3 border-b border-ink-700/10 shrink-0">
              <span className="font-mono text-[10px] tracking-[0.2em] text-ink-500 uppercase">
                CDSA · 연관 사이트
              </span>
            </div>
            <div className="overflow-y-auto">
              {groups.map((g) => (
                <div key={g.label}>
                  <div className="px-4 pt-3.5 pb-1.5 sticky top-0 bg-cream-50/95 backdrop-blur-sm">
                    <span className="text-[11px] font-semibold tracking-wide text-clay-700">{g.label}</span>
                  </div>
                  {g.items.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 px-4 py-3 hover:bg-cream-100 transition-colors border-b border-ink-700/8 last:border-0 group"
                    >
                      <span className="shrink-0 w-7 h-7 rounded bg-ink-900/5 flex items-center justify-center text-[11px] font-mono font-bold text-clay-600 group-hover:bg-clay-600 group-hover:text-cream-50 transition-colors mt-0.5">
                        {s.name.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <span className="block text-[15px] font-medium text-ink-900 group-hover:text-clay-700 transition-colors">
                          {s.name}
                          <span className="inline-block ml-1 text-[11px] text-ink-400 group-hover:text-clay-500">↗</span>
                        </span>
                        <span className="block text-[12px] text-ink-500 mt-0.5">
                          {s.desc}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.2s ease-out; }
      `}</style>
    </>
  )
}
