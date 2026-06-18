import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { aliases, commands, type TermLine } from "./commands";
import styles from "./Terminal.module.css";

const PROMPT = "PS C:\\Users\\lucas>";

interface TerminalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  const cv = `Lucas Galvão França — Software Engineer
Belo Horizonte, Brasil

4 anos no ecossistema .NET (C#) construindo backends escaláveis,
microsserviços e automação. SOLID, Clean Architecture e DDD.
MBA em IA & Automação.

email: lg_franca@hotmail.com
github: https://github.com/galvs135
linkedin: https://www.linkedin.com/in/lucas-g-franca

(CV placeholder — substituir por um PDF real depois.)`;
  const blob = new Blob([cv], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Lucas-Galvao-Franca-CV.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Terminal({ open, onOpenChange }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Entry[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const runRef = useRef<(raw: string) => void>(() => {});
  const nextId = () => ++idRef.current;

  const buildHelp = (): ReactNode => (
    <div>
      <div className={styles.line}>Comandos disponíveis:</div>
      <div className={styles.line}>&nbsp;</div>
      {Object.entries(commands).map(([name, c]) => (
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

  const runCommand = useCallback(
    (raw: string) => {
      const typed = raw.trim().toLowerCase();
      const name = aliases[typed] ?? typed;
      setInput("");
      inputRef.current?.focus();

      if (name === "clear") {
        setHistory([]);
        return;
      }
      if (name === "exit") {
        onOpenChange(false);
        return;
      }

      let output: ReactNode = null;
      if (name === "") {
        output = null;
      } else if (name === "help") {
        output = buildHelp();
      } else if (name === "resume") {
        downloadResume();
        output = (
          <div className={styles.line}>
            Baixando currículo…{" "}
            <span className={styles.dim}>(Lucas-Galvao-Franca-CV.txt)</span>
          </div>
        );
      } else if (commands[name]?.lines) {
        output = <>{renderLines(commands[name].lines!)}</>;
      } else {
        output = (
          <div className={`${styles.line} ${styles.error}`}>
            comando não reconhecido: "{typed}" — digite 'help'.
          </div>
        );
      }

      setHistory((h) => [...h, { id: nextId(), input: raw, output }]);
    },
    [onOpenChange]
  );
  runRef.current = runCommand;

  // Seed only a short banner — no command list up front.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
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
                    Digite 'help' para ver os comandos disponíveis.
                  </div>
                </div>
              ),
            },
          ]
    );
  }, [open]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Auto-scroll to the latest output.
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  return (
    <>
      {!open && (
        <button
          type="button"
          className={styles.fab}
          onClick={() => onOpenChange(true)}
          data-cursor="hover"
          aria-label="Abrir terminal"
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

      {open && (
        <div
          className={styles.backdrop}
          onClick={() => onOpenChange(false)}
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
                  onClick={() => onOpenChange(false)}
                  data-cursor="hover"
                  aria-label="Fechar terminal"
                >
                  &#10005;
                </button>
              </div>
            </div>

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
          </div>
        </div>
      )}
    </>
  );
}
