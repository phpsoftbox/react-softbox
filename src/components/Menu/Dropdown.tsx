import React from 'react';
import { createPortal } from 'react-dom';
import Menu, { MenuItem } from './Menu';
import styles from './Menu.module.css';
import useDropdownPosition from '../../hooks/useDropdownPosition';

type Props = {
  trigger: React.ReactNode;
  items?: MenuItem[];
  children?: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
  align?: 'left' | 'right';
  placement?: 'auto' | 'down' | 'up';
  fullWidth?: boolean;
  portal?: boolean;
  className?: string;
};

type DropdownItemProps = {
  id?: string;
  children: React.ReactNode;
  href?: string;
  as?: React.ElementType<{
    href?: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    children?: React.ReactNode;
  }>;
  onClick?: () => void;
  onMouseEnter?: () => void;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
  disabled?: boolean;
  static?: boolean;
  className?: string;
};

type DropdownHeaderProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

type DropdownSeparatorProps = {
  id?: string;
  className?: string;
};

type DropdownNavProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const DropdownItem: React.FC<DropdownItemProps> = () => null;
const DropdownHeader: React.FC<DropdownHeaderProps> = () => null;
const DropdownSeparator: React.FC<DropdownSeparatorProps> = () => null;
const DropdownNav: React.FC<DropdownNavProps> = () => null;

const isDropdownHeader = (node: React.ReactNode): node is React.ReactElement<DropdownHeaderProps> =>
  React.isValidElement<DropdownHeaderProps>(node) && node.type === DropdownHeader;

const isDropdownItem = (node: React.ReactNode): node is React.ReactElement<DropdownItemProps> =>
  React.isValidElement<DropdownItemProps>(node) && node.type === DropdownItem;

const isDropdownSeparator = (node: React.ReactNode): node is React.ReactElement<DropdownSeparatorProps> =>
  React.isValidElement<DropdownSeparatorProps>(node) && node.type === DropdownSeparator;

const isDropdownNav = (node: React.ReactNode): node is React.ReactElement<DropdownNavProps> =>
  React.isValidElement<DropdownNavProps>(node) && node.type === DropdownNav;

const combine = (...values: Array<string | undefined | null>) => values.filter(Boolean).join(' ');

type DropdownNavMeta = {
  className?: string;
  style?: React.CSSProperties;
};

const buildItemsFromChildren = (
  children: React.ReactNode,
): { items: MenuItem[]; nav?: DropdownNavMeta } => {
  const items: MenuItem[] = [];
  let nav: DropdownNavMeta | undefined;

  const walk = (node: React.ReactNode) => {
    React.Children.forEach(node, (child) => {
      if (!React.isValidElement(child)) {
        return;
      }

      const childId = (child.props as { id?: string }).id;

      if (child.type === React.Fragment) {
        const fragment = child as React.ReactElement<{ children?: React.ReactNode }>;
        walk(fragment.props.children);
        return;
      }

      if (isDropdownNav(child)) {
        nav = {
          className: child.props.className,
          style: child.props.style,
        };
        walk(child.props.children);
        return;
      }

      if (isDropdownSeparator(child)) {
        items.push({ id: childId, divider: true, className: child.props.className });
        return;
      }

      if (isDropdownHeader(child)) {
        items.push({
          id: childId,
          static: true,
          label: child.props.children,
          className: combine(styles.dropdownHeader, child.props.className),
        });
        return;
      }

      if (isDropdownItem(child)) {
        items.push({
          id: childId,
          label: child.props.children,
          href: child.props.href,
          as: child.props.as,
          onClick: child.props.onClick,
          onMouseEnter: child.props.onMouseEnter,
          icon: child.props.icon,
          meta: child.props.meta,
          disabled: child.props.disabled,
          static: child.props.static,
          className: child.props.className,
        });
      }
    });
  };

  walk(children);

  return { items, nav };
};

function Dropdown({
  trigger,
  items,
  children,
  orientation = 'vertical',
  align = 'right',
  placement = 'auto',
  fullWidth = false,
  portal = true,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const canPortal = typeof document !== 'undefined' && Boolean(document.body);
  const shouldPortal = portal && canPortal;
  const { ref: menuRef, style: menuPositionStyle } = useDropdownPosition(open, {
    gap: 8,
    align,
    placement,
    anchorRef: triggerRef,
    strategy: shouldPortal ? 'fixed' : 'absolute',
  });
  const alignClass = shouldPortal ? null : styles[`align-${align}`];
  const isElementTrigger = React.isValidElement(trigger);

  const resolved = children ? buildItemsFromChildren(children) : { items: items ?? [] };
  const resolvedItems = resolved.items;
  const navProps = resolved.nav;

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      const target = event.target as Node;
      const insideTrigger = containerRef.current.contains(target);
      const insideMenu = menuRef.current ? menuRef.current.contains(target) : false;
      if (!insideTrigger && !insideMenu) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  React.useEffect(() => {
    if (!open) {
      return;
    }
    const scope = menuRef.current ?? containerRef.current;
    if (!scope) {
      return;
    }
    const firstItem = scope.querySelector('[data-menu-item="true"]') as HTMLElement | null;
    if (!firstItem) {
      return;
    }
    try {
      firstItem.focus({ preventScroll: true });
    } catch {
      firstItem.focus();
    }
  }, [open, menuRef]);

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

  const menu = open ? (
    <div
      ref={menuRef}
      className={[styles.dropdownMenu, alignClass, navProps?.className].filter(Boolean).join(' ')}
      style={{ ...menuPositionStyle, ...navProps?.style }}
    >
      <Menu items={resolvedItems} orientation={orientation} onItemSelect={() => setOpen(false)} />
    </div>
  ) : null;

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
      {menu ? (shouldPortal ? createPortal(menu, document.body) : menu) : null}
    </div>
  );
}

const DropdownComponent = Dropdown as typeof Dropdown & {
  Item: typeof DropdownItem;
  Header: typeof DropdownHeader;
  Separator: typeof DropdownSeparator;
  Nav: typeof DropdownNav;
};

DropdownComponent.Item = DropdownItem;
DropdownComponent.Header = DropdownHeader;
DropdownComponent.Separator = DropdownSeparator;
DropdownComponent.Nav = DropdownNav;

export default DropdownComponent;
