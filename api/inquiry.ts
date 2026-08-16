import type { VercelRequest, VercelResponse } from '@vercel/node';

// 노션 "CDSA 문의함" 데이터베이스 (ID는 비밀 아님, 토큰은 환경변수)
const NOTION_DB_ID = 'cc3d1a576e064323b562cb174ddb623f';
const COURSES = ['AI챔피언 강사양성', '취업준비 AI역량강화'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { course, name, email, org, phone, message, website } = req.body || {};

  // 허니팟: 봇이 채우는 숨은 필드 — 채워져 있으면 조용히 성공 처리
  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Inquiry configuration error' });
  }

  const courseName = COURSES.includes(course) ? course : '기타';

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DB_ID },
        properties: {
          '이름': { title: [{ text: { content: String(name).slice(0, 100) } }] },
          '과정': { select: { name: courseName } },
          '이메일': { email: String(email).slice(0, 200) },
          '소속': { rich_text: [{ text: { content: String(org || '').slice(0, 200) } }] },
          '연락처': { phone_number: phone ? String(phone).slice(0, 40) : null },
          '문의 내용': { rich_text: [{ text: { content: String(message || '').slice(0, 1900) } }] },
          '처리상태': { select: { name: '신규' } },
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Notion API error:', response.status, detail);
      return res.status(502).json({ error: 'Failed to save inquiry' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Inquiry error:', error);
    return res.status(500).json({ error: 'Failed to save inquiry' });
  }
}
