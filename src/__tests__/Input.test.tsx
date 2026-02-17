import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
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
