import { useEffect } from 'react'
import CurriculumSheet from '../sections/CurriculumSheet'
import Footer from '../sections/Footer'

export default function Modules() {
  useEffect(() => {
    document.title = '실습모듈 다양하게 살펴보기 · CDSA'
  }, [])

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-ink-700/10 bg-cream-50/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 md:px-10 h-14 flex items-center justify-between">
          <a href="/" className="font-serif text-lg font-semibold tracking-tight text-ink-900">
            CDSA
          </a>
          <a href="/#curriculum" className="text-sm text-ink-700 hover:text-clay-700 transition-colors">
            ← AI 활용 매트릭스로 돌아가기
          </a>
        </div>
      </header>
      <CurriculumSheet />
      <Footer />
    </div>
  )
}
