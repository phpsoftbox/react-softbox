import React from 'react';
import InputField from './Field';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
  value?: string | number;
  onChange?: (value: string) => void;
  allowNegative?: boolean;
  min?: number;
  max?: number;
  decimalSeparator?: '.' | ',';
  decimalScale?: number;
};

const normalize = (raw: string, allowNegative: boolean) => {
  let next = raw.replace(/[^0-9,.-]/g, '');
  let sign = '';

  if (allowNegative && next.startsWith('-')) {
    sign = '-';
  }

  next = next.replace(/-/g, '');

  const parts = next.split(/[.,]/);
  const integer = parts[0] ?? '';
  const decimal = parts.slice(1).join('');
  const hasSeparator = next.includes('.') || next.includes(',');

  return { sign, integer, decimal, hasSeparator };
};

const formatValue = (
  value: string | number | undefined,
  allowNegative: boolean,
  decimalSeparator: '.' | ',',
  decimalScale: number,
) => {
  if (value === undefined || value === null || value === '') {
    return '';
  }

  const raw = String(value);
  const { sign, integer, decimal, hasSeparator } = normalize(raw, allowNegative);
  const slicedDecimal = decimalScale >= 0 ? decimal.slice(0, decimalScale) : decimal;
  const showSeparator = hasSeparator || slicedDecimal.length > 0 || /[.,]$/.test(raw);
  const separator = decimalSeparator;
  const integerPart = `${sign}${integer}`;

  if (!showSeparator) {
    return integerPart;
  }

  return `${integerPart}${separator}${slicedDecimal}`;
};

const buildNormalizedValue = (sign: string, integer: string, decimal: string) => {
  const hasInteger = integer !== '';
  const hasDecimal = decimal !== '';

  if (!hasInteger && !hasDecimal) {
    return null;
  }

  if (!hasInteger && hasDecimal) {
    return `${sign}0.${decimal}`;
  }

  if (hasInteger && !hasDecimal) {
    return `${sign}${integer}`;
  }

  return `${sign}${integer}.${decimal}`;
};

const trimZeros = (value: string) => value.replace(/\.?0+$/, '');

export default function NumberInput({
  value,
  onChange,
  allowNegative = false,
  min,
  max,
  decimalSeparator = '.',
  decimalScale = 2,
  onBlur,
  ...props
}: Props) {
  const [internal, setInternal] = React.useState(() =>
    formatValue(value, allowNegative, decimalSeparator, decimalScale),
  );

  React.useEffect(() => {
    if (value === undefined) {
      return;
    }
    setInternal(formatValue(value, allowNegative, decimalSeparator, decimalScale));
  }, [value, allowNegative, decimalSeparator, decimalScale]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const pattern = allowNegative ? /^-?[0-9]*[.,]?[0-9]*$/ : /^[0-9]*[.,]?[0-9]*$/;

    if (!pattern.test(raw)) {
      return;
    }

    const { sign, integer, decimal, hasSeparator } = normalize(raw, allowNegative);
    const slicedDecimal = decimalScale >= 0 ? decimal.slice(0, decimalScale) : decimal;
    const showSeparator = hasSeparator || /[.,]$/.test(raw);
    const nextDisplay = `${sign}${integer}${showSeparator ? `${decimalSeparator}${slicedDecimal}` : ''}`;
    setInternal(nextDisplay);

    if (raw === '') {
      onChange?.('');
      return;
    }

    const normalized = buildNormalizedValue(sign, integer, slicedDecimal);
    if (normalized !== null) {
      onChange?.(normalized);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { sign, integer, decimal } = normalize(event.target.value, allowNegative);
    const slicedDecimal = decimalScale >= 0 ? decimal.slice(0, decimalScale) : decimal;
    const normalized = buildNormalizedValue(sign, integer, slicedDecimal);

    if (!normalized || normalized === '-' || normalized === '.') {
      if (typeof min === 'number') {
        const formatted = trimZeros(
          decimalScale >= 0 ? min.toFixed(decimalScale) : min.toString(),
        );
        onChange?.(formatted);
        setInternal(formatValue(formatted, allowNegative, decimalSeparator, decimalScale));
      } else {
        onChange?.('');
        setInternal('');
      }
      onBlur?.(event);
      return;
    }

    let numValue = Number.parseFloat(normalized);

    if (Number.isNaN(numValue)) {
      onChange?.('');
      setInternal('');
      onBlur?.(event);
      return;
    }

    if (typeof min === 'number' && numValue < min) {
      numValue = min;
    }

    if (typeof max === 'number' && numValue > max) {
      numValue = max;
    }

    let formatted = decimalScale >= 0 ? numValue.toFixed(decimalScale) : numValue.toString();
    formatted = trimZeros(formatted);

    onChange?.(formatted);
    setInternal(formatValue(formatted, allowNegative, decimalSeparator, decimalScale));
    onBlur?.(event);
  };

  return (
    <InputField
      {...props}
      type="text"
      inputMode="decimal"
      value={internal}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}
