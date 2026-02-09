import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from '../components/Menu/Dropdown';

describe('Dropdown', () => {
  it('opens and closes on outside click', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown
        trigger={<span>Открыть</span>}
        items={[{ label: 'Пункт' }]}
        orientation="vertical"
        align="left"
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Открыть' });
    await user.click(trigger);
    expect(screen.getByText('Пункт')).toBeInTheDocument();

    await user.click(document.body);
    await waitFor(() => {
      expect(screen.queryByText('Пункт')).not.toBeInTheDocument();
    });
  });
});
