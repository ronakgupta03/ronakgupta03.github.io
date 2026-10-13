"use client";

import React, { useState, useRef, MouseEvent } from "react";
import styles from "./BusinessCard3D.module.scss";

export const BusinessCard3D: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [transformStyle, setTransformStyle] = useState("");
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * 2; // -1 to 1
    const yPct = (mouseY / height - 0.5) * 2; // -1 to 1

    const rotX = -yPct * 14 * (isFlipped ? -1 : 1);
    const rotY = xPct * 16;

    setTransformStyle(`scale3d(1.04, 1.04, 1.04) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`);
    setGlarePosition({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle("scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)");
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.badgeHeader}>
        <span className={styles.terminalDot} />
        <span className={styles.badgeLabel}>INTERACTIVE 3D BUSINESS CARD</span>
        <span className={styles.clickHint}>[ Click card to flip ]</span>
      </div>

      <div
        ref={containerRef}
        className={styles.container}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleFlip}
        role="button"
        tabIndex={0}
        aria-label="3D Business card of Ronak Gupta. Click to flip."
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleFlip();
          }
        }}
      >
        <div
          className={styles.tiltLayer}
          style={{
            transform: transformStyle,
            transition: transformStyle.includes("rotateX(0deg)")
              ? "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)"
              : "transform 0.1s ease-out",
          }}
        >
          <div className={`${styles.flipWrapper} ${isFlipped ? styles.flipped : ""}`}>
            {/* Front Side */}
            <div className={`${styles.face} ${styles.front} ${isFlipped ? styles.inactiveFace : ""}`}>
              <div
                className={styles.glare}
                style={{
                  background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}), transparent 60%)`,
                }}
              />
              <div className={styles.cardHeader}>
                <div className={styles.codeSnippet}>const engineer = &quot;Ronak Gupta&quot;;</div>
                <div className={styles.chipTag}>CSE &middot; 2024&ndash;28</div>
              </div>

              <div className={styles.cardMain}>
                <h3 className={styles.name}>Ronak Gupta</h3>
                <p className={styles.title}>Systems &middot; AI/ML &middot; Algorithms</p>
                <div className={styles.college}>Vivekananda Institute of Professional Studies (VIPS-TC)</div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.handle}>@ronakgupta03</div>
                <div className={styles.indicator}>
                  <span className={styles.flipIcon}>&#8634;</span> FLIP ME
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div className={`${styles.face} ${styles.back} ${!isFlipped ? styles.inactiveFace : ""}`}>
              <div
                className={styles.glare}
                style={{
                  background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}), transparent 60%)`,
                }}
              />
              <div className={styles.backHeader}>
                <span className={styles.backTitle}>GET IN TOUCH</span>
                <span className={styles.statusLive}>&#9679; Available for Internships</span>
              </div>

              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>EMAIL</span>
                  <a
                    href="mailto:ronakgupta3305@gmail.com"
                    className={styles.contactVal}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    ronakgupta3305@gmail.com
                  </a>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>LINKEDIN</span>
                  <a
                    href="https://www.linkedin.com/in/ronak-gupta-760563215/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactVal}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    in/ronak-gupta-760563215
                  </a>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>GITHUB</span>
                  <a
                    href="https://github.com/ronakgupta03"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactVal}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    github.com/ronakgupta03
                  </a>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>CODEFORCES</span>
                  <a
                    href="https://codeforces.com/profile/the.ronak.gupta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactVal}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    the.ronak.gupta (1193 max &middot; 248+ solved)
                  </a>
                </div>
              </div>

              <div className={styles.backFooter}>
                <span>New Delhi, India</span>
                <span className={styles.flipBackHint}>[ Click to flip front ]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
