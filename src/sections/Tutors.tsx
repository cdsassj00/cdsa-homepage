import ExpertsCore from './ExpertsCore'
import { tutors } from '../data/content'
import { experts } from '../data/experts'

const coreNames = new Set(experts.map((e) => e.name))
const network = tutors.filter((t) => !coreNames.has(t.name))

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

        {/* 함께하는 전문가 네트워크 */}
        <div className="mt-20 bg-clay-800 text-cream-50 p-8 md:p-12 relative overflow-hidden">
          <div aria-hidden className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-clay-600/30 blur-3xl" />
          <div className="relative flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <span className="font-mono text-[11px] tracking-[0.2em] text-clay-300 uppercase">Expert Network</span>
              <h3 className="font-serif text-[26px] md:text-[32px] mt-3 leading-tight">함께하는 분야별 전문가</h3>
            </div>
            <p className="text-[13.5px] text-cream-200/75 max-w-sm leading-relaxed">
              정책·BI·스마트제조·클라우드 현장의 전문가가 과정 설계와 출강에 함께합니다.
            </p>
          </div>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-cream-50/10">
            {network.map((t) => (
              <div key={t.name} className="bg-clay-800 p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={t.photo}
                    alt={t.name}
                    loading="lazy"
                    className="w-16 h-16 rounded-full object-cover object-top border border-cream-50/20 grayscale-[0.2]"
                  />
                  <div>
                    <div className="font-serif text-[20px] leading-none">{t.name}</div>
                    <div className="text-[12px] text-clay-300 mt-1.5">{t.role}</div>
                  </div>
                </div>
                <p className="text-[13px] text-cream-200/85 leading-relaxed mt-5">{t.headline}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {t.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10.5px] px-2 py-0.5 rounded-full border border-cream-50/20 text-cream-100/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
