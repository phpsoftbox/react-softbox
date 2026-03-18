import React from 'react';
import styles from './Textarea.module.css';
import { useFormFieldContext } from '../FormField/FormField';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
  floatLabel?: boolean;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  {
    hasError = false,
    floatLabel = false,
    className,
    ...props
  },
  ref
) {
  const context = useFormFieldContext();
  const generatedId = React.useId();
  const resolvedId = props.id ?? context?.fieldId ?? (props.name ? `field-${props.name}` : generatedId);
  const classes = [styles.textarea, floatLabel ? styles.floatLabel : null, hasError ? styles.error : null, className]
    .filter(Boolean)
    .join(' ');

  if (process.env.NODE_ENV !== 'production') {
    if (!props.id && !props.name) {
      // eslint-disable-next-line no-console
      console.warn('Input.TextArea: рекомендуется передавать id или name для связки с label.');
    }
  }

  React.useEffect(() => {
    context?.registerField(resolvedId, props.name, props.required === true);
  }, [context, resolvedId, props.name, props.required]);

  return <textarea ref={ref} id={resolvedId} className={classes} {...props} />;
});

Textarea.displayName = 'Textarea';
(Textarea as typeof Textarea & { supportsFloatLabel?: boolean }).supportsFloatLabel = true;

export default Textarea;
