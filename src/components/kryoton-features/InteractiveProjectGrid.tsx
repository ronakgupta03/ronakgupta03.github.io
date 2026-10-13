"use client";

import React, { useState, useRef } from "react";
import { TextScramble } from "./TextScramble";

import styles from "./InteractiveProjectGrid.module.scss";

interface PipelineStep {
  step: string;
  title: string;
  description: string;
}

interface ProjectData {
  id: string;
  title: string;
  tagline: string;
  period: string;
  badge: string;
  stack: string[];
  diagram: string;
  diagramTitle: string;
  problem: string;
  systemDesign: string;
  pipeline: PipelineStep[];
  github: string;
  caseStudy: string;
  live?: string;
}

const PROJECTS: ProjectData[] = [
  {
    id: "schemaforge",
    title: "SchemaForge",
    tagline: "Autonomous AST-Aware Zero-Downtime Database Migration Agent",
    period: "2026 // AGENT HARNESS HACKATHON",
    badge: "HACKATHON AGENT",
    stack: ["Python", "TrueForge", "PostgreSQL", "AST Analysis", "Alembic", "Daytona Sandbox", "DeepSeek-v4 Flash"],
    diagram: "/images/projects/schemaforge.svg",
    diagramTitle: "SCHEMAFORGE // MULTI-AGENT PIPELINE & ZERO-DOWNTIME ARCHITECTURE",
    problem:
      "Database schema migrations in production are notoriously hazardous. A mismatch between running database DDL and application ORM call-sites triggers dropped transactions, race conditions, or silent data corruption. Traditional migration tools only manage SQL DDL without contextual awareness of application codebases.",
    systemDesign:
      "SchemaForge treats a schema change as a synchronized database and application code alteration. It coordinates parallel subagents (PostgreSQL catalog analyzer via MCP and static Python AST parser), constructs a deterministic impact graph, verifies execution in an isolated Daytona sandbox, and enforces a strict Human Approval Gate before touching production.",
    pipeline: [
      {
        step: "01",
        title: "Root Orchestrator",
        description: "TrueForge root agent parses user migration prompt and delegates to parallel subagents.",
      },
      {
        step: "02",
        title: "DB & AST Analysis",
        description: "DB agent inspects live PostgreSQL catalogs via MCP; Code agent parses AST models & sqlparse queries.",
      },
      {
        step: "03",
        title: "Impact Graph",
        description: "Deterministic engine unifies facts into a Mermaid dependency graph: tables to ORMs to endpoints.",
      },
      {
        step: "04",
        title: "Sandbox Verify",
        description: "Daytona sandbox executes Alembic upgrade, verifies data parity, and confirms zero query regressions.",
      },
      {
        step: "05",
        title: "The Human Gate",
        description: "Pauses execution for operator approval. Applies atomic 1-transaction rollback guards and dual-write views.",
      },
    ],
    github: "https://github.com/ronakgupta03/schemaforge",
    caseStudy: "/work/schemaforge",
  },
  {
    id: "minireldb",
    title: "MiniRelDB",
    tagline: "Custom Relational Database Engine Built from Scratch in Java",
    period: "2024 – 2025",
    badge: "SYSTEMS CORE",
    stack: ["Java", "B+ Trees", "WAL Recovery", "Buffer Pool", "Slotted Pages", "SQL Parser"],
    diagram: "/images/projects/minireldb.svg",
    diagramTitle: "MINIRELDB // STORAGE ENGINE, BUFFER POOL & VOLCANO EXECUTION",
    problem:
      "Production databases hide low-level storage mechanics beneath layers of abstractions. Understanding disk block mapping, LRU page frame eviction, transactional atomicity, and query optimization required building an entire database engine from raw I/O without third-party libraries.",
    systemDesign:
      "A complete relational database engine implementing disk page-based storage, an LRU buffer pool manager, a multi-way B+ Tree index, and an ARIES-style Write-Ahead Logging (WAL) subsystem supporting full ACID transactional durability.",
    pipeline: [
      {
        step: "01",
        title: "Query Parser",
        description: "Parses raw SQL queries into structured execution plans and abstract operator trees.",
      },
      {
        step: "02",
        title: "Volcano Engine",
        description: "Executes queries via demand-driven iterator model with hash joins, project, and filter predicates.",
      },
      {
        step: "03",
        title: "Buffer Manager",
        description: "Caches disk blocks in memory frames using an LRU eviction policy with pinned frame tracking.",
      },
      {
        step: "04",
        title: "B+ Tree Index",
        description: "Provides O(log N) point lookups, page splits, node merges, and ordered sequential range scans.",
      },
      {
        step: "05",
        title: "WAL & Recovery",
        description: "Enforces write-ahead logging with Log Sequence Numbers (LSNs) and ARIES Analysis/Redo/Undo passes.",
      },
    ],
    github: "https://github.com/ronakgupta03/MiniRelDB",
    caseStudy: "/work/minireldb",
  },
  {
    id: "tuxpages",
    title: "TuxPages",
    tagline: "Production-Grade Technical Research Journal & Publishing Platform",
    period: "2024 – Present",
    badge: "FULL STACK",
    stack: ["PostgreSQL", "Node.js", "Express", "SMTP / TLS", "JWT Auth", "Markdown Engine"],
    diagram: "/images/projects/tuxpages.svg",
    diagramTitle: "TUXPAGES // MULTI-TENANT PUBLISHING & SECURE DISPATCH PIPELINE",
    problem:
      "Technical research blogs require robust publication workflows, content versioning, peer review queues, and reliable transactional notifications without third-party platform lock-in.",
    systemDesign:
      "A multi-tenant technical publication engine with normalized PostgreSQL relational schemas, secure SMTP/TLS mail server integration, bcrypt credential hashing, and dynamic Markdown rendering with LaTeX math equations.",
    pipeline: [
      {
        step: "01",
        title: "Client Gateway",
        description: "Express.js REST API with rate-limiting, CORS control, and structured request validation.",
      },
      {
        step: "02",
        title: "Auth & Roles",
        description: "Stateless JWT session management with bcrypt hashing and granular author/editor permissions.",
      },
      {
        step: "03",
        title: "PostgreSQL Core",
        description: "Normalized schema with foreign key constraints, transactional blog publishing, and full-text search.",
      },
      {
        step: "04",
        title: "Markdown & LaTeX",
        description: "Server-side Markdown parser converting technical equations and code snippets to sanitized HTML.",
      },
      {
        step: "05",
        title: "SMTP Dispatch",
        description: "Automated transactional email notifications and newsletter dispatches via TLS-secured SMTP transport.",
      },
    ],
    github: "https://github.com/ronakgupta03",
    caseStudy: "/work/tuxpages",
    live: "https://www.tuxpages.tech/",
  },
  {
    id: "rng-security",
    title: "Random Number Generators: Security Analysis",
    tagline: "Cryptographic Randomness Research & NIST SP 800-22 Test Suite",
    period: "2025",
    badge: "CRYPTOGRAPHY",
    stack: ["Python", "C / C++", "BLAKE3 Hash Tree", "NIST SP 800-22", "Entropy Pooling", "CSPRNG"],
    diagram: "/images/projects/rng-security.svg",
    diagramTitle: "RNG SECURITY // BLAKE3 CSPRNG & STATISTICAL RANDOMNESS PIPELINE",
    problem:
      "Standard language runtime generators (such as Linear Congruential Generators or standard Mersenne Twisters) exhibit predictable state cycles and bit bias, making them catastrophically insecure for security and cryptographic protocols.",
    systemDesign:
      "Engineered a cryptographically secure pseudo-random number generator (CSPRNG) utilizing the BLAKE3 hash function in counter mode with dynamic entropy mixing, evaluated against all 17 NIST SP 800-22 benchmark batteries.",
    pipeline: [
      {
        step: "01",
        title: "Entropy Harvester",
        description: "Gathers non-deterministic hardware seed bytes from OS kernel entropy pools and CPU jitter.",
      },
      {
        step: "02",
        title: "BLAKE3 CSPRNG",
        description: "Generates high-throughput pseudo-random byte streams via BLAKE3 hash tree in counter mode.",
      },
      {
        step: "03",
        title: "NIST Suite Runner",
        description: "Automates execution of 17 statistical tests (Frequency, Runs, Spectral FFT, Approximate Entropy).",
      },
      {
        step: "04",
        title: "Statistical Profiling",
        description: "Computes p-values and uniform distribution metrics across gigabyte-scale sample sets.",
      },
      {
        step: "05",
        title: "Benchmarking",
        description: "Measures throughput, state reconstruction resistance, and latency against standard generators.",
      },
    ],
    github: "https://github.com/ronakgupta03/RNG",
    caseStudy: "/work/rng-security",
  },
  {
    id: "games-sdl2",
    title: "Games Using SDL2",
    tagline: "Native C Desktop Game Development & Custom Physics Engine",
    period: "2024",
    badge: "LOW-LEVEL C",
    stack: ["C", "SDL2", "Fixed Timestep 60 FPS", "AABB Physics", "Manual Memory Control", "Tilemap Blitting"],
    diagram: "/images/projects/games-sdl2.svg",
    diagramTitle: "SDL2 ENGINE // 60 FPS FIXED TIMESTEP & AABB PHYSICS PIPELINE",
    problem:
      "High-level game engines abstract away the hardware interaction, rendering pipeline, frame timing synchronization, and memory layout. Native C development requires managing every byte, surface texture, and CPU cycle directly.",
    systemDesign:
      "A native 2D game engine developed in pure C with SDL2, featuring a 60 FPS deterministic fixed-timestep game loop, custom AABB collision detection, and zero-leak dynamic memory allocation verified via Valgrind.",
    pipeline: [
      {
        step: "01",
        title: "Engine Init",
        description: "Configures SDL2 video, audio, and hardware-accelerated 2D renderer contexts.",
      },
      {
        step: "02",
        title: "Fixed Timestep Loop",
        description: "Implements accumulator-based game loop preventing delta-time floating point desynchronization.",
      },
      {
        step: "03",
        title: "Event Dispatcher",
        description: "Captures raw keyboard, mouse, and window state events with non-blocking polling.",
      },
      {
        step: "04",
        title: "AABB Collision",
        description: "Computes axis-aligned bounding box intersections and resolves tilemap boundary contacts.",
      },
      {
        step: "05",
        title: "Memory Teardown",
        description: "Tracks heap allocations, texture surfaces, and audio buffers with zero Valgrind leaks.",
      },
    ],
    github: "https://github.com/ronakgupta03/Games_in_SDL2",
    caseStudy: "/work/games-sdl2",
  },
];

