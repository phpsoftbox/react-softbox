import React from 'react';
import { render, screen } from '@testing-library/react';
import Image from '../components/Image/Image';

describe('Image', () => {
  it('renders an image and applies shape classes', () => {
    render(
      <>
        <Image src="/avatar.png" alt="Rounded" />
        <Image src="/avatar.png" alt="Circle" shape="circle" />
      </>,
    );

    const rounded = screen.getByAltText('Rounded');
    const circle = screen.getByAltText('Circle');

    expect(rounded.tagName).toBe('IMG');
    expect(circle.tagName).toBe('IMG');
    expect(rounded.className).not.toEqual(circle.className);
  });
});
