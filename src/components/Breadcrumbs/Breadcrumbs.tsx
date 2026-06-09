import React from 'react';
import Dropdown from '../Menu/Dropdown';
import styles from './Breadcrumbs.module.css';

type LinkComponent = React.ElementType<{
  href?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  children?: React.ReactNode;
}>;

export type BreadcrumbItem = {
  id?: string;
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  current?: boolean;
  as?: LinkComponent;
};

type Props = {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  as?: LinkComponent;
  maxVisibleItems?: number;
  overflowTailCount?: number;
  overflowLabel?: React.ReactNode;
  overflowTrigger?: React.ReactNode;
  overflowTriggerClassName?: string;
  overflowDropdownClassName?: string;
  overflowAriaLabel?: string;
  renderOverflowTrigger?: (hiddenItems: BreadcrumbItem[]) => React.ReactNode;
};

type RenderNode =
  | { type: 'item'; item: BreadcrumbItem; index: number }
  | { type: 'overflow'; items: Array<{ item: BreadcrumbItem; index: number }> };

function resolveRenderNodes(
  items: BreadcrumbItem[],
  maxVisibleItems: number,
  overflowTailCount: number,
): RenderNode[] {
  if (maxVisibleItems < 3 || items.length <= maxVisibleItems) {
    return items.map((item, index) => ({ type: 'item', item, index }));
  }

  const safeTailCount = Math.max(1, Math.min(overflowTailCount, maxVisibleItems - 2));
  const tailStart = Math.max(1, items.length - safeTailCount);
  const hidden = items.slice(1, tailStart).map((item, hiddenIndex) => ({
    item,
    index: hiddenIndex + 1,
  }));

  if (hidden.length === 0) {
    return items.map((item, index) => ({ type: 'item', item, index }));
  }

  const tail = items.slice(tailStart).map((item, tailIndex) => ({
    type: 'item' as const,
    item,
    index: tailStart + tailIndex,
  }));

  return [{ type: 'item', item: items[0], index: 0 }, { type: 'overflow', items: hidden }, ...tail];
}

export default function Breadcrumbs({
  items,
  separator = '›',
  className,
  as,
  maxVisibleItems = 4,
  overflowTailCount = 2,
  overflowLabel = '...',
  overflowTrigger,
  overflowTriggerClassName,
  overflowDropdownClassName,
  overflowAriaLabel = 'Show hidden breadcrumbs',
  renderOverflowTrigger,
}: Props) {
  const hasExplicitCurrent = items.some((item) => item.current);
  const renderNodes = resolveRenderNodes(items, maxVisibleItems, overflowTailCount);

  return (
    <nav className={[styles.breadcrumbs, className].filter(Boolean).join(' ')} aria-label="Breadcrumbs">
      <ol className={styles.list}>
        {renderNodes.map((node, index) => {
          const isLastNode = index === renderNodes.length - 1;

          if (node.type === 'overflow') {
            const hiddenItems = node.items.map(({ item }) => item);
            const resolvedOverflowTrigger = renderOverflowTrigger
              ? renderOverflowTrigger(hiddenItems)
              : (overflowTrigger ?? overflowLabel);

            return (
              <li key={`overflow-${node.items[0]?.index ?? index}`} className={[styles.item, styles.overflowItem].join(' ')}>
                <Dropdown
                  align="left"
                  placement="auto"
                  className={styles.overflowDropdown}
                  trigger={resolvedOverflowTrigger}
                  triggerClassName={[styles.overflowTrigger, overflowTriggerClassName].filter(Boolean).join(' ')}
                  triggerAriaLabel={overflowAriaLabel}
                >
                  <Dropdown.Nav className={[styles.overflowMenu, overflowDropdownClassName].filter(Boolean).join(' ')}>
                    {node.items.map(({ item, index: originalIndex }) => {
                      const isCurrent = item.current ?? (!hasExplicitCurrent && originalIndex === items.length - 1);
                      const isDisabled = item.disabled ?? false;
                      const canFollowLink = Boolean(item.href && !isDisabled && !isCurrent);
                      const itemKey = item.id ?? `hidden-${originalIndex}`;

                      return (
                        <Dropdown.Item
                          key={itemKey}
                          className={styles.overflowMenuItem}
                          href={canFollowLink ? item.href : undefined}
                          onClick={!isDisabled ? item.onClick : undefined}
                          as={canFollowLink ? (item.as ?? as) : undefined}
                          disabled={isDisabled}
                          static={!canFollowLink}
                        >
                          {item.label}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Nav>
                </Dropdown>
                {!isLastNode ? (
                  <span className={styles.separator} aria-hidden="true">
                    {separator}
                  </span>
                ) : null}
              </li>
            );
          }

          const item = node.item;
          const key = item.id ?? `${node.index}-${typeof item.label === 'string' ? item.label : 'item'}`;
          const isCurrent = item.current ?? (!hasExplicitCurrent && node.index === items.length - 1);
          const isDisabled = item.disabled ?? false;
          const LinkTag = item.as ?? as ?? 'a';

          const content = (
            <span className={styles.label} aria-current={isCurrent ? 'page' : undefined}>
              {item.label}
            </span>
          );

          return (
            <li key={key} className={styles.item}>
              {item.href && !isDisabled && !isCurrent ? (
                <LinkTag href={item.href} className={styles.link} onClick={item.onClick}>
                  {content}
                </LinkTag>
              ) : (
                <span
                  className={[styles.link, isDisabled ? styles.disabled : null].filter(Boolean).join(' ')}
                  onClick={isDisabled ? undefined : item.onClick}
                  aria-disabled={isDisabled ? 'true' : undefined}
                >
                  {content}
                </span>
              )}
              {!isLastNode ? (
                <span className={styles.separator} aria-hidden="true">
                  {separator}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
