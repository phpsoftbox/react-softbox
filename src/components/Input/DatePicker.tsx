import React from 'react';
import InputField from './Field';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  withTime?: boolean;
};

export default function DatePicker({ withTime = false, ...props }: Props) {
  return <InputField {...props} type={withTime ? 'datetime-local' : 'date'} />;
}
