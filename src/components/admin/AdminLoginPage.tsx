import React, { useState } from 'react';
import { Gift, Lock, Mail, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await loginAdmin(email, password);
    setLoading(false);
    if (success) {
      navigateTo('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-0.5 mx-auto mb-4 shadow-xl shadow-rose-950/60">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
              <Gift className="w-7 h-7 text-rose-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Admin Portal</h2>
          <p className="text-xs text-neutral-400 mt-1">Memory Gift Platform Control Center</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-neutral-500 hover:text-neutral-300 absolute right-3.5 top-1/2 -translate-y-1/2 p-1"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 cursor-pointer mt-6 transition-all"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Sign In To Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigateTo('/')}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            ← Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
