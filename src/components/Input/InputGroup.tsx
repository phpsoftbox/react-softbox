import React from 'react';
import './InputGroup.module.css';

const GROUP_CLASS = 'rsb-input-group';
const GROUP_STRETCH_CLASS = 'rsb-input-group--stretch';
const ITEM_CLASS = 'rsb-group-item';
const ADDON_CLASS = 'rsb-input-addon';

type GroupProps = React.HTMLAttributes<HTMLDivElement> & {
  stretch?: boolean;
};

type AddonProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
};

export function InputGroup({ stretch = false, className, children, ...props }: GroupProps) {
  const classes = [GROUP_CLASS, stretch ? GROUP_STRETCH_CLASS : null, className].filter(Boolean).join(' ');

  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    const element = child as React.ReactElement<{ className?: string }>;
    const childClassName = [element.props.className, ITEM_CLASS].filter(Boolean).join(' ');
    return React.cloneElement(element, { className: childClassName });
  });

  return (
    <div className={classes} {...props}>
      {items}
    </div>
  );
}

export function InputAddon({ as = 'div', className, ...props }: AddonProps) {
  const Component = as as React.ElementType;
  const classes = [ADDON_CLASS, ITEM_CLASS, className].filter(Boolean).join(' ');
  return <Component className={classes} {...props} />;
}
