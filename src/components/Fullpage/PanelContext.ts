import { createContext, useContext } from "react";

export interface PanelState {
  /** True while this panel is the active (visible) page. */
  active: boolean;
}

export const PanelContext = createContext<PanelState | null>(null);

export function usePanel(): PanelState | null {
  return useContext(PanelContext);
}
