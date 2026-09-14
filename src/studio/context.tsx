import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type VisualMode = 'plasma' | 'synthwave';
export type AssistantRequest = { question?: string; project?: string };

interface StudioState {
  mode: VisualMode;
  setMode: (mode: VisualMode) => void;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  reducedMotion: boolean;
  assistant: AssistantRequest | null;
  openAssistant: (request?: AssistantRequest) => void;
  closeAssistant: () => void;
}

const StudioContext = createContext<StudioState | null>(null);

// Preferences are optional. The interface also works with storage blocked.
export function readPreference(key: string, fallback: string) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const [mode, updateMode] = useState<VisualMode>(() =>
    readPreference('mka.visual-mode', 'plasma') === 'synthwave' ? 'synthwave' : 'plasma');
  const [paused, updatePaused] = useState(() => readPreference('mka.motion-paused', 'false') === 'true');
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [assistant, setAssistant] = useState<AssistantRequest | null>(null);

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReducedMotion(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.documentElement.dataset.motion = paused || reducedMotion ? 'paused' : 'running';
    document.documentElement.dataset.theme = 'dark';
  }, [mode, paused, reducedMotion]);

  const setMode = (next: VisualMode) => {
    updateMode(next);
    try { localStorage.setItem('mka.visual-mode', next); } catch { /* Storage is not required. */ }
  };
  const setPaused = (next: boolean) => {
    updatePaused(next);
    try { localStorage.setItem('mka.motion-paused', String(next)); } catch { /* Storage is not required. */ }
  };

  return <StudioContext.Provider value={{
    mode, setMode, paused, setPaused, reducedMotion, assistant,
    openAssistant: (request = {}) => setAssistant(request), closeAssistant: () => setAssistant(null),
  }}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const value = useContext(StudioContext);
  if (!value) throw new Error('useStudio requires StudioProvider');
  return value;
}