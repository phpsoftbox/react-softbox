import React from 'react';
import styles from './Switch.module.css';
import Hint from '../Hint/Hint';
import type { TooltipPlacement } from '../../Tooltip/Tooltip';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  hintPlacement?: TooltipPlacement;
};

export default function Switch({ id, label, hint, hintPlacement = 'auto', className, ...props }: Props) {
  const inputId = id ?? React.useId();
  const classes = [styles.switch, className].filter(Boolean).join(' ');

  return (
    <label className={classes} htmlFor={inputId}>
      <input id={inputId} type="checkbox" role="switch" className={styles.input} {...props} />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {label ? (
        <span className={styles.labelWrap}>
          <span className={styles.label}>{label}</span>
          <Hint content={hint} placement={hintPlacement} ariaLabel="Подсказка к переключателю" />
        </span>
      ) : null}
    </label>
  );
}
