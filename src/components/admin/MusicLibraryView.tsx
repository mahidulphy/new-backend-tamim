import React, { useState, useRef } from 'react';
import { Music, Upload, Play, Pause, Pencil, Trash2, X, Loader2, Clock, Disc3, FileWarning } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const CATEGORY_SUGGESTIONS = ['Romantic', 'Acoustic', 'Classical', 'Party', 'Chill', 'General'];

export const MusicLibraryView: React.FC = () => {
  const { music, uploadMusic, updateMusic, deleteMusic, addToast } = useApp();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', artist: '', category: 'Romantic' });
  const [editForm, setEditForm] = useState({ title: '', artist: '', category: '' });

  const startUpload = async () => {
    if (!file) return;
    if (!form.title.trim() || !form.artist.trim()) {
      addToast('Missing Details', 'Please provide a title and artist.', 'error');
      return;
    }
    setUploading(true);
    await uploadMusic(file, { title: form.title.trim(), artist: form.artist.trim(), category: form.category });
    setUploading(false);
    setFile(null);
    setForm({ title: '', artist: '', category: 'Romantic' });
    setUploadOpen(false);
  };

  const togglePlay = (track: { id: string; musicUrl: string }) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    setPlayingId(track.id);
    setTimeout(() => {
      const el = audioRef.current;
      if (el) {
        el.src = track.musicUrl;
        el.play().catch(() => {
          addToast('Playback Failed', 'Could not play this track.', 'error');
          setPlayingId(null);
        });
      }
    }, 0);
  };

  const openEdit = (track: { id: string; title: string; artist: string; category: string }) => {
    setEditForm({ title: track.title, artist: track.artist, category: track.category });
    setEditId(track.id);
  };

  const saveEdit = async () => {
    if (!editId) return;
    if (!editForm.title.trim() || !editForm.artist.trim()) {
      addToast('Missing Details', 'Title and artist are required.', 'error');
      return;
    }
    await updateMusic(editId, { title: editForm.title.trim(), artist: editForm.artist.trim(), category: editForm.category });
    setEditId(null);
  };

  return (
    <div className="space-y-6">
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center">
              <Music className="w-4.5 h-4.5 text-white" />
            </span>
            Music Library
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Upload and manage background music for memory templates.</p>
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950/40"
        >
          <Upload className="w-4 h-4" /> Upload Music
        </button>
      </div>

      {/* Upload Panel */}
      {uploadOpen && (
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Upload Background Music</h3>
            <button onClick={() => setUploadOpen(false)} className="text-neutral-500 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Audio File (mp3, wav, ogg — up to 50 MB)</label>
              <label className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all block ${
                file ? 'border-rose-500 bg-rose-500/5' : 'border-neutral-700 bg-neutral-950 hover:border-neutral-600'
              }`}>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <p className="text-xs font-semibold text-rose-300">{file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                ) : (
                  <p className="text-xs text-neutral-400">Click to choose an audio file</p>
                )}
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Forever With You"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Artist</label>
              <input
                type="text"
                value={form.artist}
                onChange={(e) => setForm({ ...form, artist: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Category</label>
              <input
                type="text"
                list="music-categories"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500"
              />
              <datalist id="music-categories">
                {CATEGORY_SUGGESTIONS.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button onClick={() => setUploadOpen(false)} className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700">
              Cancel
            </button>
            <button
              onClick={startUpload}
              disabled={uploading || !file}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Upload Track'}
            </button>
          </div>
        </div>
      )}

      {/* Track List */}
      {music.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center">
          <Disc3 className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <p className="text-sm text-neutral-400">No music yet. Upload your first background track.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {music.map(track => (
            <div key={track.id} className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <button
                onClick={() => togglePlay(track)}
                className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0 hover:border-rose-500 transition-colors"
              >
                {playingId === track.id
                  ? <Pause className="w-4 h-4 text-rose-400" />
                  : <Play className="w-4 h-4 text-neutral-300 ml-0.5" />}
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{track.title}</p>
                <p className="text-xs text-neutral-400 truncate">{track.artist} • {track.category}</p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono shrink-0">
                <Clock className="w-3.5 h-3.5" /> {track.duration || '00:00'}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(track)}
                  className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { if (confirm(`Delete "${track.title}"?`)) deleteMusic(track.id); }}
                  className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 z-[9990] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileWarning className="w-4 h-4 text-amber-400" /> Edit Track
              </h3>
              <button onClick={() => setEditId(null)} className="text-neutral-500 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Artist</label>
                <input
                  type="text"
                  value={editForm.artist}
                  onChange={(e) => setEditForm({ ...editForm, artist: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Category</label>
                <input
                  type="text"
                  list="music-categories"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setEditId(null)} className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700">
                Cancel
              </button>
              <button onClick={saveEdit} className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white text-xs font-semibold">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
