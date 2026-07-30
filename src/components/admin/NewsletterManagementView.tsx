import React, { useEffect, useState } from 'react';
import { Mail, Trash2, Users, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NewsletterManagementView: React.FC = () => {
  const { newsletterSubscribers, fetchNewsletterSubscribers, deleteSubscriber } = useApp();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        await fetchNewsletterSubscribers();
      } catch {}
      setLoading(false);
    };
    load();
  }, [fetchNewsletterSubscribers]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteSubscriber(id);
    } catch {}
    setDeleting(null);
  };

  const active = newsletterSubscribers.filter(s => s.isActive).length;

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
          <h1 className="text-2xl font-extrabold text-white">Newsletter Subscribers</h1>
          <p className="text-xs text-neutral-400">Manage email newsletter subscriptions from the landing page.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            {active} active
          </div>
          <div className="px-3 py-1.5 rounded-full bg-neutral-800 text-neutral-400 text-xs font-bold">
            {newsletterSubscribers.length} total
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        {newsletterSubscribers.length === 0 ? (
          <div className="p-12 text-center text-neutral-500" role="status">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No subscribers yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950 text-neutral-400 font-mono uppercase text-[10px] border-b border-neutral-800">
                <tr>
                  <th scope="col" className="p-4 pl-6">Email</th>
                  <th scope="col" className="p-4">Status</th>
                  <th scope="col" className="p-4">Subscribed</th>
                  <th scope="col" className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {newsletterSubscribers.map(sub => (
                  <tr key={sub.id} className="hover:bg-neutral-800/30">
                    <td className="p-4 pl-6 font-mono text-white">{sub.email}</td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1 text-[10px] font-semibold ${sub.isActive ? 'text-emerald-400' : 'text-neutral-500'}`}>
                        {sub.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {sub.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        disabled={deleting === sub.id}
                        aria-label="Remove subscriber"
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-red-900/50 text-neutral-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        {deleting === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
