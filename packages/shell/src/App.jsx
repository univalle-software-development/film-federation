// packages/shell/src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button } from 'shared-components'; // If shell uses shared components

class MFEErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('MFE Loading Error:', error);
    console.log('Component Stack:', info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border-2 border-red-300 bg-red-50 rounded-lg">
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            Failed to load microfrontend: {this.props.mfeName}
          </h3>
          <p className="text-gray-700 mb-4">Error: {this.state.error?.message}</p>
          <p className="text-sm text-gray-500 mb-4">
            Check that the microfrontend server is running and properly configured.
          </p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// MFE Loader utility
const MFEComponentLoader = ({ remoteName, exposedModule, fallbackText = 'Loading Microfrontend...' }) => {
  // Fix the template string - current one has HTML artifacts
  const modulePath = `${remoteName}/${exposedModule.replace('./', '')}`;
  console.log(`Attempting to import MFE module: ${modulePath}`);
  
  const Component = React.lazy(() => import(/* @vite-ignore */ modulePath));
  return (
    <MFEErrorBoundary mfeName={`${remoteName}/${exposedModule}`}>
      <Suspense fallback={<div className="p-4 text-center text-lg animate-pulse">{fallbackText}</div>}>
        <Component />
      </Suspense>
    </MFEErrorBoundary>
  );
};

const FilmCatalogPage = () => {
  console.log("Attempting to load Film Catalog MFE");
  return <MFEComponentLoader 
    remoteName="mfeFilmCatalog" 
    exposedModule="./FilmCatalogApp" 
    fallbackText="Loading Film Catalog..." 
  />;
};;
// const UserAccountPage = () => <MFEComponentLoader remoteName="mfeUserAccount" exposedModule="./UserAccountApp" />;

const HomePage = () => (
  <div className="text-center p-10">
    <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to the Film Platform</h2>
    <p className="text-gray-600">Navigate using the links above to load different sections.</p>
    <Button onClick={() => alert('Shell button clicked!')} className="mt-4">Shell Test Button</Button>
   
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <header className="bg-gray-800 text-white shadow-lg">
          <nav className="container mx-auto px-6 py-3">
            <ul className="flex items-center justify-center space-x-6">
              <li><Link to="/" className="hover:text-gray-300 transition-colors">Home (Shell)</Link></li>
              <li><Link to="/catalog" className="hover:text-gray-300 transition-colors">Film Catalog (MFE)</Link></li>
              {/* <li><Link to="/account" className="hover:text-gray-300">User Account (MFE)</Link></li> */}
            </ul>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<FilmCatalogPage />} />
            {/* <Route path="/account" element={<UserAccountPage />} /> */}
          </Routes>
        </main>
        <footer className="bg-gray-700 text-white text-center p-4">
          &copy; 2025 Film Platform
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
