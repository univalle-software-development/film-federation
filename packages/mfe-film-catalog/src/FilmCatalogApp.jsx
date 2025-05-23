import React, { useState } from 'react';
import { Button } from 'shared-components';


const FilmCatalogApp = () => {
  const [message, setMessage] = useState('Waiting for a button click...');

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-2xl border border-gray-200">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-blue-700">🎬 Film Catalog MFE</h1>
        <p className="text-gray-500 mt-2">Browse our amazing collection of films!</p>
      </header>

      <div className="text-center mb-8">
        <img 
          src="https://placehold.co/600x300/3498db/ffffff?text=Awesome+Film+Banner&font=montserrat" 
          alt="Film Banner" 
          className="rounded-lg shadow-md mx-auto"
        />
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <p className="text-lg text-gray-700 mb-4 font-mono">{message}</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button 
            variant="primary"
            onClick={() => setMessage('Primary Action: Viewing All Films! 🎉')}
            className="w-full sm:w-auto"
          >
            View All Films
          </Button>
          <Button 
            variant="secondary"
            onClick={() => setMessage('Secondary Action: Searching Films... 🔍')}
            className="w-full sm:w-auto"
          >
            Search Films
          </Button>
          <Button 
            variant="outline"
            onClick={() => setMessage('Outline Action: Filters Applied! ✨')}
            className="w-full sm:w-auto"
          >
            Apply Filters
          </Button>
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-400">
        <p>Powered by Microfrontends & Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default FilmCatalogApp;