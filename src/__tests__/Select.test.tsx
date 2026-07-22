import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
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

    const control = screen.getByRole('button', { name: 'Окружение' });
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

    const control = screen.getByRole('button', { name: 'Сервисы' });
    await user.click(control);
    await user.click(screen.getByRole('option', { name: 'Cache' }));
    await user.click(screen.getByRole('option', { name: 'Database' }));

    expect(screen.getAllByText('Cache').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Database').length).toBeGreaterThan(0);
  });

  it('keeps multiple searchable select open after selecting an option and shows selected tags', async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Сервисы"
        multiple
        searchable
        options={[
          { value: 'cache', label: 'Cache' },
          { value: 'db', label: 'Database' },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Сервисы' }));
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Database' }));

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Удалить Database' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Удалить Database' }));
    expect(screen.queryByRole('button', { name: 'Удалить Database' })).not.toBeInTheDocument();
  });

  it('keeps controlled multiple searchable select open after selecting an option and shows selected tags', async () => {
    const user = userEvent.setup();

    function ControlledSelect() {
      const [selected, setSelected] = React.useState<string[]>(['cache']);

      return (
        <Select
          label="Сервисы"
          multiple
          searchable
          value={selected}
          onChange={(next) => setSelected(next as string[])}
          options={[
            { value: 'cache', label: 'Cache' },
            { value: 'db', label: 'Database' },
          ]}
        />
      );
    }

    render(<ControlledSelect />);

    await user.click(screen.getByRole('button', { name: 'Сервисы' }));
    await user.click(screen.getByRole('option', { name: 'Database' }));

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Удалить Cache' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Удалить Database' })).toBeInTheDocument();
  });

  it('closes multiple searchable dropdown when closeOnSelect is true', async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Сервисы"
        multiple
        searchable
        closeOnSelect
        options={[
          { value: 'cache', label: 'Cache' },
          { value: 'db', label: 'Database' },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Сервисы' }));
    await user.click(screen.getByRole('option', { name: 'Database' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Удалить Database' })).toBeInTheDocument();
  });

  it('keeps multiple searchable select open from keyboard and keeps focus on search input', async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Сервисы"
        multiple
        searchable
        options={[
          { value: 'cache', label: 'Cache' },
          { value: 'db', label: 'Database' },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Сервисы' }));
    await user.keyboard('{ArrowDown}{Enter}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Удалить Database' })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('closes searchable dropdown from toggle button', async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Сервисы"
        multiple
        searchable
        options={[
          { value: 'cache', label: 'Cache' },
          { value: 'db', label: 'Database' },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Сервисы' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Закрыть список' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Сервисы' })).toHaveFocus();
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

    const control = screen.getByRole('button', { name: 'Пользователь' });
    await user.click(control);

    expect(screen.getByText('ru Vasya')).toBeInTheDocument();
    expect(screen.getByText('email@email.ltd')).toBeInTheDocument();
    expect(screen.getByText('9998887766')).toBeInTheDocument();
  });

  it('renders dropdown in portal by default', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Select
        label="Окружение"
        options={[
          { value: 'dev', label: 'Development' },
          { value: 'prod', label: 'Production' },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Окружение' }));

    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('supports rendering dropdown without portal', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Select
        label="Окружение"
        portal={false}
        options={[
          { value: 'dev', label: 'Development' },
          { value: 'prod', label: 'Production' },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Окружение' }));

    expect(container.querySelector('[role="listbox"]')).toBeInTheDocument();
  });

  it('does not scroll the list when option is activated by hover', async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Окружение"
        options={[
          { value: 'dev', label: 'Development' },
          { value: 'stage', label: 'Staging' },
          { value: 'prod', label: 'Production' },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Окружение' }));

    const list = screen.getByRole('listbox');
    const production = screen.getByRole('option', { name: 'Production' });
    Object.defineProperty(list, 'clientHeight', { value: 40, configurable: true });
    Object.defineProperty(production, 'offsetTop', { value: 96, configurable: true });
    Object.defineProperty(production, 'offsetHeight', { value: 32, configurable: true });
    list.scrollTop = 0;

    fireEvent.mouseEnter(production);

    expect(list.scrollTop).toBe(0);
  });
});
