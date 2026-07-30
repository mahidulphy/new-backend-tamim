import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Photo } from '../../types';

interface GalleryLightboxProps {
  photos: Photo[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  photos,
  initialIndex = 0,
  isOpen,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([initialIndex]));
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomed(false);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const currentPhoto = photos[currentIndex] || photos[0];

  const preloadAdjacent = useCallback((idx: number) => {
    const toLoad = new Set(loadedImages);
    toLoad.add(idx);
    if (idx > 0) toLoad.add(idx - 1);
    if (idx < photos.length - 1) toLoad.add(idx + 1);
    setLoadedImages(toLoad);
  }, [loadedImages, photos.length]);

  const handlePrev = useCallback(() => {
    const next = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    setCurrentIndex(next);
    setZoomed(false);
    preloadAdjacent(next);
  }, [currentIndex, photos.length, preloadAdjacent]);

  const handleNext = useCallback(() => {
    const next = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(next);
    setZoomed(false);
    preloadAdjacent(next);
  }, [currentIndex, photos.length, preloadAdjacent]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { if (zoomed) setZoomed(false); else onClose(); }
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
  }, [isOpen, onClose, handleNext, handlePrev, zoomed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  const toggleZoom = () => setZoomed(prev => !prev);

  if (!isOpen || photos.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-4 sm:p-8 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-all shadow-xl"
        aria-label="Close lightbox"
      >
        <X className="w-5 h-5" />
      </button>

      <button
        onClick={toggleZoom}
        className="absolute top-5 left-5 z-20 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-all shadow-xl"
        aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
      >
        {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-all shadow-xl"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-all shadow-xl"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-xs font-mono tracking-widest text-white/60 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        {currentIndex + 1} / {photos.length}
      </div>

      <div
        className="relative w-full h-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: 1,
              scale: zoomed ? 1.8 : 1,
              cursor: zoomed ? 'zoom-out' : 'zoom-in'
            }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative flex flex-col items-center justify-center"
            onClick={toggleZoom}
          >
            {loadedImages.has(currentIndex) ? (
              <img
                ref={imageRef}
                src={currentPhoto.imageUrl}
                alt={currentPhoto.caption || 'Memory Photo'}
                className="max-h-[85vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                draggable={false}
                loading="lazy"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
            )}
            {currentPhoto.caption && !zoomed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-white/70 mt-4 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 max-w-lg truncate"
              >
                {currentPhoto.caption}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {photos.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setZoomed(false); preloadAdjacent(i); }}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
