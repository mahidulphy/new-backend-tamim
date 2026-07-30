import React, { useState, useMemo } from 'react';
import { Plus, Eye, Edit3, Copy, QrCode, Archive, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QRShareModal } from '../shared/QRShareModal';
import { Memory } from '../../types';

export const AllMemoriesView: React.FC = () => {
  const { memories, deleteMemory, duplicateMemory, archiveMemory, navigateTo, searchQuery, setSearchQuery } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeQrMemory, setActiveQrMemory] = useState<Memory | null>(null);

  const filteredMemories = useMemo(() => memories.filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [memories, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">All Memory Gifts</h1>
          <p className="text-xs text-neutral-400">Manage, preview, edit, or generate QR codes for digital memory gifts.</p>
        </div>

        <button
          onClick={() => navigateTo('/admin/memories/create')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-950/40 flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Memory
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="flex items-center gap-2">
          {['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                statusFilter === st ? 'bg-rose-600 text-white' : 'bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-400 font-mono">
          Showing {filteredMemories.length} of {memories.length} memories
        </div>
      </div>

      {/* Memories Data Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 font-mono uppercase text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="p-4 pl-6">Recipient & Title</th>
                <th className="p-4">Sender</th>
                <th className="p-4">Status</th>
                <th className="p-4">Views</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredMemories.map(m => (
                <tr key={m.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img src={m.coverImage} alt={m.recipientName} className="w-10 h-10 rounded-xl object-cover border border-neutral-800 shrink-0" />
                      <div>
                        <p className="font-bold text-white text-sm">{m.recipientName}</p>
                        <p className="text-xs text-neutral-400 truncate max-w-[200px]">{m.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-200">{m.senderName}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                      m.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      m.status === 'ARCHIVED' ? 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono">{m.viewCount}</td>
                  <td className="p-4 text-neutral-400">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/#/memory/${m.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                        title="View Memory Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => navigateTo(`/admin/memories/edit/${m.id}`)}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                        title="Edit Memory"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => duplicateMemory(m.id)}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => archiveMemory(m.id)}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                        title="Archive"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveQrMemory(m)}
                        className="p-2 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white"
                        title="QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMemory(m.id)}
                        className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeQrMemory && (
        <QRShareModal
          qrValue={`/memory/${activeQrMemory.slug}`}
          recipientName={activeQrMemory.recipientName}
          memoryTitle={activeQrMemory.title}
          isOpen={!!activeQrMemory}
          onClose={() => setActiveQrMemory(null)}
        />
      )}
    </div>
  );
};
