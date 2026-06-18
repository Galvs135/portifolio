import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { aliases, getCommands, type TermLine } from "./commands";
import { useLang, type Lang } from "../../i18n/LanguageContext";
import styles from "./Terminal.module.css";

const PROMPT = "PS C:\\Users\\lucas>";
const RESUME_FILE = "Lucas_Galvao_Resume_English.pdf";

export type TerminalView = "terminal" | "site";

interface TerminalProps {
  view: TerminalView;
  modalOpen: boolean;
  onView: (view: TerminalView) => void;
  onModalOpen: (open: boolean) => void;
}

interface Entry {
  id: number;
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
  const { lang, setLang } = useLang();
  const fullscreen = view === "terminal";
  const shown = fullscreen || modalOpen;

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Entry[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const runRef = useRef<(raw: string) => void>(() => {});
  const nextId = () => ++idRef.current;

  const buildHelp = (lng: Lang): ReactNode => {
    const cmds = getCommands(lng);
    return (
      <div>
        <div className={styles.line}>
          {lng === "pt" ? "Comandos disponíveis:" : "Available commands:"}
        </div>
        <div className={styles.line}>&nbsp;</div>
        {Object.entries(cmds).map(([name, c]) => (
          <div key={name} className={styles.line}>
            <button
              type="button"
              className={styles.cmdChip}
              onClick={() => runRef.current(name)}
              data-cursor="hover"
            >
              {name}
            </button>
            <span className={styles.dim}> — {c.description}</span>
          </div>
        ))}
      </div>
    );
  };

  const runCommand = useCallback(
    (raw: string) => {
      const pick = (en: string, pt: string) => (lang === "pt" ? pt : en);
      const typed = raw.trim().toLowerCase();
      const name = aliases[typed] ?? typed;
      const cmds = getCommands(lang);
      setInput("");
      inputRef.current?.focus();

      const push = (output: ReactNode) =>
        setHistory((h) => [...h, { id: nextId(), input: raw, output }]);

      // --- side-effect commands ---
      if (name === "clear") return setHistory([]);
      if (name === "exit") {
        push(null);
        if (view === "terminal") onView("site");
        else onModalOpen(false);
        return;
      }
      if (name === "site") {
        push(
          <div className={styles.line}>
            {pick("Loading portfolio…", "Carregando portfólio…")}{" "}
            <span className={styles.dim}>
              {pick("(type 'terminal' to come back)", "(digite 'terminal' para voltar)")}
            </span>
          </div>
        );
        onModalOpen(false);
        onView("site");
        return;
      }
      if (name === "terminal") {
        if (view === "terminal") {
          push(
            <div className={styles.line}>
              {pick("Already in the terminal.", "Você já está no terminal.")}
            </div>
          );
        } else {
          push(null);
          onView("terminal");
        }
        return;
      }
      if (name === "ptbr") {
        setLang("pt");
        push(<div className={styles.line}>Idioma alterado para Português (BR).</div>);
        return;
      }
      if (name === "en") {
        setLang("en");
        push(<div className={styles.line}>Language switched to English.</div>);
        return;
      }
      if (name === "resume") {
        downloadResume();
        push(
          <div className={styles.line}>
            {pick("Downloading resume…", "Baixando currículo…")}{" "}
            <span className={styles.dim}>({RESUME_FILE})</span>
          </div>
        );
        return;
      }

      // --- output commands ---
      if (name === "") return push(null);
      if (name === "help") return push(buildHelp(lang));
      if (cmds[name]?.lines) return push(<>{renderLines(cmds[name].lines!)}</>);
      push(
        <div className={`${styles.line} ${styles.error}`}>
          {pick("command not recognized", "comando não reconhecido")}: "{typed}" —{" "}
          {pick("type 'help'.", "digite 'help'.")}
        </div>
      );
    },
    [lang, setLang, view, onView, onModalOpen]
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
              input: null,
              output: (
                <div>
                  <div className={`${styles.line} ${styles.accent}`}>
                    Windows PowerShell — Lucas G. França
                  </div>
                  <div className={`${styles.line} ${styles.dim}`}>
                    {lang === "pt"
                      ? "Digite 'help' para listar os comandos disponíveis."
                      : "Type 'help' to list the available commands."}
                  </div>
                </div>
              ),
            },
          ]
    );
  }, [shown, lang]);

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
              <span className={styles.prompt}>{PROMPT}</span>
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
        <span className={styles.prompt}>{PROMPT}</span>
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

  // Full-screen terminal: edge-to-edge, no chrome.
  if (fullscreen) {
    return (
      <div className={styles.fullscreen} role="dialog" aria-label="Terminal">
        {consoleBody}
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
