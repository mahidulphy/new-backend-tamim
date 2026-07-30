import React, { useState, useEffect, useMemo } from 'react';
import { Eye, QrCode, Sparkles, TrendingUp, Download, Monitor, Globe, Clock, BarChart3, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TimelinePoint { date: string; views: number; scans: number; }
interface DeviceStat { deviceType: string; count: number; }
interface BrowserStat { browser: string; count: number; }
interface ReferrerStat { referrer: string; count: number; }

interface AnalyticsData {
  totals: { totalMemories: number; totalMemoryViews: number; totalQRScans: number; totalQRDownloads: number; totalQRCodes: number };
  mostViewedMemories: { id: string; title: string; recipientName: string; viewCount: number; slug: string }[];
  mostDownloadedQRCodes: { id: string; downloadCount: number; memoryId: string }[];
  popularTemplates: { id: string; name: string; memoryCount: number }[];
  recentActivity: { id: string; adminName: string; adminAvatar: string; action: string; target: string; description: string; createdAt: string }[];
  scanTimeline: { createdAt: Date; _count: number }[];
}

export const AnalyticsView: React.FC = () => {
  const { memories, qrs, templates } = useApp();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [devices, setDevices] = useState<DeviceStat[]>([]);
  const [browsers, setBrowsers] = useState<BrowserStat[]>([]);
  const [referrers, setReferrers] = useState<ReferrerStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [summary, tl, dev, brw, ref, recent] = await Promise.all([
          fetch('/api/analytics/summary', { credentials: 'include' }).then(r => r.json()),
          fetch(`/api/analytics/timeline?period=${period}&days=30`, { credentials: 'include' }).then(r => r.json()),
          fetch('/api/analytics/devices', { credentials: 'include' }).then(r => r.json()),
          fetch('/api/analytics/browsers', { credentials: 'include' }).then(r => r.json()),
          fetch('/api/analytics/referrers', { credentials: 'include' }).then(r => r.json()),
          fetch('/api/analytics/recent?limit=30', { credentials: 'include' }).then(r => r.json()),
        ]);
        setData(summary);
        setTimeline(tl);
        setDevices(dev);
        setBrowsers(brw);
        setReferrers(ref);
        setRecentActivity(recent);
      } catch (e) {
        console.error('Failed to fetch analytics', e);
      }
      setLoading(false);
    };
    fetchAll();
  }, [period]);

  const maxChart = useMemo(() => Math.max(...timeline.map(t => Math.max(t.views, t.scans)), 1), [timeline]);
  const maxDevices = useMemo(() => Math.max(...devices.map(d => d.count), 1), [devices]);
  const maxBrowsers = useMemo(() => Math.max(...browsers.map(b => b.count), 1), [browsers]);
  const maxReferrers = useMemo(() => Math.max(...referrers.map(r => r.count), 1), [referrers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
      </div>
    );
  }

  const totals = data?.totals;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Platform Analytics</h1>
        <p className="text-xs text-neutral-400">Detailed performance metrics for QR scans, template popularity, and memory engagements.</p>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Eye className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Views</p>
          </div>
          <p className="text-2xl font-extrabold text-white">{totals?.totalMemoryViews || 0}</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <QrCode className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">QR Scans</p>
          </div>
          <p className="text-2xl font-extrabold text-white">{totals?.totalQRScans || 0}</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Download className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Downloads</p>
          </div>
          <p className="text-2xl font-extrabold text-white">{totals?.totalQRDownloads || 0}</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BarChart3 className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Memories</p>
          </div>
          <p className="text-2xl font-extrabold text-white">{totals?.totalMemories || 0}</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <QrCode className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">QR Codes</p>
          </div>
          <p className="text-2xl font-extrabold text-white">{totals?.totalQRCodes || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" /> Views & Scans
            </h3>
            <div className="flex gap-1 bg-neutral-950 rounded-lg p-0.5 border border-neutral-800">
              {(['day', 'week', 'month'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-md text-[10px] font-semibold uppercase transition-colors ${period === p ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-1 h-48">
            {timeline.map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5 justify-end">
                <div className="flex gap-0.5 w-full">
                  <div
                    className="flex-1 bg-amber-500 rounded-t"
                    style={{ height: `${Math.max((t.views / maxChart) * 140, 1)}px` }}
                    title={`${t.date}: ${t.views} views`}
                  />
                  <div
                    className="flex-1 bg-rose-500 rounded-t"
                    style={{ height: `${Math.max((t.scans / maxChart) * 140, 1)}px` }}
                    title={`${t.date}: ${t.scans} scans`}
                  />
                </div>
                <span className="text-[6px] text-neutral-500 leading-none">{period === 'month' ? t.date.slice(5) : t.date.slice(5)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px]">
            <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-sm bg-amber-500" /> Views</span>
            <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-sm bg-rose-500" /> Scans</span>
          </div>
        </div>

        {/* Device Type */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-cyan-400" /> Device Type
          </h3>
          <div className="space-y-3">
            {devices.map(d => (
              <div key={d.deviceType} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize text-white font-semibold">{d.deviceType}</span>
                  <span className="text-neutral-400 font-mono">{d.count}</span>
                </div>
                <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${(d.count / maxDevices) * 100}%` }} />
                </div>
              </div>
            ))}
            {devices.length === 0 && <p className="text-neutral-500 text-sm">No data yet.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Browser Stats */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-violet-400" /> Browser
          </h3>
          <div className="space-y-3">
            {browsers.map(b => (
              <div key={b.browser} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">{b.browser}</span>
                  <span className="text-neutral-400 font-mono">{b.count}</span>
                </div>
                <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full" style={{ width: `${(b.count / maxBrowsers) * 100}%` }} />
                </div>
              </div>
            ))}
            {browsers.length === 0 && <p className="text-neutral-500 text-sm">No data yet.</p>}
          </div>
        </div>

        {/* Referrer Stats */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" /> Referrer
          </h3>
          <div className="space-y-3">
            {referrers.map(r => (
              <div key={r.referrer} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-semibold truncate max-w-[160px]">{r.referrer}</span>
                  <span className="text-neutral-400 font-mono">{r.count}</span>
                </div>
                <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: `${(r.count / maxReferrers) * 100}%` }} />
                </div>
              </div>
            ))}
            {referrers.length === 0 && <p className="text-neutral-500 text-sm">No data yet.</p>}
          </div>
        </div>

        {/* Most Viewed Memories */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400" /> Most Viewed
          </h3>
          <div className="space-y-2">
            {(data?.mostViewedMemories || []).slice(0, 6).map((m, i) => (
              <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-neutral-800/50">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-mono text-neutral-500 w-3 shrink-0">#{i + 1}</span>
                  <p className="text-xs text-white truncate">{m.recipientName}</p>
                </div>
                <span className="text-xs font-bold text-amber-400 font-mono shrink-0">{m.viewCount}</span>
              </div>
            ))}
            {(!data?.mostViewedMemories || data.mostViewedMemories.length === 0) && <p className="text-neutral-500 text-sm">No data yet.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Popularity */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800">
          <h3 className="text-base font-bold text-white mb-4">Template Popularity</h3>
          <div className="space-y-4">
            {(data?.popularTemplates || templates.map(t => ({ id: t.id, name: t.name, memoryCount: memories.filter(m => m.templateId === t.id).length }))).map(tmpl => {
              const total = data?.popularTemplates ? data.popularTemplates.reduce((a, b) => a + b.memoryCount, 0) : memories.length;
              const pct = total > 0 ? Math.round((tmpl.memoryCount / total) * 100) : 0;
              return (
                <div key={tmpl.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{tmpl.name}</span>
                    <span className="text-neutral-400 font-mono">{tmpl.memoryCount} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div className="bg-gradient-to-r from-rose-600 to-amber-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-400" /> Recent Activity
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentActivity.length === 0 && <p className="text-neutral-500 text-sm">No activity yet.</p>}
            {recentActivity.slice(0, 20).map((act, i) => (
              <div key={`${act.type}-${i}`} className="flex items-start gap-3 p-2.5 rounded-xl bg-neutral-800/50">
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  act.type === 'admin' ? 'bg-rose-500/10 text-rose-400' :
                  act.type === 'view' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {act.type === 'admin' ? <Activity className="w-3 h-3" /> :
                   act.type === 'view' ? <Eye className="w-3 h-3" /> :
                   <QrCode className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">{act.description}</p>
                  <p className="text-[9px] text-neutral-500 mt-0.5">
                    {act.adminName || act.browser || ''}
                    {act.deviceType ? ` · ${act.deviceType}` : ''}
                  </p>
                </div>
                <span className="text-[9px] text-neutral-600 shrink-0 font-mono">
                  {new Date(act.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
