// ============================================================
// client/src/main.jsx
// Application entry point — mounts the React app.
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/base.css';
import './styles/dashboard.css';
import './styles/landing.css';
import { seedIfEmpty } from './services/storage.js';

seedIfEmpty();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
