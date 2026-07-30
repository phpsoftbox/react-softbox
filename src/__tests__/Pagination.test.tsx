import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Pagination from '../components/Pagination/Pagination';

describe('Pagination', () => {
  it('renders pages and calls onNavigate', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(
      <Pagination
        meta={{
          current_page: 2,
          last_page: 4,
          per_page: 10,
          total: 40,
          path: '/ui-kit',
        }}
        onNavigate={onNavigate}
      />,
    );

    await user.click(screen.getByRole('link', { name: '3' }));
    expect(onNavigate).toHaveBeenCalledWith(3, expect.stringContaining('page=3'));
  });

  it('disables prev on first page', () => {
    render(
      <Pagination
        meta={{
          current_page: 1,
          last_page: 3,
          per_page: 10,
          total: 30,
          path: '/ui-kit',
        }}
      />,
    );

    expect(screen.getByText('‹')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders links through a custom link component', async () => {
    const user = userEvent.setup();
    const visits: string[] = [];
    const TestLink = ({
      href = '',
      onClick,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        {...props}
        href={href}
        data-custom-link="true"
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            visits.push(href);
          }
        }}
      />
    );

    render(
      <Pagination
        as={TestLink}
        meta={{
          current_page: 1,
          last_page: 3,
          per_page: 10,
          total: 30,
          path: '/ui-kit',
        }}
      />,
    );

    const pageLink = screen.getByRole('link', { name: '2' });
    expect(pageLink).toHaveAttribute('data-custom-link', 'true');

    await user.click(pageLink);
    await user.click(screen.getByRole('link', { name: '«' }));

    expect(visits).toEqual(['/ui-kit?page=2']);
  });
});
