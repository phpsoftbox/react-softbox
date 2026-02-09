import React from 'react';
import styles from './Grid.module.css';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  columns?: number;
  columnsLg?: number;
  columnsMd?: number;
  columnsSm?: number;
  gap?: number | string;
  minWidth?: number | string;
};

export default function Grid({
  columns = 12,
  columnsLg,
  columnsMd,
  columnsSm,
  gap = '24px',
  minWidth = '0',
  className,
  style,
  ...props
}: Props) {
  const classes = [styles.grid, className].filter(Boolean).join(' ');
  const inlineStyle: React.CSSProperties = {
    ...style,
    ['--ui-grid-columns' as string]: String(columns),
    ['--ui-grid-columns-lg' as string]: columnsLg ? String(columnsLg) : undefined,
    ['--ui-grid-columns-md' as string]: columnsMd ? String(columnsMd) : undefined,
    ['--ui-grid-columns-sm' as string]: columnsSm ? String(columnsSm) : undefined,
    ['--ui-grid-gap' as string]: typeof gap === 'number' ? `${gap}px` : gap,
    ['--ui-grid-min' as string]: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
  };

  return <div className={classes} style={inlineStyle} {...props} />;
}
