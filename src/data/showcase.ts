// 「★신성진의 모든 것★ / 사이트 현황 (2026-10-25)」 시트 기준 — 2026-10-27 전수 접속 확인(HTTP 200)한 사이트만
// 대표 12개는 실제 화면 캡처(public/showcase/*.webp)

export interface Site {
  name: string
  desc: string
  href: string
  shot?: string
  tag?: string
}

export const featured: Site[] = [
  { name: '열린국무회의', desc: 'KTV 국무회의·국민업무보고 영상을 대화록처럼 읽는 아카이브', href: 'https://opencabinet.cc', shot: 'opencabinet', tag: '공공 아카이브' },
  { name: '생태 시뮬레이터', desc: '서식지·생태축·외래종 확산을 계산하고 3D로 확인하는 도구', href: 'https://nie-eco-simulator.vercel.app', shot: 'eco', tag: '정책 시뮬레이션' },
  { name: 'EduSim 3D', desc: '민원은 예고 없이 옵니다 — 교육행정 판단을 3D 교실에서 미리 연습', href: 'https://cdsassj00-edusim-3d.sjshin.workers.dev', shot: 'edusim', tag: '교육 · 3D' },
  { name: 'C-RISK 자원안보 모니터링', desc: '리튬·구리 공급망 거점의 기후 리스크를 비교하는 대시보드', href: 'https://motie-climate-risk.vercel.app', shot: 'crisk', tag: '데이터 대시보드' },
  { name: '입찰 인사이트', desc: '질문하면 나라장터 실제 입찰공고로 답하는 자연어 탐색기', href: 'https://g2bai.lovable.app/', shot: 'g2bai', tag: 'AI 검색' },
  { name: 'Msty Korea', desc: '보안 걱정 없이 내 PC에서 로컬 AI를 쓰는 방법 안내', href: 'https://msty.kr', shot: 'msty', tag: '로컬 AI' },
  { name: 'Render Studio', desc: '말로 설명하면 3D 장면이 렌더링되는 글-투-3D 스튜디오', href: 'https://blender-render-site.sjshin.workers.dev', shot: 'render', tag: '생성형 AI' },
  { name: '3D 글로벌 데이터 관제', desc: '지구본 위에서 실시간 지리 데이터를 모니터링하는 관제 화면', href: 'https://globe-3d-monitor.sjshin.workers.dev', shot: 'globe', tag: '3D 시각화' },
  { name: '정리본능 Desk Reset', desc: '뒤틀어진 책상을 바로잡는 무료 3D 정리 게임', href: 'https://deskreset.click', shot: 'deskreset', tag: '웹 게임' },
  { name: '웹 애니메이션 사전', desc: '72가지 웹 효과를 눈으로 보고 AI에게 시키는 법을 익히는 사전', href: 'https://cdsassj00.github.io/vibe-webeffect/', shot: 'webeffect', tag: '바이브코딩 교재' },
  { name: '강의 콘텐츠 지도', desc: '강의안 214개·슬라이드 3,065장을 검색·네트워크로 탐색', href: 'https://ai-lecture-iota.vercel.app', shot: 'lecture', tag: '지식 지도' },
  { name: 'HWPX · AI 문서 생성기', desc: '서면보고·보도자료 초안을 넣으면 한글(HWPX) 문서로 만들어 주는 도구', href: 'https://cdsahwpx.netlify.app', shot: 'hwpx', tag: '공문서 자동화' },
]

