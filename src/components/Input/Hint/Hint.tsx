import React from 'react';
import Tooltip, { type TooltipPlacement } from '../../Tooltip/Tooltip';
import styles from './Hint.module.css';

type Props = {
  content?: React.ReactNode;
  placement?: TooltipPlacement;
  className?: string;
  ariaLabel?: string;
};

export default function Hint({
  content,
  placement = 'auto',
  className,
  ariaLabel = 'Подсказка',
}: Props) {
  if (content === null || content === undefined || content === '') {
    return null;
  }

  return (
    <Tooltip content={content} placement={placement} openOnHover openOnFocus>
      <button
        type="button"
        className={[styles.trigger, className].filter(Boolean).join(' ')}
        aria-label={ariaLabel}
      >
        ?
      </button>
    </Tooltip>
  );
}
