import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "../../lib/gsap";
import { PanelContext } from "./PanelContext";
import t from "../Transition/Transition.module.css";
import styles from "./Fullpage.module.css";

export type PanelKind = "simple" | "scroll" | "horizontal";

export interface PanelDef {
  id: string;
  kind: PanelKind;
  transparent?: boolean;
  node: ReactNode;
}

interface FullpageCtx {
  navigate: (target: string | number) => void;
  goToIndex: (i: number) => void;
}

const Ctx = createContext<FullpageCtx | null>(null);

export function useFullpage(): FullpageCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useFullpage must be used within <Fullpage>");
  return c;
}

/** Keep the legacy name working for components that used the wipe navigator. */
export const useTransition = useFullpage;

function setProgress(panel: HTMLElement, h: number, stepsLen: number) {
  const bar = panel.querySelector<HTMLElement>("[data-progress-bar]");
  const count = panel.querySelector<HTMLElement>("[data-progress-count]");
  if (bar) bar.style.transform = `scaleX(${stepsLen > 1 ? h / (stepsLen - 1) : 1})`;
  if (count) {
    const cards = panel.querySelectorAll("[data-card]").length || stepsLen;
    const cur = Math.min(cards, Math.max(1, h));
    count.textContent = `${String(cur).padStart(2, "0")} / ${String(cards).padStart(2, "0")}`;
  }
}

interface FullpageProps {
  panels: PanelDef[];
  loaded: boolean;
  menuOpen: boolean;
  /** When true, the controller ignores input (e.g. terminal overlay open). */
  terminalOpen?: boolean;
  /** Fires with the active panel id whenever the page changes. */
  onActiveChange?: (id: string) => void;
  children?: ReactNode; // navbar / menu rendered inside the provider
}

