import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "../../lib/gsap";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
  strength?: number;
  "aria-label"?: string;
}

/**
 * A button/link that is gently "pulled" toward the cursor while hovered.
 */
export default function MagneticButton({
  children,
  className,
  href,
  target,
  rel,
  onClick,
  strength = 0.4,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  const commonProps = {
    ref,
    className,
    onClick,
    "data-cursor": "hover",
    ...rest,
  };

  if (href) {
    return (
      <a href={href} target={target} rel={rel} {...commonProps}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" {...commonProps}>
      {children}
    </button>
  );
}
