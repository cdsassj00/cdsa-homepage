/* ============================================
   Blog post list + TOC + view counter (shared)
   ============================================
   Usage in each blog post HTML:
     <link rel="stylesheet" href="/blog/_layout.css">
     ... (existing styles)
   In the body, before the article:
     <button class="blog-hamburger" aria-label="블로그 목록"><span></span><span></span><span></span></button>
     <div class="blog-overlay"></div>
     <aside class="blog-left">
       <div class="blog-left-title">BLOG POSTS</div>
       <ol class="blog-left-list"></ol>
     </aside>
     <aside class="blog-right">
       <div class="blog-right-title">On this page</div>
       <ul class="blog-toc"></ul>
     </aside>
   At the end of body:
     <script src="/blog/_posts.js" defer></script>

   When adding a new post: add one entry to the POSTS array below
   with `views: { base, daily, publishedISO }` for the read-counter.
============================================ */

(function () {
  // Single source of truth for blog posts. Sorted newest-first.
  // views.base   = 발행 직후 시드 누적치 (초기 1~2일 트래픽 + 사전 노출 합산 가정)
  // views.daily  = 일평균 추가 조회수 (오래된 글일수록 감쇠)
  // views.publishedISO = 발행일(자정 KST 기준)
  // 단일 진실원 (single source of truth) — 새 글 추가 시 이 배열에만 항목 한 개를 더하면
  // 인덱스 카드, 사이드바 목록, Blog Schema JSON-LD가 모두 자동으로 따라온다.
  // dek      = 인덱스 카드의 발췌문 (3~4줄)
  // author   = JSON-LD article author 이름. 미명시 시 'CDSA 편집팀'
  // authorType = 'Person' | 'Organization' (기본 'Person')
  // publishTime = '09:00:00' 같은 KST 시각. 미명시 시 '09:00:00'
  const POSTS = [
    {
      slug: 'people-first-design',
      title: '좋은 기획은 기능이 아니라 사람을 먼저 본다',
      date: '2026. 5. 30',
      category: 'AI 설계론',
      href: '/blog/people-first-design.html',
      author: '김태유',
      publishTime: '09:00:00',
      dek: 'AI 도구를 도입했는데 직원들이 안 쓴다면, 문제는 모델이 아니라 설계다. 도구를 도입하지 말고 사람의 하루를 재설계하라. 사람은 정답보다 통제감을 원하고, 신뢰는 성능이 아니라 예측 가능성에서 온다.',
      views: { base: 10, daily: 6, publishedISO: '2026-05-30' },
    },
    {
      slug: 'karpathy-ghost-intelligence',
      title: '코드가 사라진 자리에 무엇이 들어오는가 — 안드레이 카파시 인터뷰 정리',
      date: '2026. 5. 23',
      category: '큐레이션 · AI 사고론',
      href: '/blog/karpathy-ghost-intelligence.html',
      author: '신성진',
      publishTime: '09:00:00',
      dek: '소프트웨어 3.0, 2023년 12월의 분기점, 들쭉날쭉한 지능, 유령 비유, 바이브 코딩과 에이전틱 엔지니어링, 채용 방식의 전환, 싱킹과 이해의 구분, 오토 리서치, 지능이라는 기적까지. 카파시의 최근 인터뷰에서 건진 여덟 가지 통찰을 비전공자 어휘로 옮깁니다.',
      views: { base: 20, daily: 8, publishedISO: '2026-05-23' },
    },
    {
      slug: 'google-io-2026-summary',
      title: 'Google I/O 2026 키노트 요약 — Gemini Omni·3.5 Flash·Spark가 그리는 다음 자리',
      date: '2026. 5. 21',
      category: '큐레이션 · 키노트 해설',
      href: '/blog/google-io-2026-summary.html',
      author: 'CDSA 편집팀',
      authorType: 'Organization',
      publishTime: '10:00:00',
      dek: 'Gemini Omni, 3.5 Flash, Spark, Anti-Gravity, UCP·AP2, 오디오 글라스. 구글 I/O 2026 키노트 47분을 비개발자가 회사에서 그대로 옮길 수 있는 산문체로 정리했습니다. 본문 끝의 편집자 노트에 작년 I/O와 무엇이 달라졌는지 차별화 포인트 여섯을 모았습니다.',
      views: { base: 80, daily: 8, publishedISO: '2026-05-21' },
    },
    {
      slug: 'hermes-agent',
      title: 'Hermes Agent 설치와 첫 대화 — 자라는 에이전트 따라 해보기',
      date: '2026. 5. 9',
      category: 'AI 도구 입문',
      href: '/blog/hermes-agent.html',
      author: '신성진',
      publishTime: '16:00:00',
      dek: '터미널을 한 번도 써본 적 없는 분을 가정하고 다시 쓴, Nous Research Hermes Agent 입문 가이드. 설치 한 줄, LLM 두뇌 연결, 첫 한국어 대화, 그리고 책상 정리부터 정해진 시간 자동 실행까지 다섯 갈래 활용까지.',
      views: { base: 30, daily: 4, publishedISO: '2026-05-09' },
    },
    {
      slug: 'huggingface-for-beginners-3',
      title: '고른 모델을 어디에 쓰나 — 행정 문서, 민원, 회의록, 그리고 RAG',
      date: '2026. 5. 9',
      category: '시리즈 · 허깅페이스 모델 읽기 · 3편',
      href: '/blog/huggingface-for-beginners-3.html',
      author: '신성진',
      publishTime: '15:00:00',
      dek: '공문 초안, 민원 답변, 회의록 요약, 내부 규정 질의응답, 그리고 검색 기반 생성(RAG). 비개발자가 가장 먼저 시도해 볼 만한 다섯 가지 자리를 한 호흡 산문으로 정리한 시리즈 마지막 편.',
      views: { base: 40, daily: 5, publishedISO: '2026-05-09' },
    },
    {
      slug: 'huggingface-for-beginners-2',
      title: '허깅페이스 모델 안쪽 들여다보기 — 학습 데이터, 튜닝, 파라미터, 파일들',
      date: '2026. 5. 9',
      category: '시리즈 · 허깅페이스 모델 읽기 · 2편',
      href: '/blog/huggingface-for-beginners-2.html',
      author: '신성진',
      publishTime: '14:30:00',
      dek: 'SFT·RLHF·DPO·LoRA·QLoRA, 그리고 config.json·tokenizer·safetensors. 모델 카드의 절반을 차지하는 어려운 단어들을 일상 어휘로 옮긴 두 번째 편.',
      views: { base: 50, daily: 6, publishedISO: '2026-05-09' },
    },
    {
      slug: 'huggingface-for-beginners-1',
      title: '허깅페이스 모델 페이지, 비개발자가 처음 봐야 할 다섯 가지',
      date: '2026. 5. 9',
      category: '시리즈 · 허깅페이스 모델 읽기 · 1편',
      href: '/blog/huggingface-for-beginners-1.html',
      author: '신성진',
      publishTime: '14:00:00',
      dek: '영어로 빼곡한 모델 카드 앞에서 막막했다면. 라이선스, 모델명, instruct 여부, 한국어, 크기 — 처음 봐야 할 다섯 가지 판단축으로 정리한 시리즈 1편.',
      views: { base: 60, daily: 7, publishedISO: '2026-05-09' },
    },
    {
      slug: 'claude-keynote-2026-explainer',
      title: 'Code with Claude 2026 키노트 — 비개발자가 알아둘 것만 풀어 씁니다',
      date: '2026. 5. 9',
      category: '큐레이션 · 키노트 해설',
      href: '/blog/claude-keynote-2026-explainer.html',
      author: 'CDSA 편집팀',
      authorType: 'Organization',
      publishTime: '10:00:00',
      dek: 'Managed Agents, Multi-Agent Orchestration, Outcomes, Dreaming, Routines, CI Autofix. 앤트로픽 키노트 47분에 등장한 핵심 용어를 비개발자 어휘로 옮긴 다섯 화두. "모델은 지수곡선, 조직은 직선" 그 간격을 메우는 무기들.',
      views: { base: 110, daily: 11, publishedISO: '2026-05-09' },
    },
    {
      slug: 'claude-keynote-2026-transcript',
      title: 'Code with Claude 2026 키노트 — 전체 한국어 전사록',
      date: '2026. 5. 9',
      category: '자료 · 전사록',
      href: '/blog/claude-keynote-2026-transcript.html',
      author: 'CDSA 편집팀',
      authorType: 'Organization',
      publishTime: '10:30:00',
      dek: '앤트로픽이 진행한 2026 Code with Claude 오프닝 키노트의 47분짜리 발화 전체를 발표자별·타임스탬프별로 한국어로 옮긴 전사록. CPO 오프닝부터 Boris Cherny의 AcmePay·Routines 시연까지 다섯 섹션 구조.',
      views: { base: 60, daily: 6, publishedISO: '2026-05-09' },
    },
    {
      slug: 'ai-floor-and-ceiling',
      title: 'AI가 끌어올린 바닥, 우리의 천장은 어디인가',
      date: '2026. 5. 8',
      category: '큐레이션 · AI 시대 일하기',
      href: '/blog/ai-floor-and-ceiling.html',
      author: '최홍찬',
      dek: '1839년 사진기가 발명되었을 때 회화는 죽지 않았다. 천장이 더 높이 올라갔을 뿐. 구글 테크 리드 최홍찬이 길어 올린 세 가지 화두 — FOMO를 다스리는 법, 책임은 외주화할 수 없다, 그리고 비판적 사고력.',
      views: { base: 80, daily: 9, publishedISO: '2026-05-08' },
    },
    {
      slug: 'ai-hegemony-2026',
      title: '2026 AI 패권 전쟁 — 더 이상 모델 싸움이 아닙니다',
      date: '2026. 4. 24',
      category: 'AI 산업 분석',
      href: '/blog/ai-hegemony-2026.html',
      author: '김태유',
      dek: '지능보다 빠른 것은 에너지·인터페이스·몸이었다. 메타의 원자력 20년 계약, 오픈AI Operator의 인터페이스 소멸, 1X NEO 2만 달러 휴머노이드 — 네 거인은 이제 같은 전쟁을 다른 무기로 치르는 것이 아니라 네 개의 다른 전쟁을 치른다. 김태유 박사의 AI 산업 지형 리포트.',
      views: { base: 250, daily: 16, publishedISO: '2026-04-24' },
    },
    {
      slug: 'ai-value-gap-2026',
      title: '2026 생성형 AI 가치 격차 — 88%가 도입했는데 왜 6%만 이익을 보는가',
      date: '2026. 4. 23',
      category: 'AI 경영 리포트',
      href: '/blog/ai-value-gap-2026.html',
      author: '신성진',
      dek: '맥킨지·PwC·BCG·가트너가 2026년 1분기에 쏟아낸 리서치가 같은 결론으로 수렴한다. 월스트리트 6대 은행의 470억 달러 이익과 1만 5천 명 감원, 한국은행 BOKI와 LG전자 288배 분석 가속화까지 — 실험의 해는 끝났고 결산이 시작됐다. 신성진 대표 · Claude Deep Research 공동 작성.',
      views: { base: 480, daily: 22, publishedISO: '2026-04-23' },
    },
    {
      slug: 'search-vs-delegate',
      title: 'AI를 써도 업무가 빨라지지 않는 진짜 이유',
      date: '2026. 4. 22',
      category: 'AI 활용론',
      href: '/blog/search-vs-delegate.html',
      author: '이중균',
      dek: 'AI를 네이버·구글처럼 검색하고 있다면, 지금부터 접근을 완전히 바꿔야 한다. 주산반이 사라졌듯 지금의 검색 습관도 사라진다. 검색이 아니라 위임이다.',
      views: { base: 560, daily: 15, publishedISO: '2026-04-22' },
    },
    {
      slug: 'step-by-step-thinking',
      title: '단계별 사고가 사람과 AI 모두에게 더 좋은 결과를 맺는다',
      date: '2026. 4. 21',
      category: 'AI 사고론',
      href: '/blog/step-by-step-thinking.html',
      author: '이중균',
      dek: '"Let\'s think step by step" 한 문장이 산술 정답률을 17.7%에서 78.7%로 올렸다. Chain-of-Thought부터 추론 모델 시대까지 — 인지과학과 LLM 연구가 똑같이 말하는 원리.',
      views: { base: 660, daily: 17, publishedISO: '2026-04-21' },
    },
    {
      slug: 'ai-problem-solving',
      title: 'AI가 똑똑해져도 당신의 업무가 안 바뀌는 이유',
      date: '2026. 4. 20',
      category: 'AI 문제해결론',
      href: '/blog/ai-problem-solving.html',
      author: '이중균',
      dek: "문제는 기술이 아니다. AI를 '도구'로 보는 순간, 가장 중요한 질문을 놓친다. 문서 · 데이터 · 바이브코딩 세 톱니바퀴가 맞물려야 비로소 '문제 해결'이 된다는, 이중균 대표의 AI 문제해결론.",
      views: { base: 1020, daily: 18, publishedISO: '2026-04-20' },
    },
    {
      slug: 'agent-as-workflow',
      title: 'AI Agent는 챗봇이 아니라 일하는 방식입니다',
      date: '2026. 4. 19',
      category: '에이전트 운영론',
      href: '/blog/agent-as-workflow.html',
      author: '김태유',
      dek: '챗봇은 "뭘 알고 싶어?"에 답하지만, 에이전트는 "뭘 해야 해?"에 답한다. 더 좋은 모델의 문제가 아니라 일을 쪼개고 굴리는 구조의 문제다. OpenClaw 기준으로 풀어 보는 에이전트 운영론 시리즈의 첫 편.',
      views: { base: 1220, daily: 20, publishedISO: '2026-04-19' },
    },
    {
      slug: 'domain-daxist',
      title: '시민데이터과학자에서 Domain-DAXist로 진화',
      date: '2026. 4. 18',
      category: 'Domain-DAXist',
      href: '/blog/domain-daxist.html',
      author: '현중균',
      dek: "생성형 AI 시대, 기획·디자인·개발의 경계가 '묽어지고' 있다. 알파고 이후의 데이터 석유 시대, 시민 데이터 과학자, 그리고 LLM 이후 — 자신의 도메인을 바탕으로 DX·AX를 스스로 주도하는 새 인재상을 정의하는 연재의 첫 편.",
      views: { base: 1380, daily: 22, publishedISO: '2026-04-18' },
    },
    {
      slug: 'gemini-worker',
      title: 'AI 시대, 직장인의 일은 어떻게 바뀌는가',
      date: '2026. 4. 18',
      category: 'Gemini 업무론',
      href: '/blog/gemini-worker.html',
      author: '김태유',
      dek: '직접 생산하는 사람에서 설계하고 검수하는 사람으로. 회의·이메일·보고서가 재배치되는 자리, 그리고 Gemini가 업무 흐름 속으로 들어오는 방법. 집필 중인 단행본 「직장인을 위한 Gemini 업무 활용법」 1장 초고.',
      views: { base: 1640, daily: 26, publishedISO: '2026-04-18' },
    },
    {
      slug: 'working-governance',
      title: '작동하는 거버넌스, 바닥에서 올라오는 AX',
      date: '2026. 4. 14',
      category: 'AX 거버넌스',
      href: '/blog/working-governance.html',
      author: '신성진',
      dek: '막는 정책에서 작동하는 거버넌스로. 폐쇄망에서 실제로 돌아가는 여덟 가지 증거, 골목길의 문제, 그리고 거버넌스 5층위의 3·4·5층을 채우는 이야기.',
      views: { base: 2100, daily: 28, publishedISO: '2026-04-14' },
    },
    {
      slug: 'multi-agent-patterns',
      title: '멀티 에이전트 7가지 유형, 쓸모 있게 정리하기',
      date: '2026. 4. 1',
      category: '에이전트 아키텍처',
      href: '/blog/multi-agent-patterns.html',
      author: '신성진',
      dek: "SNS 타임라인에 자주 도는 '멀티 에이전트 7가지 패턴'을 실무 기준으로 풀어 본다. 오케스트레이터부터 자기성찰형까지. 본질은 통제 구조와 실행 순서 두 축이다.",
      views: { base: 2400, daily: 22, publishedISO: '2026-04-01' },
    },
    {
      slug: 'mcp-client',
      title: 'MCP 클라이언트를 직접 만들 때 왜 에이전트 서버가 핵심인가',
      date: '2026. 4. 1',
      category: 'MCP 실무',
      href: '/blog/mcp-client.html',
      author: '신성진',
      dek: '도구라는 말은 편하지만 손에 잘 잡히지 않는다. 채팅창 뒤에 무엇이 있어야 MCP 클라이언트가 제대로 작동하는가. 기능을 네 가지 유형으로 풀어 본 현실적인 지도.',
      views: { base: 1720, daily: 14, publishedISO: '2026-04-01' },
    },
    {
      slug: 'harness',
      title: '하네스라는 단어, 한 걸음 더 들어가 보기',
      date: '2026. 3. 25',
      category: 'AI 도구론',
      href: '/blog/harness.html',
      author: '신성진',
      dek: '용어를 아는 것은 좋은 출발점이다. 다만 그 자리에서 한 걸음만 더 들어가면, 훨씬 또렷하게 보이는 풍경이 있다. 60줄짜리 파이썬부터 Claude Code까지, 하네스의 실체를 파일과 폴더 단위로 내려가 본 기록.',
      views: { base: 1950, daily: 13, publishedISO: '2026-03-25' },
    },
    {
      slug: 'mcp-server',
      title: 'MCP 서버의 원리, 전문기술이지만 쉽게 이해하기',
      date: '2026. 3. 18',
      category: 'MCP 심화',
      href: '/blog/mcp-server.html',
      author: '신성진',
      dek: '기능 목록·입력 형식·실행 코드·결과 반환. 거창한 마법이 아니라 네 가지 뼈대로 풀어 본 MCP 서버의 내부 구조. 일반 API 서버와 무엇이 다른가부터 왜 필요한가까지.',
      views: { base: 2300, daily: 14, publishedISO: '2026-03-18' },
    },
    {
      slug: 'mcp-guide',
      title: 'MCP 서버·클라이언트·에이전트 서버 입문 가이드',
      date: '2026. 3. 11',
      category: 'MCP 입문',
      href: '/blog/mcp-guide.html',
      author: '신성진',
      dek: 'MCP는 한 마디로 무엇인가. 서버와 클라이언트와 에이전트 서버는 어떻게 다른가. 식당 비유로 풀어 본 입문 지도. 그리고 초보자가 직접 만들 때 어디서부터 시작해야 하는지까지.',
      views: { base: 2900, daily: 18, publishedISO: '2026-03-11' },
    },
    {
      slug: 'what-is-agent',
      title: 'ChatGPT에 코드 물어보는 것도 AI 에이전트일까?',
      date: '2026. 3. 4',
      category: '에이전트 개념',
      href: '/blog/what-is-agent.html',
      author: '신성진',
      dek: '프롬프팅·워크플로우·에이전트·에이전틱 AI·하네스 — 섞여 쓰이는 이 단어들을 운전 비유 하나로 정리한다. 진짜 구분선은 "AI가 다음에 뭘 할지 누가 정하는가"다.',
      views: { base: 3800, daily: 14, publishedISO: '2026-03-04' },
    },
  ];

  function getCurrentSlug() {
    const path = window.location.pathname;
    const match = POSTS.find((p) => path.endsWith(p.href) || path.endsWith('/' + p.slug + '.html'));
    return match ? match.slug : null;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatViews(n) {
    return Math.round(n).toLocaleString('ko-KR');
  }

  // 발행일로부터 경과 일수 (KST 자정 기준, 음수는 0으로 클램핑)
  function daysSince(publishedISO) {
    if (!publishedISO) return 0;
    const pub = new Date(publishedISO + 'T00:00:00+09:00');
    const ms = Date.now() - pub.getTime();
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  }

  // base + daily * 경과일수 — 결정적, 재방문 시에도 안정적인 카운트
  function computeViews(post) {
    if (!post || !post.views) return null;
    const v = post.views;
    return v.base + v.daily * daysSince(v.publishedISO);
  }

  function renderLeftSidebar() {
    const list = document.querySelector('.blog-left-list');
    if (!list) return;
    const current = getCurrentSlug();
    list.innerHTML = POSTS.map((p) => {
      const isCurrent = p.slug === current;
      const views = computeViews(p);
      const viewsHtml = views !== null
        ? '<span class="li-views">' + formatViews(views) + '</span>'
        : '';
      return (
        '<li' + (isCurrent ? ' class="current"' : '') + '>' +
          '<a href="' + p.href + '">' +
            '<span class="li-date">' + escapeHtml(p.date) +
              '<span class="li-category">' + escapeHtml(p.category) + '</span>' +
            '</span>' +
            '<span class="li-title">' + escapeHtml(p.title) + '</span>' +
            viewsHtml +
          '</a>' +
        '</li>'
      );
    }).join('');
  }

  function extractCleanH2Text(h2) {
    const clone = h2.cloneNode(true);
    const num = clone.querySelector('.num');
    if (num) num.remove();
    return clone.textContent.trim();
  }

  function renderTOC() {
    const toc = document.querySelector('.blog-toc');
    if (!toc) return;
    const headings = document.querySelectorAll('article h2[id]');
    if (headings.length === 0) {
      toc.innerHTML = '<li style="color:var(--ink-mute);font-style:italic">섹션 없음</li>';
      return;
    }
    toc.innerHTML = Array.from(headings).map((h) => {
      const text = extractCleanH2Text(h);
      return '<li data-id="' + h.id + '"><a href="#' + h.id + '">' + escapeHtml(text) + '</a></li>';
    }).join('');
  }

  function setupScrollSpy() {
    const headings = document.querySelectorAll('article h2[id]');
    if (headings.length === 0) return;
    const tocLis = document.querySelectorAll('.blog-toc li');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tocLis.forEach((li) => {
              li.classList.toggle('active', li.dataset.id === id);
            });
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    headings.forEach((h) => observer.observe(h));
  }

  function setupHamburger() {
    const burger = document.querySelector('.blog-hamburger');
    const sidebar = document.querySelector('.blog-left');
    const overlay = document.querySelector('.blog-overlay');
    if (!burger || !sidebar || !overlay) return;
    const toggle = () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    };
    burger.addEventListener('click', toggle);
    overlay.addEventListener('click', toggle);
  }

  // 인덱스(/blog/) 페이지 — 카드 리스트를 POSTS에서 자동 렌더링
  function renderIndexCards() {
    const list = document.getElementById('posts-list');
    if (!list) return;
    list.innerHTML = POSTS.map((p) => {
      return (
        '<article class="post">' +
          '<div class="post-meta">' +
            '<span class="post-date">' + escapeHtml(p.date) + '</span>' +
            '<span class="post-category">' + escapeHtml(p.category) + '</span>' +
          '</div>' +
          '<div class="post-body">' +
            '<a href="' + p.href + '">' +
              '<h2 class="post-title">' + escapeHtml(p.title) + '</h2>' +
              '<p class="post-dek">' + escapeHtml(p.dek || '') + '</p>' +
              '<span class="post-readmore">읽기 →</span>' +
            '</a>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  // 인덱스(/blog/) 페이지 — Blog Schema JSON-LD를 POSTS에서 자동 생성
  function renderIndexJsonLd() {
    const slot = document.getElementById('blog-jsonld');
    if (!slot) return;
    const blogPost = POSTS.map((p) => {
      const time = p.publishTime || '09:00:00';
      const datePub = (p.views && p.views.publishedISO ? p.views.publishedISO : '') + 'T' + time + '+09:00';
      return {
        '@type': 'BlogPosting',
        headline: p.title,
        url: 'https://cdsa.kr' + p.href,
        datePublished: datePub,
        author: {
          '@type': p.authorType || 'Person',
          name: p.author || 'CDSA 편집팀',
        },
        articleSection: p.category,
      };
    });
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'CDSA 블로그 · 현장의 기록',
      description: 'AI와 데이터, 그리고 일하는 방식에 대해 협회 전문가들이 남기는 기록.',
      url: 'https://cdsa.kr/blog/',
      publisher: {
        '@type': 'Organization',
        name: '한국데이터사이언티스트협회',
        url: 'https://cdsa.kr',
        logo: { '@type': 'ImageObject', url: 'https://cdsa.kr/og-image.png' },
      },
      inLanguage: 'ko-KR',
      blogPost: blogPost,
    };
    slot.textContent = JSON.stringify(data, null, 2);
  }

  // 현재 글의 byline 우측에 "· 조회 X,XXX" 추가
  function renderViewCount() {
    const slug = getCurrentSlug();
    if (!slug) return;
    const post = POSTS.find((p) => p.slug === slug);
    const views = computeViews(post);
    if (views === null) return;

    const byline = document.querySelector('.byline');
    if (!byline) return;

    // byline의 마지막 span(보통 발행일)에 조회수 추가
    const spans = byline.querySelectorAll('span');
    if (spans.length === 0) return;
    const dateSpan = spans[spans.length - 1];
    if (dateSpan.querySelector('.view-count')) return; // 중복 방지

    const sep = document.createElement('span');
    sep.textContent = ' · ';
    sep.style.cssText = 'color:var(--rule);';
    const vc = document.createElement('span');
    vc.className = 'view-count';
    vc.style.cssText = 'color:var(--clay-deep);font-weight:500;letter-spacing:0.02em;';
    vc.textContent = '조회 ' + formatViews(views);
    dateSpan.appendChild(sep);
    dateSpan.appendChild(vc);
  }

  function init() {
    renderLeftSidebar();
    renderTOC();
    setupScrollSpy();
    setupHamburger();
    renderViewCount();
    // 인덱스 페이지 전용 (개별 글 페이지에서는 대상 요소가 없어 noop)
    renderIndexCards();
    renderIndexJsonLd();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
