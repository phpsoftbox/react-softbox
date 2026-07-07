import React from 'react';
import Button from '../Button/Button';
import Dropdown from '../Menu/Dropdown';
import Checkbox from '../Input/Checkbox/Checkbox';
import styles from './Table.module.css';
import type { UiVariant } from '../../types';

export type TableSortDirection = 'asc' | 'desc';

export type TableSortState = {
  key: string;
  direction: TableSortDirection;
};

export type TableSortOptions = {
  key?: string | null;
  direction?: TableSortDirection | null;
  param?: string;
  orderParam?: string;
  baseUrl?: string;
  defaultDirection?: TableSortDirection;
  buildUrl?: (next: TableSortState) => string;
  onChange?: (next: TableSortState, url: string) => void;
};

export type TableBulkAction = {
  id: string;
  label: React.ReactNode;
  onClick: (selectedIds: React.Key[]) => void;
  disabled?: boolean;
  variant?: UiVariant;
  icon?: React.ReactNode;
};

export type TableBulkActions = {
  selectedIds: React.Key[];
  actions: TableBulkAction[];
  onClear?: () => void;
  align?: 'left' | 'right';
  placement?: 'top' | 'bottom' | 'both';
  disabled?: boolean;
};

export type TableRenderBulkAction<T> = (selectedIds: React.Key[], selectedRows: T[]) => React.ReactNode;

export type TableSelection<T> = {
  selectedIds: React.Key[];
  onToggle: (id: React.Key, row: T, index: number) => void;
  onToggleAll?: (currentIds: React.Key[]) => void;
  position?: 'left' | 'right';
  showFooterToggle?: boolean;
  allSelected?: boolean;
  someSelected?: boolean;
  storageKey?: string;
  onRestore?: (selectedIds: React.Key[]) => void;
};

export type TableColumn<T> = {
  id?: string;
  header?: React.ReactNode;
  label?: React.ReactNode;
  title?: React.ReactNode;
  field?: keyof T | string;
  accessor?: keyof T | string | ((row: T) => React.ReactNode);
  cell?: (row: T, column: TableColumn<T>, rowIndex: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  minWidth?: number | string;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  sortable?: boolean;
  sortKey?: string;
  footer?: React.ReactNode | ((rows: T[], column: TableColumn<T>) => React.ReactNode);
  hidden?: boolean;
  hideOn?: 'sm' | 'md' | 'lg';
};

export type TableProps<T> = React.HTMLAttributes<HTMLDivElement> & {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: keyof T | string | ((row: T, index: number) => React.Key);
  emptyState?: React.ReactNode;
  caption?: React.ReactNode;
  variant?: 'default' | 'striped' | 'bordered' | 'ghost';
  size?: 'sm' | 'md';
  stickyHeader?: boolean;
  showFooter?: boolean;
  sort?: TableSortOptions;
  selection?: TableSelection<T>;
  bulkActions?: TableBulkActions;
  renderBulkAction?: TableRenderBulkAction<T>;
  bulkActionPlacement?: 'top' | 'bottom' | 'both';
  tableClassName?: string;
  headClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
};

const toCssValue = (value?: number | string) => {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
};

const normalizeNode = (value: unknown): React.ReactNode => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'symbol' || typeof value === 'bigint') {
    return value.toString();
  }
  return value as React.ReactNode;
};

const resolveHeaderContent = <T,>(column: TableColumn<T>) =>
  normalizeNode(column.header ?? column.label ?? column.title ?? column.field ?? column.id ?? '');

const resolveSortKey = <T,>(column: TableColumn<T>) =>
  column.sortKey ?? (typeof column.field === 'string' ? column.field : null) ?? (typeof column.accessor === 'string' ? column.accessor : null) ?? column.id ?? null;

const resolveCellValue = <T,>(row: T, column: TableColumn<T>, rowIndex: number) => {
  if (column.cell) {
    return column.cell(row, column, rowIndex);
  }
  if (column.accessor) {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    const accessorKey = column.accessor as keyof T;
    return (row as Record<keyof T, React.ReactNode>)[accessorKey];
  }
  if (column.field) {
    const fieldKey = column.field as keyof T;
    return (row as Record<keyof T, React.ReactNode>)[fieldKey];
  }
  if (column.id) {
    return (row as Record<string, React.ReactNode>)[column.id];
  }
  return null;
};

