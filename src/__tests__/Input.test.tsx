import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from '../components/Input/Input';

describe('Input', () => {
  it('renders with placeholder and value', () => {
    render(
      <Input>
        <Input.Label>Email</Input.Label>
        <Input.Field placeholder="Email" defaultValue="test@example.com" />
      </Input>,
    );

    const input = screen.getByPlaceholderText('Email') as HTMLInputElement;
    expect(input.value).toBe('test@example.com');
  });
});
