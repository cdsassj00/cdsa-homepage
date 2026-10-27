import TutorFlip from './TutorFlip'
import ExpertsCore from './ExpertsCore'

export default function Tutors() {
  return (
    <section id="tutors" className="py-28 md:py-36 bg-cream-100/60 border-y border-ink-700/10">
      <div className="container-editorial">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">THE NETWORK</span>
          <h2 className="h-display text-[36px] md:text-[56px] mt-5">
            협회의 전문가들.
          </h2>
          <p className="mt-5 text-ink-700 text-lg">
            데이터 분석·AI를 전공한 석박사급과 대기업 임원 출신의 실전 전문가들이 각 분야의
            문제를 함께 풉니다. 사진을 누르면 이력이 펼쳐집니다.
          </p>
        </div>

        <ExpertsCore />

        <div className="mt-24 mb-10 flex items-baseline justify-between gap-4 border-t border-ink-700/10 pt-10">
          <span className="font-mono text-[11px] tracking-[0.2em] text-clay-700 uppercase">Expert Network · 분야별 전문가</span>
          <span className="text-[12.5px] text-ink-500">왼쪽 썸네일을 누르면 카드가 넘어갑니다</span>
        </div>
        <TutorFlip />
      </div>
    </section>
  )
}
