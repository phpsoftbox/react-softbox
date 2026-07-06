import React from 'react';
import './InputGroup.module.css';

const GROUP_CLASS = 'rsb-input-group';
const GROUP_STRETCH_CLASS = 'rsb-input-group--stretch';
const ITEM_CLASS = 'rsb-group-item';
const ADDON_CLASS = 'rsb-input-addon';

type GroupProps = React.HTMLAttributes<HTMLDivElement> & {
  stretch?: boolean;
};

type AddonVariant = 'default' | 'label' | 'muted' | 'choice';

type AddonProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  variant?: AddonVariant;
};

const mergeClassNames = (...classes: Array<string | undefined | null | false>) => classes.filter(Boolean).join(' ');

function InputGroupRoot({ stretch = false, className, children, ...props }: GroupProps) {
  const classes = [GROUP_CLASS, stretch ? GROUP_STRETCH_CLASS : null, className].filter(Boolean).join(' ');

  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    const element = child as React.ReactElement<{ className?: string }>;
    const childClassName = mergeClassNames(element.props.className, ITEM_CLASS);
    return React.cloneElement(element, { className: childClassName });
  });

  return (
    <div className={classes} {...props}>
      {items}
    </div>
  );
}

export function InputAddon({ as = 'div', variant = 'default', className, ...props }: AddonProps) {
  const Component = as as React.ElementType;
  const classes = [
    ADDON_CLASS,
    `${ADDON_CLASS}--${variant}`,
    ITEM_CLASS,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <Component className={classes} {...props} />;
}

export function InputGroupLabel(props: Omit<AddonProps, 'variant'>) {
  return <InputAddon as="span" {...props} variant="label" />;
}

export function InputGroupText(props: Omit<AddonProps, 'variant'>) {
  return <InputAddon as="span" {...props} variant="muted" />;
}

export function InputGroupChoice(props: Omit<AddonProps, 'variant'>) {
  return <InputAddon as="span" {...props} variant="choice" />;
}

export const InputGroup = Object.assign(InputGroupRoot, {
  Addon: InputAddon,
  Label: InputGroupLabel,
  Text: InputGroupText,
  Choice: InputGroupChoice,
});
