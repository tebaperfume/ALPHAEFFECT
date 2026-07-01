/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Compass, ArrowDown, Sparkles, Volume2, Shield } from "lucide-react";
import { Track, SoundEngineState } from "./types";
import { TRACKS } from "./data";

// Import custom sub-modules
import ParticleCanvas from "./components/ParticleCanvas";
import Navbar from "./components/Navbar";
import AlphaLogo from "./components/AlphaLogo";
import DiscoverSection from "./components/DiscoverSection";
import SoundEngine from "./components/SoundEngine";
import VisualizerStage from "./components/VisualizerStage";
import PremiumSection from "./components/PremiumSection";
import MusicPlayer from "./components/MusicPlayer";

const initialEngineState: SoundEngineState = {
  spatialAudio: false,
  alphaBoost: false,
  bassOverdrive: false,
  reverb: 20,
  equalizer: [
    { frequency: "32Hz", value: 0 },
    { frequency: "64Hz", value: 0 },
    { frequency: "250Hz", value: 0 },
    { frequency: "500Hz", value: 0 },
    { frequency: "2kHz", value: 0 },
    { frequency: "8kHz", value: 0 },
    { frequency: "16kHz", value: 0 },
  ],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(["track-1", "track-3"]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [engineState, setEngineState] = useState<SoundEngineState>(initialEngineState);

  // Toggle favorites helper
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Skip tracks helper
  const handleNext = () => {
    if (!currentTrack) return;
    const idx = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % TRACKS.length;
    setCurrentTrack(TRACKS[nextIdx]);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!currentTrack) return;
    const idx = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = idx === 0 ? TRACKS.length - 1 : idx - 1;
    setCurrentTrack(TRACKS[prevIdx]);
    setIsPlaying(true);
  };

  // Page Scroll Highlights
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "discover", "engine", "visualizer", "premium"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(`${section}-section`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartListening = () => {
    setIsPlaying(true);
    // Scroll smoothly to player visualizer stage
    const el = document.getElementById("visualizer-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleExploreLibrary = () => {
    const el = document.getElementById("discover-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-white selection:text-black">
      {/* 1. HIGH-PERFORMANCE INTERACTIVE CANVASES (BACKGROUND) */}
      <ParticleCanvas />

      {/* 2. GLASS NAVIGATION BAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchChange={setSearchFilter}
      />

      {/* 3. HERO SECTION (FULLSCREEN CINEMATIC HUB) */}
      <section
        id="home-section"
        className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 pt-16 relative overflow-hidden"
      >
        {/* Ambient background rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-white/[0.035] to-transparent rounded-full blur-[120px] pointer-events-none -z-1 animate-pulse" />

        {/* Center alignment card stage */}
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center mt-6">
          {/* Animated 3D rotating emblem exactly in center */}
          <div className="mb-8 relative">
            <AlphaLogo isPlaying={isPlaying} scale={1.0} />
          </div>

          {/* Headline and Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h2 className="font-display font-light text-4xl sm:text-6xl md:text-7xl tracking-[0.15em] uppercase text-white leading-none pl-[0.15em]">
              THE FUTURE OF{" "}
              <span className="chrome-shimmer font-medium select-none text-glow-strong">
                MUSIC
              </span>
            </h2>

            <p className="font-sans font-light text-xs sm:text-sm tracking-[0.3em] uppercase text-white/50 max-w-xl mt-6 leading-relaxed px-4">
              Experience sound waves in a completely new cybernetic dimension.
            </p>
          </motion.div>

          {/* PREMIUM CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-6"
            id="hero-cta-group"
          >
            {/* ▶ START LISTENING */}
            <button
              onClick={handleStartListening}
              className="relative px-8 py-4 rounded-full font-mono text-[10px] tracking-[0.25em] font-medium text-black bg-white border border-white uppercase flex items-center gap-3 shadow-[0_15px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_20px_45px_rgba(255,255,255,0.35)] hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <Play size={10} className="fill-black ml-0.5" />
              <span>START LISTENING</span>
              {/* Internal shiny reflection glint */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            </button>

            {/* ♪ EXPLORE LIBRARY */}
            <button
              onClick={handleExploreLibrary}
              className="px-8 py-4 rounded-full font-mono text-[10px] tracking-[0.25em] font-medium text-white/80 hover:text-white border border-white/15 bg-white/5 backdrop-blur-md uppercase flex items-center gap-3 hover:bg-white/[0.08] hover:border-white/35 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 cursor-pointer relative group"
            >
              <Compass size={11} className="opacity-80 group-hover:rotate-45 transition-transform duration-500" />
              <span>EXPLORE LIBRARY</span>
            </button>
          </motion.div>
        </div>

        {/* Scroll pointer helper at bottom margin */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-40 hover:opacity-100 transition-opacity duration-300"
          onClick={handleExploreLibrary}
        >
          <span className="font-mono text-[8px] tracking-[0.25em] uppercase text-white/50 pl-[0.25em]">
            SCROLL DOWN
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-white"
          >
            <ArrowDown size={12} />
          </motion.div>
        </div>
      </section>

      {/* 4. DISCOVER LIBRARY GRID */}
      <DiscoverSection
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTrackSelect={(track) => {
          setCurrentTrack(track);
          setIsPlaying(true);
        }}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        searchFilter={searchFilter}
      />

      {/* 5. AUDIO SYNTH EQUALIZER BUS */}
      <SoundEngine
        engineState={engineState}
        setEngineState={setEngineState}
      />

      {/* 6. IMMERSIVE VISUALIZER CANVAS */}
      <VisualizerStage
        currentTrack={currentTrack}
        isPlaying={isPlaying}
      />

      {/* 7. PREMIUM PLAN CORNER */}
      <PremiumSection />

      {/* 8. LUXURIOUS CRAFTED FOOTER */}
      <footer className="relative w-full border-t border-white/5 py-12 px-4 md:px-8 max-w-7xl mx-auto z-10 text-center flex flex-col sm:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-90 transition-opacity duration-500 mb-32">
        <span className="font-mono text-[9px] tracking-[0.2em] text-white/50">
          © {new Date().getFullYear()} THE ALPHA EFFECT. ALL FREQUENCIES RESERVED.
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] tracking-[0.15em] text-white/40 uppercase">
            DESIGNED IN COGNITIVE COLD CHROME
          </span>
          <Sparkles size={10} className="text-white/40" />
        </div>
      </footer>

      {/* 9. FLOATING BOTTOM CONTROLS & LYRICS DRAWER */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={handleNext}
        onPrev={handlePrev}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}
