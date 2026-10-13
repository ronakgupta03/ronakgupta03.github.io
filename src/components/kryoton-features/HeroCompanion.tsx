"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./HeroCompanion.module.scss";
import { dotsStore } from "./dotsState";

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "text";
}

export const HeroCompanion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const updateTheme = () => {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(cur === "light" ? "light" : "dark");
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Discover hero surfaces (words, buttons)
    const scanPlatforms = (): Platform[] => {
      if (!container) return [];
      const cRect = container.getBoundingClientRect();
      const targets: Platform[] = [];

      const elements = container.parentElement?.querySelectorAll("h1, h2, p, button, a") || [];
      elements.forEach((el) => {
        if (el.closest('[class*="companionOverlay"]') || el.closest('[class*="dockContainer"]')) return;
        const r = el.getBoundingClientRect();
        if (r.width > 35 && r.height > 15) {
          targets.push({
            x: r.left - cRect.left,
            y: r.top - cRect.top,
            width: r.width,
            height: r.height,
            type: "text",
          });
        }
      });

      return targets.length > 0
        ? targets
        : [
            { x: 30, y: 80, width: 340, height: 40, type: "text" },
            { x: 30, y: 160, width: 440, height: 60, type: "text" },
            { x: 30, y: 260, width: 380, height: 50, type: "text" },
          ];
    };

    let textPlatforms = scanPlatforms();

    // ==========================================
    // LIZARD (GECKO) STATE - DARK THEME ONLY
    // ==========================================
    let lizard = {
      x: 160,
      y: 110,
      angle: 0,
      targetAngle: 0,
      speed: 0.65, // Slow, deliberate crawl
      walkCycle: 0,
      isHunting: false,
      tongue: {
        active: false,
        length: 0,
        maxLength: 0,
        targetX: 0,
        targetY: 0,
        dotIndex: -1,
        holdFrames: 0,
        retracting: false,
      },
      currentPlatformIdx: 0,
      platformT: 0.2,
      patrolDir: 1,
      pauseTimer: 0,
    };

    let frameCount = 0;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      frameCount++;

      ctx.clearRect(0, 0, width, height);

      // Only run in Dark Theme. In Light Theme, do not render any creature.
      if (theme !== "dark") {
        return;
      }

      if (frameCount % 60 === 0) {
        textPlatforms = scanPlatforms();
      }

      const bgNodes = dotsStore.dots;
      const cRect = container.getBoundingClientRect();

      // 1. Check if a background dot is in tongue range (~135px)
      if (!lizard.tongue.active) {
        let closestDist = Infinity;
        let bestIdx = -1;
        let targetDotX = 0;
        let targetDotY = 0;

        bgNodes.forEach((node, i) => {
          const dotLocalX = node.x - cRect.left;
          const dotLocalY = node.y - cRect.top;

          const dx = dotLocalX - lizard.x;
          const dy = dotLocalY - lizard.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 135 && dist < closestDist) {
            closestDist = dist;
            bestIdx = i;
            targetDotX = dotLocalX;
            targetDotY = dotLocalY;
          }
        });

        if (bestIdx !== -1) {
          lizard.isHunting = true;
          lizard.targetAngle = Math.atan2(targetDotY - lizard.y, targetDotX - lizard.x);
          lizard.tongue = {
            active: true,
            length: 0,
            maxLength: closestDist,
            targetX: targetDotX,
            targetY: targetDotY,
            dotIndex: bestIdx,
            holdFrames: 4, // Brief pause at target dot
            retracting: false,
          };
        } else {
          lizard.isHunting = false;
        }
      }

      // 2. Tongue Strike & Dot Consumption
      if (lizard.tongue.active) {
        const t = lizard.tongue;
        const tongueSpeed = 10;

        if (!t.retracting) {
          t.length += tongueSpeed;
          if (t.length >= t.maxLength) {
            t.length = t.maxLength;
            if (t.holdFrames > 0) {
              t.holdFrames--;
            } else {
              t.retracting = true;
              if (t.dotIndex !== -1) {
                dotsStore.removeDot(t.dotIndex);
              }
            }
          }
        } else {
          t.length -= tongueSpeed;
          if (t.length <= 0) {
            t.active = false;
            lizard.isHunting = false;
            lizard.pauseTimer = 35;
          }
        }

        // Draw tongue
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(lizard.x + Math.cos(lizard.angle) * 11, lizard.y + Math.sin(lizard.angle) * 11);
        const tipX = lizard.x + Math.cos(lizard.angle) * (11 + t.length);
        const tipY = lizard.y + Math.sin(lizard.angle) * (11 + t.length);
        ctx.lineTo(tipX, tipY);
        ctx.strokeStyle = "#f43f5e";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(tipX, tipY, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#fb7185";
        ctx.fill();
        ctx.restore();
      }

      // 3. Stalking crawl along word surfaces
      if (!lizard.isHunting && textPlatforms.length > 0) {
        const p = textPlatforms[lizard.currentPlatformIdx % textPlatforms.length];

        if (lizard.pauseTimer > 0) {
          lizard.pauseTimer--;
        } else {
          lizard.platformT += 0.0025 * lizard.patrolDir;
          lizard.walkCycle += 0.09;

          if (lizard.platformT > 1 || lizard.platformT < 0) {
            lizard.patrolDir *= -1;
            lizard.pauseTimer = Math.floor(Math.random() * 60 + 30);

            if (Math.random() < 0.35) {
              lizard.currentPlatformIdx = Math.floor(Math.random() * textPlatforms.length);
              lizard.platformT = 0.5;
            }
          }

          const targetX = p.x + p.width * Math.max(0, Math.min(1, lizard.platformT));
          const targetY = p.y - 3;

          const dx = targetX - lizard.x;
          const dy = targetY - lizard.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 2) {
            lizard.targetAngle = Math.atan2(dy, dx);
            lizard.x += (dx / dist) * lizard.speed;
            lizard.y += (dy / dist) * lizard.speed;
          }
        }
      }

      // Smooth angle interpolation
      let angleDiff = lizard.targetAngle - lizard.angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      lizard.angle += angleDiff * 0.1;

      // 4. Draw Animated Cyber Gecko
      ctx.save();
      ctx.translate(lizard.x, lizard.y);
      ctx.rotate(lizard.angle);

      const geckoColor = "#10b981";
      const darkGecko = "#047857";
      const eyeColor = "#38bdf8";

      // Tail
      const tailSway = Math.sin(lizard.walkCycle * 0.8) * 0.22;
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.quadraticCurveTo(-18 + tailSway * 5, tailSway * 8, -26 + tailSway * 10, tailSway * 12);
      ctx.strokeStyle = geckoColor;
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.stroke();

      // 4 Articulated legs
      const legOffsets = [
        { x: 6, y: -7, phase: 0 },
        { x: 6, y: 7, phase: Math.PI },
        { x: -6, y: -7, phase: Math.PI },
        { x: -6, y: 7, phase: 0 },
      ];

      legOffsets.forEach((leg) => {
        const step = Math.sin(lizard.walkCycle + leg.phase) * 4;
        ctx.beginPath();
        ctx.moveTo(leg.x, leg.y > 0 ? 3 : -3);
        ctx.lineTo(leg.x + step, leg.y * 1.4);
        ctx.strokeStyle = darkGecko;
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(leg.x + step, leg.y * 1.4, 2, 0, Math.PI * 2);
        ctx.fillStyle = geckoColor;
        ctx.fill();
      });

      // Torso
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = geckoColor;
      ctx.fill();
      ctx.strokeStyle = darkGecko;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.ellipse(11, 0, 6, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = geckoColor;
      ctx.fill();

      // Glowing Eyes
      ctx.beginPath();
      ctx.arc(12, -3.5, 2, 0, Math.PI * 2);
      ctx.arc(12, 3.5, 2, 0, Math.PI * 2);
      ctx.fillStyle = eyeColor;
      ctx.fill();

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  if (theme !== "dark") {
    return null;
  }

  return (
    <div ref={containerRef} className={styles.companionOverlay} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.companionCanvas} />
    </div>
  );
};
