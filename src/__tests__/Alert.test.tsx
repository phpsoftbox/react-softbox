import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Alert from '../components/Alert/Alert';

describe('Alert', () => {
  it('renders title and message', () => {
    render(<Alert title="Info">Сообщение</Alert>);

    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Сообщение')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Alert title="Warning" onClose={onClose}>
        Текст
      </Alert>,
    );

    await user.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders default icon and allows overriding', () => {
    const { rerender, container } = render(<Alert>Сообщение</Alert>);

    expect(container.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('[data-alert-icon-placement="top"]')).not.toBeNull();

    rerender(<Alert icon={<span data-testid="custom-alert-icon">!</span>}>Сообщение</Alert>);
    expect(screen.getByTestId('custom-alert-icon')).toBeInTheDocument();
  });

  it('supports icon placement', () => {
    const { container, rerender } = render(<Alert iconPlacement="center">Сообщение</Alert>);

    expect(container.querySelector('[data-alert-icon-placement="center"]')).not.toBeNull();

    rerender(<Alert iconPlacement="bottom">Сообщение</Alert>);
    expect(container.querySelector('[data-alert-icon-placement="bottom"]')).not.toBeNull();
  });
});
