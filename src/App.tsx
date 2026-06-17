import { useCallback, useMemo, useState } from "react";
import Scene from "./three/Scene";
import Cursor from "./components/Cursor/Cursor";
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

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoaded = useCallback(() => setLoaded(true), []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const panels: PanelDef[] = useMemo(
    () => [
      { id: "hero", kind: "simple", transparent: true, node: <Hero loaded={loaded} /> },
      { id: "about", kind: "scroll", node: <About /> },
      { id: "pillars", kind: "scroll", node: <Pillars /> },
      { id: "work", kind: "horizontal", node: <Work /> },
      { id: "skills", kind: "horizontal", node: <Skills /> },
      { id: "contact", kind: "scroll", node: <Contact /> },
    ],
    [loaded]
  );

  return (
    <>
      <Cursor />
      <Preloader onComplete={handleLoaded} />
      <Scene />

      <Fullpage panels={panels} loaded={loaded} menuOpen={menuOpen}>
        <Navbar open={menuOpen} onToggle={toggleMenu} />
        <Menu open={menuOpen} onClose={closeMenu} />
      </Fullpage>
    </>
  );
}
