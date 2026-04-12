// Editorial SVG illustration of the "Highway vs Alleyway" metaphor.
// Vector-only, scales infinitely, no 3D runtime, no animation battery drain.
// The thick horizontal band is the national "highway" — 거시 혁신.
// The thin winding line branching up-right is the "alleyway" — where the real work happens.
// Buildings, tagged nodes, and floating annotation labels evoke an architectural diagram.

export default function HeroArt() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1600 900"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="paper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAF7F1" />
            <stop offset="55%" stopColor="#F5F0E6" />
            <stop offset="100%" stopColor="#EEE6D4" />
          </linearGradient>
          <linearGradient id="highway" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6E3710" stopOpacity="0" />
            <stop offset="20%" stopColor="#8B4A18" />
            <stop offset="50%" stopColor="#C17A3B" />
            <stop offset="80%" stopColor="#8B4A18" />
            <stop offset="100%" stopColor="#6E3710" stopOpacity="0" />
          </linearGradient>
          <filter id="grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feColorMatrix values="0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.08 0" />
          </filter>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.9" fill="#C17A3B" fillOpacity="0.22" />
          </pattern>
        </defs>

        {/* Paper background */}
        <rect width="1600" height="900" fill="url(#paper)" />
        <rect width="1600" height="900" filter="url(#grain)" />

        {/* Background dot grid — engineering drawing feel */}
        <rect width="1600" height="900" fill="url(#dots)" />

        {/* Decorative circles (celestial diagram motif) */}
        <g stroke="#8B4A18" strokeOpacity="0.18" fill="none">
          <circle cx="1240" cy="420" r="320" />
          <circle cx="1240" cy="420" r="240" />
          <circle cx="1240" cy="420" r="160" strokeOpacity="0.28" />
          <circle cx="1240" cy="420" r="80" strokeOpacity="0.35" />
          <line x1="920" y1="420" x2="1560" y2="420" strokeOpacity="0.15" />
          <line x1="1240" y1="100" x2="1240" y2="740" strokeOpacity="0.15" />
        </g>

        {/* Highway (고속도로) — thick horizontal band with center line */}
        <g>
          <rect x="0" y="640" width="1600" height="44" fill="url(#highway)" opacity="0.9" />
          <line
            x1="40" y1="662" x2="1560" y2="662"
            stroke="#FAF7F1" strokeWidth="3" strokeDasharray="22 30" strokeOpacity="0.7"
          />
          {/* Highway label */}
          <g transform="translate(120, 620)">
            <line x1="0" y1="0" x2="44" y2="0" stroke="#6E3710" strokeWidth="1" />
            <text x="52" y="4" fontFamily="'Noto Serif KR', serif" fontSize="16" fontStyle="italic" fill="#6E3710">
              국가 고속도로 · Macro Infrastructure
            </text>
          </g>
          <text x="120" y="716" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="2" fill="#8A7560">
            SOVEREIGN AI · FOUNDATION MODELS · GPU · PUBLIC PLATFORMS
          </text>
        </g>

        {/* Alleyway (골목길) — thin curved line branching up-right from highway */}
        <g>
          <path
            d="M 820 662 C 860 600, 900 520, 940 460 S 1040 330, 1120 280 S 1220 240, 1280 220"
            fill="none"
            stroke="#8B4A18"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Markers along the alley */}
          <circle cx="820" cy="662" r="6" fill="#C17A3B" />
          <circle cx="940" cy="460" r="4" fill="#C17A3B" />
          <circle cx="1120" cy="280" r="4" fill="#C17A3B" />
          <circle cx="1280" cy="220" r="10" fill="#FAF7F1" stroke="#C17A3B" strokeWidth="3" />

          {/* Lantern at the end of alley — the point of light */}
          <g transform="translate(1280, 220)">
            <circle r="30" fill="#F4DBB9" fillOpacity="0.35" />
            <circle r="18" fill="#F4DBB9" fillOpacity="0.6" />
            <circle r="8" fill="#E3A872" />
          </g>

          {/* Alley label */}
          <g transform="translate(1310, 216)">
            <line x1="0" y1="0" x2="44" y2="0" stroke="#6E3710" strokeWidth="1" />
            <text x="52" y="4" fontFamily="'Noto Serif KR', serif" fontSize="16" fontStyle="italic" fill="#6E3710">
              골목길 · the Alleyway
            </text>
          </g>
          <text x="1310" y="256" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="2" fill="#8A7560">
            WHERE THE REAL WORK HAPPENS
          </text>
        </g>

        {/* Low-poly building silhouettes along the alleyway */}
        <g fill="#6E3710" fillOpacity="0.85">
          <rect x="860" y="520" width="28" height="44" />
          <rect x="896" y="500" width="22" height="64" />
          <rect x="924" y="510" width="18" height="54" />
          <rect x="980" y="430" width="26" height="50" />
          <rect x="1012" y="410" width="20" height="70" />
          <rect x="1060" y="340" width="24" height="48" />
          <rect x="1090" y="322" width="18" height="66" />
          <rect x="1176" y="260" width="20" height="42" />
          <rect x="1202" y="248" width="16" height="54" />
        </g>
        <g fill="#C17A3B" fillOpacity="0.7">
          <rect x="890" y="544" width="28" height="20" />
          <rect x="930" y="540" width="20" height="24" />
          <rect x="1000" y="454" width="24" height="26" />
          <rect x="1080" y="364" width="22" height="24" />
          <rect x="1196" y="284" width="18" height="18" />
        </g>
        {/* Small highway buildings */}
        <g fill="#8B4A18" fillOpacity="0.55">
          <rect x="80" y="596" width="30" height="44" />
          <rect x="120" y="586" width="26" height="54" />
          <rect x="156" y="600" width="20" height="40" />
          <rect x="200" y="580" width="32" height="60" />
          <rect x="280" y="590" width="22" height="50" />
          <rect x="320" y="600" width="26" height="40" />
          <rect x="420" y="586" width="28" height="54" />
          <rect x="480" y="596" width="24" height="44" />
          <rect x="560" y="582" width="30" height="58" />
          <rect x="620" y="598" width="22" height="42" />
          <rect x="680" y="588" width="26" height="52" />
          <rect x="740" y="600" width="22" height="40" />
        </g>

        {/* Floor line / horizon */}
        <line x1="0" y1="684" x2="1600" y2="684" stroke="#6E3710" strokeOpacity="0.2" strokeWidth="1" />

        {/* Top-right architectural annotation */}
        <g transform="translate(1380, 80)" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1.5" fill="#8A7560">
          <line x1="0" y1="0" x2="140" y2="0" stroke="#8A7560" strokeOpacity="0.4" />
          <text y="14">FIG.01 — 고속도로 vs 골목길</text>
          <text y="28">SCALE · 1:N</text>
          <text y="42">MEDIUM · 생활형·실무형 AI</text>
        </g>

        {/* Bottom-left annotation */}
        <g transform="translate(60, 820)" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1.5" fill="#8A7560">
          <line x1="0" y1="-12" x2="60" y2="-12" stroke="#C17A3B" strokeWidth="1.5" />
          <text>COMPILED FROM · 행정안전부 · 과기정통부 · CDSA FIELD NOTES</text>
        </g>
      </svg>
    </div>
  )
}
