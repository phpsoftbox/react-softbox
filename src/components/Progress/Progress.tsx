import React from 'react';
import styles from './Progress.module.css';
import type { UiVariant } from '../../types';

type ProgressVariant = UiVariant;
type ProgressSize = 'sm' | 'md' | 'lg';

type Props = {
  value?: number;
  max?: number;
  label?: React.ReactNode;
  showValue?: boolean;
  variant?: ProgressVariant;
  size?: ProgressSize;
  indeterminate?: boolean;
  className?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const variantMap: Record<ProgressVariant, string> = {
  default: styles.default,
  primary: styles.primary,
  secondary: styles.secondary,
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  dark: styles.dark,
  light: styles.light,
  neutral: styles.neutral,
};

const sizeMap: Record<ProgressSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export default function Progress({
  value = 0,
  max = 100,
  label,
  showValue = false,
  variant = 'default',
  size = 'md',
  indeterminate = false,
  className,
}: Props) {
  const safeMax = max > 0 ? max : 100;
  const normalized = clamp(value, 0, safeMax);
  const percent = Math.round((normalized / safeMax) * 100);

  const wrapperClasses = [
    styles.progress,
    variantMap[variant],
    sizeMap[size],
    indeterminate ? styles.indeterminate : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      {label ? <div className={styles.label}>{label}</div> : null}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : safeMax}
        aria-valuenow={indeterminate ? undefined : normalized}
        aria-busy={indeterminate ? 'true' : undefined}
      >
        <div className={styles.bar} style={indeterminate ? undefined : { width: `${percent}%` }} />
      </div>
      {showValue ? <div className={styles.value}>{indeterminate ? '…' : `${percent}%`}</div> : null}
    </div>
  );
}
