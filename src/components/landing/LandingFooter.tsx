import React, { useState } from 'react';
import {
  Gift,
  Heart,
  Mail,
  CheckCircle2,
  Github,
  Linkedin,
  Globe,
} from 'lucide-react';
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

      addToast(
        'Subscribed',
        'Thank you for subscribing to our newsletter!',
        'success'
      );
    } catch {
      addToast('Error', 'Failed to subscribe.', 'error');
    }

    setNlSending(false);
  };

  const navLinks = [
    { label: 'Templates', id: 'templates' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 px-4 sm:px-6 lg:px-8 pt-14 pb-6">
      <div className="max-w-7xl mx-auto">

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5">
                <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                  <Gift className="w-4 h-4 text-rose-400" />
                </div>
              </div>

              <span className="text-lg font-bold text-white">
                MEMORY<span className="text-rose-500">GIFT</span>
              </span>
            </div>

            <p className="mt-4 text-xs leading-6 text-neutral-500 max-w-xs">
              Create beautiful digital memories that last forever.
              Personalize your story, share your moments, and make
              someone feel truly special.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-4">
              Explore
            </h3>

            <div className="flex flex-col items-start gap-3">
              {navLinks.map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() =>
                    document
                      .getElementById(id)
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="text-xs text-neutral-500 hover:text-white transition-colors"
                >
                  {label}
                </button>
              ))}

              <button
                onClick={() => navigateTo('/admin/login')}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
              >
                Admin Portal
              </button>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-4">
              Stay Connected
            </h3>

            <p className="text-xs text-neutral-500 mb-4">
              Get updates, new templates and special offers.
            </p>

            {nlSubmitted ? (
              <span className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Subscribed successfully
              </span>
            ) : (
              <form
                onSubmit={handleNewsletter}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />

                  <input
                    type="email"
                    value={nlEmail}
                    onChange={e => setNlEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={nlSending}
                  className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                >
                  {nlSending ? '...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 mt-12 pt-5">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Copyright / Mahidul Branding */}
            <p className="text-[11px] text-neutral-600 text-center md:text-left">
              © {new Date().getFullYear()} MemoryGift. All rights reserved.
              <span className="mx-2 text-neutral-800">•</span>
              Designed & Developed by{' '}
              <a
                href="https://mahidulphy.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-rose-400 font-semibold transition-colors"
              >
                Mahidul
              </a>
            </p>

            {/* Personal Links */}
            <div className="flex items-center gap-4">

              <a
                href="https://mahidulphy.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mahidul Portfolio"
                className="text-neutral-500 hover:text-white transition-colors"
                title="Portfolio"
              >
                <Globe className="w-4 h-4" />
              </a>

              <a
                href="https://github.com/mahidulphy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mahidul GitHub"
                className="text-neutral-500 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href="https://www.linkedin.com/in/mahidulphy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mahidul LinkedIn"
                className="text-neutral-500 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <span className="text-neutral-800">|</span>

              <span className="text-[11px] text-neutral-600 flex items-center gap-1">
                Made with
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                by Mahidul
              </span>

            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
