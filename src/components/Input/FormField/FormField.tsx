import React from 'react';
import styles from './FormField.module.css';
import Hint from '../Hint/Hint';
import type { TooltipPlacement } from '../../Tooltip/Tooltip';

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

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  hint?: React.ReactNode;
  hintPlacement?: TooltipPlacement;
  required?: boolean;
};

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
  fieldRequired?: boolean;
  registerField: (id: string, name?: string, required?: boolean) => void;
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
  const [fieldRequired, setFieldRequired] = React.useState(false);
  const [errorTooltipCount, setErrorTooltipCount] = React.useState(0);

  const registerField = React.useCallback((id: string, name?: string, required?: boolean) => {
    setFieldId(id);
    if (name) {
      setFieldName(name);
    }
    if (required !== undefined) {
      setFieldRequired(required);
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
        fieldRequired,
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
  const {
    hint,
    hintPlacement = 'auto',
    required,
    children,
    ...rest
  } = props;
  const classes = [styles.label, className].filter(Boolean).join(' ');
  const htmlFor = rest.htmlFor ?? context?.fieldId;
  const isRequired = required ?? context?.fieldRequired ?? false;

  return (
    <label className={classes} {...rest} htmlFor={htmlFor}>
      <span className={styles.labelInner}>
        <span>
          {children}
          {isRequired ? <span className={styles.requiredMark} aria-hidden="true"> *</span> : null}
        </span>
        <Hint content={hint} placement={hintPlacement} ariaLabel="Подсказка к полю" />
      </span>
    </label>
  );
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
