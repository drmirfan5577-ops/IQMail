import { useState, useEffect } from 'react';

export type BgTheme = 'nebula' | 'aurora' | 'matrix' | 'ocean' | 'neon';

export interface FilterSettings {
  glassIntensity: number;   // 0-100
  blurLevel: number;        // 0-100
  colorTint: string;        // hex color
  tintOpacity: number;      // 0-100
  neonGlow: number;         // 0-100
}

export interface BgState {
  theme: BgTheme;
  focusMode: boolean;
  filtersEnabled: boolean;
  filters: FilterSettings;
}

const STORAGE_KEY = 'iqmail_bg_prefs';

const defaults: BgState = {
  theme: 'nebula',
  focusMode: false,
  filtersEnabled: false,
  filters: {
    glassIntensity: 40,
    blurLevel: 0,
    colorTint: '#3B82F6',
    tintOpacity: 0,
    neonGlow: 30,
  },
};

function loadState(): BgState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

// Simple event-bus approach (no Zustand to keep lightweight)
type Listener = (state: BgState) => void;
const listeners = new Set<Listener>();
let globalState: BgState = loadState();

function setState(partial: Partial<BgState>) {
  globalState = { ...globalState, ...partial };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState)); } catch {}
  listeners.forEach((l) => l(globalState));
}

export function useBgStore() {
  const [state, setLocalState] = useState<BgState>(globalState);

  useEffect(() => {
    const listener: Listener = (s) => setLocalState({ ...s });
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return {
    ...state,
    setTheme: (theme: BgTheme) => setState({ theme }),
    setFocusMode: (focusMode: boolean) => setState({ focusMode }),
    setFiltersEnabled: (filtersEnabled: boolean) => setState({ filtersEnabled }),
    setFilter: (key: keyof FilterSettings, value: number | string) =>
      setState({ filters: { ...globalState.filters, [key]: value } }),
  };
}
