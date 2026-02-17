import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Radio from '../components/Input/Radio/Radio';

describe('Radio', () => {
  it('toggles on click', async () => {
    const user = userEvent.setup();
    render(<Radio label="Основной" name="mode" />);

    const input = screen.getByLabelText('Основной') as HTMLInputElement;
    expect(input).not.toBeChecked();
    const label = screen.getByText('Основной').closest('label') as HTMLLabelElement;
    await user.click(label);
    expect(input).toBeChecked();
  });
});
