import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
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

  it('supports meta and custom option rendering', async () => {
    const user = userEvent.setup();
    type UserMeta = {
      email: string;
      phone: string;
      countryIcon: string;
    };

    render(
      <Select<number, UserMeta>
        label="Пользователь"
        options={[
          {
            value: 1,
            label: 'Vasya',
            meta: {
              email: 'email@email.ltd',
              phone: '9998887766',
              countryIcon: 'ru',
            },
          },
        ]}
        renderOption={(option) => {
          if (option.value === null) {
            return option.label;
          }

          return (
            <div>
              <div>{`${option.meta?.countryIcon ?? ''} ${option.label}`.trim()}</div>
              <div>{option.meta?.email}</div>
              <div>{option.meta?.phone}</div>
            </div>
          );
        }}
      />,
    );

    const control = screen.getByRole('button');
    await user.click(control);

    expect(screen.getByText('ru Vasya')).toBeInTheDocument();
    expect(screen.getByText('email@email.ltd')).toBeInTheDocument();
    expect(screen.getByText('9998887766')).toBeInTheDocument();
  });
});
