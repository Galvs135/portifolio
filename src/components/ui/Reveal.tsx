import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "../../lib/gsap";
import { usePanel } from "../Fullpage/PanelContext";

interface RevealProps {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  as?: "div" | "li" | "span";
}

/** Fades + lifts its content in when the panel becomes active. */
export default function Reveal({
  children,
  className,
  y = 40,
  delay = 0,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const panel = usePanel();
  const active = panel?.active ?? true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay, overwrite: true }
      );
    } else {
      gsap.set(el, { opacity: 0, y, overwrite: true });
    }
  }, [active, y, delay]);

  const Tag = as;
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
