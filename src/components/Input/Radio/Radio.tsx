import React from 'react';
import styles from './Radio.module.css';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
};

export default function Radio({ id, label, description, className, ...props }: Props) {
  const inputId = id ?? React.useId();
  const classes = [styles.radio, className].filter(Boolean).join(' ');

  return (
    <label className={classes} htmlFor={inputId}>
      <input id={inputId} type="radio" className={styles.input} {...props} />
      <span className={styles.control} aria-hidden="true" />
      <span className={styles.texts}>
        {label ? <span className={styles.label}>{label}</span> : null}
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
    </label>
  );
}
