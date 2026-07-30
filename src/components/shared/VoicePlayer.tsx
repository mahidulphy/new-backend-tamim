import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic, Loader2 } from 'lucide-react';
import { VoiceNote } from '../../types';

interface VoicePlayerProps {
  note: VoiceNote;
  accent?: string;
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({ note, accent = 'rose' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const audio = new Audio(note.audioUrl);
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleLoaded = () => {
      setDuration(audio.duration || 0);
      setLoading(false);
      initAudioAnalysis(audio);
    };
    const handleTime = () => setCurrentTime(audio.currentTime || 0);
    const handleEnded = () => { setIsPlaying(false); };

    const handleCanPlay = () => {
      if (audio.readyState >= 1) handleLoaded();
    };

    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTime);
    audio.addEventListener('ended', handleEnded);

    if (audio.readyState >= 1) handleLoaded();

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTime);
      audio.removeEventListener('ended', handleEnded);
      if (ctxRef.current) ctxRef.current.close();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [note.audioUrl]);

  const initAudioAnalysis = (audio: HTMLAudioElement) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      sourceRef.current = source;
      drawWaveform();
    } catch { }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 0.8;
      const gap = (canvas.width / bufferLength) * 0.2;

      for (let i = 0; i < bufferLength; i++) {
        const percent = dataArray[i] / 255;
        const barHeight = percent * canvas.height * 0.9;
        const x = i * (barWidth + gap);
        const y = canvas.height - barHeight;

        const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
        if (accent === 'amber') {
          gradient.addColorStop(0, '#f59e0b');
          gradient.addColorStop(1, '#d97706');
        } else if (accent === 'purple') {
          gradient.addColorStop(0, '#a855f7');
          gradient.addColorStop(1, '#7c3aed');
        } else if (accent === 'pink') {
          gradient.addColorStop(0, '#ec4899');
          gradient.addColorStop(1, '#db2777');
        } else if (accent === 'emerald') {
          gradient.addColorStop(0, '#10b981');
          gradient.addColorStop(1, '#059669');
        } else {
          gradient.addColorStop(0, '#f43f5e');
          gradient.addColorStop(1, '#e11d48');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const togglePlay = () => {
    if (!audioRef.current || loading) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const accentMap: Record<string, string> = {
    rose: 'from-rose-500 to-pink-600 shadow-rose-950/40',
    amber: 'from-amber-400 to-amber-600 shadow-amber-950/40',
    purple: 'from-purple-500 to-violet-600 shadow-purple-950/40',
    pink: 'from-pink-500 to-rose-600 shadow-pink-950/40',
    emerald: 'from-emerald-500 to-teal-600 shadow-emerald-950/40',
  };

  return (
    <div className="group flex flex-col gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300" role="region" aria-label={`Voice note: ${note.title}`}>
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          disabled={loading}
          className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${accentMap[accent] || accentMap.rose} text-white flex items-center justify-center shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 fill-white" />
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Mic className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? 'text-rose-400 animate-pulse' : 'text-white/40'}`} />
            <span className="text-sm font-semibold text-white/90 truncate">{note.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/40">{formatTime(currentTime)}</span>
            <span className="text-[11px] font-mono text-white/30">{duration > 0 ? formatTime(duration) : note.duration}</span>
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={48}
        className="w-full h-12 rounded-lg"
        aria-hidden="true"
      />

      <input
        type="range"
        min={0}
        max={duration || 100}
        value={currentTime}
        onChange={handleSeek}
        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
        aria-label="Seek"
      />
    </div>
  );
};
