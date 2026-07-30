import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Moon, Star, Play, Pause, Quote, Sparkles } from 'lucide-react';
import { Memory } from '../../../types';
import { GalleryLightbox } from '../../shared/GalleryLightbox';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-3xl md:text-5xl font-bold text-center mb-16"
    style={{ fontFamily: "'Inter', sans-serif" }}
  >
    <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-sky-300 bg-clip-text text-transparent">{children}</span>
  </motion.h2>
);

const FadeUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

const Stars: React.FC = () => {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

export const GalaxyLoveTemplate: React.FC<{ memory: Memory }> = ({ memory }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.15]);

  useEffect(() => {
    return () => { Object.values(audioRefs.current).forEach(a => { a.pause(); a.src = ''; }); };
  }, []);

  const toggleVoice = (id: string, url: string) => {
    if (playingVoice === id) { audioRefs.current[id]?.pause(); setPlayingVoice(null); return; }
    Object.values(audioRefs.current).forEach(a => a.pause());
    if (!audioRefs.current[id]) {
      const a = new Audio(url);
      a.addEventListener('ended', () => setPlayingVoice(null));
      audioRefs.current[id] = a;
    }
    audioRefs.current[id].currentTime = 0;
    audioRefs.current[id].play();
    setPlayingVoice(id);
  };

  return (
    <div className="relative bg-[#05030a] text-white overflow-hidden" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          {memory.coverImage ? (
            <>
              <img src={memory.coverImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#05030a]/80 via-[#05030a]/50 to-[#05030a]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0620] via-[#05030a] to-black" />
          )}
        </motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08),transparent_70%)]" />
        <Stars />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-10 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-400/30 flex items-center justify-center backdrop-blur-sm"
          >
            <Moon className="w-9 h-9 text-purple-300" />
          </motion.div>
          <p className="text-sm tracking-[0.3em] uppercase text-purple-300/60 mb-6 font-medium">A Cosmic Love Story</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-sky-300 bg-clip-text text-transparent">{memory.title}</span>
          </h1>
          {memory.subtitle && (
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-8 font-light leading-relaxed">{memory.subtitle}</p>
          )}
          <div className="flex items-center justify-center gap-4 text-sm text-white/30">
            <span>{memory.recipientName}</span>
            <Star className="w-3 h-3 text-purple-400/60" fill="#a855f7" />
            <span>{memory.senderName}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/20 uppercase tracking-widest">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Letter */}
      {(() => {
        const l = memory.letter;
        if (!l) return null;
        return (
          <section className="py-28 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.03),transparent_60%)]" />
            {/* Floating cosmic particles */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 1 + Math.random() * 2,
                    height: 1 + Math.random() * 2,
                    backgroundColor: `rgba(${i % 3 === 0 ? '168,85,247' : i % 3 === 1 ? '129,140,248' : '125,211,252'},${0.2 + Math.random() * 0.3})`,
                    left: `${5 + i * 9}%`,
                    top: `${15 + (i % 4) * 20}%`,
                  }}
                  animate={{ y: [0, -25, 0], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 4 + i * 0.8, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
                />
              ))}
            </div>
            <div className="max-w-2xl mx-auto relative">
              <SectionTitle>Across the Universe</SectionTitle>
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <motion.div
                  whileHover={{ boxShadow: '0 0 80px rgba(168,85,247,0.15)' }}
                  className="relative p-8 sm:p-10 md:p-14 rounded-3xl overflow-hidden border shadow-2xl"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(24px)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Glass texture overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'80\' height=\'80\' filter=\'url(%23noise)\' opacity=\'0.3\'/%3E%3C/svg%3E")', backgroundSize: '120px 120px' }}
                  />

                  {/* Neon glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

                  {/* Cosmic wax seal */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 120 }}
                    className="relative w-16 h-16 mx-auto mb-8"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center shadow-2xl shadow-purple-950/50 border border-purple-400/30"
                      style={{ boxShadow: '0 0 30px rgba(168,85,247,0.2), inset 0 0 20px rgba(168,85,247,0.1)' }}
                    >
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
                  </motion.div>

                  <div className="flex items-center gap-3 justify-center mb-8">
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400/40 shadow-lg shadow-purple-400/20" />
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent via-purple-400/30 to-transparent" />
                  </div>

                  {l.title && (
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-2xl md:text-3xl font-bold text-center mb-8 text-white/90 tracking-wide"
                    >
                      <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-sky-300 bg-clip-text text-transparent">{l.title}</span>
                    </motion.h3>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="relative mx-auto"
                    style={{
                      fontFamily: l.fontStyle === 'handwriting' ? "'Caveat', cursive" : l.fontStyle === 'serif' ? "'Playfair Display', Georgia, serif" : "'Inter', 'system-ui', sans-serif",
                      textAlign: l.textAlignment || 'center',
                      lineHeight: l.fontStyle === 'handwriting' ? '1.8' : '1.9',
                      fontSize: l.fontStyle === 'handwriting' ? '1.2rem' : '1rem',
                      color: 'rgba(255,255,255,0.6)',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      maxWidth: '58ch',
                      fontWeight: 300,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {l.content}
                  </motion.div>

                  <div className="flex items-center gap-3 justify-center mt-10 mb-6">
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400/40 shadow-lg shadow-purple-400/20" />
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent via-purple-400/30 to-transparent" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-right"
                  >
                    <p className="text-sm text-purple-300/40 font-light">Across the universe,</p>
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.8, type: 'spring' }}
                      className="text-xl font-bold mt-1"
                      style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.8), rgba(129,140,248,0.8))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
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
            <SectionTitle>Constellations</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {memory.photos.map((photo, i) => (
                <FadeUp key={photo.id} delay={i * 0.03}>
                  <motion.button
                    whileHover={{ y: -8, scale: 1.02, rotate: i % 2 === 0 ? 1 : -1 }}
                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                    className={`group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 ${i === 0 || i === 3 ? 'col-span-2 row-span-2' : ''}`}
                  >
                    <div className="aspect-square">
                      <img src={photo.imageUrl} alt={photo.caption || ''} loading="lazy" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {photo.caption && (
                      <p className="absolute bottom-2 left-2 right-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity truncate">{photo.caption}</p>
                    )}
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
            <SectionTitle>Stellar Moments</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memory.videos.map((video, i) => (
                <FadeUp key={video.id} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -4 }} className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
                    <div className="relative aspect-video">
                      <video src={video.videoUrl} className="w-full h-full object-cover" muted loop controls playsInline preload="metadata"
                        onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                        onMouseLeave={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).load(); }}
                      />
                    </div>
                    {video.caption && (
                      <div className="p-4 border-t border-white/10">
                        <p className="text-white/70 text-sm">{video.caption}</p>
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
            <SectionTitle>Whispers from the Stars</SectionTitle>
            <div className="space-y-4">
              {memory.voiceNotes.map((note, i) => (
                <FadeUp key={note.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="group p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleVoice(note.id, note.audioUrl)}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-950/40 hover:shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all"
                      >
                        {playingVoice === note.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/90 truncate">{note.title}</p>
                        <div className="flex gap-1 mt-2">
                          {Array.from({ length: 20 }).map((_, j) => (
                            <motion.div
                              key={j}
                              className="w-1 rounded-full bg-purple-400/30"
                              style={{ height: 12 + Math.random() * 20 }}
                              animate={playingVoice === note.id ? { height: [8, 24, 8] } : { height: 8 }}
                              transition={{ duration: 0.5 + Math.random(), repeat: Infinity, delay: j * 0.05 }}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-white/30 font-mono">{note.duration}</span>
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
            <SectionTitle>Galactic Timeline</SectionTitle>
            <div className="space-y-6">
              {memory.timeline.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative pl-12 before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-purple-500/40 before:to-transparent"
                >
                  <div className="absolute left-3 top-2 w-3 h-3 rounded-full bg-purple-500 border-2 border-[#05030a] shadow-lg shadow-purple-500/40" />
                  <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/20 transition-all">
                    <span className="text-xs text-purple-400/60 font-mono">{event.eventDate}</span>
                    <h3 className="text-lg font-bold text-white/90 mt-1">{event.title}</h3>
                    {event.description && <p className="text-sm text-white/50 mt-2 leading-relaxed">{event.description}</p>}
                    {event.image && (
                      <img src={event.image} alt="" className="mt-3 rounded-xl w-full h-32 object-cover" loading="lazy" />
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
            <SectionTitle>Cosmic Wisdom</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memory.quotes.map((quote, i) => (
                <FadeUp key={quote.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 text-center"
                  >
                    <Quote className="w-6 h-6 text-purple-400/40 mx-auto mb-3" />
                    <p className="text-lg text-white/70 font-light italic leading-relaxed">"{quote.quote}"</p>
                    {quote.author && <p className="text-sm text-purple-300/50 mt-3">— {quote.author}</p>}
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
            <SectionTitle>Star Wishes</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memory.wishes.map((wish, i) => (
                <FadeUp key={wish.id} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ y: -4, rotate: 0.5 }}
                    className="p-5 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-center"
                  >
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-400/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-purple-300" />
                    </div>
                    <p className="text-sm font-semibold text-white/80">{wish.personName}</p>
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
        <Stars />
        <FadeUp>
          <div className="max-w-xl mx-auto relative">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/30"
            >
              <Star className="w-7 h-7 text-white" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-sky-300 bg-clip-text text-transparent">Share the Magic</span>
            </h2>
            <p className="text-white/40 mb-10">Spread this cosmic love story</p>
            <button
              onClick={() => { if (navigator.share) navigator.share({ title: memory.title, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all active:scale-95"
            >
              Share Memory
            </button>
            <p className="text-xs text-white/20 mt-8">Across the universe, forever</p>
          </div>
        </FadeUp>
      </section>

      <GalleryLightbox photos={memory.photos} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </div>
  );
};
