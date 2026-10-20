import React from 'react';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Tooltip from '../components/Tooltip/Tooltip';

describe('Input', () => {
  it('renders with placeholder and value', () => {
    render(
      <Input>
        <Input.Label>Email</Input.Label>
        <Input.Field placeholder="Email" defaultValue="test@example.com" />
      </Input>,
    );

    const input = screen.getByPlaceholderText('Email') as HTMLInputElement;
    expect(input.value).toBe('test@example.com');
  });

  it('shows required marker in label when field is required', () => {
    render(
      <Input>
        <Input.Label>Email</Input.Label>
        <Input.Field name="email" required />
      </Input>,
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('keeps a tooltip-wrapped button as a direct group item', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Input.Group stretch>
        <Tooltip content="Поиск">
          <Button appearance="outline">Найти</Button>
        </Tooltip>
        <Input.Field name="group-search" placeholder="Запрос" />
      </Input.Group>,
    );

    const group = container.querySelector('.rsb-input-group');
    const button = screen.getByRole('button', { name: 'Найти' });
    expect(group?.firstElementChild).toBe(button);
    expect(button).toHaveClass('rsb-group-item');
    expect(group?.querySelectorAll(':scope > .rsb-group-item')).toHaveLength(2);

    await user.hover(button);
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveAttribute('data-state', 'open');
    });
  });
});
