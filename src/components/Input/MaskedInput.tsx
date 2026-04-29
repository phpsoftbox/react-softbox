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
  onKeyDown,
  onPaste,
  ...props
}: Props) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const displayValue = React.useMemo(() => {
    const raw = extractRaw(String(isControlled ? value ?? '' : internal), mask, escapeChar);
    return applyMask(raw, mask, placeholderChar, escapeChar);
  }, [value, internal, mask, placeholderChar, isControlled, escapeChar]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = event.target.value;
    const raw = extractRaw(rawInput, mask, escapeChar);

    const updateRaw = (nextRaw: string) => {
      if (!isControlled) {
        setInternal(nextRaw);
      }

      onChange?.(nextRaw);
    };

    updateRaw(raw);
  };

  const handleKeyDownInternal = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }
    if (event.key !== 'Backspace') {
      return;
    }

    const target = event.currentTarget;
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? start;
    if (start <= 0 || start !== end) {
      return;
    }

    const masked = target.value;
    const raw = extractRaw(masked, mask, escapeChar);
    const rawBefore = extractRaw(masked.slice(0, start), mask, escapeChar);
    const rawBeforePrev = extractRaw(masked.slice(0, start - 1), mask, escapeChar);

    // If deleting a literal mask symbol, remove the previous data char instead.
    if (rawBefore.length !== rawBeforePrev.length) {
      return;
    }
    if (rawBefore.length === 0) {
      return;
    }

    event.preventDefault();
    const deleteIndex = rawBefore.length - 1;
    const nextRaw = raw.slice(0, deleteIndex) + raw.slice(deleteIndex + 1);
    const caret = applyMask(nextRaw.slice(0, deleteIndex), mask, placeholderChar, escapeChar).length;

    if (!isControlled) {
      setInternal(nextRaw);
    }
    onChange?.(nextRaw);
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(caret, caret);
    });
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
    if (!raw) {
      return;
    }
    event.preventDefault();
    if (!isControlled) {
      setInternal(raw);
    }
    onChange?.(raw);
  };

  return (
    <InputField
      {...props}
      ref={inputRef}
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDownInternal}
      onPaste={handlePaste}
    />
  );
}
