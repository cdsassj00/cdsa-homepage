/**
 * generate-rss.mjs
 * _posts.js 메타데이터 + 각 블로그 HTML 본문을 읽어
 * public/rss.xml (RSS 2.0 + content:encoded) 을 생성한다.
 *
 * 실행: node scripts/generate-rss.mjs
 * 새 글 추가 후 배포 전에 한 번 돌리면 된다.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_DIR = resolve(ROOT, 'public/blog');
const POSTS_FILE = resolve(BLOG_DIR, '_posts.js');
const OUT_FILE = resolve(ROOT, 'public/rss.xml');

const SITE = 'https://cdsa.kr';
const FEED_TITLE = '한국데이터사이언티스트협회 · CDSA 블로그';
const FEED_DESC = 'AI 시대, 일하는 방식을 바꾸는 전문가들. 공공·대기업 150여 기관에서 AI·데이터 교육을 직접 설계하고 실행합니다.';
const FEED_LANG = 'ko';
const FEED_IMAGE = `${SITE}/og-image.png`;

// ── _posts.js 파싱 (JS를 직접 평가) ──
function parsePosts() {
  const raw = readFileSync(POSTS_FILE, 'utf-8');
  const match = raw.match(/const\s+POSTS\s*=\s*(\[[\s\S]*?\n\s*\]);/);
  if (!match) throw new Error('_posts.js에서 POSTS 배열을 찾을 수 없음');
  // dek 안에 큰따옴표 등이 있어 JSON 변환 대신 JS를 직접 평가
  const fn = new Function(`return ${match[1]};`);
  return fn();
}

// ── HTML 파일에서 <article class="wrap"> 안의 본문 추출 ──
function extractBody(slug) {
  const file = resolve(BLOG_DIR, `${slug}.html`);
  let html;
  try {
    html = readFileSync(file, 'utf-8');
  } catch {
    return null; // 파일 없으면 skip
  }

  // <article class="wrap"> ... </article> 추출
  const m = html.match(/<article\s+class="wrap">([\s\S]*?)<\/article>/);
  if (!m) return null;

  let body = m[1];

  // breadcrumb, kicker, byline, bottom-nav, source-note, footer 등 네비게이션 요소 제거
  body = body.replace(/<nav\s+class="breadcrumb">[\s\S]*?<\/nav>/g, '');
  body = body.replace(/<div\s+class="kicker">[\s\S]*?<\/div>/g, '');
  body = body.replace(/<div\s+class="byline">[\s\S]*?<\/div>/g, '');
  body = body.replace(/<nav\s+class="bottom-nav">[\s\S]*?<\/nav>/g, '');
  body = body.replace(/<div\s+class="footer">[\s\S]*?<\/div>/g, '');
  body = body.replace(/<!--[\s\S]*?-->/g, '');

  return body.trim();
}

// ── XML 이스케이프 (태그 밖 텍스트용) ──
function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── 날짜 → RFC-822 ──
function toRFC822(dateStr, timeStr) {
  // dateStr: "2026. 5. 30"  timeStr: "09:00:00"
  const parts = dateStr.replace(/\./g, '').trim().split(/\s+/);
  const y = parseInt(parts[0]);
  const mo = parseInt(parts[1]) - 1;
  const d = parseInt(parts[2]);
  const [h, mi, s] = (timeStr || '09:00:00').split(':').map(Number);
  const dt = new Date(y, mo, d, h, mi, s);
  return dt.toUTCString();
}

// ── RSS 생성 ──
function generate() {
  const posts = parsePosts();
  const now = new Date().toUTCString();

  const items = posts.map(p => {
    const link = `${SITE}${p.href}`;
    const pubDate = toRFC822(p.date, p.publishTime);
    const author = p.author || 'CDSA 편집팀';
    const body = extractBody(p.slug);

    let item = `    <item>
      <title>${esc(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${esc(author)}</dc:creator>
      <category>${esc(p.category || '')}</category>
      <description>${esc(p.dek || '')}</description>`;

    if (body) {
      item += `
      <content:encoded><![CDATA[${body}]]></content:encoded>`;
    }

    item += `
    </item>`;
    return item;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(FEED_TITLE)}</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${esc(FEED_DESC)}</description>
    <language>${FEED_LANG}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <image>
      <url>${FEED_IMAGE}</url>
      <title>${esc(FEED_TITLE)}</title>
      <link>${SITE}/blog/</link>
    </image>
${items.join('\n')}
  </channel>
</rss>
`;

  writeFileSync(OUT_FILE, xml, 'utf-8');
  console.log(`RSS 생성 완료: ${OUT_FILE}`);
  console.log(`포스트 ${posts.length}개, 본문 포함 ${items.filter(i => i.includes('content:encoded')).length}개`);
}

generate();
