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

const loadRemoteModule = (remoteName, exposedModule) => async () => {
  // 1) Initialize shared scope. This fills it with known modules from this build and all remotes
  await __webpack_init_sharing__('default');
  // 2) Retrieve the container (mounted on window by ModuleFederationPlugin)
  const container = window[remoteName];
  // 3) Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__.default);
  // 4) Get the module factory and execute it
  const factory = await container.get(exposedModule);
  return factory();
};

const MFEComponentLoader = ({ remoteName, exposedModule, fallbackText }) => {
  const Component = React.lazy(loadRemoteModule(remoteName, exposedModule));

  return (
    <MFEErrorBoundary mfeName={`${remoteName}/${exposedModule}`}>
      <Suspense fallback={<div className="p-4 text-center">{fallbackText}</div>}>
        <Component />
      </Suspense>
    </MFEErrorBoundary>
  );
};

// Then your FilmCatalogPage stays the same:
const FilmCatalogPage = () => (
  <MFEComponentLoader
    remoteName="mfeFilmCatalog"
    exposedModule="./FilmCatalogApp"
    fallbackText="Loading Film Catalog..."
  />
);

const FilmDetailsPage = () => (
  <MFEComponentLoader
    remoteName="mfeFilmDetails"
    exposedModule="./FilmDetailsApp"
    fallbackText="Loading Film Details..."
  />
);

const UserRegistrationPage = () => (
  <MFEComponentLoader
    remoteName="mfeUserRegistration"
    exposedModule="./UserRegistration"
    fallbackText="Loading User Registration..."
  />
)
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
              <li><Link to="/details" className="hover:text-gray-300">Film Details (MFE)</Link></li>
              <li><Link to="/user-registration" className="hover:text-gray-300">User Registration (MFE)</Link></li>
              {/* <li><Link to="/account" className="hover:text-gray-300">User Account (MFE)</Link></li> */}
            </ul>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<FilmCatalogPage />} />
            <Route path="/user-registration/" element={<UserRegistrationPage />} />
            <Route path="/details/:id" element={<FilmDetailsPage />} />
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
