import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 animate-in slide-in-from-right ${
            toast.type === 'success' ? 'bg-emerald-900/80 border-emerald-700/50 text-emerald-100' :
            toast.type === 'error' ? 'bg-rose-900/80 border-rose-700/50 text-rose-100' :
            toast.type === 'warning' ? 'bg-amber-900/80 border-amber-700/50 text-amber-100' :
            'bg-neutral-900/80 border-neutral-700/50 text-neutral-100'
          }`}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">{toast.title}</p>
            {toast.description && <p className="text-xs opacity-80 mt-0.5">{toast.description}</p>}
          </div>
          <button onClick={() => removeToast(toast.id)} className="p-0.5 hover:opacity-70 shrink-0 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
