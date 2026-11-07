import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { BarChart3, Users, Clock, Activity } from 'lucide-react';

type Range = 'today' | '7d' | '30d';

type Session = {
  id: string;
  visitor_id: string;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  referrer: string | null;
  landing_path: string | null;
  pages_viewed: number;
  duration_seconds: number;
  started_at: string;
  last_seen_at: string;
};

function flagEmoji(code: string | null) {
  if (!code || code === 'XX') return '🌐';
  const cc = code.toUpperCase();
  if (cc.length !== 2) return '🌐';
  const codePoints = [...cc].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...codePoints);
}

function countryName(code: string | null) {
  if (!code || code === 'XX') return 'Unknown';
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' });
    return dn.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatMmSs(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function AnalyticsManager() {
  const [range, setRange] = useState<Range>('7d');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 20;

  const fetchSessions = async (r: Range) => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const from = new Date(now);
      if (r === 'today') {
        from.setHours(0, 0, 0, 0);
      } else if (r === '7d') {
        from.setDate(now.getDate() - 6);
        from.setHours(0, 0, 0, 0);
      } else {
        from.setDate(now.getDate() - 29);
        from.setHours(0, 0, 0, 0);
      }

      const { data, error } = await supabase
        .from('visitor_sessions')
        .select('*')
        .gte('started_at', from.toISOString())
        .order('started_at', { ascending: false })
        .limit(5000);

      if (error) throw error;
      setSessions((data as Session[]) || []);
      setPage(1);
    } catch (e: any) {
      setError(e?.message || 'Failed to load analytics');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(range);
  }, [range]);

  const now = Date.now();
  const liveCount = sessions.filter((s) => {
    const t = new Date(s.last_seen_at).getTime();
    return now - t < 2 * 60 * 1000;
  }).length;

  const totalVisits = sessions.length;
  const uniqueVisitors = new Set(sessions.map((s) => s.visitor_id)).size;
  const avgTime = totalVisits
    ? sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / totalVisits
    : 0;

  // visits per day
  const dayMap: Record<string, number> = {};
  sessions.forEach((s) => {
    const d = new Date(s.started_at).toISOString().slice(0, 10);
    dayMap[d] = (dayMap[d] || 0) + 1;
  });
  const days = Object.keys(dayMap).sort();
  const maxDay = Math.max(1, ...Object.values(dayMap));

  // countries
  const countryMap: Record<string, { visits: number; duration: number }> = {};
  sessions.forEach((s) => {
    const c = s.country || 'XX';
    if (!countryMap[c]) countryMap[c] = { visits: 0, duration: 0 };
    countryMap[c].visits += 1;
    countryMap[c].duration += s.duration_seconds || 0;
  });
  const countries = Object.entries(countryMap)
    .map(([code, v]) => ({
      code,
      visits: v.visits,
      avg: v.visits ? v.duration / v.visits : 0,
      share: totalVisits ? (v.visits / totalVisits) * 100 : 0,
    }))
    .sort((a, b) => b.visits - a.visits);

  // pagination
  const totalPages = Math.max(1, Math.ceil(sessions.length / perPage));
  const paged = sessions.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 p-3 flex items-center gap-2">
          <span className="text-red-400 text-sm font-mono">{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-accent">Analytics</h2>
        <div className="flex gap-2">
          {(['today', '7d', '30d'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 font-mono text-sm border transition-all ${
                range === r ? 'text-accent border-accent' : 'text-gray-400 border-accent-dim hover:text-accent'
              }`}
            >
              {r === 'today' ? 'Today' : r === '7d' ? '7 days' : '30 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total visits', value: totalVisits, icon: <BarChart3 size={18} /> },
          { label: 'Unique visitors', value: uniqueVisitors, icon: <Users size={18} /> },
          { label: 'Avg time', value: formatMmSs(avgTime), icon: <Clock size={18} /> },
          { label: 'Live now', value: liveCount, icon: <Activity size={18} /> },
        ].map((c) => (
          <div key={c.label} className="tech-border bg-background/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 font-mono text-xs mb-2">
              {c.icon}
              <span>{c.label}</span>
            </div>
            <div className="text-2xl font-bold text-accent">
              {loading ? (
                <div className="h-7 w-16 bg-accent-dim animate-pulse rounded" />
              ) : (
                c.value
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="tech-border bg-background/50 p-4">
        <h3 className="text-accent font-mono mb-4">Visits per day</h3>
        {loading ? (
          <div className="h-40 bg-accent-dim animate-pulse rounded" />
        ) : days.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-gray-400 font-mono">No visits yet</div>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {days.map((d) => (
              <div key={d} className="flex-1 flex flex-col items-center justify-end gap-1">
                <div
                  className="w-full bg-accent/70 hover:bg-accent transition-colors"
                  style={{ height: `${(dayMap[d] / maxDay) * 100}%`, minHeight: '4px' }}
                  title={`${d}: ${dayMap[d]}`}
                />
                <span className="text-[9px] font-mono text-gray-500 rotate-[-45deg] origin-top-left whitespace-nowrap">
                  {d.slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Countries table */}
      <div className="tech-border bg-background/50 p-4">
        <h3 className="text-accent font-mono mb-4">Countries</h3>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-accent-dim animate-pulse rounded" />
            ))}
          </div>
        ) : countries.length === 0 ? (
          <div className="text-gray-400 font-mono">No visits yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-gray-400 border-b border-accent-dim">
                  <th className="text-left py-2">Country</th>
                  <th className="text-right py-2">Visits</th>
                  <th className="text-right py-2">Share</th>
                  <th className="text-right py-2">Avg time</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((c) => (
                  <tr key={c.code} className="border-b border-accent-dim/50">
                    <td className="py-2">
                      {flagEmoji(c.code)} {countryName(c.code)}
                    </td>
                    <td className="text-right py-2">{c.visits}</td>
                    <td className="text-right py-2">{c.share.toFixed(1)}%</td>
                    <td className="text-right py-2">{formatDuration(Math.round(c.avg))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent sessions */}
      <div className="tech-border bg-background/50 p-4">
        <h3 className="text-accent font-mono mb-4">Recent sessions</h3>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-accent-dim animate-pulse rounded" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-gray-400 font-mono">No visits yet</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="text-gray-400 border-b border-accent-dim">
                    <th className="text-left py-2">Time</th>
                    <th className="text-left py-2">Country</th>
                    <th className="text-left py-2">Device</th>
                    <th className="text-right py-2">Duration</th>
                    <th className="text-left py-2">Referrer</th>
                    <th className="text-left py-2">Landing</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((s) => (
                    <tr key={s.id} className="border-b border-accent-dim/50">
                      <td className="py-2 whitespace-nowrap">
                        {new Date(s.started_at).toLocaleString()}
                      </td>
                      <td className="py-2 whitespace-nowrap">
                        {flagEmoji(s.country)} {s.city || ''}
                      </td>
                      <td className="py-2">{s.device || '-'}</td>
                      <td className="text-right py-2">{formatDuration(s.duration_seconds || 0)}</td>
                      <td className="py-2 max-w-[160px] truncate">{s.referrer || '-'}</td>
                      <td className="py-2 max-w-[160px] truncate">{s.landing_path || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 font-mono text-sm border border-accent-dim text-gray-400 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-gray-400 font-mono text-sm">
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 font-mono text-sm border border-accent-dim text-gray-400 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
