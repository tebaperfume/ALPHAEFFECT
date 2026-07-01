import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  originalX: number;
  originalY: number;
}

interface GlassShape {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  angle: number;
  spin: number;
  opacity: number;
  sides: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse Tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Initialize particles (volumetric glowing embers)
    const particles: Particle[] = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    for (let i = 0; i < particleCount; i++) {
      const pSize = Math.random() * 2.5 + 0.8;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: pSize,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.5 + 0.1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`,
        originalX: 0,
        originalY: 0,
      });
    }

    // Initialize glass floating polygons (3D floating frosted geometric glass planes)
    const glassShapes: GlassShape[] = [];
    const shapeCount = 6;
    for (let i = 0; i < shapeCount; i++) {
      glassShapes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 80 + 40,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.002,
        opacity: Math.random() * 0.04 + 0.02,
        sides: Math.floor(Math.random() * 3) + 3, // triangles, diamonds, pentagons
      });
    }

    // Draw polygon helper
    const drawPolygon = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      sides: number,
      rotation: number
    ) => {
      if (sides < 3) return;
      c.beginPath();
      const angleStep = (Math.PI * 2) / sides;
      c.moveTo(
        x + radius * Math.cos(rotation),
        y + radius * Math.sin(rotation)
      );
      for (let i = 1; i <= sides; i++) {
        c.lineTo(
          x + radius * Math.cos(rotation + i * angleStep),
          y + radius * Math.sin(rotation + i * angleStep)
        );
      }
      c.closePath();
    };

    // Main animation loop
    const render = () => {
      // Smooth mouse easing
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.08;
      m.y += (m.targetY - m.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw elegant dark background with animated radial luxury spots
      const darkGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      darkGrad.addColorStop(0, "#080808");
      darkGrad.addColorStop(1, "#030303");
      ctx.fillStyle = darkGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Animated soft volumetric light rays / glowing nebulae (behind everything)
      const timeSecs = Date.now() * 0.0005;
      const lightX1 = width * 0.3 + Math.sin(timeSecs * 0.5) * 100;
      const lightY1 = height * 0.3 + Math.cos(timeSecs * 0.3) * 100;
      const lightX2 = width * 0.7 + Math.cos(timeSecs * 0.4) * 150;
      const lightY2 = height * 0.7 + Math.sin(timeSecs * 0.6) * 100;

      // Glow 1 (Warm gray / White core)
      const glow1 = ctx.createRadialGradient(lightX1, lightY1, 10, lightX1, lightY1, 350);
      glow1.addColorStop(0, "rgba(255, 255, 255, 0.03)");
      glow1.addColorStop(0.5, "rgba(255, 255, 255, 0.01)");
      glow1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      // Glow 2 (Cool silver core)
      const glow2 = ctx.createRadialGradient(lightX2, lightY2, 10, lightX2, lightY2, 400);
      glow2.addColorStop(0, "rgba(255, 255, 255, 0.025)");
      glow2.addColorStop(0.6, "rgba(255, 255, 255, 0.005)");
      glow2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      // Cursor subtle light halo
      if (m.active) {
        const cursorGlow = ctx.createRadialGradient(m.x, m.y, 5, m.x, m.y, 250);
        cursorGlow.addColorStop(0, "rgba(255, 255, 255, 0.04)");
        cursorGlow.addColorStop(0.5, "rgba(255, 255, 255, 0.01)");
        cursorGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = cursorGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Render and update floating glass objects (frosted 3D planes)
      glassShapes.forEach((shape) => {
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.angle += shape.spin;

        // Wrap around boundaries
        if (shape.x < -shape.size) shape.x = width + shape.size;
        if (shape.x > width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = height + shape.size;
        if (shape.y > height + shape.size) shape.y = -shape.size;

        // Add subtle mouse parallax offset to the shapes
        let drawX = shape.x;
        let drawY = shape.y;
        if (m.active) {
          drawX += (m.x - width / 2) * 0.025;
          drawY += (m.y - height / 2) * 0.025;
        }

        ctx.save();
        // Inner frosted glow
        drawPolygon(ctx, drawX, drawY, shape.size, shape.sides, shape.angle);
        const glassGrad = ctx.createLinearGradient(
          drawX - shape.size,
          drawY - shape.size,
          drawX + shape.size,
          drawY + shape.size
        );
        glassGrad.addColorStop(0, `rgba(255, 255, 255, ${shape.opacity * 1.5})`);
        glassGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.005)");
        glassGrad.addColorStop(1, `rgba(255, 255, 255, ${shape.opacity * 0.3})`);
        ctx.fillStyle = glassGrad;
        ctx.fill();

        // Elegant razor thin stroke reflection
        ctx.strokeStyle = `rgba(255, 255, 255, ${shape.opacity * 3})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Highlight reflections overlay
        const refGrad = ctx.createLinearGradient(
          drawX + shape.size * Math.cos(timeSecs),
          drawY - shape.size * Math.sin(timeSecs),
          drawX - shape.size * Math.cos(timeSecs),
          drawY + shape.size * Math.sin(timeSecs)
        );
        refGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        refGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.08)");
        refGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = refGrad;
        drawPolygon(ctx, drawX, drawY, shape.size, shape.sides, shape.angle);
        ctx.fill();

        ctx.restore();
      });

      // 4. Render and update floating particles (stars)
      particles.forEach((p) => {
        // Simple ambient floating motion
        p.x += p.speedX;
        p.y += p.speedY;

        // Mouse displacement effect
        if (m.active) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            // Push particles away with damping
            const force = (150 - dist) / 150;
            const pushX = (dx / dist) * force * 1.5;
            const pushY = (dy / dist) * force * 1.5;
            p.x -= pushX;
            p.y -= pushY;
          }
        }

        // Screen wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle with gorgeous glow blur using alpha shadow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Draw outer tiny lens-flare glow on a few bigger ones
        if (p.size > 2.0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.15})`;
          ctx.fill();
        }
      });

      // 5. Connecting delicate line mesh (very soft, subtle nodes)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="bg-canvas-container"
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      {/* Dynamic luxury grain texture to look highly professional */}
      <div className="absolute inset-0 grain-overlay opacity-[0.035] pointer-events-none mix-blend-overlay" />
    </div>
  );
}
