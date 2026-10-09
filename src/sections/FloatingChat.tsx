import { useEffect, useRef, useState } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

const QUICK = [
  '어떤 교육을 하나요?',
  'AI챔피언이 뭔가요?',
  '취업준비 과정은 얼마인가요?',
  '바이브코딩을 어디서 시작하죠?',
]

const GREETING: Msg = {
  role: 'assistant',
  content:
    '안녕하세요, CDSA 안내 도우미입니다. 교육 과정, AI챔피언, 바이브코딩, 블로그 콘텐츠 등 무엇이든 물어보세요.',
}

/** URL을 자동으로 링크로 바꿔 렌더링 */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)'"<>]+)/g)
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a
            key={i}
            href={p}
            target={p.startsWith('https://cdsa.kr') ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="underline decoration-clay-500/50 text-clay-700 hover:text-clay-500 break-all"
          >
            {p.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs, loading, open])

  async function send(text: string) {
    const q = text.trim()
    if (!q || loading) return
    const next: Msg[] = [...msgs, { role: 'user', content: q }]
    setMsgs(next)
    setInput('')
    setLoading(true)
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(1).slice(-12) }),
      })
      if (!r.ok) throw new Error(String(r.status))
      const data = await r.json()
      setMsgs((m) => [...m, { role: 'assistant', content: data.reply }])
      if (typeof window.gtag === 'function') window.gtag('event', 'chatbot_message')
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            '연결에 잠시 문제가 생겼습니다. 다시 시도해 주시거나 sjshin@cdsa.kr 로 문의해 주세요.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* 토글 버튼 — 우측, 관점·인사이트 버튼 위 */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-[86px] right-6 z-[90] flex items-center gap-2 shadow-lg transition-all duration-300 px-4 py-3 rounded-full ${
          open
            ? 'bg-ink-700 text-cream-50'
            : 'bg-clay-600 text-cream-50 hover:bg-clay-700'
        }`}
        aria-label="CDSA 챗봇 열기"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 4h14v9H8l-4 3v-3H3z" strokeLinejoin="round" />
        </svg>
        {!open && <span className="text-[12px] font-medium tracking-wide">AI 도우미</span>}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[85]" onClick={() => setOpen(false)} />
          <div className="fixed bottom-[140px] right-6 z-[90] w-[min(360px,calc(100vw-24px))] bg-cream-50 border border-ink-700/15 rounded-sm shadow-2xl overflow-hidden animate-chatUp flex flex-col" style={{ height: 'min(500px, calc(100vh - 180px))' }}>
            {/* 헤더 */}
            <div className="px-4 py-3 border-b border-ink-700/10 flex items-center justify-between shrink-0">
              <span className="font-mono text-[10px] tracking-[0.2em] text-ink-500 uppercase">
                CDSA · AI 도우미
              </span>
              <span className="text-[10px] text-ink-400">답변은 부정확할 수 있습니다</span>
            </div>

            {/* 메시지 */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-ink-700 text-cream-50 rounded-lg rounded-br-sm'
                        : 'bg-cream-100 border border-ink-700/8 text-ink-900 rounded-lg rounded-bl-sm'
                    }`}
                  >
                    <Linkified text={m.content} />
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-cream-100 border border-ink-700/8 rounded-lg rounded-bl-sm px-4 py-3 flex gap-1.5">
                    <span className="chat-dot" />
                    <span className="chat-dot" style={{ animationDelay: '0.15s' }} />
                    <span className="chat-dot" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}
              {msgs.length === 1 && !loading && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-[11.5px] px-3 py-1.5 rounded-full border border-ink-700/15 text-ink-700 hover:border-clay-500 hover:text-clay-700 transition-colors bg-cream-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 입력 */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="shrink-0 border-t border-ink-700/10 p-2.5 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="궁금한 점을 입력하세요"
                maxLength={500}
                className="flex-1 bg-cream-100 border border-ink-700/10 rounded px-3 py-2 text-[13px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-clay-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-3.5 py-2 rounded bg-clay-600 text-cream-50 text-[12.5px] font-medium hover:bg-clay-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                전송
              </button>
            </form>
          </div>
        </>
      )}

      <style>{`
        @keyframes chatUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-chatUp { animation: chatUp 0.2s ease-out; }
        .chat-dot { width: 6px; height: 6px; border-radius: 50%; background: #b8a99a; animation: chatPulse 1s ease-in-out infinite; }
        @keyframes chatPulse { 0%, 100% { opacity: 0.3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-2px); } }
      `}</style>
    </>
  )
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}
