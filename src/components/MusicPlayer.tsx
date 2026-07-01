import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Heart,
  Maximize2,
  Music,
  ChevronUp,
  X,
  Sliders,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Track } from "../types";

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function MusicPlayer({
  currentTrack,
  isPlaying,
  setIsPlaying,
  onNext,
  onPrev,
  favorites,
  toggleFavorite,
}: MusicPlayerProps) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isSynthActive, setIsSynthActive] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lyricContainerRef = useRef<HTMLDivElement | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize and play track on change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack) {
      audio.src = currentTrack.audioUrl;
      audio.load();
      if (isPlaying) {
        audio.play().catch(() => {
          // If browser blocks autoplay or URL fails, boot our procedural Synth Loop!
          startFallbackSynth();
        });
      }
    } else {
      audio.pause();
    }

    return () => {
      stopFallbackSynth();
    };
  }, [currentTrack]);

  // Handle play/pause state toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (isSynthActive) {
        resumeFallbackSynth();
      } else {
        audio.play().catch(() => {
          startFallbackSynth();
        });
      }
    } else {
      if (isSynthActive) {
        pauseFallbackSynth();
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  // Sync volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // ----------------------------------------------------
  // PROCEDURAL WEB AUDIO SYNTHESIZER FALLBACK
  // Creates custom low-freq space loops when direct URLs fail.
  // ----------------------------------------------------
  const startFallbackSynth = () => {
    setIsSynthActive(true);
    setDuration(180); // Mock 3-minute track duration
    setCurrentTime(0);

    // Initialize Web Audio API context safely on first gesture
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    } catch (err) {
      console.log("AudioContext not supported", err);
    }

    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);

    synthIntervalRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 180) {
          onNext();
          return 0;
        }
        return prev + 1;
      });

      // Play a premium sci-fi sound ping programmatically
      triggerSynthPing();
    }, 1000);
  };

  const stopFallbackSynth = () => {
    setIsSynthActive(false);
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  const resumeFallbackSynth = () => {
    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    synthIntervalRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 180) {
          onNext();
          return 0;
        }
        return prev + 1;
      });
      triggerSynthPing();
    }, 1000);
  };

  const pauseFallbackSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  const triggerSynthPing = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === "suspended") return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Cyberpunk deep frequency hum
      osc.type = "sine";
      const freq = currentTrack?.id === "track-3" ? 55 : 110; // Deep sub notes
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.1, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.9);
    } catch (e) {
      // Fail silently if context is blocked
    }
  };

  // Human Readable Time Formatter
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  // Scrub progress handler
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (isSynthActive) {
      // Just update timeline
    } else if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Find active lyric line
  const activeLyricIndex = currentTrack
    ? currentTrack.lyrics.findIndex((lyric, idx) => {
        const nextLyric = currentTrack.lyrics[idx + 1];
        return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
      })
    : -1;

  // Auto Scroll Lyrics Container
  useEffect(() => {
    if (lyricContainerRef.current && activeLyricIndex !== -1) {
      const activeElement = lyricContainerRef.current.children[activeLyricIndex] as HTMLElement;
      if (activeElement) {
        lyricContainerRef.current.scrollTo({
          top: activeElement.offsetTop - lyricContainerRef.current.clientHeight / 2 + activeElement.clientHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeLyricIndex, isLyricsOpen]);

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = favorites.includes(currentTrack.id);

  return (
    <>
      {/* Hidden native HTML5 Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onDurationChange={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setIsSynthActive(false); // Successfully streaming real audio! Disable synth
          }
        }}
        onEnded={onNext}
        onError={() => {
          // Fall back gracefully if streaming is blocked by CORS/network
          startFallbackSynth();
        }}
      />

      {/* FLOATING MASTER PLAYER CONSOLE */}
      <div className="fixed bottom-6 left-4 right-4 z-40 max-w-5xl mx-auto">
        <div
          className="w-full rounded-[25px] border border-white/12 bg-black/60 backdrop-blur-xl p-4 md:px-8 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden border-glow"
          id="player-dock"
        >
          {/* Subtle neon progress guide lining the top edge of player */}
          <div
            className="absolute top-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />

          {/* LEFT: ALBUM INFO & SPINNING HOLOGRAM */}
          <div className="flex items-center gap-4 w-full md:w-1/4">
            {/* Hologram Circle */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <div className="absolute inset-0 rounded-full border border-white/10 p-[1px] bg-black shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover rounded-full ${
                    isPlaying ? "animate-spin" : ""
                  }`}
                  style={{ animationDuration: "14s" }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Glowing center record pin */}
              <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-black border border-white/20 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-white/80" />
              </div>
            </div>

            <div className="flex flex-col min-w-0 max-w-[150px]">
              <h4 className="font-display font-medium text-xs tracking-wider text-white truncate text-glow leading-tight">
                {currentTrack.title}
              </h4>
              <p className="font-sans text-[10px] text-white/50 truncate leading-normal">
                {currentTrack.artist}
              </p>
            </div>

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <Heart size={13} className={isFav ? "fill-white text-white" : ""} />
            </button>
          </div>

          {/* CENTER: CORE CONTROLS & TIMELINE (2/4 COLS) */}
          <div className="flex flex-col items-center gap-2.5 w-full md:w-2/4">
            {/* BUTTON BUTTONS ROW */}
            <div className="flex items-center gap-6">
              <button
                onClick={onPrev}
                className="p-2 text-white/55 hover:text-white transition-all transform hover:scale-110 cursor-pointer"
              >
                <SkipBack size={16} />
              </button>

              {/* Glowing Play Trigger */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 rounded-full border border-white/20 bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 transition-all cursor-pointer relative group overflow-hidden"
              >
                {isPlaying ? <Pause size={16} className="fill-black" /> : <Play size={16} className="fill-black ml-0.5" />}
              </button>

              <button
                onClick={onNext}
                className="p-2 text-white/55 hover:text-white transition-all transform hover:scale-110 cursor-pointer"
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* TIMELINE SLIDER RAIL */}
            <div className="w-full flex items-center gap-3">
              <span className="font-mono text-[9px] text-white/35 font-light w-8 text-right">
                {formatTime(currentTime)}
              </span>

              {/* Premium Progress Bar Input Slider */}
              <div className="relative flex-grow h-1 bg-white/5 rounded-full group/timeline">
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full shadow-[0_0_8px_white]"
                  style={{ width: `${progressPercent}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <span className="font-mono text-[9px] text-white/35 font-light w-8 text-left">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* RIGHT: DYNAMIC ENGINES, VOLUME & LYRICS DRAWER TRIGGER */}
          <div className="flex items-center justify-end gap-5 w-full md:w-1/4">
            {/* Dynamic Signal Source Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/5 bg-white/[0.02]">
              <span className={`w-1.5 h-1.5 rounded-full ${isLyricsOpen ? 'bg-white' : (isSynthActive ? "bg-white/40 animate-pulse" : "bg-white animate-pulse")}`} />
              <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase">
                {isSynthActive ? "SYNTH_FALLBACK" : "LIVE_BUS"}
              </span>
            </div>

            {/* Lyrics Drawer Toggle */}
            <button
              onClick={() => setIsLyricsOpen(!isLyricsOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-mono tracking-wider border transition-all cursor-pointer uppercase ${
                isLyricsOpen
                  ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white"
              }`}
            >
              <Music size={10} />
              <span>Lyrics</span>
            </button>

            {/* Volume Controllers */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-white/50 hover:text-white transition-all cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              {/* Slider */}
              <div className="relative w-16 h-1 bg-white/5 rounded-full">
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full group-hover/volume:bg-white/90"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SYNCED LYRICS EXPANDABLE GLASS DRAWER (Right Side) */}
      <AnimatePresence>
        {isLyricsOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md p-6 glass-panel-heavy border-l border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.85)] flex flex-col justify-between"
            id="lyrics-panel"
          >
            {/* Header section of drawer */}
            <div className="flex items-center justify-between border-b border-white/5 pb-5">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[8px] tracking-[0.2em] text-white/40 uppercase">
                  Acoustic Synaptic Map
                </span>
                <h3 className="font-display font-medium text-sm text-white tracking-widest uppercase">
                  SYNCED LYRICS
                </h3>
              </div>
              <button
                onClick={() => setIsLyricsOpen(false)}
                className="p-2 rounded-full border border-white/5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* SYNCED LYRICS SCROLL STAGE */}
            <div
              ref={lyricContainerRef}
              className="flex-grow my-8 overflow-y-auto px-2 flex flex-col gap-6 scroll-smooth select-none scrollbar-none"
              style={{ maskImage: "linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)" }}
            >
              {currentTrack.lyrics.map((lyric, idx) => {
                const isActive = idx === activeLyricIndex;
                const isPast = idx < activeLyricIndex;

                return (
                  <motion.div
                    key={idx}
                    className={`py-2 text-left cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "text-white text-base font-display font-medium text-glow leading-normal"
                        : isPast
                        ? "text-white/40 text-sm font-light leading-relaxed filter blur-[0.4px]"
                        : "text-white/15 text-sm font-light leading-relaxed filter blur-[0.8px]"
                    }`}
                    onClick={() => {
                      if (isSynthActive) {
                        // In synth mode, seek to lyric time
                        setCurrentTime(lyric.time);
                      } else if (audioRef.current) {
                        audioRef.current.currentTime = lyric.time;
                        setCurrentTime(lyric.time);
                      }
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    {lyric.text}
                  </motion.div>
                );
              })}
            </div>

            {/* Track Info Banner in bottom drawer */}
            <div className="border-t border-white/5 pt-5 flex items-center gap-3">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-10 h-10 rounded-lg object-cover border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-display font-medium text-xs text-white tracking-wide truncate">
                  {currentTrack.title}
                </span>
                <span className="font-sans text-[10px] text-white/50 truncate">
                  {currentTrack.artist}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
