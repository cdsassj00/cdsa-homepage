/**
 * FloatingLounge
 * Mobile-only premium floating button → /executive-lounge.html.
 * Dark background with a subtle gold shimmer band that sweeps across
 * every ~6s, evoking "reflected light" on a polished surface.
 */
export default function FloatingLounge() {
  return (
    <a
      href="/executive-lounge.html"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="경영자 AI 라운지"
      className="md:hidden fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#C9A96A]/45 text-[11px] font-serif font-semibold text-[#C9A96A] tracking-[0.08em] shadow-[0_8px_24px_rgba(0,0,0,0.28)] floating-lounge-shimmer"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A] shadow-[0_0_8px_#C9A96A]" />
      경영자 AI 라운지
    </a>
  )
}
