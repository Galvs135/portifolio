import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { navItems } from "../../data/nav";
import { socials } from "../../data/socials";
import { useTransition } from "../Fullpage/Fullpage";
import { useLang } from "../../i18n/LanguageContext";
import styles from "./Menu.module.css";

interface MenuProps {
  open: boolean;
  onClose: () => void;
}

export default function Menu({ open, onClose }: MenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const { navigate } = useTransition();
  const { lang } = useLang();
  const t = (en: string, pt: string) => (lang === "pt" ? pt : en);

  // Animate open/close.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const links = root.querySelectorAll<HTMLElement>("[data-link-inner]");
    const meta = root.querySelectorAll<HTMLElement>("[data-meta]");

    // Don't run the close animation on the very first render.
    if (first.current) {
      first.current = false;
      if (!open) return;
    }

    gsap.killTweensOf([root, links, meta]);

    if (open) {
      const tl = gsap.timeline();
      tl.set(root, { display: "grid", pointerEvents: "auto" })
        .fromTo(
          root,
          { yPercent: -100 },
          { yPercent: 0, duration: 0.85, ease: "expo.inOut" }
        )
        .fromTo(
          links,
          { yPercent: 120 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 },
          "-=0.45"
        )
        .fromTo(
          meta,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 },
          "-=0.6"
        );
    } else {
      const tl = gsap.timeline();
      tl.to(links, {
        yPercent: -120,
        duration: 0.45,
        ease: "expo.in",
        stagger: 0.04,
      })
        .to(meta, { opacity: 0, duration: 0.3 }, "<")
        .to(
          root,
          { yPercent: -100, duration: 0.7, ease: "expo.inOut" },
          "-=0.15"
        )
        .set(root, { display: "none", pointerEvents: "none" });
    }
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (target: string) => {
    onClose();
    navigate(target);
  };

  return (
    <nav ref={rootRef} className={styles.root} aria-hidden={!open}>
      <ul className={styles.list}>
        {navItems.map((item) => (
          <li key={item.target} className={styles.item}>
            <a
              href={item.target}
              className={styles.link}
              data-cursor="hover"
              onClick={(e) => {
                e.preventDefault();
                go(item.target);
              }}
            >
              <span data-link-inner className={styles.linkInner}>
                <span className={styles.index}>{item.index}</span>
                {item.label[lang]}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <div data-meta className={styles.metaGroup}>
          <span className={styles.metaLabel}>{t("Get in touch", "Fale comigo")}</span>
          <div className={styles.socials}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className={styles.social}
                data-cursor="hover"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <span data-meta className={styles.metaNote}>
          {t(
            "Based in Belo Horizonte, Brazil — open to remote work worldwide.",
            "Em Belo Horizonte, Brasil — aberto a trabalho remoto no mundo todo."
          )}
        </span>
      </div>
    </nav>
  );
}
