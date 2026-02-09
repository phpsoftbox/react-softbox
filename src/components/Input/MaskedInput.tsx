import React from 'react';
import InputField from './Field';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
  mask: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholderChar?: string;
};

const isDigit = (char: string) => /\d/.test(char);
const isLetter = (char: string) => /[a-zA-Z]/.test(char);
const isAlphaNum = (char: string) => /[a-zA-Z0-9]/.test(char);

const stripRaw = (value: string) => value.replace(/[^a-zA-Z0-9]/g, '');

const applyMask = (raw: string, mask: string, placeholderChar?: string) => {
  let rawIndex = 0;
  let output = '';

  for (let i = 0; i < mask.length; i += 1) {
    const maskChar = mask[i];
    const rawChar = raw[rawIndex];

    if (maskChar === '9' || maskChar === 'A' || maskChar === '*') {
      if (!rawChar) {
        if (placeholderChar) {
          output += placeholderChar;
          continue;
        }
        break;
      }

      const matches =
        (maskChar === '9' && isDigit(rawChar)) ||
        (maskChar === 'A' && isLetter(rawChar)) ||
        (maskChar === '*' && isAlphaNum(rawChar));

      if (matches) {
        output += rawChar;
        rawIndex += 1;
      } else {
        rawIndex += 1;
        i -= 1;
      }
      continue;
    }

    output += maskChar;
  }

  return output;
};

const extractRaw = (masked: string, mask: string) => {
  let raw = '';
  let maskIndex = 0;

  for (let i = 0; i < masked.length && maskIndex < mask.length; i += 1) {
    const maskChar = mask[maskIndex];
    const char = masked[i];

    if (maskChar === '9' || maskChar === 'A' || maskChar === '*') {
      const matches =
        (maskChar === '9' && isDigit(char)) ||
        (maskChar === 'A' && isLetter(char)) ||
        (maskChar === '*' && isAlphaNum(char));

      if (matches) {
        raw += char;
        maskIndex += 1;
      }
      continue;
    }

    if (char === maskChar) {
      maskIndex += 1;
    } else {
      maskIndex += 1;
      i -= 1;
    }
  }

  return raw;
};

export default function MaskedInput({ mask, value, onChange, placeholderChar, ...props }: Props) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState('');

  const displayValue = React.useMemo(() => {
    const raw = stripRaw(String(isControlled ? value ?? '' : internal));
    return applyMask(raw, mask, placeholderChar);
  }, [value, internal, mask, placeholderChar, isControlled]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = event.target.value;
    const raw = extractRaw(rawInput, mask);

    if (!isControlled) {
      setInternal(raw);
    }

    onChange?.(raw);
  };

  return <InputField {...props} value={displayValue} onChange={handleChange} />;
}
