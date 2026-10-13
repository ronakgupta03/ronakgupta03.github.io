"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./InteractiveBackground.module.scss";
import { dotsStore } from "./dotsState";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

interface PulseRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

declare global {
  interface Window {
    __portfolioBg?: {
      getNodes: () => Node[];
      removeNode: (i: number) => void;
    };
  }
}

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const checkTheme = () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(current === "light" ? "light" : "dark");
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    dotsStore.init(width, height);

    const maxDistance = 145;
    const mouseConnectDistance = 175;

    const mouse = { x: -2000, y: -2000, active: false };
    const pulses: PulseRing[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -2000;
      mouse.y = -2000;
    };

    const handleClick = (e: MouseEvent) => {
      pulses.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.min(width, height) * 0.4,
        alpha: 0.7,
      });
      if (pulses.length > 4) pulses.shift();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick);

    const blueprintGlyphs = "+·×÷∼∂∆∇¬∧∨01•";
    const glyphCount = blueprintGlyphs.length;
    const cellSize = 24;

    const renderDark = () => {
      ctx.clearRect(0, 0, width, height);

      const nodeColor = "rgba(96, 165, 250,";
      const lineColor = "rgba(59, 130, 246,";
      const mouseLineColor = "rgba(56, 189, 248,";

      // Draw expanding pulse rings
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += 5.5;
        p.alpha -= 0.012;
        if (p.alpha <= 0 || p.radius >= p.maxRadius) {
          pulses.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${p.alpha * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      const nodes = dotsStore.dots;

      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0) n.x = width;
        else if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        else if (n.y > height) n.y = 0;

        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            n.x += (dx / dist) * force * 1.5;
            n.y += (dy / dist) * force * 1.5;
          }
        }
      }

      // Connect lines
      ctx.lineWidth = 0.75;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18;
            ctx.strokeStyle = `${lineColor} ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        if (mouse.active) {
          const mdx = a.x - mouse.x;
          const mdy = a.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < mouseConnectDistance) {
            const mAlpha = (1 - mDist / mouseConnectDistance) * 0.35;
            ctx.strokeStyle = `${mouseLineColor} ${mAlpha})`;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(a.x, a.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes (dots that lizard hunts)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.fillStyle = `${nodeColor} ${n.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let t = 0;
    const renderLight = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.015;

      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);

      ctx.font = '12px "Geist Mono", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += 5.5;
        p.alpha -= 0.014;
        if (p.alpha <= 0 || p.radius >= p.maxRadius) {
          pulses.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(37, 99, 235, ${p.alpha * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      for (let r = 0; r < rows; r++) {
        const y = r * cellSize + cellSize / 2;

        for (let c = 0; c < cols; c++) {
          const x = c * cellSize + cellSize / 2;

          const wave =
            Math.sin(c * 0.12 + t * 1.2) * Math.cos(r * 0.12 + t * 0.9) +
            Math.sin((c - r) * 0.08 + t * 0.6);

          let mouseDist = 9999;
          if (mouse.active) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            mouseDist = Math.sqrt(dx * dx + dy * dy);
          }

          let proximityBoost = 0;
          if (mouseDist < 140) {
            proximityBoost = (140 - mouseDist) / 140;
          }

          let pulseBoost = 0;
          for (let p = 0; p < pulses.length; p++) {
            const rip = pulses[p];
            const pDist = Math.sqrt((x - rip.x) ** 2 + (y - rip.y) ** 2);
            const diff = Math.abs(pDist - rip.radius);
            if (diff < 35) {
              pulseBoost = Math.max(pulseBoost, (1 - diff / 35) * rip.alpha);
            }
          }

          const combinedVal = Math.abs(wave + proximityBoost * 2.5 + pulseBoost * 3);
          const glyphIdx = Math.floor(combinedVal * 4) % glyphCount;
          const char = blueprintGlyphs[glyphIdx];

          let alpha = 0.06 + Math.abs(wave) * 0.04 + proximityBoost * 0.35 + pulseBoost * 0.3;
          alpha = Math.min(0.55, alpha);

          if (proximityBoost > 0.2 || pulseBoost > 0.15) {
            ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(100, 116, 139, ${alpha})`;
          }

          ctx.fillText(char, x, y);
        }
      }
    };

    const loop = () => {
      animationFrameId = requestAnimationFrame(loop);
      if (theme === "light") {
        renderLight();
      } else {
        renderDark();
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className={styles.canvasBackground} aria-hidden="true" />;
};
