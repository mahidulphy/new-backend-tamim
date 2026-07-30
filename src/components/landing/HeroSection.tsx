import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Heart, QrCode, ShieldCheck, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroSection: React.FC = () => {
  const { navigateTo, isAdminAuthenticated } = useApp();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-neutral-950 bg-grid-pattern">
      {/* Radial Gradient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm font-medium mb-8 shadow-inner"
        >
          <Sparkles className="w-4 h-4 text-rose-400" />
          The Ultimate Digital Gifting Platform
        </motion.div>

        {/* Emotional Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.08]"
        >
          Turn Memories Into A Gift <br />
          <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
            They'll Never Forget.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10"
        >
          Attach a luxury QR code to any physical gift. When your loved one scans it, a personalized interactive memory website opens with letters, photos, voice notes, and music.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-base shadow-xl shadow-rose-950/60 hover:shadow-rose-900/80 transition-all flex items-center gap-3 cursor-pointer group"
          >
            Explore Templates <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-semibold text-base border border-neutral-800 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-rose-400 fill-rose-400" /> How It Works
          </button>
        </motion.div>

        {/* Social Proof / Trust Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-10 border-t border-neutral-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-neutral-400 text-xs sm:text-sm font-medium"
        >
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" /> 10,000+ Memories Gifted
          </div>
          <div className="flex items-center justify-center gap-2">
            <QrCode className="w-4 h-4 text-amber-400" /> 100% Vector QR Printing
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Lifetime QR Access
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400" /> Cinematic Audio & Video
          </div>
        </motion.div>
      </div>
    </section>
  );
};
