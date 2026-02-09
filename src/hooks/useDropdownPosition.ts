import React from 'react';

type Options = {
  gap?: number;
  align?: 'left' | 'right';
  placement?: 'auto' | 'down' | 'up';
  anchorRef?: React.RefObject<HTMLElement | null>;
};

type Result = {
  ref: React.RefObject<HTMLDivElement | null>;
  style: React.CSSProperties;
  placement: 'up' | 'down';
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export default function useDropdownPosition(open: boolean, options: Options = {}): Result {
  const { gap = 8, align = 'right', placement: requestedPlacement = 'auto', anchorRef } = options;
  const ref = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const [currentPlacement, setCurrentPlacement] = React.useState<'up' | 'down'>('down');

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
    setStyle({
      marginLeft: offset ? `${offset}px` : undefined,
      maxWidth: maxWidth ? `${maxWidth}px` : undefined,
      maxHeight: maxHeight ? `${maxHeight}px` : undefined,
      overflowY: maxHeight ? 'auto' : undefined,
      top: nextPlacement === 'down' ? `calc(100% + ${gap}px)` : 'auto',
      bottom: nextPlacement === 'up' ? `calc(100% + ${gap}px)` : 'auto',
      transformOrigin: `${nextPlacement === 'up' ? 'bottom' : 'top'} ${align}`,
    });
  }, [gap, align, requestedPlacement, anchorRef]);

  useIsomorphicLayoutEffect(() => {
    if (!open) {
      setStyle({});
      setCurrentPlacement('down');
      return;
    }

    compute();
  }, [open, compute]);

  return { ref, style, placement: currentPlacement };
}
