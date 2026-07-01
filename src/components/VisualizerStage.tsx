import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Maximize2, Sparkles, Tv, ShieldAlert, Cpu } from "lucide-react";
import { VisualizerMode, Track } from "../types";

interface VisualizerStageProps {
  currentTrack: Track | null;
  isPlaying: boolean;
}

export default function VisualizerStage({ currentTrack, isPlaying }: VisualizerStageProps) {
  const [mode, setMode] = useState<VisualizerMode>("soundwave");
  const [blurIntensity, setBlurIntensity] = useState<number>(15);
  const [scaleFactor, setScaleFactor] = useState<number>(1.2);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep a running float representing the continuous beat timing
  const beatRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 420);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = 420;
    };
    window.addEventListener("resize", handleResize);

    // Dynamic wave nodes variables
    let angle = 0;
    let particles: { x: number; y: number; angle: number; speed: number; size: number; color: string }[] = [];

    // Pre-populate particles for Nebula/Pulse
    const populateParticles = () => {
      particles = [];
      const count = 150;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 1.5 + 0.5,
          size: Math.random() * 2 + 0.5,
          color: `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`,
        });
      }
    };
    populateParticles();

    let animationFrameId: number;

    const draw = () => {
      // Base variables based on track properties
      // If playing, pump up the speed and visual scaling
      const baseEnergy = isPlaying ? (currentTrack?.energy || 75) / 100 : 0.15;
      const bpmSpeed = isPlaying ? (currentTrack?.bpm || 120) / 450 : 0.1;

      beatRef.current += bpmSpeed * scaleFactor;

      ctx.fillStyle = "rgba(5, 5, 5, 0.12)"; // Ghosting/Blur tail trail effect
      ctx.fillRect(0, 0, width, height);

      // Render specific modes
      if (mode === "soundwave") {
        // DUAL CHROME OSCILLOSCOPE
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;

        // Draw dynamic symmetric waveform
        ctx.beginPath();
        const amplitude = 35 * baseEnergy;
        const cycles = 4;

        for (let x = 0; x < width; x++) {
          const progress = x / width;
          // Apply a sine envelope to pinch ends
          const envelope = Math.sin(progress * Math.PI);
          const y =
            height / 2 +
            Math.sin(progress * Math.PI * 2 * cycles + beatRef.current) * amplitude * envelope +
            Math.cos(progress * Math.PI * 4 + beatRef.current * 1.5) * (amplitude * 0.4) * envelope;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Mirrored bottom line
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        for (let x = 0; x < width; x++) {
          const progress = x / width;
          const envelope = Math.sin(progress * Math.PI);
          const y =
            height / 2 -
            Math.sin(progress * Math.PI * 2.5 * cycles - beatRef.current * 0.8) * amplitude * 0.7 * envelope;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (mode === "quantum_pulse") {
        // EXPANDING GRAVITIONAL QUANTUM RINGS
        const centerX = width / 2;
        const centerY = height / 2;

        const ringsCount = 4;
        for (let r = 0; r < ringsCount; r++) {
          // Calculate expanding radius
          const radiusProgress = ((beatRef.current * 8 + r * (300 / ringsCount)) % 300) * scaleFactor;
          const ringOpacity = Math.max(0, 1 - radiusProgress / 300) * 0.4 * baseEnergy;

          ctx.beginPath();
          ctx.arc(centerX, centerY, radiusProgress, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${ringOpacity})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Highlight spikes on the ring
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(beatRef.current * 0.15 + r);
          for (let sp = 0; sp < 8; sp++) {
            const rotAngle = (sp * Math.PI) / 4;
            const sX = (radiusProgress - 6) * Math.cos(rotAngle);
            const sY = (radiusProgress - 6) * Math.sin(rotAngle);
            ctx.beginPath();
            ctx.arc(sX, sY, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${ringOpacity * 1.5})`;
            ctx.fill();
          }
          ctx.restore();
        }

        // Concentric Core Node
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20 + baseEnergy * 15, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.stroke();
      } else if (mode === "nebula_fluid") {
        // SWIRLING STARDUST FLUID
        const centerX = width / 2;
        const centerY = height / 2;

        particles.forEach((p, idx) => {
          // Particles rotate around center core
          p.angle += (p.speed * 0.004 + baseEnergy * 0.01) * scaleFactor;
          const orbitRadius = (idx * 2) % (width / 2.2);

          p.x = centerX + Math.cos(p.angle) * orbitRadius;
          p.y = centerY + Math.sin(p.angle) * orbitRadius;

          // React to beat by pulsing particle size
          const pSize = p.size * (1 + baseEnergy * 1.2);

          ctx.beginPath();
          ctx.arc(p.x, p.y, pSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, baseEnergy * 0.5)})`;
          ctx.fill();
        });
      } else if (mode === "hyperdrive") {
        // WARPING HYPERDRIVE SPEED LINES
        const centerX = width / 2;
        const centerY = height / 2;

        // Draw streaking stars flying towards viewer
        particles.forEach((p, idx) => {
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Push outwards
          const warpForce = (1.5 + baseEnergy * 6) * scaleFactor;
          p.x += (dx / dist) * warpForce;
          p.y += (dy / dist) * warpForce;

          // Draw a line segment representing velocity smear
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - (dx / dist) * (4 + baseEnergy * 18), p.y - (dy / dist) * (4 + baseEnergy * 18));
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.6, dist / 250)})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Reset if fly off-screen
          if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            p.x = centerX + (Math.random() - 0.5) * 50;
            p.y = centerY + (Math.random() - 0.5) * 50;
          }
        });
      }

      // 5. Draw futuristic target frames & readouts in screen corners (Apple/Linear luxury HUD)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1.0;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Top corner framing
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      // TL
      ctx.moveTo(8, 20); ctx.lineTo(8, 8); ctx.lineTo(20, 8);
      // TR
      ctx.moveTo(width - 8, 20); ctx.lineTo(width - 8, 8); ctx.lineTo(width - 20, 8);
      // BL
      ctx.moveTo(8, height - 20); ctx.lineTo(8, height - 8); ctx.lineTo(20, height - 8);
      // BR
      ctx.moveTo(width - 8, height - 20); ctx.lineTo(width - 8, height - 8); ctx.lineTo(width - 20, height - 8);
      ctx.stroke();

      // Display live numerical readings on bottom margins
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText(`DB_FS: -${(15 - baseEnergy * 15).toFixed(1)} dB`, 20, height - 22);
      ctx.fillText(`HZ_SCALE: ${(100 + baseEnergy * 1500).toFixed(0)} Hz`, width - 130, height - 22);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, isPlaying, currentTrack, blurIntensity, scaleFactor]);

  return (
    <section id="visualizer-section" className="relative w-full py-28 px-4 md:px-8 max-w-7xl mx-auto z-10">
      {/* SECTION HEADER */}
      <div className="flex flex-col gap-2 mb-16">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-white/40 tracking-[0.3em] uppercase">03 / Synesthesia Theater</span>
          <Tv size={12} className="text-white/40" />
        </div>
        <h2 className="font-display font-light text-3xl md:text-4xl text-white tracking-[0.15em] uppercase">
          QUANTUM VISUALIZER STAGE
        </h2>
        <div className="h-[1px] w-24 bg-white/20 mt-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* MAIN CINEMATIC SCREEN STAGE (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <div
            className="w-full rounded-[30px] glass-panel-heavy p-4 border border-white/12 shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative overflow-hidden"
            id="cinema-screen"
          >
            {/* Top glass reflection gradient */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.035] to-transparent pointer-events-none z-10" />

            <canvas
              ref={canvasRef}
              className="w-full h-[420px] rounded-[22px] bg-[#030303] block"
              style={{
                filter: `blur(${isPlaying ? 0 : 0.8}px)`,
                transition: "filter 0.5s",
              }}
            />
          </div>
        </div>

        {/* CONTROLS & HUD SUMMARY (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-[30px] p-8 flex flex-col justify-between h-full relative overflow-hidden">
            {/* Ambient light bulb behind */}
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/[0.015] rounded-full blur-2xl pointer-events-none" />

            {/* Title / Description */}
            <div className="flex flex-col gap-4 mb-6">
              <span className="font-mono text-[9px] tracking-[0.25em] text-white/30 uppercase leading-none">
                STAGE MANAGER
              </span>
              <h3 className="font-display font-medium text-lg text-white tracking-widest leading-none">
                RENDER CONTROL
              </h3>
              <p className="font-sans text-xs text-white/40 leading-relaxed">
                Alter the rendering quantum algorithms of the visual frame. Synthesized waveforms react directly to BPM frequency clocks.
              </p>
            </div>

            {/* SELECTION GRID (4 MODES) */}
            <div className="flex flex-col gap-4 mb-8">
              {(["soundwave", "quantum_pulse", "nebula_fluid", "hyperdrive"] as VisualizerMode[]).map((m) => {
                const isActive = mode === m;
                const labels: Record<VisualizerMode, string> = {
                  soundwave: "Oscilloscope Wave",
                  quantum_pulse: "Quantum Pulse",
                  nebula_fluid: "Nebula Fluid",
                  hyperdrive: "Hyperdrive Warp",
                };
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                      isActive
                        ? "bg-white/10 border-white/25 text-white shadow-[0_0_15px_rgba(255,255,255,0.08)]"
                        : "bg-white/[0.01] border-white/5 text-white/50 hover:text-white"
                    }`}
                  >
                    <span className="font-display text-xs tracking-wider uppercase font-medium">
                      {labels[m]}
                    </span>
                    <span className="font-mono text-[9px] tracking-widest text-white/30">
                      {isActive ? "ACTIVE" : "STANDBY"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* KNOBS/SLIDERS FOR PARTICLES */}
            <div className="flex flex-col gap-6 pt-6 border-t border-white/5">
              {/* Slider 1: Depth of Field */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between font-mono text-[8px] tracking-widest text-white/40">
                  <span>SCALE SENSITIVITY</span>
                  <span className="text-white/80">{scaleFactor.toFixed(1)}X</span>
                </div>
                <div className="relative w-full h-1 bg-white/5 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-full bg-white rounded-full shadow-[0_0_8px_white]"
                    style={{ width: `${((scaleFactor - 0.5) / 1.5) * 100}%` }}
                  />
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scaleFactor}
                    onChange={(e) => setScaleFactor(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                  />
                </div>
              </div>

              {/* Readout Summary */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/5 bg-black/40 text-glow">
                <div className="text-white">
                  <Cpu size={14} className="animate-spin" style={{ animationDuration: "8s" }} />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] text-white/40 tracking-wider">INTELLIGENT SOURCE</span>
                  <span className="font-display text-[10px] text-white font-light tracking-wide truncate max-w-[180px]">
                    {currentTrack ? `${currentTrack.title.toUpperCase()} BUS` : "AMBIENT PROMPT SENSOR"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
