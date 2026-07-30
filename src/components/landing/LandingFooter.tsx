import React, { useState } from 'react';
import { Gift, Heart, Mail, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingFooter: React.FC = () => {
  const { navigateTo, addToast } = useApp();
  const [nlEmail, setNlEmail] = useState('');
  const [nlSubmitted, setNlSubmitted] = useState(false);
  const [nlSending, setNlSending] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail) return;
    setNlSending(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nlEmail }),
      });
      if (!res.ok) throw new Error('Failed');
      setNlSubmitted(true);
      addToast('Subscribed', 'Thank you for subscribing to our newsletter!', 'success');
    } catch {
      addToast('Error', 'Failed to subscribe.', 'error');
    }
    setNlSending(false);
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Gift className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <span className="text-base font-bold text-white">MEMORY<span className="text-rose-500">GIFT</span></span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
          {['templates', 'how-it-works', 'pricing', 'faq', 'contact'].map(id => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-white capitalize"
            >
              {id === 'how-it-works' ? 'How It Works' : id}
            </button>
          ))}
          <button onClick={() => navigateTo('/admin/login')} className="hover:text-white text-rose-400 font-semibold">
            Admin Portal
          </button>
        </div>

        <div className="flex items-center gap-2">
          {nlSubmitted ? (
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed
            </span>
          ) : (
            <form onSubmit={handleNewsletter} className="flex items-center gap-2">
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={nlEmail}
                  onChange={e => setNlEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-44 pl-8 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <button
                type="submit"
                disabled={nlSending}
                className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold"
              >
                {nlSending ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="text-xs text-neutral-500 flex items-center justify-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for unforgettable digital memories.
        </p>
      </div>
    </footer>
  );
};
