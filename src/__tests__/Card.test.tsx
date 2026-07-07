import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';

type ToolbarLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  method?: 'get' | 'post';
  preserveScroll?: boolean;
};

const ToolbarLink = ({
  method,
  preserveScroll,
  ...props
}: ToolbarLinkProps) => (
  <a
    data-method={method}
    data-preserve-scroll={preserveScroll ? 'true' : undefined}
    {...props}
  />
);

describe('Card', () => {
  it('renders header, body, and footer', () => {
    render(
      <Card>
        <Card.Header title="Заголовок" right={<Button appearance="ghost">...</Button>} />
        <Card.Body>Контент</Card.Body>
        <Card.Footer>
          <Button>Сохранить</Button>
        </Card.Footer>
      </Card>,
    );

    expect(screen.getByText('Заголовок')).toBeInTheDocument();
    expect(screen.getByText('Контент')).toBeInTheDocument();
    expect(screen.getByText('Сохранить')).toBeInTheDocument();
  });

  it('supports titleAs and subtitleAs props', () => {
    render(
      <Card>
        <Card.Header
          title="Заголовок"
          subtitle="Подзаголовок"
          titleAs="h2"
          subtitleAs="div"
        />
      </Card>,
    );

    expect(screen.getByText('Заголовок').tagName).toBe('H2');
    expect(screen.getByText('Подзаголовок').tagName).toBe('DIV');
  });

  it('renders toolbar button with icon and label', () => {
    render(
      <Card>
        <Card.Toolbar>
          <Card.Toolbar.Group attached aria-label="Toolbar actions">
            <Card.Toolbar.Button
              icon={<span aria-hidden="true">+</span>}
              label="Добавить"
            />
          </Card.Toolbar.Group>
        </Card.Toolbar>
      </Card>,
    );

    expect(screen.getByRole('group', { name: 'Toolbar actions' })).toHaveClass('btn-group');
    expect(screen.getByRole('button', { name: 'Добавить' })).toBeInTheDocument();
  });

  it('renders toolbar button through a custom link component', () => {
    render(
      <Card>
        <Card.Toolbar>
          <Card.Toolbar.Group attached aria-label="Toolbar links">
            <Card.Toolbar.Button
              component={ToolbarLink}
              href="/exports"
              method="post"
              preserveScroll
              icon={<span aria-hidden="true">↓</span>}
              label="Экспорт"
            />
          </Card.Toolbar.Group>
        </Card.Toolbar>
      </Card>,
    );

    const link = screen.getByRole('link', { name: 'Экспорт' });
    expect(link).toHaveClass('btn', 'btn-outline');
    expect(link).toHaveAttribute('href', '/exports');
    expect(link).toHaveAttribute('data-method', 'post');
    expect(link).toHaveAttribute('data-preserve-scroll', 'true');
  });

  it('renders custom header children node', () => {
    render(
      <Card>
        <Card.Header right={<Button appearance="ghost">...</Button>}>
          <div>
            <strong>Кастомный заголовок</strong>
          </div>
        </Card.Header>
      </Card>,
    );

    expect(screen.getByText('Кастомный заголовок')).toBeInTheDocument();
  });

  it('renders header title/subtitle subcomponents', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Header.Title>Заголовок через subcomponent</Card.Header.Title>
          <Card.Header.Subtitle>Подзаголовок через subcomponent</Card.Header.Subtitle>
        </Card.Header>
      </Card>,
    );

    expect(screen.getByText('Заголовок через subcomponent')).toBeInTheDocument();
    expect(screen.getByText('Подзаголовок через subcomponent')).toBeInTheDocument();
  });

  it('supports polymorphic `as` for header title', () => {
    const CustomTitle = ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="custom-header-title" {...props}>
        {children}
      </div>
    );

    render(
      <Card>
        <Card.Header>
          <Card.Header.Title as="h2">Заголовок h2</Card.Header.Title>
          <Card.Header.Title as={CustomTitle}>Заголовок custom</Card.Header.Title>
        </Card.Header>
      </Card>,
    );

    expect(screen.getByText('Заголовок h2').tagName).toBe('H2');
    expect(screen.getByTestId('custom-header-title')).toHaveTextContent('Заголовок custom');
  });
});
