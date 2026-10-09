import { useEffect, useRef, useState } from 'react'
import avatarUrl from '../assets/chat-avatar.jpg'
import avatarVideo from '../assets/chat-avatar.mp4'

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
  const parts = text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#{1,4}\s*/gm, '').split(/(https?:\/\/[^\s)'"<>]+)/g)
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
  const [mode, setMode] = useState<'chat' | 'mail' | 'sent'>('chat')
  const [mailSending, setMailSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  async function sendMail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    const fd = new FormData(f)
    setMailSending(true)
    try {
      const r = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: '기타',
          name: fd.get('name'),
          email: fd.get('email'),
          org: '',
          phone: '',
          message: fd.get('message'),
          website: '',
        }),
      })
      if (!r.ok) throw new Error(String(r.status))
      setMode('sent')
      if (typeof window.gtag === 'function') window.gtag('event', 'chatbot_mail_sent')
    } catch {
      alert('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setMailSending(false)
    }
  }

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
      const raw = String(data.reply ?? '')
      const wantsMail = raw.includes('[MAIL_FORM]')
      const reply = raw.replace(/\s*\[MAIL_FORM\]\s*/g, '').trim()
      setMsgs((m) => [...m, { role: 'assistant', content: reply || raw }])
      if (wantsMail) setTimeout(() => setMode('mail'), 600)
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
      {/* 토글 버튼 — 신성진 대표 원형 아바타 */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-[168px] right-6 z-[91] flex items-center gap-3 group"
        aria-label="CDSA 챗봇 열기"
      >
        {!open && (
          <span className="hidden sm:block bg-cream-50 border border-ink-700/15 shadow-lg rounded-full px-5 py-2.5 text-[14px] font-medium text-ink-700 group-hover:text-clay-700 group-hover:border-clay-500/40 transition-colors">
            신성진 대표에게 질문 <span className="text-ink-400">· CDSA</span>
          </span>
        )}
        <span className="relative block shrink-0">
          {open ? (
            <img
              src={avatarUrl}
              alt="신성진 대표 · CDSA"
              className="w-12 h-12 rounded-full object-cover shadow-xl ring-2 ring-ink-700 transition-all duration-300"
            />
          ) : (
            <video
              src={avatarVideo}
              poster={avatarUrl}
              autoPlay
              muted
              loop
              playsInline
              aria-label="신성진 대표 · CDSA"
              className="w-[150px] h-[150px] sm:w-[208px] sm:h-[208px] rounded-full object-cover shadow-xl ring-4 ring-clay-500 group-hover:ring-clay-600 group-hover:scale-105 chat-breathe transition-all duration-300"
            />
          )}
          {open ? (
            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-ink-700 text-cream-50 text-[10px] leading-none flex items-center justify-center ring-2 ring-cream-50">✕</span>
          ) : (
            <span className="absolute bottom-2 right-0 bg-clay-600 text-cream-50 text-[14px] font-bold tracking-wide px-3 py-1.5 rounded-full ring-2 ring-cream-50">AI</span>
          )}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[85]" onClick={() => setOpen(false)} />
          <div className="fixed bottom-[228px] right-6 z-[93] w-[min(440px,calc(100vw-24px))] bg-cream-50 border border-ink-700/15 rounded-sm shadow-2xl overflow-hidden animate-chatUp flex flex-col" style={{ height: 'min(640px, calc(100vh - 268px))' }}>
            {/* 헤더 */}
            <div className="px-4 py-2.5 border-b border-ink-700/10 flex items-center gap-2.5 shrink-0">
              <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover ring-1 ring-clay-500/50" />
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold text-ink-900 leading-tight">신성진 대표 · CDSA</div>
                <div className="text-[11.5px] text-ink-400 leading-tight">
                  {mode === 'chat' ? 'AI 도우미 — 답변은 부정확할 수 있습니다' : '직접 메일 보내기'}
                </div>
              </div>
              {mode !== 'chat' && (
                <button onClick={() => setMode('chat')} className="text-[12.5px] text-ink-500 hover:text-clay-700 transition-colors shrink-0">
                  ← 챗봇으로
                </button>
              )}
            </div>

            {/* 메시지 */}
            {mode === 'chat' && (<>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
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
                      className="text-[13px] px-3.5 py-2 rounded-full border border-ink-700/15 text-ink-700 hover:border-clay-500 hover:text-clay-700 transition-colors bg-cream-50"
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
                className="flex-1 bg-cream-100 border border-ink-700/10 rounded px-3 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-clay-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2.5 rounded bg-clay-600 text-cream-50 text-[14px] font-medium hover:bg-clay-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                전송
              </button>
            </form>
            <button
              onClick={() => setMode('mail')}
              className="shrink-0 pb-3 text-[13px] text-ink-500 hover:text-clay-700 transition-colors text-center w-full"
            >
              ✉ 신성진 대표에게 직접 메일 보내기
            </button>
            </>)}

            {/* 메일 폼 */}
            {mode === 'mail' && (
              <form onSubmit={sendMail} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                <p className="text-[13.5px] text-ink-500 leading-relaxed">
                  남겨주신 내용은 신성진 대표의 메일(sjshin@cdsa.kr)로 바로 전달되고, 입력하신 주소로 회신드립니다.
                </p>
                <div>
                  <label className="block text-[12.5px] font-medium text-ink-700 mb-1">이름 *</label>
                  <input name="name" required maxLength={50} placeholder="홍길동"
                    className="w-full bg-cream-100 border border-ink-700/10 rounded px-3 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-clay-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-ink-700 mb-1">이메일 *</label>
                  <input name="email" type="email" required maxLength={100} placeholder="hong@company.co.kr"
                    className="w-full bg-cream-100 border border-ink-700/10 rounded px-3 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-clay-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-ink-700 mb-1">내용 *</label>
                  <textarea name="message" required maxLength={1500} rows={5} placeholder="문의하실 내용을 자유롭게 남겨주세요."
                    className="w-full bg-cream-100 border border-ink-700/10 rounded px-3 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-clay-500 transition-colors resize-none" />
                </div>
                <button type="submit" disabled={mailSending}
                  className="w-full py-3 rounded bg-clay-600 text-cream-50 text-[15px] font-medium hover:bg-clay-700 disabled:opacity-50 transition-colors">
                  {mailSending ? '보내는 중…' : '메일 보내기'}
                </button>
              </form>
            )}

            {/* 전송 완료 */}
            {mode === 'sent' && (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-3">
                <span className="w-12 h-12 rounded-full bg-clay-600/10 border border-clay-500/40 text-clay-700 text-xl flex items-center justify-center">✓</span>
                <div className="text-[16px] font-semibold text-ink-900">전달되었습니다</div>
                <p className="text-[13.5px] text-ink-500 leading-relaxed">신성진 대표가 확인 후 남겨주신 이메일로 회신드리겠습니다.</p>
                <button onClick={() => setMode('chat')} className="mt-1 text-[13.5px] text-clay-700 hover:text-clay-500 transition-colors">
                  ← 챗봇으로 돌아가기
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes chatUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes chatBreathe { 0%, 100% { box-shadow: 0 0 0 0 rgba(193,106,74,.35); } 55% { box-shadow: 0 0 0 11px rgba(193,106,74,0); } }
        .chat-breathe { animation: chatBreathe 2.8s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .chat-breathe { animation: none; } }
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
