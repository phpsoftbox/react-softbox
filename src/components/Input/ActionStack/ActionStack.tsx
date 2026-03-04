import React from 'react';
import styles from './ActionStack.module.css';

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  children?: React.ReactNode;
};

const isVisibleAction = (child: React.ReactNode) => child !== null && child !== undefined && child !== false;

export const countActionItems = (children: React.ReactNode) =>
  React.Children.toArray(children).filter(isVisibleAction).length;

export default function ActionStack({ className, children, ...props }: Props) {
  const items = React.Children.toArray(children).filter(isVisibleAction);

  if (items.length === 0) {
    return null;
  }

  return (
    <span className={[styles.stack, className].filter(Boolean).join(' ')} {...props}>
      {items.map((child, index) => {
        const key = React.isValidElement(child) && child.key !== null ? child.key : index;
        return (
          <span key={String(key)} className={styles.item}>
            {child}
          </span>
        );
      })}
    </span>
  );
}
