import React from 'react';
import Tooltip, { type TooltipPlacement, type TooltipVariant } from '../../Tooltip/Tooltip';
import { useFormFieldContext } from '../FormField/FormField';
import styles from './ErrorTooltip.module.css';
import ActionStack from '../ActionStack/ActionStack';

type Props = {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  target?: 'icon' | 'input';
  icon?: React.ReactNode;
  className?: string;
};

export default function ErrorTooltip({
  content,
  placement = 'right',
  variant = 'danger',
  target = 'icon',
  icon = '!',
  className,
}: Props) {
  const context = useFormFieldContext();

  React.useEffect(() => {
    if (target !== 'icon') {
      return;
    }
    if (!context?.registerErrorTooltip) {
      return;
    }
    return context.registerErrorTooltip();
  }, [context, target]);

  if (target === 'input') {
    if (!context?.fieldId) {
      return null;
    }
    return (
      <Tooltip
        content={content}
        placement={placement}
        variant={variant}
        anchorId={context.fieldId}
        openOnHover
        openOnFocus
      />
    );
  }

  return (
    <ActionStack>
      <Tooltip content={content} placement={placement} variant={variant} openOnHover openOnFocus>
        <button type="button" className={[styles.icon, styles.iconButton, className].filter(Boolean).join(' ')} aria-label="Ошибка">
          {icon}
        </button>
      </Tooltip>
    </ActionStack>
  );
}
