import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Play, Pause, ChevronLeft, ChevronRight, Volume2, Quote } from 'lucide-react';
import { Memory } from '../../../types';
import { GalleryLightbox } from '../../shared/GalleryLightbox';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-4xl md:text-5xl font-light text-[#f0e6d3] text-center mb-16 tracking-wide"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
    {children}
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

export const RoseGardenTemplate: React.FC<{ memory: Memory }> = ({ memory }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<string, number>>({});
  const [audioDuration, setAudioDuration] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  useEffect(() => {
    return () => { Object.values(audioRefs.current).forEach(a => { a.pause(); a.src = ''; }); };
  }, []);

  const toggleVoice = (id: string, url: string) => {
    if (playingAudio === id) {
      audioRefs.current[id]?.pause();
      setPlayingAudio(null);
    } else {
      Object.values(audioRefs.current).forEach(a => a.pause());
      if (!audioRefs.current[id]) {
        const audio = new Audio(url);
        audio.addEventListener('timeupdate', () => setAudioProgress(prev => ({ ...prev, [id]: audio.currentTime })));
        audio.addEventListener('loadedmetadata', () => setAudioDuration(prev => ({ ...prev, [id]: audio.duration })));
        audio.addEventListener('ended', () => setPlayingAudio(null));
        audioRefs.current[id] = audio;
      }
      audioRefs.current[id].currentTime = 0;
      audioRefs.current[id].play();
      setPlayingAudio(id);
    }
  };

  const fmt = (s: number) => { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec < 10 ? '0' : ''}${sec}`; };

  return (
    <div ref={containerRef} className="relative bg-[#1a1410] text-[#f0e6d3] overflow-hidden" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0">
          {memory.coverImage ? (
            <>
              <img src={memory.coverImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410]/60 via-[#1a1410]/40 to-[#1a1410]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2d1f1a] via-[#1a1410] to-[#0f0a07]" />
          )}
        </motion.div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(244,63,94,0.3), transparent)',
                left: `${15 + i * 14}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
            className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-rose-400/20 to-pink-600/20 border border-rose-500/30 flex items-center justify-center backdrop-blur-sm"
          >
            <Heart className="w-7 h-7 text-rose-400" fill="#fb7185" />
          </motion.div>
          <p className="text-sm tracking-[0.3em] uppercase text-rose-300/80 mb-6 font-light">A Love Story</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            {memory.title}
          </h1>
          {memory.subtitle && (
            <p className="text-lg md:text-xl text-[#f0e6d3]/70 max-w-2xl mx-auto mb-8 font-light leading-relaxed">{memory.subtitle}</p>
          )}
          <div className="flex items-center justify-center gap-4 text-sm text-[#f0e6d3]/50">
            <span>{memory.recipientName}</span>
            <span className="w-1 h-1 rounded-full bg-rose-400/50" />
            <span>{memory.senderName}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <motion.div className="w-1 h-2 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* Info */}
      <section className="py-24 px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <div className="inline-block px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
              <p className="text-sm text-white/60">To My Dearest</p>
              <p className="text-2xl font-bold text-white mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>{memory.recipientName}</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-lg text-[#f0e6d3]/60 leading-relaxed max-w-xl mx-auto">With all my love, from <span className="text-rose-300">{memory.senderName}</span></p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-rose-400/50 to-transparent mx-auto mt-10" />
          </FadeUp>
        </div>
      </section>

      {/* Letter */}
      {(() => {
        const l = memory.letter;
        if (!l) return null;
        return (
          <section className="py-24 px-6 relative overflow-hidden">
            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: 'rgba(244,63,94,0.15)', left: `${10 + i * 11}%`, top: `${20 + (i % 3) * 25}%` }}
                  animate={{ y: [0, -20, 0], opacity: [0, 0.6, 0] }}
                  transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
                />
              ))}
            </div>
            <div className="max-w-2xl mx-auto">
              <SectionTitle>My Letter to You</SectionTitle>
              <motion.div
                initial={{ opacity: 0, y: 60, scaleY: 0.95, rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, scaleY: 1, rotateX: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ perspective: '1000px' }}
              >
                <motion.div
                  whileHover={{ y: -3 }}
                  className="relative p-8 sm:p-10 md:p-14 rounded-[2rem] shadow-2xl border overflow-hidden"
                  style={{
                    backgroundColor: '#2a1d18',
                    borderColor: 'rgba(244,63,94,0.15)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(244,63,94,0.08)',
                  }}
                >
                  {/* Paper texture overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }}
                  />

                  {/* Warm glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-rose-500/5 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

                  {/* Wax seal */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 120 }}
                    className="relative w-16 h-16 mx-auto mb-8"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-500 to-pink-700 flex items-center justify-center shadow-xl shadow-rose-950/50 border-2 border-rose-400/30">
                      <Heart className="w-6 h-6 text-white" fill="white" />
                    </div>
                    {/* Seal ribbon lines */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-rose-400/40 to-transparent" />
                  </motion.div>

                  {/* Decorative top border */}
                  <div className="flex items-center gap-3 justify-center mb-8">
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-rose-400/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400/40" />
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-rose-400/30" />
                  </div>

                  {l.title && (
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-2xl md:text-3xl font-bold text-center mb-8 text-white/95 tracking-wide"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {l.title}
                    </motion.h3>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="relative"
                    style={{
                      fontFamily: l.fontStyle === 'handwriting' ? "'Caveat', cursive" : l.fontStyle === 'sans' ? "'Inter', sans-serif" : "'Playfair Display', Georgia, serif",
                      textAlign: l.textAlignment || 'left',
                      lineHeight: l.fontStyle === 'handwriting' ? '1.8' : '2',
                      fontSize: l.fontStyle === 'handwriting' ? '1.25rem' : '1.05rem',
                      color: 'rgba(240,230,211,0.85)',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      maxWidth: '60ch',
                      margin: '0 auto',
                    }}
                  >
                    {l.content}
                  </motion.div>

                  {/* Decorative bottom border */}
                  <div className="flex items-center gap-3 justify-center mt-10 mb-6">
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-rose-400/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400/40" />
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-rose-400/30" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-right"
                  >
                    <p className="text-sm text-rose-300/50 font-light italic">With love,</p>
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.8, type: 'spring' }}
                      className="text-xl font-bold mt-1"
                      style={{ fontFamily: "'Caveat', cursive", color: 'rgba(251,113,133,0.8)' }}
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
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <SectionTitle>Our Gallery</SectionTitle>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {memory.photos.map((photo, i) => (
                <motion.button
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                  className={`w-full overflow-hidden rounded-2xl border border-white/10 group relative ${i % 3 === 1 ? 'md:col-span-2' : ''}`}
                  style={{ breakInside: 'avoid' }}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || ''}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ minHeight: '200px' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {photo.caption && (
                    <p className="absolute bottom-3 left-3 right-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">{photo.caption}</p>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {memory.videos.length > 0 && (
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto">
            <SectionTitle>Video Memories</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memory.videos.map((video, i) => (
                <FadeUp key={video.id} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -6 }} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-video">
                    <video
                      src={video.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).load(); }}
                      controls
                      playsInline
                      preload="metadata"
                    />
                    {video.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-sm font-medium">{video.caption}</p>
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
        <section className="py-24 px-6">
          <div className="max-w-2xl mx-auto">
            <SectionTitle>Voice Messages</SectionTitle>
            <div className="space-y-4">
              {memory.voiceNotes.map((note, i) => (
                <FadeUp key={note.id} delay={i * 0.1}>
                  <div className="group p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-rose-500/30 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleVoice(note.id, note.audioUrl)}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-transform"
                      >
                        {playingAudio === note.id ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/90 truncate">{note.title}</p>
                        <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300" style={{ width: `${audioDuration[note.id] ? (audioProgress[note.id] || 0) / audioDuration[note.id] * 100 : 0}%` }} />
                        </div>
                      </div>
                      <span className="text-xs text-white/40 font-mono">{note.duration}</span>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {memory.timeline.length > 0 && (
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <SectionTitle>Our Journey</SectionTitle>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-rose-500/40 via-rose-400/20 to-transparent" />
              {memory.timeline.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start gap-6 mb-12 pl-12 md:pl-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`hidden md:block w-1/2 ${i % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
                    <div className={`inline-block p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-rose-500/20 transition-all ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <span className="text-xs text-rose-400/80 font-mono">{event.eventDate}</span>
                      <h3 className="text-lg font-bold text-white mt-1">{event.title}</h3>
                      {event.description && <p className="text-sm text-white/60 mt-2 leading-relaxed">{event.description}</p>}
                      {event.image && (
                        <img src={event.image} alt="" className="mt-3 rounded-xl w-full h-32 object-cover" loading="lazy" />
                      )}
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 top-6 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-[#1a1410] -translate-x-1/2 z-10 shadow-lg shadow-rose-500/30" />
                  <div className="block md:hidden w-full">
                    <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                      <span className="text-xs text-rose-400/80 font-mono">{event.eventDate}</span>
                      <h3 className="text-lg font-bold text-white mt-1">{event.title}</h3>
                      {event.description && <p className="text-sm text-white/60 mt-2 leading-relaxed">{event.description}</p>}
                      {event.image && (
                        <img src={event.image} alt="" className="mt-3 rounded-xl w-full h-32 object-cover" loading="lazy" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quotes */}
      {memory.quotes && memory.quotes.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <SectionTitle>Words of Love</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memory.quotes.map((quote, i) => (
                <FadeUp key={quote.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10"
                  >
                    <Quote className="w-6 h-6 text-rose-400/40 mb-3" />
                    <p className="text-lg text-white/80 font-light italic leading-relaxed">"{quote.quote}"</p>
                    {quote.author && <p className="text-sm text-rose-300/60 mt-3">— {quote.author}</p>}
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Wishes */}
      {memory.wishes && memory.wishes.length > 0 && (
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <SectionTitle>Wishes & Blessings</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memory.wishes.map((wish, i) => (
                <FadeUp key={wish.id} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-5 rounded-xl bg-white/5 border border-white/10 text-center"
                  >
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-rose-400/20 to-pink-600/20 border border-rose-500/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-rose-300">{wish.personName.charAt(0).toUpperCase()}</span>
                    </div>
                    <p className="text-sm font-semibold text-white/80">{wish.personName}</p>
                    <p className="text-xs text-white/50 mt-2 leading-relaxed">{wish.message}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <section className="py-24 px-6 text-center">
        <FadeUp>
          <div className="max-w-xl mx-auto">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-rose-500/30"
            >
              <Heart className="w-7 h-7 text-white" fill="white" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Share This Memory</h2>
            <p className="text-white/50 mb-8">Share this beautiful memory with friends and family</p>
            <button
              onClick={() => { if (navigator.share) navigator.share({ title: memory.title, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold hover:shadow-xl hover:shadow-rose-500/30 transition-all active:scale-95"
            >
              Share Memory
            </button>
            <p className="text-xs text-white/30 mt-6">Made with love</p>
          </div>
        </FadeUp>
      </section>

      <GalleryLightbox photos={memory.photos} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </div>
  );
};
