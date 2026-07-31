import React, { useEffect, useState, useRef, FormEvent } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api';
import { Memory } from '../../types';
import { TemplateRenderer } from './TemplateRenderer';
import { Sparkles, HeartHandshake, ArrowLeft, Lock, KeyRound, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface PublicMemoryPageProps {
  slug: string;
}

export const PublicMemoryPage: React.FC<PublicMemoryPageProps> = ({ slug }) => {
  const { getMemoryBySlug, navigateTo } = useApp();
  const [loading, setLoading] = useState(true);
  const [memory, setMemory] = useState<Memory | null>(null);
  const [password, setPassword] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState('');
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
        if (!m.requiresPassword) countView(m);
      } catch {
        if (!cancelled) setMemory(null);
      }

      setTimeout(() => { if (!cancelled) setLoading(false); }, 700);
    };

    load();

    return () => { cancelled = true; };
  }, [slug]);

  const handleUnlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setPasswordError('Please enter the password.');
      return;
    }
    setVerifying(true);
    setPasswordError('');
    try {
      const unlocked = await api.memories.verifyAccess(slug, password.trim());
      setMemory(unlocked);
      hasCounted.current = false;
      await api.memories.incrementView(unlocked.id).catch(() => {});
    } catch (err: any) {
      setPasswordError(err.message || 'Incorrect password. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

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

  if (memory.requiresPassword) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-950/40">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">This Memory is Locked</h2>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto mb-8">
            {memory.recipientName ? `A special gift for ${memory.recipientName}. ` : ''}
            Enter the password to unwrap it.
          </p>

          <form onSubmit={handleUnlock} className="space-y-3">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
                placeholder="Enter password"
                autoFocus
                className="w-full px-11 py-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            {passwordError && (
              <p className="text-xs text-rose-400 text-left px-1">{passwordError}</p>
            )}
            <button
              type="submit"
              disabled={verifying}
              className="w-full px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 text-neutral-950 text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              {verifying ? 'Unlocking...' : 'Unlock Memory'}
            </button>
          </form>

          <button
            onClick={() => navigateTo('/')}
            className="mt-8 text-xs text-neutral-500 hover:text-neutral-300 transition-colors flex items-center gap-1.5 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back To Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  return <TemplateRenderer memory={memory} />;
};
