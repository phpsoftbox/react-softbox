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
  const classes = [styles.input, hasError ? styles.error : null, className].filter(Boolean).join(' ');

  if (process.env.NODE_ENV !== 'production') {
    if (!props.id && !props.name) {
      // eslint-disable-next-line no-console
      console.warn('Input.Field: рекомендуется передавать id или name для связки с label.');
    }
  }

  React.useEffect(() => {
    context?.registerField(resolvedId, props.name);
  }, [context, resolvedId, props.name]);

  return <input ref={ref} id={resolvedId} className={classes} {...props} autoComplete={autoComplete} />;
});

InputField.displayName = 'InputField';

export default InputField;
