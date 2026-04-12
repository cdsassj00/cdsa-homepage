import { useEffect, useRef } from 'react'

/**
 * 개별 요소에 붙이는 스크롤 reveal.
 * 뷰포트 진입 시 CSS class 'revealed'를 추가.
 * staggerIndex가 있으면 transition-delay를 인라인으로 세팅.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  staggerIndex = 0,
  threshold = 0.1,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('revealed')
      return
    }

    // 스태거 딜레이 적용
    if (staggerIndex > 0) {
      el.style.transitionDelay = `${staggerIndex * 80}ms`
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -30px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [staggerIndex, threshold])

  return ref
}

/**
 * 숫자 카운트업 애니메이션.
 * 뷰포트 진입 시 0에서 target까지 올라감.
 */
export function useCountUp(target: number, duration = 1800) {
  const ref = useRef<HTMLSpanElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = target.toLocaleString()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            el.textContent = Math.floor(eased * target).toLocaleString()
            if (progress < 1) requestAnimationFrame(tick)
            else el.textContent = target.toLocaleString()
          }
          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return ref
}
