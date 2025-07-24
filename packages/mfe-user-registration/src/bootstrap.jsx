// packages/mfe-user-registration/src/bootstrap.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import UserRegistration from './UserRegistration';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserRegistration />
  </React.StrictMode>
);