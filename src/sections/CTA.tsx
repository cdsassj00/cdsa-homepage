import { site } from '../data/content'
import { useInquiry } from './InquiryModal'

export default function CTA() {
  const { openInquiry } = useInquiry()
  return (
    <section className="py-28 md:py-40 bg-ink-900 text-cream-50">
      <div className="container-editorial">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="rule !bg-cream-100/40 mx-auto mb-8" />
          <span className="eyebrow !text-clay-300">EDUCATION · CONSULTING</span>
          <h2 className="h-display text-[40px] md:text-[68px] mt-6 text-cream-50">
            현장의 문제를 풀고, <br />
            <span className="text-clay-300">AI 역량을 쌓는 곳.</span>
          </h2>
          <p className="mt-8 text-cream-200/80 text-lg max-w-2xl mx-auto leading-relaxed">
            공공기관의 행정 혁신부터 기업의 업무 자동화까지.
            조직과 개인의 AI 역량을 키우고 싶다면 자유롭게 문의해주세요.
            가르치는 강사가 직접 교육을 설계하고, 컨설턴트가 직접 연락드립니다.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={openInquiry}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-cream-50 text-ink-900 font-medium hover:bg-clay-300 transition-colors"
            >
              교육 · 컨설팅 문의 <span aria-hidden>→</span>
            </button>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-cream-100/30 text-cream-100 hover:border-clay-300 hover:text-clay-300 transition-colors"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
