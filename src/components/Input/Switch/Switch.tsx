import React from 'react';
import styles from './Switch.module.css';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
};

export default function Switch({ id, label, className, ...props }: Props) {
  const inputId = id ?? React.useId();
  const classes = [styles.switch, className].filter(Boolean).join(' ');

  return (
    <label className={classes} htmlFor={inputId}>
      <input id={inputId} type="checkbox" role="switch" className={styles.input} {...props} />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
}
