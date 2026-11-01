import type { VercelRequest, VercelResponse } from '@vercel/node';

// 문의는 LeadFolio(cdsa 워크스페이스)에 저장되고, 알림 메일도 LeadFolio가 보낸다.
// 새 강의 페이지는 course 값만 다르게 보내면 되므로 여기 목록을 고칠 필요가 없다.
const LEADFOLIO_INQUIRY_URL = 'https://ujoqrchwqayiwfojmmtc.supabase.co/functions/v1/inquiry-submit';
const FORM_SLUG = 'cdsa';
const CONSENT_VERSION = 'cdsa-homepage-v1';

const text = (value: unknown, max: number) => {
  const s = typeof value === 'string' ? value.trim() : '';
  return s ? s.slice(0, max) : undefined;
};

function sourcePage(req: VercelRequest): string | undefined {
  const referer = req.headers.referer;
  if (!referer) return undefined;
  try {
    const url = new URL(referer);
    return text(url.pathname, 200);
  } catch {
    return undefined;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { course, name, email, org, phone, message, website, consent } = req.body || {};

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
  if (consent !== true) {
    return res.status(400).json({ error: 'Consent required' });
  }

  try {
    // 서버 간 호출이라 Origin 헤더를 보내지 않는다.
    const response = await fetch(LEADFOLIO_INQUIRY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: FORM_SLUG,
        consent: true,
        consentVersion: CONSENT_VERSION,
        lead: {
          name: text(name, 100),
          email: email.trim().slice(0, 200),
          company: text(org, 160),
          phone: text(phone, 40),
          customFields: {
            inquiry: text(message, 1900),
            course: text(course, 100) ?? '기타',
            source_page: sourcePage(req),
          },
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('LeadFolio inquiry error:', response.status, detail);
      return res.status(502).json({ error: 'Failed to save inquiry' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Inquiry error:', error);
    return res.status(500).json({ error: 'Failed to save inquiry' });
  }
}
