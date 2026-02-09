import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@phpsoftbox/react-softbox/foundations/index.css';
import { initTheme } from '@phpsoftbox/react-softbox';
import './app.css';

initTheme({ defaultMode: 'system' });

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}
