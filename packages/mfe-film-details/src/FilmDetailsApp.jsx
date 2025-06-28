// packages/mfe-your-feature-name/src/YourFeatureApp.jsx
import React, { useState } from 'react';
import { Button } from 'shared-components';

const FilmDetailsApp = () => {
  const [message, setMessage] = useState('Welcome to Details Feature!');
  
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Film Details Microfrontend</h2>
      <p className="mb-4">{message}</p>
      <Button 
        onClick={() => setMessage('Button clicked!')}
        className="bg-blue-500 hover:bg-blue-700"
      >
        Click Me
      </Button>
    </div>
  );
};

export default FilmDetailsApp;