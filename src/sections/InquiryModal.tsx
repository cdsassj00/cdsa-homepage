import { createContext, useCallback, useContext, useState } from 'react'

interface Ctx {
  // 문자열이면 문의 내용 프리필로 사용. onClick={openInquiry}처럼 이벤트가 넘어와도 무시.
  openInquiry: (prefill?: unknown) => void
}

const InquiryCtx = createContext<Ctx>({ openInquiry: () => {} })

export function useInquiry() {
  return useContext(InquiryCtx)
}

const COURSE_OPTIONS = [
  { value: '기타', label: '기업·기관 맞춤 교육 / 컨설팅 / 기타' },
  { value: 'AI챔피언 강사양성', label: 'AI챔피언 전문강사 양성과정' },
  { value: '취업준비 AI역량강화', label: '취업준비 AI 역량강화 과정' },
]

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [prefill, setPrefill] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const openInquiry = useCallback((message?: unknown) => {
    setPrefill(typeof message === 'string' ? message : '')
    setSent(false)
    setOpen(true)
    if (typeof window !== 'undefined' && (window as any).oaiq) {
      (window as any).oaiq('measure', 'lead_created', { type: 'customer_action' })
    }
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setSending(true)
    try {
      const r = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: fd.get('course'),
          name: fd.get('name'),
          email: fd.get('email'),
          org: fd.get('org'),
          phone: fd.get('phone'),
          message: fd.get('message'),
          website: fd.get('website'),
        }),
      })
      if (!r.ok) throw new Error(String(r.status))
      setSent(true)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'inquiry_submitted')
      }
    } catch {
      alert('전송에 실패했습니다. 잠시 후 다시 시도해 주시거나 sjshin@cdsa.kr 로 메일 주세요.')
    } finally {
      setSending(false)
    }
  }

  const inputCls =
    'w-full bg-cream-100 border border-ink-700/10 rounded px-3.5 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-clay-500 transition-colors'

  return (
    <InquiryCtx.Provider value={{ openInquiry }}>
      {children}

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-ink-900/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-cream-50 rounded-sm w-full max-w-xl border border-ink-700/20 shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-700/10">
              <span className="font-serif text-[17px] text-ink-900">교육 · 컨설팅 문의</span>
              <button
                onClick={() => setOpen(false)}
                className="text-ink-500 hover:text-ink-900 w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-200 transition-colors"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            {sent ? (
              <div className="px-8 py-14 flex flex-col items-center text-center gap-4">
                <span className="w-14 h-14 rounded-full bg-clay-600/10 border border-clay-500/40 text-clay-700 text-2xl flex items-center justify-center">✓</span>
                <div className="text-[18px] font-semibold text-ink-900">문의가 접수되었습니다</div>
                <p className="text-[14px] text-ink-500 leading-relaxed max-w-sm">
                  신성진 대표가 직접 확인하고 남겨주신 이메일로 1영업일 내 회신드립니다.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-2 px-6 py-2.5 rounded bg-ink-900 text-cream-50 text-[14px] hover:bg-clay-700 transition-colors"
                >
                  닫기
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="px-6 py-5 space-y-4">
                <p className="text-[13.5px] text-ink-500 leading-relaxed">
                  남겨주신 내용은 신성진 대표의 메일(sjshin@cdsa.kr)로 바로 전달되며, 입력하신 주소로 회신드립니다.
                </p>
                <div>
                  <label className="block text-[13px] font-medium text-ink-700 mb-1.5">문의 분야 *</label>
                  <select name="course" required defaultValue="기타" className={inputCls}>
                    {COURSE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-ink-700 mb-1.5">이름 *</label>
                    <input name="name" required maxLength={50} placeholder="홍길동" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-ink-700 mb-1.5">이메일 *</label>
                    <input name="email" type="email" required maxLength={100} placeholder="hong@company.co.kr" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-ink-700 mb-1.5">소속 (기관·기업)</label>
                    <input name="org" maxLength={100} placeholder="○○시청 / ○○주식회사" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-ink-700 mb-1.5">연락처</label>
                    <input name="phone" maxLength={40} placeholder="010-0000-0000" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-ink-700 mb-1.5">문의 내용 *</label>
                  <textarea
                    name="message"
                    required
                    maxLength={1500}
                    rows={5}
                    defaultValue={prefill}
                    placeholder="교육 대상·인원·희망 시기·다루고 싶은 주제를 자유롭게 남겨주세요."
                    className={`${inputCls} resize-none`}
                  />
                </div>
                {/* 허니팟 — 봇 차단용 숨은 필드 */}
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 rounded bg-clay-600 text-cream-50 text-[15px] font-medium hover:bg-clay-700 disabled:opacity-50 transition-colors"
                >
                  {sending ? '보내는 중…' : '문의 보내기'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </InquiryCtx.Provider>
  )
}
