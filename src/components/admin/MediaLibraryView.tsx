import React, { useState, useMemo, useRef } from 'react';
import { Image, Film, Mic, Copy, Trash2, Search, ExternalLink, RotateCw, X, Play, Pause } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MediaUploader } from './MediaUploader';
import type { MediaItem } from '../../types';

export const MediaLibraryView: React.FC = () => {
  const { media, deleteMediaItem, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'IMAGE' | 'VIDEO' | 'VOICE_NOTE'>('IMAGE');
  const [search, setSearch] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const [replaceTarget, setReplaceTarget] = useState<MediaItem | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const filtered = useMemo(() => media.filter(m => {
    if (m.type !== activeTab) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [media, activeTab, search]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast('URL Copied', 'Media URL copied to clipboard.', 'success');
  };

  const handleReplaceClick = (item: MediaItem) => {
    setReplaceTarget(item);
    setReplaceFile(null);
  };

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setReplaceFile(e.target.files[0]);
  };

  const handleReplaceConfirm = async () => {
    if (!replaceTarget || !replaceFile) return;
    try {
      const form = new FormData();
      form.append('file', replaceFile);
      const res = await fetch(`/api/upload/replace/${replaceTarget.id}`, {
        method: 'POST', credentials: 'include', body: form,
      });
      if (!res.ok) throw new Error('Replace failed');
      addToast('File Replaced', 'Media asset has been replaced.', 'success');
      setReplaceTarget(null);
      setReplaceFile(null);
    } catch {
      addToast('Error', 'Failed to replace file.', 'error');
    }
  };

  const mediaIcons: Record<string, React.ReactNode> = {
    IMAGE: <Image className="w-4 h-4" />,
    VIDEO: <Film className="w-4 h-4" />,
    VOICE_NOTE: <Mic className="w-4 h-4" />,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Media Library</h1>
          <p className="text-xs text-neutral-400">Upload, manage, and reuse images, videos, and voice notes.</p>
        </div>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
        >
          {showUploader ? 'Close Uploader' : 'Upload Media'}
        </button>
      </div>

      {/* Uploader */}
      {showUploader && (
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800">
          <MediaUploader
            onUploadComplete={() => { window.location.reload(); }}
            mediaType={activeTab}
          />
        </div>
      )}

      {/* Tabs + Search */}
      <div className="flex flex-wrap items-center gap-3 border-b border-neutral-800 pb-4">
        {(['IMAGE', 'VIDEO', 'VOICE_NOTE'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold ${
              activeTab === tab ? 'bg-rose-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            {mediaIcons[tab]} {tab === 'VOICE_NOTE' ? 'Audio' : tab === 'IMAGE' ? 'Images' : 'Videos'}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search files..."
            className="pl-9 pr-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs w-48"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group">
            {/* Preview */}
            <div
              className="relative w-full h-40 bg-neutral-950 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => setPreviewItem(item)}
            >
              {item.type === 'IMAGE' ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              ) : item.type === 'VIDEO' ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video src={item.url} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white opacity-80" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-emerald-400">
                  <Mic className="w-10 h-10" />
                  <span className="text-[10px] font-mono text-neutral-500">Click to play</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate max-w-[160px]">{item.name}</span>
                <span className="text-[10px] text-neutral-500 font-mono">{item.size}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                <button onClick={() => handleCopy(item.url)} className="flex-1 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> Copy URL
                </button>
                <button onClick={() => handleReplaceClick(item)} className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200">
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { window.open(item.url, '_blank'); }} className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteMediaItem(item.id)} className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Replace Modal */}
      {replaceTarget && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setReplaceTarget(null)}>
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Replace File</h3>
              <button onClick={() => setReplaceTarget(null)}><X className="w-4 h-4 text-neutral-400" /></button>
            </div>
            <p className="text-xs text-neutral-400">Replacing: <strong className="text-white">{replaceTarget.name}</strong></p>
            <input type="file" onChange={handleReplaceFile} className="block w-full text-xs text-neutral-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-rose-600 file:text-white file:text-xs hover:file:bg-rose-500" />
            {replaceFile && (
              <p className="text-xs text-emerald-400">Selected: {replaceFile.name} ({(replaceFile.size / 1024 / 1024).toFixed(2)} MB)</p>
            )}
            <button
              onClick={handleReplaceConfirm}
              disabled={!replaceFile}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-semibold"
            >
              Replace File
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => { setPreviewItem(null); setPreviewPlaying(false); }}>
          <div className="max-w-3xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Close */}
            <div className="flex justify-end mb-2">
              <button onClick={() => { setPreviewItem(null); setPreviewPlaying(false); }} className="p-2 rounded-full bg-black/50 hover:bg-black/70">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex-1 flex flex-col items-center">
              {previewItem.type === 'IMAGE' && (
                <img src={previewItem.url} alt={previewItem.name} className="max-w-full max-h-[70vh] object-contain rounded-2xl" />
              )}
              {previewItem.type === 'VIDEO' && (
                <video src={previewItem.url} controls className="max-w-full max-h-[70vh] rounded-2xl" autoPlay />
              )}
              {previewItem.type === 'VOICE_NOTE' && (
                <div className="w-full max-w-md py-10 flex flex-col items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <button
                      onClick={() => {
                        if (previewPlaying) { audioRef.current?.pause(); setPreviewPlaying(false); }
                        else { audioRef.current?.play(); setPreviewPlaying(true); }
                      }}
                      className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center"
                    >
                      {previewPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                  </div>
                  <audio ref={audioRef} src={previewItem.url} onEnded={() => setPreviewPlaying(false)} />
                  <p className="text-sm font-bold text-white">{previewItem.name}</p>
                  <p className="text-[10px] text-neutral-500 font-mono">{previewItem.size}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-xs text-neutral-500 text-center py-10">
          No {activeTab === 'IMAGE' ? 'images' : activeTab === 'VIDEO' ? 'videos' : 'audio files'} found.
          {!showUploader && ' Click "Upload Media" to add files.'}
        </p>
      )}
    </div>
  );
};
