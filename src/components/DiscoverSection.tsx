import React, { useState } from "react";
import { motion } from "motion/react";
import { Play, Pause, Heart, Radio, Flame, Sparkles, Disc } from "lucide-react";
import { Track } from "../types";
import { TRACKS, PLAYLISTS, FEATURED_ARTISTS } from "../data";

interface DiscoverSectionProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  searchFilter: string;
}

// Sub-component for 3D Tilting Card
function InteractiveTrackCard({
  track,
  isSelected,
  isPlaying,
  onPlayClick,
  isFavorite,
  onFavoriteClick,
}: {
  track: Track;
  isSelected: boolean;
  isPlaying: boolean;
  onPlayClick: () => void;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  key?: string;
}) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top; // y position within the element

    // Calculate rotation angles relative to center of the card
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (centerY - y) / 10; // Max tilt 10 deg
    const tiltY = (x - centerX) / 10;

    setRotateX(tiltX);
    setRotateY(tiltY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onPlayClick}
      className="relative group aspect-[4/5] rounded-[30px] p-5 cursor-pointer select-none transition-all duration-300"
      style={{
        perspective: 1000,
      }}
    >
      {/* Glow shadow behind the card matching the cover art colors */}
      <div
        className="absolute inset-4 rounded-[30px] opacity-10 group-hover:opacity-40 blur-[30px] transition-all duration-700 pointer-events-none -z-1"
        style={{
          background: `radial-gradient(circle, ${
            track.id === "track-1"
              ? "#ffffff"
              : track.id === "track-2"
              ? "#8888ff"
              : track.id === "track-3"
              ? "#ff3333"
              : "#00ffff"
          } 0%, transparent 70%)`,
        }}
      />

      {/* Main Glass Panel */}
      <div
        className={`w-full h-full rounded-[30px] glass-card p-4 flex flex-col justify-between relative overflow-hidden ${
          isHovered ? "border-white/25 bg-white/5" : ""
        } ${isSelected ? "border-white/30 bg-white/5" : ""}`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out, border-color 0.4s, background-color 0.4s",
        }}
      >
        {/* Animated chrome specular reflection sweep */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

        {/* Top bar with Metadata */}
        <div className="flex items-center justify-between" style={{ transform: "translateZ(20px)" }}>
          <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase font-light">
            {track.genre}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
          >
            <Heart size={14} className={isFavorite ? "fill-white text-white" : ""} />
          </button>
        </div>

        {/* Artwork Stage */}
        <div
          className="relative w-full aspect-square rounded-[22px] overflow-hidden my-4 border border-white/5 bg-black"
          style={{ transform: "translateZ(30px)" }}
        >
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />

          {/* Audio Visualizer Waves Indicator if playing inside card */}
          {isSelected && isPlaying && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-[8px] text-white tracking-widest uppercase">LIVE</span>
            </div>
          )}

          {/* Hover Play/Pause Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.2)] transform scale-75 group-hover:scale-100 transition-transform duration-500">
              {isSelected && isPlaying ? (
                <Pause size={18} className="fill-white" />
              ) : (
                <Play size={18} className="fill-white ml-0.5" />
              )}
            </div>
          </div>
        </div>

        {/* Info Block */}
        <div className="flex flex-col gap-1.5" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-baseline justify-between">
            <h3 className="font-display font-medium text-sm tracking-wider text-white truncate max-w-[75%]">
              {track.title}
            </h3>
            <span className="font-mono text-[10px] text-white/30 font-light">{track.duration}</span>
          </div>

          <p className="font-sans text-xs text-white/50 truncate leading-none">
            {track.artist}
          </p>

          {/* Tech/Stat Bar (Energy rating / BPM) */}
          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1 text-white/40">
              <Radio size={10} className="opacity-60" />
              <span className="font-mono text-[8px] tracking-wider">{track.bpm} BPM</span>
            </div>
            <div className="flex items-center gap-1 text-white/40">
              <Flame size={10} className="opacity-60 text-white/60" />
              <span className="font-mono text-[8px] tracking-wider uppercase">ENG: {track.energy}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DiscoverSection({
  currentTrack,
  isPlaying,
  onTrackSelect,
  favorites,
  toggleFavorite,
  searchFilter,
}: DiscoverSectionProps) {
  const [activeCategory, setActiveCategory] = useState<"tracks" | "playlists" | "artists">("tracks");

  // Filter based on active tab & search query
  const filteredTracks = TRACKS.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchFilter.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSearch;
  });

  return (
    <section id="discover-section" className="relative w-full py-28 px-4 md:px-8 max-w-7xl mx-auto z-10">
      {/* Decorative Aurora background glow (restricted inside grid bounds) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-gradient-to-r from-white/2 to-transparent rounded-full blur-[120px] pointer-events-none -z-1" />

      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-white/40 tracking-[0.3em] uppercase">01 / Curated Sounds</span>
            <Sparkles size={12} className="text-white/40" />
          </div>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white tracking-[0.15em] uppercase">
            EXPLORE THE FIELD
          </h2>
          <div className="h-[1px] w-24 bg-white/20 mt-1" />
        </div>

        {/* NAVIGATION TABS WITH FLOATING UNDERLINE */}
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10 self-start md:self-auto">
          {(["tracks", "playlists", "artists"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative px-5 py-2 rounded-full text-xs font-light tracking-[0.25em] text-white/50 hover:text-white transition-all cursor-pointer uppercase"
            >
              <span className="relative z-10">{cat}</span>
              {activeCategory === cat && (
                <motion.div
                  layoutId="discover-active-cat"
                  className="absolute inset-0 bg-white/10 border border-white/10 rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONDITIONAL RENDERING OF BENTO BLOCKS */}
      {activeCategory === "tracks" && (
        <>
          {filteredTracks.length === 0 ? (
            <div className="w-full glass-card rounded-[30px] p-16 flex flex-col items-center justify-center gap-4 text-center">
              <Disc size={40} className="text-white/20 animate-spin" style={{ animationDuration: "10s" }} />
              <p className="text-white/40 tracking-widest text-sm">NO SIGNAL RECONSTRUCTED IN DATABASE</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTracks.map((track) => (
                <InteractiveTrackCard
                  key={track.id}
                  track={track}
                  isSelected={currentTrack?.id === track.id}
                  isPlaying={isPlaying}
                  onPlayClick={() => onTrackSelect(track)}
                  isFavorite={favorites.includes(track.id)}
                  onFavoriteClick={() => toggleFavorite(track.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeCategory === "playlists" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLAYLISTS.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="group relative h-64 rounded-[30px] glass-card overflow-hidden p-8 flex flex-col justify-between cursor-pointer hover:border-white/20"
            >
              {/* Blur art backing */}
              <div
                className="absolute right-0 bottom-0 w-80 h-80 rounded-full opacity-5 group-hover:opacity-15 blur-[60px] transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: p.glowColor }}
              />

              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
                  {p.tracksCount} TRANSACTIONS
                </span>
              </div>

              <div>
                <h3 className="font-display font-medium text-xl text-white tracking-widest mb-1 group-hover:text-glow transition-all">
                  {p.name}
                </h3>
                <p className="font-sans text-xs text-white/50 tracking-wide">
                  {p.description}
                </p>
              </div>

              <div className="absolute right-8 bottom-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                <Play size={14} className="fill-white/40 ml-0.5" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeCategory === "artists" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_ARTISTS.map((artist, idx) => (
            <motion.div
              key={artist.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group rounded-[30px] glass-card p-6 flex flex-col items-center text-center gap-5 hover:bg-white/5"
            >
              {/* Radial background grid */}
              <div className="relative w-32 h-32 rounded-full p-[2px] bg-gradient-to-r from-white/10 to-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-500">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-black">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-mono text-[8px] tracking-[0.2em] text-white/40 uppercase bg-white/5 px-2.5 py-1 rounded-full mb-2">
                  {artist.role}
                </span>
                <h3 className="font-display font-medium text-base text-white tracking-wider">
                  {artist.name}
                </h3>
                <p className="font-sans text-xs text-white/50 px-4 mt-2 h-10 leading-relaxed truncate-2-lines">
                  {artist.bio}
                </p>
              </div>

              <div className="w-full border-t border-white/5 pt-4 flex justify-between items-center text-[10px] font-mono tracking-widest text-white/40 px-2">
                <span>FOLLOWERS</span>
                <span className="text-white/80">{artist.followers}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
