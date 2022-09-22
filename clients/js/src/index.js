import '../styles/main.css';

import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';

const containerId = 'react-root';

const container = document.getElementById(containerId);
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  const div = document.createElement('div');
  const text = document.createTextNode(
    `Element wiht id '${containerId}' not found at 'index.js'.`
  );
  div.appendChild(text);
  document.body.appendChild(div);
}

/* eslint-disable no-undef */
module.hot.accept();
