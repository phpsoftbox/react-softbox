import React from 'react';
import styles from './Badge.module.css';
import type { UiVariant } from '../../types';

type BadgeVariant = UiVariant;

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const classMap: Record<BadgeVariant, string> = {
  default: styles.default,
  primary: styles.primary,
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

export default function Badge({ variant = 'default', className, ...props }: Props) {
  const classes = [styles.badge, classMap[variant], className].filter(Boolean).join(' ');

  return <span className={classes} {...props} />;
}
