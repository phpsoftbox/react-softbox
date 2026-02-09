import React from 'react';
import styles from './Alert.module.css';
import type { UiVariant } from '../../types';

export type AlertVariant = UiVariant;

type Props = React.HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: React.ReactNode;
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

export default function Alert({ variant = 'info', title, actions, onClose, className, children, ...props }: Props) {
  const classes = [styles.alert, classMap[variant], className].filter(Boolean).join(' ');

  return (
    <div className={classes} role="status" {...props}>
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
