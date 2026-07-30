import React, { useMemo } from 'react';
import { 
  HeartHandshake, CheckCircle2, FileEdit, QrCode, Package, Palette, 
  Plus, Eye, ArrowUpRight, TrendingUp, Sparkles, Clock, Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const { memories, qrs, orders, templates, logs, navigateTo, loading } = useApp();

  const safeMemories = memories || [];
  const safeQrs = qrs || [];
  const safeOrders = orders || [];
  const safeTemplates = templates || [];
  const safeLogs = logs || [];

  const { publishedCount, draftCount, totalScans, stats } = useMemo(() => {
    const pc = safeMemories.filter(m => m.status === 'PUBLISHED').length;
    const dc = safeMemories.filter(m => m.status === 'DRAFT').length;
    const ts = safeQrs.reduce((acc, curr) => acc + curr.scanCount, 0);
    return {
      publishedCount: pc,
      draftCount: dc,
      totalScans: ts,
      stats: [
        { title: 'Total Memories', value: safeMemories.length, icon: HeartHandshake, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        { title: 'Published', value: pc, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { title: 'Drafts', value: dc, icon: FileEdit, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { title: 'Total QR Scans', value: ts, icon: QrCode, color: 'text-sky-400', bg: 'bg-sky-500/10' },
        { title: 'Total Orders', value: safeOrders.length, icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { title: 'Templates', value: safeTemplates.length, icon: Palette, color: 'text-rose-400', bg: 'bg-rose-500/10' },
      ],
    };
  }, [safeMemories, safeQrs, safeOrders, safeTemplates]);

  const topMemories = useMemo(() => [...safeMemories].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5), [safeMemories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Overview Dashboard</h1>
          <p className="text-xs text-neutral-400">Monitor memory gifts, QR code scans, and platform health.</p>
        </div>
        <button
          onClick={() => navigateTo('/admin/memories/create')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all"
        >
          <Plus className="w-4 h-4" /> New Memory Gift
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.title} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className={`p-2.5 rounded-xl ${s.bg} ${s.color} border border-current/10`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 font-medium">{s.title}</p>
                <p className="text-lg font-extrabold text-white">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-rose-400" /> Memory Views (Top 5)</h2>
          <div className="space-y-3">
            {topMemories.length === 0 && <p className="text-neutral-500 text-sm" role="status">No memories yet.</p>}
            {topMemories.map((m, idx) => {
              const maxViews = Math.max(...safeMemories.map(x => x.viewCount), 1);
              const pct = Math.max((m.viewCount / maxViews) * 100, 2);
              return (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-neutral-500 w-4 shrink-0">#{idx + 1}</span>
                    <span className="text-sm text-white truncate">{m.recipientName}</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400 font-mono ml-2">{m.viewCount}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2"><Clock className="w-4 h-4 text-rose-400" /> Recent Activity</h2>
            <button onClick={() => navigateTo('/admin/logs')} className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold">View All</button>
          </div>
          <div className="space-y-2">
            {safeLogs.slice(0, 4).length === 0 && <p className="text-neutral-500 text-sm" role="status">No activity yet.</p>}
            {safeLogs.slice(0, 4).map(log => (
              <div key={log.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-800/50 text-xs">
                <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
                  <Eye className="w-3 h-3" />
                </div>
                <p className="text-neutral-300 truncate flex-1">{log.description}</p>
                <span className="text-[9px] text-neutral-600 font-mono shrink-0">{new Date(log.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
