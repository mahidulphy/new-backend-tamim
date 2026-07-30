import React from 'react';
import { Image, Film, Mic, Music, Calendar, QrCode, Smartphone, Zap } from 'lucide-react';

const features = [
  { icon: Image, title: 'Unlimited High-Res Photos', desc: 'Upload crisp photos with full-screen lightbox viewing and custom romantic captions.' },
  { icon: Film, title: 'Cinematic HD Videos', desc: 'Embed high-definition videos with poster thumbnails and responsive media players.' },
  { icon: Mic, title: 'Spoken Voice Messages', desc: 'Record or upload intimate voice messages with custom audio waveform seek bars.' },
  { icon: Music, title: 'Background Audio Engine', desc: 'Choose from romantic piano, acoustic guitar, or string quartet background music.' },
  { icon: Calendar, title: 'Interactive Love Timeline', desc: 'Chronicle your journey together with animated milestone dates and descriptions.' },
  { icon: QrCode, title: 'Vector Print-Ready QRs', desc: 'Download high-resolution PNG & SVG vector QR codes ready for gift box printing.' },
  { icon: Smartphone, title: 'No App Required', desc: 'Recipients simply scan with their phone camera. No app installs, logins, or ads.' },
  { icon: Zap, title: 'Instant Load Speeds', desc: 'Powered by Cloudflare CDN with lazy loading for instant opening anywhere in the world.' }
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900/30 border-y border-neutral-800/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Everything You Need To Create Magic
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            Rich media storytelling capabilities designed to evoke genuine tears of joy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
