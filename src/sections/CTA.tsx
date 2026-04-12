import { site } from '../data/content'
import { useInquiry } from './InquiryModal'

export default function CTA() {
  const { openInquiry } = useInquiry()
  return (
    <section className="py-28 md:py-40">
      <div className="container-editorial">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="rule mx-auto mb-8" />
          <span className="eyebrow">EDUCATION · CONSULTING</span>
          <h2 className="h-display text-[40px] md:text-[68px] mt-6">
            오늘 당신 책상 위의 <br />
            <span className="text-clay-700">문제를 들려주세요.</span>
          </h2>
          <p className="mt-8 text-ink-700 text-lg max-w-2xl mx-auto leading-relaxed">
            개인·기업·공공기관의 AI Transformation, AX 전환에 도움을 받고 싶은 분들은 자유롭게
            문의해주세요. 가르치는 강사가 직접 교육을 설계하고, 컨설턴트가 직접 연락드립니다.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={openInquiry}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ink-900 text-cream-50 font-medium hover:bg-clay-700 transition-colors"
            >
              교육 · 컨설팅 문의 <span aria-hidden>→</span>
            </button>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-ink-700/30 text-ink-800 hover:border-clay-700 hover:text-clay-700 transition-colors"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
