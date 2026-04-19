/**
 * ExecutiveLoungeStrip
 * Fixed top ribbon above the main nav — premium announcement bar pattern.
 * Dark background with a gold reflected-light shimmer sweeping every ~6s.
 */
export default function ExecutiveLoungeStrip() {
  return (
    <a
      href="/executive-lounge.html"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="경영자 프라이빗 AI 라운지 열기"
      className="fixed top-0 left-0 right-0 z-[51] h-8 md:h-9 flex floating-lounge-shimmer border-b border-[#C9A96A]/30 group"
    >
      <div className="mx-auto w-full max-w-6xl px-3 md:px-10 flex items-center justify-between gap-3 h-full">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A] shadow-[0_0_8px_#C9A96A] shrink-0" />
          <span className="hidden sm:inline font-serif italic text-[10px] md:text-[11px] tracking-[0.22em] text-[#C9A96A]/70 uppercase shrink-0">
            Executive
          </span>
          <span className="font-serif text-[12px] md:text-[14px] font-medium text-[#C9A96A] tracking-[0.01em] truncate">
            경영자 프라이빗 AI 라운지
          </span>
        </div>
        <span className="font-serif italic text-[10px] md:text-[12px] text-[#C9A96A] tracking-[0.15em] group-hover:translate-x-1 transition-transform shrink-0">
          열기 →
        </span>
      </div>
    </a>
  )
}
