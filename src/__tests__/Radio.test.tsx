import React from 'react';
import { render, screen } from '@testing-library/react';
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
