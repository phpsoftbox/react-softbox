import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
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
