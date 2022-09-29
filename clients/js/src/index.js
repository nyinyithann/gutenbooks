import '../styles/main.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

const containerId = 'react-root';

const container = document.getElementById(containerId);
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  const div = document.createElement('div');
  const text = document.createTextNode(
    `Element wiht id '${containerId}' not found at 'index.js'.`
  );
  div.appendChild(text);
  document.body.appendChild(div);
}
