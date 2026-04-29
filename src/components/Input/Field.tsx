import React from 'react';
import styles from './Input.module.css';
import { useFormFieldContext } from './FormField/FormField';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

const buildIdFromName = (name: string) => `field-${name.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

const InputField = React.forwardRef<HTMLInputElement, Props>(({ hasError, className, ...props }, ref) => {
  const context = useFormFieldContext();
  const generatedId = React.useId();
  const resolvedId = props.id ?? context?.fieldId ?? (props.name ? buildIdFromName(props.name) : generatedId);
  const autoComplete = props.autoComplete ?? 'off';
  const classes = [
    styles.input,
    hasError ? styles.error : null,
    context?.hasErrorTooltip ? styles.withErrorTooltip : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const warnedRef = React.useRef(false);
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    if (!props.id && !props.name && !warnedRef.current) {
      warnedRef.current = true;
      // eslint-disable-next-line no-console
      console.warn('Input.Field: рекомендуется передавать id или name для связки с label.');
    }
  }, [props.id, props.name]);

  React.useEffect(() => {
    context?.registerField(resolvedId, props.name, props.required === true);
  }, [context, resolvedId, props.name, props.required]);

  return <input ref={ref} id={resolvedId} className={classes} {...props} autoComplete={autoComplete} />;
});

InputField.displayName = 'InputField';

export default InputField;