export const InteractiveProjectGrid: React.FC = () => {
  // Default to schemaforge so it is immediately open, but clicking ANY project switches to it!
  const [selectedId, setSelectedId] = useState<string | null>("schemaforge");
  const showcaseRef = useRef<HTMLDivElement | null>(null);

  const selectedProject = PROJECTS.find((p) => p.id === selectedId);

  const handleCardClick = (id: string) => {
    if (selectedId === id) {
      // Toggle collapse if clicking the currently active one
      setSelectedId(null);
    } else {
      setSelectedId(id);
      setTimeout(() => {
        if (showcaseRef.current) {
          showcaseRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 50);
    }
  };

  return (
    <div className={styles.wrapper} id="projects">
      <div className={styles.sectionHeader}>
        <div className={styles.titleGroup}>
          <span className={styles.terminalDot} />
          <TextScramble text="Featured Projects" as="h2" prefix="> " className={styles.sectionTitle} />
        </div>
        <span className={styles.subtitleHint}>[ Click any project for architecture deep-dive ]</span>
      </div>

      {/* Grid of 5 Project Cards (Exactly like user Image #1) */}
      <div className={styles.cardsGrid}>
        {PROJECTS.map((proj) => {
          const isActive = selectedId === proj.id;
          return (
            <div
              key={proj.id}
              className={`${styles.card} ${isActive ? styles.activeCard : ""}`}
              onClick={() => handleCardClick(proj.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(proj.id);
                }
              }}
            >
              <div className={styles.cardTopRow}>
                <span className={styles.periodText}>{proj.period}</span>
                <span className={`${styles.expandBtn} ${isActive ? styles.activeExpandBtn : ""}`}>
                  {isActive ? "[-] Active Deep Dive" : "[+] Deep Dive"}
                </span>
              </div>

              <h3 className={styles.cardTitle}>{proj.title}</h3>
              <p className={styles.cardTagline}>{proj.tagline}</p>

              <div className={styles.tagsContainer}>
                {proj.stack.slice(0, 3).map((st) => (
                  <span key={st} className={styles.pillTag}>
                    {st}
                  </span>
                ))}
                {proj.stack.length > 3 && (
                  <span className={styles.morePill}>+{proj.stack.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* In-Place Architectural Deep-Dive Showcase (Smoothly renders in-document, avoiding parent transform clipping) */}
      {selectedProject && (
        <div ref={showcaseRef} className={styles.showcasePanel}>
          <div className={styles.showcaseHeader}>
            <div>
              <div className={styles.metaBadgeRow}>
                <span className={styles.showcasePeriod}>{selectedProject.period}</span>
                <span className={styles.badgePill}>{selectedProject.badge}</span>
                <span className={styles.liveStatus}>[STATUS: VERIFIED &amp; DOCUMENTED]</span>
              </div>
              <h2 className={styles.showcaseTitle}>{selectedProject.title}</h2>
              <p className={styles.showcaseTagline}>{selectedProject.tagline}</p>
            </div>

            <button
              type="button"
              className={styles.closeShowcaseBtn}
              onClick={() => setSelectedId(null)}
              title="Close Deep Dive"
            >
              [x] Close Deep Dive
            </button>
          </div>

          <div className={styles.allStackTags}>
            {selectedProject.stack.map((st) => (
              <span key={st} className={styles.fullTag}>
                {st}
              </span>
            ))}
          </div>

          {/* Architecture Vector Blueprint */}
          <div className={styles.diagramCard}>
            <div className={styles.diagramTopBar}>
              <span className={styles.cyanDot} />
              <span>{selectedProject.diagramTitle}</span>
            </div>
            <img
              src={selectedProject.diagram}
              alt={`${selectedProject.title} Architecture Diagram`}
              className={styles.diagramImg}
            />
          </div>

          {/* Problem Statement & Architecture Details */}
          <div className={styles.detailsTwoCol}>
            <div className={styles.narrativeBox}>
              <h4>Problem Statement</h4>
              <p>{selectedProject.problem}</p>
            </div>

            <div className={styles.narrativeBox}>
              <h4>System Architecture &amp; Execution</h4>
              <p>{selectedProject.systemDesign}</p>
            </div>
          </div>

          {/* 5-Stage Technical Pipeline */}
          <div className={styles.pipelineContainer}>
            <h4>System Architecture Stages</h4>
            <div className={styles.pipelineGrid}>
              {selectedProject.pipeline.map((p) => (
                <div key={p.step} className={styles.pipelineCard}>
                  <span className={styles.stepNumber}>{p.step}</span>
                  <strong>{p.title}</strong>
                  <p>{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Actions */}
          <div className={styles.actionsBar}>
            {selectedProject.github && (
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.actionLink} ${styles.primaryAction}`}
              >
                GitHub Repository &rarr;
              </a>
            )}
            {selectedProject.caseStudy && (
              <a href={selectedProject.caseStudy} className={styles.actionLink}>
                Full Technical Case Study &rarr;
              </a>
            )}
            {selectedProject.live && (
              <a
                href={selectedProject.live}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionLink}
              >
                Live Production URL &rarr;
              </a>
            )}
            <button
              type="button"
              className={styles.secondaryCloseBtn}
              onClick={() => setSelectedId(null)}
            >
              [x] Close Deep Dive
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
