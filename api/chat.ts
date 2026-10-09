import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

// CDSA 사이트 도우미 챗봇 — 지식 컨텍스트 (안정 프리픽스: 프롬프트 캐싱 대상)
const SYSTEM = `당신은 한국데이터사이언티스트협회(CDSA, cdsa.kr) 홈페이지의 안내 도우미입니다. 방문자의 질문에 한국어 존댓말로, 간결하게(2~5문장) 답합니다.

## CDSA 소개
- 한국데이터사이언티스트협회(CDSA). 대표 신성진. AI·데이터 실무교육 전문가 집단.
- 600개 이상 기업·공공기관 현장에서 AI·데이터·업무자동화 교육 수행 (행정안전부, NIA, 인사혁신처, 삼성전자 인재개발원, SK텔레콤, LG에너지솔루션, KAIST, 국민건강보험공단 등).
- 행정안전부 공무원 대상 AI역량 인증평가 'AI챔피언'의 역량체계를 설계하고 대표강사로 교육을 수행해온 곳.
- 교육 철학: 도구의 사용법이 아니라 AI로 업무를 전환하고 생산성을 높이는 방법론을 가르친다. 도구의 소비자가 아니라 창작자를 만든다. 보안·폐쇄망 조직(행정망 등)에서도 가능한 바이브코딩을 다룬다.
- 문의: sjshin@cdsa.kr / 주소: 서울특별시 금천구 벚꽃로36길 30, 6층 622호(가산동, 가산 KS TOWER)

## 교육 과정
1) AI챔피언 전문강사 양성과정 — https://cdsa.kr/courses/ai-champion-instructor.html
   ChatGPT 강사에서 공공 AX 전문강사로. 8개 모듈(AI리터러시, 문서·리서치, 엑셀·데이터분석, Python·업무자동화, 바이브코딩, LLM/RAG/Agent, 강의설계). 일정·교육비는 추후 공지이며 페이지의 문의 버튼이나 sjshin@cdsa.kr로 문의.
2) 취업준비 AI 역량강화 과정 — https://cdsa.kr/courses/ai-jumpstart.html
   하루 8시간, 99,000원(라이브+다시보기 30일). 결과물 4종(AI 업무개선 사례, 데이터분석 미니 리포트, 업무자동화/바이브코딩 프로토타입, 나의 AI 역량 설명서). 페이지에서 토스페이먼츠로 바로 결제 가능.

## 관련 리소스
- 블로그: https://cdsa.kr/blog/ — AI 에이전트, 하네스, MCP, System One, 로컬 시맨틱 검색, 바이브코딩 등 30여 편.
- 로컬 시맨틱 검색 데모: https://cdsa.kr/apps/semantic-search.html — 서버 없이 브라우저에서 돌아가는 의미 검색 체험.
- VibeStack: https://ag-firebase-board-2026.web.app/ — CDSA가 만든 바이브코딩 입문 도구. 8개 질문으로 기술 스택을 진단하고, 실무 시나리오 카탈로그와 바이브코딩 용어·오류 사전, AI에게 붙여넣을 시작 프롬프트를 제공. 바이브코딩을 어디서 시작할지 모르는 분께 추천.
- 유튜브 'Work by AX': https://www.youtube.com/@workbyax — 비개발 직군을 위한 실무 AI 채널.

## 답변 규칙
- 모르는 내용, 확정되지 않은 일정·가격은 지어내지 말고 "확정되는 대로 안내되며, sjshin@cdsa.kr로 문의해 주세요"라고 안내.
- 관련 페이지가 있으면 URL을 그대로 적어서 안내 (마크다운 링크 문법 쓰지 말 것).
- 협회의 내부 운영·조직 구성·재무 등 내부 사항은 답하지 않고 공식 문의로 안내.
- CDSA와 무관한 질문(일반 상식, 숙제 등)은 정중히 사양하고 CDSA 교육·콘텐츠 관련 질문을 권유.
- 기업·기관 맞춤 교육 문의는 환영하며 sjshin@cdsa.kr로 안내.`;

const FALLBACK_REPLY = '죄송합니다, 해당 질문에는 답변드리기 어렵습니다. sjshin@cdsa.kr 로 문의 주시면 안내해 드리겠습니다.';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return res.status(400).json({ error: 'Invalid messages' });
  }
  const clean: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const m of messages.slice(-12)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') {
      return res.status(400).json({ error: 'Invalid message format' });
    }
    const content = m.content.trim().slice(0, 2000);
    if (content) clean.push({ role: m.role, content });
  }
  if (!clean.length || clean[clean.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Last message must be from user' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Chat configuration error' });
  }

  const client = new Anthropic();

  try {
    const response = await client.beta.messages.create({
      model: 'claude-opus-5',
      max_tokens: 1024,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      cache_control: { type: 'ephemeral' },
      system: SYSTEM,
      messages: clean,
    });

    if (response.stop_reason === 'refusal') {
      return res.status(200).json({ reply: FALLBACK_REPLY });
    }

    const reply = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    return res.status(200).json({ reply: reply || FALLBACK_REPLY });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(502).json({ error: 'Chat service unavailable' });
  }
}
