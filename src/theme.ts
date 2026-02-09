export type ThemeMode = 'light' | 'dark' | 'system' | 'auto';

export type ThemeOptions = {
  storageKey?: string;
  root?: HTMLElement;
  defaultMode?: ThemeMode;
  autoStartHour?: number;
  autoEndHour?: number;
};

const DEFAULT_STORAGE_KEY = 'psb-theme-mode';

let cleanup: (() => void) | null = null;
let autoTimer: number | null = null;

const clearWatchers = () => {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
  if (autoTimer) {
    window.clearTimeout(autoTimer);
    autoTimer = null;
  }
};

const getRoot = (options?: ThemeOptions) => options?.root ?? document.documentElement;

const resolveSystemTheme = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveAutoTheme = (options?: ThemeOptions, now = new Date()) => {
  const start = options?.autoStartHour ?? 7;
  const end = options?.autoEndHour ?? 19;
  const hour = now.getHours();

  if (start === end) {
    return 'dark';
  }

  if (start < end) {
    return hour >= start && hour < end ? 'light' : 'dark';
  }

  return hour >= start || hour < end ? 'light' : 'dark';
};

const scheduleAuto = (options?: ThemeOptions) => {
  const now = new Date();
  const start = options?.autoStartHour ?? 7;
  const end = options?.autoEndHour ?? 19;

  const next = new Date(now);
  const hour = now.getHours();

  if (start < end) {
    if (hour < start) {
      next.setHours(start, 0, 0, 0);
    } else if (hour < end) {
      next.setHours(end, 0, 0, 0);
    } else {
      next.setDate(now.getDate() + 1);
      next.setHours(start, 0, 0, 0);
    }
  } else {
    if (hour < end) {
      next.setHours(end, 0, 0, 0);
    } else if (hour < start) {
      next.setHours(start, 0, 0, 0);
    } else {
      next.setDate(now.getDate() + 1);
      next.setHours(end, 0, 0, 0);
    }
  }

  const delay = Math.max(next.getTime() - now.getTime(), 0) + 1000;
  autoTimer = window.setTimeout(() => {
    applyTheme('auto', options);
  }, delay);
};

const setThemeAttrs = (mode: ThemeMode, resolved: 'light' | 'dark', options?: ThemeOptions) => {
  const root = getRoot(options);
  root.setAttribute('data-theme-mode', mode);
  root.setAttribute('data-theme', resolved);
};

export const applyTheme = (mode: ThemeMode, options?: ThemeOptions) => {
  if (typeof document === 'undefined') {
    return;
  }

  clearWatchers();

  if (mode === 'system') {
    const resolved = resolveSystemTheme();
    setThemeAttrs(mode, resolved, options);

    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => setThemeAttrs(mode, resolveSystemTheme(), options);

      if (media.addEventListener) {
        media.addEventListener('change', handler);
      } else {
        media.addListener(handler);
      }

      cleanup = () => {
        if (media.removeEventListener) {
          media.removeEventListener('change', handler);
        } else {
          media.removeListener(handler);
        }
      };
    }

    return;
  }

  if (mode === 'auto') {
    const resolved = resolveAutoTheme(options);
    setThemeAttrs(mode, resolved, options);
    scheduleAuto(options);
    return;
  }

  setThemeAttrs(mode, mode, options);
};

export const setThemeMode = (mode: ThemeMode, options?: ThemeOptions) => {
  const storageKey = options?.storageKey ?? DEFAULT_STORAGE_KEY;
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(storageKey, mode);
  }

  applyTheme(mode, options);
};

export const getStoredThemeMode = (options?: ThemeOptions): ThemeMode | null => {
  const storageKey = options?.storageKey ?? DEFAULT_STORAGE_KEY;
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  const saved = window.localStorage.getItem(storageKey);
  if (saved === 'light' || saved === 'dark' || saved === 'system' || saved === 'auto') {
    return saved;
  }
  return null;
};

export const initTheme = (options?: ThemeOptions) => {
  const saved = getStoredThemeMode(options);
  const mode = saved ?? options?.defaultMode ?? 'system';
  applyTheme(mode, options);
  return mode;
};
