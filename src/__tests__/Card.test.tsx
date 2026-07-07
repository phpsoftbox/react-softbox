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
    const { container } = render(
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

    const group = screen.getByRole('group', { name: 'Toolbar actions' });
    const button = screen.getByRole('button', { name: 'Добавить' });

    expect(group).toHaveClass('btn-group', 'btn-group-horizontal');
    expect(button).toBeInTheDocument();
    expect(container.querySelector('[data-card-toolbar-button-slot="icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-card-toolbar-button-slot="label"]')).toHaveTextContent('Добавить');
    expect(container.querySelector('[data-card-toolbar-button-slot="separator"]')).toBeInTheDocument();
  });

  it('renders native toolbar links', () => {
    render(
      <Card>
        <Card.Toolbar>
          <Card.Toolbar.Group attached aria-label="Native links">
            <Card.Toolbar.Button
              as="a"
              href="/reports.csv"
              download
              icon={<span aria-hidden="true">↓</span>}
              label="Скачать"
            />
          </Card.Toolbar.Group>
        </Card.Toolbar>
      </Card>,
    );

    const link = screen.getByRole('link', { name: 'Скачать' });
    expect(link).toHaveClass('btn', 'btn-outline');
    expect(link).toHaveAttribute('href', '/reports.csv');
    expect(link).toHaveAttribute('download');
  });

  it('renders toolbar button through a custom link component', () => {
    render(
      <Card>
        <Card.Toolbar>
          <Card.Toolbar.Group attached aria-label="Toolbar links">
            <Card.Toolbar.Button
              as={ToolbarLink}
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

  it('marks icon-only toolbar buttons as stable square controls', () => {
    const { container } = render(
      <Card>
        <Card.Toolbar>
          <Card.Toolbar.Group attached aria-label="Icon actions">
            <Card.Toolbar.Button
              aria-label="Назад"
              icon={(
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M10 3 5 8l5 5" />
                </svg>
              )}
            />
          </Card.Toolbar.Group>
        </Card.Toolbar>
      </Card>,
    );

    const button = screen.getByRole('button', { name: 'Назад' });
    const iconSlot = container.querySelector('[data-card-toolbar-button-slot="icon"]');

    expect(button).toHaveAttribute('data-card-toolbar-button-icon-only', 'true');
    expect(button.className).toContain('toolbarButtonIconOnly');
    expect(iconSlot?.querySelector('svg')).toBeInTheDocument();
  });

  it('renders toolbar button content through framework slots', () => {
    const { container } = render(
      <Card>
        <Card.Toolbar>
          <Card.Toolbar.Button
            icon={<span aria-hidden="true">✓</span>}
            label="Готово"
            {...({ children: 'Ignored children' } as unknown as Record<string, React.ReactNode>)}
          />
        </Card.Toolbar>
      </Card>,
    );

    expect(screen.getByRole('button', { name: 'Готово' })).toBeInTheDocument();
    expect(screen.queryByText('Ignored children')).not.toBeInTheDocument();
    expect(container.querySelector('[data-card-toolbar-button-slot="icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-card-toolbar-button-slot="label"]')).toHaveTextContent('Готово');
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
