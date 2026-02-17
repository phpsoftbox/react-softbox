import React from 'react';
import styles from './FormField.module.css';

type Layout = 'column' | 'row';
type Align = 'start' | 'center' | 'end';
type LabelAlign = 'left' | 'center' | 'right';

type FormFieldProps = React.HTMLAttributes<HTMLDivElement> & {
  layout?: Layout;
  gap?: number | string;
  labelWidth?: number | string;
  align?: Align;
  labelAlign?: LabelAlign;
};

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

type ControlProps = React.HTMLAttributes<HTMLDivElement>;

type ErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

type FormFieldComponent = React.FC<FormFieldProps> & {
  Label: React.FC<LabelProps>;
  Control: React.FC<ControlProps>;
  ErrorBag: React.FC<ErrorProps>;
};

type FormFieldContextValue = {
  fieldId?: string;
  fieldName?: string;
  registerField: (id: string, name?: string) => void;
  registerErrorTooltip?: () => () => void;
  hasErrorTooltip?: boolean;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

export const useFormFieldContext = () => React.useContext(FormFieldContext);

const alignMap: Record<Align, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
};

const labelAlignMap: Record<LabelAlign, string> = {
  left: 'left',
  center: 'center',
  right: 'right',
};

function FormFieldRoot({
  layout = 'column',
  gap = '8px',
  labelWidth,
  align = 'start',
  labelAlign = 'left',
  className,
  style,
  ...props
}: FormFieldProps) {
  const [fieldId, setFieldId] = React.useState<string | undefined>(undefined);
  const [fieldName, setFieldName] = React.useState<string | undefined>(undefined);
  const [errorTooltipCount, setErrorTooltipCount] = React.useState(0);

  const registerField = React.useCallback((id: string, name?: string) => {
    setFieldId(id);
    if (name) {
      setFieldName(name);
    }
  }, []);

  const registerErrorTooltip = React.useCallback(() => {
    setErrorTooltipCount((prev) => prev + 1);
    return () => setErrorTooltipCount((prev) => Math.max(prev - 1, 0));
  }, []);

  const classes = [styles.field, layout === 'row' ? styles.fieldRow : null, className]
    .filter(Boolean)
    .join(' ');

  const inlineStyle: React.CSSProperties & {
    ['--ui-field-gap']?: string;
    ['--ui-label-width']?: string;
    ['--ui-field-align']?: string;
    ['--ui-label-align']?: string;
  } = {
    ...style,
    ['--ui-field-gap']: typeof gap === 'number' ? `${gap}px` : gap,
    ['--ui-label-width']:
      labelWidth !== undefined ? (typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth) : undefined,
    ['--ui-field-align']: alignMap[align],
    ['--ui-label-align']: labelAlignMap[labelAlign],
  };

  return (
    <FormFieldContext.Provider
      value={{
        fieldId,
        fieldName,
        registerField,
        registerErrorTooltip,
        hasErrorTooltip: errorTooltipCount > 0,
      }}
    >
      <div className={classes} style={inlineStyle} {...props} />
    </FormFieldContext.Provider>
  );
}

function FormFieldLabel({ className, ...props }: LabelProps) {
  const context = useFormFieldContext();
  const classes = [styles.label, className].filter(Boolean).join(' ');
  const htmlFor = props.htmlFor ?? context?.fieldId;
  return <label className={classes} {...props} htmlFor={htmlFor} />;
}

function FormFieldControl({ className, ...props }: ControlProps) {
  const classes = [styles.control, className].filter(Boolean).join(' ');
  return <div className={classes} {...props} />;
}

function FormFieldError({ className, children, ...props }: ErrorProps) {
  if (!children) {
    return null;
  }
  const classes = [styles.error, className].filter(Boolean).join(' ');
  return (
    <div className={classes} role="alert" {...props}>
      {children}
    </div>
  );
}

const FormField = Object.assign(FormFieldRoot, {
  Label: FormFieldLabel,
  Control: FormFieldControl,
  ErrorBag: FormFieldError,
}) as FormFieldComponent;

export default FormField;
