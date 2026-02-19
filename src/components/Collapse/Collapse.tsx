import React from 'react';
import styles from './Collapse.module.css';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  duration?: number;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export default function Collapse({ open, duration = 180, className, style, children, ...props }: Props) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | 'auto'>(open ? 'auto' : 0);

  useIsomorphicLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) {
      return;
    }

    if (open) {
      const nextHeight = node.scrollHeight;
      setHeight(nextHeight);
      return;
    }

    if (height === 'auto') {
      const nextHeight = node.scrollHeight;
      setHeight(nextHeight);
      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => setHeight(0));
      } else {
        setHeight(0);
      }
      return;
    }

    setHeight(0);
  }, [open]);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'height') {
      return;
    }
    if (open) {
      setHeight('auto');
    }
  };

  const resolvedStyle: React.CSSProperties = {
    ...style,
    height: typeof height === 'number' ? `${height}px` : height,
    transitionDuration: `${duration}ms`,
  };

  return (
    <div
      className={[styles.collapse, className].filter(Boolean).join(' ')}
      style={resolvedStyle}
      data-state={open ? 'open' : 'closed'}
      aria-hidden={!open}
      onTransitionEnd={handleTransitionEnd}
      {...props}
    >
      <div ref={contentRef} className={styles.inner}>
        {children}
      </div>
    </div>
  );
}
