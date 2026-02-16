import React from 'react';
import styles from './Menu.module.css';
import useDropdownPosition from '../../hooks/useDropdownPosition';

type LinkComponent = React.ElementType<{
  href?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  children?: React.ReactNode;
}>;

export type MenuItem = {
  id?: string;
  label?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  divider?: boolean;
  static?: boolean;
  className?: string;
  children?: MenuItem[];
  open?: boolean;
  align?: 'left' | 'right';
  placement?: 'auto' | 'down' | 'up';
  as?: LinkComponent;
};

type Props = {
  items: MenuItem[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  onItemSelect?: (item: MenuItem) => void;
  as?: LinkComponent;
};

type HorizontalDropdownProps = {
  item: MenuItem;
  isOpen: boolean;
  classNames: string;
  content: React.ReactNode;
  dropdownId: string;
  align: 'left' | 'right';
  placement: 'auto' | 'down' | 'up';
  onToggle: () => void;
  onSelect: (item: MenuItem) => void;
};

function HorizontalDropdown({
  item,
  isOpen,
  classNames,
  content,
  dropdownId,
  align,
  placement,
  onToggle,
  onSelect,
}: HorizontalDropdownProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { ref, style } = useDropdownPosition(isOpen, { gap: 8, align, placement, anchorRef: buttonRef });

  return (
    <div className={styles.dropdownItem}>
      <button
        type="button"
        className={classNames}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        data-menu-item="true"
        aria-current={item.active ? 'page' : undefined}
        disabled={item.disabled}
        ref={buttonRef}
      >
        {content}
        <span className={[styles.chevron, isOpen ? styles.chevronOpen : null].filter(Boolean).join(' ')} aria-hidden="true" />
      </button>
      {isOpen ? (
        <div
          id={dropdownId}
          className={[styles.dropdownMenu, styles[`align-${align}`]].filter(Boolean).join(' ')}
          aria-hidden={!isOpen}
          ref={ref}
          style={style}
        >
          <Menu items={item.children ?? []} onItemSelect={onSelect} />
        </div>
      ) : null}
    </div>
  );
}

export default function Menu({ items, orientation = 'vertical', className, onItemSelect, as }: Props) {
  const navRef = React.useRef<HTMLElement>(null);
  const isHorizontal = orientation === 'horizontal';

  const getKey = (item: MenuItem, index: number) =>
    item.id ?? (typeof item.label === 'string' ? item.label : null) ?? `item-${index}`;

  const initGroups = React.useCallback(() => {
    const map: Record<string, boolean> = {};
    items.forEach((item, index) => {
      if (item.children && item.children.length > 0) {
        map[getKey(item, index)] = item.open ?? false;
      }
    });
    return map;
  }, [items]);

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() => initGroups());

  React.useEffect(() => {
    setOpenGroups((prev) => ({ ...initGroups(), ...prev }));
  }, [initGroups]);

  React.useEffect(() => {
    if (!isHorizontal) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!navRef.current) {
        return;
      }

      if (!navRef.current.contains(event.target as Node)) {
        setOpenGroups({});
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isHorizontal]);

  const focusableItems = () => {
    if (!navRef.current) {
      return [];
    }

    const elements = Array.from(navRef.current.querySelectorAll('[data-menu-item="true"]')) as HTMLElement[];
    return elements.filter((el) => {
      if (el.closest('[data-menu-root="true"]') !== navRef.current) {
        return false;
      }

      if (el.getAttribute('aria-disabled') === 'true') {
        return false;
      }

      if (el instanceof HTMLButtonElement && el.disabled) {
        return false;
      }

      return true;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const itemsList = focusableItems();
    if (itemsList.length === 0) {
      return;
    }

    const currentIndex = itemsList.indexOf(document.activeElement as HTMLElement);
    const lastIndex = itemsList.length - 1;
    const moveFocus = (nextIndex: number) => {
      itemsList[nextIndex]?.focus();
    };

    switch (event.key) {
      case 'ArrowDown':
        if (!isHorizontal) {
          event.preventDefault();
          moveFocus(currentIndex >= lastIndex ? 0 : currentIndex + 1);
        }
        break;
      case 'ArrowUp':
        if (!isHorizontal) {
          event.preventDefault();
          moveFocus(currentIndex <= 0 ? lastIndex : currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        if (isHorizontal) {
          event.preventDefault();
          moveFocus(currentIndex >= lastIndex ? 0 : currentIndex + 1);
        }
        break;
      case 'ArrowLeft':
        if (isHorizontal) {
          event.preventDefault();
          moveFocus(currentIndex <= 0 ? lastIndex : currentIndex - 1);
        }
        break;
      case 'Home':
        event.preventDefault();
        moveFocus(0);
        break;
      case 'End':
        event.preventDefault();
        moveFocus(lastIndex);
        break;
      default:
        break;
    }
  };

  const classes = [styles.menu, styles[orientation], className].filter(Boolean).join(' ');

  const handleSelect = (item: MenuItem) => {
    if (isHorizontal) {
      setOpenGroups({});
    }
    onItemSelect?.(item);
  };

  return (
    <nav
      className={classes}
      aria-orientation={orientation}
      data-menu-root="true"
      onKeyDown={handleKeyDown}
      ref={navRef}
    >
      {items.map((item, index) => {
        const key = getKey(item, index);

        if (item.divider) {
          return <div key={key} className={[styles.divider, item.className].filter(Boolean).join(' ')} role="separator" />;
        }

        const labelContent =
          typeof item.label === 'string' || typeof item.label === 'number' ? (
            <span className={styles.label}>{item.label}</span>
          ) : (
            item.label
          );

        const content = (
          <>
            {item.icon ? <span className={styles.icon}>{item.icon}</span> : null}
            {labelContent}
            {item.meta ? <span className={styles.meta}>{item.meta}</span> : null}
          </>
        );

        const classNames = [
          styles.item,
          item.active ? styles.active : null,
          item.disabled ? styles.disabled : null,
          item.static ? styles.staticItem : null,
          item.className,
        ]
          .filter(Boolean)
          .join(' ');

        const staticClasses = [styles.staticItem, item.className].filter(Boolean).join(' ');

        const handleClick = (event: React.MouseEvent) => {
          if (item.disabled) {
            event.preventDefault();
            return;
          }
          item.onClick?.();
          handleSelect(item);
        };

        if (item.static) {
          return (
            <div key={key} className={staticClasses} role="presentation">
              {content}
            </div>
          );
        }

        if (item.children && item.children.length > 0 && orientation === 'vertical') {
          const isOpen = openGroups[key] ?? false;
          const submenuId = `${key}-submenu`;

          return (
            <div key={key} className={styles.group}>
              <button
                type="button"
                className={[classNames, styles.groupButton].filter(Boolean).join(' ')}
                onClick={() => setOpenGroups((prev) => ({ ...prev, [key]: !isOpen }))}
                aria-expanded={isOpen}
                aria-controls={submenuId}
                data-menu-item="true"
                aria-current={item.active ? 'page' : undefined}
                disabled={item.disabled}
              >
                {content}
                <span className={[styles.chevron, isOpen ? styles.chevronOpen : null].filter(Boolean).join(' ')} aria-hidden="true" />
              </button>
              <div
                id={submenuId}
                className={[styles.submenu, isOpen ? styles.submenuOpen : null].filter(Boolean).join(' ')}
                aria-hidden={!isOpen}
              >
                <Menu items={item.children} onItemSelect={handleSelect} className={styles.submenuList} />
              </div>
            </div>
          );
        }

        if (item.children && item.children.length > 0 && orientation === 'horizontal') {
          const isOpen = openGroups[key] ?? false;
          const dropdownId = `${key}-dropdown`;
          const dropdownAlign = item.align ?? 'left';
          const dropdownPlacement = item.placement ?? 'auto';

          const toggleDropdown = () => {
            setOpenGroups((prev) => {
              const next = isHorizontal ? {} : { ...prev };
              next[key] = !isOpen;
              return next;
            });
          };

          return (
            <HorizontalDropdown
              key={key}
              item={item}
              isOpen={isOpen}
              classNames={classNames}
              content={content}
              dropdownId={dropdownId}
              align={dropdownAlign}
              placement={dropdownPlacement}
              onToggle={toggleDropdown}
              onSelect={handleSelect}
            />
          );
        }

        if (item.href) {
          const LinkTag = item.as ?? as ?? 'a';
          return (
            <LinkTag
              key={key}
              className={classNames}
              href={item.href}
              onClick={handleClick}
              aria-current={item.active ? 'page' : undefined}
              aria-disabled={item.disabled ? 'true' : undefined}
              tabIndex={item.disabled ? -1 : undefined}
              data-menu-item="true"
            >
              {content}
            </LinkTag>
          );
        }

        return (
          <button
            key={key}
            type="button"
            className={classNames}
            onClick={handleClick}
            disabled={item.disabled}
            aria-current={item.active ? 'page' : undefined}
            data-menu-item="true"
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
