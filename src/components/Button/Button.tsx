import React from 'react';
import styles from './Button.module.css';
import type { UiVariant } from '../../types';

type ButtonVariant = UiVariant;
type ButtonAppearance = 'solid' | 'outline' | 'ghost';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant | 'ghost' | 'outline';
  appearance?: ButtonAppearance;
};

const variantClass: Record<ButtonVariant, string> = {
  default: styles.variantDefault,
  primary: styles.variantPrimary,
  info: styles.variantInfo,
  success: styles.variantSuccess,
  warning: styles.variantWarning,
  danger: styles.variantDanger,
};

const appearanceClass: Record<ButtonAppearance, string> = {
  solid: styles.solid,
  outline: styles.outline,
  ghost: styles.ghost,
};

const normalizeVariant = (variant?: ButtonVariant | 'ghost' | 'outline', appearance?: ButtonAppearance) => {
  if (variant === 'ghost' || variant === 'outline') {
    return { variant: 'primary' as ButtonVariant, appearance: variant };
  }

  return {
    variant: variant ?? 'primary',
    appearance: appearance ?? 'solid',
  };
};

export default function Button({ variant, appearance, className, ...props }: Props) {
  const resolved = normalizeVariant(variant, appearance);
  const classes = [
    styles.button,
    variantClass[resolved.variant],
    appearanceClass[resolved.appearance],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
}
