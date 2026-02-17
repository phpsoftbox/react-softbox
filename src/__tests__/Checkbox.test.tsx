import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Checkbox from '../components/Input/Checkbox/Checkbox';

describe('Checkbox', () => {
  it('renders label and description', () => {
    render(<Checkbox label="Согласен" description="Дополнительные условия" />);

    expect(screen.getByText('Согласен')).toBeInTheDocument();
    expect(screen.getByText('Дополнительные условия')).toBeInTheDocument();
  });
});
