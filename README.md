# Film Platform - Microfrontend Architecture

This project implements a microfrontend architecture for the Film Platform application using React, Webpack, and Module Federation (via `@module-federation/enhanced`). The goal is to allow independent development and deployment of different parts of the user interface.

## Overview

The platform consists of:
* **Shell Application (shell):** The main container application that hosts the overall layout, navigation, and orchestrates the loading of microfrontends.
* **Microfrontends (MFEs) (e.g., mfe-film-catalog):** Independent frontend applications responsible for specific features or domains (e.g., film catalog, user account, shopping cart).
* **Shared Component Library (shared-components):** A library of reusable UI components to ensure consistency across all microfrontends and the shell.

## Prerequisites

* Node.js (v18 or later recommended)
* NPM (v8 or later recommended, for workspace support) or Yarn/PNPM. This guide uses NPM.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd film-platform-microfrontends
   ```

2. **Install dependencies:**
   This command will install dependencies for all workspaces (shell, MFEs, shared-components) defined in the root package.json.
   ```bash
   npm install
   ```

## Running the Development Environment

You need to run the shell application and any microfrontends you are working on or want to see integrated.

1. **To run all applications simultaneously (Shell and all existing MFEs):**
   Open your terminal in the project root directory (`film-platform-microfrontends`) and run:
   ```bash
   npm run dev:all
   ```
   This will start each application on its pre-configured port.

2. **To run individual applications:**
   If you only need to work on a specific MFE or the shell:
   * **Shell:** `npm run dev:shell` (Runs on `http://localhost:5000`)
   * **Film Catalog MFE:** `npm run dev:catalog` (Runs on `http://localhost:5001`)
   * **User Account MFE:** `npm run dev:user` (Runs on `http://localhost:5002`)
   * **Shopping Cart MFE:** `npm run dev:cart` (Runs on `http://localhost:5003`)
   * **Notifications MFE:** `npm run dev:notifications` (Runs on `http://localhost:5004`)
   *(Ensure MFEs are running before starting the shell if you want to see them loaded).*

3. **Access the application:**
   Open your browser and navigate to `http://localhost:5000` (the shell application's address).

## Project Structure

All applications and shared libraries reside within the packages directory:
```
film-platform-microfrontends/
├── packages/
│   ├── shell/                # Host Application
│   ├── mfe-film-catalog/     # Example Microfrontend
│   ├── mfe-user-account/     # Example Microfrontend
│   ├── mfe-shopping-cart/    # Example Microfrontend
│   ├── mfe-notifications/    # Example Microfrontend
│   └── shared-components/    # Shared UI Library
├── package.json              # Root package.json with workspace scripts
├── babel.config.js           # Shared Babel configuration
└── README.md
```

## Developing a New Microfrontend (MFE)

Follow these steps to create and integrate a new microfrontend:

1. **Create MFE Directory and Initialize Project:**
   * Create a new directory for your MFE within packages:
     ```bash
     mkdir packages/mfe-your-feature-name
     cd packages/mfe-your-feature-name
     ```
   * Initialize a new NPM package:
     ```bash
     npm init -y
     ```

2. **Install Dependencies:**
   ```bash
   npm install react react-dom react-router-dom
   npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin babel-loader @babel/core @babel/preset-env @babel/preset-react css-loader style-loader postcss-loader @module-federation/enhanced
   ```

3. **Configure `webpack.config.cjs`:**
   Create a webpack configuration file in your MFE's root. **Crucially, assign a unique port number** that doesn't conflict with other MFEs or the shell.

   ```javascript
   // packages/mfe-your-feature-name/webpack.config.cjs
   const HtmlWebpackPlugin = require('html-webpack-plugin');
   const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
   const path = require('path');
   const deps = require('./package.json').dependencies;
   
   // CHOOSE A UNIQUE PORT (e.g., 5005, 5006, etc.)
   const MFE_PORT = 500X; // Replace X with a unique number
   
   module.exports = {
     entry: './src/main.jsx',
     mode: 'development',
     devServer: {
       static: {
         directory: path.join(__dirname, 'dist'),
       },
       port: MFE_PORT,
       historyApiFallback: true,
       headers: {
         'Access-Control-Allow-Origin': '*',
       }
     },
     output: {
       publicPath: `http://localhost:${MFE_PORT}/`,
     },
     resolve: {
       extensions: ['.js', '.jsx', '.json'],
     },
     module: {
       rules: [
         {
           test: /\.(js|jsx)$/,
           include: [
             path.resolve(__dirname, 'src'),
             path.resolve(__dirname, '../shared-components/src')
           ],
           exclude: /node_modules/,
           use: {
             loader: 'babel-loader',
             options: {
               configFile: path.resolve(__dirname, '../../babel.config.js')
             }
           },
         },
         {
           test: /\.css$/,
           use: ['style-loader', 'css-loader', 'postcss-loader'],
         },
       ],
     },
     plugins: [
       new ModuleFederationPlugin({
         name: 'mfeYourFeatureName', // Unique name for this MFE (camelCase)
         filename: 'remoteEntry.js',
         exposes: {
           './YourFeatureApp': './src/YourFeatureApp.jsx',
         },
         shared: {
           react: { singleton: true, requiredVersion: deps.react },
           'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
           // Add other shared dependencies as needed
         },
       }),
       new HtmlWebpackPlugin({ template: './index.html' }),
     ],
   };
   ```
   * Replace `mfeYourFeatureName` with a unique name for your MFE.
   * Replace `./YourFeatureApp` and `./src/YourFeatureApp.jsx` with your MFE's main component.
   * **Ensure `MFE_PORT` is unique.**

4. **Create `index.html` template:**
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>Your Feature MFE</title>
   </head>
   <body>
     <div id="root"></div>
   </body>
   </html>
   ```

