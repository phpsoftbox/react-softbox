import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Menu, { MenuItem } from '../components/Menu/Menu';

describe('Menu', () => {
  it('toggles vertical groups', async () => {
    const items: MenuItem[] = [
      {
        label: 'Группа',
        children: [{ label: 'Элемент' }],
      },
    ];

    const user = userEvent.setup();
    render(<Menu items={items} />);

    const groupButton = screen.getByRole('button', { name: 'Группа' });
    const submenu = screen.getByText('Элемент').closest('[aria-hidden]') as HTMLElement;

    expect(submenu).toHaveAttribute('aria-hidden', 'true');
    await user.click(groupButton);
    expect(submenu).toHaveAttribute('aria-hidden', 'false');
  });

  it('opens and closes dropdown in horizontal mode', async () => {
    const items: MenuItem[] = [
      {
        label: 'Еще',
        children: [{ label: 'Пункт' }],
      },
    ];

    const user = userEvent.setup();
    render(<Menu items={items} orientation="horizontal" />);

    const trigger = screen.getByRole('button', { name: 'Еще' });
    await user.click(trigger);
    expect(screen.getByText('Пункт')).toBeInTheDocument();

    await user.click(document.body);
    await waitFor(() => {
      expect(screen.queryByText('Пункт')).not.toBeInTheDocument();
    });
  });
});
