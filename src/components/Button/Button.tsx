import React from 'react';
import type { UiVariant } from '../../types';

type ButtonVariant = UiVariant;
type ButtonAppearance = 'solid' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant | 'ghost' | 'outline';
  appearance?: ButtonAppearance;
  size?: ButtonSize;
};

const variantClass: Record<ButtonVariant, string> = {
  default: 'btn-default',
  primary: 'btn-primary',
  info: 'btn-info',
  success: 'btn-success',
  warning: 'btn-warning',
  danger: 'btn-danger',
};

const appearanceClass: Record<ButtonAppearance, string> = {
  solid: 'btn-solid',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
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

export default function Button({ variant, appearance, size = 'md', className, ...props }: Props) {
  const resolved = normalizeVariant(variant, appearance);
  const classes = ['btn', variantClass[resolved.variant], appearanceClass[resolved.appearance], sizeClass[size], className]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
}
