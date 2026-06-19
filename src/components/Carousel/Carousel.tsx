import { useState, type CSSProperties, type ReactNode } from "react";
import styles from "./Carousel.module.css";

export interface CarouselItem {
  key: string;
  node: ReactNode;
}

interface CarouselProps {
  items: CarouselItem[];
  /** Fixed section intro (heading) rendered in the top-left corner. */
  intro?: ReactNode;
}

/**
 * Coverflow carousel: the active card is centred and large, the previous/next
 * peek smaller and dimmed on the sides. Clicking the right half advances and
 * the left half goes back (clamped at the ends). The wheel is NOT handled here,
 * so the Fullpage controller is free to advance to the next section.
 */
const SHIFT = 60; // % of card width each neighbour is pushed sideways
const TILT = 22; // deg of coverflow rotation for neighbours

export default function Carousel({ items, intro }: CarouselProps) {
  const n = items.length;
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(n - 1, i + 1));

  const canPrev = index > 0;
  const canNext = index < n - 1;

  return (
    <div className={styles.deck}>
      {intro && <div className={styles.intro}>{intro}</div>}

      <div className={styles.stage}>
        {items.map((it, i) => {
          const o = i - index;
          const abs = Math.abs(o);
          const active = o === 0;
          const rot = active ? 0 : o < 0 ? TILT : -TILT;
          const style: CSSProperties = {
            transform: `translate(-50%, -50%) translateX(${o * SHIFT}%) scale(${
              active ? 1 : 0.82
            }) rotateY(${rot}deg)`,
            opacity: abs >= 2 ? 0 : active ? 1 : 0.55,
            zIndex: 100 - abs,
            pointerEvents: active ? "auto" : "none",
          };
          return (
            <div
              key={it.key}
              className={styles.card}
              style={style}
              aria-hidden={!active}
            >
              {it.node}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={`${styles.zone} ${styles.zoneLeft}`}
        onClick={prev}
        disabled={!canPrev}
        aria-label="Previous"
        data-cursor="hover"
      >
        <span className={styles.chevron} aria-hidden="true">
          ‹
        </span>
      </button>
      <button
        type="button"
        className={`${styles.zone} ${styles.zoneRight}`}
        onClick={next}
        disabled={!canNext}
        aria-label="Next"
        data-cursor="hover"
      >
        <span className={styles.chevron} aria-hidden="true">
          ›
        </span>
      </button>

      <div className={styles.progress} aria-hidden="true">
        <span className={styles.progressCount}>
          {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <div className={styles.progressTrack}>
          <span
            className={styles.progressBar}
            style={{ transform: `scaleX(${n > 1 ? index / (n - 1) : 1})` }}
          />
        </div>
      </div>
    </div>
  );
}
