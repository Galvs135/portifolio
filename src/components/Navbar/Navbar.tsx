import { useEffect, useState } from "react";
import { useTransition } from "../Fullpage/Fullpage";
import styles from "./Navbar.module.css";

function useLocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

interface NavbarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Navbar({ open, onToggle }: NavbarProps) {
  const { navigate } = useTransition();
  const time = useLocalTime();

  return (
    <header className={styles.nav}>
      <a
        className={styles.logo}
        href="#hero"
        data-cursor="hover"
        onClick={(e) => {
          e.preventDefault();
          navigate("#hero");
        }}
      >
        <span className={styles.logoMark}>LGF</span>
        <span className={styles.logoFull}>Lucas&nbsp;G.&nbsp;França</span>
      </a>

      <div className={styles.clock}>
        <span className={styles.loc}>Belo Horizonte</span>
        <span className={styles.time}>{time} BRT</span>
      </div>

      <div className={styles.right}>
        <span className={styles.status}>
          <span className={styles.dot} /> Available for work
        </span>
        <button
          className={`${styles.toggle} ${open ? styles.toggleOpen : ""}`}
          onClick={onToggle}
          data-cursor="hover"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className={styles.toggleLabel}>{open ? "Close" : "Menu"}</span>
          <span className={styles.burger}>
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>
  );
}
