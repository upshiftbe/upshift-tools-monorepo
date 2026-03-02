import { useCallback, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const TRANSITION_CLASS = "theme-transitioning";
const TRANSITION_MS = 200;

let listeners: Array<() => void> = [];
function emit() {
  listeners.forEach((l) => l());
}

function getSnapshot(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add(TRANSITION_CLASS);
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
  setTimeout(() => root.classList.remove(TRANSITION_CLASS), TRANSITION_MS);
}

function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let initialized = false;

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (initialized) return;
    initialized = true;
    const initial = resolveInitialTheme();
    applyTheme(initial);
    emit();

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(mq.matches ? "dark" : "light");
        emit();
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    emit();
  }, []);

  const toggleTheme = useCallback(() => {
    const next = getSnapshot() === "dark" ? "light" : "dark";
    setTheme(next);
  }, [setTheme]);

  return { theme, setTheme, toggleTheme } as const;
}
