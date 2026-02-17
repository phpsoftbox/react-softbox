import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import FileUploader from '../components/FileUploader/FileUploader';

describe('FileUploader', () => {
  it('renders drop label and button', () => {
    render(<FileUploader dropLabel="Зона загрузки" buttonLabel="Добавить" />);

    expect(screen.getByText('Зона загрузки')).toBeInTheDocument();
    expect(screen.getByText('Добавить')).toBeInTheDocument();
  });

  it('calls onChange for valid files', () => {
    let captured: File[] | null = null;
    const handleChange = (next: File[]) => {
      captured = next;
    };
    const { container } = render(<FileUploader onChange={handleChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(captured).toEqual([file]);
  });

  it('shows errors for invalid files', () => {
    const { container } = render(<FileUploader allowedTypes={['.png']} maxFileSizeKb={1} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const badFile = new File([new Array(2048).fill('a').join('')], 'doc.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [badFile] } });

    expect(screen.getByText(/недопустимый формат/i)).toBeInTheDocument();
  });
});
