import React from 'react';
import DatePicker from './DatePicker';
import { InputGroup, InputAddon } from './InputGroup';

type RangeValue = {
  start: string;
  end: string;
};

type Props = {
  value?: RangeValue;
  onChange?: (value: RangeValue) => void;
  withTime?: boolean;
  separator?: React.ReactNode;
  className?: string;
  startProps?: React.InputHTMLAttributes<HTMLInputElement>;
  endProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export default function DateRangePicker({
  value,
  onChange,
  withTime = false,
  separator = '—',
  className,
  startProps,
  endProps,
}: Props) {
  const [internal, setInternal] = React.useState<RangeValue>({ start: '', end: '' });
  const current = value ?? internal;

  const update = (next: RangeValue) => {
    if (!value) {
      setInternal(next);
    }
    onChange?.(next);
  };

  return (
    <InputGroup className={className} stretch>
      <DatePicker
        withTime={withTime}
        value={current.start}
        onChange={(event) => update({ ...current, start: event.target.value })}
        {...startProps}
      />
      <InputAddon>{separator}</InputAddon>
      <DatePicker
        withTime={withTime}
        value={current.end}
        onChange={(event) => update({ ...current, end: event.target.value })}
        {...endProps}
      />
    </InputGroup>
  );
}
