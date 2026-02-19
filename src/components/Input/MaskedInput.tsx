import React from 'react';
import InputField from './Field';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
  mask: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholderChar?: string;
  escapeChar?: string;
};

const isDigit = (char: string) => /\d/.test(char);
const isLetter = (char: string) => /[a-zA-Z]/.test(char);
const isAlphaNum = (char: string) => /[a-zA-Z0-9]/.test(char);

const isToken = (char: string) => char === '9' || char === 'A' || char === '*';

const applyMask = (raw: string, mask: string, placeholderChar?: string, escapeChar = '\\') => {
  let rawIndex = 0;
  let output = '';

  for (let i = 0; i < mask.length; i += 1) {
    const maskChar = mask[i];
    if (maskChar === escapeChar) {
      if (i + 1 < mask.length) {
        output += mask[i + 1];
        i += 1;
        continue;
      }
      output += maskChar;
      continue;
    }
    const rawChar = raw[rawIndex];

    if (isToken(maskChar)) {
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

const extractRaw = (masked: string, mask: string, escapeChar = '\\') => {
  let raw = '';
  let maskIndex = 0;

  for (let i = 0; i < masked.length && maskIndex < mask.length; i += 1) {
    const maskChar = mask[maskIndex];
    const char = masked[i];

    if (maskChar === escapeChar) {
      const literal = maskIndex + 1 < mask.length ? mask[maskIndex + 1] : escapeChar;
      if (char === literal) {
        maskIndex += 2;
      } else {
        maskIndex += 2;
        i -= 1;
      }
      continue;
    }

    if (isToken(maskChar)) {
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

export default function MaskedInput({
  mask,
  value,
  onChange,
  placeholderChar,
  escapeChar = '\\',
  onPaste,
  ...props
}: Props) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState('');

  const displayValue = React.useMemo(() => {
    const raw = extractRaw(String(isControlled ? value ?? '' : internal), mask, escapeChar);
    return applyMask(raw, mask, placeholderChar, escapeChar);
  }, [value, internal, mask, placeholderChar, isControlled, escapeChar]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = event.target.value;
    const raw = extractRaw(rawInput, mask, escapeChar);

    if (!isControlled) {
      setInternal(raw);
    }

    onChange?.(raw);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(event);
    if (event.defaultPrevented) {
      return;
    }
    const text = event.clipboardData?.getData('text');
    if (!text) {
      return;
    }
    const raw = extractRaw(text, mask, escapeChar);
    console.log(raw)
    if (!raw) {
      return;
    }
    event.preventDefault();
    if (!isControlled) {
      setInternal(raw);
    }
    onChange?.(raw);
  };

  return <InputField {...props} value={displayValue} onChange={handleChange} onPaste={handlePaste} />;
}
