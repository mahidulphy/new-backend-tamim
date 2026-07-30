import React from 'react';
import { Check, Sparkles, Crown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PricingSection: React.FC = () => {
  const { navigateTo, isAdminAuthenticated } = useApp();

  const handleSelect = () => {
    navigateTo(isAdminAuthenticated ? '/admin/memories/create' : '/admin/login');
  };

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900/30 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            One-time payment per memory gift. Lifetime QR access. Zero subscription fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Basic */}
          <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Basic Memory</h3>
              <p className="text-xs text-neutral-400 mb-6">Perfect for simple birthday & greeting gifts.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$19</span>
                <span className="text-xs text-neutral-400">/ one-time</span>
              </div>
              <ul className="space-y-3 text-xs text-neutral-300 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Standard Templates</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Up to 15 Photos</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 1 Voice Message</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> PNG Vector QR Code</li>
              </ul>
            </div>
            <button onClick={handleSelect} className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors">
              Get Started
            </button>
          </div>

          {/* Premium (Highlighted) */}
          <div className="p-8 rounded-3xl bg-neutral-900 border-2 border-rose-500 relative flex flex-col justify-between shadow-2xl shadow-rose-950/40">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Crown className="w-3 h-3" /> Most Popular
            </span>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Premium Experience</h3>
              <p className="text-xs text-rose-300 mb-6">Designed for proposals, weddings & golden milestones.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$49</span>
                <span className="text-xs text-neutral-400">/ one-time</span>
              </div>
              <ul className="space-y-3 text-xs text-neutral-200 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-400" /> Access ALL Premium Templates</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-400" /> Unlimited High-Res Photos</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-400" /> HD Videos & Voice Messages</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-400" /> Interactive Timeline Milestones</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-400" /> Background Music Audio Engine</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-400" /> High-Res PNG & SVG Vector QR</li>
              </ul>
            </div>
            <button onClick={handleSelect} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Sparkles className="w-4 h-4" /> Create Premium Memory
            </button>
          </div>

          {/* Enterprise */}
          <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Boutique & Corporate</h3>
              <p className="text-xs text-neutral-400 mb-6">For event planners & luxury gift stores.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$149</span>
                <span className="text-xs text-neutral-400">/ 10 QR credits</span>
              </div>
              <ul className="space-y-3 text-xs text-neutral-300 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom Brand Watermark</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Dedicated Account Concierge</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Batch QR Print Export</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Priority Server Bandwidth</li>
              </ul>
            </div>
            <button onClick={handleSelect} className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
