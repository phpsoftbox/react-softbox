import React, {JSX} from 'react';
import styles from './Typography.module.css';
import type { BuiltinUiVariant, UiVariant } from '../../types';
import {
  buildTextVariantStyle,
  getBuiltinUiVariantClass,
  isBuiltinUiVariant,
  mergeStyles,
} from '../../utils/uiVariant';

type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  size?: TextSize;
  weight?: TextWeight;
  variant?: UiVariant;
  muted?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  small?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const sizeClass: Record<TextSize, string> = {
  xs: styles.textXs,
  sm: styles.textSm,
  md: styles.textMd,
  lg: styles.textLg,
  xl: styles.textXl,
};

const weightClass: Record<TextWeight, string> = {
  regular: styles.weightRegular,
  medium: styles.weightMedium,
  semibold: styles.weightSemibold,
  bold: styles.weightBold,
};

const variantClass: Record<BuiltinUiVariant, string> = {
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

export default function Text({
  as = 'span',
  size = 'md',
  weight = 'regular',
  variant = 'default',
  muted = false,
  italic = false,
  underline = false,
  strike = false,
  code = false,
  small = false,
  className,
  style,
  children,
}: Props) {
  const Component = (code ? 'code' : as) as keyof JSX.IntrinsicElements;
  const resolvedSize = small ? 'xs' : size;
  const variantStyle = isBuiltinUiVariant(variant) ? undefined : buildTextVariantStyle(variant);

  const classes = [
    styles.text,
    sizeClass[resolvedSize],
    weightClass[weight],
    getBuiltinUiVariantClass(variantClass, variant),
    muted ? styles.muted : null,
    italic ? styles.italic : null,
    underline ? styles.underline : null,
    strike ? styles.strike : null,
    code ? styles.code : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Component className={classes} style={mergeStyles(variantStyle, style)}>{children}</Component>;
}
