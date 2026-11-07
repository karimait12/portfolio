import { createClient } from '@supabase/supabase-js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).end();
      return;
    }

    const ua = String(req.headers['user-agent'] || '');
    if (/bot|crawler|spider|headless|lighthouse|preview/i.test(ua)) {
      res.status(204).end();
      return;
    }

    const body = req.body || {};
    const sessionId = String(body.sessionId || '');
    const visitorId = String(body.visitorId || '');
    const path = String(body.path || '/').slice(0, 200);
    const referrer = body.referrer ? String(body.referrer).slice(0, 500) : null;
    const device = body.device ? String(body.device).slice(0, 32) : null;
    const browser = body.browser ? String(body.browser).slice(0, 64) : null;
    const durationSeconds = clamp(Number(body.durationSeconds) || 0, 0, 14400);
    const isNewSession = Boolean(body.isNewSession);

    if (!UUID_RE.test(sessionId) || !UUID_RE.test(visitorId)) {
      res.status(400).end();
      return;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      res.status(204).end();
      return;
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const country = (req.headers['x-vercel-ip-country'] as string) || 'XX';
    let city: string | null = null;
    const rawCity = req.headers['x-vercel-ip-city'] as string | undefined;
    if (rawCity) {
      try {
        city = decodeURIComponent(rawCity);
      } catch {
        city = rawCity;
      }
    }

    if (isNewSession) {
      await supabase.from('visitor_sessions').insert({
        id: sessionId,
        visitor_id: visitorId,
        country,
        city,
        device,
        browser,
        referrer,
        landing_path: path,
        pages_viewed: 1,
        duration_seconds: durationSeconds,
      });
    } else {
      const { data } = await supabase
        .from('visitor_sessions')
        .select('duration_seconds, pages_viewed')
        .eq('id', sessionId)
        .maybeSingle();

      const nextDuration = Math.max(data?.duration_seconds ?? 0, durationSeconds);
      await supabase
        .from('visitor_sessions')
        .update({
          duration_seconds: nextDuration,
          pages_viewed: (data?.pages_viewed ?? 1) + 1,
          last_seen_at: new Date().toISOString(),
        })
        .eq('id', sessionId);
    }

    res.status(204).end();
  } catch {
    res.status(204).end();
  }
}
