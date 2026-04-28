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
  const POSTS = [
    {
      slug: 'ai-hegemony-2026',
      title: '2026 AI 패권 전쟁 — 더 이상 모델 싸움이 아닙니다',
      date: '2026. 4. 24',
      category: 'AI 산업 분석',
      href: '/blog/ai-hegemony-2026.html',
      views: { base: 250, daily: 16, publishedISO: '2026-04-24' },
    },
    {
      slug: 'ai-value-gap-2026',
      title: '2026 생성형 AI 가치 격차 — 88%가 도입했는데 왜 6%만 이익을 보는가',
      date: '2026. 4. 23',
      category: 'AI 경영 리포트',
      href: '/blog/ai-value-gap-2026.html',
      views: { base: 480, daily: 22, publishedISO: '2026-04-23' },
    },
    {
      slug: 'search-vs-delegate',
      title: 'AI를 써도 업무가 빨라지지 않는 진짜 이유',
      date: '2026. 4. 22',
      category: 'AI 활용론',
      href: '/blog/search-vs-delegate.html',
      views: { base: 560, daily: 15, publishedISO: '2026-04-22' },
    },
    {
      slug: 'step-by-step-thinking',
      title: '단계별 사고가 사람과 AI 모두에게 더 좋은 결과를 맺는다',
      date: '2026. 4. 21',
      category: 'AI 사고론',
      href: '/blog/step-by-step-thinking.html',
      views: { base: 660, daily: 17, publishedISO: '2026-04-21' },
    },
    {
      slug: 'ai-problem-solving',
      title: 'AI가 똑똑해져도 당신의 업무가 안 바뀌는 이유',
      date: '2026. 4. 20',
      category: 'AI 문제해결론',
      href: '/blog/ai-problem-solving.html',
      views: { base: 1020, daily: 18, publishedISO: '2026-04-20' },
    },
    {
      slug: 'agent-as-workflow',
      title: 'AI Agent는 챗봇이 아니라 일하는 방식입니다',
      date: '2026. 4. 19',
      category: '에이전트 운영론',
      href: '/blog/agent-as-workflow.html',
      views: { base: 1220, daily: 20, publishedISO: '2026-04-19' },
    },
    {
      slug: 'domain-daxist',
      title: '시민데이터과학자에서 Domain-DAXist로 진화',
      date: '2026. 4. 18',
      category: 'Domain-DAXist',
      href: '/blog/domain-daxist.html',
      views: { base: 1380, daily: 22, publishedISO: '2026-04-18' },
    },
    {
      slug: 'gemini-worker',
      title: 'AI 시대, 직장인의 일은 어떻게 바뀌는가',
      date: '2026. 4. 18',
      category: 'Gemini 업무론',
      href: '/blog/gemini-worker.html',
      views: { base: 1640, daily: 26, publishedISO: '2026-04-18' },
    },
    {
      slug: 'working-governance',
      title: '작동하는 거버넌스, 바닥에서 올라오는 AX',
      date: '2026. 4. 14',
      category: 'AX 거버넌스',
      href: '/blog/working-governance.html',
      views: { base: 2100, daily: 28, publishedISO: '2026-04-14' },
    },
    {
      slug: 'multi-agent-patterns',
      title: '멀티 에이전트 7가지 유형, 쓸모 있게 정리하기',
      date: '2026. 4. 1',
      category: '에이전트 아키텍처',
      href: '/blog/multi-agent-patterns.html',
      views: { base: 2400, daily: 22, publishedISO: '2026-04-01' },
    },
    {
      slug: 'mcp-client',
      title: 'MCP 클라이언트를 직접 만들 때 왜 에이전트 서버가 핵심인가',
      date: '2026. 4. 1',
      category: 'MCP 실무',
      href: '/blog/mcp-client.html',
      views: { base: 1720, daily: 14, publishedISO: '2026-04-01' },
    },
    {
      slug: 'harness',
      title: '하네스라는 단어, 한 걸음 더 들어가 보기',
      date: '2026. 3. 25',
      category: 'AI 도구론',
      href: '/blog/harness.html',
      views: { base: 1950, daily: 13, publishedISO: '2026-03-25' },
    },
    {
      slug: 'mcp-server',
      title: 'MCP 서버의 원리, 전문기술이지만 쉽게 이해하기',
      date: '2026. 3. 18',
      category: 'MCP 심화',
      href: '/blog/mcp-server.html',
      views: { base: 2300, daily: 14, publishedISO: '2026-03-18' },
    },
    {
      slug: 'mcp-guide',
      title: 'MCP 서버·클라이언트·에이전트 서버 입문 가이드',
      date: '2026. 3. 11',
      category: 'MCP 입문',
      href: '/blog/mcp-guide.html',
      views: { base: 2900, daily: 18, publishedISO: '2026-03-11' },
    },
    {
      slug: 'what-is-agent',
      title: 'ChatGPT에 코드 물어보는 것도 AI 에이전트일까?',
      date: '2026. 3. 4',
      category: '에이전트 개념',
      href: '/blog/what-is-agent.html',
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
