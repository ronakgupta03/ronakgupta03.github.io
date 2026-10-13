"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./TextScramble.module.scss";

interface TextScrambleProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "div";
  prefix?: string;
  speed?: number;
  hoverTrigger?: boolean;
}

const GLYPHS = "!<>-_\\/[]{}—=+*^?#________010101";

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = "",
  as: Tag = "span",
  prefix = "> ",
  speed = 1,
  hoverTrigger = true,
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const containerRef = useRef<any>(null);
  const frameRef = useRef<number | null>(null);

  const startScramble = useCallback(() => {
    let frame = 0;
    const totalFrames = Math.max(15, Math.floor(text.length * 2.5 * (1 / speed)));
    setIsScrambling(true);

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const revealedLength = Math.floor(progress * text.length);

      let scrambled = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealedLength) {
          scrambled += text[i];
        } else if (text[i] === " ") {
          scrambled += " ";
        } else {
          scrambled += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplayText(scrambled);

      if (frame < totalFrames) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        setIsScrambling(false);
      }
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);
  }, [text, speed]);

  useEffect(() => {
    // Trigger on intersection with viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startScramble();
          }
        });
      },
      { threshold: 0.15 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [startScramble]);

  const handleMouseEnter = () => {
    if (hoverTrigger && !isScrambling) {
      startScramble();
    }
  };

  return (
    // @ts-ignore
    <Tag
      ref={containerRef}
      className={`${styles.scrambleWrapper} ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {prefix && <span className={styles.prefix}>{prefix}</span>}
      <span className={styles.scrambleText}>{displayText}</span>
      {isScrambling && <span className={styles.cursor}>_</span>}
    </Tag>
  );
};
