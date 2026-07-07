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
        <Button variant="secondary">Secondary</Button>
        <Button variant="dark">Dark</Button>
        <Button variant="light">Light</Button>
        <Button appearance="ghost">Ghost</Button>
      </>,
    );

    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Danger')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Ghost')).toBeInTheDocument();
  });

  it('renders grouped buttons', () => {
    render(
      <Button.Group aria-label="View mode">
        <Button appearance="outline">Day</Button>
        <Button appearance="outline">Week</Button>
      </Button.Group>,
    );

    expect(screen.getByRole('group', { name: 'View mode' })).toHaveClass('btn-group');
    expect(screen.getByRole('button', { name: 'Day' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Week' })).toBeInTheDocument();
  });
});
