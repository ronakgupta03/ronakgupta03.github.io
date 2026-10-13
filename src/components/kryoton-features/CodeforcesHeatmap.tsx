"use client";

import React, { useEffect, useState } from "react";
import styles from "./CodeforcesHeatmap.module.scss";
import fallbackAcceptedData from "@/resources/codeforces-accepted.json";

interface DaySubmission {
  date: string;
  count: number;
}

interface CFSubmission {
  id?: number;
  creationTimeSeconds: number;
  verdict?: string;
}

interface CFStatusResponse {
  status: string;
  result?: CFSubmission[];
}

const CF_COLORS_DARK = [
  "rgba(255, 255, 255, 0.05)",
  "#78350f",
  "#b45309",
  "#d97706",
  "#fbbf24",
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

export const CodeforcesHeatmap: React.FC = () => {
  const [totalAccepted, setTotalAccepted] = useState<number>(
    fallbackAcceptedData.totalAccepted || 274
  );
  const [activeDays, setActiveDays] = useState<number>(
    fallbackAcceptedData.activeDays || 133
  );
  const [days, setDays] = useState<DaySubmission[]>([]);

  useEffect(() => {
    // Generate base 52-week grid (364 days) ending today
    const grid: DaySubmission[] = [];
    const today = new Date();
    const fallbackMap: Record<string, number> = fallbackAcceptedData.dailyAccepted || {};

    for (let i = 363; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const count = fallbackMap[key] || 0;
      grid.push({ date: key, count });
    }

    setDays(grid);

    // Fetch live Codeforces status and count ONLY accepted solutions (verdict === "OK")
    fetch("https://codeforces.com/api/user.status?handle=the.ronak.gupta&from=1&count=2000")
      .then((res) => res.json())
      .then((data: CFStatusResponse) => {
        if (data.status === "OK" && Array.isArray(data.result)) {
          const acceptedSubs = data.result.filter((s) => s.verdict === "OK");
          setTotalAccepted(acceptedSubs.length);

          const liveCounts: Record<string, number> = {};
          const distinctDays = new Set<string>();

          acceptedSubs.forEach((s) => {
            if (s.creationTimeSeconds) {
              // Convert to local date string (UTC+5:30)
              const ms = (s.creationTimeSeconds + 19800) * 1000;
              const dateStr = new Date(ms).toISOString().split("T")[0];
              distinctDays.add(dateStr);
              liveCounts[dateStr] = (liveCounts[dateStr] || 0) + 1;
            }
          });

          setActiveDays(distinctDays.size);

          // Update grid with exact accepted counts
          const updated = grid.map((item) => ({
            date: item.date,
            count: liveCounts[item.date] || 0,
          }));
          setDays(updated);
        }
      })
      .catch(() => {
        // Silently use exact baked accepted data
      });
  }, []);

  // Split into 52 weeks of 7 days
  const weeks: DaySubmission[][] = [];
  let curWeek: DaySubmission[] = [];
  days.forEach((day, idx) => {
    curWeek.push(day);
    if (curWeek.length === 7 || idx === days.length - 1) {
      weeks.push(curWeek);
      curWeek = [];
    }
  });

  const getTierColor = (count: number) => {
    if (count === 0) return CF_COLORS_DARK[0];
    if (count <= 2) return CF_COLORS_DARK[1];
    if (count <= 4) return CF_COLORS_DARK[2];
    if (count <= 6) return CF_COLORS_DARK[3];
    return CF_COLORS_DARK[4];
  };

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.cardTerm}>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.r}`} />
          <span className={`${styles.dot} ${styles.y}`} />
          <span className={`${styles.dot} ${styles.g}`} />
        </div>
        <span className={styles.cardTitle}>codeforces — accepted solutions</span>
        <a
          href="https://codeforces.com/profile/the.ronak.gupta"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardLink}
        >
          profile &#8599;
        </a>
      </div>

      {/* Stats Summary: Showing ONLY accepted solutions & active days */}
      <div className={styles.heatStats}>
        <span>
          <strong className={styles.statNum}>{totalAccepted}</strong> accepted
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
          aria-label="Codeforces accepted solutions activity heatmap"
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
              const color = getTierColor(day.count);

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
                  <title>{`${day.count} accepted solution${day.count === 1 ? "" : "s"} on ${day.date}`}</title>
                </rect>
              );
            })
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className={styles.heatLegend}>
        <span>less</span>
        {CF_COLORS_DARK.map((c, i) => (
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
