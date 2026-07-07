import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
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
});
