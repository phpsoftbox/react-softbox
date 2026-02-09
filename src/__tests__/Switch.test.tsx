import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Switch from '../components/Input/Switch/Switch';

describe('Switch', () => {
  it('toggles on click', async () => {
    const user = userEvent.setup();
    render(<Switch label="Уведомления" />);

    const input = screen.getByRole('switch');
    expect(input).not.toBeChecked();

    await user.click(input);
    expect(input).toBeChecked();
  });
});
