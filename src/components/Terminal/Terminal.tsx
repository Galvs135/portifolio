import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { aliases, commands, type TermLine } from "./commands";
import styles from "./Terminal.module.css";

/** Folders the user can `cd` into (content commands), and root utilities. */
const FOLDERS = Object.keys(commands).filter((k) => commands[k].lines);
const UTILITIES = Object.keys(commands).filter((k) => commands[k].action);

const promptFor = (folder: string | null) =>
  `PS C:\\Users\\lucas${folder ? "\\" + folder : ""}>`;

export type TerminalView = "terminal" | "site";

interface TerminalProps {
  view: TerminalView;
  modalOpen: boolean;
  onView: (view: TerminalView) => void;
  onModalOpen: (open: boolean) => void;
}

interface Entry {
  id: number;
  /** Prompt shown for an echoed command (null for system output). */
  prompt: string | null;
  /** Echoed command, or null for system output (banner). */
  input: string | null;
  output: ReactNode;
}

function renderLines(lines: TermLine[]): ReactNode {
  return lines.map((l, i) => (
    <div key={i} className={`${styles.line} ${l.tone ? styles[l.tone] : ""}`}>
      {l.text || " "}
    </div>
  ));
}

const RESUME_FILE = "Lucas_Galvao_Resume_English.pdf";

