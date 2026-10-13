"use client";

import React, { useState, useEffect } from "react";
import styles from "./GitHubActivity.module.scss";
import fallbackContributions from "@/resources/github-contributions.json";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

const LEVEL_COLORS_DARK = [
  "rgba(255, 255, 255, 0.05)",
  "#0e4429",
  "#006d32",
  "#26a641",
  "#39d353",
];

const MONTH_LABELS = [
  { label: "Nov", x: 4 },
  { label: "Dec", x: 45 },
  { label: "Jan", x: 88 },
  { label: "Feb", x: 130 },
  { label: "Mar", x: 172 },
  { label: "Apr", x: 214 },
  { label: "May", x: 256 },
  { label: "Jun", x: 298 },
  { label: "Jul", x: 340 },
  { label: "Aug", x: 382 },
  { label: "Sep", x: 424 },
  { label: "Oct", x: 466 },
];

export const GitHubActivity: React.FC = () => {
  const [contributions, setContributions] = useState<ContributionDay[]>(
    fallbackContributions as ContributionDay[]
  );

  useEffect(() => {
    let isMounted = true;
    const fetchRealData = async () => {
      try {
        const res = await fetch("https://github-contributions-api.jogruber.de/v4/ronakgupta03?y=last");
        if (res.ok) {
          const data = await res.json();
          if (data && data.contributions && data.contributions.length > 0 && isMounted) {
            setContributions(data.contributions);
          }
        }
      } catch (e) {
        // Silently use the loaded fallback JSON
      }
    };
    fetchRealData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Group days into 52 columns of 7 days
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  contributions.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === contributions.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const totalContribs = contributions.reduce((acc, curr) => acc + curr.count, 0);
  const activeDays = contributions.filter((c) => c.count > 0).length;

  return (
    <div className={styles.container}>
      {/* Top Header matching Utsav's Image #1 */}
      <div className={styles.cardTerm}>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.r}`} />
          <span className={`${styles.dot} ${styles.y}`} />
          <span className={`${styles.dot} ${styles.g}`} />
        </div>
        <span className={styles.cardTitle}>github — contribution activity</span>
        <a
          href="https://github.com/ronakgupta03"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardLink}
        >
          profile &#8599;
        </a>
      </div>

      {/* Stats Summary */}
      <div className={styles.heatStats}>
        <span>
          <strong className={styles.statNum}>{totalContribs}</strong> contributions
        </span>
        <span>
          <strong className={styles.statNum}>{activeDays}</strong> active days
        </span>
      </div>

      {/* Responsive SVG Heatmap: fits 100% of card width without horizontal scroll */}
      <div className={styles.heatmapWrapper}>
        <svg
          viewBox="0 0 500 86"
          className={styles.heatmapSvg}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="GitHub contribution activity heatmap"
        >
          {/* Month labels */}
          {MONTH_LABELS.map((m) => (
            <text
              key={m.label}
              x={m.x}
              y={9}
              fill="var(--heat-text, #64748b)"
              fontSize="8.5"
              fontFamily="var(--font-code, monospace)"
            >
              {m.label}
            </text>
          ))}

          {/* 52-week grid of rects */}
          {weeks.map((week, wIdx) =>
            week.map((day, dIdx) => {
              const x = 4 + wIdx * 9.4;
              const y = 15 + dIdx * 9.4;
              const color = LEVEL_COLORS_DARK[day.level] || LEVEL_COLORS_DARK[0];

              return (
                <rect
                  key={`${wIdx}-${dIdx}`}
                  x={x}
                  y={y}
                  width={7.5}
                  height={7.5}
                  rx={1.8}
                  fill={color}
                  className={styles.svgCell}
                >
                  <title>{`${day.count} contributions on ${day.date}`}</title>
                </rect>
              );
            })
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className={styles.heatLegend}>
        <span>less</span>
        {LEVEL_COLORS_DARK.map((c, i) => (
          <span
            key={i}
            className={styles.legendCell}
            style={{ backgroundColor: c }}
          />
        ))}
        <span>more</span>
      </div>
    </div>
  );
};
