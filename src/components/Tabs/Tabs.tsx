import React from 'react';

export type TabItem = {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: React.ReactNode;
};

type Props = {
  items: TabItem[];
  activeId?: string;
  defaultActiveId?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  listClassName?: string;
  panelClassName?: string;
  onChange?: (id: string) => void;
};

const getFirstEnabled = (items: TabItem[]) => items.find((item) => !item.disabled)?.id;

export default function Tabs({
  items,
  activeId,
  defaultActiveId,
  orientation = 'horizontal',
  className,
  listClassName,
  panelClassName,
  onChange,
}: Props) {
  const isControlled = activeId !== undefined;
  const baseId = React.useId();
  const listRef = React.useRef<HTMLDivElement>(null);
  const fallbackId = React.useMemo(() => getFirstEnabled(items), [items]);
  const [internalId, setInternalId] = React.useState<string | undefined>(
    defaultActiveId ?? fallbackId,
  );

  React.useEffect(() => {
    if (isControlled) {
      return;
    }

    const isValid = internalId && items.some((item) => item.id === internalId && !item.disabled);
    if (!isValid) {
      setInternalId(defaultActiveId ?? fallbackId);
    }
  }, [items, internalId, defaultActiveId, fallbackId, isControlled]);

  const currentId = React.useMemo(() => {
    if (isControlled) {
      const valid = activeId && items.some((item) => item.id === activeId && !item.disabled);
      return valid ? activeId : fallbackId;
    }
    return internalId ?? fallbackId;
  }, [activeId, fallbackId, internalId, isControlled, items]);

  const handleSelect = (id: string, disabled?: boolean) => {
    if (disabled) {
      return;
    }
    if (!isControlled) {
      setInternalId(id);
    }
    onChange?.(id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!listRef.current) {
      return;
    }

    const focusable = Array.from(listRef.current.querySelectorAll('[role="tab"]')).filter((el) => {
      if (el.getAttribute('aria-disabled') === 'true') {
        return false;
      }
      if (el instanceof HTMLButtonElement && el.disabled) {
        return false;
      }
      return true;
    }) as HTMLElement[];

    if (focusable.length === 0) {
      return;
    }

    const enabledIds = focusable.map((el) => el.getAttribute('data-tab-id')).filter(Boolean) as string[];
    const activeElement = document.activeElement as HTMLElement | null;
    const focusedIndex = activeElement ? focusable.indexOf(activeElement) : -1;
    const resolvedIndex = focusedIndex >= 0 ? focusedIndex : enabledIds.indexOf(currentId ?? '');
    const currentIndex = resolvedIndex >= 0 ? resolvedIndex : 0;

    const moveTo = (nextIndex: number) => {
      const tab = focusable[nextIndex];
      tab?.focus();
      const id = tab?.getAttribute('data-tab-id');
      if (id) {
        handleSelect(id);
      }
    };

    const lastIndex = focusable.length - 1;
    const isVertical = orientation === 'vertical';

    switch (event.key) {
      case 'ArrowRight':
        if (!isVertical) {
          event.preventDefault();
          moveTo(currentIndex >= lastIndex ? 0 : currentIndex + 1);
        }
        break;
      case 'ArrowLeft':
        if (!isVertical) {
          event.preventDefault();
          moveTo(currentIndex <= 0 ? lastIndex : currentIndex - 1);
        }
        break;
      case 'ArrowDown':
        if (isVertical) {
          event.preventDefault();
          moveTo(currentIndex >= lastIndex ? 0 : currentIndex + 1);
        }
        break;
      case 'ArrowUp':
        if (isVertical) {
          event.preventDefault();
          moveTo(currentIndex <= 0 ? lastIndex : currentIndex - 1);
        }
        break;
      case 'Home':
        event.preventDefault();
        moveTo(0);
        break;
      case 'End':
        event.preventDefault();
        moveTo(lastIndex);
        break;
      default:
        break;
    }
  };

  const classes = ['tabs', orientation === 'vertical' ? 'tabs-vertical' : 'tabs-horizontal', className]
    .filter(Boolean)
    .join(' ');
  const listClasses = ['tabs-list', listClassName].filter(Boolean).join(' ');
  const panelClasses = ['tabs-panel', panelClassName].filter(Boolean).join(' ');

  const activeItem = items.find((item) => item.id === currentId && !item.disabled);

  return (
    <div className={classes}>
      <div
        className={listClasses}
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        ref={listRef}
      >
        {items.map((item) => {
          const selected = item.id === currentId && !item.disabled;
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;

          return (
            <button
              key={item.id}
              id={tabId}
              type="button"
              role="tab"
              className={['tab', selected ? 'tab-active' : null].filter(Boolean).join(' ')}
              aria-selected={selected}
              aria-controls={panelId}
              aria-disabled={item.disabled ? 'true' : undefined}
              tabIndex={selected ? 0 : -1}
              data-tab-id={item.id}
              onClick={() => handleSelect(item.id, item.disabled)}
              disabled={item.disabled}
            >
              <span className="tab-label">{item.label}</span>
              {item.badge ? <span className="tab-badge">{item.badge}</span> : null}
            </button>
          );
        })}
      </div>
      <div className={panelClasses}>
        {activeItem ? (
          <div
            id={`${baseId}-panel-${activeItem.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${activeItem.id}`}
          >
            {activeItem.content}
          </div>
        ) : (
          <div className="tabs-empty">Нет доступных вкладок</div>
        )}
      </div>
    </div>
  );
}
