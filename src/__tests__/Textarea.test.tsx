import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from '../components/Input/Input';

describe('Textarea', () => {
  it('renders textarea with placeholder', () => {
    render(
      <Input>
        <Input.TextArea placeholder="Комментарий" />
      </Input>,
    );
    expect(screen.getByPlaceholderText('Комментарий')).toBeInTheDocument();
  });
});
