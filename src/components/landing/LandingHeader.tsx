import React, { useState } from 'react';
import { Gift, Menu, X, Sparkles, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingHeader: React.FC = () => {
  const { navigateTo, isAdminAuthenticated } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => navigateTo('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-950/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
              <Gift className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            MEMORY<span className="text-rose-500">GIFT</span>
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          {['templates', 'how-it-works', 'pricing', 'faq', 'contact'].map(id => (
            <button
              key={id}
              onClick={() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors capitalize"
            >
              {id === 'how-it-works' ? 'How It Works' : id}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigateTo(isAdminAuthenticated ? '/admin/dashboard' : '/admin/login')}
            className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all flex items-center gap-2"
          >
            {isAdminAuthenticated ? <UserCheck className="w-4 h-4 text-emerald-400" /> : null}
            {isAdminAuthenticated ? 'Admin Panel' : 'Admin Login'}
          </button>

          <button
            onClick={() => navigateTo(isAdminAuthenticated ? '/admin/memories/create' : '/admin/login')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-sm font-semibold shadow-lg shadow-rose-950/50 hover:shadow-rose-900/60 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Create Memory
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-neutral-400 hover:text-white p-2"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-neutral-800 p-6 space-y-4">
          {['templates', 'how-it-works', 'pricing', 'faq', 'contact'].map(id => (
            <button
              key={id}
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block text-sm font-medium text-neutral-300 hover:text-white capitalize"
            >
              {id === 'how-it-works' ? 'How It Works' : id}
            </button>
          ))}
          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <button
              onClick={() => { setMobileMenuOpen(false); navigateTo(isAdminAuthenticated ? '/admin/dashboard' : '/admin/login'); }}
              className="w-full py-2.5 rounded-xl bg-neutral-800 text-neutral-200 text-sm font-medium"
            >
              {isAdminAuthenticated ? 'Admin Panel' : 'Admin Login'}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigateTo(isAdminAuthenticated ? '/admin/memories/create' : '/admin/login'); }}
              className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold"
            >
              Create Memory Gift
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
