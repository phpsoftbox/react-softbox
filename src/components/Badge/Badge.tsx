import React from 'react';
import styles from './Badge.module.css';
import type { UiVariant } from '../../types';

type BadgeVariant = UiVariant;
type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeShape = 'rounded' | 'pill' | 'circle';

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  dot?: boolean;
};

const classMap: Record<BadgeVariant, string> = {
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

const sizeMap: Record<BadgeSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const shapeMap: Record<BadgeShape, string> = {
  rounded: styles.shapeRounded,
  pill: styles.shapePill,
  circle: styles.shapeCircle,
};

const isEmptyChildren = (children: React.ReactNode) => (
  children === null
  || children === undefined
  || children === ''
  || (Array.isArray(children) && children.length === 0)
);

export default function Badge({
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  dot = false,
  className,
  children,
  ...props
}: Props) {
  const isDot = dot || isEmptyChildren(children);
  const resolvedShape = isDot ? 'circle' : shape;
  const classes = [
    styles.badge,
    classMap[variant],
    sizeMap[size],
    shapeMap[resolvedShape],
    isDot ? styles.dot : null,
    className,
  ].filter(Boolean).join(' ');

  return <span className={classes} {...props}>{isDot ? null : children}</span>;
}
