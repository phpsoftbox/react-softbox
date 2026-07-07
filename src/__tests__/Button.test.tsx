import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Button from '../components/Button/Button';

type TestLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  method?: 'get' | 'post';
  preserveScroll?: boolean;
};

const TestLink = ({
  method,
  preserveScroll,
  ...props
}: TestLinkProps) => (
  <a
    data-method={method}
    data-preserve-scroll={preserveScroll ? 'true' : undefined}
    {...props}
  />
);

describe('Button', () => {
  it('renders label and variants', () => {
    render(
      <>
        <Button>Primary</Button>
        <Button variant="info">Info</Button>
        <Button variant="danger" appearance="outline">Danger</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="dark">Dark</Button>
        <Button variant="light">Light</Button>
        <Button appearance="ghost">Ghost</Button>
      </>,
    );

    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Danger')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Ghost')).toBeInTheDocument();
  });

  it('renders grouped buttons', () => {
    render(
      <Button.Group aria-label="View mode">
        <Button appearance="outline">Day</Button>
        <Button appearance="outline">Week</Button>
      </Button.Group>,
    );

    expect(screen.getByRole('group', { name: 'View mode' })).toHaveClass('btn-group');
    expect(screen.getByRole('button', { name: 'Day' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Week' })).toBeInTheDocument();
  });

  it('renders through a custom link component', () => {
    render(
      <Button as={TestLink} href="/orders" method="post" preserveScroll>
        Link action
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Link action' });
    expect(link).toHaveClass('btn', 'btn-primary');
    expect(link).toHaveAttribute('href', '/orders');
    expect(link).toHaveAttribute('data-method', 'post');
    expect(link).toHaveAttribute('data-preserve-scroll', 'true');
  });

  it('marks custom link buttons as disabled', () => {
    const onClick = jest.fn();

    render(
      <Button as="a" href="/orders" disabled onClick={onClick}>
        Disabled link
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Disabled link' });
    link.click();

    expect(link).toHaveClass('btn-disabled');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders split button main action and dropdown action', () => {
    const onMain = jest.fn();
    const onSelect = jest.fn();

    render(
      <Button.Split
        variant="primary"
        main={{
          label: 'Импорт Ozon',
          icon: <span aria-hidden="true">↑</span>,
          onClick: onMain,
        }}
        menu={{
          ariaLabel: 'Действия импорта Ozon',
          items: [
            {
              key: 'reset-cache',
              label: 'Сбросить кеш',
              icon: <span aria-hidden="true">↻</span>,
              onSelect,
            },
          ],
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Импорт Ozon' }));
    expect(onMain).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Действия импорта Ozon' }));
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить кеш' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('supports polymorphic split button main action', () => {
    render(
      <Button.Split
        main={{
          as: TestLink,
          href: '/imports/ozon',
          method: 'post',
          preserveScroll: true,
          label: 'Открыть импорт',
        }}
        menu={{
          ariaLabel: 'Действия импорта',
          items: [{ key: 'reset-cache', label: 'Сбросить кеш' }],
        }}
      />,
    );

    const link = screen.getByRole('link', { name: 'Открыть импорт' });
    expect(link).toHaveClass('btn', 'btn-primary');
    expect(link).toHaveAttribute('href', '/imports/ozon');
    expect(link).toHaveAttribute('data-method', 'post');
    expect(link).toHaveAttribute('data-preserve-scroll', 'true');
  });

  it('can disable only split main action while keeping menu enabled', () => {
    const onMain = jest.fn();
    const onSelect = jest.fn();

    render(
      <Button.Split
        main={{
          label: 'Импорт Ozon',
          disabled: true,
          onClick: onMain,
        }}
        menu={{
          ariaLabel: 'Действия импорта Ozon',
          items: [{ key: 'reset-cache', label: 'Сбросить кеш', onSelect }],
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Импорт Ozon' }));
    expect(onMain).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Действия импорта Ozon' }));
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить кеш' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('opens and closes split menu from keyboard', () => {
    render(
      <Button.Split
        main={{ label: 'Импорт Ozon' }}
        menu={{
          ariaLabel: 'Действия импорта Ozon',
          items: [{ key: 'reset-cache', label: 'Сбросить кеш' }],
        }}
      />,
    );

    const toggle = screen.getByRole('button', { name: 'Действия импорта Ozon' });
    fireEvent.keyDown(toggle, { key: 'ArrowDown' });
    expect(screen.getByRole('button', { name: 'Сбросить кеш' })).toBeInTheDocument();

    fireEvent.keyDown(toggle, { key: 'Escape' });
    expect(screen.queryByRole('button', { name: 'Сбросить кеш' })).not.toBeInTheDocument();
  });

  it('renders split menu link items', () => {
    render(
      <Button.Split
        main={{ label: 'Импорт Ozon' }}
        menu={{
          ariaLabel: 'Действия импорта Ozon',
          items: [
            {
              key: 'open-log',
              label: 'Открыть лог',
              href: '/imports/ozon/log',
              as: TestLink,
            },
          ],
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Действия импорта Ozon' }));
    const link = screen.getByRole('link', { name: 'Открыть лог' });
    expect(link).toHaveAttribute('href', '/imports/ozon/log');
  });

  it('renders danger split menu items', () => {
    render(
      <Button.Split
        main={{ label: 'Импорт Ozon' }}
        menu={{
          ariaLabel: 'Действия импорта Ozon',
          items: [{ key: 'drop-import', label: 'Удалить импорт', danger: true }],
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Действия импорта Ozon' }));
    expect(screen.getByRole('button', { name: 'Удалить импорт' })).toHaveClass('btn-split-menu-item-danger');
  });
});
