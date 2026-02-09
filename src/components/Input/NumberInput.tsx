import React from 'react';
import InputField from './Field';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
  value?: string | number;
  onChange?: (value: string) => void;
  allowNegative?: boolean;
  decimalSeparator?: '.' | ',';
  decimalScale?: number;
};

const normalize = (raw: string, allowNegative: boolean) => {
  let next = raw.replace(/[^0-9,.-]/g, '');

  if (!allowNegative) {
    next = next.replace(/-/g, '');
  } else {
    const hasMinus = next.startsWith('-');
    next = next.replace(/-/g, '');
    if (hasMinus) {
      next = `-${next}`;
    }
  }

  const parts = next.split(/[.,]/);
  const integer = parts[0] ?? '';
  const decimal = parts.slice(1).join('');
  return { integer, decimal, negative: integer.startsWith('-') };
};

export default function NumberInput({
  value,
  onChange,
  allowNegative = false,
  decimalSeparator = '.',
  decimalScale = 2,
  ...props
}: Props) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState('');

  const displayValue = React.useMemo(() => {
    const source = isControlled ? String(value ?? '') : internal;
    const { integer, decimal } = normalize(source, allowNegative);
    const cleanInteger = integer.replace(/(?!^)-/g, '');
    const slicedDecimal = decimalScale >= 0 ? decimal.slice(0, decimalScale) : decimal;
    const base = `${cleanInteger}${slicedDecimal ? `${decimalSeparator}${slicedDecimal}` : ''}`;
    return base;
  }, [value, internal, allowNegative, decimalSeparator, decimalScale, isControlled]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const { integer, decimal } = normalize(raw, allowNegative);
    const nextDecimal = decimalScale >= 0 ? decimal.slice(0, decimalScale) : decimal;
    const normalized = `${integer.replace(/(?!^)-/g, '')}${nextDecimal ? `.${nextDecimal}` : ''}`;

    if (!isControlled) {
      setInternal(normalized);
    }

    onChange?.(normalized);
  };

  return (
    <InputField
      {...props}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
    />
  );
}
