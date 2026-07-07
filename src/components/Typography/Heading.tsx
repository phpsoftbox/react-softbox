import React from 'react';
import styles from './Typography.module.css';
import type { UiVariant } from '../../types';

type HeadingWeight = 'regular' | 'semibold' | 'bold';

type Props = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  weight?: HeadingWeight;
  variant?: UiVariant;
  muted?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const weightClass: Record<HeadingWeight, string> = {
  regular: styles.weightRegular,
  semibold: styles.weightSemibold,
  bold: styles.weightBold,
};

const variantClass: Record<UiVariant, string> = {
  default: styles.variantDefault,
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  info: styles.variantInfo,
  success: styles.variantSuccess,
  warning: styles.variantWarning,
  danger: styles.variantDanger,
  dark: styles.variantDark,
  light: styles.variantLight,
  neutral: styles.variantNeutral,
};

const headingClass: Record<NonNullable<Props['level']>, string> = {
  1: styles.h1,
  2: styles.h2,
  3: styles.h3,
  4: styles.h4,
  5: styles.h5,
  6: styles.h6,
};

export default function Heading({
  level = 2,
  weight = 'semibold',
  variant = 'default',
  muted = false,
  className,
  children,
}: Props) {
  const Component = `h${level}` as React.ElementType;
  const classes = [
    styles.heading,
    headingClass[level],
    weightClass[weight],
    variantClass[variant],
    muted ? styles.muted : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Component className={classes}>{children}</Component>;
}
