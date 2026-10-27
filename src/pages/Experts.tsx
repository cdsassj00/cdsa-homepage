import { useEffect } from 'react'
import Footer from '../sections/Footer'
import { ExpertDetail, ExpertPoster } from '../sections/ExpertsCore'
import { experts } from '../data/experts'

export default function Experts() {
  useEffect(() => {
    document.title = '협회의 전문가들 · CDSA'
    const id = window.location.hash.slice(1)
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [])

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-ink-700/10 bg-cream-50/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 md:px-10 h-14 flex items-center justify-between">
          <a href="/" className="font-serif text-lg font-semibold tracking-tight text-ink-900">
            CDSA
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {experts.map((e) => (
              <a key={e.slug} href={`#${e.slug}`} className="text-[13px] text-ink-700 hover:text-clay-700">
                {e.name}
              </a>
            ))}
          </nav>
          <a href="/#tutors" className="text-sm text-ink-700 hover:text-clay-700 transition-colors">
            ← 홈으로
          </a>
        </div>
      </header>

      <section className="container-editorial pt-20 pb-12 md:pt-28">
        <span className="eyebrow">EXPERT PROFILES · 2026</span>
        <h1 className="h-display text-[38px] md:text-[64px] mt-5 leading-[1.08]">
          협회의 <span className="text-clay-700">전문가들.</span>
        </h1>
        <p className="mt-6 text-ink-700 text-lg max-w-2xl leading-relaxed">
          공공·기업 현장에서 AI·데이터 교육과 컨설팅을 직접 설계하고 가르치는 다섯 명입니다.
          각자의 이력과 교육 분야, 저서를 한 지면에 정리했습니다.
        </p>
      </section>

      {experts.map((e, i) => (
        <section
          key={e.slug}
          id={e.slug}
          className={`scroll-mt-16 border-t border-ink-700/10 ${i % 2 ? 'bg-cream-100/60' : 'bg-cream-50'}`}
        >
          <div
            className={`container-editorial py-16 md:py-24 grid gap-10 md:gap-16 items-start ${
              i % 2 ? 'md:grid-cols-[1fr_minmax(0,320px)]' : 'md:grid-cols-[minmax(0,320px)_1fr]'
            }`}
          >
            <div className={`${i % 2 ? 'md:order-2' : ''}`}>
              <ExpertPoster e={e} index={i} full />
              <div className="mt-3 font-mono text-[10px] tracking-[0.2em] text-ink-400">
                PROFILE {String(i + 1).padStart(2, '0')} / {String(experts.length).padStart(2, '0')}
              </div>
            </div>
            <div className={`${i % 2 ? 'md:order-1' : ''}`}>
              <ExpertDetail e={e} />
            </div>
          </div>
        </section>
      ))}

      <Footer />
    </div>
  )
}
