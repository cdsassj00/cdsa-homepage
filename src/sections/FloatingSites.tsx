import { useState } from 'react'

const sites = [
  {
    name: 'OpenCabinet',
    desc: 'AI 에이전트 도구 아카이브',
    href: 'https://opencabinet.cc/',
  },
  {
    name: 'StockOntology',
    desc: '주식·산업 온톨로지 검색',
    href: 'https://stockontology.cc/',
  },
  {
    name: 'Skills.sh',
    desc: '스킬 검색·설치 MCP — Claude Code에 바로 연결',
    href: 'https://skills.sh',
  },
  {
    name: 'CDSA.site',
    desc: '무료 호스팅 서비스',
    href: 'https://cdsa.site/',
  },
]

export default function FloatingSites() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 left-6 z-[90] flex items-center gap-2 shadow-lg transition-all duration-300 ${
          open
            ? 'bg-ink-700 text-cream-50 px-4 py-3 rounded-full'
            : 'bg-cream-50 text-ink-700 border border-ink-700/20 hover:border-clay-500 hover:text-clay-700 px-4 py-3 rounded-full'
        }`}
        aria-label="연관 사이트 열기"
      >
        <svg
          width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
        >
          <circle cx="10" cy="10" r="7" />
          <line x1="10" y1="6" x2="10" y2="14" />
          <line x1="6" y1="10" x2="14" y2="10" />
        </svg>
        {!open && (
          <span className="text-[12px] font-medium tracking-wide">연관 사이트</span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[85]"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-20 left-6 z-[90] w-[260px] bg-cream-50 border border-ink-700/15 rounded-sm shadow-2xl overflow-hidden animate-slideUp">
            <div className="px-4 py-3 border-b border-ink-700/10">
              <span className="font-mono text-[10px] tracking-[0.2em] text-ink-500 uppercase">
                CDSA · 연관 사이트
              </span>
            </div>
            <div>
              {sites.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-4 py-3.5 hover:bg-cream-100 transition-colors border-b border-ink-700/8 last:border-0 group"
                >
                  <span className="shrink-0 w-7 h-7 rounded bg-ink-900/5 flex items-center justify-center text-[11px] font-mono font-bold text-clay-600 group-hover:bg-clay-600 group-hover:text-cream-50 transition-colors mt-0.5">
                    {s.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[14px] font-medium text-ink-900 group-hover:text-clay-700 transition-colors">
                      {s.name}
                      <span className="inline-block ml-1 text-[10px] text-ink-400 group-hover:text-clay-500">↗</span>
                    </span>
                    <span className="block text-[11px] text-ink-500 mt-0.5">
                      {s.desc}
                    </span>
                  </div>
                </a>
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
