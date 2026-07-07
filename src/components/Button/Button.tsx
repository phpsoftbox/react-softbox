import React from 'react';
import type { BuiltinUiVariant, UiVariant } from '../../types';
import {
  buildButtonVariantStyle,
  getBuiltinUiVariantClass,
  isBuiltinUiVariant,
  mergeStyles,
} from '../../utils/uiVariant';

export type ButtonVariant = UiVariant;
export type ButtonAppearance = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonGroupOrientation = 'horizontal' | 'vertical';

type ButtonOwnProps<TElement extends React.ElementType> = {
  as?: TElement;
  variant?: ButtonVariant | 'ghost' | 'outline';
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  tabIndex?: number;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;
};

export type ButtonProps<TElement extends React.ElementType = 'button'> =
  ButtonOwnProps<TElement>
  & Omit<React.ComponentPropsWithoutRef<TElement>, keyof ButtonOwnProps<TElement>>;

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: ButtonGroupOrientation;
  stretch?: boolean;
};

type ButtonComponent = (<TElement extends React.ElementType = 'button'>(
  props: ButtonProps<TElement>
) => React.ReactElement | null) & {
  Group: React.FC<ButtonGroupProps>;
};

const variantClass: Record<BuiltinUiVariant, string> = {
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

const normalizeVariant = (
  variant?: ButtonVariant | 'ghost' | 'outline',
  appearance?: ButtonAppearance,
): { variant: ButtonVariant; appearance: ButtonAppearance } => {
  if (variant === 'ghost') {
    return { variant: 'primary', appearance: 'ghost' };
  }

  if (variant === 'outline') {
    return { variant: 'primary', appearance: 'outline' };
  }

  return {
    variant: variant ?? 'primary',
    appearance: appearance ?? 'solid',
  };
};

function ButtonBase<TElement extends React.ElementType = 'button'>({
  as,
  variant,
  appearance,
  size = 'md',
  className,
  disabled = false,
  onClick,
  tabIndex,
  style,
  ...props
}: ButtonProps<TElement>) {
  const resolved = normalizeVariant(variant, appearance);
  const variantStyle = isBuiltinUiVariant(resolved.variant) ? undefined : buildButtonVariantStyle(resolved.variant);
  const Component = (as ?? 'button') as React.ElementType;
  const isNativeButton = as === undefined || as === 'button';
  const classes = [
    'btn',
    getBuiltinUiVariantClass(variantClass, resolved.variant),
    appearanceClass[resolved.appearance],
    sizeClass[size],
    disabled ? 'btn-disabled' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const handleClick: React.MouseEventHandler = (event) => {
    if (disabled && !isNativeButton) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };
  const componentProps: Record<string, unknown> = {
    ...props,
    className: classes,
    style: mergeStyles(variantStyle, style),
  };

  if (onClick || (disabled && !isNativeButton)) {
    componentProps.onClick = handleClick;
  }

  if (isNativeButton) {
    componentProps.disabled = disabled;
  } else if (disabled) {
    componentProps['aria-disabled'] = true;
    componentProps.tabIndex = -1;
  } else if (tabIndex !== undefined) {
    componentProps.tabIndex = tabIndex;
  }

  return <Component {...componentProps} />;
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
}) as ButtonComponent;

export default Button;
