import React from 'react';
import Dropdown from '../Menu/Dropdown';
import type { MenuItem } from '../Menu/Menu';
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
export type ButtonSplitMenuAlign = 'start' | 'end';

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

type ButtonSplitLinkComponent = React.ElementType<{
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  children?: React.ReactNode;
}>;

export type ButtonSplitMainProps<TElement extends React.ElementType = 'button'> =
  Omit<ButtonProps<TElement>, 'children' | 'variant' | 'appearance' | 'size' | 'label'> & {
    label: React.ReactNode;
    icon?: React.ReactNode;
  };

export type ButtonSplitMenuItem = {
  key: React.Key;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  href?: string;
  as?: ButtonSplitLinkComponent;
  className?: string;
  style?: React.CSSProperties;
  onSelect?: () => void;
};

export type ButtonSplitMenuProps = {
  ariaLabel: string;
  items: ButtonSplitMenuItem[];
  align?: ButtonSplitMenuAlign;
  disabled?: boolean;
  className?: string;
};

export type ButtonSplitProps<TElement extends React.ElementType = 'button'> = {
  variant?: ButtonVariant | 'ghost' | 'outline';
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  disabled?: boolean;
  main: ButtonSplitMainProps<TElement>;
  menu: ButtonSplitMenuProps;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

type ButtonSplitComponent = <TElement extends React.ElementType = 'button'>(
  props: ButtonSplitProps<TElement>
) => React.ReactElement | null;

type ButtonComponent = (<TElement extends React.ElementType = 'button'>(
  props: ButtonProps<TElement>
) => React.ReactElement | null) & {
  Group: React.FC<ButtonGroupProps>;
  Split: ButtonSplitComponent;
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

const splitMenuAlignMap: Record<ButtonSplitMenuAlign, 'left' | 'right'> = {
  start: 'left',
  end: 'right',
};

function SplitChevron() {
  return <span className="btn-split-chevron" aria-hidden="true" />;
}

function ButtonSplit<TElement extends React.ElementType = 'button'>({
  variant = 'primary',
  appearance = 'solid',
  size = 'md',
  disabled = false,
  main,
  menu,
  className,
  style,
  ariaLabel,
}: ButtonSplitProps<TElement>) {
  const {
    label,
    icon,
    disabled: mainDisabled = false,
    className: mainClassName,
    ...mainProps
  } = main;
  const menuDisabled = disabled || menu.disabled || menu.items.length === 0;
  const resolvedMainDisabled = disabled || mainDisabled;
  const mainAs = (mainProps as { as?: React.ElementType }).as;
  const mainButtonProps: Record<string, unknown> = {
    ...mainProps,
  };

  if (mainAs === undefined || mainAs === 'button') {
    mainButtonProps.type = (mainProps as { type?: string }).type ?? 'button';
  }

  const menuItems: MenuItem[] = menu.items.map((item) => ({
    id: String(item.key),
    label: item.label,
    icon: item.icon,
    href: item.href,
    as: item.as,
    disabled: item.disabled,
    style: item.style,
    className: [
      'btn-split-menu-item',
      item.danger ? 'btn-split-menu-item-danger' : null,
      item.className,
    ]
      .filter(Boolean)
      .join(' '),
    onClick: item.onSelect,
  }));
  const menuAlign = splitMenuAlignMap[menu.align ?? 'end'];
  const classes = ['btn-split', `btn-split-${size}`, className].filter(Boolean).join(' ');
  const MainButtonComponent = ButtonBase as React.ElementType;
  const ToggleButtonComponent = ButtonBase as React.ElementType;

  return (
    <ButtonGroup className={classes} style={style} aria-label={ariaLabel}>
      <MainButtonComponent
        {...mainButtonProps}
        variant={variant}
        appearance={appearance}
        size={size}
        disabled={resolvedMainDisabled}
        className={['btn-split-main', mainClassName].filter(Boolean).join(' ')}
      >
        {icon ? <span className="btn-split-main-icon">{icon}</span> : null}
        <span className="btn-split-main-label">{label}</span>
      </MainButtonComponent>
      <Dropdown
        className="btn-split-dropdown"
        align={menuAlign}
        trigger={(
          <ToggleButtonComponent
            type="button"
            variant={variant}
            appearance={appearance}
            size={size}
            disabled={menuDisabled}
            className="btn-split-toggle"
            aria-label={menu.ariaLabel}
          >
            <SplitChevron />
          </ToggleButtonComponent>
        )}
      >
        <Dropdown.Nav className={menu.className}>
          {menuItems.map((item) => (
            <Dropdown.Item
              key={item.id}
              id={item.id}
              href={item.href}
              as={item.as}
              icon={item.icon}
              disabled={item.disabled}
              className={item.className}
              style={item.style}
              onClick={item.onClick}
            >
              {item.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Nav>
      </Dropdown>
    </ButtonGroup>
  );
}

const Button = Object.assign(ButtonBase, {
  Group: ButtonGroup,
  Split: ButtonSplit,
}) as ButtonComponent;

export default Button;
