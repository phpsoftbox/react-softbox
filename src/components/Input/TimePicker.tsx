import React from 'react';
import InputField from './Field';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export default function TimePicker(props: Props) {
  return <InputField {...props} type="time" />;
}
