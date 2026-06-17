import { createElement, Fragment, useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { usePanel } from "../Fullpage/PanelContext";
import styles from "./AnimatedText.module.css";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface AnimatedTextProps {
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Word-by-word masked reveal. Plays whenever its panel becomes active and
 * resets when the panel leaves, so it re-animates each time you revisit.
 */
export default function AnimatedText({
  text,
  as = "p",
  className,
  delay = 0,
  stagger = 0.05,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const panel = usePanel();
  const active = panel?.active ?? true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("." + styles.inner);
    if (!words.length) return;

    if (active) {
      gsap.fromTo(
        words,
        { yPercent: 115 },
        { yPercent: 0, duration: 1, ease: "expo.out", stagger, delay, overwrite: true }
      );
    } else {
      gsap.set(words, { yPercent: 115, overwrite: true });
    }
  }, [active, delay, stagger]);

  const words = text.split(" ");

  return createElement(
    as,
    { ref, className: [styles.text, className].filter(Boolean).join(" ") },
    words.map((word, i) => (
      // The space lives OUTSIDE the masked word wrapper so overflow:hidden
      // can't clip it (otherwise the words run together).
      <Fragment key={i}>
        <span className={styles.word}>
          <span className={styles.inner}>{word}</span>
        </span>
        {i < words.length - 1 ? " " : ""}
      </Fragment>
    ))
  );
}
