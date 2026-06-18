import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "pt";

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

const STORAGE_KEY = "lgf-lang";
const Ctx = createContext<LangContextValue | null>(null);

function readStored(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === "pt" ? "pt" : "en";
  } catch {
    return "en";
  }
}

function persist(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStored);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    persist(next);
  }, []);

  const toggle = useCallback(() => {
    setLangState((cur) => {
      const next: Lang = cur === "en" ? "pt" : "en";
      persist(next);
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ lang, setLang, toggle }}>{children}</Ctx.Provider>;
}

export function useLang(): LangContextValue {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLang must be used within <LanguageProvider>");
  return c;
}

/** Pick helper: `t("English", "Português")`. */
export function useT() {
  const { lang } = useLang();
  const t = useCallback((en: string, pt: string) => (lang === "pt" ? pt : en), [lang]);
  return { t, lang };
}
