import { Suspense, useEffect } from 'react'
import { LazyBuilder } from '../sections/BuilderHost'

export default function Builder() {
  useEffect(() => {
    document.title = '커리큘럼 빌더 · CDSA'
  }, [])

  return (
    <div className="h-dvh flex flex-col bg-cream-50">
      <header className="shrink-0 border-b border-ink-700/10">
        <div className="px-5 h-12 flex items-center justify-between">
          <a href="/" className="font-serif text-lg font-semibold tracking-tight text-ink-900">
            CDSA
          </a>
          <a href="/#curriculum" className="text-sm text-ink-700 hover:text-clay-700 transition-colors">
            ← 홈으로
          </a>
        </div>
      </header>
      <div className="flex-1 min-h-0">
        <Suspense fallback={<p className="py-20 text-center text-[14px] text-ink-500">빌더를 여는 중입니다</p>}>
          <LazyBuilder />
        </Suspense>
      </div>
    </div>
  )
}
