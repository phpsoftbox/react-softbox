import React from 'react';
import styles from './Checkbox.module.css';
import Hint from '../Hint/Hint';
import type { TooltipPlacement } from '../../Tooltip/Tooltip';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  indeterminate?: boolean;
  hint?: React.ReactNode;
  hintPlacement?: TooltipPlacement;
};

export default function Checkbox({
  id,
  label,
  description,
  indeterminate = false,
  hint,
  hintPlacement = 'auto',
  className,
  ...props
}: Props) {
  const inputId = id ?? React.useId();
  const classes = [styles.checkbox, className].filter(Boolean).join(' ');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={classes} htmlFor={inputId}>
      <input
        id={inputId}
        ref={inputRef}
        type="checkbox"
        className={styles.input}
        aria-checked={indeterminate ? 'mixed' : undefined}
        {...props}
      />
      <span className={styles.box} aria-hidden="true" />
      <span className={styles.texts}>
        {label ? (
          <span className={styles.labelWrap}>
            <span className={styles.label}>{label}</span>
            <Hint content={hint} placement={hintPlacement} ariaLabel="Подсказка к чекбоксу" />
          </span>
        ) : null}
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
    </label>
  );
}
