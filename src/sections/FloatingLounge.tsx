/**
 * ExecutiveLoungeStrip
 * Full-width editorial banner between Hero and Mission.
 * Dark background + gold serif + reflected-light shimmer (6s loop).
 * Not floating — integrated into page flow so it doesn't clutter the viewport corners.
 */
export default function ExecutiveLoungeStrip() {
  return (
    <a
      href="/executive-lounge.html"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="경영자 프라이빗 AI 라운지 열기"
      className="relative block w-full floating-lounge-shimmer border-y border-[#C9A96A]/25 group"
    >
      <div className="container-editorial flex items-center justify-between gap-4 py-3 md:py-4">
        <div className="flex items-center gap-2.5 md:gap-4 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A] shadow-[0_0_10px_#C9A96A] shrink-0" />
          <span className="hidden sm:inline font-serif italic text-[11px] md:text-[13px] tracking-[0.22em] text-[#C9A96A]/65 uppercase shrink-0">
            Executive
          </span>
          <span className="font-serif text-[13px] md:text-[16px] font-medium text-[#C9A96A] tracking-[0.02em] truncate">
            경영자 프라이빗 AI 라운지
          </span>
        </div>
        <span className="font-serif italic text-[11px] md:text-[13px] text-[#C9A96A] tracking-[0.15em] group-hover:translate-x-1 transition-transform shrink-0">
          열기 →
        </span>
      </div>
    </a>
  )
}
