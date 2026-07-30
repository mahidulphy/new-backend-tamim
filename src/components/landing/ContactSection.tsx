import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactSection: React.FC = () => {
  const { addToast, settings } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      addToast('Missing Fields', 'Please fill in all form fields.', 'warning');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send');
      }
      setSubmitted(true);
      addToast('Message Sent', 'Thank you for reaching out to Memory Gift team.', 'success');
    } catch (e: any) {
      addToast('Error', e.message || 'Failed to send message.', 'error');
    }
    setSending(false);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900/40 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            We'd Love To Hear From You
          </h2>
          <p className="text-base text-neutral-400 mb-8 leading-relaxed">
            Have questions about custom printing, enterprise credits, or template customization? Our concierge team responds within 2 hours.
          </p>

          <div className="space-y-4 text-sm text-neutral-300">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <Mail className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{settings.supportEmail}</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <Phone className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{settings.phone || '+1 (800) 555-0199'}</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{settings.city ? `${settings.city}${settings.address ? ` • ${settings.address}` : ''}` : 'Seattle, WA • San Francisco, CA'}</span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Message Received</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Thank you! Our concierge team will reply to {form.email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Sophia Lin"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="sophia@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can assist your memory gift..."
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