export default function Fullpage({
  panels,
  loaded,
  menuOpen,
  terminalOpen = false,
  onActiveChange,
  children,
}: FullpageProps) {
  const [active, setActive] = useState(0);

  // Panel ids/kinds/length are stable; only the hero node changes with `loaded`.
  // Keep a ref so the controller effect never has to re-bind its listeners.
  const panelsRef = useRef(panels);
  panelsRef.current = panels;

  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const activeRef = useRef(0);
  const animatingRef = useRef(false);
  const hIndexRef = useRef(0);
  const lastStepRef = useRef(0);
  const loadedRef = useRef(loaded);
  const menuRef = useRef(menuOpen);
  const terminalRef = useRef(terminalOpen);
  loadedRef.current = loaded;
  menuRef.current = menuOpen;
  terminalRef.current = terminalOpen;

  // Imperative navigation, stored in a ref so DOM handlers stay fresh.
  const goRef = useRef<(i: number) => void>(() => {});
  const navRef = useRef<(target: string | number) => void>(() => {});

  // Notify the host (e.g. to pause the hero WebGL loop off the hero page).
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;
  useEffect(() => {
    onActiveChangeRef.current?.(panelsRef.current[active].id);
  }, [active]);

  // Reset the panel that just became active (under the wipe cover).
  useEffect(() => {
    hIndexRef.current = 0;
    const panel = panelRefs.current[active];
    if (!panel) return;
    if (panelsRef.current[active].kind === "horizontal") {
      const track = panel.querySelector<HTMLElement>("[data-track]");
      if (track) gsap.set(track, { x: 0 });
      const steps = track?.querySelectorAll("[data-hstep]").length ?? 0;
      setProgress(panel, 0, steps);
    } else {
      panel.scrollTop = 0;
    }
  }, [active]);

  useEffect(() => {
    const runWipe = (action: () => void, onDone: () => void) => {
      const overlay = overlayRef.current;
      const label = labelRef.current;
      const tl = gsap.timeline({ onComplete: onDone });
      tl.set(overlay, { display: "block", yPercent: 100 })
        .set(label, { yPercent: 40, opacity: 0 })
        .to(overlay, { yPercent: 0, duration: 0.6, ease: "power4.inOut" })
        .to(label, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, "-=0.3")
        .add(action)
        .to(label, { opacity: 0, duration: 0.2 }, "+=0.05")
        .to(overlay, { yPercent: -100, duration: 0.6, ease: "power4.inOut" })
        .set(overlay, { display: "none" });
    };

    const go = (idx: number) => {
      const clamped = Math.min(panelsRef.current.length - 1, Math.max(0, idx));
      if (clamped === activeRef.current || animatingRef.current) return;
      animatingRef.current = true;
      activeRef.current = clamped;
      runWipe(
        () => setActive(clamped),
        () => {
          animatingRef.current = false;
          lastStepRef.current = performance.now();
        }
      );
    };
    goRef.current = go;

    navRef.current = (target) => {
      if (typeof target === "number") return go(target);
      const id = target.replace("#", "");
      const i = panelsRef.current.findIndex((p) => p.id === id);
      if (i >= 0) go(i);
    };

    const ready = () =>
      loadedRef.current &&
      !menuRef.current &&
      !animatingRef.current &&
      performance.now() - lastStepRef.current > 60;

    const stepHorizontal = (dir: number) => {
      const i = activeRef.current;
      const panel = panelRefs.current[i];
      const track = panel?.querySelector<HTMLElement>("[data-track]");
      const steps = track
        ? Array.from(track.querySelectorAll<HTMLElement>("[data-hstep]"))
        : [];
      if (!panel || !track || !steps.length) return go(i + dir);

      const h = hIndexRef.current + dir;
      if (h < 0) return go(i - 1);
      if (h > steps.length - 1) return go(i + 1);

      hIndexRef.current = h;
      animatingRef.current = true;
      const gutter = steps[0].offsetLeft;
      gsap.to(track, {
        x: -(steps[h].offsetLeft - gutter),
        duration: 0.9,
        ease: "expo.out",
        onComplete: () => {
          animatingRef.current = false;
          lastStepRef.current = performance.now();
        },
      });
      setProgress(panel, h, steps.length);
    };

    const advance = (dir: number) => {
      const kind = panelsRef.current[activeRef.current].kind;
      if (kind === "horizontal") stepHorizontal(dir);
      else go(activeRef.current + dir);
    };

    const atEdge = (panel: HTMLElement, dir: number) => {
      if (dir > 0) return panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 2;
      return panel.scrollTop <= 2;
    };

    const onWheel = (e: WheelEvent) => {
      // Terminal open: let wheel reach the terminal (its output scrolls
      // natively); don't preventDefault or advance panels.
      if (terminalRef.current) return;
      if (!loadedRef.current || menuRef.current) {
        e.preventDefault();
        return;
      }
      const i = activeRef.current;
      const kind = panelsRef.current[i].kind;
      const panel = panelRefs.current[i];
      const dir = e.deltaY > 0 ? 1 : -1;

      // Tall pages scroll internally until their edge, then advance.
      if (kind === "scroll" && panel && !atEdge(panel, dir)) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      if (!ready()) return;
      advance(dir);
    };

    let touchX = 0;
    let touchY = 0;
    let touchPanelScroll = true;
    const onTouchStart = (e: TouchEvent) => {
      if (terminalRef.current) return;
      touchY = e.touches[0]?.clientY ?? 0;
      touchX = e.touches[0]?.clientX ?? 0;
      const i = activeRef.current;
      touchPanelScroll = panelsRef.current[i].kind === "scroll";
    };
    const onTouchMove = (e: TouchEvent) => {
      if (terminalRef.current) return;
      // Let tall pages scroll natively; block elsewhere so we can step.
      if (!touchPanelScroll) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (terminalRef.current) return;
      if (!loadedRef.current || menuRef.current) return;
      const i = activeRef.current;
      const kind = panelsRef.current[i].kind;

      if (kind === "horizontal") {
        // Horizontal panels respond to left/right swipes.
        const dx = touchX - (e.changedTouches[0]?.clientX ?? touchX);
        if (Math.abs(dx) < 35) return;
        if (!ready()) return;
        advance(dx > 0 ? 1 : -1);
      } else {
        const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
        if (Math.abs(dy) < 35) return;
        const dir = dy > 0 ? 1 : -1;
        const panel = panelRefs.current[i];
        if (kind === "scroll" && panel && !atEdge(panel, dir)) return;
        if (!ready()) return;
        advance(dir);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (terminalRef.current || menuRef.current || !loadedRef.current) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key)) {
        e.preventDefault();
        if (ready()) advance(1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        if (ready()) advance(-1);
      }
    };

    const opts = { passive: false, capture: true } as AddEventListenerOptions;
    window.addEventListener("wheel", onWheel, opts);
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, opts);
    window.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel, opts);
      window.removeEventListener("touchstart", onTouchStart, { capture: true } as AddEventListenerOptions);
      window.removeEventListener("touchmove", onTouchMove, opts);
      window.removeEventListener("touchend", onTouchEnd, { capture: true } as AddEventListenerOptions);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <Ctx.Provider
      value={{
        navigate: (target) => navRef.current(target),
        goToIndex: (i) => goRef.current(i),
      }}
    >
      {children}

      <div className={styles.deck}>
        {panels.map((p, i) => (
          <section
            key={p.id}
            id={p.id}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            data-active={i === active}
            className={`${styles.panel} ${styles[p.kind]} ${
              p.transparent ? styles.transparent : ""
            }`}
          >
            <PanelContext.Provider value={{ active: i === active }}>
              {p.node}
            </PanelContext.Provider>
          </section>
        ))}
      </div>

      <div ref={overlayRef} className={t.overlay} aria-hidden="true">
        <span ref={labelRef} className={t.label}>
          LGF
        </span>
      </div>
    </Ctx.Provider>
  );
}
