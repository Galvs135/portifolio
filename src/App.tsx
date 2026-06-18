import { Suspense, lazy, useState } from "react";
import Cursor from "./components/Cursor/Cursor";
import Terminal, { type TerminalView } from "./components/Terminal/Terminal";
import { LanguageProvider } from "./i18n/LanguageContext";

const Portfolio = lazy(() => import("./Portfolio"));

export default function App() {
  const [view, setView] = useState<TerminalView>("terminal");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <LanguageProvider>
      <Cursor paused={view === "terminal" || modalOpen} />

      <Terminal
        view={view}
        modalOpen={modalOpen}
        onView={setView}
        onModalOpen={setModalOpen}
      />

      {view === "site" && (
        <Suspense fallback={null}>
          <Portfolio terminalOpen={modalOpen} />
        </Suspense>
      )}
    </LanguageProvider>
  );
}
