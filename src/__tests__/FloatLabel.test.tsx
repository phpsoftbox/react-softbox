import React from 'react';
import { render, screen } from '@testing-library/react';
import FloatLabel from '../components/Input/FloatLabel/FloatLabel';
import Input from '../components/Input/Input';

describe('FloatLabel', () => {
  it('binds label to input', () => {
    render(
      <FloatLabel label="Email">
        <Input.Field name="email" />
      </FloatLabel>,
    );

    const input = screen.getByLabelText('Email') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.name).toBe('email');
  });

  it('renders textarea when configured', () => {
    render(
      <FloatLabel label="Комментарий">
        <Input.TextArea rows={3} />
      </FloatLabel>,
    );

    const textarea = screen.getByLabelText('Комментарий');
    expect(textarea.tagName).toBe('TEXTAREA');
  });
});
