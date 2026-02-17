import React from 'react';
import { createPortal } from 'react-dom';
import styles from './Tooltip.module.css';

export type TooltipPlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right';
export type TooltipVariant = 'default' | 'info' | 'success' | 'warning' | 'danger';

type Props = {
  content: React.ReactNode;
  children?: React.ReactElement<any>;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delay?: number;
  interactive?: boolean;
  disabled?: boolean;
  maxWidth?: number | string;
  className?: string;
  contentClassName?: string;
  openOnHover?: boolean;
  openOnFocus?: boolean;
  openOnClick?: boolean;
  anchorRef?: React.RefObject<HTMLElement | null>;
  anchorId?: string;
};

const variantClass: Record<TooltipVariant, string> = {
  default: styles.variantDefault,
  info: styles.variantInfo,
  success: styles.variantSuccess,
  warning: styles.variantWarning,
  danger: styles.variantDanger,
};

const noop = () => {};

export function TooltipHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={[styles.header, className].filter(Boolean).join(' ')} {...props} />;
}

export function TooltipBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={[styles.body, className].filter(Boolean).join(' ')} {...props} />;
}

export function TooltipFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={[styles.footer, className].filter(Boolean).join(' ')} {...props} />;
}

const mergeRefs = <T,>(...refs: Array<React.Ref<T> | undefined>) => (value: T) => {
  refs.forEach((ref) => {
    if (!ref) {
      return;
    }
    if (typeof ref === 'function') {
      ref(value);
    } else {
      (ref as React.MutableRefObject<T>).current = value;
    }
  });
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function TooltipBase({
  content,
  children,
  placement = 'auto',
  variant = 'default',
  open,
  defaultOpen = false,
  onOpenChange,
  delay = 0,
  interactive = false,
  disabled = false,
  maxWidth,
  className,
  contentClassName,
  openOnHover = true,
  openOnFocus = true,
  openOnClick = false,
  anchorRef,
  anchorId,
}: Props) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const [resolvedPlacement, setResolvedPlacement] = React.useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const [mounted, setMounted] = React.useState(isControlled ? Boolean(open) : internalOpen);
  const [visible, setVisible] = React.useState(isControlled ? Boolean(open) : internalOpen);
  const hoverRef = React.useRef(false);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const openTimer = React.useRef<number | null>(null);
  const closeTimer = React.useRef<number | null>(null);

  const isOpen = isControlled ? open : internalOpen;
  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  const clearTimer = () => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  };

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleOpen = () => {
    if (disabled) {
      return;
    }
    clearCloseTimer();
    clearTimer();
    if (delay > 0) {
      openTimer.current = window.setTimeout(() => setOpen(true), delay);
    } else {
      setOpen(true);
    }
  };

  const scheduleClose = () => {
    clearTimer();
    clearCloseTimer();
    if (!interactive) {
      setOpen(false);
      return;
    }
    closeTimer.current = window.setTimeout(() => {
      if (!hoverRef.current) {
        setOpen(false);
      }
    }, 80);
  };

  const resolveAnchor = React.useCallback(() => {
    if (anchorRef?.current) {
      return anchorRef.current;
    }
    if (anchorId && typeof document !== 'undefined') {
      return document.getElementById(anchorId);
    }
    return triggerRef.current;
  }, [anchorId, anchorRef]);

  const updatePosition = React.useCallback(() => {
    const anchor = resolveAnchor();
    if (!anchor || !tooltipRef.current) {
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const padding = 8;
    const gap = 8;
    const available = {
      top: anchorRect.top - padding,
      bottom: window.innerHeight - anchorRect.bottom - padding,
      left: anchorRect.left - padding,
      right: window.innerWidth - anchorRect.right - padding,
    };

    let nextPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';
    if (placement === 'auto') {
      const fits = {
        top: available.top >= tooltipRect.height + gap,
        bottom: available.bottom >= tooltipRect.height + gap,
        left: available.left >= tooltipRect.width + gap,
        right: available.right >= tooltipRect.width + gap,
      };
      if (fits.bottom) nextPlacement = 'bottom';
      else if (fits.top) nextPlacement = 'top';
      else if (fits.right) nextPlacement = 'right';
      else if (fits.left) nextPlacement = 'left';
      else {
        const entries = Object.entries(available) as Array<[typeof nextPlacement, number]>;
        entries.sort((a, b) => b[1] - a[1]);
        nextPlacement = entries[0]?.[0] ?? 'bottom';
      }
    } else {
      nextPlacement = placement;
    }

    let top = 0;
    let left = 0;
    if (nextPlacement === 'top') {
      top = anchorRect.top - tooltipRect.height - gap;
      left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
    } else if (nextPlacement === 'bottom') {
      top = anchorRect.bottom + gap;
      left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
    } else if (nextPlacement === 'left') {
      top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
      left = anchorRect.left - tooltipRect.width - gap;
    } else if (nextPlacement === 'right') {
      top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
      left = anchorRect.right + gap;
    }

    top = clamp(top, padding, window.innerHeight - tooltipRect.height - padding);
    left = clamp(left, padding, window.innerWidth - tooltipRect.width - padding);

    setResolvedPlacement(nextPlacement);
    setStyle({
      top: `${top}px`,
      left: `${left}px`,
      maxWidth: maxWidth ? (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth) : undefined,
    });
  }, [placement, resolveAnchor, maxWidth]);

  React.useEffect(() => {
    if (!isOpen) {
      setStyle({});
      return;
    }
    updatePosition();
    const handler = () => updatePosition();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [isOpen, updatePosition]);

  React.useEffect(() => () => clearTimer(), []);

  React.useEffect(() => () => clearCloseTimer(), []);

  React.useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), 160);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }
    updatePosition();
  }, [mounted, updatePosition, content]);

  React.useEffect(() => {
    if (children || !openOnHover && !openOnFocus && !openOnClick) {
      return;
    }
    const anchor = resolveAnchor();
    if (!anchor) {
      return;
    }

    const handleEnter = () => openOnHover && scheduleOpen();
    const handleLeave = () => openOnHover && scheduleClose();
    const handleFocus = () => openOnFocus && scheduleOpen();
    const handleBlur = () => openOnFocus && scheduleClose();
    const handleClick = () => openOnClick && setOpen(!isOpen);

    anchor.addEventListener('mouseenter', handleEnter);
    anchor.addEventListener('mouseleave', handleLeave);
    anchor.addEventListener('focusin', handleFocus);
    anchor.addEventListener('focusout', handleBlur);
    anchor.addEventListener('click', handleClick);

    return () => {
      anchor.removeEventListener('mouseenter', handleEnter);
      anchor.removeEventListener('mouseleave', handleLeave);
      anchor.removeEventListener('focusin', handleFocus);
      anchor.removeEventListener('focusout', handleBlur);
      anchor.removeEventListener('click', handleClick);
    };
  }, [children, isOpen, openOnClick, openOnFocus, openOnHover, resolveAnchor]);

  const tooltip = mounted ? (
    <div
      className={[styles.tooltip, interactive ? styles.interactive : null, className].filter(Boolean).join(' ')}
      style={style}
      ref={tooltipRef}
      role="tooltip"
      data-state={visible ? 'open' : 'closed'}
      onMouseEnter={() => {
        if (!interactive) {
          return;
        }
        hoverRef.current = true;
        clearCloseTimer();
      }}
      onMouseLeave={() => {
        if (!interactive) {
          return;
        }
        hoverRef.current = false;
        scheduleClose();
      }}
    >
      <div
        className={[styles.bubble, variantClass[variant], contentClassName].filter(Boolean).join(' ')}
        data-placement={resolvedPlacement}
      >
        {content}
      </div>
    </div>
  ) : null;

  const canPortal = typeof document !== 'undefined' && Boolean(document.body);

  if (!children) {
    if (!canPortal) {
      return null;
    }
    return tooltip ? createPortal(tooltip, document.body) : null;
  }

  const childProps = (children.props ?? {}) as React.HTMLAttributes<HTMLElement>;
  const handleMouseEnter = openOnHover
    ? (event: React.MouseEvent) => {
        (childProps.onMouseEnter as ((event: React.MouseEvent) => void) | undefined)?.(event);
        scheduleOpen();
      }
    : childProps.onMouseEnter ?? noop;
  const handleMouseLeave = openOnHover
    ? (event: React.MouseEvent) => {
        (childProps.onMouseLeave as ((event: React.MouseEvent) => void) | undefined)?.(event);
        scheduleClose();
      }
    : childProps.onMouseLeave ?? noop;
  const handleFocus = openOnFocus
    ? (event: React.FocusEvent) => {
        (childProps.onFocus as ((event: React.FocusEvent) => void) | undefined)?.(event);
        scheduleOpen();
      }
    : childProps.onFocus ?? noop;
  const handleBlur = openOnFocus
    ? (event: React.FocusEvent) => {
        (childProps.onBlur as ((event: React.FocusEvent) => void) | undefined)?.(event);
        scheduleClose();
      }
    : childProps.onBlur ?? noop;
  const handleClick = openOnClick
    ? (event: React.MouseEvent) => {
        (childProps.onClick as ((event: React.MouseEvent) => void) | undefined)?.(event);
        setOpen(!isOpen);
      }
    : childProps.onClick ?? noop;

  const child = React.cloneElement(children as React.ReactElement<any>, {
    ref: mergeRefs((children as any).ref, triggerRef),
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onClick: handleClick,
  } as React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> });

  return (
    <>
      {child}
      {tooltip && canPortal ? createPortal(tooltip, document.body) : null}
    </>
  );
}

const TooltipComponent = Object.assign(TooltipBase, {
  Header: TooltipHeader,
  Body: TooltipBody,
  Footer: TooltipFooter,
});

export default TooltipComponent;
