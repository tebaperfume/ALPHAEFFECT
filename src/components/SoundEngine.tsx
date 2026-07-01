import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sliders, Activity, Zap, Shield, Volume2, Globe, Cpu } from "lucide-react";
import { EqualizerBand, SoundEngineState } from "../types";

interface SoundEngineProps {
  engineState: SoundEngineState;
  setEngineState: React.Dispatch<React.SetStateAction<SoundEngineState>>;
}

export default function SoundEngine({ engineState, setEngineState }: SoundEngineProps) {
  const [activePreset, setActivePreset] = useState<string>("flat");

  // Handles updating a specific EQ Band
  const handleEqChange = (index: number, value: number) => {
    setActivePreset("custom");
    setEngineState((prev) => {
      const newEq = [...prev.equalizer];
      newEq[index] = { ...newEq[index], value };
      return { ...prev, equalizer: newEq };
    });
  };

  // Helper to toggle custom enhancers
  const toggleEnhancer = (key: keyof Omit<SoundEngineState, "equalizer" | "reverb">) => {
    setEngineState((prev) => {
      const updated = { ...prev, [key]: !prev[key] };

      // Apply presets based on enhancer configuration
      if (key === "bassOverdrive" && updated[key]) {
        // Boost low frequencies
        updated.equalizer = prev.equalizer.map((band, idx) => {
          if (idx <= 1) return { ...band, value: 9 }; // Boost 32Hz, 64Hz
          return band;
        });
      } else if (key === "bassOverdrive" && !updated[key]) {
        updated.equalizer = prev.equalizer.map((band, idx) => {
          if (idx <= 1) return { ...band, value: 0 };
          return band;
        });
      }

      if (key === "alphaBoost" && updated[key]) {
        // Boost high frequencies for focus
        updated.equalizer = updated.equalizer.map((band, idx) => {
          if (idx >= 5) return { ...band, value: 8 }; // Boost 8kHz, 16kHz
          return band;
        });
        updated.reverb = 75;
      } else if (key === "alphaBoost" && !updated[key]) {
        updated.equalizer = updated.equalizer.map((band, idx) => {
          if (idx >= 5) return { ...band, value: 0 };
          return band;
        });
        updated.reverb = 25;
      }

      return updated;
    });
  };

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    setEngineState((prev) => {
      let newEq = prev.equalizer.map((b) => ({ ...b, value: 0 }));
      let reverb = 25;
      let spatialAudio = prev.spatialAudio;
      let alphaBoost = false;
      let bassOverdrive = false;

      switch (preset) {
        case "flat":
          reverb = 20;
          spatialAudio = false;
          break;
        case "cyberpunk":
          newEq = [
            { frequency: "32Hz", value: 8 },
            { frequency: "64Hz", value: 10 },
            { frequency: "250Hz", value: -2 },
            { frequency: "500Hz", value: -4 },
            { frequency: "2kHz", value: 4 },
            { frequency: "8kHz", value: 6 },
            { frequency: "16Hz", value: 8 },
          ];
          reverb = 45;
          bassOverdrive = true;
          break;
        case "spatial":
          newEq = [
            { frequency: "32Hz", value: 4 },
            { frequency: "64Hz", value: 2 },
            { frequency: "250Hz", value: 0 },
            { frequency: "500Hz", value: 2 },
            { frequency: "2kHz", value: 6 },
            { frequency: "8kHz", value: 8 },
            { frequency: "16Hz", value: 10 },
          ];
          reverb = 85;
          spatialAudio = true;
          break;
        case "neural_focus":
          newEq = [
            { frequency: "32Hz", value: -4 },
            { frequency: "64Hz", value: -2 },
            { frequency: "250Hz", value: 2 },
            { frequency: "500Hz", value: 4 },
            { frequency: "2kHz", value: 0 },
            { frequency: "8kHz", value: 8 },
            { frequency: "16Hz", value: 12 },
          ];
          reverb = 60;
          alphaBoost = true;
          break;
      }

      return {
        equalizer: newEq,
        reverb,
        spatialAudio,
        alphaBoost,
        bassOverdrive,
      };
    });
  };

  // Build the live visual waveform points representing the active EQ bars
  const eqPoints = engineState.equalizer
    .map((band, idx) => {
      const step = 280 / 6;
      const x = 10 + idx * step;
      // Map EQ value (-12 to 12) to Y coordinate (10 to 110, where 60 is center/0dB)
      const y = 60 - (band.value / 12) * 45;
      return `${x},${y}`;
    })
    .join(" L ");

  return (
    <section id="engine-section" className="relative w-full py-28 px-4 md:px-8 max-w-7xl mx-auto z-10">
      {/* SECTION HEADER */}
      <div className="flex flex-col gap-2 mb-16">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-white/40 tracking-[0.3em] uppercase">02 / Synthesizer Core</span>
          <Cpu size={12} className="text-white/40" />
        </div>
        <h2 className="font-display font-light text-3xl md:text-4xl text-white tracking-[0.15em] uppercase">
          ALPHA SOUND ENGINE
        </h2>
        <div className="h-[1px] w-24 bg-white/20 mt-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT BOX: MASTER CYBER CONTROLLERS (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel rounded-[30px] p-8 flex flex-col justify-between h-full relative overflow-hidden">
            {/* Ambient light ring inside */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-white/[0.02] rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col gap-4 mb-8">
              <span className="font-mono text-[9px] tracking-[0.25em] text-white/30 uppercase leading-none">
                ENHANCEMENT CORE
              </span>
              <h3 className="font-display font-medium text-lg text-white tracking-widest leading-none">
                SYNAPSE DRIVERS
              </h3>
              <p className="font-sans text-xs text-white/40 leading-relaxed">
                Inject custom cognitive modifiers and acoustic spatial algorithms directly into the active audio bus.
              </p>
            </div>

            {/* CYBER TOGGLES CONTAINER */}
            <div className="flex flex-col gap-6">
              {/* Toggle 1: 8D Spatial Audio */}
              <div
                onClick={() => toggleEnhancer("spatialAudio")}
                className="group flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/5 cursor-pointer transition-all duration-300 select-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border transition-all ${
                    engineState.spatialAudio ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]" : "bg-white/5 border-white/10 text-white/60"
                  }`}>
                    <Globe size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-xs tracking-wider text-white font-medium group-hover:text-glow transition-all">
                      8D SPATIAL AUDIO
                    </span>
                    <span className="font-sans text-[10px] text-white/30">
                      Immersive 360 sound-field
                    </span>
                  </div>
                </div>

                {/* Cyber glass slider cap */}
                <div className="w-10 h-5 bg-white/5 border border-white/10 rounded-full relative p-0.5">
                  <motion.div
                    className="w-4 h-4 rounded-full bg-white shadow-md"
                    animate={{ x: engineState.spatialAudio ? 18 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                </div>
              </div>

              {/* Toggle 2: Alpha Wave Booster */}
              <div
                onClick={() => toggleEnhancer("alphaBoost")}
                className="group flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/5 cursor-pointer transition-all duration-300 select-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border transition-all ${
                    engineState.alphaBoost ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]" : "bg-white/5 border-white/10 text-white/60"
                  }`}>
                    <Zap size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-xs tracking-wider text-white font-medium group-hover:text-glow transition-all">
                      ALPHA WAVE BOOSTER
                    </span>
                    <span className="font-sans text-[10px] text-white/30">
                      Cognitive focus wave injection
                    </span>
                  </div>
                </div>

                {/* Cyber glass slider cap */}
                <div className="w-10 h-5 bg-white/5 border border-white/10 rounded-full relative p-0.5">
                  <motion.div
                    className="w-4 h-4 rounded-full bg-white shadow-md"
                    animate={{ x: engineState.alphaBoost ? 18 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                </div>
              </div>

              {/* Toggle 3: Sub-Bass Overdrive */}
              <div
                onClick={() => toggleEnhancer("bassOverdrive")}
                className="group flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/5 cursor-pointer transition-all duration-300 select-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border transition-all ${
                    engineState.bassOverdrive ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]" : "bg-white/5 border-white/10 text-white/60"
                  }`}>
                    <Volume2 size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-xs tracking-wider text-white font-medium group-hover:text-glow transition-all">
                      SUB-BASS OVERDRIVE
                    </span>
                    <span className="font-sans text-[10px] text-white/30">
                      Harness 20-60Hz sub-frequencies
                    </span>
                  </div>
                </div>

                {/* Cyber glass slider cap */}
                <div className="w-10 h-5 bg-white/5 border border-white/10 rounded-full relative p-0.5">
                  <motion.div
                    className="w-4 h-4 rounded-full bg-white shadow-md"
                    animate={{ x: engineState.bassOverdrive ? 18 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT BOX: GRAPHIC EQUALIZER MATRIX (7 COLS) */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-[30px] p-8 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] tracking-[0.25em] text-white/30 uppercase">
                  FREQUENCY RESPONSE
                </span>
                <h3 className="font-display font-medium text-lg text-white tracking-widest">
                  GRAPHIC EQUALIZER
                </h3>
              </div>

              {/* Presets List */}
              <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/10 flex-wrap gap-1">
                {["flat", "cyberpunk", "spatial", "neural_focus"].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => applyPreset(preset)}
                    className={`px-3 py-1.5 rounded-full font-mono text-[9px] tracking-wider uppercase transition-all cursor-pointer ${
                      activePreset === preset
                        ? "bg-white text-black border border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {preset.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE WAVEFORM GRAPH DISPLAY */}
            <div className="w-full h-24 border border-white/5 rounded-2xl bg-black/30 mb-8 relative flex items-center justify-center p-4 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_80%)]" />

              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-[0.03]">
                <div className="w-full h-[1px] bg-white" />
                <div className="w-full h-[1px] bg-white" />
                <div className="w-full h-[1px] bg-white" />
              </div>

              {/* Central Dynamic Vector Equalizer Wave */}
              <svg width="300" height="120" viewBox="0 0 300 120" className="w-full h-full text-white/60 overflow-visible">
                {/* 0dB Flat Reference Guide */}
                <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.08)" strokeDasharray="4,4" strokeWidth="1" />

                {/* Animated Gradient Area */}
                <defs>
                  <linearGradient id="eq-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>

                {/* Area path */}
                <path d={`M 10,60 L ${eqPoints} L 290,60 Z`} fill="url(#eq-area-grad)" className="transition-all duration-300" />

                {/* Spline line path */}
                <path d={`M 10,60 L ${eqPoints}`} stroke="url(#nav-logo-grad)" strokeWidth="1.8" fill="none" className="transition-all duration-300" />

                {/* Glowing Nodes on line */}
                {engineState.equalizer.map((band, idx) => {
                  const step = 280 / 6;
                  const x = 10 + idx * step;
                  const y = 60 - (band.value / 12) * 45;
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="#ffffff"
                      className="transition-all duration-300"
                      style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" }}
                    />
                  );
                })}
              </svg>
            </div>

            {/* EQ SLIDERS GRID */}
            <div className="grid grid-cols-7 gap-3 sm:gap-4 items-end justify-items-center">
              {engineState.equalizer.map((band, idx) => (
                <div key={band.frequency} className="flex flex-col items-center gap-4 w-full h-56 group/eq">
                  {/* Slider value bubble on hover */}
                  <span className="font-mono text-[9px] text-white/40 font-light scale-90 group-hover/eq:scale-100 group-hover/eq:text-white transition-all">
                    {band.value > 0 ? `+${band.value}` : band.value}
                  </span>

                  {/* Slider Rail */}
                  <div className="relative w-2.5 h-36 bg-white/5 border border-white/10 rounded-full flex flex-col justify-end p-[1px] relative">
                    {/* Glowing active path backing */}
                    <div
                      className="w-full rounded-full bg-gradient-to-t from-white/20 to-white/70 shadow-[0_0_8px_rgba(255,255,255,0.15)]"
                      style={{ height: `${((band.value + 12) / 24) * 100}%` }}
                    />

                    {/* Standard Invisible Input overlay (vertical slider) */}
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={band.value}
                      onChange={(e) => handleEqChange(idx, Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize"
                      style={{ transform: "rotate(0deg)", writingMode: "bt-lr" }}
                    />
                  </div>

                  {/* Frequency Labels */}
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-[8px] tracking-wider text-white/50 group-hover/eq:text-white transition-colors">
                      {band.frequency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
