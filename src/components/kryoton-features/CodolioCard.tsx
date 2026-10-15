"use client";

import React, { useState, useEffect } from "react";
import styles from "./CodolioCard.module.scss";

export const CodolioCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ps" | "dev">("ps");
  const [ghStats, setGhStats] = useState({
    contributions: 182,
    activeDays: 32,
    publicRepos: 26,
  });

  useEffect(() => {
    let isMounted = true;
    // Live GitHub contribution heatmap stats
    fetch("https://github-contributions-api.jogruber.de/v4/ronakgupta03?y=last")
      .then((res) => res.json())
      .then((data: { contributions?: Array<{ count: number }> }) => {
        if (data && Array.isArray(data.contributions) && isMounted) {
          const total = data.contributions.reduce(
            (acc, curr) => acc + curr.count,
            0
          );
          const active = data.contributions.filter((c) => c.count > 0).length;
          setGhStats((prev) => ({
            ...prev,
            contributions: total,
            activeDays: active,
          }));
        }
      })
      .catch(() => {});

    // Live public repositories count
    fetch("https://api.github.com/users/ronakgupta03")
      .then((res) => res.json())
      .then((data: { public_repos?: number }) => {
        const count = data?.public_repos;
        if (typeof count === "number" && isMounted) {
          setGhStats((prev) => ({ ...prev, publicRepos: count }));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.cardContainer}>
      {/* Top Header: Codolio Brand + CARD badge */}
      <div className={styles.topHeader}>
        <a
          href="https://codolio.com/profile/the.ronak.gupta"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.brandLink}
        >
          Cod<span className={styles.brandAccent}>olio</span>
        </a>
        <span className={styles.cardTag}>CARD</span>
      </div>

      {/* Tab Switcher: Problem Solving vs Development */}
      <div className={styles.tabContainer} role="tablist" aria-label="Card Mode">
        <button
          type="button"
          id="codolio-ps-tab"
          className={`${styles.tabBtn} ${activeTab === "ps" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("ps")}
          role="tab"
          aria-selected={activeTab === "ps"}
        >
          <svg className={styles.tabIcon} viewBox="0 0 256 256" fill="currentColor">
            <path d="M96,73,34.06,128,96,183A12,12,0,1,1,80,201L8,137A12,12,0,0,1,8,119L80,55A12,12,0,0,1,96,73ZM248,119,176,55A12,12,0,1,0,160,73l61.91,55L160,183A12,12,0,1,0,176,201l72-64A12,12,0,0,0,248,119Z" />
          </svg>
          Problem Solving
        </button>
        <button
          type="button"
          id="codolio-dev-tab"
          className={`${styles.tabBtn} ${activeTab === "dev" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("dev")}
          role="tab"
          aria-selected={activeTab === "dev"}
        >
          <svg className={styles.tabIcon} viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
          Development
        </button>
      </div>

      {/* Card Body */}
      <div className={styles.cardContent}>
        {activeTab === "ps" ? (
          /* FACE 1: PROBLEM SOLVING */
          <div className={styles.face}>
            <div className={styles.avatarWrap}>
              <img
                src="/images/profile_photo.jpeg"
                alt="Ronak Gupta"
                className={styles.avatarImg}
              />
            </div>

            <div className={styles.nameRow}>
              <span className={styles.userName}>Ronak Gupta</span>
              <svg className={styles.verifiedCheck} viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <span className={styles.handleBadge}>@the.ronak.gupta</span>

            {/* 2 Stat Boxes */}
            <div className={styles.statsGridTwo}>
              <div className={`${styles.statBox} ${styles.statYellow}`}>
                <span className={styles.statLabel}>Questions Solved</span>
                <span className={styles.statNumber}>281</span>
              </div>
              <div className={`${styles.statBox} ${styles.statGreen}`}>
                <span className={styles.statLabel}>Active Days</span>
                <span className={styles.statNumber}>155</span>
              </div>
            </div>

            {/* "You can find me on ..." */}
            <div className={styles.findText}>You can find me on ...</div>

            {/* Platform Icons */}
            <div className={styles.platformIcons}>
              {/* Codeforces */}
              <a
                href="https://codeforces.com/profile/the.ronak.gupta"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platformCircle}
                title="Codeforces: the.ronak.gupta (Rating 1240, Max 1246, Pupil)"
                aria-label="Codeforces profile"
              >
                <img
                  src="/images/platforms/codeforces.svg"
                  alt="Codeforces"
                  className={styles.platformImg}
                />
              </a>

              {/* AtCoder */}
              <a
                href="https://codolio.com/profile/the.ronak.gupta"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platformCircle}
                title="AtCoder: the_ronak_gupta"
                aria-label="AtCoder profile"
              >
                <img
                  src="/images/platforms/atcoder.png"
                  alt="AtCoder"
                  className={styles.platformImg}
                />
              </a>

              {/* CodeChef */}
              <a
                href="https://www.codechef.com/users/the_ronak_gupta"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platformCircle}
                title="CodeChef: the_ronak_gupta"
                aria-label="CodeChef profile"
              >
                <img
                  src="/images/platforms/codechef.svg"
                  alt="CodeChef"
                  className={styles.platformImg}
                />
              </a>

              {/* LeetCode */}
              <a
                href="https://codolio.com/profile/the.ronak.gupta"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platformCircle}
                title="LeetCode: the.ronak.gupta"
                aria-label="LeetCode profile"
              >
                <img
                  src="/images/platforms/leetcode.svg"
                  alt="LeetCode"
                  className={styles.platformImg}
                />
              </a>
            </div>

            {/* Skill Chips */}
            <div className={styles.chipsRow}>
              <span className={styles.chip}>#C++</span>
              <span className={styles.chip}>#CP</span>
              <span className={styles.chip}>#DSA</span>
              <span className={styles.chip}>#PUPIL</span>
              <span className={styles.chip}>#1246</span>
              <span className={styles.chip}>#ARRAYS</span>
              <span className={styles.chip}>#SORTING</span>
            </div>
          </div>
        ) : (
          /* FACE 2: DEVELOPMENT */
          <div className={styles.face}>
            <div className={styles.avatarWrap}>
              <img
                src="/images/profile_photo.jpeg"
                alt="Ronak Gupta"
                className={styles.avatarImg}
              />
            </div>

            <div className={styles.nameRow}>
              <span className={styles.userName}>Ronak Gupta</span>
              <svg className={styles.verifiedCheck} viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <span className={styles.handleBadge}>@ronakgupta03</span>

            {/* 3 Stat Boxes */}
            {/* 3 Stat Boxes with Live Dynamic GitHub Data */}
            <div className={styles.statsGridThree}>
              <div className={`${styles.statBox} ${styles.statGreen}`}>
                <span className={styles.statLabel}>Contributions</span>
                <span className={styles.statNumber}>{ghStats.contributions}</span>
              </div>
              <div className={`${styles.statBox} ${styles.statYellow}`}>
                <span className={styles.statLabel}>Active Days</span>
                <span className={styles.statNumber}>{ghStats.activeDays}</span>
              </div>
              <div className={`${styles.statBox} ${styles.statGreen}`}>
                <span className={styles.statLabel}>Public Repos</span>
                <span className={styles.statNumber}>{ghStats.publicRepos}</span>
              </div>
            </div>

            {/* "You can find me on ..." */}
            <div className={styles.findText}>You can find me on ...</div>

            {/* GitHub Badge */}
            <div className={styles.platformIcons}>
              <a
                href="https://github.com/ronakgupta03"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.platformCircle} ${styles.ghCircle}`}
                title="GitHub: ronakgupta03"
              >
                <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
                  <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
              </a>
            </div>

            {/* Skill Chips */}
            <div className={styles.chipsRow}>
              <span className={styles.chip}>#PYTHON</span>
              <span className={styles.chip}>#JAVA</span>
              <span className={styles.chip}>#C++</span>
              <span className={styles.chip}>#POSTGRESQL</span>
              <span className={styles.chip}>#AST</span>
              <span className={styles.chip}>#SCHEMAFORGE</span>
              <span className={styles.chip}>#MINIRELDB</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
