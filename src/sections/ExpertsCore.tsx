import { useState } from 'react'
import { experts, type Expert } from '../data/experts'

export function ExpertDetail({ e }: { e: Expert }) {
  return (
    <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-14">
      <div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-clay-700 uppercase">{e.en}</span>
        <h3 className="font-serif text-[30px] md:text-[38px] text-ink-900 mt-2 leading-tight">{e.name}</h3>
        <p className="text-[14px] text-ink-500 mt-1">{e.role}</p>
        <p className="font-serif text-[19px] md:text-[22px] text-ink-800 leading-[1.6] mt-7 border-l-2 border-clay-500 pl-5">
          {e.thesis}
        </p>
        <div className="grid grid-cols-3 gap-px bg-ink-700/10 border border-ink-700/10 mt-8">
          {e.stats.map((s) => (
            <div key={s.label} className="bg-cream-50 p-4">
              <div className="font-serif text-[24px] md:text-[28px] text-clay-700 leading-none">{s.n}</div>
              <div className="text-[11.5px] text-ink-500 mt-2 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-6">
          {e.fields.map((f) => (
            <span key={f} className="text-[12px] px-3 py-1 rounded-full border border-ink-700/15 text-ink-700 bg-cream-50">
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-7">
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-ink-400 uppercase mb-3">Career</div>
          <ul className="space-y-2">
            {e.career.map((c) => (
              <li key={c} className="text-[14px] text-ink-700 leading-relaxed pl-4 relative">
                <span className="absolute left-0 top-[0.7em] w-1.5 h-px bg-clay-600" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-ink-400 uppercase mb-3">주요 교육 기관</div>
          <p className="text-[13.5px] text-ink-600 leading-relaxed">{e.public.join(' · ')} 외</p>
        </div>
        {e.books.length > 0 && (
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-ink-400 uppercase mb-3">Books</div>
            <p className="text-[13.5px] text-ink-700 leading-relaxed">{e.books.join('  ')}</p>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href={`mailto:${e.email}`}
            className="text-[13px] text-clay-700 font-medium underline underline-offset-4 hover:text-clay-800"
          >
            {e.email}
          </a>
          {e.links?.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-ink-600 underline underline-offset-4 hover:text-clay-700"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ExpertsCore() {
  const [sel, setSel] = useState(0)
  const e = experts[sel]

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <span className="font-mono text-[11px] tracking-[0.2em] text-clay-700 uppercase">Core Five · 핵심 전문가</span>
        <a href="/experts" className="text-[13px] text-ink-700 underline underline-offset-4 hover:text-clay-700">
          전문가 프로필 전체 보기 →
        </a>
      </div>

      <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0" style={{ scrollbarWidth: 'none' }}>
        <div className="grid grid-cols-5 gap-3 md:gap-4 min-w-[720px]">
          {experts.map((x, i) => {
            const active = i === sel
            return (
              <button
                key={x.slug}
                type="button"
                onClick={() => setSel(i)}
                aria-pressed={active}
                className="group text-left"
              >
                <div
                  className={`relative aspect-[3/4.4] overflow-hidden bg-cream-200 border transition-all duration-300 ${
                    active ? 'border-clay-600 shadow-[0_18px_40px_-22px_rgba(110,55,16,0.55)]' : 'border-ink-700/10'
                  }`}
                >
                  <img
                    src={`/expert-photos/${x.slug}.webp`}
                    alt={x.name}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-500 ${
                      active ? 'grayscale-0 scale-[1.02]' : 'grayscale-[0.55] group-hover:grayscale-0'
                    }`}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-900/70 to-transparent" />
                  <div className="absolute left-3 right-3 bottom-3 text-cream-50">
                    <div className="font-serif text-[18px] md:text-[20px] leading-none">{x.name}</div>
                    <div className="font-mono text-[8.5px] tracking-[0.16em] mt-1.5 opacity-80">{x.en}</div>
                  </div>
                </div>
                <div className={`h-[2px] mt-2 transition-colors ${active ? 'bg-clay-600' : 'bg-transparent'}`} />
              </button>
            )
          })}
        </div>
      </div>

      <div key={e.slug} className="mt-10 bg-cream-50 border border-ink-700/10 p-7 md:p-10 animate-[fadeUp_0.35s_ease]">
        <ExpertDetail e={e} />
      </div>
    </div>
  )
}
