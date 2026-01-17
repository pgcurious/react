import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Application Entry Point
 *
 * Modern patterns:
 * 1. createRoot API (React 18+)
 * 2. StrictMode for development checks
 * 3. Non-null assertion for root element
 */

// Get root element with type assertion
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a <div id="root"></div> in your HTML.');
}

// Create root and render
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
