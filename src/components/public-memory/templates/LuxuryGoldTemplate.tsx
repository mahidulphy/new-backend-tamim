import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Crown, Award, Play, Pause, Quote, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Memory } from '../../../types';
import { GalleryLightbox } from '../../shared/GalleryLightbox';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    className="text-3xl md:text-5xl font-bold text-center mb-16"
    style={{ fontFamily: "'Cormorant Garamond', serif" }}
  >
    <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">{children}</span>
  </motion.h2>
);

const FadeUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

export const LuxuryGoldTemplate: React.FC<{ memory: Memory }> = ({ memory }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [vTime, setVTime] = useState<Record<string, number>>({});
  const [vDur, setVDur] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 100]);
  const heroO = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

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
    <div className="relative bg-[#0c0a09] text-[#f5f0e8] overflow-hidden" style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {memory.coverImage ? (
            <>
              <img src={memory.coverImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a09]/70 via-[#0c0a09]/50 to-[#0c0a09]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1508] via-[#0c0a09] to-black" />
          )}
        </motion.div>

        <motion.div style={{ opacity: heroO }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-amber-300/5 blur-3xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-20 h-20 mx-auto mb-10 rounded-full border-2 border-amber-400/40 flex items-center justify-center"
          >
            <Crown className="w-9 h-9 text-amber-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">{memory.title}</span>
          </motion.h1>
          {memory.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-amber-200/60 max-w-2xl mx-auto mb-8 font-light tracking-wide"
            >
              {memory.subtitle}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-6 text-amber-200/50 text-lg"
          >
            <span>{memory.recipientName}</span>
            <span className="w-8 h-px bg-amber-400/30" />
            <span>{memory.senderName}</span>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="w-32 h-px mx-auto mt-12 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="w-5 h-8 rounded-full border border-amber-400/30 flex items-start justify-center p-1">
            <motion.div className="w-1 h-2 rounded-full bg-amber-400/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Letter */}
      {(() => {
        const l = memory.letter;
        if (!l) return null;
        return (
          <section className="py-28 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,240,232,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(245,240,232,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            {/* Floating gold particles */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-[2px] h-[2px] rounded-full"
                  style={{ backgroundColor: 'rgba(251,191,36,0.3)', left: `${15 + i * 14}%`, top: `${10 + (i % 4) * 22}%` }}
                  animate={{ y: [0, -30, 0], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }}
                />
              ))}
            </div>
            <div className="max-w-2xl mx-auto relative">
              <SectionTitle>A Golden Tribute</SectionTitle>
              <motion.div
                initial={{ opacity: 0, y: 50, rotateY: -3 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ perspective: '1200px' }}
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  className="relative p-8 sm:p-10 md:p-16 border overflow-hidden"
                  style={{
                    borderColor: 'rgba(251,191,36,0.2)',
                    background: 'linear-gradient(180deg, rgba(26,21,8,1) 0%, rgba(12,10,9,1) 100%)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(251,191,36,0.1)',
                  }}
                >
                  {/* Paper texture */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")', backgroundSize: '150px 150px' }}
                  />

                  {/* Warm golden glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />

                  {/* Gold border corners */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/30" />
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/30" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/30" />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/30" />

                  {/* Gold wax seal */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 100 }}
                    className="relative w-20 h-20 mx-auto mb-8"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-2xl shadow-amber-950/60 border-2 border-amber-300/40">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                  </motion.div>

                  <div className="flex items-center gap-3 justify-center mb-8">
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-amber-400/30" />
                    <div className="w-2 h-2 rotate-45 border border-amber-400/40" />
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-amber-400/30" />
                  </div>

                  {l.title && (
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-3xl md:text-4xl font-bold text-center mb-10"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">{l.title}</span>
                    </motion.h3>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="relative mx-auto"
                    style={{
                      fontFamily: l.fontStyle === 'handwriting' ? "'Caveat', cursive" : "'Cormorant Garamond', Georgia, serif",
                      textAlign: l.textAlignment || 'center',
                      lineHeight: l.fontStyle === 'handwriting' ? '1.8' : '2',
                      fontSize: l.fontStyle === 'handwriting' ? '1.3rem' : '1.1rem',
                      color: 'rgba(245,240,232,0.75)',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      maxWidth: '55ch',
                      fontWeight: 300,
                    }}
                  >
                    {l.content}
                  </motion.div>

                  <div className="flex items-center gap-3 justify-center mt-12 mb-6">
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-amber-400/30" />
                    <div className="w-2 h-2 rotate-45 border border-amber-400/40" />
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-amber-400/30" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-right"
                  >
                    <p className="text-base text-amber-300/50 italic font-light">With eternal gratitude,</p>
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.8, type: 'spring' }}
                      className="text-2xl font-bold mt-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: 'rgba(251,191,36,0.8)' }}
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
            <SectionTitle>Cherished Moments</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memory.photos.map((photo, i) => (
                <FadeUp key={photo.id} delay={i * 0.05}>
                  <motion.button
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                    className="group relative overflow-hidden rounded-sm border border-amber-400/20 bg-[#1a1508] w-full"
                  >
                    <div className="aspect-[4/3]">
                      <img src={photo.imageUrl} alt={photo.caption || ''} loading="lazy" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" />
                    </div>
                    <div className="absolute inset-0 ring-1 ring-amber-400/10 ring-inset" />
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-amber-200 text-sm font-light">{photo.caption}</p>
                      </div>
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
        <section className="py-28 px-6 bg-[#0a0806]">
          <div className="max-w-6xl mx-auto">
            <SectionTitle>Golden Reels</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {memory.videos.map((video, i) => (
                <FadeUp key={video.id} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -4 }} className="group rounded-sm overflow-hidden border border-amber-400/20 bg-black shadow-2xl">
                    <div className="relative aspect-video">
                      <video
                        src={video.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        controls
                        playsInline
                        preload="metadata"
                        onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                        onMouseLeave={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).load(); }}
                      />
                    </div>
                    {video.caption && (
                      <div className="p-4 border-t border-amber-400/10">
                        <p className="text-amber-200/80 text-sm font-light tracking-wide">{video.caption}</p>
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
            <SectionTitle>Words from the Heart</SectionTitle>
            <div className="space-y-5">
              {memory.voiceNotes.map((note, i) => (
                <FadeUp key={note.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="group p-6 rounded-sm border border-amber-400/20 bg-gradient-to-r from-[#1a1508] to-[#0c0a09]"
                  >
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => toggleVoice(note.id, note.audioUrl)}
                        className="w-14 h-14 rounded-full border-2 border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 hover:bg-amber-400/10 hover:border-amber-400/60 transition-all active:scale-95"
                      >
                        {playingVoice === note.id ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-amber-100/90 truncate">{note.title}</p>
                        <div className="w-full h-1.5 bg-amber-400/10 rounded-full mt-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"
                            style={{ width: `${vDur[note.id] ? ((vTime[note.id] || 0) / vDur[note.id]) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-amber-400/60 font-mono">{note.duration}</span>
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
        <section className="py-28 px-6 bg-[#0a0806]">
          <div className="max-w-5xl mx-auto">
            <SectionTitle>Through the Years</SectionTitle>
            <div className="relative">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/40 via-amber-400/20 to-transparent" />
              {memory.timeline.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative flex items-start gap-8 mb-16 pl-20 md:pl-0"
                >
                  <div className={`hidden md:block w-1/2 ${i % 2 === 0 ? 'pr-16 text-right' : 'pl-16 text-left'}`}>
                    <div className={`inline-block p-6 rounded-sm border border-amber-400/20 bg-[#1a1508] ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <span className="text-xs font-mono text-amber-400/60 uppercase tracking-widest">{event.eventDate}</span>
                      <h3 className="text-xl font-bold text-amber-100 mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{event.title}</h3>
                      {event.description && <p className="text-sm text-amber-200/50 mt-2 leading-relaxed font-light">{event.description}</p>}
                      {event.image && <img src={event.image} alt="" className="mt-4 w-full h-36 object-cover rounded-sm" loading="lazy" />}
                    </div>
                  </div>
                  <div className="absolute left-8 md:left-1/2 top-3 w-4 h-4 rounded-full border-2 border-amber-400 bg-[#0c0a09] -translate-x-1/2 z-10 shadow-lg shadow-amber-900/50" />
                  <div className="md:hidden w-full">
                    <div className="p-6 rounded-sm border border-amber-400/20 bg-[#1a1508]">
                      <span className="text-xs font-mono text-amber-400/60 uppercase tracking-widest">{event.eventDate}</span>
                      <h3 className="text-xl font-bold text-amber-100 mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{event.title}</h3>
                      {event.description && <p className="text-sm text-amber-200/50 mt-2 leading-relaxed font-light">{event.description}</p>}
                      {event.image && <img src={event.image} alt="" className="mt-4 w-full h-36 object-cover rounded-sm" loading="lazy" />}
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
        <section className="py-28 px-6">
          <div className="max-w-4xl mx-auto">
            <SectionTitle>Words of Wisdom</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {memory.quotes.map((quote, i) => (
                <FadeUp key={quote.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-8 rounded-sm border border-amber-400/20 bg-gradient-to-br from-[#1a1508] to-[#0c0a09] text-center"
                  >
                    <Quote className="w-8 h-8 text-amber-400/30 mx-auto mb-4" />
                    <p className="text-xl text-amber-100/80 font-light italic leading-relaxed">"{quote.quote}"</p>
                    {quote.author && (
                      <p className="text-sm text-amber-400/50 mt-4 font-semibold tracking-wider">— {quote.author}</p>
                    )}
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Wishes */}
      {memory.wishes && memory.wishes.length > 0 && (
        <section className="py-28 px-6 bg-[#0a0806]">
          <div className="max-w-5xl mx-auto">
            <SectionTitle>Blessings & Wishes</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {memory.wishes.map((wish, i) => (
                <FadeUp key={wish.id} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="p-6 rounded-sm border border-amber-400/20 bg-[#1a1508] text-center group"
                  >
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full border-2 border-amber-400/30 bg-[#0c0a09] flex items-center justify-center group-hover:border-amber-400/60 transition-colors">
                      <span className="text-xl font-bold text-amber-300">{wish.personName.charAt(0).toUpperCase()}</span>
                    </div>
                    <p className="text-sm font-semibold text-amber-100/80">{wish.personName}</p>
                    <p className="text-xs text-amber-200/40 mt-3 leading-relaxed">{wish.message}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <section className="py-28 px-6 text-center relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,240,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(245,240,232,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <FadeUp>
          <div className="max-w-xl mx-auto relative">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto mb-8 rounded-full border border-amber-400/30 flex items-center justify-center"
            >
              <Award className="w-9 h-9 text-amber-400" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">Share This Memory</span>
            </h2>
            <p className="text-amber-200/50 mb-10 text-lg font-light">Pass on this golden tribute</p>
            <button
              onClick={() => { if (navigator.share) navigator.share({ title: memory.title, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }}
              className="px-10 py-4 border-2 border-amber-400/40 text-amber-300 text-sm font-semibold uppercase tracking-[0.2em] hover:bg-amber-400/10 hover:border-amber-400/60 transition-all active:scale-95"
            >
              Share Memory
            </button>
            <p className="text-xs text-amber-400/20 mt-8 uppercase tracking-[0.3em]">Forever Cherished</p>
          </div>
        </FadeUp>
      </section>

      <GalleryLightbox photos={memory.photos} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </div>
  );
};
