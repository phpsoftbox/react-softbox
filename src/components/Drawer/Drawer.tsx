import React from 'react';
import { createPortal } from 'react-dom';
import styles from './Drawer.module.css';

type Props = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: 'left' | 'right';
  width?: number | string;
  closeOnBackdrop?: boolean;
  id?: string;
  mode?: 'overlay' | 'inline';
  className?: string;
  overlayClassName?: string;
  showHeader?: boolean;
  showClose?: boolean;
  onClose?: () => void;
};

export default function Drawer({
  open,
  title,
  children,
  footer,
  position = 'right',
  width = 360,
  closeOnBackdrop = true,
  id,
  mode = 'overlay',
  className,
  overlayClassName,
  showHeader = true,
  showClose = true,
  onClose,
}: Props) {
  const shouldRenderHeader = showHeader || showClose;

  React.useEffect(() => {
    if (!open || mode === 'inline') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
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
      onClose?.();
    }
  };

  const inlineStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
  };

  const panelClasses = [styles.panel, styles[position], mode === 'inline' ? styles.inline : null, className]
    .filter(Boolean)
    .join(' ');

  const panel = (
    <aside
      className={panelClasses}
      style={inlineStyle}
      id={id}
      role={mode === 'inline' ? 'complementary' : 'dialog'}
      aria-modal={mode === 'inline' ? undefined : 'true'}
      aria-label={mode === 'inline' && title ? title : undefined}
    >
      {shouldRenderHeader ? (
        <header className={styles.header}>
          {title ? <h3>{title}</h3> : <span />}
          {showClose ? (
            <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
              ×
            </button>
          ) : null}
        </header>
      ) : null}
      <div className={styles.body}>{children}</div>
      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </aside>
  );

  if (mode === 'inline') {
    return panel;
  }

  return createPortal(
    <div className={[styles.overlay, overlayClassName].filter(Boolean).join(' ')} onMouseDown={handleBackdropClick}>
      {panel}
    </div>,
    document.body,
  );
}
