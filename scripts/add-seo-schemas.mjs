import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const BLOG_DIR = join(import.meta.dirname, '..', 'public', 'blog');

function extractInfo(html, filename) {
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]?.replace(' · CDSA 블로그', '') || '';
  const canonical = html.match(/<link rel="canonical" href="(.*?)"/)?.[1] || `https://cdsa.kr/blog/${filename}`;
  const section = html.match(/class="bc-sep">\/.*?<span>(.*?)<\/span>/)?.[1] || 'AI 인사이트';
  const publishedTime = html.match(/article:published_time" content="(.*?)"/)?.[1] || '2026-04-01T09:00:00+09:00';

  // Extract H2 headings for FAQ generation
  const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gs)].map(m => {
    return m[1].replace(/<[^>]+>/g, '').replace(/\d+\s*\/\s*\S+\s*/, '').trim();
  }).filter(h => h.length > 5);

  return { title, canonical, section, publishedTime, h2s, filename };
}

function generateBreadcrumbSchema(info) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "CDSA",
        "item": "https://cdsa.kr/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "블로그",
        "item": "https://cdsa.kr/blog/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": info.title,
        "item": info.canonical
      }
    ]
  };
}

function generateFAQSchema(info) {
  const faqs = [];

  // Generate 3-4 FAQ items from H2 headings
  const questionTemplates = [
    (h) => `${h}에 대해 무엇을 알아야 하나요?`,
    (h) => `${h}의 핵심 내용은 무엇인가요?`,
    (h) => `${h}이(가) 중요한 이유는 무엇인가요?`
  ];

  // Also add topic-specific FAQ based on filename patterns
  const topicFAQs = getTopicFAQs(info);
  faqs.push(...topicFAQs);

  // Add H2-based FAQs if we need more
  const needed = Math.max(0, 3 - faqs.length);
  for (let i = 0; i < Math.min(needed, info.h2s.length); i++) {
    const h2 = info.h2s[i];
    if (h2.length > 50) continue; // skip overly long headings
    faqs.push({
      "@type": "Question",
      "name": questionTemplates[i % 3](h2),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `이 글에서 '${h2}' 섹션을 통해 구체적인 데이터와 사례로 설명합니다. 자세한 내용은 본문을 참고하세요.`
      }
    });
  }

  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.slice(0, 5)
  };
}

