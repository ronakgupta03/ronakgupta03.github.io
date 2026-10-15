"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./TerminalWindow.module.scss";

interface OutputLine {
  id: string;
  type: "user" | "bot" | "system" | "error" | "success";
  text: string | React.ReactNode;
}

const INITIAL_LINES: OutputLine[] = [
  {
    id: "init-1",
    type: "system",
    text: "Initializing Ronak_OS v2.4... Kernel: Linux x86_64 / Systems & AI Engine",
  },
  {
    id: "init-2",
    type: "bot",
    text: (
      <>
        Welcome to <strong>Ronak Gupta&apos;s</strong> interactive terminal! <br />
        Type <code className={styles.codeTag}>help</code> for commands or click quick suggestions below.
        <br />
        <span style={{ color: "#94a3b8", fontSize: "0.85em" }}>
          [Tip: Type <code className={styles.codeTag}>/mail your message</code> to email Ronak directly]
        </span>
      </>
    ),
  },
];

export const TerminalWindow: React.FC = () => {
  const [lines, setLines] = useState<OutputLine[]>(INITIAL_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = (type: OutputLine["type"], text: string | React.ReactNode) => {
    setLines((prev) => [...prev, { id: `line-${Date.now()}-${Math.random()}`, type, text }]);
  };

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Add command to history
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    // Echo user input
    addLine("user", cmd);

    const lower = cmd.toLowerCase();

    // /mail handler
    if (cmd.startsWith("/mail")) {
      const message = cmd.replace("/mail", "").trim();
      if (!message) {
        addLine("error", "Usage: /mail <your message here>");
        return;
      }

      addLine("system", "Preparing email dispatch...");
      const mailtoUrl = `mailto:ronakgupta3305@gmail.com?subject=${encodeURIComponent(
        "Message via Portfolio Terminal"
      )}&body=${encodeURIComponent(message)}`;
      window.open(mailtoUrl, "_blank");
      addLine(
        "success",
        <>
          SUCCESS: Opening mail client with recipient: <strong>ronakgupta3305@gmail.com</strong>
        </>
      );
      return;
    }

    switch (lower) {
      case "help":
      case "?":
        addLine(
          "bot",
          <div className={styles.helpGrid}>
            <div><span className={styles.cmd}>about</span> - Bio &amp; core engineering interests</div>
            <div><span className={styles.cmd}>projects</span> - Highlighted systems, AI, and CS work</div>
            <div><span className={styles.cmd}>skills</span> - Programming languages, databases &amp; frameworks</div>
            <div><span className={styles.cmd}>cp</span> - Competitive programming &amp; Codeforces rating</div>
            <div><span className={styles.cmd}>education</span> - VIPS-TC, NPTEL, IOQM details</div>
            <div><span className={styles.cmd}>contact</span> - Email, LinkedIn, GitHub links</div>
            <div><span className={styles.cmd}>/mail &lt;msg&gt;</span> - Send a direct email to Ronak</div>
            <div><span className={styles.cmd}>clear</span> - Clear the terminal output</div>
          </div>
        );
        break;

      case "about":
        addLine(
          "bot",
          <div>
            <strong>Ronak Gupta</strong> &middot; 3rd-year CS Engineering student at Vivekananda Institute of Professional Studies (VIPS-TC).<br />
            Deeply passionate about <strong>systems engineering</strong>, <strong>database internals</strong>, <strong>AI/ML algorithms</strong>, and <strong>competitive programming</strong>.<br />
            Driven by building software from scratch to understand what happens beneath the abstractions (e.g. custom database engines with B+ Trees &amp; WAL, cryptographic randomness analysis with NIST suites).
          </div>
        );
        break;

      case "projects":
        addLine(
          "bot",
          <div className={styles.projectsList}>
            <div>
              <strong>1. SchemaForge</strong> [Python, TrueForge, PostgreSQL, AST, Alembic, Sandboxing]<br />
              Autonomous, AST-aware zero-downtime DB migration &amp; refactoring agent. Builds deterministic impact graphs and validates zero-downtime schema evolution.
            </div>
            <div>
              <strong>2. MiniRelDB</strong> [Java, B+ Trees, WAL, SQL Execution]<br />
              Custom relational database engine from scratch. Implemented page-based storage, B+ Tree index, write-ahead logging (WAL) recovery, and SQL query execution.
            </div>
            <div>
              <strong>3. TuxPages</strong> [PostgreSQL, SMTP/TLS, JWT Authentication, Full Stack]<br />
              Technical research journal with dynamic content publishing, multi-role auth, and secure SMTP notifications. (50+ users, 20+ publications).
            </div>
            <div>
              <strong>4. Random Number Generators: Security Analysis</strong> [Python, C/C++, BLAKE3, NIST SP 800-22]<br />
              Research &amp; empirical analysis of CSPRNG implementations, entropy mixing, and 17/17 NIST statistical randomness tests.
            </div>
            <div>
              <strong>5. Games Using SDL2</strong> [C, SDL2, Game Loops, Memory Management]<br />
              Native C desktop games built from scratch with custom frame timing, event loops, and manual memory layouts.
            </div>
          </div>
        );
        break;

      case "skills":
        addLine(
          "bot",
          <div>
            <div><strong>Languages:</strong> C, C++, Python, Java, PHP, JavaScript, Assembly, Bash</div>
            <div><strong>Databases:</strong> PostgreSQL, MySQL</div>
            <div><strong>AI / ML / Data:</strong> NumPy, pandas, matplotlib, scikit-learn, OpenCV, YOLO</div>
            <div><strong>Tools &amp; Systems:</strong> Git, Arch Linux, Vim, VS Code, Arduino, LaTeX</div>
            <div><strong>Focus Areas:</strong> Database Internals, Low-Level Systems, Cryptographic Algorithms, CP</div>
          </div>
        );
        break;

      case "cp":
      case "codeforces":
      case "rating":
        addLine(
          "bot",
          <div>
            <strong>Codeforces Profile:</strong> <a href="https://codeforces.com/profile/the.ronak.gupta" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "underline" }}>@the.ronak.gupta</a><br />
            <strong>Current Rating:</strong> 1240 | <strong>Peak Rating:</strong> 1246 (Rank: Pupil)<br />
            <strong>Problems Solved:</strong> 281+ algorithmic problems across Codeforces, CodeChef, and AtCoder<br />
            <strong>Certifications:</strong> NPTEL Getting Started with CP (IIT Gandhinagar), IOQM 2023 Qualifier.
          </div>
        );
        break;

      case "education":
        addLine(
          "bot",
          <div>
            <div><strong>B.Tech in Computer Science &amp; Engineering</strong> (2024&ndash;2028)</div>
            <div style={{ color: "#94a3b8" }}>Vivekananda Institute of Professional Studies (VIPS-TC) &middot; CGPA: 8.804</div>
            <br />
            <div><strong>Certifications &amp; Honors:</strong></div>
            <div>&bull; NPTEL Mathematical Foundations for ML (IISc Bangalore) &mdash; Elite Certificate</div>
            <div>&bull; NPTEL Getting Started with Competitive Programming (IIT Gandhinagar)</div>
            <div>&bull; IIT Roorkee Summer Training in Cyber Security and AI/ML (2025)</div>
            <div>&bull; IOQM &mdash; Indian Olympiad Qualifier in Mathematics (2023)</div>
          </div>
        );
        break;

      case "contact":
        addLine(
          "bot",
          <div>
            <div><strong>Email:</strong> <a href="mailto:ronakgupta3305@gmail.com" style={{ color: "#60a5fa" }}>ronakgupta3305@gmail.com</a></div>
            <div><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/ronak-gupta-760563215/" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>linkedin.com/in/ronak-gupta-760563215</a></div>
            <div><strong>GitHub:</strong> <a href="https://github.com/ronakgupta03" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>github.com/ronakgupta03</a></div>
            <div><strong>Resume:</strong> <a href="/Ronak_Resume.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>View / Download Resume (PDF)</a></div>
          </div>
        );
        break;

      case "clear":
      case "cls":
        setLines([]);
        break;

      case "sudo":
        addLine("error", "Permission denied: user 'guest' is not in the sudoers file. Nice try! :)");
        break;

      default:
        // Context-aware query answering
        if (lower.includes("schemaforge") || lower.includes("migration") || lower.includes("refactor")) {
          addLine(
            "bot",
            "SchemaForge is Ronak's autonomous, AST-aware database migration & refactoring agent built on TrueForge. It maps database schemas to application code ASTs, verifies migrations in Daytona sandboxes, and guarantees zero-downtime safe rollouts behind a human approval gate!"
          );
        } else
        if (lower.includes("minireldb") || lower.includes("database")) {
          addLine(
            "bot",
            "MiniRelDB is Ronak's custom relational database engine written in Java from scratch. It features page-based buffer pooling, B+ Tree indexing, write-ahead logging (WAL) for crash recovery, and execution of SQL SELECT, INSERT, and UPDATE queries!"
          );
        } else if (lower.includes("tuxpages")) {
          addLine(
            "bot",
            "TuxPages is a full-stack technical research journal Ronak co-developed with PostgreSQL, custom authentication, secure SMTP mailing, and Markdown blog publishing for researchers and students."
          );
        } else if (lower.includes("hire") || lower.includes("internship") || lower.includes("job")) {
          addLine(
            "success",
            "Ronak is actively seeking Software Engineering & Systems / AI/ML internships! Feel free to reach out via 'contact' or email him at ronakgupta3305@gmail.com."
          );
        } else if (lower.includes("college") || lower.includes("school") || lower.includes("degree")) {
          addLine(
            "bot",
            "Ronak is currently a 3rd-year B.Tech Computer Science student at VIPS-TC (Vivekananda Institute of Professional Studies), maintaining an 8.804 CGPA."
          );
        } else {
          addLine(
            "error",
            `Command not recognized: "${cmd}". Type "help" to see valid commands or ask about his projects, skills, or CP.`
          );
        }
        break;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < history.length) {
          setHistoryIndex(nextIdx);
          setInput(history[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInput("");
        }
      }
    }
  };

  const quickCommands = ["help", "about", "projects", "skills", "cp", "contact", "clear"];

  return (
    <div className={`${styles.terminalWrapper} ${isMaximized ? styles.maximized : ""}`} id="terminal">
      <div className={styles.terminalHeader}>
        <div className={styles.terminalButtons}>
          <button
            type="button"
            className={`${styles.button} ${styles.close}`}
            onClick={() => setLines([])}
            title="Clear terminal"
            aria-label="Clear terminal"
          />
          <button
            type="button"
            className={`${styles.button} ${styles.minimize}`}
            onClick={() => setIsMinimized(!isMinimized)}
            title="Toggle minimize"
            aria-label="Toggle minimize"
          />
          <button
            type="button"
            className={`${styles.button} ${styles.maximize}`}
            onClick={() => setIsMaximized(!isMaximized)}
            title="Toggle maximize"
            aria-label="Toggle maximize"
          />
        </div>
        <div className={styles.terminalTitle}>Ask me anything &mdash; guest@ronak.dev</div>
        <div className={styles.sysStatus}>bash 5.2</div>
      </div>

      {!isMinimized && (
        <>
          <div
            ref={bodyRef}
            className={styles.terminalBody}
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line) => (
              <div key={line.id} className={`${styles.line} ${styles[line.type]}`}>
                {line.type === "user" && <span className={styles.prompt}>guest@ronak.dev:~$ </span>}
                <span className={styles.content}>{line.text}</span>
              </div>
            ))}

            <div className={styles.inputLine}>
              <span className={styles.prompt}>guest@ronak.dev:~$ </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.terminalInput}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input prompt"
                placeholder="type a command (e.g. help)..."
              />
            </div>
          </div>

          <div className={styles.quickChips}>
            <span className={styles.chipsLabel}>Suggestions:</span>
            {quickCommands.map((q) => (
              <button
                key={q}
                type="button"
                className={styles.chip}
                onClick={() => {
                  handleCommand(q);
                  inputRef.current?.focus();
                }}
              >
                [{q}]
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
