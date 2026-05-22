import React from 'react';
import styles from './Card.module.css';
import Button from '../Button/Button';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  titleAs?: React.ElementType;
  subtitleAs?: React.ElementType;
};
type CardHeaderTextOwnProps = {
  className?: string;
};
type CardHeaderTextProps<TElement extends React.ElementType> =
  CardHeaderTextOwnProps
  & { as?: TElement }
  & Omit<React.ComponentPropsWithoutRef<TElement>, keyof CardHeaderTextOwnProps | 'as'>;
type CardHeaderTitleComponent = <TElement extends React.ElementType = 'h1'>(
  props: CardHeaderTextProps<TElement>
) => React.ReactElement | null;
type CardHeaderSubtitleComponent = <TElement extends React.ElementType = 'p'>(
  props: CardHeaderTextProps<TElement>
) => React.ReactElement | null;

type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;
type CardToolbarProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: 'left' | 'right' | 'between';
  buttonHideLabelOn?: 'never' | 'md';
};
type CardToolbarGroupProps = React.HTMLAttributes<HTMLDivElement>;
type CardToolbarButtonBaseProps = Omit<React.ComponentProps<typeof Button>, 'children'> & {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  hideLabelOn?: 'never' | 'md';
};
type CardToolbarButtonProps =
  | (CardToolbarButtonBaseProps & { icon: React.ReactNode; label?: React.ReactNode })
  | (CardToolbarButtonBaseProps & { icon?: React.ReactNode; label: React.ReactNode });

type ToolbarRowMeta = {
  row: number;
  rowStart: boolean;
};

type CardToolbarComponent = React.FC<CardToolbarProps> & {
  Group: React.FC<CardToolbarGroupProps>;
  Button: React.FC<CardToolbarButtonProps>;
};
type CardHeaderComponent = React.FC<CardHeaderProps> & {
  Title: CardHeaderTitleComponent;
  Subtitle: CardHeaderSubtitleComponent;
};

type CardComponent = React.FC<CardProps> & {
  Header: CardHeaderComponent;
  Toolbar: CardToolbarComponent;
  Body: React.FC<CardSectionProps>;
  Footer: React.FC<CardSectionProps>;
};

function CardBase({ className, ...props }: CardProps) {
  const classes = [styles.card, className].filter(Boolean).join(' ');
  return <section className={classes} {...props} />;
}

function CardHeader({
  title,
  subtitle,
  right,
  titleAs: TitleComponent = 'h1',
  subtitleAs: SubtitleComponent = 'p',
  className,
  children,
  ...props
}: CardHeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(' ');
  const left = children ?? (
    <>
      {title ? <TitleComponent className={styles.title}>{title}</TitleComponent> : null}
      {subtitle ? <SubtitleComponent className={styles.subtitle}>{subtitle}</SubtitleComponent> : null}
    </>
  );

  return (
    <div className={classes} {...props}>
      <div className={styles.headerMain}>{left}</div>
      {right ? <div className={styles.headerAside}>{right}</div> : null}
    </div>
  );
}

const CardHeaderTitle: CardHeaderTitleComponent = ({
  as: Component = 'h1',
  className,
  ...props
}) => {
  const classes = [styles.title, className].filter(Boolean).join(' ');
  return <Component className={classes} {...props} />;
};

const CardHeaderSubtitle: CardHeaderSubtitleComponent = ({
  as: Component = 'p',
  className,
  ...props
}) => {
  const classes = [styles.subtitle, className].filter(Boolean).join(' ');
  return <Component className={classes} {...props} />;
};

function CardBody({ className, ...props }: CardSectionProps) {
  const classes = [styles.body, className].filter(Boolean).join(' ');
  return <div className={classes} {...props} />;
}

function CardFooter({ className, ...props }: CardSectionProps) {
  const classes = [styles.footer, className].filter(Boolean).join(' ');
  return <div className={classes} {...props} />;
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
const CardToolbarContext = React.createContext<{ hideLabelOn: 'never' | 'md' }>({ hideLabelOn: 'md' });

const resolveToolbarRows = (elements: HTMLElement[]): ToolbarRowMeta[] => {
  let currentTop: number | null = null;
  let currentRow = 0;

  return elements.map((element) => {
    const top = Math.round(element.offsetTop);
    if (currentTop === null) {
      currentTop = top;
      return { row: currentRow, rowStart: true };
    }

    if (Math.abs(top - currentTop) > 1) {
      currentTop = top;
      currentRow += 1;
      return { row: currentRow, rowStart: true };
    }

    return { row: currentRow, rowStart: false };
  });
};

const isSameRows = (left: ToolbarRowMeta[], right: ToolbarRowMeta[]) => {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index].row !== right[index].row || left[index].rowStart !== right[index].rowStart) {
      return false;
    }
  }

  return true;
};

