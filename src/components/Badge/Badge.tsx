import React from 'react';
import styles from './Badge.module.css';
import type { UiVariant } from '../../types';

type BadgeVariant = UiVariant;
type BadgeSize = 'sm' | 'md' | 'lg';

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
};

const classMap: Record<BadgeVariant, string> = {
  default: styles.default,
  primary: styles.primary,
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

const sizeMap: Record<BadgeSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

export default function Badge({ variant = 'default', size = 'md', className, ...props }: Props) {
  const classes = [styles.badge, classMap[variant], sizeMap[size], className].filter(Boolean).join(' ');

  return <span className={classes} {...props} />;
}
