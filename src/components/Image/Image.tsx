import React from 'react';
import styles from './Image.module.css';

type ImageShape = 'rounded' | 'circle' | 'square';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  shape?: ImageShape;
};

export default function Image({ shape = 'rounded', className, ...props }: Props) {
  const classes = [
    styles.image,
    shape === 'rounded' ? styles.rounded : null,
    shape === 'circle' ? styles.circle : null,
    shape === 'square' ? styles.square : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <img className={classes} {...props} />;
}