function CardToolbarBase({
  align = 'left',
  buttonHideLabelOn = 'md',
  className,
  children,
  ...props
}: CardToolbarProps) {
  const alignClass = align === 'right'
    ? styles.toolbarAlignRight
    : align === 'between'
      ? styles.toolbarAlignBetween
      : styles.toolbarAlignLeft;
  const classes = [styles.toolbar, alignClass, className].filter(Boolean).join(' ');
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [rows, setRows] = React.useState<ToolbarRowMeta[]>([]);
  const toolbarChildren = React.Children.toArray(children);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    let frameId: number | null = null;

    const collect = () => {
      root.setAttribute('data-toolbar-measuring', 'true');
      try {
        const items = Array.from(root.querySelectorAll<HTMLElement>('[data-card-toolbar-item="true"]'));
        const nextRows = resolveToolbarRows(items);
        setRows((previousRows) => (isSameRows(previousRows, nextRows) ? previousRows : nextRows));
      } finally {
        root.removeAttribute('data-toolbar-measuring');
      }
    };

    const scheduleCollect = () => {
      if (typeof window === 'undefined') {
        collect();
        return;
      }
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        collect();
      });
    };

    scheduleCollect();
    const handleResize = () => scheduleCollect();
    window.addEventListener('resize', handleResize);

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => scheduleCollect());
      observer.observe(root);
      Array.from(root.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          observer.observe(child);
        }
      });
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
        }
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [toolbarChildren.length]);

  return (
    <CardToolbarContext.Provider value={{ hideLabelOn: buttonHideLabelOn }}>
      <div ref={rootRef} className={classes} {...props}>
        {toolbarChildren.map((child, index) => {
          const rowMeta = rows[index];
          const key = React.isValidElement(child) && child.key !== null ? child.key : `toolbar-item-${index}`;
          const row = rowMeta?.row ?? 0;
          const rowStart = rowMeta?.rowStart ?? index === 0;

          return (
            <div
              key={key}
              className={styles.toolbarItem}
              data-card-toolbar-item="true"
              data-toolbar-row={row}
              data-toolbar-row-start={rowStart ? 'true' : 'false'}
              data-toolbar-row-wrapped={row > 0 ? 'true' : 'false'}
            >
              {child}
            </div>
          );
        })}
      </div>
    </CardToolbarContext.Provider>
  );
}

function CardToolbarButton({
  icon,
  label,
  hideLabelOn,
  className,
  ...props
}: CardToolbarButtonProps) {
  const toolbarConfig = React.useContext(CardToolbarContext);
  const resolvedHideLabelOn = hideLabelOn ?? toolbarConfig.hideLabelOn;
  const hasIcon = icon !== undefined && icon !== null;
  const hasLabel = label !== undefined && label !== null;

  if (!hasIcon && !hasLabel) {
    return null;
  }

  const hasBoth = hasIcon && hasLabel;
  const classes = [
    styles.toolbarButton,
    hasBoth ? styles.toolbarButtonHasBoth : null,
    hasBoth && resolvedHideLabelOn === 'md' ? styles.toolbarButtonHideLabelMd : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Button size="sm" appearance="outline" className={classes} {...props}>
      {hasIcon ? <span className={styles.toolbarButtonIcon}>{icon}</span> : null}
      {hasBoth ? <span className={styles.toolbarButtonSeparator} aria-hidden="true" /> : null}
      {hasLabel ? (
        <span className={styles.toolbarButtonLabel}>
          {label}
        </span>
      ) : null}
    </Button>
  );
}

function CardToolbarGroup({ className, ...props }: CardToolbarGroupProps) {
  const classes = [styles.toolbarGroup, className].filter(Boolean).join(' ');

  return <div className={classes} {...props} />;
}

const CardToolbar = Object.assign(CardToolbarBase, {
  Group: CardToolbarGroup,
  Button: CardToolbarButton,
}) as CardToolbarComponent;

const CardHeaderComponent = Object.assign(CardHeader, {
  Title: CardHeaderTitle,
  Subtitle: CardHeaderSubtitle,
}) as CardHeaderComponent;

const Card = Object.assign(CardBase, {
  Header: CardHeaderComponent,
  Toolbar: CardToolbar,
  Body: CardBody,
  Footer: CardFooter,
}) as CardComponent;

export default Card;
