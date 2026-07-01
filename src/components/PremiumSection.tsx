import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Zap, Sliders, Eye, Headphones, Sparkles, Star } from "lucide-react";

export default function PremiumSection() {
  const plans = [
    {
      name: "STANDARD FLOW",
      price: "$0",
      period: "forever",
      tagline: "Standard frequency stream",
      glowColor: "rgba(255, 255, 255, 0.03)",
      icon: Headphones,
      cta: "Join Network",
      features: [
        "192kbps Standard Audio Bus",
        "Dual Oscilloscope Visualizer",
        "Standard Synapse Driver Access",
        "General community soundpools",
      ],
      popular: false,
    },
    {
      name: "CHROME COGNITION",
      price: "$15",
      period: "per month",
      tagline: "High-fidelity spatial matrix",
      glowColor: "rgba(255, 255, 255, 0.15)",
      icon: Zap,
      cta: "Activate Chrome",
      features: [
        "960kbps Silver Lossless stream",
        "4x Quantum Stage visualizers",
        "Full Synapse EQ modifiers",
        "Offline encrypted priority storage",
        "8D Spatial Audio expansion",
      ],
      popular: true,
    },
    {
      name: "ALPHA IMMORTAL",
      price: "$49",
      period: "per month",
      tagline: "Ultimate cognitive dome",
      glowColor: "rgba(255, 255, 255, 0.3)",
      icon: Star,
      cta: "Incorporate Alpha",
      features: [
        "Infinite resolution neural audio",
        "Holographic custom VR visualizers",
        "Alpha Binaural wave customization",
        "24/7 dedicated soundscape engineers",
        "VIP physical venue soundpool links",
      ],
      popular: false,
    },
  ];

  return (
    <section id="premium-section" className="relative w-full py-28 px-4 md:px-8 max-w-7xl mx-auto z-10">
      {/* Decorative center orb glow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[70%] h-[350px] bg-gradient-to-r from-white/3 to-transparent rounded-full blur-[140px] pointer-events-none -z-1" />

      {/* SECTION HEADER */}
      <div className="flex flex-col gap-2 mb-20 text-center items-center">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-white/40 tracking-[0.3em] uppercase">04 / Absolute Exclusivity</span>
          <Star size={12} className="text-white/40 animate-pulse" />
        </div>
        <h2 className="font-display font-light text-3xl md:text-4xl text-white tracking-[0.15em] uppercase">
          ACCESS THE ALPHA DOME
        </h2>
        <div className="h-[1px] w-24 bg-white/20 mt-2" />
        <p className="font-sans text-xs text-white/40 max-w-md leading-relaxed mt-4">
          Incorporate the Alpha Protocol. Transcend standard music streaming bitrates and unlock the full limits of human acoustic perception.
        </p>
      </div>

      {/* PLANS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-[30px] p-8 flex flex-col justify-between cursor-pointer select-none transition-all duration-300 ${
                plan.popular
                  ? "glass-panel border-white/25 bg-white/[0.03] scale-102 shadow-[0_30px_70px_rgba(255,255,255,0.05)] md:-translate-y-2"
                  : "glass-card hover:border-white/20"
              }`}
            >
              {/* Backing Ambient Blur glow */}
              <div
                className="absolute inset-10 rounded-full blur-[40px] opacity-10 pointer-events-none -z-1"
                style={{
                  background: `radial-gradient(circle, ${plan.popular ? '#ffffff' : 'rgba(255,255,255,0.4)'} 0%, transparent 70%)`,
                }}
              />

              {/* Card top banner with tag */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[8px] tracking-[0.2em] text-white/40 uppercase">
                    PROTOCOL PLAN
                  </span>
                  <h3 className="font-display font-medium text-sm text-white tracking-widest leading-none">
                    {plan.name}
                  </h3>
                </div>

                {/* Plan Icon */}
                <div className={`p-2.5 rounded-xl border border-white/10 ${plan.popular ? "bg-white text-black" : "bg-white/5 text-white/70"}`}>
                  <Icon size={14} />
                </div>
              </div>

              {/* Pricing row */}
              <div className="my-8 flex items-baseline gap-2">
                <span className="font-display font-light text-5xl text-white tracking-tight text-glow">
                  {plan.price}
                </span>
                <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">
                  / {plan.period}
                </span>
              </div>

              {/* Bullet point features */}
              <div className="flex flex-col gap-4 border-t border-white/5 pt-6 mb-8 flex-grow">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/45 flex-shrink-0 shadow-[0_0_4px_white]" />
                    <span className="font-sans text-xs text-white/60 font-light leading-none">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-3 px-6 rounded-2xl text-[10px] font-mono tracking-[0.2em] font-medium transition-all duration-300 cursor-pointer text-center border ${
                  plan.popular
                    ? "bg-white text-black border-white hover:bg-black hover:text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    : "bg-white/5 border-white/10 text-white hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                }`}
              >
                {plan.cta.toUpperCase()}
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
