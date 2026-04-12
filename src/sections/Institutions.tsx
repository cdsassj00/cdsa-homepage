import { useMemo } from 'react'
import { institutions } from '../data/content'

/**
 * Dense dynamic word cloud — 150+ institutions packed tight.
 * Weights drive size; flex-wrap packs them like a journal contributors page;
 * each name floats gently with a unique phase so the wall breathes.
 */

const weightSizeClass = (w: number): string => {
  switch (w) {
    case 5:
      return 'text-[44px] md:text-[68px] lg:text-[84px] leading-[0.95]'
    case 4:
      return 'text-[30px] md:text-[46px] lg:text-[56px] leading-[1]'
    case 3:
      return 'text-[22px] md:text-[32px] lg:text-[38px] leading-[1.05]'
    case 2:
      return 'text-[16px] md:text-[22px] lg:text-[26px] leading-[1.1]'
    default:
      return 'text-[13px] md:text-[16px] lg:text-[18px] leading-[1.15]'
  }
}

const weightColorClass = (w: number): string => {
  switch (w) {
    case 5:
      return 'text-cream-50'
    case 4:
      return 'text-cream-50/92'
    case 3:
      return 'text-cream-100/80'
    case 2:
      return 'text-cream-200/65'
    default:
      return 'text-cream-200/45'
  }
}

// Fisher-Yates with seeded RNG — deterministic shuffle so layout is stable
function shuffled<T>(arr: T[], seed: number): T[] {
  const out = [...arr]
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export default function Institutions() {
  // Interleave so the largest names spread across the cloud instead of clustering,
  // and big words anchor visual density while small words fill the gaps.
  const items = useMemo(() => shuffled(institutions, 20260412), [])

  const total = institutions.length

  return (
    <section className="py-24 md:py-32 bg-ink-900 text-cream-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-paper opacity-[0.07] pointer-events-none" />
      {/* warm radial glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 20%, rgba(193,122,59,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,74,24,0.10) 0%, transparent 55%)',
        }}
      />

      <div className="container-editorial relative mb-12 md:mb-14">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow !text-clay-300">WHERE WE'VE TAUGHT</span>
            <h2 className="font-serif font-semibold text-[36px] md:text-[58px] text-cream-50 mt-5 leading-[1.06] tracking-tightest">
              함께한 <span className="text-clay-300">{total}+</span>개 기관.
            </h2>
            <p className="mt-5 text-cream-200/80 text-[17px] max-w-xl leading-relaxed">
              중앙정부·지자체·대기업·학계까지. 공공과 민간을 가리지 않고 현장에서
              교육하며 쌓은 노하우가 우리의 자산입니다. 다양한 산업과 규모의 조직에서
              검증된 전문가들이 함께합니다.
            </p>
          </div>
          <div className="font-mono text-[11px] tracking-[0.22em] text-cream-200/60">
            PUBLIC · CORPORATE · CITY · ACADEMY
          </div>
        </div>
      </div>

      <div className="relative px-6 md:px-10">
        <div className="mx-auto max-w-[1240px] flex flex-wrap items-baseline justify-center gap-x-4 md:gap-x-7 gap-y-2 md:gap-y-4">
          {items.map((item, i) => {
            const rot = ((i * 37) % 11) - 5
            const delay = (i % 24) * 180
            return (
              <span
                key={item.name}
                className={`font-serif tracking-tightest whitespace-nowrap inline-block cursor-default transition-all duration-300 hover:!text-clay-300 hover:scale-[1.08] cloud-word ${weightSizeClass(
                  item.w,
                )} ${weightColorClass(item.w)}`}
                style={{
                  transform: `rotate(${rot * 0.35}deg)`,
                  animationDelay: `${delay}ms`,
                }}
              >
                {item.name}
              </span>
            )
          })}
        </div>
      </div>

      <p className="container-editorial relative mt-14 text-center text-[11px] text-cream-200/45 font-mono tracking-[0.18em] uppercase">
        * 공개 가능한 실제 강의 · 자문 이력. 제안 · 입찰 단계 건은 제외.
      </p>
    </section>
  )
}
