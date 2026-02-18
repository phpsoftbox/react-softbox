import React from 'react';

type Options = {
  gap?: number;
  align?: 'left' | 'right';
  placement?: 'auto' | 'down' | 'up';
  anchorRef?: React.RefObject<HTMLElement | null>;
  strategy?: 'absolute' | 'fixed';
};

type Result = {
  ref: React.RefObject<HTMLDivElement | null>;
  style: React.CSSProperties;
  placement: 'up' | 'down';
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export default function useDropdownPosition(open: boolean, options: Options = {}): Result {
  const { gap = 8, align = 'right', placement: requestedPlacement = 'auto', anchorRef, strategy = 'absolute' } = options;
  const ref = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const [currentPlacement, setCurrentPlacement] = React.useState<'up' | 'down'>('down');

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const compute = React.useCallback(() => {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const anchorRect = anchorRef?.current?.getBoundingClientRect() ?? rect;
    const padding = 12;
    const availableWidth = window.innerWidth - padding * 2;
    const availableBelow = window.innerHeight - padding - anchorRect.bottom - gap;
    const availableAbove = anchorRect.top - padding - gap;
    let offset = 0;
    let maxWidth: number | undefined;
    let maxHeight: number | undefined;
    let nextPlacement: 'up' | 'down' = requestedPlacement === 'auto' ? 'down' : requestedPlacement;

    if (rect.right > window.innerWidth - padding) {
      offset = window.innerWidth - padding - rect.right;
    }

    if (rect.left + offset < padding) {
      offset = padding - rect.left;
    }

    if (rect.width > availableWidth) {
      maxWidth = availableWidth;
    }

    if (requestedPlacement === 'auto') {
      if (rect.height > availableBelow && availableAbove > availableBelow) {
        nextPlacement = 'up';
      }
    }

    const availableSpace = nextPlacement === 'up' ? availableAbove : availableBelow;
    if (availableSpace > 0 && rect.height > availableSpace) {
      maxHeight = Math.max(140, availableSpace);
    }

    setCurrentPlacement(nextPlacement);

    if (strategy === 'fixed' && anchorRef?.current) {
      const anchor = anchorRef.current.getBoundingClientRect();
      let left = align === 'right' ? anchor.right - rect.width : anchor.left;
      const maxLeft = window.innerWidth - padding - rect.width;
      left = clamp(left, padding, Math.max(padding, maxLeft));

      let top = nextPlacement === 'down' ? anchor.bottom + gap : anchor.top - rect.height - gap;
      const maxTop = window.innerHeight - padding - rect.height;
      top = clamp(top, padding, Math.max(padding, maxTop));

      setStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        overflowY: maxHeight ? 'auto' : undefined,
        transformOrigin: `${nextPlacement === 'up' ? 'bottom' : 'top'} ${align}`,
      });
      return;
    }

    setStyle({
      marginLeft: offset ? `${offset}px` : undefined,
      maxWidth: maxWidth ? `${maxWidth}px` : undefined,
      maxHeight: maxHeight ? `${maxHeight}px` : undefined,
      overflowY: maxHeight ? 'auto' : undefined,
      top: nextPlacement === 'down' ? `calc(100% + ${gap}px)` : 'auto',
      bottom: nextPlacement === 'up' ? `calc(100% + ${gap}px)` : 'auto',
      transformOrigin: `${nextPlacement === 'up' ? 'bottom' : 'top'} ${align}`,
    });
  }, [gap, align, requestedPlacement, anchorRef, strategy]);

  useIsomorphicLayoutEffect(() => {
    if (!open) {
      setStyle({});
      setCurrentPlacement('down');
      return;
    }

    compute();
    if (strategy !== 'fixed') {
      return;
    }
    const handler = () => compute();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [open, compute, strategy]);

  return { ref, style, placement: currentPlacement };
}
