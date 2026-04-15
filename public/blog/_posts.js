/* ============================================
   Blog post list + TOC renderer (shared)
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
   When adding a new post: add one entry to the POSTS array below.
============================================ */

(function () {
  // Single source of truth for blog posts. Sorted newest-first.
  const POSTS = [
    {
      slug: 'multi-agent-patterns',
      title: '멀티 에이전트 7가지 유형, 쓸모 있게 정리하기',
      date: '2026. 4. 1',
      category: '에이전트 아키텍처',
      href: '/blog/multi-agent-patterns.html',
    },
    {
      slug: 'mcp-client',
      title: 'MCP 클라이언트를 직접 만들 때 왜 에이전트 서버가 핵심인가',
      date: '2026. 4. 1',
      category: 'MCP 실무',
      href: '/blog/mcp-client.html',
    },
    {
      slug: 'harness',
      title: '하네스라는 단어, 한 걸음 더 들어가 보기',
      date: '2026. 3. 25',
      category: 'AI 도구론',
      href: '/blog/harness.html',
    },
    {
      slug: 'mcp-server',
      title: 'MCP 서버의 원리, 전문기술이지만 쉽게 이해하기',
      date: '2026. 3. 18',
      category: 'MCP 심화',
      href: '/blog/mcp-server.html',
    },
    {
      slug: 'mcp-guide',
      title: 'MCP 서버·클라이언트·에이전트 서버 입문 가이드',
      date: '2026. 3. 11',
      category: 'MCP 입문',
      href: '/blog/mcp-guide.html',
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

  function renderLeftSidebar() {
    const list = document.querySelector('.blog-left-list');
    if (!list) return;
    const current = getCurrentSlug();
    list.innerHTML = POSTS.map((p) => {
      const isCurrent = p.slug === current;
      return (
        '<li' + (isCurrent ? ' class="current"' : '') + '>' +
          '<a href="' + p.href + '">' +
            '<span class="li-date">' + escapeHtml(p.date) +
              '<span class="li-category">' + escapeHtml(p.category) + '</span>' +
            '</span>' +
            '<span class="li-title">' + escapeHtml(p.title) + '</span>' +
          '</a>' +
        '</li>'
      );
    }).join('');
  }

  function extractCleanH2Text(h2) {
    // h2 has structure: <h2 id="s01"><span class="num">01 / 정의</span>제목 텍스트</h2>
    // We want only the trailing title text, not the .num prefix.
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

  function init() {
    renderLeftSidebar();
    renderTOC();
    setupScrollSpy();
    setupHamburger();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
