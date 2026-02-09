import React from 'react';
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
};

export default function Breadcrumbs({ items, separator = '›', className, as }: Props) {
  const hasExplicitCurrent = items.some((item) => item.current);

  return (
    <nav className={[styles.breadcrumbs, className].filter(Boolean).join(' ')} aria-label="Breadcrumbs">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const key = item.id ?? `${index}-${typeof item.label === 'string' ? item.label : 'item'}`;
          const isLast = index === items.length - 1;
          const isCurrent = item.current ?? (!hasExplicitCurrent && isLast);
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
              {!isLast ? <span className={styles.separator} aria-hidden="true">{separator}</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
