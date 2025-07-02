import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import FilmDetailsApp from './FilmDetailsApp.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FilmDetailsApp />
  </StrictMode>
);