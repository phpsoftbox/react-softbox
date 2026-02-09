import React from 'react';
import styles from './FloatLabel.module.css';

type Props = {
  label: string;
  hasError?: boolean;
  className?: string;
  children: React.ReactElement;
};

type FloatLabelCapable = {
  supportsFloatLabel?: boolean;
};

export default function FloatLabel({ label, hasError, className, children }: Props) {
  const inputId = React.useId();
  const wrapperClass = [styles.wrapper, className].filter(Boolean).join(' ');
  const childElement = React.isValidElement(children) ? (children as React.ReactElement<any>) : null;
  const supportsFloatLabel =
    childElement &&
    typeof childElement.type !== 'string' &&
    Boolean((childElement.type as FloatLabelCapable).supportsFloatLabel);

  const child = childElement
    ? React.cloneElement(childElement, {
        id: childElement.props.id ?? inputId,
        placeholder: childElement.props.placeholder ?? ' ',
        hasError: hasError ?? childElement.props.hasError,
        ...(supportsFloatLabel ? { floatLabel: true } : null),
      })
    : children;

  const htmlFor = React.isValidElement(child) ? (child as React.ReactElement<any>).props.id : undefined;

  return (
    <label className={wrapperClass} htmlFor={htmlFor}>
      {child}
      <span className={styles.label}>{label}</span>
    </label>
  );
}
