import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Notifier from '../components/Notifier/Notifier';

describe('Notifier', () => {
  it('renders items and dismisses on click', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();

    render(
      <Notifier
        items={[
          { id: '1', title: 'Оповещение', message: 'Текст', variant: 'info', duration: 2000 },
        ]}
        onDismiss={onDismiss}
      />,
    );

    expect(screen.getByText('Оповещение')).toBeInTheDocument();
    expect(screen.getByTestId('notifier-timer')).toBeInTheDocument();
    screen.getByRole('button', { name: 'Закрыть' }).click();
    vi.advanceTimersByTime(300);
    expect(onDismiss).toHaveBeenCalledWith('1');
    vi.useRealTimers();
  });

  it('renders consecutive items as separate stack entries when the first item is taller', () => {
    render(
      <Notifier
        items={[
          {
            id: 'tall',
            title: 'Подробное уведомление',
            message: 'Длинный текст уведомления, который занимает несколько строк и увеличивает высоту первого элемента.',
          },
          { id: 'next', title: 'Следующее уведомление', message: 'Короткий текст.' },
        ]}
        onDismiss={() => {}}
      />,
    );

    const region = screen.getByRole('region');
    expect(region.children).toHaveLength(2);
    expect(region.children[0]).toContainElement(screen.getByText('Подробное уведомление'));
    expect(region.children[1]).toContainElement(screen.getByText('Следующее уведомление'));
  });
});
