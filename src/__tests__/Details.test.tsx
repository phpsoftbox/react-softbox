import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Details from '../components/Details/Details';

describe('Details', () => {
  it('renders label/value pairs', () => {
    render(
      <Details
        items={[
          { label: 'ID', value: 'USR-1' },
          { label: 'Email', value: 'user@email.ltd' },
        ]}
      />,
    );

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('USR-1')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('user@email.ltd')).toBeInTheDocument();
  });

  it('uses empty fallback for empty values', () => {
    render(
      <Details
        emptyValue="N/A"
        items={[
          { label: 'Комментарий', value: null },
        ]}
      />,
    );

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('supports secondary collapse', async () => {
    const user = userEvent.setup();

    render(
      <Details
        items={[
          { label: 'Имя', value: 'Анна' },
          { label: 'Телефон', value: '+7 999 111-22-33', priority: 'secondary' },
        ]}
        showSecondaryLabel="Показать"
        hideSecondaryLabel="Скрыть"
      />,
    );

    expect(screen.getByText('Имя')).toBeInTheDocument();
    expect(screen.getByText('Анна')).toBeInTheDocument();
    expect(screen.queryByText('+7 999 111-22-33')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Показать' }));
    expect(screen.getByText('+7 999 111-22-33')).toBeInTheDocument();
  });
});
