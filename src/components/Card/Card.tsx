import React from 'react';
import styles from './Card.module.css';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
};

type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;
type CardToolbarProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: 'left' | 'right' | 'between';
};

type CardComponent = React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Toolbar: React.FC<CardToolbarProps>;
  Body: React.FC<CardSectionProps>;
  Footer: React.FC<CardSectionProps>;
};

function CardBase({ className, ...props }: CardProps) {
  const classes = [styles.card, className].filter(Boolean).join(' ');
  return <section className={classes} {...props} />;
}

function CardHeader({ title, subtitle, right, className, children, ...props }: CardHeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(' ');
  const left = children ?? (
    <>
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </>
  );

  return (
    <div className={classes} {...props}>
      <div className={styles.headerMain}>{left}</div>
      {right ? <div className={styles.headerAside}>{right}</div> : null}
    </div>
  );
}

function CardBody({ className, ...props }: CardSectionProps) {
  const classes = [styles.body, className].filter(Boolean).join(' ');
  return <div className={classes} {...props} />;
}

function CardFooter({ className, ...props }: CardSectionProps) {
  const classes = [styles.footer, className].filter(Boolean).join(' ');
  return <div className={classes} {...props} />;
}

function CardToolbar({ align = 'left', className, ...props }: CardToolbarProps) {
  const alignClass = align === 'right'
    ? styles.toolbarAlignRight
    : align === 'between'
      ? styles.toolbarAlignBetween
      : styles.toolbarAlignLeft;
  const classes = [styles.toolbar, alignClass, className].filter(Boolean).join(' ');

  return <div className={classes} {...props} />;
}

const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Toolbar: CardToolbar,
  Body: CardBody,
  Footer: CardFooter,
}) as CardComponent;

export default Card;
