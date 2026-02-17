import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Button from '../components/Button/Button';

describe('Button', () => {
  it('renders label and variants', () => {
    render(
      <>
        <Button>Primary</Button>
        <Button variant="info">Info</Button>
        <Button variant="danger" appearance="outline">Danger</Button>
        <Button appearance="ghost">Ghost</Button>
      </>,
    );

    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Danger')).toBeInTheDocument();
    expect(screen.getByText('Ghost')).toBeInTheDocument();
  });
});
