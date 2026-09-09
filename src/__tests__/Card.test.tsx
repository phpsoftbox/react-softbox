import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Card from '../components/Card/Card';
import styles from '../components/Card/Card.module.css';
import Button from '../components/Button/Button';
import Grid from '../components/Grid/Grid';
import Row from '../components/Flex/Row';

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
  it('renders a framed inset toolbar by default', () => {
    render(<Card.Toolbar data-testid="toolbar">Actions</Card.Toolbar>);
    expect(screen.getByTestId('toolbar')).toHaveClass(styles.toolbarInset, styles.toolbarDividerTop, styles.toolbarDividerBottom);
  });

  it('updates the default borders when inset changes without forwarding layout props', () => {
    const { rerender } = render(<Card.Toolbar data-testid="toolbar">Actions</Card.Toolbar>);
    rerender(<Card.Toolbar data-testid="toolbar" inset={false}>Actions</Card.Toolbar>);
    const toolbar = screen.getByTestId('toolbar');
    expect(toolbar).not.toHaveClass(styles.toolbarInset);
    expect(toolbar).not.toHaveClass(styles.toolbarDividerTop);
    expect(toolbar).not.toHaveClass(styles.toolbarDividerBottom);
    expect(toolbar).not.toHaveAttribute('inset');
  });

  it.each([true, false])('allows each border to be explicitly disabled on an inset panel (top=%s)', (top) => {
    render(<Card.Toolbar data-testid="toolbar" dividerTop={top} dividerBottom={!top}>Actions</Card.Toolbar>);
    const toolbar = screen.getByTestId('toolbar');
    expect(toolbar).toHaveClass(styles.toolbarInset, top ? styles.toolbarDividerTop : styles.toolbarDividerBottom);
    expect(toolbar).not.toHaveClass(top ? styles.toolbarDividerBottom : styles.toolbarDividerTop);
  });

  it('controls top, bottom, and group toolbar dividers independently', () => {
    const toolbar = (dividerTop?: boolean, dividerBottom?: boolean, divider: 'none' | 'left' = 'left') => (
      <Card.Toolbar data-testid="toolbar" inset={false} dividerTop={dividerTop} dividerBottom={dividerBottom}>
        <Card.Toolbar.Button label="Первый" />
        <Card.Toolbar.Group data-testid="group" divider={divider}><Card.Toolbar.Button label="Второй" /></Card.Toolbar.Group>
      </Card.Toolbar>
    );
    const { rerender } = render(toolbar(true, false, 'none'));
    const root = screen.getByTestId('toolbar');
    expect(root).toHaveClass(styles.toolbarDividerTop);
    expect(root).not.toHaveClass(styles.toolbarDividerBottom);
    expect(screen.getByTestId('group')).not.toHaveClass(styles.toolbarGroupDividerLeft);

    rerender(toolbar(false, true));
    expect(root).not.toHaveClass(styles.toolbarDividerTop);
    expect(root).toHaveClass(styles.toolbarDividerBottom);
    expect(screen.getByTestId('group')).toHaveClass(styles.toolbarGroupDividerLeft);
    expect(root).not.toHaveAttribute('dividerTop');
    expect(root).not.toHaveAttribute('dividerBottom');

    rerender(toolbar());
    expect(root).not.toHaveClass(styles.toolbarDividerTop);
    expect(root).not.toHaveClass(styles.toolbarDividerBottom);
  });

  it.each(['props', 'children'])('renders one decorative icon beside title and subtitle supplied through %s', (source) => {
    const icon = <svg data-testid="header-icon" viewBox="0 0 24 24" />;
    render(
      <Card>
        {source === 'props' ? (
          <Card.Header icon={icon} title="Параметры сдачи" subtitle="Куда передать поставку">
            <Card.Header.Icon />
            <Card.Header.Content />
            <Card.Header.Aside><Button>Изменить</Button></Card.Header.Aside>
          </Card.Header>
        ) : (
          <Card.Header icon={icon}>
            <Card.Header.Icon />
            <Card.Header.Content>
              <Card.Header.Title>Параметры сдачи</Card.Header.Title>
              <Card.Header.Subtitle>Куда передать поставку</Card.Header.Subtitle>
            </Card.Header.Content>
            <Card.Header.Aside><Button>Изменить</Button></Card.Header.Aside>
          </Card.Header>
        )}
      </Card>,
    );

    const iconSlot = screen.getByTestId('header-icon').parentElement!;
    const lead = iconSlot.parentElement!;
    expect(iconSlot).toHaveAttribute('aria-hidden', 'true');
    expect(lead).toContainElement(screen.getByRole('heading', { name: 'Параметры сдачи' }));
    expect(lead).toContainElement(screen.getByText('Куда передать поставку'));
    expect(screen.getByRole('heading').parentElement).not.toContainElement(screen.getByRole('button', { name: 'Изменить' }));
    expect(screen.getAllByTestId('header-icon')).toHaveLength(1);
  });

  it('renders the default icon and text layout without explicit children', () => {
    render(<Card.Header icon={<span data-testid="icon">★</span>} title="Заголовок" subtitle="Подзаголовок" />);
    expect(screen.getAllByTestId('icon')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Заголовок' })).toBeInTheDocument();
    expect(screen.getByText('Подзаголовок')).toBeInTheDocument();
  });

  it('allows explicit Icon children to override or suppress the contextual icon', () => {
    const renderIcon = (children: React.ReactNode) => (
      <Card.Header icon={<span>Default icon</span>}>
        <Card.Header.Icon>{children}</Card.Header.Icon>
      </Card.Header>
    );
    const { rerender } = render(renderIcon(<span>Custom icon</span>));
    expect(screen.getByText('Custom icon')).toBeInTheDocument();
    expect(screen.queryByText('Default icon')).not.toBeInTheDocument();
    rerender(renderIcon(null));
    expect(screen.queryByText('Custom icon')).not.toBeInTheDocument();
    expect(screen.queryByText('Default icon')).not.toBeInTheDocument();
  });

  it('resolves icon context inside a custom layout and updates it without duplication', () => {
    const header = (icon: React.ReactNode) => (
      <Card.Header icon={icon}>
        <div style={{ display: 'grid' }}>
          <Card.Header.Icon data-testid="icon-slot" className="custom-icon" />
          <Card.Header.Content><Card.Header.Title>Title</Card.Header.Title></Card.Header.Content>
          <Card.Header.Aside><Button>Action</Button></Card.Header.Aside>
        </div>
      </Card.Header>
    );
    const { rerender } = render(header(<span>First icon</span>));
    expect(screen.getAllByText('First icon')).toHaveLength(1);
    expect(screen.getByTestId('icon-slot')).toHaveClass('custom-icon');
    rerender(header(<span>Next icon</span>));
    expect(screen.queryByText('First icon')).not.toBeInTheDocument();
    expect(screen.getAllByText('Next icon')).toHaveLength(1);
    rerender(header(undefined));
    expect(screen.queryByTestId('icon-slot')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('keeps header and footer dividers disabled by default', () => {
    render(
      <Card>
        <Card.Header data-testid="header" title="Заголовок" />
        <Card.Body data-testid="body">Контент</Card.Body>
        <Card.Footer data-testid="footer">Действия</Card.Footer>
      </Card>,
    );

    expect(screen.getByTestId('header')).not.toHaveClass(styles.headerDivider);
    expect(screen.getByTestId('footer')).not.toHaveClass(styles.footerDivider);
    expect(screen.getByTestId('body')).not.toHaveClass(styles.headerDivider, styles.footerDivider);
  });

  it('toggles header and footer dividers independently while preserving HTML props', () => {
    const card = (headerDivider: boolean, footerDivider: boolean) => (
      <Card>
        <Card.Header divider={headerDivider} data-testid="header" title="Заголовок" className="custom-header" />
        <Card.Body>Контент</Card.Body>
        <Card.Footer divider={footerDivider} data-testid="footer" className="custom-footer" aria-label="Действия">
          Сохранить
        </Card.Footer>
      </Card>
    );
    const { rerender } = render(card(true, false));
    expect(screen.getByTestId('header')).toHaveClass(styles.headerDivider, 'custom-header');
    expect(screen.getByTestId('footer')).not.toHaveClass(styles.footerDivider);

    rerender(card(false, true));
    expect(screen.getByTestId('header')).not.toHaveClass(styles.headerDivider);
    expect(screen.getByTestId('footer')).toHaveClass(styles.footerDivider, 'custom-footer');
    expect(screen.getByTestId('footer')).toHaveAttribute('aria-label', 'Действия');
    expect(screen.getByTestId('header')).not.toHaveAttribute('divider');
    expect(screen.getByTestId('footer')).not.toHaveAttribute('divider');
  });

  it('renders header, body, and footer', () => {
    render(
      <Card>
        <Card.Header title="Заголовок">
          <Card.Header.Content />
          <Card.Header.Aside><Button appearance="ghost">...</Button></Card.Header.Aside>
        </Card.Header>
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
    expect(container.querySelector('[data-card-toolbar-button-slot="separator"]')).not.toBeInTheDocument();
  });

  it('preserves custom Grid and Row structure and passes button context through them', () => {
    render(
      <Card.Toolbar data-testid="toolbar" buttonHideLabelOn="never">
        <Grid data-testid="grid" columns={2}>
          <Card.Toolbar.Group data-testid="left"><span>Records</span></Card.Toolbar.Group>
          <Row data-testid="row" justify="flex-end">
            <Card.Toolbar.Group data-testid="right">
              <Card.Toolbar.Button icon={<span>+</span>} label="Create" />
            </Card.Toolbar.Group>
          </Row>
        </Grid>
      </Card.Toolbar>,
    );
    expect(screen.getByTestId('grid').parentElement).toBe(screen.getByTestId('toolbar'));
    expect(screen.getByTestId('left').parentElement).toBe(screen.getByTestId('grid'));
    expect(screen.getByTestId('right').parentElement).toBe(screen.getByTestId('row'));
    expect(screen.getByRole('button')).not.toHaveClass(styles.toolbarButtonHideLabelMd);
    expect(screen.getByTestId('toolbar').querySelector('[data-card-toolbar-item]')).toBeNull();
  });

  it('does not add dividers to groups distributed with space-between', () => {
    render(
      <Card.Toolbar>
        <Row justify="space-between">
          <Card.Toolbar.Group data-testid="left">Records</Card.Toolbar.Group>
          <Card.Toolbar.Group data-testid="right"><Card.Toolbar.Button label="Export" /></Card.Toolbar.Group>
        </Row>
      </Card.Toolbar>,
    );
    for (const name of ['left', 'right']) {
      expect(screen.getByTestId(name)).not.toHaveClass(styles.toolbarGroupDividerLeft);
      expect(screen.getByTestId(name)).not.toHaveClass(styles.toolbarGroupDividerRight);
    }
  });

  it.each(['none', 'left', 'right', 'both'] as const)('renders explicit %s group dividers with attached buttons', (divider) => {
    render(
      <Card.Toolbar>
        <Card.Toolbar.Group attached divider={divider} data-testid="group" className="custom" aria-label="Actions">
          <Card.Toolbar.Button label="One" />
          <Card.Toolbar.Button label="Two" />
        </Card.Toolbar.Group>
      </Card.Toolbar>,
    );
    const group = screen.getByRole('group', { name: 'Actions' });
    expect(group).toHaveClass('custom', 'btn-group-horizontal');
    expect(group.classList.contains(styles.toolbarGroupDividerLeft)).toBe(divider === 'left' || divider === 'both');
    expect(group.classList.contains(styles.toolbarGroupDividerRight)).toBe(divider === 'right' || divider === 'both');
    expect(group).not.toHaveAttribute('divider');
  });

  it('updates group dividers without remounting its content', () => {
    const group = (divider: 'both' | 'none') => (
      <Card.Toolbar><Grid columns={1}>
        <Card.Toolbar.Group divider={divider} data-testid="group"><input aria-label="Search" defaultValue="query" /></Card.Toolbar.Group>
      </Grid></Card.Toolbar>
    );
    const { rerender } = render(group('both'));
    const input = screen.getByRole('textbox');
    rerender(group('none'));
    expect(screen.getByRole('textbox')).toBe(input);
    expect(screen.getByTestId('group')).not.toHaveClass(styles.toolbarGroupDividerLeft);
    expect(screen.getByTestId('group')).not.toHaveClass(styles.toolbarGroupDividerRight);
  });

  it('requires Group to have a Toolbar ancestor', () => {
    expect(() => render(<Card.Toolbar.Group>Orphan</Card.Toolbar.Group>)).toThrow('Card.Toolbar.Group must be rendered inside Card.Toolbar');
  });

  it('allows text and buttons without a Group wrapper', () => {
    render(<Card.Toolbar data-testid="toolbar">Actions<Card.Toolbar.Button label="Create" /></Card.Toolbar>);
    expect(screen.getByRole('button').parentElement).toBe(screen.getByTestId('toolbar'));
    expect(screen.getByTestId('toolbar')).toHaveTextContent('Actions');
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

  it('supports Button.Split inside toolbar groups', () => {
    const { container } = render(
      <Card>
        <Card.Toolbar>
          <Card.Toolbar.Group attached aria-label="Split actions">
            <Card.Toolbar.Button label="Обзор" />
            <Button.Split
              variant="primary"
              main={{ label: 'Импорт', onClick: jest.fn() }}
              menu={{
                ariaLabel: 'Действия импорта',
                items: [
                  { key: 'reset', label: 'Сбросить кеш', onSelect: jest.fn() },
                ],
              }}
            />
          </Card.Toolbar.Group>
        </Card.Toolbar>
      </Card>,
    );

    const group = screen.getByRole('group', { name: 'Split actions' });
    const split = container.querySelector('.btn-split');
    const dropdown = container.querySelector('.btn-split-dropdown');

    expect(group).toHaveClass('btn-group', 'btn-group-horizontal');
    expect(split).toHaveClass('btn-split-md');
    expect(dropdown).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Импорт' })).toHaveClass('btn-split-main');
    expect(screen.getByRole('button', { name: 'Действия импорта' })).toHaveClass('btn-split-toggle');
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
        <Card.Header>
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
