import React from 'react';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Dropdown from '../components/Menu/Dropdown';
import Tooltip from '../components/Tooltip/Tooltip';

describe('Tooltip', () => {
  it('closes when its dropdown trigger is clicked and stays closed over the menu', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Действия">
        <Dropdown trigger={<button type="button">Открыть меню</button>}>
          <Dropdown.Item>Открыть модалку</Dropdown.Item>
        </Dropdown>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Открыть меню' });
    await user.hover(trigger);
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveAttribute('data-state', 'open');
    });

    await user.click(trigger);
    const menuItem = await screen.findByRole('button', { name: 'Открыть модалку' });
    expect(menuItem).toHaveFocus();

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    await user.hover(menuItem);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
