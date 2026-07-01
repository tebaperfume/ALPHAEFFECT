import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import localLogoImg from "../assets/images/alpha_logo_whatsapp_final.jpg";

// Use the direct absolute CDN URL provided by the user for perfect iframe compatibility
const logoImg = "https://i.ibb.co/xq1MRnQ6/Whats-App-Image-2026-06-28-at-7-15-37-PM.jpg";

interface AlphaLogoProps {
  isPlaying?: boolean;
  scale?: number;
}

export default function AlphaLogo({ isPlaying = false, scale = 1.0 }: AlphaLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string>(logoImg);

  // Motion values for magnetic 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs to avoid jerky movements
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-150, 150], [15, -15]), springConfig);
  const rotateYSpring = useSpring(useTransform(x, [-150, 150], [-15, 15]), springConfig);

  // Continuous gentle oscillation offset when not hovered
  const [autoRotateY, setAutoRotateY] = useState(0);

  useEffect(() => {
    let animFrame: number;
    const start = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - start) / 1000;
      // Oscillate between -5 and +5 degrees over a 6 second period
      setAutoRotateY(Math.sin(elapsed * (2 * Math.PI / 6)) * 5);
      animFrame = requestAnimationFrame(tick);
    };
    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Track cursor position inside container relative to center
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.clientX;
    const clientY = e.clientY;

    x.set(clientX - centerX);
    y.set(clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Combine continuous rotation with mouse-tilt spring
  const combinedRotateY = useTransform(rotateYSpring, (val) => {
    // When hovered, blend mouse-tilt. Otherwise, do continuous slow spinning
    return isHovered ? val : autoRotateY;
  });

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center select-none cursor-pointer"
      style={{ perspective: 1200 }}
      id="alpha-logo-3d-stage"
    >
      {/* Glow Ambient backing shadow */}
      <motion.div
        className="absolute rounded-full pointer-events-none mix-blend-screen"
        style={{
          width: 380 * scale,
          height: 380 * scale,
          background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{
          scale: isPlaying ? [1, 1.1, 1] : [1, 1.02, 1],
          opacity: isPlaying ? [0.5, 0.8, 0.5] : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: isPlaying ? 2.5 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3D Rotatable Logo Core */}
      <motion.div
        style={{
          rotateX: rotateX,
          rotateY: combinedRotateY,
          scale: scale,
          transformStyle: "preserve-3d",
        }}
        className="relative flex flex-col items-center justify-center animate-float"
        id="alpha-logo-mesh"
      >
        {/* Set explicit width to avoid flex collapsing in some layouts */}
        <div className="relative w-[280px] sm:w-[320px] md:w-[380px] aspect-square flex items-center justify-center rounded-2xl overflow-hidden border border-white/5 bg-black/10 shadow-2xl">
          <img
            src={imgSrc}
            alt="The Alpha Effect"
            className="w-full h-full object-contain select-none pointer-events-none rounded-2xl transition-all duration-300"
            referrerPolicy="no-referrer"
            onError={() => {
              // Fallback to local imported image if the CDN URL fails
              if (imgSrc !== localLogoImg) {
                setImgSrc(localLogoImg);
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
