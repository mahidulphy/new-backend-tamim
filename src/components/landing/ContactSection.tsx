import React, { useState } from 'react';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Github,
  Facebook,
  Instagram,
  Linkedin,
  Globe,
  BriefcaseBusiness,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactSection: React.FC = () => {
  const { addToast } = useApp();

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      addToast(
        'Missing Fields',
        'Please fill in all form fields.',
        'warning'
      );
      return;
    }

    setSending(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send');
      }

      setSubmitted(true);

      addToast(
        'Message Sent',
        'Thank you for reaching out!',
        'success'
      );
    } catch (e: any) {
      addToast(
        'Error',
        e.message || 'Failed to send message.',
        'error'
      );
    }

    setSending(false);
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900/40 border-t border-neutral-800"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            We'd Love To Hear From You
          </h2>

          <p className="text-base text-neutral-400 mb-8 leading-relaxed">
            Have questions about custom printing, enterprise credits, or
            template customization? Our concierge team responds within 2 hours.
          </p>

          {/* CONTACT INFORMATION */}
          <div className="space-y-4 text-sm text-neutral-300">

            {/* EMAIL */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <Mail className="w-5 h-5 text-rose-400 shrink-0" />

              <a
                href="mailto:mahidul.phy@yahoo.com"
                className="hover:text-white transition-colors"
              >
                mahidulphy@yahoo.com
              </a>
            </div>

            {/* PHONE */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <Phone className="w-5 h-5 text-amber-400 shrink-0" />

              <a
                href="tel:+8801810507404"
                className="hover:text-white transition-colors"
              >
                +880 1810-507404
              </a>
            </div>

            {/* LOCATION */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <MapPin className="w-5 h-5 text-rose-400 shrink-0" />

              <span>Dhaka, Bangladesh</span>
            </div>

          </div>

          {/* SOCIAL LINKS */}
          <div className="mt-8">

            <p className="text-xs font-semibold text-neutral-300 mb-3">
              Connect With Me
            </p>

            <div className="flex flex-wrap gap-3">

              {/* Portfolio */}
              <a
                href="https://mahidulphy.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mahidul Portfolio"
                title="Portfolio"
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-rose-500 hover:bg-neutral-800 transition-all"
              >
                <Globe className="w-4 h-4" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/mahidulphy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mahidul GitHub"
                title="GitHub"
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-rose-500 hover:bg-neutral-800 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/mahidulphy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mahidul LinkedIn"
                title="LinkedIn"
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-rose-500 hover:bg-neutral-800 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              {/* Fiverr */}
              <a
                href="https://www.fiverr.com/mahidulphy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mahidul Fiverr"
                title="Fiverr"
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-rose-500 hover:bg-neutral-800 transition-all"
              >
                <BriefcaseBusiness className="w-4 h-4" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/mahidulphy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mahidul Facebook"
                title="Facebook"
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-rose-500 hover:bg-neutral-800 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/mahidulphy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mahidul Instagram"
                title="Instagram"
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-rose-500 hover:bg-neutral-800 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>

            </div>
          </div>

        </div>

        {/* RIGHT SIDE - CONTACT FORM */}
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl">

          {submitted ? (

            <div className="text-center py-12">

              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />

              <h3 className="text-xl font-bold text-white mb-2">
                Message Received
              </h3>

              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Thank you! I will reply to {form.email} shortly.
              </p>

            </div>

          ) : (

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME */}
              <div>

                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Your Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
                />

              </div>

              {/* EMAIL */}
              <div>

                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Email Address
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
                />

              </div>

              {/* MESSAGE */}
              <div>

                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Message
                </label>

                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  placeholder="Tell me how I can help you..."
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500 resize-none"
                />

              </div>

              {/* SEND BUTTON */}
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />

                {sending ? 'Sending...' : 'Send Message'}
              </button>

            </form>

          )}

        </div>

      </div>
    </section>
  );
};
