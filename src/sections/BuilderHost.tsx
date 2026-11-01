import { lazy, Suspense, useEffect, useState } from 'react'
import { onOpenBuilder } from './floatingBus'

export const LazyBuilder = lazy(() => import('./CurriculumBuilder'))

/** 홈에서 어느 버튼으로든 빌더를 팝업으로 연다. 코드는 처음 열 때 내려받는다. */
export default function BuilderHost() {
  const [open, setOpen] = useState(false)

  useEffect(() => onOpenBuilder(() => setOpen(true)), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[96] bg-ink-900/75 backdrop-blur-sm flex items-center justify-center md:p-6"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="커리큘럼 빌더"
        className="w-full h-full md:h-[min(880px,100%)] max-w-[1320px] overflow-hidden bg-cream-50 md:border border-ink-700/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Suspense fallback={<p className="py-20 text-center text-[14px] text-ink-500">빌더를 여는 중입니다</p>}>
          <LazyBuilder onClose={() => setOpen(false)} />
        </Suspense>
      </div>
    </div>
  )
}
