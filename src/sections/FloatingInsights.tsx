import { useState } from 'react'

const articles = [
  {
    title: 'AX 역량강화 프레임워크',
    description: '0~8단계 역량 체계와 교육 철학',
    href: '/framework.html',
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
        className={`fixed bottom-6 right-6 z-[90] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          open
            ? 'bg-clay-700 text-cream-50 rotate-45'
            : 'bg-ink-900 text-cream-50 hover:bg-clay-700'
        }`}
        aria-label="관점 · 인사이트 열기"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="10" y1="4" x2="10" y2="16" />
          <line x1="4" y1="10" x2="16" y2="10" />
        </svg>
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