5. **Create the MFE Structure:**
   * Create a `src` directory with starter files:
     ```bash
     mkdir -p src
     ```
   
   * Create `src/main.jsx` for the entry point:
     ```jsx
     // packages/mfe-your-feature-name/src/main.jsx
     import('./bootstrap.jsx');
     ```

   * Create `src/bootstrap.jsx` for the initialization:
     ```jsx
     // packages/mfe-your-feature-name/src/bootstrap.jsx
     import React from 'react';
     import { createRoot } from 'react-dom/client';
     import YourFeatureApp from './YourFeatureApp';
     
     const root = createRoot(document.getElementById('root'));
     root.render(
       <React.StrictMode>
         <YourFeatureApp />
       </React.StrictMode>
     );
     ```

   * Create `src/YourFeatureApp.jsx` for the exposed component:
     ```jsx
     // packages/mfe-your-feature-name/src/YourFeatureApp.jsx
     import React, { useState } from 'react';
     import { Button } from 'shared-components';
     
     const YourFeatureApp = () => {
       const [message, setMessage] = useState('Welcome to Your Feature!');
       
       return (
         <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
           <h2 className="text-2xl font-bold mb-4">Your Feature Microfrontend</h2>
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
     
     export default YourFeatureApp;
     ```

6. **Update package.json for the MFE:**
   Add scripts to the MFE's package.json:
   ```json
   {
     "scripts": {
       "start": "webpack serve --mode development",
       "build": "webpack --mode production"
     },
     "dependencies": {
       "react": "^19.1.0",
       "react-dom": "^19.1.0",
       "shared-components": "workspace:*"
     }
   }
   ```

7. **Update Root package.json:**
   Add scripts to the root `film-platform-microfrontends/package.json` for your new MFE:
   ```json
   {
     "scripts": {
       "dev:yourfeature": "npm run start --workspace=mfe-your-feature-name",
       "build:yourfeature": "npm run build --workspace=mfe-your-feature-name",
       "dev:all": "npm-run-all --parallel dev:catalog dev:user dev:cart dev:notifications dev:yourfeature dev:shell"
     }
   }
   ```

8. **Register MFE in the Shell Application:**
   * **Add to Shell's `webpack.config.cjs`:**
       Open webpack.config.cjs and add your new MFE to the `remotes` configuration.
       ```javascript
       // packages/shell/webpack.config.cjs
       // ...existing code...
       new ModuleFederationPlugin({
         name: 'shell',
         remotes: {
           // ...existing remotes...
           mfeYourFeatureName: 'mfeYourFeatureName@http://localhost:5005/remoteEntry.js', // Use the port you defined
         },
         shared: {
           react: { singleton: true, requiredVersion: deps.react },
           'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
           // ...other shared dependencies
         },
       }),
       // ...
       ```

   * **Add Component and Route in Shell's `App.jsx`:**
       Open App.jsx to add navigation and a route for your MFE.
       ```jsx
       // packages/shell/src/App.jsx
       // ...import statements...
       
       // Add your MFE's page component
       const YourFeaturePage = () => (
         <MFEComponentLoader
           remoteName="mfeYourFeatureName"
           exposedModule="./YourFeatureApp"
           fallbackText="Loading Your Feature..."
         />
       );
       
       function App() {
         return (
           <BrowserRouter>
             <div className="shell-container">
               <header className="p-4 bg-gray-800 text-white">
                 <nav>
                   <ul className="flex gap-4">
                     {/* ...existing links... */}
                     <li>
                       <Link 
                         to="/your-feature" 
                         className="hover:text-blue-300"
                       >
                         Your Feature
                       </Link>
                     </li>
                   </ul>
                 </nav>
               </header>
               <main className="p-4">
                 <Routes>
                   {/* ...existing routes... */}
                   <Route path="/your-feature" element={<YourFeaturePage />} />
                 </Routes>
               </main>
             </div>
           </BrowserRouter>
         );
       }
       // ...
       ```

