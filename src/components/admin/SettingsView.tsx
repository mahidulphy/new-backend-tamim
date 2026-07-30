import React, { useState } from 'react';
import { Save, ShieldAlert, Globe, Share2, MapPin, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [form, setForm] = useState({ ...settings });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Platform Settings</h1>
        <p className="text-xs text-neutral-400">Configure branding, SEO, social links, and contact information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-rose-400" /> Branding</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Site Name</label>
              <input type="text" value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Primary Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.primaryColor} onChange={e => setForm({ ...form, primaryColor: e.target.value })} className="w-10 h-10 rounded-lg bg-neutral-950 border border-neutral-800 cursor-pointer" />
                <span className="text-xs font-mono text-neutral-300">{form.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Secondary Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.secondaryColor} onChange={e => setForm({ ...form, secondaryColor: e.target.value })} className="w-10 h-10 rounded-lg bg-neutral-950 border border-neutral-800 cursor-pointer" />
                <span className="text-xs font-mono text-neutral-300">{form.secondaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Site Logo URL</label>
              <input type="text" value={form.siteLogo} onChange={e => setForm({ ...form, siteLogo: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Favicon URL</label>
              <input type="text" value={form.favicon} onChange={e => setForm({ ...form, favicon: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Search className="w-4 h-4 text-cyan-400" /> SEO</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Meta Title</label>
              <input type="text" value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Twitter Handle</label>
              <input type="text" value={form.twitterHandle} onChange={e => setForm({ ...form, twitterHandle: e.target.value })} placeholder="@memorygift" className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Meta Description</label>
              <textarea rows={2} value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1">OG Image URL</label>
              <input type="text" value={form.ogImage} onChange={e => setForm({ ...form, ogImage: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Share2 className="w-4 h-4 text-violet-400" /> Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Facebook</label>
              <input type="text" value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Instagram</label>
              <input type="text" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">YouTube</label>
              <input type="text" value={form.youtube} onChange={e => setForm({ ...form, youtube: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Twitter / X</label>
              <input type="text" value={form.twitter} onChange={e => setForm({ ...form, twitter: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">LinkedIn</label>
              <input type="text" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">TikTok</label>
              <input type="text" value={form.tiktok} onChange={e => setForm({ ...form, tiktok: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">WhatsApp</label>
              <input type="text" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" /> Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Support Email</label>
              <input type="email" value={form.supportEmail} onChange={e => setForm({ ...form, supportEmail: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Phone</label>
              <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Address</label>
              <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">City</label>
              <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm" />
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Maintenance Mode</span>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, maintenanceMode: !form.maintenanceMode })}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${
                form.maintenanceMode ? 'bg-rose-600 text-white' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {form.maintenanceMode ? 'ACTIVE (OFFLINE)' : 'DISABLED (ONLINE)'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save All Settings
        </button>
      </form>
    </div>
  );
};