const getSortUrl = (options: TableSortOptions | undefined, next: TableSortState) => {
  if (options?.buildUrl) {
    return options.buildUrl(next);
  }
  const param = options?.param ?? 'sort';
  const orderParam = options?.orderParam ?? 'order';
  const base = options?.baseUrl ?? (typeof window !== 'undefined' ? window.location.href : '');

  if (!base) {
    return '';
  }

  try {
    const isAbsolute = /^https?:\/\//i.test(base);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const url = new URL(base, isAbsolute ? undefined : origin);
    url.searchParams.set(param, next.key);
    url.searchParams.set(orderParam, next.direction);
    return isAbsolute ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '';
  }
};

const getHideClass = (value?: 'sm' | 'md' | 'lg') => {
  if (value === 'sm') {
    return styles.hideSm;
  }
  if (value === 'md') {
    return styles.hideMd;
  }
  if (value === 'lg') {
    return styles.hideLg;
  }
  return null;
};

function TableBase<T>({
  columns,
  data,
  rowKey,
  emptyState = 'Нет данных',
  caption,
  variant = 'default',
  size = 'md',
  stickyHeader = false,
  showFooter,
  sort,
  selection,
  bulkActions,
  renderBulkAction,
  bulkActionPlacement,
  className,
  tableClassName,
  headClassName,
  bodyClassName,
  footerClassName,
  rowClassName,
  ...props
}: TableProps<T>) {
  const restoredSelectionStorageKeyRef = React.useRef<string | null>(null);
  const skipNextSelectionPersistRef = React.useRef(false);
  const visibleColumns = columns.filter((column) => !column.hidden);
  const showSelection = Boolean(selection);
  const selectionPosition = selection?.position ?? 'left';
  const showSelectionLeft = showSelection && selectionPosition !== 'right';
  const showSelectionRight = showSelection && selectionPosition === 'right';
  const hasFooterContent = visibleColumns.some((column) => column.footer !== undefined && column.footer !== null);
  const shouldShowFooter = Boolean(selection?.showFooterToggle) || (showFooter ?? hasFooterContent);
  const colSpan = Math.max(visibleColumns.length + (showSelection ? 1 : 0), 1);
  const currentSortKey = sort?.key ?? null;
  const currentSortDirection = sort?.direction ?? null;
  const defaultDirection = sort?.defaultDirection ?? 'asc';
  const placement = renderBulkAction ? bulkActionPlacement ?? 'both' : bulkActions?.placement ?? 'both';
  const hasBulkRenderer = Boolean(renderBulkAction || bulkActions);
  const shouldRenderBulkTop = Boolean(hasBulkRenderer && (placement === 'top' || placement === 'both'));
  const shouldRenderBulkBottom = Boolean(hasBulkRenderer && (placement === 'bottom' || placement === 'both'));

  const wrapperClasses = [
    styles.wrapper,
    variant === 'striped' ? styles.striped : null,
    variant === 'bordered' ? styles.bordered : null,
    variant === 'ghost' ? styles.ghost : null,
    size === 'sm' ? styles.sizeSm : null,
    stickyHeader ? styles.stickyHead : null,
    shouldRenderBulkTop ? styles.withBulkTop : null,
    shouldRenderBulkBottom ? styles.withBulkBottom : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getRowKey = (row: T, index: number): React.Key => {
    if (!rowKey) {
      return index;
    }
    if (typeof rowKey === 'function') {
      return rowKey(row, index);
    }
    const keyValue = (row as Record<string, unknown>)[rowKey as string];
    if (keyValue === null || keyValue === undefined) {
      return index;
    }
    if (typeof keyValue === 'string' || typeof keyValue === 'number') {
      return keyValue;
    }
    return String(keyValue);
  };

  const rowKeys = data.map((row, index) => getRowKey(row, index));
  const selectedSet = selection ? new Set(selection.selectedIds) : null;
  const selectionStorageKey = typeof selection?.storageKey === 'string' ? selection.storageKey.trim() : '';

  React.useEffect(() => {
    if (!selection || selectionStorageKey === '' || typeof window === 'undefined') {
      return;
    }

    if (restoredSelectionStorageKeyRef.current === selectionStorageKey) {
      return;
    }

    restoredSelectionStorageKeyRef.current = selectionStorageKey;

    if (typeof selection.onRestore !== 'function') {
      return;
    }

    try {
      const raw = window.localStorage.getItem(selectionStorageKey);
      if (!raw) {
        return;
      }

      const payload = JSON.parse(raw);
      if (!Array.isArray(payload)) {
        return;
      }

      const restored = payload.filter((value): value is React.Key =>
        typeof value === 'string' || typeof value === 'number',
      );
      skipNextSelectionPersistRef.current = true;
      selection.onRestore(restored);
    } catch {
      // noop: broken localStorage payload should not break table rendering
    }
  }, [selection, selectionStorageKey]);

  React.useEffect(() => {
    if (!selection || selectionStorageKey === '' || typeof window === 'undefined') {
      return;
    }

    if (skipNextSelectionPersistRef.current) {
      skipNextSelectionPersistRef.current = false;
      return;
    }

    try {
      const payload = selection.selectedIds.filter((value) =>
        typeof value === 'string' || typeof value === 'number',
      );
      window.localStorage.setItem(selectionStorageKey, JSON.stringify(payload));
    } catch {
      // noop: unavailable storage should not break table behavior
    }
  }, [selection, selectionStorageKey, selection?.selectedIds]);

  const allSelected = selection
    ? selection.allSelected ?? (rowKeys.length > 0 && rowKeys.every((key) => selectedSet?.has(key)))
    : false;
  const someSelected = selection
    ? selection.someSelected ?? rowKeys.some((key) => selectedSet?.has(key))
    : false;

  const selectedIds = selection?.selectedIds ?? [];
  const selectedRows = selection
    ? data.filter((row, index) => selectedIds.includes(getRowKey(row, index)))
    : [];

  const renderBulkActions = (position: 'top' | 'bottom') => {
    if (renderBulkAction) {
      return (
        <div className={styles.bulkActions} data-position={position}>
          <div className={styles.bulkActionsRow}>{renderBulkAction(selectedIds, selectedRows)}</div>
        </div>
      );
    }

    if (!bulkActions) {
      return null;
    }

    const selectedCount = bulkActions.selectedIds.length;
    const hasSelected = selectedCount > 0;
    const label = selectedCount > 0 ? `Действия (${selectedCount})` : 'Действия';
    const isDisabled = Boolean(bulkActions.disabled);
    const alignClass = bulkActions.align === 'right' ? styles.bulkActionsRight : styles.bulkActionsLeft;
    const variantClassMap: Record<UiVariant, string> = {
      default: styles.bulkActionDefault,
      primary: styles.bulkActionPrimary,
      secondary: styles.bulkActionSecondary,
      info: styles.bulkActionInfo,
      success: styles.bulkActionSuccess,
      warning: styles.bulkActionWarning,
      danger: styles.bulkActionDanger,
      dark: styles.bulkActionDark,
      light: styles.bulkActionLight,
      neutral: styles.bulkActionNeutral,
    };

    return (
      <div className={styles.bulkActions} data-position={position}>
        <div className={[styles.bulkActionsRow, alignClass].filter(Boolean).join(' ')}>
          <Dropdown
            align={bulkActions.align === 'right' ? 'right' : 'left'}
            trigger={
              <Button size="sm" appearance="outline" disabled={!hasSelected || isDisabled}>
                {label}
              </Button>
            }
          >
            <Dropdown.Nav className={styles.bulkActionsMenu}>
              {bulkActions.actions.map((action) => (
                <Dropdown.Item
                  key={action.id}
                  disabled={!hasSelected || isDisabled || action.disabled}
                  onClick={!hasSelected || isDisabled ? undefined : () => action.onClick(bulkActions.selectedIds)}
                  className={action.variant ? variantClassMap[action.variant] : undefined}
                  icon={action.icon}
                >
                  {action.label}
                </Dropdown.Item>
              ))}
              {bulkActions.onClear ? (
                <>
                  <Dropdown.Separator />
                  <Dropdown.Item
                    disabled={!hasSelected || isDisabled}
                    onClick={!hasSelected || isDisabled ? undefined : bulkActions.onClear}
                  >
                    Сбросить выбор
                  </Dropdown.Item>
                </>
              ) : null}
            </Dropdown.Nav>
          </Dropdown>
        </div>
      </div>
    );
  };

  const handleToggleAll = () => {
    if (!selection) {
      return;
    }
    if (selection.onToggleAll) {
      selection.onToggleAll(rowKeys);
    }
  };

  const renderSelectionHeaderCell = () => (
    <th className={[styles.headCell, styles.selectionCell].filter(Boolean).join(' ')}>
      <Checkbox
        checked={allSelected}
        indeterminate={!allSelected && someSelected}
        onChange={handleToggleAll}
        aria-label="Выбрать все строки"
      />
    </th>
  );

  const renderSelectionCell = (row: T, rowIndex: number, resolvedKey: React.Key) => (
    <td className={[styles.cell, styles.selectionCell].filter(Boolean).join(' ')}>
      <Checkbox
        checked={Boolean(selectedSet?.has(resolvedKey))}
        onChange={() => selection?.onToggle(resolvedKey, row, rowIndex)}
        aria-label={`Выбрать строку ${rowIndex + 1}`}
      />
    </td>
  );

  const renderSelectionFooterCell = () => (
    <td className={[styles.footerCell, styles.selectionCell].filter(Boolean).join(' ')}>
      {selection?.showFooterToggle ? (
        <Checkbox
          checked={allSelected}
          indeterminate={!allSelected && someSelected}
          onChange={handleToggleAll}
          aria-label="Выбрать все строки"
        />
      ) : null}
    </td>
  );

  return (
    <div className={wrapperClasses} {...props}>
      {shouldRenderBulkTop ? renderBulkActions('top') : null}
      <div className={styles.tableScroll}>
        <table className={[styles.table, tableClassName].filter(Boolean).join(' ')}>
          {caption ? <caption className={styles.caption}>{caption}</caption> : null}
          <thead className={[styles.head, headClassName].filter(Boolean).join(' ')}>
            <tr>
              {showSelectionLeft ? renderSelectionHeaderCell() : null}
              {visibleColumns.map((column, columnIndex) => {
                const header = resolveHeaderContent(column);
                const sortKey = resolveSortKey(column);
                const isSortable = Boolean(column.sortable && sortKey);
                const isSorted = Boolean(isSortable && currentSortKey && sortKey === currentSortKey);
                const direction = isSorted ? currentSortDirection ?? defaultDirection : null;
                const nextDirection = isSorted ? (direction === 'asc' ? 'desc' : 'asc') : defaultDirection;
                const nextState = sortKey ? { key: sortKey, direction: nextDirection } : null;
                const sortUrl = nextState ? getSortUrl(sort, nextState) : '';
                const alignClass = column.align === 'center' ? styles.alignCenter : column.align === 'right' ? styles.alignRight : null;
                const hideClass = getHideClass(column.hideOn);
                const headerClasses = [
                  styles.headCell,
                  alignClass,
                  hideClass,
                  isSortable ? styles.sortable : null,
                  isSorted && direction === 'asc' ? styles.sortedAsc : null,
                  isSorted && direction === 'desc' ? styles.sortedDesc : null,
                  column.headerClassName,
                  column.className,
                ]
                  .filter(Boolean)
                  .join(' ');
                const inlineStyle: React.CSSProperties = {
                  width: toCssValue(column.width),
                  minWidth: toCssValue(column.minWidth),
                };

                const handleSortClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
                  if (!nextState) {
                    event.preventDefault();
                    return;
                  }
                  if (sort?.onChange) {
                    event.preventDefault();
                    sort.onChange(nextState, sortUrl);
                    return;
                  }
                  if (!sortUrl) {
                    event.preventDefault();
                  }
                };

                return (
                  <th
                    key={column.id ?? `${columnIndex}`}
                    className={headerClasses}
                    style={inlineStyle}
                    aria-sort={isSortable ? (direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none') : undefined}
                    scope="col"
                  >
                    {isSortable ? (
                      <a href={sortUrl || '#'} className={styles.sortButton} onClick={handleSortClick}>
                        <span>{header}</span>
                        <span className={styles.sortIndicator} aria-hidden="true" />
                      </a>
                    ) : (
                      header
                    )}
                  </th>
                );
              })}
              {showSelectionRight ? renderSelectionHeaderCell() : null}
            </tr>
          </thead>
          <tbody className={[styles.body, bodyClassName].filter(Boolean).join(' ')}>
            {data.length === 0 ? (
              <tr className={styles.row}>
                <td className={[styles.cell, styles.emptyCell, styles.noLabel].filter(Boolean).join(' ')} colSpan={colSpan} data-label="">
                  {emptyState}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const resolvedRowClassName = typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName;
                const resolvedKey = getRowKey(row, rowIndex);
                return (
                  <tr key={resolvedKey} className={[styles.row, resolvedRowClassName].filter(Boolean).join(' ')}>
                    {showSelectionLeft ? renderSelectionCell(row, rowIndex, resolvedKey) : null}
                    {visibleColumns.map((column, columnIndex) => {
                      const alignClass = column.align === 'center' ? styles.alignCenter : column.align === 'right' ? styles.alignRight : null;
                      const hideClass = getHideClass(column.hideOn);
                      const cellClasses = [
                        styles.cell,
                        alignClass,
                        hideClass,
                        column.cellClassName,
                        column.className,
                      ]
                        .filter(Boolean)
                        .join(' ');
                      const inlineStyle: React.CSSProperties = {
                        width: toCssValue(column.width),
                        minWidth: toCssValue(column.minWidth),
                      };
                      const value = resolveCellValue(row, column, rowIndex);

                      return (
                        <td
                          key={`${resolvedKey}-${column.id ?? columnIndex}`}
                          className={cellClasses}
                          style={inlineStyle}
                        >
                          <div className={styles.cellContent}>{value}</div>
                        </td>
                      );
                    })}
                    {showSelectionRight ? renderSelectionCell(row, rowIndex, resolvedKey) : null}
                  </tr>
                );
              })
            )}
          </tbody>
          {shouldShowFooter ? (
            <tfoot className={[styles.footer, footerClassName].filter(Boolean).join(' ')}>
              <tr className={styles.footerRow}>
                {showSelectionLeft ? renderSelectionFooterCell() : null}
                {visibleColumns.map((column, columnIndex) => {
                  const alignClass = column.align === 'center' ? styles.alignCenter : column.align === 'right' ? styles.alignRight : null;
                  const hideClass = getHideClass(column.hideOn);
                  const footerClasses = [
                    styles.footerCell,
                    alignClass,
                    hideClass,
                    column.className,
                  ]
                    .filter(Boolean)
                    .join(' ');
                  const inlineStyle: React.CSSProperties = {
                    width: toCssValue(column.width),
                    minWidth: toCssValue(column.minWidth),
                  };
                  let footerValue: React.ReactNode = null;
                  if (typeof column.footer === 'function') {
                    footerValue = column.footer(data, column);
                  } else if (column.footer !== undefined) {
                    footerValue = column.footer;
                  }

                  return (
                    <td key={`footer-${column.id ?? columnIndex}`} className={footerClasses} style={inlineStyle}>
                      <div className={styles.cellContent}>{footerValue}</div>
                    </td>
                  );
                })}
                {showSelectionRight ? renderSelectionFooterCell() : null}
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
      {shouldRenderBulkBottom ? renderBulkActions('bottom') : null}
    </div>
  );
}

type TableComponent = <T>(props: TableProps<T>) => React.ReactElement;

const Table = TableBase as TableComponent;

export default Table;
