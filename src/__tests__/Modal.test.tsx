import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Modal from '../components/Modal/Modal';

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <Modal open title="Заголовок" onClose={() => {}}>
        Контент
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Заголовок')).toBeInTheDocument();
    expect(screen.getByText('Контент')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal open={false} title="Заголовок" onClose={() => {}}>
        Контент
      </Modal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
