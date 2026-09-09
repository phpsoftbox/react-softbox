import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Alert from '../components/Alert/Alert';

describe('Alert', () => {
  it.each(['default', 'primary', 'secondary', 'info', 'dark', 'light', 'neutral'] as const)(
    'keeps the information dot separate from the rounded stem for %s at the smallest icon size',
    (variant) => {
      const { container } = render(<Alert variant={variant} iconBgFilled>Сообщение</Alert>);
      const svg = container.querySelector('svg')!;
      const dot = svg.querySelector('circle[fill="currentColor"]')!;
      const stem = svg.querySelector('path')!;
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(dot).toHaveAttribute('stroke', 'none');
      expect(stem).toHaveAttribute('stroke-linecap', 'round');

      const [, , startY] = stem.getAttribute('d')!.match(/^M([\d.]+) ([\d.]+)v[\d.]+$/)!;
      const dotBottom = Number(dot.getAttribute('cy')) + Number(dot.getAttribute('r'));
      const stemTop = Number(startY) - Number(svg.getAttribute('stroke-width')) / 2;
      // Filled icon panels render the 20-unit viewBox at 16px.
      expect((stemTop - dotBottom) * 16 / 20).toBeGreaterThanOrEqual(1.25);
    },
  );

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
