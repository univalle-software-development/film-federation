import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Your global styles for the MFE
// import App from './App.jsx'; // REMOVE OR COMMENT OUT THIS LINE
import FilmCatalogApp from './FilmCatalogApp.jsx'; // IMPORT YOUR ACTUAL MFE COMPONENT

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FilmCatalogApp /> {/* RENDER YOUR FilmCatalogApp HERE */}
  </StrictMode>,
);