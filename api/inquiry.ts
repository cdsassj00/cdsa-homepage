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

    // 이메일 알림 (실패해도 문의 접수 자체는 성공 처리)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const esc = (s: unknown) => String(s || '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] as string));
      const row = (label: string, value: string) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;width:90px;white-space:nowrap">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${value}</td></tr>`;
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'CDSA 문의 알림 <notify@aicapa.kr>',
            to: ['sjshin@cdsa.kr'],
            reply_to: email,
            subject: `[CDSA 문의] ${courseName} — ${String(name).slice(0, 30)}`,
            html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:12px">`
              + `<h2 style="margin:0 0 16px;font-size:18px">새 문의가 접수되었습니다</h2>`
              + `<table style="width:100%;border-collapse:collapse;font-size:14px">`
              + row('과정', esc(courseName))
              + row('이름', esc(name))
              + row('이메일', esc(email))
              + row('소속', esc(org))
              + row('연락처', esc(phone))
              + row('문의 내용', esc(message).replace(/\n/g, '<br>'))
              + `</table>`
              + `<p style="font-size:12px;color:#999;margin-top:20px">이 메일에 답장하면 문의자에게 바로 전달됩니다. 전체 목록은 노션 &lsquo;CDSA 문의함&rsquo;에서 확인하세요.</p>`
              + `</div>`,
          }),
        });
      } catch (mailError) {
        console.error('Resend notify error:', mailError);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Inquiry error:', error);
    return res.status(500).json({ error: 'Failed to save inquiry' });
  }
}
