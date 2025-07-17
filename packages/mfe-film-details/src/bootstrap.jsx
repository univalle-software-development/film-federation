import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import FilmDetailsApp from './FilmDetailsApp.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FilmDetailsApp />
  </StrictMode>
);