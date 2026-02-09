import React from 'react';
import styles from './Textarea.module.css';
import { useFormFieldContext } from '../FormField/FormField';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export default function Textarea({
  hasError = false,
  className,
  ...props
}: Props) {
  const context = useFormFieldContext();
  const generatedId = React.useId();
  const resolvedId = props.id ?? context?.fieldId ?? (props.name ? `field-${props.name}` : generatedId);
  const classes = [styles.textarea, hasError ? styles.error : null, className].filter(Boolean).join(' ');

  if (process.env.NODE_ENV !== 'production') {
    if (!props.id && !props.name) {
      // eslint-disable-next-line no-console
      console.warn('Input.TextArea: рекомендуется передавать id или name для связки с label.');
    }
  }

  React.useEffect(() => {
    context?.registerField(resolvedId, props.name);
  }, [context, resolvedId, props.name]);

  return <textarea id={resolvedId} className={classes} {...props} />;
}
