import TutorFlip from './TutorFlip'

export default function Tutors() {
  return (
    <section id="tutors" className="py-28 md:py-36 bg-cream-100/60 border-y border-ink-700/10">
      <div className="container-editorial">
        <div className="max-w-2xl mb-16">
          <span className="eyebrow">THE NETWORK</span>
          <h2 className="h-display text-[36px] md:text-[56px] mt-5">
            협회의 전문가들.
          </h2>
          <p className="mt-5 text-ink-700 text-lg">
            데이터 분석·AI를 전공한 석박사급과 대기업 임원 출신의 실전 전문가들이 각 분야의
            문제를 함께 풉니다. 왼쪽 썸네일을 누르면 카드가 플립됩니다.
          </p>
        </div>

        <TutorFlip />

      </div>
    </section>
  )
}
