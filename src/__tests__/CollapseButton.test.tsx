import React from 'react';
import { render, screen } from '@testing-library/react';
import CollapseButton from '../components/CollapseButton/CollapseButton';

describe('CollapseButton', () => {
  it('sets aria attributes and label', () => {
    render(<CollapseButton targetId="panel" open={false}>Фильтры</CollapseButton>);

    const button = screen.getByRole('button', { name: 'Фильтры' });
    expect(button).toHaveAttribute('aria-controls', 'panel');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