export const directory: { label: string; items: Site[] }[] = [
  {
    label: '공공 · 정책',
    items: [
      { name: '공공 AI 챔피언 명예의 전당', desc: '공공부문 AI 챔피언 아카이브', href: 'https://aichampion.site' },
      { name: '법령 아카이브', desc: '법령 통합 검색', href: 'https://total-three-alpha.vercel.app' },
      { name: '업무재설계 도우미', desc: '공공 업무 프로세스 재설계 실습', href: 'https://public-task.lovable.app' },
      { name: '공공 AX PoC 과제계획서', desc: '기술 과제계획서 샘플', href: 'https://task-rust-one.vercel.app' },
      { name: 'AI 전략 네트워크 시각화', desc: '분야별 AI 전략 관계망', href: 'https://rda-ai-strategy-network.netlify.app' },
      { name: '정책 Q&A 챗봇', desc: '정책 문서 기반 질의응답', href: 'https://silly-mochi-8ca4c9.netlify.app' },
      { name: '민원 처리 FAQ 챗봇', desc: '반복 민원 자동 응대', href: 'https://fantastic-zabaione-9ee210.netlify.app' },
      { name: 'CCTV 설치목적 분석', desc: '서울시 자치구별 공공데이터 분석', href: 'https://delightful-griffin-a1016e.netlify.app' },
      { name: '국정 브리핑 의안 분석', desc: '국정 브리핑·의안 분석 MCP', href: 'https://gov-minutes-mcp.sjshin.workers.dev' },
    ],
  },
  {
    label: '교육 · 역량',
    items: [
      { name: 'AI 역량평가', desc: '조직·개인 AI 역량 진단', href: 'https://ai-hrd.com' },
      { name: 'AI Competency Compass', desc: '조직 AI 역량 진단·교육체계', href: 'https://aicapa.vercel.app' },
      { name: 'AI챔피언 역량인증 시스템', desc: '인증 평가 운영', href: 'https://aicapa.kr' },
      { name: 'RAG의 모든 것 실습 랩', desc: '임베딩·검색·생성 실습', href: 'https://rag-lab.pages.dev' },
      { name: 'CDSA Harness', desc: 'AI 에이전트 교육용 하네스', href: 'https://cdsassj00.github.io/miniharness/' },
      { name: 'OpenCode 활용 매뉴얼', desc: '비개발자 AI 코딩 에이전트 입문서', href: 'https://cdsassj00.github.io/opencode-manual/' },
      { name: 'AI 커리큘럼 빌더', desc: '역량 단계별 과정 조립', href: 'https://aicurri.lovable.app' },
      { name: '바이브코딩 결과물 아카이브', desc: '공공부문 수강생 산출물 모음', href: 'https://publicax.lovable.app' },
      { name: 'AICE Associate 학습 도우미', desc: '문법·예제·기출 모의문제', href: 'https://aiceassociate.vercel.app' },
      { name: '의성군 AI 교육 아카이브', desc: '지자체 AI 교육 기록', href: 'https://eusung-lms.vercel.app' },
      { name: '지식 그래프 생성기', desc: '포트폴리오를 지식 그래프로', href: 'https://graph-craft-10.lovable.app' },
    ],
  },
  {
    label: '업무 자동화 · 문서',
    items: [
      { name: 'AI 견적서 자동완성', desc: '자연어로 견적서 작성·PDF 출력', href: 'https://autodocs-pi.vercel.app' },
      { name: '대량 신청서 변환', desc: '신청서 일괄 변환 시스템', href: 'https://cdsaastis.netlify.app' },
      { name: '개인정보 마스킹 툴', desc: 'AI 기반 민감정보 가림 처리', href: 'https://shinsungjin0114.netlify.app' },
      { name: 'LeadFolio', desc: '자료 미리보기·리드 관리', href: 'https://leadfolio.app' },
      { name: '업무 통합 워크스페이스', desc: '업무 컨트롤룸', href: 'https://work-control-room-2026.vercel.app' },
      { name: 'SNS 자동배포 대시보드', desc: '멀티채널 발행 자동화', href: 'https://sns-automation-eight.vercel.app' },
      { name: 'CSV Smart Dashboard', desc: 'CSV 올리면 대시보드 자동 생성', href: 'https://dashboardtest-liard.vercel.app' },
      { name: '책 빌더 스튜디오', desc: '원고를 책으로', href: 'https://book-builder-web.vercel.app' },
      { name: '업무 인수인계 노트', desc: '인수인계 문서 정리', href: 'https://idyllic-starburst-c82d03.netlify.app' },
      { name: '손익계산서 요약 뷰어', desc: 'PDF 재무제표 한눈 요약', href: 'https://bucolic-valkyrie-86d860.netlify.app' },
    ],
  },
  {
    label: 'AI · 데이터 실험',
    items: [
      { name: 'StockOntology', desc: '3D 세계지도 금융뉴스·시세', href: 'https://stockontology.cc' },
      { name: 'Inception Mercury Studio', desc: '확산 방식 AI 체험', href: 'https://inception-mercury-studio.vercel.app' },
      { name: 'GPT 실시간 동시통역', desc: 'Realtime API 데모', href: 'https://gist-peach-one.vercel.app' },
      { name: 'Economic Engine', desc: '경제 연쇄반응 시뮬레이터', href: 'https://v0-ssjeco.vercel.app' },
      { name: 'AI Excel', desc: '브라우저 AI 스프레드시트', href: 'https://cdsassj00.github.io/redefine-browser-03-excelhtml/' },
      { name: 'Pyodide 실험실', desc: 'HTML로 파이썬 실행', href: 'https://cdsassj00.github.io/redefine-browser-04.html-python/' },
      { name: '웹캠 실시간 이미지 판별기', desc: '브라우저 머신러닝', href: 'https://sweet-fairy-6c2cca.netlify.app' },
      { name: '스마트세종 3D 상황실', desc: '3D 도시 모형 관제', href: 'https://sejong-3d-twin.sjshin.workers.dev' },
    ],
  },
  {
    label: '웹 · 인터랙티브',
    items: [
      { name: 'axdraw', desc: '손그림 화이트보드·실시간 협업', href: 'https://axdraw.org' },
      { name: '브라우저 능력 사전', desc: '브라우저로 할 수 있는 모든 것', href: 'https://browser-senses-lab.netlify.app' },
      { name: '브라우저 모션 사전', desc: '모션·영상 능력 사전', href: 'https://browser-motion-lab.netlify.app' },
      { name: 'ScrollFilm', desc: '스크롤하면 움직이는 히어로 섹션', href: 'https://browser-reel-creator.lovable.app' },
      { name: 'FILM SLICER', desc: '영상을 스크롤 페이지로', href: 'https://cdsassj00.github.io/redefine-browser-01/' },
      { name: 'AI 영상 스튜디오', desc: '주제만 던지면 유튜브까지', href: 'https://youtubeauto-iota.vercel.app' },
      { name: '부평역 3D 지도', desc: '주변 지형 3D 모델', href: 'https://bupyeong-3d-map.vercel.app' },
      { name: '계산모아', desc: '일상 계산기 모음', href: 'https://calcmoa.site' },
    ],
  },
]
