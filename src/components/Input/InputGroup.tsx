import React from 'react';
import Tooltip from '../Tooltip/Tooltip';
import './InputGroup.css';

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

function markGroupItem(
  element: React.ReactElement<{ className?: string; children?: React.ReactNode }>,
): React.ReactElement {
  // Tooltip's className styles the popup; group styles belong on its trigger.
  if (element.type === Tooltip && React.isValidElement(element.props.children)) {
    return React.cloneElement(element, {
      children: markGroupItem(element.props.children as React.ReactElement<{ className?: string; children?: React.ReactNode }>),
    });
  }

  return React.cloneElement(element, {
    className: mergeClassNames(element.props.className, ITEM_CLASS),
  });
}

function InputGroupRoot({ stretch = false, className, children, ...props }: GroupProps) {
  const classes = [GROUP_CLASS, stretch ? GROUP_STRETCH_CLASS : null, className].filter(Boolean).join(' ');

  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    return markGroupItem(child as React.ReactElement<{ className?: string; children?: React.ReactNode }>);
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
