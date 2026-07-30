import React, { useState } from 'react';
import { Palette, Copy, Power } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TemplateManagementView: React.FC = () => {
  const { templates, updateTemplateStatus, duplicateTemplate } = useApp();
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories = ['ALL', 'PROPOSAL', 'ANNIVERSARY', 'ROMANTIC', 'BIRTHDAY', 'VINTAGE'];

  const filtered = categoryFilter === 'ALL'
    ? templates
    : templates.filter(t => t.category === categoryFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Template Management</h1>
          <p className="text-xs text-neutral-400">Configure, duplicate, and toggle storytelling engines.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              categoryFilter === c ? 'bg-rose-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(t => (
          <div key={t.id} className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col justify-between p-5">
            <div>
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover" />
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                  t.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-neutral-950 text-neutral-400'
                }`}>
                  {t.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{t.name}</h3>
              <p className="text-xs text-neutral-400 line-clamp-2 mb-4">{t.description}</p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-neutral-800">
              <button
                onClick={() => updateTemplateStatus(t.id, t.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1"
              >
                <Power className="w-3.5 h-3.5" /> {t.status === 'ACTIVE' ? 'Disable' : 'Enable'}
              </button>
              <button
                onClick={() => duplicateTemplate(t.id)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                title="Duplicate Template"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
