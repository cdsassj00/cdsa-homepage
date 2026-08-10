import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import type { Mesh } from 'three'

// ─────────────────────────────────────────────────────────────────
// CDSA 웨비나 1호 — 실무자를 위한 AI 에이전트와 바이브코딩
// 2026-05-23 · docs/superpowers/specs/2026-04-17-cdsa-webinar-0523-design.md
// 8유형 원전: cdsa.kr/blog/working-governance.html · 매핑은 확정 전.
// ─────────────────────────────────────────────────────────────────

const webinarInfo = {
  dateISO: '2026-05-23T13:00:00+09:00',
  dateDisplay: '2026.05.23 SAT',
  time: '13:00 – 17:40 KST',
  format: 'LIVE 온라인 웨비나',
  seats: '선착순 200석',
  price: '무료 · 직장 이메일 필수',
  deadline: '2026-05-21 23:59',
}

type Speaker = {
  key: string
  name: string
  role: string
  agent: string
  agentNote: string
  stack: string
  types: number[]
  pitch: string
  initial: string
}

const speakers: Speaker[] = [
  {
    key: 'lee',
    name: '이중균',
    role: '한국야쿠르트 前 데이터센터장',
    agent: 'Google Antigravity',
    agentNote: 'AX 컨설턴트',
    stack: 'HTML · CSS · JS',
    types: [1],
    pitch: '브라우저 단일 HTML 파일 하나로 현장 도구를 만들어 USB로 행정망에 들고 들어가는 시연.',
    initial: '李',
  },
  {
    key: 'hyun',
    name: '현중균',
    role: 'Intel AI4FW Facilitator',
    agent: 'VSCode + GitHub Copilot',
    agentNote: '스마트워크 퍼실리테이터',
    stack: 'Desktop · Ollama',
    types: [3, 5],
    pitch: 'PyInstaller·Electron 단일 실행 파일과 Ollama 로컬 LLM을 가장 익숙한 IDE 조합으로 묶어낸다.',
    initial: '玄',
  },
  {
    key: 'kim-ty',
    name: '김태유',
    role: 'KPMG AX전략 이사',
    agent: 'OPEN CLAW',
    agentNote: 'AX 컨설턴트 헤드',
    stack: 'Python',
    types: [2],
    pitch: 'OPEN CLAW로 Python 오프라인 패키징 — 외부망에서 받아 폐쇄망에서 돌리는 워크플로를 한 번에.',
    initial: '金',
  },
  {
    key: 'kim-yj',
    name: '김용재',
    role: '국가공인 AICE전문강사',
    agent: 'Codex',
    agentNote: 'AI 리터러시 전문가',
    stack: 'Node.js · OSS',
    types: [4, 8],
    pitch: 'OpenAI Codex로 node_modules 폴더째 이관과 사내 오픈소스 공공 저장소를 설계.',
    initial: '金',
  },
  {
    key: 'shin',
    name: '신성진',
    role: '행안부·과기정통부 자문위원',
    agent: 'Claude Code · Open Code · Goose',
    agentNote: '바이브코딩 전문가',
    stack: 'VBA · Agentic',
    types: [6, 7],
    pitch: 'Claude Code·Open Code·Goose 세 가지 하네스를 오가며 Excel VBA 한 셀 AI 주입과 에이전트형 바이브코딩을 한 번에 시연.',
    initial: '申',
  },
]

type VibeType = { n: number; name: string; sub: string; tag: string }

// 원전: https://cdsa.kr/blog/working-governance.html (민첩한 AI 거버넌스 8유형)
const vibeTypes: VibeType[] = [
  { n: 1, name: 'Browser · Single File', sub: '브라우저만 있으면 동작. 라이브러리는 파일 안에 그대로 심는다.', tag: 'HTML·CSS·JS' },
  { n: 2, name: 'Python · Offline Packaging', sub: '외부망에서 받아 내부망에서 실행.', tag: 'Python·pip' },
  { n: 3, name: 'Desktop · Standalone Binary', sub: 'PyInstaller·Electron으로 단일 실행 파일.', tag: 'Electron·EXE' },
  { n: 4, name: 'Node.js · node_modules', sub: '폴더째 들고 들어가 내부망에서 수천 라이브러리 사용.', tag: 'Node.js' },
  { n: 5, name: 'Local LLM · Ollama', sub: '1B·2B 모델이면 CPU만으로 돌아간다.', tag: 'Ollama' },
  { n: 6, name: 'Legacy × LLM · Excel VBA', sub: '=AI("이 민원을 3줄 요약")이면 된다.', tag: 'Excel·VBA' },
  { n: 7, name: 'Agentic · Harness', sub: '에이전트가 파일을 읽고 수정하며 함께 일한다.', tag: 'Claude Code·Codex' },
  { n: 8, name: 'Ecosystem · Public Repository', sub: '검증된 오픈소스만 모아놓는 공공 소스 저장소.', tag: 'GitHub·MCP' },
]

// ─────────────────────────────────────────────────────────────────
// 3D watermark — pentagonal constellation (5 agents)
// ─────────────────────────────────────────────────────────────────

function Pentagon() {
  const group = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.rotation.z = t * 0.04
  })
  return (
    <mesh ref={group} position={[0, 0, 0]}>
      <torusGeometry args={[2.4, 0.005, 8, 5]} />
      <meshStandardMaterial color="#6E3710" roughness={0.8} transparent opacity={0.5} />
    </mesh>
  )
}

