import { useEffect, useRef, useState } from 'react'
import { site } from '../data/content'
import { useInquiry } from './InquiryModal'

export default function Nav() {
  const { openInquiry } = useInquiry()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      // scroll progress bar
      if (progressRef.current) {
        const total = document.documentElement.scrollHeight - window.innerHeight
        const pct = total > 0 ? Math.min(window.scrollY / total, 1) : 0
        progressRef.current.style.transform = `scaleX(${pct})`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: '미션', href: '#mission' },
    { label: '우리가 푸는 문제', href: '#alleyway' },
    { label: '트랙', href: '#tracks' },
    { label: '쇼케이스', href: '#showcase' },
    { label: '전문가', href: '#tutors' },
    { label: '프레임워크', href: '/framework.html' },
    { label: '블로그', href: '/blog/' },
  ]

  return (
    <>
    <div ref={progressRef} className="scroll-progress" style={{ transform: 'scaleX(0)' }} />
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream-50/85 backdrop-blur-md border-b border-ink-700/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container-editorial flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-2">
          <span className="font-serif text-lg font-semibold tracking-tight text-ink-900">
            CDSA
          </span>
          <span className="hidden md:inline text-[11px] tracking-[0.18em] text-ink-500 uppercase">
            {site.short}
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink-700 hover:text-clay-700 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={openInquiry}
            className="hidden md:inline-flex text-sm font-medium px-4 py-2 rounded-full bg-ink-900 text-cream-50 hover:bg-clay-700 transition-colors"
          >
            교육 문의
          </button>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px]"
            aria-label="메뉴 열기"
          >
            <span className={`block w-5 h-[2px] bg-ink-900 transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block w-5 h-[2px] bg-ink-900 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[2px] bg-ink-900 transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-cream-50 border-b border-ink-700/10">
          <div className="container-editorial flex flex-col py-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-sm text-ink-700 hover:text-clay-700 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => { setMenuOpen(false); openInquiry() }}
              className="mt-2 mb-2 text-sm font-medium px-4 py-2 rounded-full bg-ink-900 text-cream-50 hover:bg-clay-700 transition-colors w-full"
            >
              교육 문의
            </button>
          </div>
        </div>
      )}
    </header>
    </>
  )
}
