import type React from 'react';
import type { BuiltinUiVariant, UiVariant } from '../types';

export type CssVarStyle = React.CSSProperties & Record<`--${string}`, string | number | undefined>;

export const builtinUiVariants = [
  'default',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'danger',
  'dark',
  'light',
  'neutral',
] as const satisfies readonly BuiltinUiVariant[];

const builtinUiVariantSet = new Set<string>(builtinUiVariants);
const cssIdentPattern = /^-?[_a-zA-Z][-_a-zA-Z0-9]*$/;

export const isBuiltinUiVariant = (variant: UiVariant | undefined): variant is BuiltinUiVariant => (
  typeof variant === 'string' && builtinUiVariantSet.has(variant)
);

export const getBuiltinUiVariantClass = (
  classMap: Record<BuiltinUiVariant, string>,
  variant: UiVariant | undefined,
) => (isBuiltinUiVariant(variant) ? classMap[variant] : undefined);

export const normalizeUiVariantToken = (
  variant: UiVariant | undefined,
  fallback: BuiltinUiVariant = 'default',
) => {
  const token = String(variant ?? fallback).trim();
  return cssIdentPattern.test(token) ? token : fallback;
};

const variantVar = (
  token: string,
  key: string,
  fallbackVariant: BuiltinUiVariant = 'default',
  fallbackKey: string = key,
) => `var(--variant-${token}-${key}, var(--variant-${fallbackVariant}-${fallbackKey}))`;

export const mergeStyles = (
  base: React.CSSProperties | undefined,
  override: React.CSSProperties | undefined,
) => {
  if (!base) {
    return override;
  }
  if (!override) {
    return base;
  }
  return { ...base, ...override };
};

export const buildButtonVariantStyle = (variant: UiVariant): CssVarStyle => {
  const token = normalizeUiVariantToken(variant);
  return {
    '--btn-accent': variantVar(token, 'accent'),
    '--btn-accent-soft': variantVar(token, 'soft'),
    '--btn-bg': variantVar(token, 'bg'),
    '--btn-bg-hover': variantVar(token, 'hover'),
    '--btn-bg-active': variantVar(token, 'active'),
    '--btn-border': variantVar(token, 'border'),
    '--btn-border-hover': variantVar(token, 'border'),
    '--btn-border-active': variantVar(token, 'border'),
    '--btn-color': variantVar(token, 'text'),
    '--btn-bg-disabled': variantVar(token, 'disabled-bg', 'default', 'disabled-bg'),
    '--btn-border-disabled': variantVar(token, 'disabled-border', 'default', 'disabled-border'),
    '--btn-color-disabled': variantVar(token, 'disabled-text', 'default', 'disabled-text'),
    '--btn-shadow': `0 12px 30px color-mix(in srgb, ${variantVar(token, 'bg')} 28%, transparent)`,
    '--btn-shadow-hover': `0 16px 36px color-mix(in srgb, ${variantVar(token, 'bg')} 36%, transparent)`,
  };
};

export const buildBadgeVariantStyle = (variant: UiVariant): CssVarStyle => {
  const token = normalizeUiVariantToken(variant);
  return {
    '--badge-bg': variantVar(token, 'bg'),
    '--badge-color': variantVar(token, 'text'),
    '--badge-border': variantVar(token, 'border'),
  };
};

export const buildProgressVariantStyle = (variant: UiVariant): CssVarStyle => {
  const token = normalizeUiVariantToken(variant);
  return {
    '--progress-bg': variantVar(token, 'accent', 'default', 'accent'),
  };
};

export const buildNotifierVariantStyle = (variant: UiVariant): CssVarStyle => {
  const token = normalizeUiVariantToken(variant);
  return {
    borderColor: variantVar(token, 'border'),
    '--toast-accent': variantVar(token, 'accent', 'default', 'accent'),
  };
};

export const buildAlertVariantStyle = (variant: UiVariant): CssVarStyle => {
  const token = normalizeUiVariantToken(variant);
  return {
    borderColor: variantVar(token, 'border'),
    boxShadow: `0 0 0 1px color-mix(in srgb, ${variantVar(token, 'bg')} 20%, transparent)`,
    '--alert-icon-color': variantVar(token, 'accent', 'default', 'accent'),
    '--alert-icon-bg': variantVar(token, 'soft'),
    '--alert-icon-bg-border': `color-mix(in srgb, ${variantVar(token, 'border')} 55%, transparent)`,
  };
};

export const buildTextVariantStyle = (variant: UiVariant): React.CSSProperties => {
  const token = normalizeUiVariantToken(variant);
  return {
    color: variantVar(token, 'accent', 'default', 'accent'),
  };
};

export const buildTooltipVariantStyle = (variant: UiVariant): CssVarStyle => {
  const token = normalizeUiVariantToken(variant);
  return {
    '--tooltip-bg': `color-mix(in srgb, ${variantVar(token, 'bg')} 28%, var(--surface-panel))`,
    '--tooltip-border': variantVar(token, 'border'),
    '--tooltip-color': variantVar(token, 'text', 'default', 'text'),
  };
};

export const buildWizardStepVariantStyle = (variant: UiVariant): CssVarStyle => {
  const token = normalizeUiVariantToken(variant);
  return {
    '--wizard-step-bg': variantVar(token, 'soft'),
    '--wizard-step-border': variantVar(token, 'border'),
    '--wizard-step-color': variantVar(token, 'accent', 'default', 'accent'),
    '--wizard-step-index-bg': variantVar(token, 'bg'),
    '--wizard-step-index-color': variantVar(token, 'text'),
    '--wizard-step-shadow': `color-mix(in srgb, ${variantVar(token, 'bg')} 22%, transparent)`,
  };
};
