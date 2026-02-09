import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
