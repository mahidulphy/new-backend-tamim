import React, { useState, useMemo } from 'react';
import { QrCode, Download, Palette, BarChart3, Upload, Layers, Image, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QRShareModal } from '../shared/QRShareModal';
import type { QRCodeData } from '../../types';

export const QRCodeManagementView: React.FC = () => {
  const { qrs, memories, customizeQR, bulkGenerateQR, generateOrUpdateQR, addToast } = useApp();
  const [activeShare, setActiveShare] = useState<QRCodeData | null>(null);
  const [customizing, setCustomizing] = useState<string | null>(null);
  const [showBulk, setShowBulk] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [bulkSel, setBulkSel] = useState<string[]>([]);
  const [bulkColor, setBulkColor] = useState('#000000');
  const [bulkBg, setBulkBg] = useState('#FFFFFF');
  const [bulkStyle, setBulkStyle] = useState('standard');

  const memoryQRMap = useMemo(() => {
    const map: Record<string, QRCodeData> = {};
    qrs.forEach(q => { map[q.memoryId] = q; });
    return map;
  }, [qrs]);

  const unassignedMemories = useMemo(() => {
    return memories.filter(m => !memoryQRMap[m.id]);
  }, [memories, memoryQRMap]);

  const loadAnalytics = async (qr: QRCodeData) => {
    setShowAnalytics(qr.id);
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`/api/qr/${qr.id}/analytics?days=30`, { credentials: 'include' });
      const data = await res.json();
      setAnalyticsData(data);
    } catch {
      setAnalyticsData(null);
    }
    setLoadingAnalytics(false);
  };

  const handleBulkGenerate = async () => {
    if (bulkSel.length === 0) return;
    await bulkGenerateQR(bulkSel, { foregroundColor: bulkColor, backgroundColor: bulkBg, style: bulkStyle });
    setBulkSel([]);
    setShowBulk(false);
  };

  const handleCustomize = async (id: string, field: string, value: string) => {
    try {
      await customizeQR(id, { [field]: value });
    } catch {}
  };

  const cOptions = (qr: QRCodeData) => (
    <div className="flex items-center gap-2 flex-wrap">
      <input
        type="color"
        value={qr.foregroundColor || '#000000'}
        onChange={e => handleCustomize(qr.id, 'foregroundColor', e.target.value)}
        aria-label="QR dot color"
        className="w-7 h-7 rounded cursor-pointer border-0"
      />
      <input
        type="color"
        value={qr.backgroundColor || '#FFFFFF'}
        onChange={e => handleCustomize(qr.id, 'backgroundColor', e.target.value)}
        aria-label="QR background color"
        className="w-7 h-7 rounded cursor-pointer border-0"
      />
      <select
        value={qr.style || 'standard'}
        onChange={e => handleCustomize(qr.id, 'style', e.target.value)}
        aria-label="QR style"
        className="bg-neutral-800 text-white text-[10px] rounded px-1.5 py-1 border border-neutral-700"
      >
        <option value="standard">Square</option>
        <option value="rounded">Rounded</option>
        <option value="dots">Dots</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">QR Code Management</h1>
          <p className="text-xs text-neutral-400">High-resolution vector QR code generation, download, and scan analytics.</p>
        </div>
        <div className="flex gap-2">
          {unassignedMemories.length > 0 && (
            <button
              onClick={async () => {
                for (const m of unassignedMemories.slice(0, 10)) {
                  await generateOrUpdateQR(m.id, m.slug, m.title);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-lg shadow-rose-950/30"
            >
              <QrCode className="w-4 h-4" /> Generate Missing ({unassignedMemories.length})
            </button>
          )}
          <button
            onClick={() => setShowBulk(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-all"
          >
            <Layers className="w-4 h-4" /> Bulk
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 font-mono uppercase text-[10px] border-b border-neutral-800">
              <tr>
                <th className="p-4 pl-6">Memory Gift</th>
                <th className="p-4">QR Preview</th>
                <th className="p-4">Scans</th>
                <th className="p-4">Status</th>
                <th className="p-4">Branding</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {qrs.map(q => {
                const mem = memories.find(m => m.id === q.memoryId);
                return (
                  <tr key={q.id} className="hover:bg-neutral-800/30">
                    <td className="p-4 pl-6">
                      <p className="font-bold text-white">{mem?.recipientName || 'Unassigned'}</p>
                      <p className="text-[10px] text-neutral-400 truncate max-w-[160px]">{mem?.title}</p>
                    </td>
                    <td className="p-4">
                      {q.qrCodeImage ? (
                        <img src={q.qrCodeImage} alt="QR" className="w-10 h-10 rounded border border-neutral-700" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center text-neutral-500">
                          <QrCode className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-bold text-white">{q.scanCount}</span>
                      <button
                        onClick={() => loadAnalytics(q)}
                        aria-label="View scan analytics"
                        className="ml-2 text-neutral-500 hover:text-rose-400 align-middle"
                      >
                        <BarChart3 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        q.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-800 text-neutral-500'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {customizing === q.id ? cOptions(q) : (
                        <button
                          onClick={() => setCustomizing(q.id)}
                          aria-label="Customize QR"
                          className="flex items-center gap-1 text-neutral-400 hover:text-white text-[10px]"
                        >
                          <Palette className="w-3.5 h-3.5" />
                          {q.foregroundColor !== '#000000' || q.backgroundColor !== '#FFFFFF' || q.style !== 'standard' ? 'Custom' : 'Default'}
                        </button>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const url = `/api/qr/${q.id}/download?format=png&width=600`;
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `QR_${(mem?.recipientName || 'gift').replace(/[^a-zA-Z0-9]/g, '_')}.png`;
                            a.click();
                            addToast('Downloaded', 'PNG QR code saved.', 'success');
                          }}
                          aria-label="Download PNG"
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                          title="Download PNG"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const url = `/api/qr/${q.id}/download?format=svg&width=600`;
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `QR_${(mem?.recipientName || 'gift').replace(/[^a-zA-Z0-9]/g, '_')}.svg`;
                            a.click();
                            addToast('Downloaded', 'SVG QR code saved.', 'success');
                          }}
                          aria-label="Download SVG"
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                          title="Download SVG"
                        >
                          <Image className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveShare(q)}
                          aria-label="Open share modal"
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                        >
                          Share
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {qrs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500">
                    <QrCode className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No QR codes generated yet.</p>
                    <p className="text-[10px] mt-1">Click "Generate Missing" to create QR codes for all memories.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <p className="text-[10px] text-neutral-500 font-mono uppercase">Total QR Codes</p>
          <p className="text-2xl font-extrabold text-white">{qrs.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <p className="text-[10px] text-neutral-500 font-mono uppercase">Total Scans</p>
          <p className="text-2xl font-extrabold text-white">{qrs.reduce((a, b) => a + b.scanCount, 0)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <p className="text-[10px] text-neutral-500 font-mono uppercase">Total Downloads</p>
          <p className="text-2xl font-extrabold text-white">{qrs.reduce((a, b) => a + (b.downloadCount || 0), 0)}</p>
        </div>
      </div>

      {/* Bulk Generation Modal */}
      {showBulk && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowBulk(false)}
              aria-label="Close"
              className="absolute top-5 right-5 text-neutral-400 hover:text-white"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Bulk QR Generation</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-neutral-400 mb-2">Select memories ({bulkSel.length} selected)</p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {memories.map(m => (
                    <label key={m.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bulkSel.includes(m.id)}
                        onChange={() => setBulkSel(prev => prev.includes(m.id) ? prev.filter(i => i !== m.id) : [...prev, m.id])}
                        className="rounded border-neutral-700"
                      />
                      <span className="text-xs text-white">{m.recipientName} — {m.title}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">Dot Color</label>
                  <input type="color" value={bulkColor} onChange={e => setBulkColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">Background</label>
                  <input type="color" value={bulkBg} onChange={e => setBulkBg(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">QR Style</label>
                <select value={bulkStyle} onChange={e => setBulkStyle(e.target.value)} className="w-full bg-neutral-800 text-white text-xs rounded-xl px-3 py-2 border border-neutral-700">
                  <option value="standard">Standard (Square)</option>
                  <option value="rounded">Rounded Corners</option>
                  <option value="dots">Dot Pattern</option>
                </select>
              </div>
              <button
                onClick={handleBulkGenerate}
                disabled={bulkSel.length === 0}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-semibold text-sm transition-all"
              >
                Generate {bulkSel.length} QR Code{bulkSel.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => { setShowAnalytics(null); setAnalyticsData(null); }}
              aria-label="Close"
              className="absolute top-5 right-5 text-neutral-400 hover:text-white"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">QR Scan Analytics</h3>
            {loadingAnalytics ? (
              <p className="text-neutral-400 text-sm">Loading...</p>
            ) : analyticsData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-neutral-800">
                    <p className="text-[10px] text-neutral-500">Total Scans</p>
                    <p className="text-xl font-bold text-white">{analyticsData.totalScans}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-800">
                    <p className="text-[10px] text-neutral-500">Period</p>
                    <p className="text-sm font-bold text-white">Last 30 days</p>
                  </div>
                </div>
                {analyticsData.timeline && analyticsData.timeline.length > 0 && (
                  <div>
                    <p className="text-xs text-neutral-400 mb-2">Scan Timeline</p>
                    <div className="flex items-end gap-1 h-20">
                      {analyticsData.timeline.slice(-14).map((d: any, i: number) => {
                        const max = Math.max(...analyticsData.timeline.map((t: any) => t.count), 1);
                        const h = Math.max((d.count / max) * 60, 2);
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                            <div className="w-full bg-rose-500 rounded-t" style={{ height: `${h}px` }} title={`${d.date}: ${d.count} scans`} />
                            <span className="text-[6px] text-neutral-500">{d.date.slice(5)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {analyticsData.recentBrowsers && analyticsData.recentBrowsers.length > 0 && (
                  <div>
                    <p className="text-xs text-neutral-400 mb-1">Recent User Agents</p>
                    <div className="text-[10px] text-neutral-500 space-y-0.5 max-h-20 overflow-y-auto">
                      {analyticsData.recentBrowsers.slice(0, 5).map((ua: string, i: number) => (
                        <p key={i} className="truncate">{ua}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-neutral-400 text-sm">No analytics data available.</p>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {activeShare && (
        <QRShareModal
          qrValue={activeShare.qrValue}
          recipientName={memories.find(m => m.id === activeShare.memoryId)?.recipientName || 'Gift'}
          memoryTitle={memories.find(m => m.id === activeShare.memoryId)?.title || ''}
          isOpen={!!activeShare}
          onClose={() => setActiveShare(null)}
          foregroundColor={activeShare.foregroundColor}
          backgroundColor={activeShare.backgroundColor}
          logoUrl={activeShare.logoUrl || undefined}
          qrId={activeShare.id}
        />
      )}
    </div>
  );
};
