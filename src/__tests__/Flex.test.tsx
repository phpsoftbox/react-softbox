import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Row from '../components/Flex/Row';
import Stack from '../components/Flex/Stack';

describe('Flex helpers', () => {
  it('applies row styles', () => {
    const { container } = render(
      <Row gap="10px" wrap="wrap">
        <div>Item</div>
      </Row>,
    );

    const row = container.firstChild as HTMLElement;
    expect(row.style.getPropertyValue('--ui-gap')).toBe('10px');
    expect(row.style.flexWrap).toBe('wrap');
  });

  it('applies stack styles', () => {
    const { container } = render(
      <Stack gap="18px">
        <div>Item</div>
      </Stack>,
    );

    const stack = container.firstChild as HTMLElement;
    expect(stack.style.getPropertyValue('--ui-gap')).toBe('18px');
  });
});