function AgentOrb({ index, total }: { index: number; total: number }) {
  const ref = useRef<Mesh>(null)
  const baseAngle = (Math.PI * 2 * index) / total - Math.PI / 2
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const r = 2.4 + Math.sin(t * 0.4 + index) * 0.08
    ref.current.position.x = Math.cos(baseAngle + t * 0.06) * r
    ref.current.position.y = Math.sin(baseAngle + t * 0.06) * r
    ref.current.rotation.y = t * 0.1 + index
    ref.current.rotation.x = t * 0.08
  })
  const colors = ['#C17A3B', '#8B4A18', '#A85F25', '#6E3710', '#E3A872']
  return (
    <mesh ref={ref} scale={0.55}>
      <icosahedronGeometry args={[1, 12]} />
      <MeshDistortMaterial
        color={colors[index % colors.length]}
        distort={0.35}
        speed={1 + index * 0.15}
        roughness={0.48}
        metalness={0.12}
      />
    </mesh>
  )
}

function CoreBlob() {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t * 0.05
    ref.current.rotation.x = Math.sin(t * 0.2) * 0.2
  })
  return (
    <mesh ref={ref} scale={1.2}>
      <icosahedronGeometry args={[1, 24]} />
      <MeshDistortMaterial
        color="#C17A3B"
        distort={0.5}
        speed={0.9}
        roughness={0.45}
        metalness={0.1}
      />
    </mesh>
  )
}

// ─────────────────────────────────────────────────────────────────
// Countdown
// ─────────────────────────────────────────────────────────────────

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = new Date(target).getTime() - now
  const clamped = Math.max(diff, 0)
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24))
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((clamped / (1000 * 60)) % 60)
  const seconds = Math.floor((clamped / 1000) % 60)
  return { days, hours, minutes, seconds, past: diff < 0 }
}

// ─────────────────────────────────────────────────────────────────
// Section: Top mini-nav
// ─────────────────────────────────────────────────────────────────

function WebinarNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream-50/80 backdrop-blur-md border-b border-ink-700/10">
      <div className="container-editorial flex items-center justify-between h-14">
        <a href="/" className="flex items-center gap-2">
          <span className="font-serif text-base font-semibold text-ink-900">CDSA</span>
          <span className="hidden md:inline text-[10px] tracking-[0.22em] text-ink-500 uppercase">
            한국데이터사이언티스트협회
          </span>
        </a>
        <nav className="flex items-center gap-5 text-xs md:text-sm">
          <a href="#speakers" className="text-ink-700 hover:text-clay-700 transition-colors">
            출연진
          </a>
          <a href="#matrix" className="text-ink-700 hover:text-clay-700 transition-colors">
            매트릭스
          </a>
          <a href="#timeline" className="text-ink-700 hover:text-clay-700 transition-colors">
            타임라인
          </a>
          <a
            href="#register"
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-ink-900 text-cream-50 text-xs md:text-sm font-medium hover:bg-clay-700 transition-colors"
          >
            신청하기
          </a>
        </nav>
      </div>
    </header>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: Hero
// ─────────────────────────────────────────────────────────────────

