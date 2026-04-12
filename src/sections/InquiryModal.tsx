import { createContext, useCallback, useContext, useState } from 'react'
import { site } from '../data/content'

interface Ctx {
  openInquiry: () => void
}

const InquiryCtx = createContext<Ctx>({ openInquiry: () => {} })

export function useInquiry() {
  return useContext(InquiryCtx)
}

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const openInquiry = useCallback(() => setOpen(true), [])

  return (
    <InquiryCtx.Provider value={{ openInquiry }}>
      {children}

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-ink-900/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-cream-50 rounded-sm w-full max-w-4xl overflow-hidden border border-ink-700/20 shadow-2xl flex flex-col"
            style={{ height: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-700/10 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-serif text-[15px] text-ink-900">교육 · 컨설팅 문의</span>
                <span className="text-[10px] font-mono text-ink-400 tracking-wider hidden md:inline">
                  cdsapaper.lovable.app
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={site.inquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-clay-700 hover:text-clay-800 underline underline-offset-2"
                >
                  새 탭 ↗
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="text-ink-500 hover:text-ink-900 w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-200 transition-colors"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 bg-white relative">
              <iframe
                src={site.inquiryUrl}
                title="교육 · 컨설팅 문의"
                className="absolute inset-0 w-full h-full border-0"
                style={{ transform: 'scale(0.88)', transformOrigin: 'top left', width: '113.6%', height: '113.6%' }}
              />
            </div>
          </div>
        </div>
      )}
    </InquiryCtx.Provider>
  )
}
