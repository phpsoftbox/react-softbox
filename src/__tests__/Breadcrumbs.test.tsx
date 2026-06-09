import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';

describe('Breadcrumbs', () => {
  it('marks last item as current by default', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Проекты', href: '/projects' },
          { label: 'Project' },
        ]}
      />,
    );

    expect(screen.getByText('Project')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Главная' })).toHaveAttribute('href', '/');
  });

  it('collapses middle items into dropdown when trail is long', async () => {
    const user = userEvent.setup();

    render(
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Раздел 1', href: '/section-1' },
          { label: 'Раздел 2', href: '/section-2' },
          { label: 'Раздел 3', href: '/section-3' },
          { label: 'Проекты', href: '/projects' },
          { label: 'Project' },
        ]}
      />,
    );

    expect(screen.queryByRole('link', { name: 'Раздел 1' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Раздел 2' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Раздел 3' })).not.toBeInTheDocument();

    await user.click(screen.getByText('...'));

    expect(screen.getByRole('link', { name: 'Раздел 1' })).toHaveAttribute('href', '/section-1');
    expect(screen.getByRole('link', { name: 'Раздел 2' })).toHaveAttribute('href', '/section-2');
    expect(screen.getByRole('link', { name: 'Раздел 3' })).toHaveAttribute('href', '/section-3');
  });

  it('supports custom overflow trigger renderer', async () => {
    const user = userEvent.setup();

    render(
      <Breadcrumbs
        overflowAriaLabel="Скрытые хлебные крошки"
        renderOverflowTrigger={(hiddenItems) => (
          <button type="button" className="custom-overflow-trigger">
            Еще {hiddenItems.length}
          </button>
        )}
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Раздел 1', href: '/section-1' },
          { label: 'Раздел 2', href: '/section-2' },
          { label: 'Раздел 3', href: '/section-3' },
          { label: 'Проекты', href: '/projects' },
          { label: 'Project' },
        ]}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Скрытые хлебные крошки' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveClass('custom-overflow-trigger');
    expect(trigger).toHaveTextContent('Еще 3');

    await user.click(trigger);

    expect(screen.getByRole('link', { name: 'Раздел 1' })).toHaveAttribute('href', '/section-1');
  });
});
