import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How does the recipient scan the QR Code?',
    a: 'The recipient opens the standard camera app on their smartphone (iPhone or Android) and points it at the physical QR code on the gift box or card. The memory website opens instantly in their browser.'
  },
  {
    q: 'Does the QR Code or memory website expire?',
    a: 'No! All memory gifts created on Memory Gift remain active permanently. You pay a single one-time price with no recurring subscription fees.'
  },
  {
    q: 'Can I edit the memory after printing the QR Code?',
    a: 'Yes! You can edit photos, letter text, timeline events, and voice notes anytime from the Admin Panel. The printed QR code URL remains identical.'
  },
  {
    q: 'Can I upload high-definition videos and voice recordings?',
    a: 'Absolutely. We support HD MP4 videos and MP3 voice notes with built-in custom audio/video players.'
  },
  {
    q: 'What vector formats are generated for printing?',
    a: 'We provide ultra-high-resolution PNG and scalable SVG files optimized for commercial print shops, laser engraving, and custom sticker printing.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-neutral-400">
            Everything you need to know about creating digital memory gifts.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-6 text-left font-bold text-white flex items-center justify-between gap-4 text-base hover:bg-neutral-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform ${openIdx === idx ? 'rotate-180 text-rose-400' : ''}`} />
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
