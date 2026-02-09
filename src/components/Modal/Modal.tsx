import React from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

type Props = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnBackdrop?: boolean;
  onClose: () => void;
};

export default function Modal({
  open,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  onClose,
}: Props) {
  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdrop) {
      return;
    }

    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.overlay} onMouseDown={handleBackdropClick}>
      <div className={[styles.modal, styles[size]].filter(Boolean).join(' ')} role="dialog" aria-modal="true">
        <header className={styles.header}>
          {title ? <h3>{title}</h3> : <span />}
          <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </div>
    </div>,
    document.body,
  );
}
