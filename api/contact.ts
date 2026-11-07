import type { VercelRequest, VercelResponse } from '@vercel/node';

const rateLimit = new Map<string, { count: number; reset: number }>();

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function flagEmoji(code: string) {
  if (!code || code.length !== 2) return '';
  const cc = code.toUpperCase();
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65)));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }

  try {
    const body = (req.body || {}) as Record<string, unknown>;
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const message = String(body.message || '').trim();
    const website = String(body.website || '').trim();

    // honeypot
    if (website) {
      res.status(200).json({ ok: true });
      return;
    }

    if (name.length < 1 || name.length > 80) {
      res.status(400).json({ ok: false });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ ok: false });
      return;
    }
    if (message.length < 5 || message.length > 2000) {
      res.status(400).json({ ok: false });
      return;
    }

    // rate limit
    const ip =
      (Array.isArray(req.headers['x-forwarded-for'])
        ? req.headers['x-forwarded-for'][0]
        : req.headers['x-forwarded-for']?.split(',')[0]?.trim()) ||
      req.socket?.remoteAddress ||
      'unknown';

    const now = Date.now();
    const windowMs = 10 * 60 * 1000;
    const entry = rateLimit.get(ip);
    if (!entry || now > entry.reset) {
      rateLimit.set(ip, { count: 1, reset: now + windowMs });
    } else {
      if (entry.count >= 3) {
        res.status(429).json({ ok: false });
        return;
      }
      entry.count += 1;
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      res.status(502).json({ ok: false });
      return;
    }

    const country = (req.headers['x-vercel-ip-country'] as string) || '';
    const countryField = country
      ? `${flagEmoji(country)} ${country}`
      : 'Unknown';

    const text =
      `📩 <b>New portfolio message</b>\n` +
      `👤 <b>Name:</b> ${escapeHtml(name)}\n` +
      `✉️ <b>Email:</b> ${escapeHtml(email)}\n` +
      `🌍 <b>Country:</b> ${escapeHtml(countryField)}\n` +
      `💬 <b>Message:</b> ${escapeHtml(message)}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        text,
      }),
    });

    if (!tgRes.ok) {
      res.status(502).json({ ok: false });
      return;
    }

    res.status(200).json({ ok: true });
  } catch {
    res.status(502).json({ ok: false });
  }
}
