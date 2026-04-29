import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';

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

  it('renders toolbar button with icon and label', () => {
    render(
      <Card>
        <Card.Toolbar>
          <Card.Toolbar.Group>
            <Card.Toolbar.Button
              icon={<span aria-hidden="true">+</span>}
              label="Добавить"
            />
          </Card.Toolbar.Group>
        </Card.Toolbar>
      </Card>,
    );

    expect(screen.getByRole('button', { name: 'Добавить' })).toBeInTheDocument();
  });
});
