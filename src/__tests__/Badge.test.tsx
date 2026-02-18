import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Badge from '../components/Badge/Badge';

describe('Badge', () => {
  it('renders text and switches variant styles', () => {
    render(
      <>
        <Badge>Default</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge size="sm" variant="info">Small</Badge>
      </>,
    );

    const defaultBadge = screen.getByText('Default');
    const dangerBadge = screen.getByText('Danger');
    const smallBadge = screen.getByText('Small');

    expect(defaultBadge).toBeInTheDocument();
    expect(dangerBadge).toBeInTheDocument();
    expect(smallBadge).toBeInTheDocument();
    expect(defaultBadge.className).not.toEqual(dangerBadge.className);
    expect(smallBadge.className).not.toEqual(defaultBadge.className);
  });
});
