import React from 'react';
import { render, screen } from '@testing-library/react';
import Progress from '../components/Progress/Progress';

describe('Progress', () => {
  it('renders determinate progress', () => {
    render(<Progress value={40} max={200} />);

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    const fill = bar.firstElementChild as HTMLElement;
    expect(fill).toHaveStyle({ width: '20%' });
  });

  it('renders indeterminate progress', () => {
    render(<Progress indeterminate />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });
});
