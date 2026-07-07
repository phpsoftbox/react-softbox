import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Drawer from '../components/Drawer/Drawer';

describe('Drawer', () => {
  it('renders with id when open', () => {
    render(
      <Drawer open title="Навигация" id="drawer-panel" onClose={() => {}}>
        Контент
      </Drawer>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('id', 'drawer-panel');
  });

  it('allows adding radius through helper className', () => {
    render(
      <Drawer open title="Навигация" className="rounded" onClose={() => {}}>
        Контент
      </Drawer>,
    );

    expect(screen.getByRole('dialog')).toHaveClass('rounded');
  });

  it('does not render when closed', () => {
    render(
      <Drawer open={false} title="Навигация" onClose={() => {}}>
        Контент
      </Drawer>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
