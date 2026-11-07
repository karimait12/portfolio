import { supabase } from './supabase/client';

let started = false;
let sessionId: string | null = null;
let visitorId: string | null = null;
let isFirstSend = true;
let visibleStart: number | null = null;
let visibleSeconds = 0;
let heartbeatTimer: number | null = null;
let currentPage = '';

function isLocalhost() {
  return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

function isNoTrack() {
  try {
    return localStorage.getItem('no-track') === '1';
  } catch {
    return false;
  }
}

function isAdminPath() {
  return location.pathname.startsWith('/admin');
}

function getIds() {
  try {
    if (!sessionStorage.getItem('analytics_session_id')) {
      sessionStorage.setItem('analytics_session_id', crypto.randomUUID());
    }
    if (!localStorage.getItem('analytics_visitor_id')) {
      localStorage.setItem('analytics_visitor_id', crypto.randomUUID());
    }
    sessionId = sessionStorage.getItem('analytics_session_id');
    visitorId = localStorage.getItem('analytics_visitor_id');
  } catch {
    sessionId = crypto.randomUUID();
    visitorId = crypto.randomUUID();
  }
}

function deviceType() {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function browserName() {
  const ua = navigator.userAgent;
  if (/Edg/i.test(ua)) return 'Edge';
  if (/Chrome/i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua)) return 'Safari';
  if (/Firefox/i.test(ua)) return 'Firefox';
  return 'Other';
}

function addVisibleTime() {
  if (visibleStart !== null) {
    visibleSeconds += (Date.now() - visibleStart) / 1000;
    visibleStart = Date.now();
  }
}

function payload(isNewSession: boolean) {
  return {
    sessionId,
    visitorId,
    path: currentPage || location.pathname,
    referrer: document.referrer || null,
    device: deviceType(),
    browser: browserName(),
    durationSeconds: Math.round(visibleSeconds),
    isNewSession,
  };
}

function send(isNewSession: boolean, final: boolean) {
  try {
    if (!sessionId || !visitorId) return;
    if (isLocalhost() || isAdminPath() || isNoTrack()) return;

    const data = payload(isNewSession);
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon('/api/track', blob);
      if (ok) return;
    }
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: final || true,
    }).catch(() => {});
  } catch {
    // never break the site
  }
}

export function trackPageView(path: string) {
  try {
    if (isLocalhost() || isAdminPath() || isNoTrack()) return;
    currentPage = path;
    if (visibleStart === null && document.visibilityState === 'visible') {
      visibleStart = Date.now();
    }
    send(false, false);
  } catch {
    // ignore
  }
}

export async function startAnalytics() {
  if (started) return;
  started = true;
  try {
    if (isLocalhost() || isAdminPath() || isNoTrack()) {
      const params = new URLSearchParams(location.search);
      if (params.get('no-track') === '1') {
        try {
          localStorage.setItem('no-track', '1');
        } catch {}
      }
      return;
    }

    const params = new URLSearchParams(location.search);
    if (params.get('no-track') === '1') {
      try {
        localStorage.setItem('no-track', '1');
      } catch {}
      return;
    }

    const { data } = await supabase.auth.getSession();
    if (data?.session?.user?.app_metadata?.role === 'admin') return;

    getIds();
    if (!sessionId || !visitorId) return;

    currentPage = location.pathname;

    if (document.visibilityState === 'visible') {
      visibleStart = Date.now();
    }

    document.addEventListener('visibilitychange', () => {
      try {
        if (document.visibilityState === 'hidden') {
          addVisibleTime();
          visibleStart = null;
          send(isFirstSend, true);
          isFirstSend = false;
        } else {
          visibleStart = Date.now();
        }
      } catch {}
    });

    window.addEventListener('pagehide', () => {
      try {
        addVisibleTime();
        send(isFirstSend, true);
        isFirstSend = false;
      } catch {}
    });

    heartbeatTimer = window.setInterval(() => {
      try {
        addVisibleTime();
        send(isFirstSend, false);
        isFirstSend = false;
      } catch {}
    }, 15000);

    // initial send
    send(true, false);
    isFirstSend = false;
  } catch {
    // never break the site
  }
}