function getTopicFAQs(info) {
  const fn = info.filename;
  const faqs = [];

  if (fn.includes('mcp')) {
    faqs.push({
      "@type": "Question",
      "name": "MCP(Model Context Protocol)란 무엇인가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "MCP는 Anthropic이 공개한 개방형 프로토콜로, AI 에이전트가 외부 도구·데이터소스와 표준화된 방식으로 연결될 수 있게 합니다. 서버-클라이언트 구조로 동작하며, 어떤 LLM이든 MCP 서버에 연결해 기능을 확장할 수 있습니다." }
    });
    faqs.push({
      "@type": "Question",
      "name": "MCP 서버를 만들려면 어떤 기술이 필요한가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "Python 또는 TypeScript 기본 지식이면 충분합니다. Anthropic의 MCP SDK를 사용하면 도구(tool) 정의와 핸들러 함수를 작성하는 것만으로 서버를 구축할 수 있습니다. 비개발자도 바이브코딩으로 직접 만들 수 있는 수준입니다." }
    });
  } else if (fn.includes('agent') || fn.includes('multi-agent')) {
    faqs.push({
      "@type": "Question",
      "name": "AI 에이전트란 무엇인가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "AI 에이전트는 사용자의 목표를 받아 스스로 계획을 세우고, 도구를 호출하며, 결과를 검증하는 자율적 AI 시스템입니다. 단순 챗봇과 달리 여러 단계의 작업을 스스로 수행합니다." }
    });
    faqs.push({
      "@type": "Question",
      "name": "멀티에이전트 시스템은 어떤 상황에서 필요한가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "단일 에이전트로는 처리하기 복잡한 작업, 전문 분야가 다른 하위 작업들을 병렬로 처리해야 할 때, 또는 검토-실행 분리가 필요한 업무에서 멀티에이전트 구조가 효과적입니다." }
    });
  } else if (fn.includes('vibe') || fn.includes('governance') || fn.includes('harness')) {
    faqs.push({
      "@type": "Question",
      "name": "바이브코딩이란 무엇인가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "바이브코딩(Vibe Coding)은 AI에게 자연어로 의도를 전달하고, AI가 코드를 생성하며, 사람은 방향을 잡고 결과를 검증하는 새로운 개발 방식입니다. 비개발자도 소프트웨어를 만들 수 있게 하는 접근법입니다." }
    });
    faqs.push({
      "@type": "Question",
      "name": "공공기관에서 바이브코딩이 가능한가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "가능합니다. 행정망·폐쇄망 환경에서도 로컬 LLM이나 오프라인 AI 도구를 활용해 바이브코딩을 수행할 수 있습니다. CDSA는 8가지 유형의 로컬·오프라인 바이브코딩 방식을 정리했습니다." }
    });
  } else if (fn.includes('ai-value') || fn.includes('ai-hegemony') || fn.includes('ai-floor')) {
    faqs.push({
      "@type": "Question",
      "name": "2026년 기업 AI 도입 현황은 어떤가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "맥킨지 조사에 따르면 기업의 88%가 AI를 도입했지만, AI로 실질적 이익(EBIT 5% 이상)을 보는 기업은 6%에 불과합니다. 대부분 도구만 도입하고 프로세스 재설계를 하지 않아 ROI를 못 내고 있습니다." }
    });
    faqs.push({
      "@type": "Question",
      "name": "AI 교육이 ROI에 미치는 영향은 무엇인가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "BCG 연구에 따르면 최소 5시간의 AI 교육을 받은 직원의 정기 사용률이 유의미하게 높았습니다. 교육 없이 라이선스만 배포하면 투자 대비 효과가 나타나지 않습니다." }
    });
  } else if (fn.includes('huggingface')) {
    faqs.push({
      "@type": "Question",
      "name": "허깅페이스란 무엇인가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "허깅페이스(Hugging Face)는 오픈소스 AI 모델을 공유하는 플랫폼입니다. 100만 개 이상의 모델이 등록되어 있으며, 누구나 모델을 다운로드하고 자신의 업무에 맞게 활용할 수 있습니다." }
    });
    faqs.push({
      "@type": "Question",
      "name": "비개발자도 허깅페이스 모델을 사용할 수 있나요?",
      "acceptedAnswer": { "@type": "Answer", "text": "가능합니다. 모델 카드를 읽는 법을 알면 적합한 모델을 고를 수 있고, Ollama나 LM Studio 같은 도구로 코딩 없이 로컬에서 실행할 수 있습니다." }
    });
  } else if (fn.includes('step-by-step') || fn.includes('search-vs') || fn.includes('problem-solving')) {
    faqs.push({
      "@type": "Question",
      "name": "AI를 업무에 효과적으로 적용하는 방법은 무엇인가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "단순히 AI 도구를 도입하는 것이 아니라, 업무 프로세스를 AI에 맞게 재설계해야 합니다. 검색-위임 구분, 단계별 사고 적용, 문제 분해 능력이 핵심입니다." }
    });
  } else if (fn.includes('domain-daxist') || fn.includes('gemini-worker')) {
    faqs.push({
      "@type": "Question",
      "name": "AI 시대에 직장인에게 필요한 역량은 무엇인가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "도메인 전문성과 AI 활용 능력의 결합이 핵심입니다. 자신의 업무 분야를 깊이 이해하면서 AI 도구를 효과적으로 활용할 수 있는 'Domain-DAXist'가 되는 것이 목표입니다." }
    });
  } else if (fn.includes('claude-keynote')) {
    faqs.push({
      "@type": "Question",
      "name": "Claude Code란 무엇인가요?",
      "acceptedAnswer": { "@type": "Answer", "text": "Claude Code는 Anthropic이 만든 터미널 기반 AI 코딩 에이전트입니다. 자연어로 지시하면 코드 작성, 파일 편집, 테스트 실행, Git 작업까지 자율적으로 수행합니다." }
    });
  }

  return faqs;
}

// Process all blog HTML files
const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');

let processed = 0;
for (const file of files) {
  const filepath = join(BLOG_DIR, file);
  let html = readFileSync(filepath, 'utf-8');

  // Skip if already has BreadcrumbList
  if (html.includes('BreadcrumbList')) continue;

  const info = extractInfo(html, file);

  const breadcrumbSchema = generateBreadcrumbSchema(info);
  const faqSchema = generateFAQSchema(info);

  let schemasToAdd = `\n<script type="application/ld+json">\n${JSON.stringify(breadcrumbSchema, null, 2)}\n</script>`;
  if (faqSchema) {
    schemasToAdd += `\n<script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>`;
  }

  // Insert before <!-- END SEO --> or before </head>
  if (html.includes('<!-- END SEO -->')) {
    html = html.replace('<!-- END SEO -->', schemasToAdd + '\n<!-- END SEO -->');
  } else {
    html = html.replace('</head>', schemasToAdd + '\n</head>');
  }

  writeFileSync(filepath, html, 'utf-8');
  processed++;
  console.log(`✓ ${file} — BreadcrumbList + FAQ schema added`);
}

console.log(`\nDone: ${processed} files processed.`);
