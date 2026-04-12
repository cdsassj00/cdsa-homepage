import { useEffect, useRef } from 'react'

/**
 * Intersection Observer 기반 스크롤 reveal.
 * 뷰포트 진입 시 `data-revealed="true"` 속성을 세팅.
 * CSS에서 [data-revealed] 셀렉터로 애니메이션 트리거.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // prefers-reduced-motion 존중
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.setAttribute('data-revealed', 'true')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-revealed', 'true')
          observer.unobserve(el) // 한 번만 트리거
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return ref
}
