"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./QuickNavButtons.module.scss";

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Section" | "Project" | "External";
  action: () => void;
}

export const QuickNavButtons: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle synth micro-click using native Web Audio API
  const playClickSound = (freq = 850, duration = 0.04) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current && typeof window !== "undefined") {
        const AudioCtx = window.AudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      if (!audioCtxRef.current) return;

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore if audio is restricted
    }
  };

  const scrollTo = (id: string) => {
    playClickSound(950, 0.05);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const sections = ["projects", "stats", "terminal", "business-card"];
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(s);
            return;
          }
        }
      }
      if (window.scrollY < 400) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        playClickSound(1000, 0.06);
        setIsCommandOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsCommandOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [soundEnabled]);

  const searchItems: SearchItem[] = [
    {
      id: "schemaforge",
      title: "SchemaForge",
      subtitle: "Autonomous AST-Aware Zero-Downtime DB Migration Agent",
      category: "Project",
      action: () => {
        window.location.href = "/work/schemaforge";
      },
    },
    {
      id: "minireldb",
      title: "MiniRelDB",
      subtitle: "Custom Relational Database Engine in Java (B+ Tree, WAL)",
      category: "Project",
      action: () => {
        window.location.href = "/work/minireldb";
      },
    },
    {
      id: "tuxpages",
      title: "TuxPages",
      subtitle: "Technical Research Journal Platform (PostgreSQL, SMTP)",
      category: "Project",
      action: () => {
        window.location.href = "/work/tuxpages";
      },
    },
    {
      id: "rng",
      title: "RNG: Security Analysis",
      subtitle: "Cryptographic Randomness Research & NIST SP 800-22 Tests",
      category: "Project",
      action: () => {
        window.location.href = "/work/rng-security";
      },
    },
    {
      id: "games-sdl2",
      title: "Games Using SDL2",
      subtitle: "Native C Game Engine & Custom Physics",
      category: "Project",
      action: () => {
        window.location.href = "/work/games-sdl2";
      },
    },
    {
      id: "nav-projects",
      title: "Projects Section",
      subtitle: "Jump to interactive project deep-dives",
      category: "Section",
      action: () => scrollTo("projects"),
    },
    {
      id: "nav-stats",
      title: "Codeforces & GitHub Stats",
      subtitle: "Live rating curve (1193 CF) & real GitHub calendar",
      category: "Section",
      action: () => scrollTo("stats"),
    },
    {
      id: "nav-terminal",
      title: "Interactive Terminal",
      subtitle: "Command-line shell (guest@ronak.dev:~$)",
      category: "Section",
      action: () => scrollTo("terminal"),
    },
    {
      id: "nav-card",
      title: "3D Business Card",
      subtitle: "Interactive 3D tilt & flip contact card",
      category: "Section",
      action: () => scrollTo("business-card"),
    },
    {
      id: "nav-about",
      title: "About Ronak Gupta",
      subtitle: "Background, VIPS-TC education, leadership & skills",
      category: "Section",
      action: () => {
        window.location.href = "/about";
      },
    },
    {
      id: "blog-schemaforge",
      title: "Blog: Building SchemaForge",
      subtitle: "Safe Zero-Downtime DB Migrations for AI Agents (Medium)",
      category: "Section",
      action: () => {
        window.location.href = "/blog/building-schemaforge";
      },
    },
    {
      id: "blog-bittorrent",
      title: "Blog: Demystifying BitTorrent",
      subtitle: "P2P protocol, swarming dynamics & DHT (TuxPages @its_rg)",
      category: "Section",
      action: () => {
        window.location.href = "/blog/demystifying-the-bittorrent-protocol";
      },
    },
    {
      id: "ext-resume",
      title: "View Resume (PDF)",
      subtitle: "Open official curriculum vitae",
      category: "External",
      action: () => {
        window.open("/Ronak_Resume.pdf", "_blank");
      },
    },
    {
      id: "ext-cf",
      title: "Codeforces Profile",
      subtitle: "@the.ronak.gupta (1193 Current Rating)",
      category: "External",
      action: () => {
        window.open("https://codeforces.com/profile/the.ronak.gupta", "_blank");
      },
    },
  ];

  const filteredItems = searchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: SearchItem) => {
    playClickSound(1100, 0.06);
    setIsCommandOpen(false);
    setSearchQuery("");
    item.action();
  };

  return (
    <>
      <div className={styles.dockContainer}>
        {/* Status indicator badge */}
        <div className={styles.statusPill}>
          <span className={styles.liveBeacon} />
          <span className={styles.statusText}>SYSTEM ONLINE</span>
        </div>

        {/* Action buttons with clean SVG icons - NO EMOJIS */}
        <div className={styles.buttonsGroup}>
          <button
            type="button"
            onClick={() => scrollTo("projects")}
            className={`${styles.navBtn} ${activeSection === "projects" ? styles.active : ""}`}
            title="Jump to Projects"
          >
            <svg className={styles.navSvg} viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M1.75 2.5A1.75 1.75 0 0 0 0 4.25v8.5C0 13.716.784 14.5 1.75 14.5h12.5A1.75 1.75 0 0 0 16 12.75v-6.5A1.75 1.75 0 0 0 14.25 4.5H8.28l-.94-1.41A1.75 1.75 0 0 0 5.88 2.5H1.75Z" />
            </svg>
            <span className={styles.label}>PROJECTS</span>
            <span className={styles.countBadge}>5</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo("stats")}
            className={`${styles.navBtn} ${activeSection === "stats" ? styles.active : ""}`}
            title="Jump to Codeforces & GitHub metrics"
          >
            <svg className={styles.navSvg} viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5Z" />
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z" />
            </svg>
            <span className={styles.label}>CP &amp; STATS</span>
            <span className={styles.cfBadge}>1193</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo("terminal")}
            className={`${styles.navBtn} ${activeSection === "terminal" ? styles.active : ""}`}
            title="Open Interactive Terminal"
          >
            <svg className={styles.navSvg} viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75Zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H1.75ZM3.22 5.47a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 0 1-1.06-1.06L4.69 8 3.22 6.53a.75.75 0 0 1 0-1.06Zm5.03 5.28h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5Z" />
            </svg>
            <span className={styles.label}>TERMINAL</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo("business-card")}
            className={`${styles.navBtn} ${activeSection === "business-card" ? styles.active : ""}`}
            title="View 3D Business Card"
          >
            <svg className={styles.navSvg} viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M1 3.75C1 2.784 1.784 2 2.75 2h10.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 13.25 14H2.75A1.75 1.75 0 0 1 1 12.25v-8.5Zm1.75-.25a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25H2.75ZM4 5.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM9.5 5h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5Zm0 3h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5ZM4 10.5a2.5 2.5 0 0 1 5 0 .75.75 0 0 1-1.5 0 1 1 0 0 0-2 0 .75.75 0 0 1-1.5 0Z" />
            </svg>
            <span className={styles.label}>3D CARD</span>
          </button>

          <a href="/about" className={styles.navBtn} title="About Ronak Gupta">
            <svg className={styles.navSvg} viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
            </svg>
            <span className={styles.label}>ABOUT</span>
          </a>

          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={() => {
              playClickSound(1000, 0.05);
              setIsCommandOpen(true);
            }}
            className={`${styles.navBtn} ${styles.cmdPaletteBtn}`}
            title="Open Command Palette (Ctrl+K / ⌘K)"
          >
            <span className={styles.cmdKIcon}>Ctrl+K / ⌘K</span>
            <span className={styles.cmdKLabel}>SEARCH</span>
          </button>

          {/* Sound FX Toggle with clean SVG speaker */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) {
                setTimeout(() => playClickSound(1200, 0.05), 50);
              }
            }}
            className={`${styles.navBtn} ${styles.audioBtn} ${soundEnabled ? styles.audioActive : ""}`}
            title={soundEnabled ? "Tactile Audio: Enabled" : "Tactile Audio: Disabled"}
            aria-label="Toggle Sound Effects"
          >
            {soundEnabled ? (
              <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
                <path d="M7.563 2.069A.75.75 0 0 1 8 2.75v10.5a.75.75 0 0 1-1.238.57L3.472 11H1.75A1.75 1.75 0 0 1 0 9.25v-2.5C0 5.784.784 5 1.75 5h1.723l3.289-2.82a.75.75 0 0 1 .801-.111ZM11.53 4.47a.75.75 0 0 1 1.06 0A5.972 5.972 0 0 1 14.25 8a5.972 5.972 0 0 1-1.66 3.53.75.75 0 1 1-1.06-1.06A4.472 4.472 0 0 0 12.75 8c0-1.05-.36-2.016-1.22-2.47a.75.75 0 0 1 0-1.06Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
                <path d="M7.563 2.069A.75.75 0 0 1 8 2.75v10.5a.75.75 0 0 1-1.238.57L3.472 11H1.75A1.75 1.75 0 0 1 0 9.25v-2.5C0 5.784.784 5 1.75 5h1.723l3.289-2.82a.75.75 0 0 1 .801-.111ZM10.22 5.22a.75.75 0 0 1 1.06 0L13 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L14.06 8l1.72 1.72a.75.75 0 1 1-1.06 1.06L13 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L11.94 8l-1.72-1.72a.75.75 0 0 1 0-1.06Z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Command Palette Modal */}
      {isCommandOpen && (
        <div className={styles.paletteOverlay} onClick={() => setIsCommandOpen(false)}>
          <div
            className={styles.paletteModal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.searchBar}>
              <span className={styles.searchPrompt}>&gt;</span>
              <input
                type="text"
                autoFocus
                placeholder="Type to search projects, stats, sections... (Esc to close, Ctrl+K / ⌘K)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                      prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
                    );
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (filteredItems[selectedIndex]) {
                      handleSelect(filteredItems[selectedIndex]);
                    }
                  }
                }}
                className={styles.searchInput}
              />
              <span className={styles.escBadge}>ESC</span>
            </div>

            <div className={styles.resultsList}>
              {filteredItems.length === 0 ? (
                <div className={styles.noResults}>No matching projects or sections found.</div>
              ) : (
                filteredItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`${styles.resultRow} ${idx === selectedIndex ? styles.selectedRow : ""}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className={styles.rowInfo}>
                      <span className={styles.rowTitle}>{item.title}</span>
                      <span className={styles.rowSub}>{item.subtitle}</span>
                    </div>
                    <span className={styles.categoryBadge}>{item.category}</span>
                  </div>
                ))
              )}
            </div>

            <div className={styles.paletteFooter}>
              <span>Navigate: &uarr;&darr;</span>
              <span>Select: Enter</span>
              <span>Close: Esc</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
