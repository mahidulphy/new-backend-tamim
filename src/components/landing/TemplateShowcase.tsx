import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Sparkles, Crown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TemplateShowcase: React.FC = () => {
  const { templates, navigateTo, memories } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'PROPOSAL', 'ANNIVERSARY', 'ROMANTIC', 'BIRTHDAY', 'VINTAGE'];

  const filteredTemplates = selectedCategory === 'ALL'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handlePreview = (templateSlug: string) => {
    const demoMem = memories.find(m => m.templateId === templateSlug || m.slug.includes(templateSlug));
    if (demoMem) {
      window.open(`/#/memory/${demoMem.slug}`, '_blank');
    } else {
      window.open(`/#/memory/rose-garden-proposal`, '_blank');
    }
  };

  return (
    <section id="templates" className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Storytelling Engines
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            World-Class Memory Templates
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            Handcrafted with luxury animations, typography pairings, and responsive cinematic media players.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-neutral-900 border border-neutral-800/80 rounded-3xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col group shadow-xl"
            >
              {/* Thumbnail Container */}
              <div className="relative h-60 overflow-hidden bg-neutral-950">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
                
                {template.isPremium && (
                  <span className="absolute top-4 left-4 bg-amber-500/90 text-black font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Crown className="w-3 h-3" /> Premium
                  </span>
                )}

                <span className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-neutral-300 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full">
                  {template.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-6 line-clamp-3">
                    {template.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-800/80">
                  <button
                    onClick={() => handlePreview(template.slug)}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </button>
                  <button
                    onClick={() => navigateTo('/admin/memories/create')}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/40"
                  >
                    <Sparkles className="w-4 h-4" /> Use Template
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
