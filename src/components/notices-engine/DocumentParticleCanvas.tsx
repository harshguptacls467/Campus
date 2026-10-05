"use client";

import React, { useEffect, useRef } from "react";

export default function DocumentParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 140);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 140;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes flowing from left (document) through center (AI Core) to right (tokens)
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }

    const colors = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#06b6d4"];
    const particles: Particle[] = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * (width * 0.35),
        y: height * 0.2 + Math.random() * (height * 0.6),
        vx: 1.2 + Math.random() * 1.8,
        vy: (Math.random() - 0.5) * 0.6,
        size: 2 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.4 + Math.random() * 0.5,
      });
    }

    const tokens = [
      { text: "DATE", x: width * 0.82, y: height * 0.28, color: "#f59e0b" },
      { text: "ELIGIBILITY", x: width * 0.85, y: height * 0.48, color: "#3b82f6" },
      { text: "FEE", x: width * 0.81, y: height * 0.68, color: "#10b981" },
      { text: "ACTION", x: width * 0.86, y: height * 0.86, color: "#8b5cf6" },
    ];

    let pulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulse += 0.04;

      // Draw faint document glyph on left
      const docX = 40;
      const docY = 25;
      const docW = 60;
      const docH = 85;

      ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillRect(docX, docY, docW, docH);
      ctx.strokeRect(docX, docY, docW, docH);

      // Faint lines on doc
      ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
      for (let l = 0; l < 4; l++) {
        ctx.fillRect(docX + 8, docY + 18 + l * 14, docW - 16, 3);
      }

      // Draw AI Core in Center
      const coreX = width * 0.5;
      const coreY = height * 0.5;
      const coreRadius = 24 + Math.sin(pulse) * 3;

      // Core glow
      const grad = ctx.createRadialGradient(coreX, coreY, 4, coreX, coreY, coreRadius + 16);
      grad.addColorStop(0, "rgba(99, 102, 241, 0.4)");
      grad.addColorStop(1, "rgba(99, 102, 241, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, coreRadius + 16, 0, Math.PI * 2);
      ctx.fill();

      // Core inner orb
      ctx.fillStyle = "#4f46e5";
      ctx.beginPath();
      ctx.arc(coreX, coreY, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("AI", coreX, coreY);

      // Render tokens on right
      tokens.forEach((tok) => {
        tok.x = width * 0.82; // maintain responsive alignment
        ctx.fillStyle = tok.color + "22";
        ctx.strokeStyle = tok.color + "99";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(tok.x - 32, tok.y - 10, 68, 20, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = tok.color;
        ctx.font = "bold 9px monospace";
        ctx.fillText(tok.text, tok.x + 2, tok.y);
      });

      // Update & render flowing particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Attract toward core if before it
        if (p.x < coreX) {
          p.vy += (coreY - p.y) * 0.008;
        } else {
          // Disperse towards tokens
          p.vy += (Math.random() - 0.5) * 0.1;
        }

        // Reset if reached right edge
        if (p.x > width * 0.95) {
          p.x = docX + docW;
          p.y = docY + Math.random() * docH;
          p.vy = (Math.random() - 0.5) * 0.6;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-50 via-indigo-50/50 to-zinc-50 border border-zinc-200/80 p-2 my-2">
      <div className="flex items-center justify-between px-3 pt-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
        <span>Raw Circular Document</span>
        <span className="text-indigo-600 font-bold">Neural Entity Stream</span>
        <span>Extracted Schema</span>
      </div>
      <canvas ref={canvasRef} className="w-full block" />
    </div>
  );
}
