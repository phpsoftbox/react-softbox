import React from 'react';
import styles from './CollapseButton.module.css';

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  targetId: string;
  open: boolean;
  label?: React.ReactNode;
  variant?: 'burger' | 'chevron';
  children?: React.ReactNode;
};

const CollapseButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ targetId, open, label, variant = 'chevron', className, children, ...props }, ref) => {
    const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ');
    const content = children ?? label;

    return (
      <button
        ref={ref}
        type="button"
        className={classes}
        aria-controls={targetId}
        aria-expanded={open}
        {...props}
      >
        <span className={styles.icon} aria-hidden="true" />
        {content ? <span className={styles.label}>{content}</span> : null}
      </button>
    );
  },
);

CollapseButton.displayName = 'CollapseButton';

export default CollapseButton;
