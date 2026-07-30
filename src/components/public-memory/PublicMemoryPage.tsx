import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api';
import { Memory } from '../../types';
import { TemplateRenderer } from './TemplateRenderer';
import { Sparkles, HeartHandshake, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface PublicMemoryPageProps {
  slug: string;
}

export const PublicMemoryPage: React.FC<PublicMemoryPageProps> = ({ slug }) => {
  const { getMemoryBySlug, navigateTo } = useApp();
  const [loading, setLoading] = useState(true);
  const [memory, setMemory] = useState<Memory | null>(null);
  const hasCounted = useRef(false);

  useEffect(() => {
    setLoading(true);
    hasCounted.current = false;
    let cancelled = false;

    const countView = async (mem: Memory) => {
      if (hasCounted.current) return;
      hasCounted.current = true;
      try { await api.memories.incrementView(mem.id); } catch {}
    };

    const load = async () => {
      const cached = getMemoryBySlug(slug);
      if (cached) {
        setMemory(cached);
        countView(cached);
        setTimeout(() => { if (!cancelled) setLoading(false); }, 700);
        return;
      }

      try {
        const m = await api.memories.getBySlug(slug);
        if (cancelled) return;
        setMemory(m);
        countView(m);
      } catch {
        if (!cancelled) setMemory(null);
      }

      setTimeout(() => { if (!cancelled) setLoading(false); }, 700);
    };

    load();

    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center p-6 text-white">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 mb-6 shadow-2xl shadow-rose-900/50"
        >
          <div className="w-full h-full bg-neutral-950 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-rose-400" />
          </div>
        </motion.div>
        <p className="text-sm font-serif italic text-neutral-300 animate-pulse">Unwrapping your digital memory gift...</p>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center p-6 text-white">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Memory Gift Not Found</h2>
        <p className="text-sm text-neutral-400 max-w-md mb-6">
          The memory gift link you accessed may have expired or is no longer published.
        </p>
        <button
          onClick={() => navigateTo('/')}
          className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go To Homepage
        </button>
      </div>
    );
  }

  return <TemplateRenderer memory={memory} />;
};
