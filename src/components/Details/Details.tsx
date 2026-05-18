import React from 'react';
import styles from './Details.module.css';
import Collapse from '../Collapse/Collapse';
import CollapseButton from '../CollapseButton/CollapseButton';

export type DetailsItem = {
  id?: React.Key;
  label: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  fullWidth?: boolean;
  priority?: 'primary' | 'secondary';
};

export type DetailsProps = Omit<React.HTMLAttributes<HTMLDListElement>, 'children'> & {
  items: DetailsItem[];
  columns?: 1 | 2 | 3;
  emptyValue?: React.ReactNode;
  collapseSecondary?: boolean;
  defaultSecondaryOpen?: boolean;
  showSecondaryLabel?: React.ReactNode;
  hideSecondaryLabel?: React.ReactNode;
};

const isEmptyValue = (value: React.ReactNode) => (
  value === null || value === undefined || value === ''
);

export default function Details({
  items,
  columns = 1,
  emptyValue = '—',
  collapseSecondary = true,
  defaultSecondaryOpen = false,
  showSecondaryLabel = 'Показать ещё',
  hideSecondaryLabel = 'Скрыть',
  className,
  ...props
}: DetailsProps) {
  const [secondaryOpen, setSecondaryOpen] = React.useState(defaultSecondaryOpen);
  const fallbackId = React.useId();
  const collapseId = `details-secondary-${fallbackId.replace(/:/g, '')}`;
  const primaryItems = items.filter((item) => item.priority !== 'secondary');
  const secondaryItems = items.filter((item) => item.priority === 'secondary');
  const canCollapseSecondary = collapseSecondary && secondaryItems.length > 0;

  const columnsClass = columns === 3 ? styles.columns3 : columns === 2 ? styles.columns2 : styles.columns1;
  const classes = [styles.details, columnsClass, className].filter(Boolean).join(' ');

  const renderItems = (list: DetailsItem[], keyPrefix: string) => list.map((item, index) => {
    const resolvedValue = isEmptyValue(item.value) ? emptyValue : item.value;
    const itemClasses = [styles.item, item.fullWidth ? styles.itemFull : null, item.className].filter(Boolean).join(' ');
    const labelClasses = [styles.label, item.labelClassName].filter(Boolean).join(' ');
    const valueClasses = [
      styles.value,
      isEmptyValue(item.value) ? styles.valueEmpty : null,
      item.valueClassName,
    ].filter(Boolean).join(' ');

    return (
      <div key={item.id ?? `${keyPrefix}-item-${index}`} className={itemClasses}>
        <dt className={labelClasses}>{item.label}</dt>
        <dd className={valueClasses}>{resolvedValue}</dd>
      </div>
    );
  });

  return (
    <dl className={classes} {...props}>
      {renderItems(primaryItems, 'primary')}
      {canCollapseSecondary ? (
        <div className={styles.secondaryBlock}>
          <Collapse id={collapseId} open={secondaryOpen} className={styles.secondaryCollapse}>
            <div className={styles.secondaryGrid}>
              {renderItems(secondaryItems, 'secondary')}
            </div>
          </Collapse>
          <div className={styles.toggleRow}>
            <CollapseButton
              targetId={collapseId}
              open={secondaryOpen}
              label={secondaryOpen ? hideSecondaryLabel : showSecondaryLabel}
              className={styles.toggleButton}
              onClick={() => setSecondaryOpen((prev) => !prev)}
            />
          </div>
        </div>
      ) : renderItems(secondaryItems, 'secondary')}
    </dl>
  );
}
