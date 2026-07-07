import React from 'react';
import type { UiVariant } from '../../types';

type ButtonVariant = UiVariant;
type ButtonAppearance = 'solid' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonGroupOrientation = 'horizontal' | 'vertical';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant | 'ghost' | 'outline';
  appearance?: ButtonAppearance;
  size?: ButtonSize;
};

type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: ButtonGroupOrientation;
  stretch?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  default: 'btn-default',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  info: 'btn-info',
  success: 'btn-success',
  warning: 'btn-warning',
  danger: 'btn-danger',
  dark: 'btn-dark',
  light: 'btn-light',
  neutral: 'btn-neutral',
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

function ButtonBase({ variant, appearance, size = 'md', className, ...props }: Props) {
  const resolved = normalizeVariant(variant, appearance);
  const classes = ['btn', variantClass[resolved.variant], appearanceClass[resolved.appearance], sizeClass[size], className]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
}

function ButtonGroup({
  orientation = 'horizontal',
  stretch = false,
  className,
  role = 'group',
  ...props
}: ButtonGroupProps) {
  const classes = [
    'btn-group',
    orientation === 'vertical' ? 'btn-group-vertical' : 'btn-group-horizontal',
    stretch ? 'btn-group-stretch' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes} role={role} {...props} />;
}

const Button = Object.assign(ButtonBase, {
  Group: ButtonGroup,
});

export default Button;
