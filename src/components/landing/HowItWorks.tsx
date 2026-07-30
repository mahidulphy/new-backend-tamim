import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, FileText, QrCode, Gift, Smartphone } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Choose a Memory Template',
    description: 'Select from our luxury storytelling designs crafted for proposals, anniversaries, birthdays, and scrapbooks.',
    icon: Sparkles
  },
  {
    step: '02',
    title: 'Create The Memory',
    description: 'Add your personal love letter, photos, timeline milestones, voice notes, and background music.',
    icon: FileText
  },
  {
    step: '03',
    title: 'Generate Print QR Code',
    description: 'Instantly download vector PNG/SVG QR codes ready to print on luxury cardstock or gift box stickers.',
    icon: QrCode
  },
  {
    step: '04',
    title: 'Attach QR to Physical Gift',
    description: 'Place the QR code on your wrapped gift box, greeting card, flower bouquet, or custom keepsake.',
    icon: Gift
  },
  {
    step: '05',
    title: 'Recipient Scans QR Code',
    description: 'Your loved one scans the QR with their smartphone camera—no app download or registration required.',
    icon: Smartphone
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900/40 border-y border-neutral-800/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            How Memory Gift Works
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            5 simple steps to turn a simple physical present into an unforgettable emotional experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative flex flex-col justify-between hover:border-neutral-700 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
                      STEP {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-300 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
