import { useCallback, useEffect, useSyncExternalStore } from "react";

type Theme = "light";

const STORAGE_KEY = "theme";
const TRANSITION_CLASS = "theme-transitioning";
const TRANSITION_MS = 200;

let listeners: Array<() => void> = [];
function emit() {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): Theme {
  return "light";
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((entry) => entry !== listener);
  };
}

function applyTheme() {
  const root = document.documentElement;
  root.classList.add(TRANSITION_CLASS);
  root.classList.remove("dark");
  root.classList.add("light");
  root.style.colorScheme = "light";
  setTimeout(() => root.classList.remove(TRANSITION_CLASS), TRANSITION_MS);
}

let initialized = false;

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    if (initialized) return;
    initialized = true;
    try {
      localStorage.setItem(STORAGE_KEY, "light");
    } catch {
      // Ignore storage failures. The product shell is light-only.
    }
    applyTheme();
    emit();
  }, []);

  const setTheme = useCallback((next: Theme) => {
    void next;
    try {
      localStorage.setItem(STORAGE_KEY, "light");
    } catch {
      // Ignore storage failures. The product shell is light-only.
    }
    applyTheme();
    emit();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme("light");
  }, [setTheme]);

  return { theme, setTheme, toggleTheme } as const;
}
