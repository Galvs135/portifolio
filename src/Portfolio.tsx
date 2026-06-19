import { useCallback, useMemo, useState } from "react";
import Scene from "./three/Scene";
import Preloader from "./components/Preloader/Preloader";
import Fullpage, { type PanelDef } from "./components/Fullpage/Fullpage";
import Navbar from "./components/Navbar/Navbar";
import Menu from "./components/Menu/Menu";
import Hero from "./sections/Hero/Hero";
import About from "./sections/About/About";
import Pillars from "./sections/Pillars/Pillars";
import Work from "./sections/Work/Work";
import Skills from "./sections/Skills/Skills";
import Contact from "./sections/Contact/Contact";

interface PortfolioProps {
  /** Terminal modal is open over the site — pause heavy loops + lock nav. */
  terminalOpen?: boolean;
}

/**
 * The full portfolio experience (Three.js + GSAP + fullpage deck).
 * Lazy-loaded by App only when the `site` command runs, so the terminal
 * boots without pulling in any of the heavy WebGL bundle.
 */
export default function Portfolio({ terminalOpen = false }: PortfolioProps) {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("hero");

  const handleLoaded = useCallback(() => setLoaded(true), []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const panels: PanelDef[] = useMemo(
    () => [
      { id: "hero", kind: "simple", transparent: true, node: <Hero loaded={loaded} /> },
      { id: "about", kind: "scroll", node: <About /> },
      { id: "pillars", kind: "scroll", node: <Pillars /> },
      { id: "work", kind: "simple", node: <Work /> },
      { id: "skills", kind: "simple", node: <Skills /> },
      { id: "contact", kind: "scroll", node: <Contact /> },
    ],
    [loaded]
  );

  return (
    <>
      <Preloader onComplete={handleLoaded} />
      <Scene paused={activeId !== "hero" || terminalOpen} />

      <Fullpage
        panels={panels}
        loaded={loaded}
        menuOpen={menuOpen}
        terminalOpen={terminalOpen}
        onActiveChange={setActiveId}
      >
        <Navbar open={menuOpen} onToggle={toggleMenu} />
        <Menu open={menuOpen} onClose={closeMenu} />
      </Fullpage>
    </>
  );
}
