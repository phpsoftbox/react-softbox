import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Heading from '../components/Typography/Heading';

describe('Heading', () => {
  it('renders heading with level', () => {
    render(<Heading level={3}>Section</Heading>);
    expect(screen.getByText('Section').tagName).toBe('H3');
  });
});
