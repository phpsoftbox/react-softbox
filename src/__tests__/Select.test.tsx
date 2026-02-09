import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '../components/Input/Select/Select';

describe('Select', () => {
  it('selects a single option', async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Окружение"
        options={[
          { value: 'dev', label: 'Development' },
          { value: 'prod', label: 'Production' },
        ]}
      />,
    );

    const control = screen.getByRole('button');
    await user.click(control);
    await user.click(screen.getByRole('option', { name: 'Production' }));

    expect(screen.getByText('Production')).toBeInTheDocument();
  });

  it('supports multiple selection', async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Сервисы"
        multiple
        options={[
          { value: 'cache', label: 'Cache' },
          { value: 'db', label: 'Database' },
        ]}
      />,
    );

    const control = screen.getByRole('button');
    await user.click(control);
    await user.click(screen.getByRole('option', { name: 'Cache' }));
    await user.click(screen.getByRole('option', { name: 'Database' }));

    expect(screen.getAllByText('Cache').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Database').length).toBeGreaterThan(0);
  });
});