9. **Restart Development Servers:**
   If `npm run dev:all` was running, stop it and restart it to pick up the new MFE and shell configurations. Otherwise, start your new MFE's dev server and the shell's dev server.

## Using the Shared Component Library

The shared-components directory contains reusable UI components that can be used across all MFEs and the shell.

1. **Structure:**
   * Components are defined in `packages/shared-components/src/components`
   * Exported through index.js

2. **Using in your MFE:**
   Add as a dependency in your MFE's package.json:
   ```json
   "dependencies": {
     "shared-components": "workspace:*",
     // ...other dependencies
   }
   ```

3. **Importing components:**
   ```jsx
   import { Button, Card } from 'shared-components';
   
   const MyComponent = () => (
     <Card title="Example">
       <p>Content for the card</p>
       <Button>Click Me</Button>
     </Card>
   );
   ```

4. **When adding new shared components:**
   * Create the component in `packages/shared-components/src/components/`
   * Export it in index.js
   * Follow established patterns for styling and props

## Module Federation Configuration Options

The `ModuleFederationPlugin` configuration has several important options:

1. **name**: A unique identifier for the application in the federation.

2. **filename**: The name of the generated federation endpoint (default: `remoteEntry.js`).

3. **exposes**: An object of modules to expose. The key is the path that will be used to import the module, and the value is the path to the actual module file.
   ```javascript
   exposes: {
     './ComponentName': './src/components/ComponentName.jsx'
   }
   ```

4. **remotes**: An object that maps remote names to their locations.
   ```javascript
   remotes: {
     remoteName: 'remoteName@http://host:port/remoteEntry.js'
   }
   ```

5. **shared**: Dependencies that should be shared between applications. This prevents duplication and ensures consistency.
   ```javascript
   shared: {
     react: { singleton: true, requiredVersion: deps.react },
     'react-dom': { singleton: true, requiredVersion: deps['react-dom'] }
   }
   ```

## Loading Remote Modules in React

The shell application uses a custom loader component to dynamically import and render microfrontends:

```jsx
const loadRemoteModule = (remoteName, exposedModule) => async () => {
  // 1) Initialize shared scope
  await __webpack_init_sharing__('default');
  // 2) Get the container
  const container = window[remoteName];
  // 3) Initialize the container
  await container.init(__webpack_share_scopes__.default);
  // 4) Get the module
  const factory = await container.get(exposedModule);
  return factory();
};

const MFEComponentLoader = ({ remoteName, exposedModule, fallbackText }) => {
  const Component = React.lazy(loadRemoteModule(remoteName, exposedModule));

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>{fallbackText}</div>}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};
```

## Key Technologies

* **React:** For building user interfaces
* **Webpack:** Bundling and build system
* **@module-federation/enhanced:** For implementing Module Federation with extended features
* **React Router:** For client-side routing
* **Tailwind CSS:** For styling (if used in your project)
* **NPM Workspaces:** For managing the monorepo structure

## Building for Production

To build all applications for production:
```bash
npm run build:all
```

This will create production-ready bundles in the dist/ folder of each application.

## Production Deployment

For production deployment, you'll need to:

1. **Update Remote URLs:** In the shell's webpack config, update the remote URLs to point to production hosts:
   ```javascript
   remotes: {
     mfeFilmCatalog: 'mfeFilmCatalog@https://films.example.com/remoteEntry.js',
     mfeUserAccount: 'mfeUserAccount@https://account.example.com/remoteEntry.js',
     // ...other remotes
   }
   ```

2. **Consider using environment variables** to manage URLs across environments:
   ```javascript
   remotes: {
     mfeFilmCatalog: `mfeFilmCatalog@${process.env.FILM_CATALOG_URL || 'http://localhost:5001'}/remoteEntry.js`,
   }
   ```

3. **Implement a dynamic remote loading strategy** for more flexibility in production:
   ```javascript
   new ModuleFederationPlugin({
     remotes: {
       mfeFilmCatalog: `promise new Promise(resolve => {
         const remoteUrl = window.ENV.FILM_CATALOG_URL || 'http://localhost:5001';
         const script = document.createElement('script');
         script.src = `${remoteUrl}/remoteEntry.js`;
         script.onload = () => {
           resolve({ get: window.mfeFilmCatalog.get, init: window.mfeFilmCatalog.init });
         };
         document.head.appendChild(script);
       })`
     },
     // ...
   })
   ```

This architecture provides a robust foundation for building scalable microfrontend applications, allowing teams to develop independently while maintaining consistency through shared components and configurations.