function Hero() {
  const { days, hours, minutes, seconds, past } = useCountdown(webinarInfo.dateISO)
  return (
    <section id="top" className="relative overflow-hidden" style={{ minHeight: '100svh' }}>
      {/* warm paper glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 28%, rgba(193,122,59,0.18) 0%, transparent 55%), radial-gradient(ellipse at 18% 82%, rgba(139,74,24,0.12) 0%, transparent 60%)',
        }}
      />

      {/* 3D watermark constellation */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.36, mixBlendMode: 'multiply' }}
      >
        <Canvas
          camera={{ position: [0, 0, 7.6], fov: 48 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[6, 6, 5]} intensity={1.15} color="#FAF7F1" />
          <directionalLight position={[-5, -2, 3]} intensity={0.4} color="#F4DBB9" />
          <pointLight position={[3, -2, 4]} intensity={0.35} color="#C17A3B" />
          <Suspense fallback={null}>
            <group>
              <CoreBlob />
              <Pentagon />
              {speakers.map((_, i) => (
                <AgentOrb key={i} index={i} total={speakers.length} />
              ))}
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* legibility veil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(250,247,241,0.72) 0%, rgba(250,247,241,0.45) 48%, rgba(250,247,241,0.1) 78%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="container-editorial relative z-10 pt-32 md:pt-40 pb-24">
        <div className="max-w-[58rem]">
          <div className="flex items-center gap-3 mb-6">
            <span className="rule" />
            <span className="eyebrow">LIVE WEBINAR · SIGNATURE 01</span>
          </div>

          <h1 className="h-display text-[34px] md:text-[56px] lg:text-[72px]">
            누구나 따라하는,
            <br />
            <span className="text-clay-700">AI 에이전트로 바이브코딩.</span>
          </h1>

          <p className="mt-7 font-serif text-[20px] md:text-[28px] text-ink-900/85 leading-[1.4] max-w-3xl">
            로컬·오프라인·행정망 <span className="highlight">바이브코딩 여덟 유형</span>,
            <br className="hidden md:inline" />
            다섯 리더의 라이브 쇼케이스.
          </p>

          <p className="mt-5 text-[15px] md:text-[17px] text-ink-700 max-w-2xl leading-relaxed">
            한국데이터사이언티스트협회의 시그니처 웨비나 1호. 다섯 리더가 각기 다른 AI
            에이전트와 스택으로 현장 실무자가 월요일 아침에 바로 꺼내 쓸 수 있는
            구현 지도와 네 장 로드맵 워크시트를 같이 펼칩니다.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 md:gap-4">
            <a
              href="#register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-ink-900 text-cream-50 text-sm md:text-base font-medium hover:bg-clay-700 transition-colors"
            >
              신청하기
              <span aria-hidden>→</span>
            </a>
            <a
              href="#timeline"
              className="btn-outline px-7 py-3.5 text-sm md:text-base"
            >
              강의계획 미리보기
            </a>
          </div>

          {/* Meta strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-ink-700/10 border border-ink-700/10 rounded-sm max-w-3xl">
            {[
              { label: 'DATE', value: webinarInfo.dateDisplay },
              { label: 'TIME', value: webinarInfo.time },
              { label: 'FORMAT', value: webinarInfo.format },
              { label: 'PRICE', value: webinarInfo.price },
            ].map((m) => (
              <div key={m.label} className="bg-cream-50 px-4 py-4">
                <div className="text-[10px] font-mono tracking-[0.22em] text-clay-600">{m.label}</div>
                <div className="mt-1 text-sm md:text-[15px] text-ink-900 font-serif">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Countdown */}
          <div className="mt-8 flex items-baseline gap-3 font-mono text-ink-700">
            <span className="text-[10px] tracking-[0.22em] uppercase text-clay-600">COUNTDOWN</span>
            {past ? (
              <span className="text-sm text-ink-500">이미 끝났거나 진행 중인 회차입니다.</span>
            ) : (
              <span className="text-sm md:text-base">
                D-{String(days).padStart(2, '0')} ·{' '}
                {String(hours).padStart(2, '0')}시{' '}
                {String(minutes).padStart(2, '0')}분{' '}
                {String(seconds).padStart(2, '0')}초
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute left-0 right-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-cream-50 pointer-events-none z-[2]" />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: For Whom
// ─────────────────────────────────────────────────────────────────

function ForWhom() {
  const personas = [
    {
      eyebrow: 'PERSONA 01',
      title: '기안서 앞에서 멈춘 기획자',
      body: '경영진이 "우리도 AI 에이전트 한번 도입해보자" 했을 때 말문이 막히는 분. 참고할 문장이 없고, 도구 이름만 알 뿐 조직에 어떻게 풀어낼지 그림이 안 그려집니다.',
    },
    {
      eyebrow: 'PERSONA 02',
      title: '혼자만 쓰는 DS·개발자',
      body: '개인적으로는 이미 여러 에이전트를 써보지만, 팀장·경영진 앞에서 설명할 공통 언어가 없어 조직 전파가 막혀 있는 실무자.',
    },
    {
      eyebrow: 'PERSONA 03',
      title: '폐쇄망에서 시작해야 하는 담당자',
      body: '보안 정책상 외부 AI SaaS를 못 쓰는 공공·금융·의료 현장 담당자. 로컬·오프라인·행정망에서 돌아가는 그림이 있어야 비로소 움직일 수 있습니다.',
    },
  ]
  return (
    <section className="py-28 md:py-36 border-t border-ink-700/10">
      <div className="container-editorial">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="rule" />
            <span className="eyebrow">FOR WHOM</span>
          </div>
          <h2 className="h-display text-[36px] md:text-[56px]">
            이 웨비나가 말하는 세 사람.
          </h2>
          <p className="mt-5 text-ink-700 text-[15px] md:text-[17px] leading-relaxed">
            장면으로 설명합니다. 셋 중 하나라도 자기 얘기라면, 자리는 이미 당신 것입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-ink-700/10 border border-ink-700/10 rounded-sm">
          {personas.map((p) => (
            <div key={p.eyebrow} className="bg-cream-50 hover:bg-cream-100 transition-colors p-8 md:p-10">
              <div className="text-[10px] font-mono tracking-[0.22em] text-clay-600">{p.eyebrow}</div>
              <h3 className="mt-4 font-serif text-[22px] md:text-[26px] text-ink-900 leading-tight">
                {p.title}
              </h3>
              <p className="mt-4 text-[14px] md:text-[15px] text-ink-700 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[14px] md:text-[15px] text-ink-500 font-serif italic max-w-2xl">
          반대로, 최신 모델 벤치마크 수치와 파워 프롬프트 팁 단품을 찾는 분에겐 시간 낭비입니다.
          이 세션의 주제는 "실무자가 조직을 설득하는 언어"입니다.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: Monday scene
// ─────────────────────────────────────────────────────────────────

function MondayScene() {
  return (
    <section className="relative py-28 md:py-36 bg-ink-900 text-cream-50 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          background:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 80% 20%, rgba(227,168,114,0.12) 0%, transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(193,122,59,0.08) 0%, transparent 60%)',
        }}
      />
      <div className="container-editorial relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="block h-px w-12 bg-cream-200/60" />
          <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-clay-300">THE MONDAY</span>
        </div>
        <h2 className="font-serif font-semibold text-[32px] md:text-[54px] leading-[1.12] tracking-tightest max-w-4xl">
          이 오후가 끝나면, 월요일 아침 09:00.
        </h2>
        <div className="mt-10 max-w-3xl font-serif text-[19px] md:text-[24px] leading-[1.55] text-cream-100">
          <p>
            팀장이 보낸 "우리도 에이전트 한번 해보자" 메일 앞에서 검색창부터 열지 않습니다.
            전달받은 <span className="text-clay-300">네 장짜리 로드맵 워크시트</span>를 꺼내
            자신의 팀 맥락에 맞춰 칸을 채우고, 다음 보고 어젠다 세 개를 적어 내려갑니다.
          </p>
          <p className="mt-7">
            팀장이 "근데 이거 우리 보안 환경에서 돼?"라고 물으면 흔들리지 않습니다.
            <span className="text-clay-300"> 행정망에서도 돌아가는 CLI 바이브코딩 사례</span>를
            직접 본 오후가 있기 때문입니다.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: Speakers
// ─────────────────────────────────────────────────────────────────

function Speakers() {
  return (
    <section id="speakers" className="py-28 md:py-36 border-t border-ink-700/10">
      <div className="container-editorial">
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="rule" />
            <span className="eyebrow">THE LINEUP</span>
          </div>
          <h2 className="h-display text-[36px] md:text-[56px]">
            다섯 리더, 다섯 에이전트.
          </h2>
          <p className="mt-5 text-ink-700 text-[15px] md:text-[17px] leading-relaxed">
            같은 주제를 다섯 개의 다른 도구로 어떻게 푸는지 한자리에 펼칩니다. 이것이
            협회의 전문가 네트워크가 가진 스펙트럼입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-px bg-ink-700/10 border border-ink-700/10 rounded-sm">
          {speakers.map((s) => (
            <div
              key={s.key}
              className="bg-cream-50 hover:bg-cream-100 transition-colors p-6 md:p-7 flex flex-col h-full"
            >
              <div className="flex items-center gap-3 h-[56px]">
                <div className="w-12 h-12 rounded-sm bg-ink-900 text-cream-50 font-serif text-xl grid place-content-center shrink-0">
                  {s.initial}
                </div>
                <div className="min-w-0">
                  <div className="font-serif text-[19px] md:text-[22px] text-ink-900 leading-tight truncate">
                    {s.name}
                  </div>
                  <div className="text-[11px] font-mono tracking-[0.18em] uppercase text-clay-600 mt-0.5">
                    {s.role}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-ink-700/10">
                <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-ink-500">
                  AGENT
                </div>
                <div className="mt-1 font-serif text-[16px] text-ink-900 leading-tight min-h-[44px]">
                  {s.agent}
                </div>
                <div className="text-[11px] font-mono text-ink-500 mt-0.5 min-h-[16px]">
                  {s.agentNote}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-ink-500">
                  STACK · TYPES
                </div>
                <div className="mt-1 text-[13px] text-ink-700 min-h-[40px]">
                  <span className="font-mono">{s.stack}</span>
                  <div className="font-mono text-clay-700 mt-0.5">
                    {s.types.map((t) => `T${String(t).padStart(2, '0')}`).join(' · ')}
                  </div>
                </div>
              </div>

              <p className="mt-4 pt-4 border-t border-ink-700/10 text-[13px] text-ink-700 leading-relaxed">
                {s.pitch}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: Matrix (8유형 × 5 에이전트)
// ─────────────────────────────────────────────────────────────────

function Matrix() {
  const ownerOf = useMemo(() => {
    const map = new Map<string, Speaker>()
    speakers.forEach((s) => s.types.forEach((t) => map.set(`${t}-${s.key}`, s)))
    return (typeN: number, key: string) => map.get(`${typeN}-${key}`)
  }, [])

  return (
    <section id="matrix" className="py-28 md:py-36 bg-cream-100/60 border-y border-ink-700/10">
      <div className="container-editorial">
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="rule" />
            <span className="eyebrow">THE MAP</span>
          </div>
          <h2 className="h-display text-[36px] md:text-[56px]">
            여덟 유형 × 다섯 에이전트.
          </h2>
          <p className="mt-5 text-ink-700 text-[15px] md:text-[17px] leading-relaxed">
            민첩한 AI 거버넌스가 정의한 로컬·오프라인 바이브코딩 8유형을 세로축, 다섯
            에이전트를 가로축에 놓고 누가 무엇을 어떤 스택으로 푸는지 한 장에 펼칩니다.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table
            className="w-full min-w-[900px] border-collapse bg-cream-50 border border-ink-700/15"
            style={{ tableLayout: 'fixed' }}
          >
            <colgroup>
              <col style={{ width: '26%' }} />
              {speakers.map((s) => (
                <col key={s.key} style={{ width: `${74 / speakers.length}%` }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th className="text-left px-4 py-5 border-b border-r border-ink-700/15 bg-cream-100 h-[96px] align-middle">
                  <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-ink-500">
                    TYPE / AGENT
                  </div>
                </th>
                {speakers.map((s) => (
                  <th
                    key={s.key}
                    className="text-left px-4 py-5 border-b border-ink-700/15 bg-cream-100 align-middle h-[96px]"
                  >
                    <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-clay-600 truncate">
                      {s.agent}
                    </div>
                    <div className="mt-1 font-serif text-[14px] md:text-[15px] text-ink-900 leading-tight">
                      {s.name}
                    </div>
                    <div className="text-[10px] font-mono text-ink-500 mt-0.5 truncate">
                      {s.stack}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vibeTypes.map((t) => (
                <tr key={t.n} className="h-[96px]">
                  <th className="text-left px-4 py-4 border-b border-r border-ink-700/15 bg-cream-50 align-middle h-[96px]">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="font-mono text-[11px] text-clay-700 shrink-0">
                        T{String(t.n).padStart(2, '0')}
                      </span>
                      <span className="font-serif text-[13px] md:text-[15px] text-ink-900 leading-tight">
                        {t.name}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-ink-700 leading-snug">{t.sub}</div>
                    <div className="mt-1 text-[10px] font-mono tracking-[0.18em] uppercase text-ink-500">
                      {t.tag}
                    </div>
                  </th>
                  {speakers.map((s) => {
                    const owns = ownerOf(t.n, s.key)
                    return (
                      <td
                        key={s.key}
                        className={`px-2 py-4 border-b border-ink-700/15 align-middle text-center h-[96px] ${
                          owns ? 'bg-clay-50' : 'bg-cream-50'
                        }`}
                      >
                        {owns ? (
                          <div className="inline-flex flex-col items-center gap-1">
                            <span className="inline-grid place-content-center w-8 h-8 rounded-full bg-ink-900 text-cream-50 font-serif text-sm">
                              {s.initial}
                            </span>
                            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-clay-700">
                              DEMO
                            </span>
                          </div>
                        ) : (
                          <span className="text-ink-500/30 font-mono text-xs" aria-hidden>
                            ╱╱╱
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: Toolbelt — 외부망에서 폐쇄망으로
// ─────────────────────────────────────────────────────────────────

function Toolbelt() {
  const demos = [
    { name: 'Claude Code', vendor: 'Anthropic', kind: 'CLI Agent', role: '신성진' },
    { name: 'Open Code', vendor: '오픈소스', kind: 'CLI Agent', role: '신성진' },
    { name: 'Goose', vendor: 'Block', kind: 'Desktop Agent', role: '신성진' },
    { name: 'Codex', vendor: 'OpenAI', kind: 'CLI Agent', role: '김용재' },
    { name: 'Google Antigravity', vendor: 'Google', kind: 'AI-native IDE', role: '이중균' },
    { name: 'VSCode + GitHub Copilot', vendor: 'Microsoft · GitHub', kind: 'IDE 조합', role: '현중균' },
    { name: 'OPEN CLAW', vendor: '오픈소스', kind: 'CLI Agent', role: '김태유' },
  ]
  const tasters = [
    { name: 'Cursor', vendor: 'Anysphere', kind: 'AI IDE' },
    { name: 'Cline', vendor: '오픈소스', kind: 'VSCode 에이전트' },
    { name: 'Aider', vendor: '오픈소스', kind: 'CLI Agent' },
    { name: 'Ollama · Local LLM', vendor: '오픈소스', kind: '폐쇄망 실행기' },
    { name: 'MCP 서버', vendor: '오픈소스', kind: '도구 연결 프로토콜' },
    { name: 'Windsurf', vendor: 'Codeium', kind: 'AI IDE' },
  ]
  return (
    <section className="py-28 md:py-36 border-t border-ink-700/10">
      <div className="container-editorial">
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="rule" />
            <span className="eyebrow">THE PIPELINE · 외부망 → 폐쇄망</span>
          </div>
          <h2 className="h-display text-[36px] md:text-[54px]">
            외부망에서 먼저,
            <br />
            <span className="text-clay-700">폐쇄망으로 가져갑니다.</span>
          </h2>
          <p className="mt-6 text-ink-700 text-[15px] md:text-[17px] leading-relaxed">
            폐쇄망에서 바로 만드는 건 비효율입니다. 외부망에서 여러 에이전트로 빠르게
            프로토타이핑하고, 검증된 패턴만 로컬·오프라인·행정망으로 이관하는 것이
            민첩한 AI 거버넌스의 기본기. 오늘 밤은 다섯 발표자의 전담 도구 외에도
            실무자가 알아두면 좋은 에이전트 생태계를 같이 맛봅니다.
          </p>
        </div>

        <div className="mb-8">
          <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-clay-600 mb-3">
            STAGE 01 · 오늘 라이브로 돌리는 일곱 도구
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-700/10 border border-ink-700/10 rounded-sm">
            {demos.map((t) => (
              <div key={t.name} className="bg-cream-50 p-5 md:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-serif text-[18px] md:text-[20px] text-ink-900 leading-tight">
                    {t.name}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-clay-700 whitespace-nowrap">
                    {t.role}
                  </div>
                </div>
                <div className="mt-2 text-[12px] font-mono text-ink-500">
                  {t.vendor} · {t.kind}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-clay-600 mb-3">
            STAGE 02 · 맛보기로 언급 · 실무자가 알아둘 에이전트들
          </div>
          <div className="flex flex-wrap gap-px bg-ink-700/10 border border-ink-700/10 rounded-sm">
            {tasters.map((t) => (
              <div key={t.name} className="bg-cream-50 px-5 py-4 flex-1 min-w-[220px]">
                <div className="font-serif text-[16px] text-ink-900 leading-tight">{t.name}</div>
                <div className="mt-1 text-[11px] font-mono text-ink-500">
                  {t.vendor} · {t.kind}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 bg-ink-900 text-cream-100 rounded-sm p-7 md:p-9 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              background:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative">
            <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-clay-300">
              THE PRINCIPLE
            </div>
            <p className="mt-3 font-serif text-[19px] md:text-[22px] leading-[1.5] max-w-4xl">
              "외부망에서 만든 뒤 폐쇄망으로 가져갑니다. 그러면 도구 선택은 자유롭고,
              보안은 단단해집니다." — 행정망 바이브코딩 실무자의 제1원칙.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: Timeline
// ─────────────────────────────────────────────────────────────────

function Timeline() {
  const slots = [
    { at: '13:00', dur: '25m', who: '신성진', title: '오프닝 — 오늘의 지도와 미션', agent: 'Claude Code' },
    { at: '13:25', dur: '35m', who: '이중균', title: 'Google Antigravity · T01 Browser Single File', agent: 'HTML·CSS·JS' },
    { at: '14:00', dur: '15m', who: '전원', title: '휴식', agent: '—' },
    { at: '14:15', dur: '45m', who: '현중균', title: 'VSCode + Copilot · T03 Desktop Binary · T05 Local LLM', agent: 'Electron·Ollama' },
    { at: '15:00', dur: '35m', who: '김태유', title: 'OPEN CLAW · T02 Python Offline Packaging', agent: 'Python' },
    { at: '15:35', dur: '15m', who: '전원', title: '휴식', agent: '—' },
    { at: '15:50', dur: '45m', who: '김용재', title: 'Codex · T04 Node.js · T08 Ecosystem', agent: 'Node.js·OSS' },
    { at: '16:35', dur: '45m', who: '신성진', title: 'Claude Code + Open Code + Goose · T06 Excel VBA · T07 Agentic Harness', agent: 'VBA·Agentic' },
    { at: '17:20', dur: '20m', who: '신성진 · 전원', title: 'Q&A · 로드맵 워크시트 · 클로징', agent: '통합' },
  ]
  return (
    <section id="timeline" className="py-28 md:py-36 border-t border-ink-700/10">
      <div className="container-editorial">
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="rule" />
            <span className="eyebrow">TIMELINE · 280 MIN · 4시간 40분</span>
          </div>
          <h2 className="h-display text-[36px] md:text-[56px]">
            오후의 흐름.
          </h2>
        </div>

        <div className="border border-ink-700/15 rounded-sm overflow-hidden">
          {slots.map((s, i) => (
            <div
              key={i}
              className="grid grid-cols-[88px_1fr_auto] md:grid-cols-[120px_1fr_160px_140px] gap-4 md:gap-6 px-5 md:px-8 py-5 bg-cream-50 hover:bg-cream-100 transition-colors border-b last:border-b-0 border-ink-700/10 items-center"
            >
              <div>
                <div className="font-mono text-[12px] tracking-[0.1em] text-clay-700">{s.at}</div>
                <div className="font-mono text-[10px] text-ink-500 mt-0.5">{s.dur}</div>
              </div>
              <div className="font-serif text-[16px] md:text-[18px] text-ink-900 leading-tight">
                {s.title}
              </div>
              <div className="hidden md:block font-serif text-[14px] text-ink-700">{s.who}</div>
              <div className="hidden md:block text-right">
                <span className="inline-block text-[10px] font-mono tracking-[0.22em] uppercase text-ink-500">
                  {s.agent}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: Why CDSA
// ─────────────────────────────────────────────────────────────────

function WhyCdsa() {
  return (
    <section className="py-28 md:py-36 bg-cream-100/60 border-y border-ink-700/10">
      <div className="container-editorial grid md:grid-cols-[1.05fr_1fr] gap-12 md:gap-16 items-start">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="rule" />
            <span className="eyebrow">WHY CDSA</span>
          </div>
          <h2 className="h-display text-[32px] md:text-[48px]">
            수정구슬 예언이 아니라,
            <br />
            <span className="text-clay-700">골목길 문제를 푸는 협회.</span>
          </h2>
          <p className="mt-6 text-ink-700 text-[15px] md:text-[17px] leading-relaxed">
            한국데이터사이언티스트협회는 중앙정부·공공 80여 곳, 대기업 30여 곳에서
            AI·데이터 교육을 직접 설계하고 실행해 왔습니다. 이번 웨비나는 그 실적의
            쇼케이스가 아니라, 협회가 실제로 어떻게 생각하는지를 처음 한 장에 펼쳐
            보이는 시그니처 시리즈 1호입니다.
          </p>
        </div>

        <div className="bg-cream-50 border border-ink-700/15 p-7 md:p-9 rounded-sm">
          <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-clay-600">
            HOST · KEYNOTE
          </div>
          <h3 className="mt-3 font-serif text-[24px] md:text-[28px] text-ink-900 leading-tight">
            신성진
          </h3>
          <div className="text-[12px] font-mono text-ink-500 mt-1">
            한국데이터사이언티스트협회 대표이사
          </div>
          <p className="mt-5 text-[14px] md:text-[15px] text-ink-700 leading-relaxed">
            행정안전부 AI·데이터활용 전문위원, 과학기술정보통신부 데이터기반행정 자문위원.
            식품의약품안전처 식의약 위해예방 자문위원. CJ올리브네트웍스·한국경제 DT 과정
            주임교수. 바이브코딩 전문가.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['행안부 전문위원', '과기정통부 자문위원', '식약처 자문위원', '바이브코딩 전문가'].map(
              (t) => (
                <span
                  key={t}
                  className="inline-flex items-center px-2.5 py-1 border border-ink-700/20 text-[11px] font-mono text-ink-700"
                >
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: Gift Kit
// ─────────────────────────────────────────────────────────────────

function GiftKit() {
  const gifts = [
    {
      n: '01',
      title: '8유형 프롬프트 팩',
      body: 'Browser·Python·Desktop·Node·Ollama·VBA·Agentic·Ecosystem 각 유형의 실전 프롬프트와 실행 스크립트를 모은 마크다운 팩.',
    },
    {
      n: '02',
      title: '로드맵 워크시트 PDF',
      body: '사내 기획자·경영진에게 제출 가능한 네 장짜리 로드맵 템플릿. 즉시 편집 가능.',
    },
    {
      n: '03',
      title: '녹화본 30일 다시보기',
      body: '당일 라이브를 놓쳐도 30일간 다시보기 제공. 팀원 공유용 링크 포함.',
    },
    {
      n: '04',
      title: '에이전트 10분 시작 가이드',
      body: '다섯 발표자가 직접 쓴 각 에이전트의 첫 10분 시작 가이드. 다섯 권 세트.',
    },
  ]
  return (
    <section className="py-28 md:py-36 border-t border-ink-700/10">
      <div className="container-editorial">
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="rule" />
            <span className="eyebrow">WHAT YOU TAKE HOME</span>
          </div>
          <h2 className="h-display text-[36px] md:text-[56px]">
            가져가는 것.
          </h2>
          <p className="mt-5 text-ink-700 text-[15px] md:text-[17px] leading-relaxed">
            라이브가 끝나고도 월요일 보고에 쓰이도록. 참가자 한정 배포.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-700/10 border border-ink-700/10 rounded-sm">
          {gifts.map((g) => (
            <div key={g.n} className="bg-cream-50 hover:bg-cream-100 transition-colors p-7 md:p-8">
              <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-clay-600">
                KIT {g.n}
              </div>
              <h3 className="mt-3 font-serif text-[20px] md:text-[22px] text-ink-900 leading-tight">
                {g.title}
              </h3>
              <p className="mt-3 text-[14px] text-ink-700 leading-relaxed">{g.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: FAQ
// ─────────────────────────────────────────────────────────────────

function Faq() {
  const items = [
    {
      q: '사전 지식이 필요한가요?',
      a: '엑셀을 쓸 줄 알고 회사에서 AI를 어떤 식으로든 한 번이라도 써본 분이면 충분합니다. 개발 지식은 전제하지 않습니다.',
    },
    {
      q: '녹화본은 제공되나요?',
      a: '참가자에 한해 30일간 다시보기 링크를 제공합니다. 팀원 공유용 링크도 함께 드립니다.',
    },
    {
      q: '단체·기관 신청이 가능한가요?',
      a: '기관 단위 10석 이상 신청 시 별도 안내드립니다. 신청 폼의 문의 주관식에 "단체"라고 적어주세요.',
    },
    {
      q: '참가비가 정말 무료인가요?',
      a: '네. 대신 직장 이메일·소속·직책을 필수로 받고 선착순 200석으로 정원을 제한합니다.',
    },
    {
      q: '개인정보는 어떻게 처리되나요?',
      a: '웨비나 운영 목적에 한해 보관하며 종료 후 1년 이내 파기합니다. 제3자 제공하지 않습니다.',
    },
    {
      q: '라이브에 자막이 제공되나요?',
      a: '한국어 자동 자막을 제공하며, 발표 자료는 녹화본과 함께 PDF로 배포합니다.',
    },
  ]
  return (
    <section className="py-28 md:py-36 bg-cream-100/60 border-y border-ink-700/10">
      <div className="container-editorial">
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="rule" />
            <span className="eyebrow">FAQ</span>
          </div>
          <h2 className="h-display text-[36px] md:text-[56px]">
            자주 묻는 것들.
          </h2>
        </div>

        <div className="max-w-4xl grid md:grid-cols-2 gap-px bg-ink-700/10 border border-ink-700/10 rounded-sm">
          {items.map((it, i) => (
            <div key={i} className="bg-cream-50 p-7 md:p-8">
              <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-clay-600">
                Q{String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-2 font-serif text-[17px] md:text-[19px] text-ink-900 leading-tight">
                {it.q}
              </h3>
              <p className="mt-3 text-[14px] text-ink-700 leading-relaxed">{it.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: Signature preview
// ─────────────────────────────────────────────────────────────────

function SignaturePreview() {
  return (
    <section className="py-24 md:py-32 border-t border-ink-700/10">
      <div className="container-editorial grid md:grid-cols-[1fr_1.1fr] gap-10 md:gap-16 items-start">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="rule" />
            <span className="eyebrow">SIGNATURE SERIES</span>
          </div>
          <h2 className="h-display text-[30px] md:text-[44px]">
            이번이 1호입니다.
          </h2>
          <p className="mt-5 text-ink-700 text-[15px] md:text-[17px] leading-relaxed max-w-xl">
            실무자 AI 에이전트·바이브코딩은 협회 시그니처 시리즈의 첫 회차. 다음 회차는
            행정망 환경에서의 로컬 LLM 운영과 사내 AI 거버넌스 설계를 주제로 준비
            중입니다. 소식만 먼저 받아보세요.
          </p>
        </div>

        <form
          className="bg-cream-100 border border-ink-700/15 p-6 md:p-8 rounded-sm flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            alert('감사합니다. 시그니처 시리즈 안내를 먼저 보내드릴게요.')
          }}
        >
          <label className="text-[11px] font-mono tracking-[0.22em] uppercase text-clay-600">
            NEWSLETTER · EARLY ACCESS
          </label>
          <input
            type="email"
            required
            placeholder="직장 이메일"
            className="bg-cream-50 border border-ink-700/20 rounded-sm px-4 py-3 text-[15px] text-ink-900 placeholder:text-ink-500 focus:outline-none focus:border-clay-600"
          />
          <input
            type="text"
            placeholder="소속 · 선택"
            className="bg-cream-50 border border-ink-700/20 rounded-sm px-4 py-3 text-[15px] text-ink-900 placeholder:text-ink-500 focus:outline-none focus:border-clay-600"
          />
          <button
            type="submit"
            className="mt-1 inline-flex items-center justify-center px-5 py-3 rounded-full bg-ink-900 text-cream-50 text-sm font-medium hover:bg-clay-700 transition-colors"
          >
            다음 회차 먼저 받아보기
          </button>
          <p className="text-[11px] font-mono text-ink-500 mt-1">
            시그니처 회차 안내 용도로만 사용하며 언제든 수신 해지 가능합니다.
          </p>
        </form>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: Registration form
// ─────────────────────────────────────────────────────────────────

function Register() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <section id="register" className="py-28 md:py-36 bg-ink-900 text-cream-50 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          background:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 15% 20%, rgba(227,168,114,0.1) 0%, transparent 55%), radial-gradient(ellipse at 85% 80%, rgba(193,122,59,0.08) 0%, transparent 60%)',
        }}
      />
      <div className="container-editorial relative max-w-4xl">
        <div className="flex items-center gap-3 mb-5">
          <span className="block h-px w-12 bg-cream-200/60" />
          <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-clay-300">
            SEAT RESERVATION · 200 SEATS
          </span>
        </div>
        <h2 className="font-serif font-semibold text-[32px] md:text-[54px] leading-[1.12] tracking-tightest">
          신청하기.
        </h2>
        <p className="mt-5 font-serif text-[18px] md:text-[22px] text-cream-100/85 max-w-2xl">
          주관식 한 줄이 이 오후를 당신에게 맞추는 키입니다. 풀고 싶은 문제를
          적어주세요.
        </p>

        {submitted ? (
          <div className="mt-10 border border-cream-200/30 p-8 rounded-sm">
            <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-clay-300">
              CONFIRMED
            </div>
            <h3 className="mt-2 font-serif text-[24px] text-cream-50">
              자리 확보되었습니다.
            </h3>
            <p className="mt-3 text-[14px] text-cream-100/80 leading-relaxed">
              입력하신 직장 이메일로 참가 링크와 캘린더 초대를 곧 보내드립니다.
              확인이 늦어지면 sjshin@cdsa.kr로 연락주세요.
            </p>
          </div>
        ) : (
          <form
            className="mt-10 grid md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
            }}
          >
            <input
              required
              placeholder="성함"
              className="bg-ink-800 border border-cream-200/20 rounded-sm px-4 py-3 text-[15px] text-cream-50 placeholder:text-cream-200/40 focus:outline-none focus:border-clay-300"
            />
            <input
              required
              placeholder="회사·기관명"
              className="bg-ink-800 border border-cream-200/20 rounded-sm px-4 py-3 text-[15px] text-cream-50 placeholder:text-cream-200/40 focus:outline-none focus:border-clay-300"
            />
            <input
              required
              placeholder="직책 · 예) 기획팀장"
              className="bg-ink-800 border border-cream-200/20 rounded-sm px-4 py-3 text-[15px] text-cream-50 placeholder:text-cream-200/40 focus:outline-none focus:border-clay-300"
            />
            <input
              required
              type="email"
              placeholder="직장 이메일"
              className="bg-ink-800 border border-cream-200/20 rounded-sm px-4 py-3 text-[15px] text-cream-50 placeholder:text-cream-200/40 focus:outline-none focus:border-clay-300"
            />
            <div className="md:col-span-2">
              <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-clay-300 mb-2">
                업무 영역 · 중복 가능
              </div>
              <div className="flex flex-wrap gap-2">
                {['기획·전략', '개발·DS', 'HR·교육', '영업·마케팅', '공공·행정', '보안·거버넌스', '기타'].map(
                  (x) => (
                    <label
                      key={x}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-cream-200/25 rounded-sm text-[13px] text-cream-100 hover:border-clay-300 cursor-pointer"
                    >
                      <input type="checkbox" className="accent-clay-500" />
                      {x}
                    </label>
                  ),
                )}
              </div>
            </div>
            <textarea
              required
              rows={3}
              placeholder="이 웨비나에서 풀고 싶은 문제 한 줄 · 필수"
              className="md:col-span-2 bg-ink-800 border border-cream-200/20 rounded-sm px-4 py-3 text-[15px] text-cream-50 placeholder:text-cream-200/40 focus:outline-none focus:border-clay-300"
            />
            <div className="md:col-span-2 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
              <p className="text-[11px] font-mono text-cream-200/60">
                선착순 {webinarInfo.seats} · 마감 {webinarInfo.deadline} · 개인정보는 운영 목적으로만 사용
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-clay-500 text-ink-900 text-sm font-semibold hover:bg-clay-300 transition-colors"
              >
                자리 잡기 →
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section: Footer
// ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-16 bg-cream-100 border-t border-ink-700/10">
      <div className="container-editorial flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="font-serif text-[20px] text-ink-900">
            한국데이터사이언티스트협회
          </div>
          <div className="text-[12px] font-mono text-ink-500 mt-1">
            서울특별시 금천구 벚꽃로36길 30, 6층 622호(가산동, 가산 KS TOWER) · sjshin@cdsa.kr
          </div>
        </div>
        <div className="flex items-center gap-5 text-[13px] text-ink-700">
          <a href="/" className="hover:text-clay-700">CDSA 홈</a>
          <a href="https://www.youtube.com/@workbyax" target="_blank" rel="noopener noreferrer" className="hover:text-clay-700">
            유튜브
          </a>
          <a href="mailto:sjshin@cdsa.kr" className="hover:text-clay-700">문의</a>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────
// Export: Webinar page
// ─────────────────────────────────────────────────────────────────

export default function Webinar() {
  useEffect(() => {
    document.title = '실무자를 위한 AI 에이전트와 바이브코딩 · 2026.05.23 · CDSA'
  }, [])
  return (
    <div className="min-h-screen">
      <WebinarNav />
      <Hero />
      <ForWhom />
      <MondayScene />
      <Speakers />
      <Matrix />
      <Toolbelt />
      <Timeline />
      <WhyCdsa />
      <GiftKit />
      <Faq />
      <SignaturePreview />
      <Register />
      <Footer />
    </div>
  )
}
