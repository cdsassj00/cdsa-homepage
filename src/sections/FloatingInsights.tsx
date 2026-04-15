import { useState } from 'react'

const articles = [
  {
    title: 'AX 역량강화 프레임워크',
    description: '0~8단계 역량 체계와 교육 철학',
    href: '/framework.html',
  },
  {
    title: 'AX 전문인재 양성 Full Course',
    description: '기획하는 리더를 위한 8주 AI 실전 여정',
    href: '/fullcourse.html',
  },
  {
    title: '하네스라는 단어, 한 걸음 더 들어가 보기',
    description: '모델을 실제로 돌리는 바깥 껍데기. 60줄 파이썬부터 Claude Code까지',
    href: '/blog/harness.html',
  },
  {
    title: 'MCP 클라이언트를 직접 만들 때 왜 에이전트 서버가 핵심인가',
    description: '채팅창이 아니라 함수 호출 흐름 제어기가 핵심. 기능을 네 가지 유형으로',
    href: '/blog/mcp-client.html',
  },
  {
    title: 'MCP 서버·클라이언트·에이전트 서버 입문 가이드',
    description: '식당 비유로 풀어 본 MCP 입문 지도. 처음 만들 때 어디서부터 시작할까',
    href: '/blog/mcp-guide.html',
  },
  {
    title: 'MCP 서버의 원리, 전문기술이지만 쉽게 이해하기',
    description: '기능 목록·입력 형식·실행 코드·결과 반환 — MCP 서버의 네 가지 뼈대',
    href: '/blog/mcp-server.html',
  },
  {
    title: '멀티 에이전트 7가지 유형, 쓸모 있게 정리하기',
    description: 'SNS에서 도는 7가지 패턴을 실무 기준으로. 본질은 두 축이다',
    href: '/blog/multi-agent-patterns.html',
  },
  {
    title: 'ChatGPT에 코드 물어보는 것도 AI 에이전트일까?',
    description: '프롬프팅·워크플로우·에이전트·하네스 — 운전 비유로 정리한 기초 어휘',
    href: '/blog/what-is-agent.html',
  },
  // 앞으로 글이 추가되면 여기에 { title, description, href } 한 줄만 추가
]

export default function FloatingInsights() {
  const [open, setOpen] = useState(false)

  if (articles.length === 0) return null

  return (
    <>
      {/* Floating button — 우하단 */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-[90] flex items-center gap-2 shadow-lg transition-all duration-300 ${
          open
            ? 'bg-clay-700 text-cream-50 px-4 py-3 rounded-full'
            : 'bg-ink-900 text-cream-50 hover:bg-clay-700 px-5 py-3 rounded-full floating-pulse'
        }`}
        aria-label="관점 · 인사이트 열기"
      >
        <svg
          width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        >
          <line x1="10" y1="4" x2="10" y2="16" />
          <line x1="4" y1="10" x2="16" y2="10" />
        </svg>
        {!open && (
          <span className="text-[13px] font-medium tracking-wide">관점 · 인사이트</span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[85]"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-20 right-6 z-[90] w-[300px] bg-cream-50 border border-ink-700/15 rounded-sm shadow-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-ink-700/10">
              <span className="font-mono text-[10px] tracking-[0.2em] text-clay-600 uppercase">
                관점 · 인사이트
              </span>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {articles.map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  className="block px-5 py-4 hover:bg-cream-100 transition-colors border-b border-ink-700/8 last:border-0"
                >
                  <span className="block font-serif text-[15px] text-ink-900 mb-1">
                    {a.title}
                  </span>
                  <span className="block text-[12px] text-ink-500">
                    {a.description}
                  </span>
                </a>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-ink-700/10 text-center">
              <span className="text-[11px] text-ink-400 font-mono tracking-wider">
                콘텐츠는 계속 추가됩니다
              </span>
            </div>
          </div>
        </>
      )}
    </>
  )
}
