import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Tabs from '../components/Tabs/Tabs';

describe('Tabs', () => {
  it('switches active tab on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Tabs
        items={[
          { id: 'overview', label: 'Обзор', content: 'Контент 1' },
          { id: 'metrics', label: 'Метрики', content: 'Контент 2' },
        ]}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole('tab', { name: 'Обзор' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: 'Метрики' }));
    expect(onChange).toHaveBeenCalledWith('metrics');
    expect(screen.getByText('Контент 2')).toBeInTheDocument();
  });
});
