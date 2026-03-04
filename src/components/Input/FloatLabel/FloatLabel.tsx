import React from 'react';
import styles from './FloatLabel.module.css';
import Hint from '../Hint/Hint';
import type { TooltipPlacement } from '../../Tooltip/Tooltip';
import ActionStack from '../ActionStack/ActionStack';

type Props = {
  label: string;
  hasError?: boolean;
  hint?: React.ReactNode;
  hintPlacement?: TooltipPlacement;
  className?: string;
  children: React.ReactElement;
};

type FloatLabelCapable = {
  supportsFloatLabel?: boolean;
  floatLabelKind?: 'select' | 'default';
};

export default function FloatLabel({ label, hasError, hint, hintPlacement = 'auto', className, children }: Props) {
  const inputId = React.useId();
  const childElement = React.isValidElement(children) ? (children as React.ReactElement<any>) : null;
  const hasHint = hint !== null && hint !== undefined && hint !== '';
  const supportsFloatLabel =
    childElement &&
    typeof childElement.type !== 'string' &&
    Boolean((childElement.type as FloatLabelCapable).supportsFloatLabel);
  const floatLabelKind =
    childElement &&
    typeof childElement.type !== 'string' &&
    (childElement.type as FloatLabelCapable).floatLabelKind === 'select'
      ? 'select'
      : 'default';

  const wrapperClass = [
    styles.wrapper,
    hasHint && floatLabelKind !== 'select' ? styles.wrapperWithHint : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const selectEndActions = hasHint && floatLabelKind === 'select'
    ? (
        <>
          {childElement?.props.endActions}
          <Hint content={hint} placement={hintPlacement} ariaLabel={`Подсказка к полю "${label}"`} />
        </>
      )
    : childElement?.props.endActions;

  const child = childElement
    ? React.cloneElement(childElement, {
        id: childElement.props.id ?? inputId,
        placeholder: childElement.props.placeholder ?? ' ',
        hasError: hasError ?? childElement.props.hasError,
        style:
          hasHint && floatLabelKind !== 'select'
            ? ({
                ...(childElement.props.style ?? {}),
                paddingRight: 'calc(var(--ui-control-padding-x, 16px) + 48px)',
              } as React.CSSProperties)
            : childElement.props.style,
        ...(supportsFloatLabel ? { floatLabel: true } : null),
        ...(floatLabelKind === 'select' ? { endActions: selectEndActions } : null),
      })
    : children;

  const htmlFor = React.isValidElement(child) ? (child as React.ReactElement<any>).props.id : undefined;

  return (
    <label className={wrapperClass} htmlFor={htmlFor}>
      {child}
      <span className={styles.label}>{label}</span>
      {hasHint && floatLabelKind !== 'select' ? (
        <ActionStack className={styles.hint}>
          <Hint content={hint} placement={hintPlacement} ariaLabel={`Подсказка к полю "${label}"`} />
        </ActionStack>
      ) : null}
    </label>
  );
}
