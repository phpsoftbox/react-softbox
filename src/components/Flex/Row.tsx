import React from 'react';
import styles from './Flex.module.css';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  gap?: number | string;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  wrap?: React.CSSProperties['flexWrap'];
};

export default function Row({ gap = '16px', align = 'center', justify = 'flex-start', wrap = 'nowrap', className, style, ...props }: Props) {
  const classes = [styles.row, className].filter(Boolean).join(' ');
  const inlineStyle: React.CSSProperties = {
    ...style,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    ['--ui-gap' as string]: typeof gap === 'number' ? `${gap}px` : gap,
  };

  return <div className={classes} style={inlineStyle} {...props} />;
}
