import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { PartyPopper, Cake, Gift, Play, Pause, Quote, Sparkles, Music } from 'lucide-react';
import { Memory } from '../../../types';
import { GalleryLightbox } from '../../shared/GalleryLightbox';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-3xl md:text-5xl font-extrabold text-center mb-16 tracking-tight"
    style={{ fontFamily: "'Poppins', sans-serif" }}
  >
    <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">{children}</span>
  </motion.h2>
);

const FadeUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

const FloatingConfetti: React.FC = () => {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#ec4899', '#f43f5e', '#fbbf24', '#a855f7', '#06b6d4', '#f97316'][i % 6],
    size: 4 + Math.random() * 8,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, width: p.size, height: p.size * 0.6, backgroundColor: p.color, opacity: 0.4 }}
          animate={{ y: [0, -200], rotate: [0, 360], opacity: [0.4, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

export const ElegantBirthdayTemplate: React.FC<{ memory: Memory }> = ({ memory }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [vTime, setVTime] = useState<Record<string, number>>({});
  const [vDur, setVDur] = useState<Record<string, number>>({});

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -80]);

  useEffect(() => {
    return () => { Object.values(audioRefs.current).forEach(a => { a.pause(); a.src = ''; }); };
  }, []);

  const toggleVoice = (id: string, url: string) => {
    if (playingVoice === id) { audioRefs.current[id]?.pause(); setPlayingVoice(null); return; }
    Object.values(audioRefs.current).forEach(a => a.pause());
    if (!audioRefs.current[id]) {
      const a = new Audio(url);
      a.addEventListener('timeupdate', () => setVTime(p => ({ ...p, [id]: a.currentTime })));
      a.addEventListener('loadedmetadata', () => setVDur(p => ({ ...p, [id]: a.duration })));
      a.addEventListener('ended', () => setPlayingVoice(null));
      audioRefs.current[id] = a;
    }
    audioRefs.current[id].currentTime = 0;
    audioRefs.current[id].play();
    setPlayingVoice(id);
  };

  const fmt = (s: number) => { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec < 10 ? '0' : ''}${sec}`; };

  return (
    <div className="relative bg-gradient-to-b from-[#0f0a0e] via-[#1a0f14] to-[#0f0a0e] text-white overflow-hidden" style={{ fontFamily: "'Poppins', 'system-ui', sans-serif" }}>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {memory.coverImage ? (
            <>
              <img src={memory.coverImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a0e]/70 via-[#0f0a0e]/40 to-[#0f0a0e]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1f0a14] via-[#0f0a0e] to-black" />
          )}
        </motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.06),transparent_70%)]" />
        <FloatingConfetti />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-8"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 via-rose-400 to-amber-400 flex items-center justify-center shadow-2xl shadow-pink-500/40">
              <Cake className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-pink-300 mb-6 uppercase tracking-widest">
              Happy Birthday
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight"
          >
            <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">{memory.title}</span>
          </motion.h1>

          {memory.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-8 font-light"
            >
              {memory.subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-4"
          >
            <span className="text-pink-300/80 font-semibold">{memory.recipientName}</span>
            <PartyPopper className="w-4 h-4 text-amber-400" />
            <span className="text-white/40">from</span>
            <span className="text-white/80">{memory.senderName}</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center gap-2">
            <span className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Celebrate</span>
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-400 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Letter */}
      {(() => {
        const l = memory.letter;
        if (!l) return null;
        return (
          <section className="py-28 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.03),transparent_60%)]" />
            {/* Confetti particles */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-sm"
                  style={{
                    width: 3 + Math.random() * 5,
                    height: 2 + Math.random() * 3,
                    backgroundColor: ['#ec4899', '#f43f5e', '#fbbf24', '#a855f7', '#06b6d4', '#f97316'][i % 6],
                    left: `${5 + i * 8}%`,
                    top: `${10 + (i % 5) * 18}%`,
                    opacity: 0.15,
                  }}
                  animate={{ y: [0, -20, 0], rotate: [0, 30, -30, 0], opacity: [0.15, 0.5, 0.15] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                />
              ))}
            </div>
            <div className="max-w-2xl mx-auto">
              <SectionTitle>A Birthday Letter</SectionTitle>
              <motion.div
                initial={{ opacity: 0, y: 50, rotate: -1 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative p-8 sm:p-10 md:p-14 rounded-[2rem] overflow-hidden border shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(217,119,6,0.06) 100%)',
                    borderColor: 'rgba(236,72,153,0.2)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(236,72,153,0.08)',
                  }}
                >
                  {/* Paper texture */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")', backgroundSize: '160px 160px' }}
                  />

                  {/* Warm glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

                  {/* Gift ribbon seal */}
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 100 }}
                    className="relative w-16 h-16 mx-auto mb-8"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center shadow-xl shadow-pink-950/40 border-2 border-pink-300/30">
                      <Gift className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent" />
                  </motion.div>

                  <div className="flex items-center gap-3 justify-center mb-8">
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent via-pink-400/30 to-transparent" />
                    <Sparkles className="w-4 h-4 text-pink-400/40" />
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent via-pink-400/30 to-transparent" />
                  </div>

                  {l.title && (
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-2xl md:text-3xl font-bold text-center mb-8 text-white/90"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">{l.title}</span>
                    </motion.h3>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="relative mx-auto"
                    style={{
                      fontFamily: l.fontStyle === 'handwriting' ? "'Caveat', cursive" : "'Poppins', 'system-ui', sans-serif",
                      textAlign: l.textAlignment || 'center',
                      lineHeight: l.fontStyle === 'handwriting' ? '1.8' : '2',
                      fontSize: l.fontStyle === 'handwriting' ? '1.2rem' : '1rem',
                      color: 'rgba(255,255,255,0.7)',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      maxWidth: '55ch',
                      fontWeight: 300,
                    }}
                  >
                    {l.content}
                  </motion.div>

                  <div className="flex items-center gap-3 justify-center mt-10 mb-6">
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent via-pink-400/30 to-transparent" />
                    <Sparkles className="w-4 h-4 text-pink-400/40" />
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent via-pink-400/30 to-transparent" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm text-pink-300/50 italic">With love and cake,</p>
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.8, type: 'spring' }}
                      className="text-xl font-bold"
                      style={{ fontFamily: "'Caveat', cursive", background: 'linear-gradient(135deg, #f9a8d4, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                    >
                      {memory.senderName}
                    </motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </section>
        );
      })()}

      {/* Photos */}
      {memory.photos.length > 0 && (
        <section className="py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <SectionTitle>Party Moments</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memory.photos.map((photo, i) => (
                <FadeUp key={photo.id} delay={i * 0.05}>
                  <motion.button
                    whileHover={{ y: -8, rotate: i % 2 === 0 ? 2 : -2 }}
                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                    className="group relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl"
                  >
                    <div className="aspect-[3/4] p-2">
                      <div className="w-full h-full overflow-hidden rounded-xl bg-white/5">
                        <img src={photo.imageUrl} alt={photo.caption || ''} loading="lazy" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    {photo.caption && (
                      <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{photo.caption}</p>
                    )}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[10px] text-white/60">
                      #{i + 1}
                    </div>
                  </motion.button>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {memory.videos.length > 0 && (
        <section className="py-28 px-6 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto">
            <SectionTitle>Celebration Reels</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memory.videos.map((video, i) => (
                <FadeUp key={video.id} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -4, scale: 1.01 }} className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-xl">
                    <div className="relative aspect-video">
                      <video src={video.videoUrl} className="w-full h-full object-cover" muted loop controls playsInline preload="metadata"
                        onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                        onMouseLeave={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).load(); }}
                      />
                    </div>
                    {video.caption && (
                      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-pink-950/20 to-amber-950/20">
                        <p className="text-white/70 text-sm font-medium">{video.caption}</p>
                      </div>
                    )}
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Voice Notes */}
      {memory.voiceNotes.length > 0 && (
        <section className="py-28 px-6">
          <div className="max-w-2xl mx-auto">
            <SectionTitle>Birthday Wishes</SectionTitle>
            <div className="space-y-4">
              {memory.voiceNotes.map((note, i) => (
                <FadeUp key={note.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="group p-5 rounded-2xl bg-gradient-to-r from-pink-950/20 to-amber-950/10 border border-pink-500/20 hover:border-pink-500/40 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleVoice(note.id, note.audioUrl)}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-all"
                      >
                        {playingVoice === note.id ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-white/90 truncate">{note.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-pink-500 to-amber-400 rounded-full transition-all" style={{ width: `${vDur[note.id] ? ((vTime[note.id] || 0) / vDur[note.id]) * 100 : 0}%` }} />
                          </div>
                          <span className="text-xs text-white/40 font-mono">{note.duration}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {memory.timeline.length > 0 && (
        <section className="py-28 px-6 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <SectionTitle>Best Moments</SectionTitle>
            <div className="space-y-6">
              {memory.timeline.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative pl-16"
                >
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-pink-500/40 via-amber-400/20 to-transparent" />
                  <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-amber-400 border-2 border-[#0f0a0e] shadow-lg shadow-pink-500/30 flex items-center justify-center text-[10px] font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-pink-500/20 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-pink-400/80 uppercase tracking-wider">{event.eventDate}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                    {event.description && <p className="text-sm text-white/50 mt-2 leading-relaxed">{event.description}</p>}
                    {event.image && (
                      <img src={event.image} alt="" className="mt-3 rounded-xl w-full h-36 object-cover" loading="lazy" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quotes */}
      {memory.quotes && memory.quotes.length > 0 && (
        <section className="py-28 px-6">
          <div className="max-w-4xl mx-auto">
            <SectionTitle>Birthday Wisdom</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memory.quotes.map((quote, i) => (
                <FadeUp key={quote.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4, rotate: 0.5 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-pink-950/20 to-amber-950/10 border border-pink-500/20 text-center"
                  >
                    <Quote className="w-6 h-6 text-pink-400/40 mx-auto mb-3" />
                    <p className="text-lg text-white/70 font-light italic leading-relaxed">"{quote.quote}"</p>
                    {quote.author && <p className="text-sm text-amber-300/50 mt-3 font-semibold">— {quote.author}</p>}
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Wishes */}
      {memory.wishes && memory.wishes.length > 0 && (
        <section className="py-28 px-6 bg-white/[0.02]">
          <div className="max-w-5xl mx-auto">
            <SectionTitle>Birthday Wishes</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memory.wishes.map((wish, i) => (
                <FadeUp key={wish.id} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-pink-950/20 to-amber-950/10 border border-white/10 text-center group"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-pink-500/30 to-amber-400/30 border border-pink-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Gift className="w-5 h-5 text-amber-300" />
                    </div>
                    <p className="text-sm font-bold text-white/80">{wish.personName}</p>
                    <p className="text-xs text-white/40 mt-2 leading-relaxed">{wish.message}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <section className="py-28 px-6 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.04),transparent_60%)]" />
        <FloatingConfetti />
        <FadeUp>
          <div className="max-w-xl mx-auto relative">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-pink-500 to-amber-400 flex items-center justify-center shadow-2xl shadow-pink-500/40"
            >
              <PartyPopper className="w-9 h-9 text-white" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">Share the Joy</span>
            </h2>
            <p className="text-white/40 mb-10">Spread the birthday celebration</p>
            <button
              onClick={() => { if (navigator.share) navigator.share({ title: memory.title, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 text-white text-sm font-bold hover:shadow-xl hover:shadow-pink-500/30 transition-all active:scale-95"
            >
              Share Memory
            </button>
            <p className="text-xs text-white/20 mt-8 uppercase tracking-[0.2em]">Another trip around the sun</p>
          </div>
        </FadeUp>
      </section>

      <GalleryLightbox photos={memory.photos} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </div>
  );
};
