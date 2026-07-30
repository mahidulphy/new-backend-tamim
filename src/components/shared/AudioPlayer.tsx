import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { BackgroundMusic } from '../../types';

interface AudioPlayerProps {
  music?: BackgroundMusic;
  accentColor?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ music, accentColor = 'rose' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!music?.musicUrl) return;
    const audio = new Audio(music.musicUrl);
    audio.loop = true;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.pause();
      setIsPlaying(false);
    };
  }, [music?.musicUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!music) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9000] flex items-center gap-3 p-3 px-4 rounded-full bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-xl shadow-2xl text-white">
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform"
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
      </button>

      <div className="flex flex-col min-w-[120px] max-w-[180px] hidden sm:flex">
        <span className="text-xs font-semibold truncate text-neutral-100">{music.title}</span>
        <span className="text-[10px] text-neutral-400 truncate">{music.artist}</span>
      </div>

      <button onClick={toggleMute} className="text-neutral-400 hover:text-white transition-colors p-1.5">
        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
};
