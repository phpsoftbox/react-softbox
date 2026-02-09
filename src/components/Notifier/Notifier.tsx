import React from 'react';
import styles from './Notifier.module.css';
import type { UiVariant } from '../../types';

export type NotifierItem = {
  id: string;
  title?: React.ReactNode;
  message?: React.ReactNode;
  variant?: UiVariant;
  duration?: number;
  actions?: React.ReactNode;
};

type Props = {
  items: NotifierItem[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
};

const positionClass: Record<NonNullable<Props['position']>, string> = {
  'top-right': styles.topRight,
  'top-left': styles.topLeft,
  'bottom-right': styles.bottomRight,
  'bottom-left': styles.bottomLeft,
};

const variantClass: Record<UiVariant, string> = {
  default: styles.default,
  primary: styles.primary,
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

export default function Notifier({ items, onDismiss, position = 'top-right' }: Props) {
  const timersRef = React.useRef<Record<string, { timeoutId: number | null; remaining: number; startedAt: number }>>({});
  const closingRef = React.useRef<Record<string, number>>({});
  const [closingIds, setClosingIds] = React.useState<Record<string, boolean>>({});
  const [pausedIds, setPausedIds] = React.useState<Record<string, boolean>>({});
  const [visibilityPaused, setVisibilityPaused] = React.useState(() => {
    if (typeof document === 'undefined') {
      return false;
    }
    const hasFocus = typeof document.hasFocus === 'function' ? document.hasFocus() : true;
    return document.hidden || !hasFocus;
  });
  const exitDuration = 220;

  const clearTimer = React.useCallback((id: string) => {
    const timer = timersRef.current[id];
    if (!timer) {
      return;
    }
    if (timer.timeoutId !== null) {
      window.clearTimeout(timer.timeoutId);
    }
    delete timersRef.current[id];
  }, []);

  const startClose = React.useCallback((id: string) => {
    if (closingRef.current[id]) {
      return;
    }

    clearTimer(id);
    setClosingIds((prev) => ({ ...prev, [id]: true }));
    closingRef.current[id] = window.setTimeout(() => {
      delete closingRef.current[id];
      onDismiss(id);
    }, exitDuration);
  }, [clearTimer, onDismiss, exitDuration]);

  const pauseTimer = React.useCallback((id: string) => {
    const timer = timersRef.current[id];
    if (!timer || timer.timeoutId === null) {
      return;
    }
    const elapsed = Date.now() - timer.startedAt;
    timer.remaining = Math.max(0, timer.remaining - elapsed);
    window.clearTimeout(timer.timeoutId);
    timer.timeoutId = null;
  }, []);

  const resumeTimer = React.useCallback((id: string) => {
    const timer = timersRef.current[id];
    if (!timer || timer.timeoutId !== null) {
      return;
    }
    if (timer.remaining <= 0) {
      startClose(id);
      return;
    }
    timer.startedAt = Date.now();
    timer.timeoutId = window.setTimeout(() => startClose(id), timer.remaining);
  }, [startClose]);

  React.useEffect(() => {
    items.forEach((item) => {
      if (!item.duration || timersRef.current[item.id]) {
        return;
      }

      timersRef.current[item.id] = {
        timeoutId: null,
        remaining: item.duration,
        startedAt: Date.now(),
      };
    });

    Object.keys(timersRef.current).forEach((id) => {
      if (!items.find((item) => item.id === id)) {
        clearTimer(id);
      }
    });

    setClosingIds((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        if (!items.find((item) => item.id === id)) {
          delete next[id];
          if (closingRef.current[id]) {
            window.clearTimeout(closingRef.current[id]);
            delete closingRef.current[id];
          }
        }
      });
      return next;
    });

    setPausedIds((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        if (!items.find((item) => item.id === id)) {
          delete next[id];
        }
      });
      return next;
    });
  }, [items, clearTimer]);

  React.useEffect(() => {
    items.forEach((item) => {
      if (!item.duration) {
        return;
      }
      if (closingIds[item.id]) {
        return;
      }
      if (visibilityPaused || pausedIds[item.id]) {
        pauseTimer(item.id);
        return;
      }
      resumeTimer(item.id);
    });
  }, [items, closingIds, pausedIds, visibilityPaused, pauseTimer, resumeTimer]);

  React.useEffect(() => {
    const pauseAll = () => {
      setVisibilityPaused(true);
      items.forEach((item) => pauseTimer(item.id));
    };

    const resumeAll = () => {
      const hasFocus = typeof document.hasFocus === 'function' ? document.hasFocus() : true;
      if (document.hidden || !hasFocus) {
        return;
      }
      setVisibilityPaused(false);
      items.forEach((item) => {
        if (!pausedIds[item.id]) {
          resumeTimer(item.id);
        }
      });
    };

    const handleVisibility = () => {
      if (document.hidden) {
        pauseAll();
      } else {
        resumeAll();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', pauseAll);
    window.addEventListener('focus', resumeAll);
    window.addEventListener('pagehide', pauseAll);
    window.addEventListener('pageshow', resumeAll);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', pauseAll);
      window.removeEventListener('focus', resumeAll);
      window.removeEventListener('pagehide', pauseAll);
      window.removeEventListener('pageshow', resumeAll);
    };
  }, [items, pauseTimer, resumeTimer, pausedIds]);

  React.useEffect(
    () => () => {
      Object.values(timersRef.current).forEach((timer) => {
        if (timer.timeoutId !== null) {
          window.clearTimeout(timer.timeoutId);
        }
      });
      timersRef.current = {};
      Object.values(closingRef.current).forEach((timer) => window.clearTimeout(timer));
      closingRef.current = {};
    },
    [],
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={[styles.container, positionClass[position]].filter(Boolean).join(' ')} role="region" aria-live="polite">
      {items.map((item) => {
        const variant = item.variant ?? 'info';
        const isPaused = Boolean(pausedIds[item.id] || visibilityPaused);
        const isClosing = Boolean(closingIds[item.id]);
        return (
          <div
            key={item.id}
            className={[
              styles.toast,
              variantClass[variant],
              isClosing ? styles.toastClosing : null,
            ]
              .filter(Boolean)
              .join(' ')}
            data-paused={isPaused ? 'true' : undefined}
            onMouseEnter={() => {
              if (!item.duration) {
                return;
              }
              pauseTimer(item.id);
              setPausedIds((prev) => ({ ...prev, [item.id]: true }));
            }}
            onMouseLeave={() => {
              if (!item.duration) {
                return;
              }
              setPausedIds((prev) => {
                const next = { ...prev };
                delete next[item.id];
                return next;
              });
              if (!visibilityPaused) {
                resumeTimer(item.id);
              }
            }}
          >
            <div className={styles.content}>
              {item.title ? <div className={styles.title}>{item.title}</div> : null}
              {item.message ? <div className={styles.message}>{item.message}</div> : null}
              {item.actions ? <div className={styles.actions}>{item.actions}</div> : null}
            </div>
            <button type="button" className={styles.close} onClick={() => startClose(item.id)} aria-label="Закрыть">
              ×
            </button>
            {item.duration ? (
              <span
                className={styles.timer}
                style={{ '--toast-duration': `${item.duration}ms` } as React.CSSProperties}
                aria-hidden="true"
                data-testid="notifier-timer"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
