import React, { useState, useMemo } from 'react';
import { X, Image, Film, Mic, Search, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { MediaItem } from '../../types';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
  mediaType?: 'IMAGE' | 'VIDEO' | 'VOICE_NOTE';
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({ isOpen, onClose, onSelect, mediaType }) => {
  const { media } = useApp();
  const [filter, setFilter] = useState<'IMAGE' | 'VIDEO' | 'VOICE_NOTE'>(mediaType || 'IMAGE');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = useMemo(() => media.filter(m => {
    if (mediaType && m.type !== mediaType) return false;
    if (m.type !== filter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [media, mediaType, filter, search]);

  const tabs: { key: typeof filter; label: string; icon: React.ReactNode }[] = [
    { key: 'IMAGE', label: 'Images', icon: <Image className="w-4 h-4" /> },
    { key: 'VIDEO', label: 'Videos', icon: <Film className="w-4 h-4" /> },
    { key: 'VOICE_NOTE', label: 'Audio', icon: <Mic className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="max-w-3xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white">Browse Media Library</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-800">
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Search + Tabs */}
        <div className="p-4 border-b border-neutral-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search media by name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  filter === tab.key ? 'bg-rose-600 text-white' : 'bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {filtered.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-10">No media found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filtered.map(item => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="group relative bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden hover:border-rose-500/50 transition-all text-left"
                >
                  {/* Preview */}
                  <div className="w-full h-24 bg-neutral-900 flex items-center justify-center overflow-hidden">
                    {item.type === 'IMAGE' ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : item.type === 'VIDEO' ? (
                      <div className="flex flex-col items-center gap-1 text-amber-400">
                        <Film className="w-6 h-6" />
                        <span className="text-[8px] font-mono opacity-60">Video</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-emerald-400">
                        <Mic className="w-6 h-6" />
                        <span className="text-[8px] font-mono opacity-60">Audio</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-[10px] font-semibold text-white truncate">{item.name}</p>
                    <p className="text-[9px] text-neutral-500 font-mono">{item.size}</p>
                  </div>

                  {/* Select overlay */}
                  <div className="absolute inset-0 bg-rose-600/0 group-hover:bg-rose-600/10 flex items-center justify-center transition-all">
                    <CheckCircle2 className="w-6 h-6 text-rose-400 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
