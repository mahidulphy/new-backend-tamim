import React, { useEffect, useState } from 'react';
import { Mail, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminInboxView: React.FC = () => {
  const { contactMessages, fetchContactMessages, markMessageRead, deleteMessage } = useApp();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        await fetchContactMessages();
      } catch {}
      setLoading(false);
    };
    load();
  }, [fetchContactMessages]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteMessage(id);
    } catch {}
    setDeleting(null);
  };

  const unread = contactMessages.filter(m => !m.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Admin Inbox</h1>
          <p className="text-xs text-neutral-400">Contact form submissions from the landing page.</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
          {unread} unread
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        {contactMessages.length === 0 ? (
          <div className="p-12 text-center text-neutral-500" role="status">
            <Mail className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No messages yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-800/60" role="list">
            {contactMessages.map(msg => (
              <li
                key={msg.id}
                className={`p-5 ${!msg.isRead ? 'bg-neutral-800/20 border-l-2 border-rose-500' : 'hover:bg-neutral-800/10'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{msg.name}</span>
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Unread" />}
                    </div>
                    <p className="text-xs text-neutral-400 font-mono mb-2">{msg.email}</p>
                    <p className="text-sm text-neutral-300 whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-[10px] text-neutral-600 mt-2 font-mono">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!msg.isRead && (
                      <button
                        onClick={() => markMessageRead(msg.id)}
                        aria-label="Mark as read"
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={deleting === msg.id}
                      aria-label="Delete message"
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-red-900/50 text-neutral-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {deleting === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
