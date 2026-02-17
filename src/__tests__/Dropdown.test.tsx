import React from 'react';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Dropdown from '../components/Menu/Dropdown';

describe('Dropdown', () => {
  it('opens and closes on outside click', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown
        trigger={<span>Открыть</span>}
        orientation="vertical"
        align="left"
      >
        <Dropdown.Header>Уведомления</Dropdown.Header>
        <Dropdown.Item static>Пока пусто</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item>Пункт</Dropdown.Item>
      </Dropdown>,
    );

    const trigger = screen.getByText('Открыть');
    await user.click(trigger);
    expect(screen.getByText('Пункт')).toBeInTheDocument();
    expect(screen.getByText('Пока пусто')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Пока пусто' })).not.toBeInTheDocument();

    await user.click(document.body);
    await waitFor(() => {
      expect(screen.queryByText('Пункт')).not.toBeInTheDocument();
    });
  });
});
