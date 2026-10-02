import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentKey, orderId, amount } = req.body;

  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 상품별 기대 금액 검증 — 클라이언트가 조작한 금액의 승인을 차단
  // orderId 접두어는 각 결제 페이지의 requestPayment에서 부여한다
  const EXPECTED_AMOUNTS: Record<string, number> = {
    'HJ26': 1200000,  // 한진그룹 바이브 코딩 업무자동화 (2일)
    'YK26': 1100000,  // 유한킴벌리 바이브 코딩 특강
    'AXP10': 638000,  // AXP-10 AI·HR 과정
    'FB26': 990,      // Five Blades 세미나
  };
  const prefix = String(orderId).split('-')[0];
  const expected = EXPECTED_AMOUNTS[prefix];
  if (!expected || Number(amount) !== expected) {
    return res.status(400).json({ error: 'Invalid order amount' });
  }

  // 토스페이먼츠 시크릿 키 (환경변수에서 가져옴)
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'Payment configuration error' });
  }

  const encryptedSecretKey = 'Basic ' + Buffer.from(secretKey + ':').toString('base64');

  try {
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': encryptedSecretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Payment confirmation failed' });
  }
}
