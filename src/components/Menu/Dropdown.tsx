import React from 'react';
import Menu, { MenuItem } from './Menu';
import styles from './Menu.module.css';
import useDropdownPosition from '../../hooks/useDropdownPosition';

type Props = {
  trigger: React.ReactNode;
  items: MenuItem[];
  orientation?: 'vertical' | 'horizontal';
  align?: 'left' | 'right';
  placement?: 'auto' | 'down' | 'up';
  fullWidth?: boolean;
  className?: string;
};

export default function Dropdown({
  trigger,
  items,
  orientation = 'vertical',
  align = 'right',
  placement = 'auto',
  fullWidth = false,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const { ref: menuRef, style: menuStyle } = useDropdownPosition(open, {
    gap: 8,
    align,
    placement,
    anchorRef: triggerRef,
  });
  const isElementTrigger = React.isValidElement(trigger);

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  React.useEffect(() => {
    if (!open || !containerRef.current) {
      return;
    }

    const firstItem = containerRef.current.querySelector('[data-menu-item="true"]') as HTMLElement | null;
    firstItem?.focus();
  }, [open]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
    }

    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div
      className={[styles.dropdown, fullWidth ? styles.dropdownFull : null, className].filter(Boolean).join(' ')}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {isElementTrigger ? (
        <span
          className={[styles.dropdownAnchor, fullWidth ? styles.dropdownAnchorFull : null].filter(Boolean).join(' ')}
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          aria-expanded={open}
          aria-haspopup="menu"
          ref={(node) => {
            triggerRef.current = node;
          }}
        >
          {trigger}
        </span>
      ) : (
        <button
          type="button"
          className={[styles.dropdownTrigger, fullWidth ? styles.dropdownTriggerFull : null].filter(Boolean).join(' ')}
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          aria-expanded={open}
          ref={(node) => {
            triggerRef.current = node;
          }}
        >
          {trigger}
        </button>
      )}
      {open ? (
        <div
          ref={menuRef}
          className={[styles.dropdownMenu, styles[`align-${align}`]].filter(Boolean).join(' ')}
          style={menuStyle}
        >
          <Menu items={items} orientation={orientation} onItemSelect={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
