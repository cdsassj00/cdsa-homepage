import { mission } from '../data/content'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Mission() {
  const headingRef = useScrollReveal<HTMLHeadingElement>()
  const bodyRef = useScrollReveal<HTMLDivElement>(2)
  const quoteRef = useScrollReveal<HTMLElement>(4)
  return (
    <section id="mission" className="py-28 md:py-40 border-t border-ink-700/10">
      <div className="container-editorial">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <span className="eyebrow">{mission.eyebrow}</span>
            <div className="rule mt-6" />
          </div>
          <div className="md:col-span-8">
            <h2 ref={headingRef} className="scroll-reveal-left h-display text-[32px] md:text-[52px] whitespace-pre-line">
              {mission.heading}
            </h2>
            <div ref={bodyRef} className="scroll-reveal mt-10 space-y-6 text-[17px] md:text-lg text-ink-700 leading-[1.85] max-w-2xl font-serif">
              {mission.body.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <figure ref={quoteRef} className="scroll-reveal mt-12 pl-6 border-l-2 border-clay-500 relative">
              <span className="absolute -left-1 -top-6 font-serif text-[72px] text-clay-500/25 leading-none select-none" aria-hidden>"</span>
              <blockquote className="font-serif italic text-xl md:text-2xl text-ink-900 leading-relaxed">
                "거시적 혁신이 고속도로라면, 우리는 골목길을 설계합니다.
                <br />
                둘 다 필요하지만, 골목길은 아무도 들어가지 않았습니다."
              </blockquote>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
