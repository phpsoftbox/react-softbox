import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Grid from '../components/Grid/Grid';

describe('Grid', () => {
  it('sets CSS variables from props', () => {
    const { container } = render(
      <Grid columns={4} columnsMd={2} gap="12px">
        <div>1</div>
      </Grid>,
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid.style.getPropertyValue('--ui-grid-columns')).toBe('4');
    expect(grid.style.getPropertyValue('--ui-grid-columns-md')).toBe('2');
    expect(grid.style.getPropertyValue('--ui-grid-gap')).toBe('12px');
  });
});
