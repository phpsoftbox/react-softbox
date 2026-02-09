import React from 'react';
import styles from './Flex.module.css';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  gap?: number | string;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
};

export default function Stack({ gap = '16px', align = 'stretch', justify = 'flex-start', className, style, ...props }: Props) {
  const classes = [styles.stack, className].filter(Boolean).join(' ');
  const inlineStyle: React.CSSProperties = {
    ...style,
    alignItems: align,
    justifyContent: justify,
    ['--ui-gap' as string]: typeof gap === 'number' ? `${gap}px` : gap,
  };

  return <div className={classes} style={inlineStyle} {...props} />;
}
