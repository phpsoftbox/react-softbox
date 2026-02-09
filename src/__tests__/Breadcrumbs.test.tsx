import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
