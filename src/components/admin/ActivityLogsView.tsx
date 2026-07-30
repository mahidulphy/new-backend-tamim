import React from 'react';
import { ScrollText, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ActivityLogsView: React.FC = () => {
  const { logs } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">System Activity Logs</h1>
        <p className="text-xs text-neutral-400">Complete immutable audit trial of memory edits, QR generation, and admin actions.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 font-mono uppercase text-[10px] border-b border-neutral-800">
              <tr>
                <th className="p-4 pl-6">Action Type</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Description</th>
                <th className="p-4">Admin User</th>
                <th className="p-4 pr-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-neutral-800/30">
                  <td className="p-4 pl-6">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {l.action}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white">{l.target}</td>
                  <td className="p-4 text-neutral-300">{l.description}</td>
                  <td className="p-4 text-neutral-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-500" /> {l.adminName}
                  </td>
                  <td className="p-4 pr-6 text-right font-mono text-neutral-500">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
