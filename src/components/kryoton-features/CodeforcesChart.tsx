"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./CodeforcesChart.module.scss";

interface ContestRecord {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

const FALLBACK_CONTESTS: ContestRecord[] = [
  { contestId: 2112, contestName: "Educational Codeforces Round 180 (Rated for Div. 2)", handle: "the.ronak.gupta", rank: 15693, ratingUpdateTimeSeconds: 1718000000, oldRating: 0, newRating: 374 },
  { contestId: 2148, contestName: "Codeforces Round 1050 (Div. 4)", handle: "the.ronak.gupta", rank: 12443, ratingUpdateTimeSeconds: 1719000000, oldRating: 374, newRating: 634 },
  { contestId: 2152, contestName: "Squarepoint Challenge (Codeforces Round 1055, Div. 1 + Div. 2)", handle: "the.ronak.gupta", rank: 12014, ratingUpdateTimeSeconds: 1720000000, oldRating: 634, newRating: 793 },
  { contestId: 2145, contestName: "Educational Codeforces Round 183 (Rated for Div. 2)", handle: "the.ronak.gupta", rank: 13854, ratingUpdateTimeSeconds: 1721000000, oldRating: 793, newRating: 872 },
  { contestId: 2153, contestName: "Codeforces Round 1057 (Div. 2)", handle: "the.ronak.gupta", rank: 12359, ratingUpdateTimeSeconds: 1722000000, oldRating: 872, newRating: 948 },
  { contestId: 2162, contestName: "Codeforces Round 1059 (Div. 3)", handle: "the.ronak.gupta", rank: 14105, ratingUpdateTimeSeconds: 1723000000, oldRating: 948, newRating: 975 },
  { contestId: 2173, contestName: "Codeforces Round 1068 (Div. 2)", handle: "the.ronak.gupta", rank: 12146, ratingUpdateTimeSeconds: 1724000000, oldRating: 975, newRating: 938 },
  { contestId: 2242, contestName: "Educational Codeforces Round 192 (Rated for Div. 2)", handle: "the.ronak.gupta", rank: 10540, ratingUpdateTimeSeconds: 1725000000, oldRating: 938, newRating: 935 },
  { contestId: 2246, contestName: "Codeforces Round 1108 (Div. 2)", handle: "the.ronak.gupta", rank: 8528, ratingUpdateTimeSeconds: 1726000000, oldRating: 935, newRating: 960 },
  { contestId: 2244, contestName: "Codeforces Round 1109 (Div. 3)", handle: "the.ronak.gupta", rank: 6803, ratingUpdateTimeSeconds: 1727000000, oldRating: 960, newRating: 1028 },
  { contestId: 2245, contestName: "Spectral::Cup 2026 Round 3 (Div. 1 + Div. 2)", handle: "the.ronak.gupta", rank: 6759, ratingUpdateTimeSeconds: 1728000000, oldRating: 1028, newRating: 1031 },
  { contestId: 2247, contestName: "Codeforces Round 1111 (Div. 2)", handle: "the.ronak.gupta", rank: 8540, ratingUpdateTimeSeconds: 1729000000, oldRating: 1031, newRating: 999 },
  { contestId: 2248, contestName: "Codeforces Round 1113 (Div. 2)", handle: "the.ronak.gupta", rank: 7301, ratingUpdateTimeSeconds: 1730000000, oldRating: 999, newRating: 1018 },
  { contestId: 2254, contestName: "Codeforces Round 1114 (Div. 3)", handle: "the.ronak.gupta", rank: 8158, ratingUpdateTimeSeconds: 1731000000, oldRating: 1018, newRating: 1058 },
  { contestId: 2256, contestName: "Codeforces Round 1116 (Div. 2)", handle: "the.ronak.gupta", rank: 8580, ratingUpdateTimeSeconds: 1732000000, oldRating: 1058, newRating: 1031 },
  { contestId: 2257, contestName: "Codeforces Round 1117 (Div. 2)", handle: "the.ronak.gupta", rank: 5119, ratingUpdateTimeSeconds: 1733000000, oldRating: 1031, newRating: 1099 },
  { contestId: 2259, contestName: "Codeforces Round 1119 (Div. 3)", handle: "the.ronak.gupta", rank: 6171, ratingUpdateTimeSeconds: 1734000000, oldRating: 1099, newRating: 1124 },
  { contestId: 2260, contestName: "Educational Codeforces Round 194 (Rated for Div. 2)", handle: "the.ronak.gupta", rank: 4609, ratingUpdateTimeSeconds: 1735000000, oldRating: 1124, newRating: 1174 },
  { contestId: 2263, contestName: "Codeforces Round 1120 (Div. 2)", handle: "the.ronak.gupta", rank: 5465, ratingUpdateTimeSeconds: 1736000000, oldRating: 1174, newRating: 1172 },
  { contestId: 2264, contestName: "Codeforces Round 1121 (Div. 2)", handle: "the.ronak.gupta", rank: 3922, ratingUpdateTimeSeconds: 1737000000, oldRating: 1172, newRating: 1193 },
];

export const CodeforcesChart: React.FC = () => {
  const [contests, setContests] = useState<ContestRecord[]>(FALLBACK_CONTESTS);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    contestName: string;
    newRating: number;
    diff: number;
    rank: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    contestName: "",
    newRating: 0,
    diff: 0,
    rank: 0,
  });
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const updateTheme = () => {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(cur === "light" ? "light" : "dark");
    };
    updateTheme();
    const obs = new MutationObserver(updateTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCF = async () => {
      try {
        const res = await fetch("https://codeforces.com/api/user.rating?handle=the.ronak.gupta");
        if (res.ok) {
          const data = await res.json();
          if (data.status === "OK" && data.result && data.result.length > 0 && isMounted) {
            setContests(data.result);
          }
        }
      } catch (err) {
        console.warn("Could not fetch Codeforces live API, using local records", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCF();
    return () => {
      isMounted = false;
    };
  }, []);

  const getRankColor = (rating: number) => {
    if (rating >= 2400) return "#ff0000"; // Red
    if (rating >= 2100) return "#ff8c00"; // Orange
    if (rating >= 1900) return "#aa00aa"; // Violet
    if (rating >= 1600) return "#3b82f6"; // Blue
    if (rating >= 1400) return "#06b6d4"; // Cyan
    if (rating >= 1200) return "#22c55e"; // Green
    return "#94a3b8"; // Gray / Newbie
  };

  const getRankTitle = (rating: number) => {
    if (rating >= 2400) return "Grandmaster";
    if (rating >= 2100) return "Master";
    if (rating >= 1900) return "Candidate Master";
    if (rating >= 1600) return "Expert";
    if (rating >= 1400) return "Specialist";
    if (rating >= 1200) return "Pupil";
    return "Newbie";
  };

  const ratings = contests.map((c) => c.newRating);
  const currentRating = ratings[ratings.length - 1] ?? 1193;
  const peakRating = Math.max(...ratings, 1193);
  const contestCount = contests.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || contests.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 700;
    const height = 280;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 25, right: 65, bottom: 35, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minR = Math.max(0, Math.floor((Math.min(...ratings) - 80) / 100) * 100);
    const maxR = Math.ceil((Math.max(...ratings, 1250) + 80) / 100) * 100;

    const getX = (index: number) => padding.left + (index / Math.max(1, contests.length - 1)) * chartW;
    const getY = (rating: number) => padding.top + (1 - (rating - minR) / (maxR - minR)) * chartH;

    // Division Bands
    const divisions = [
      { min: 0, max: 1200, label: "Newbie", col: "rgba(148, 163, 184, 0.05)" },
      { min: 1200, max: 1400, label: "Pupil", col: "rgba(34, 197, 94, 0.08)" },
      { min: 1400, max: 1600, label: "Specialist", col: "rgba(6, 182, 212, 0.08)" },
      { min: 1600, max: 1900, label: "Expert", col: "rgba(59, 130, 246, 0.08)" },
    ];

    divisions.forEach((div) => {
      const topY = getY(Math.min(div.max, maxR));
      const btmY = getY(Math.max(div.min, minR));
      const bandHeight = btmY - topY;

      if (bandHeight > 0 && topY < height - padding.bottom) {
        ctx.fillStyle = div.col;
        ctx.fillRect(padding.left, topY, chartW, bandHeight);

        // Division Label
        ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
        ctx.font = '10px "Geist Mono", monospace';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(div.label, padding.left + chartW + 8, (topY + btmY) / 2);
      }
    });

    // Horizontal Grid Lines
    ctx.lineWidth = 1;
    for (let r = minR; r <= maxR; r += 200) {
      const y = getY(r);
      if (y >= padding.top && y <= height - padding.bottom) {
        ctx.strokeStyle = theme === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.06)";
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartW, y);
        ctx.stroke();

        ctx.fillStyle = theme === "light" ? "rgba(71, 85, 105, 0.8)" : "rgba(148, 163, 184, 0.6)";
        ctx.font = '10px "Geist Mono", monospace';
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(String(r), padding.left - 8, y);
      }
    }

    // Gradient below the line
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, theme === "light" ? "rgba(37, 99, 235, 0.22)" : "rgba(59, 130, 246, 0.35)");
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(ratings[0]));
    for (let i = 1; i < contests.length; i++) {
      ctx.lineTo(getX(i), getY(ratings[i]));
    }
    ctx.lineTo(getX(contests.length - 1), height - padding.bottom);
    ctx.lineTo(getX(0), height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Rating Line
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(ratings[0]));
    for (let i = 1; i < contests.length; i++) {
      ctx.lineTo(getX(i), getY(ratings[i]));
    }
    ctx.strokeStyle = getRankColor(currentRating);
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();

    // Points
    contests.forEach((c, idx) => {
      const x = getX(idx);
      const y = getY(c.newRating);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = getRankColor(c.newRating);
      ctx.strokeStyle = theme === "light" ? "#ffffff" : "#090d16";
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    });
  }, [contests, currentRating, ratings, theme]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || contests.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = rect.width;
    const height = 280;
    const padding = { top: 25, right: 65, bottom: 35, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minR = Math.max(0, Math.floor((Math.min(...ratings) - 80) / 100) * 100);
    const maxR = Math.ceil((Math.max(...ratings, 1250) + 80) / 100) * 100;

    const getX = (index: number) => padding.left + (index / Math.max(1, contests.length - 1)) * chartW;
    const getY = (rating: number) => padding.top + (1 - (rating - minR) / (maxR - minR)) * chartH;

    let closestIdx = -1;
    let minDist = Infinity;

    contests.forEach((c, idx) => {
      const x = getX(idx);
      const y = getY(c.newRating);
      const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });

    if (minDist < 25 && closestIdx !== -1) {
      const c = contests[closestIdx];
      setTooltip({
        visible: true,
        x: getX(closestIdx),
        y: getY(c.newRating),
        contestName: c.contestName,
        newRating: c.newRating,
        diff: c.newRating - c.oldRating,
        rank: c.rank,
      });
    } else {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div ref={containerRef} className={styles.chartWrapper}>
      <div className={styles.cardTerm}>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.r}`} />
          <span className={`${styles.dot} ${styles.y}`} />
          <span className={`${styles.dot} ${styles.g}`} />
        </div>
        <span className={styles.cardTitle}>codeforces — rating history</span>
        <a
          href="https://codeforces.com/profile/the.ronak.gupta"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardLink}
        >
          profile &#8599;
        </a>
      </div>

      <div className={styles.cfStats}>
        <div className={styles.cfStat}>
          <span className={styles.cfNum} style={{ color: getRankColor(currentRating) }}>
            {currentRating}
          </span>
          <span className={styles.cfLbl}>CURRENT</span>
        </div>
        <div className={styles.cfStat}>
          <span className={styles.cfNum} style={{ color: getRankColor(peakRating) }}>
            {peakRating}
          </span>
          <span className={styles.cfLbl}>MAX RATING</span>
        </div>
        <div className={styles.cfStat}>
          <span className={styles.cfNum}>{contestCount}</span>
          <span className={styles.cfLbl}>CONTESTS</span>
        </div>
      </div>

      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {tooltip.visible && (
          <div
            className={styles.tooltip}
            style={{
              left: `${tooltip.x + 12}px`,
              top: `${tooltip.y - 30}px`,
            }}
          >
            <div className={styles.tooltipRating} style={{ color: getRankColor(tooltip.newRating) }}>
              {tooltip.newRating}{" "}
              <span className={tooltip.diff >= 0 ? styles.gain : styles.loss}>
                ({tooltip.diff >= 0 ? `+${tooltip.diff}` : tooltip.diff})
              </span>
            </div>
            <div className={styles.tooltipName}>{tooltip.contestName}</div>
            <div className={styles.tooltipRank}>Rank: #{tooltip.rank}</div>
          </div>
        )}
      </div>

    </div>
  );
};
