import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { BookOpen, Feather, Play, Pause, Quote, Camera, Headphones } from 'lucide-react';
import { Memory } from '../../../types';
import { GalleryLightbox } from '../../shared/GalleryLightbox';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-3xl md:text-5xl font-bold text-center mb-16"
    style={{ fontFamily: "'Caveat', cursive", color: '#d4c5a9' }}
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

export const VintageScrapbookTemplate: React.FC<{ memory: Memory }> = ({ memory }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const { scrollYProgress } = useScroll();
  const heroO = useTransform(scrollYProgress, [0, 0.15], [1, 0.3]);

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
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#1c1814', color: '#d4c5a9' }}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4c5a9\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '30px 30px' }}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
        <motion.div style={{ opacity: heroO }} className="absolute inset-0">
          {memory.coverImage ? (
            <>
              <img src={memory.coverImage} alt="" className="w-full h-full object-cover sepia-[0.3]" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1c1814]/80 via-[#1c1814]/60 to-[#1c1814]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a221a] via-[#1c1814] to-[#0f0c08]" />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-10 rounded-full border-2 border-[#d4c5a9]/30 bg-[#1c1814] flex items-center justify-center shadow-xl"
          >
            <BookOpen className="w-9 h-9 text-[#d4c5a9]" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-mono text-[#d4c5a9]/50 mb-4 uppercase tracking-[0.3em]"
          >
            A Memory To Treasure
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Caveat', cursive", color: '#e8dcc8' }}
          >
            {memory.title}
          </motion.h1>

          {memory.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-[#d4c5a9]/60 max-w-xl mx-auto mb-8 font-mono italic leading-relaxed"
            >
              "{memory.subtitle}"
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-3 border border-[#d4c5a9]/20 rounded-sm"
          >
            <Camera className="w-4 h-4 text-[#d4c5a9]/60" />
            <span className="text-sm text-[#d4c5a9]/70">{memory.recipientName}</span>
            <span className="text-[#d4c5a9]/30">&</span>
            <span className="text-sm text-[#d4c5a9]/70">{memory.senderName}</span>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="w-24 h-px mx-auto mt-12 bg-gradient-to-r from-transparent via-[#d4c5a9]/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* Letter */}
      {(() => {
        const l = memory.letter;
        if (!l) return null;
        return (
          <section className="py-28 px-6 relative overflow-hidden">
            {/* Floating ink dots */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 1 + Math.random() * 2,
                    height: 1 + Math.random() * 2,
                    backgroundColor: 'rgba(212,197,169,0.15)',
                    left: `${8 + i * 11}%`,
                    top: `${15 + (i % 3) * 28}%`,
                  }}
                  animate={{ y: [0, -15, 0], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 4 + i * 0.6, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
                />
              ))}
            </div>
            <div className="max-w-2xl mx-auto">
              <SectionTitle>Dear {memory.recipientName}...</SectionTitle>
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  className="relative p-8 sm:p-10 md:p-14 rounded-sm overflow-hidden border shadow-2xl"
                  style={{
                    backgroundColor: '#26201a',
                    borderColor: 'rgba(212,197,169,0.15)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,197,169,0.06)',
                  }}
                >
                  {/* Lined paper background */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
                    style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(212,197,169,0.3) 31px, rgba(212,197,169,0.3) 32px)', backgroundSize: '100% 32px' }}
                  />

                  {/* Paper texture */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.3\'/%3E%3C/svg%3E")', backgroundSize: '140px 140px' }}
                  />

                  {/* Vintage corner decorations */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 rounded-tl-sm" style={{ borderColor: 'rgba(212,197,169,0.2)' }} />
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 rounded-tr-sm" style={{ borderColor: 'rgba(212,197,169,0.2)' }} />
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 rounded-bl-sm" style={{ borderColor: 'rgba(212,197,169,0.2)' }} />
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 rounded-br-sm" style={{ borderColor: 'rgba(212,197,169,0.2)' }} />

                  {/* Vintage stamp seal */}
                  <motion.div
                    initial={{ scale: 0, rotate: 20 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 80 }}
                    className="relative w-14 h-14 mx-auto mb-8"
                  >
                    <div className="w-full h-full rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'rgba(212,197,169,0.3)', backgroundColor: '#1c1814' }}>
                      <Feather className="w-6 h-6" style={{ color: 'rgba(212,197,169,0.6)' }} />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,197,169,0.3), transparent)' }} />
                  </motion.div>

                  <div className="flex items-center gap-2 justify-center mb-8">
                    <div className="flex-1 max-w-[40px] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,197,169,0.2))' }} />
                    <span style={{ color: 'rgba(212,197,169,0.3)' }}>✦</span>
                    <div className="flex-1 max-w-[40px] h-px" style={{ background: 'linear-gradient(270deg, transparent, rgba(212,197,169,0.2))' }} />
                  </div>

                  {l.title && (
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-2xl md:text-3xl font-bold text-center mb-10"
                      style={{ fontFamily: "'Caveat', cursive", color: '#e8dcc8' }}
                    >
                      {l.title}
                    </motion.h3>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="relative mx-auto"
                    style={{
                      fontFamily: l.fontStyle === 'handwriting' ? "'Caveat', cursive" : "'Courier Prime', 'Courier New', monospace",
                      textAlign: l.textAlignment || 'left',
                      lineHeight: l.fontStyle === 'handwriting' ? '1.8' : '2',
                      fontSize: l.fontStyle === 'handwriting' ? '1.2rem' : '0.95rem',
                      color: '#c4b69e',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      maxWidth: '58ch',
                    }}
                  >
                    {l.content}
                  </motion.div>

                  <div className="flex items-center gap-2 justify-center mt-10 mb-6">
                    <div className="flex-1 max-w-[40px] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,197,169,0.2))' }} />
                    <span style={{ color: 'rgba(212,197,169,0.3)' }}>✦</span>
                    <div className="flex-1 max-w-[40px] h-px" style={{ background: 'linear-gradient(270deg, transparent, rgba(212,197,169,0.2))' }} />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-right"
                  >
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.8, type: 'spring' }}
                      className="text-xl"
                      style={{ fontFamily: "'Caveat', cursive", color: '#d4c5a9' }}
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
          <div className="max-w-6xl mx-auto">
            <SectionTitle>Polaroid Memories</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {memory.photos.map((photo, i) => (
                <FadeUp key={photo.id} delay={i * 0.05}>
                  <motion.button
                    whileHover={{ y: -8, rotate: i % 2 === 0 ? 2 : -2, scale: 1.02 }}
                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                    className="group text-left"
                  >
                    <div className="p-3 pb-8 rounded-sm shadow-2xl" style={{ backgroundColor: '#f5f0e8', transform: `rotate(${i % 2 === 0 ? 1 : -1}deg)` }}>
                      <div className="aspect-square overflow-hidden rounded-sm mb-3">
                        <img src={photo.imageUrl} alt={photo.caption || ''} loading="lazy" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                      </div>
                      {photo.caption && (
                        <p className="text-xs font-mono text-center" style={{ color: '#4a3f35' }}>{photo.caption}</p>
                      )}
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
        <section className="py-28 px-6" style={{ backgroundColor: '#201a15' }}>
          <div className="max-w-6xl mx-auto">
            <SectionTitle>Moving Pictures</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {memory.videos.map((video, i) => (
                <FadeUp key={video.id} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -4 }} className="group rounded-sm overflow-hidden border-2 border-[#d4c5a9]/20 shadow-2xl" style={{ backgroundColor: '#1c1814' }}>
                    <div className="relative aspect-video">
                      <video src={video.videoUrl} className="w-full h-full object-cover" muted loop controls playsInline preload="metadata"
                        onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                        onMouseLeave={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).load(); }}
                      />
                    </div>
                    {video.caption && (
                      <div className="p-4 border-t border-[#d4c5a9]/15">
                        <p className="text-sm font-mono" style={{ color: '#c4b69e' }}>{video.caption}</p>
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
            <SectionTitle>Recorded Memories</SectionTitle>
            <div className="space-y-4">
              {memory.voiceNotes.map((note, i) => (
                <FadeUp key={note.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="group p-5 rounded-sm border border-[#d4c5a9]/20"
                    style={{ backgroundColor: '#26201a' }}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleVoice(note.id, note.audioUrl)}
                        className="w-12 h-12 rounded-full border-2 border-[#d4c5a9]/40 flex items-center justify-center shrink-0 hover:bg-[#d4c5a9]/10 transition-all active:scale-95"
                        style={{ color: '#d4c5a9' }}
                      >
                        {playingVoice === note.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#e8dcc8' }}>{note.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Headphones className="w-3 h-3 text-[#d4c5a9]/40" />
                          <span className="text-xs font-mono text-[#d4c5a9]/50">{note.duration}</span>
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
        <section className="py-28 px-6" style={{ backgroundColor: '#201a15' }}>
          <div className="max-w-4xl mx-auto">
            <SectionTitle>Our Story</SectionTitle>
            <div className="space-y-8">
              {memory.timeline.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative pl-14"
                >
                  <div className="absolute left-4 top-3 w-[3px] bg-gradient-to-b from-[#d4c5a9]/30 to-transparent" style={{ height: 'calc(100% + 2rem)' }} />
                  <div className="absolute left-2 top-3 w-[7px] h-[7px] rounded-full border-2 border-[#d4c5a9]" style={{ backgroundColor: '#1c1814' }} />
                  <div className="p-6 rounded-sm border border-[#d4c5a9]/15" style={{ backgroundColor: '#26201a' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#d4c5a9]/60">{event.eventDate}</span>
                    </div>
                    <h3 className="text-xl font-bold" style={{ fontFamily: "'Caveat', cursive", color: '#e8dcc8' }}>{event.title}</h3>
                    {event.description && <p className="text-sm mt-2 font-mono leading-relaxed" style={{ color: '#b8a88e' }}>{event.description}</p>}
                    {event.image && (
                      <div className="mt-4 inline-block p-2 rounded-sm shadow-lg" style={{ backgroundColor: '#f5f0e8', transform: `rotate(${i % 2 === 0 ? 0.5 : -0.5}deg)` }}>
                        <img src={event.image} alt="" className="w-full h-32 object-cover rounded-sm" loading="lazy" />
                      </div>
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
            <SectionTitle>Words to Remember</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memory.quotes.map((quote, i) => (
                <FadeUp key={quote.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="p-6 rounded-sm border-2 border-[#d4c5a9]/20 text-center relative"
                    style={{ backgroundColor: '#26201a', borderStyle: 'dashed' }}
                  >
                    <Quote className="w-5 h-5 mx-auto mb-3 text-[#d4c5a9]/30" />
                    <p className="text-base font-mono italic leading-relaxed" style={{ color: '#c4b69e' }}>"{quote.quote}"</p>
                    {quote.author && (
                      <p className="text-sm mt-3" style={{ fontFamily: "'Caveat', cursive", color: '#d4c5a9' }}>— {quote.author}</p>
                    )}
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider" style={{ backgroundColor: '#d4c5a9', color: '#1c1814' }}>
                      Quote
                    </div>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Wishes */}
      {memory.wishes && memory.wishes.length > 0 && (
        <section className="py-28 px-6" style={{ backgroundColor: '#201a15' }}>
          <div className="max-w-5xl mx-auto">
            <SectionTitle>Guestbook</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memory.wishes.map((wish, i) => (
                <FadeUp key={wish.id} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ y: -4, rotate: i % 3 === 0 ? 1 : i % 3 === 1 ? -1 : 0 }}
                    className="p-4 rounded-sm shadow-lg relative"
                    style={{ backgroundColor: '#f5f0e8', color: '#4a3f35' }}
                  >
                    <div className="absolute top-2 right-2 text-[10px] font-mono text-[#b8a88e]">
                      ✦
                    </div>
                    <p className="text-sm font-bold mb-1" style={{ fontFamily: "'Caveat', cursive" }}>{wish.personName}</p>
                    <p className="text-xs font-mono leading-relaxed" style={{ color: '#6b5d4f' }}>{wish.message}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Share */}
      <section className="py-28 px-6 text-center">
        <FadeUp>
          <div className="max-w-xl mx-auto">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-20 h-20 mx-auto mb-8 rounded-full border-2 border-[#d4c5a9]/30 flex items-center justify-center"
              style={{ backgroundColor: '#1c1814' }}
            >
              <BookOpen className="w-9 h-9 text-[#d4c5a9]" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Caveat', cursive", color: '#e8dcc8' }}>Share This Memory</h2>
            <p className="text-[#d4c5a9]/50 mb-10 font-mono text-sm">Add this page to your scrapbook</p>
            <button
              onClick={() => { if (navigator.share) navigator.share({ title: memory.title, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }}
              className="px-10 py-4 border-2 border-[#d4c5a9]/30 text-[#d4c5a9] text-sm font-mono uppercase tracking-[0.2em] hover:bg-[#d4c5a9]/10 transition-all active:scale-95"
            >
              Share Memory
            </button>
            <p className="text-xs text-[#d4c5a9]/20 mt-8 font-mono">Preserved with love</p>
          </div>
        </FadeUp>
      </section>

      <GalleryLightbox photos={memory.photos} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </div>
  );
};
