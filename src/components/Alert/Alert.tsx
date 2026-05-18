import React from 'react';
import styles from './Alert.module.css';
import type { UiVariant } from '../../types';

export type AlertVariant = UiVariant;
export type AlertIconPlacement = 'top' | 'center' | 'bottom';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  iconPlacement?: AlertIconPlacement;
  actions?: React.ReactNode;
  onClose?: () => void;
};

const classMap: Record<AlertVariant, string> = {
  default: styles.default,
  primary: styles.primary,
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

const iconPlacementClassMap: Record<AlertIconPlacement, string> = {
  top: styles.iconTop,
  center: styles.iconCenter,
  bottom: styles.iconBottom,
};

const defaultIcons: Record<AlertVariant, React.ReactNode> = {
  default: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7.2" />
      <path d="M10 8v4" strokeLinecap="round" />
      <circle cx="10" cy="6" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  primary: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7.2" />
      <path d="M10 8v4" strokeLinecap="round" />
      <circle cx="10" cy="6" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7.2" />
      <path d="M10 8v4" strokeLinecap="round" />
      <circle cx="10" cy="6" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7.2" />
      <path d="m6.8 10 2.1 2.2 4.3-4.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M10 3.4 17 16.2a1 1 0 0 1-.88 1.4H3.88A1 1 0 0 1 3 16.2L10 3.4Z" strokeLinejoin="round" />
      <path d="M10 8v4" strokeLinecap="round" />
      <circle cx="10" cy="14.4" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7.2" />
      <path d="m7.5 7.5 5 5m0-5-5 5" strokeLinecap="round" />
    </svg>
  ),
};

export default function Alert({
  variant = 'info',
  title,
  icon,
  iconPlacement = 'top',
  actions,
  onClose,
  className,
  children,
  ...props
}: Props) {
  const classes = [styles.alert, classMap[variant], className].filter(Boolean).join(' ');
  const iconClasses = [styles.icon, iconPlacementClassMap[iconPlacement]].filter(Boolean).join(' ');
  const resolvedIcon = icon === undefined ? defaultIcons[variant] : icon;

  return (
    <div className={classes} role="status" {...props}>
      {resolvedIcon !== null ? (
        <div className={iconClasses} data-alert-icon-placement={iconPlacement}>
          {resolvedIcon}
        </div>
      ) : null}
      <div className={styles.main}>
        {title ? <div className={styles.title}>{title}</div> : null}
        {children ? <div className={styles.message}>{children}</div> : null}
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
      {onClose ? (
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
          ×
        </button>
      ) : null}
    </div>
  );
}
