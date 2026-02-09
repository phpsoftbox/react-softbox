import React from 'react';
import { render, screen } from '@testing-library/react';
import Text from '../components/Typography/Text';

describe('Text', () => {
  it('renders as code when code prop is set', () => {
    render(<Text code>npm run dev</Text>);
    expect(screen.getByText('npm run dev').tagName).toBe('CODE');
  });
});