function downloadResume() {
  const a = document.createElement("a");
  a.href = `/${RESUME_FILE}`;
  a.download = RESUME_FILE;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function Terminal({
  view,
  modalOpen,
  onView,
  onModalOpen,
}: TerminalProps) {
  const fullscreen = view === "terminal";
  const shown = fullscreen || modalOpen;

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Entry[]>([]);
  /** Current "folder"; null = root. While set, only `cd ..` is allowed. */
  const [cwd, setCwd] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const runRef = useRef<(raw: string) => void>(() => {});
  const nextId = () => ++idRef.current;

  // Directory listing: folders (cd into them) + root utilities.
  const buildDir = (): ReactNode => (
    <div>
      <div className={`${styles.line} ${styles.dim}`}>
        Directory: PS C:\Users\lucas
      </div>
      <div className={styles.line}>&nbsp;</div>
      {FOLDERS.map((name) => (
        <div key={name} className={styles.line}>
          <span className={styles.dirTag}>&lt;DIR&gt;</span>
          <button
            type="button"
            className={styles.cmdChip}
            onClick={() => runRef.current("cd " + name)}
            data-cursor="hover"
          >
            {name}
          </button>
          <span className={styles.dim}> — {commands[name].description}</span>
        </div>
      ))}
      <div className={styles.line}>&nbsp;</div>
      <div className={`${styles.line} ${styles.dim}`}>Commands:</div>
      {UTILITIES.map((name) => (
        <div key={name} className={styles.line}>
          <button
            type="button"
            className={styles.cmdChip}
            onClick={() => runRef.current(name)}
            data-cursor="hover"
          >
            {name}
          </button>
          <span className={styles.dim}> — {commands[name].description}</span>
        </div>
      ))}
    </div>
  );

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const lower = trimmed.toLowerCase();
      setInput("");
      inputRef.current?.focus();

      const atPrompt = promptFor(cwd);
      const push = (output: ReactNode) =>
        setHistory((h) => [
          ...h,
          { id: nextId(), prompt: atPrompt, input: raw, output },
        ]);

      if (lower === "") return push(null);

      const [verb, ...rest] = lower.split(/\s+/);
      const arg = rest.join(" ");

      // --- inside a folder: only `cd ..` works ---
      if (cwd !== null) {
        if (verb === "cd" && (arg === ".." || arg === "/")) {
          setCwd(null);
          return push(null);
        }
        return push(
          <div className={styles.line}>
            You're inside '{cwd}'. Type{" "}
            <span className={styles.accent}>cd ..</span> to go back.
          </div>
        );
      }

      // --- at root ---
      if (verb === "cd") {
        if (arg === "") {
          return push(
            <div className={`${styles.line} ${styles.dim}`}>
              usage: cd &lt;folder&gt; — type 'dir' to list folders.
            </div>
          );
        }
        if (arg === ".." || arg === "." || arg === "/") {
          return push(<div className={styles.line}>Already at root.</div>);
        }
        const folder = aliases[arg] ?? arg;
        if (FOLDERS.includes(folder)) {
          setCwd(folder);
          return push(<>{renderLines(commands[folder].lines!)}</>);
        }
        return push(
          <div className={`${styles.line} ${styles.error}`}>
            cd: no such folder: '{arg}' — type 'dir'.
          </div>
        );
      }

      const name = aliases[lower] ?? lower;

      // --- root utilities ---
      if (name === "clear") return setHistory([]);
      if (name === "exit") {
        push(null);
        if (view === "terminal") onView("site");
        else onModalOpen(false);
        return;
      }
      if (name === "terminal") {
        if (view === "terminal") {
          push(<div className={styles.line}>Already in the terminal.</div>);
        } else {
          push(null);
          onView("terminal");
        }
        return;
      }
      if (name === "resume") {
        downloadResume();
        return push(
          <div className={styles.line}>
            Downloading resume…{" "}
            <span className={styles.dim}>({RESUME_FILE})</span>
          </div>
        );
      }
      if (name === "dir" || name === "ls" || name === "help") {
        return push(buildDir());
      }

      // bare folder name without `cd`
      if (FOLDERS.includes(name)) {
        return push(
          <div className={styles.line}>
            '{name}' is a folder — open it with{" "}
            <span className={styles.accent}>cd {name}</span>.
          </div>
        );
      }

      // unknown
      push(
        <div className={`${styles.line} ${styles.error}`}>
          command not recognized: "{trimmed}" — type 'dir'.
        </div>
      );
    },
    [cwd, view, onView, onModalOpen]
  );
  runRef.current = runCommand;

  // Focus the input whenever the console is shown (boot, modal open, or
  // switching back to full screen) so the user can type right away.
  useEffect(() => {
    if (!shown) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [view, modalOpen, shown]);

  // Seed the banner once the console is shown.
  useEffect(() => {
    if (!shown) return;
    setHistory((h) =>
      h.length
        ? h
        : [
            {
              id: nextId(),
              prompt: null,
              input: null,
              output: (
                <div>
                  <div className={`${styles.line} ${styles.accent}`}>
                    Windows PowerShell — Lucas G. França
                  </div>
                  <div className={`${styles.line} ${styles.dim}`}>
                    Type 'dir' to list folders, then 'cd &lt;folder&gt;' to open
                    one.
                  </div>
                </div>
              ),
            },
          ]
    );
  }, [shown]);

  // Esc closes the modal (only meaningful over the site).
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, onModalOpen]);

  // Auto-scroll to the latest output.
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const consoleBody = (
    <div className={styles.body} ref={outputRef}>
      {history.map((e) => (
        <div key={e.id} className={styles.entry}>
          {e.input != null && (
            <div className={styles.promptLine}>
              <span className={styles.prompt}>{e.prompt}</span>
              <span className={styles.cmdEcho}>{e.input}</span>
            </div>
          )}
          {e.output}
        </div>
      ))}

      <div
        className={styles.inputLine}
        onClick={() => inputRef.current?.focus()}
      >
        <span className={styles.prompt}>{promptFor(cwd)}</span>
        <span className={styles.inputText}>{input}</span>
        <span className={styles.caret} aria-hidden="true" />
        <input
          ref={inputRef}
          className={styles.hiddenInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              runCommand(input);
            }
          }}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="Terminal input"
        />
      </div>
    </div>
  );

  // Full-screen terminal: edge-to-edge, theme toggle + "open portfolio" button.
  if (fullscreen) {
    return (
      <div className={styles.fullscreen} role="dialog" aria-label="Terminal">
        {consoleBody}

        <button
          type="button"
          className={styles.fab}
          onClick={() => onView("site")}
          data-cursor="hover"
          aria-label="Open portfolio"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <circle cx="6" cy="6.8" r="0.5" fill="currentColor" />
            <circle cx="8.2" cy="6.8" r="0.5" fill="currentColor" />
          </svg>
        </button>
      </div>
    );
  }

  // Site view: floating button + modal window.
  return (
    <>
      {!modalOpen && (
        <button
          type="button"
          className={styles.fab}
          onClick={() => onModalOpen(true)}
          data-cursor="hover"
          aria-label="Open terminal"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
            <path d="M6.5 9.5 L9.5 12 L6.5 14.5" />
            <line x1="11.5" y1="15" x2="15.5" y2="15" />
          </svg>
        </button>
      )}

      {modalOpen && (
        <div
          className={styles.backdrop}
          onClick={() => onModalOpen(false)}
          role="presentation"
        >
          <div
            className={styles.window}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Windows PowerShell"
          >
            <div className={styles.titlebar}>
              <span className={styles.title}>Windows PowerShell</span>
              <div className={styles.controls}>
                <span className={styles.ctl} aria-hidden="true">
                  &#8211;
                </span>
                <span className={styles.ctl} aria-hidden="true">
                  &#9633;
                </span>
                <button
                  type="button"
                  className={`${styles.ctl} ${styles.close}`}
                  onClick={() => onModalOpen(false)}
                  data-cursor="hover"
                  aria-label="Close terminal"
                >
                  &#10005;
                </button>
              </div>
            </div>

            {consoleBody}
          </div>
        </div>
      )}
    </>
  );
}
