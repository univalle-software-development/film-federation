# Film Platform - Microfrontend Architecture

This project implements a microfrontend architecture for the Film Platform application using React, Vite, and Webpack Module Federation (via `vite-plugin-federation`). The goal is to allow independent development and deployment of different parts of the user interface.

## Overview

The platform consists of:
* **Shell Application (`packages/shell`):** The main container application that hosts the overall layout, navigation, and orchestrates the loading of microfrontends.
* **Microfrontends (MFEs) (e.g., `packages/mfe-film-catalog`):** Independent frontend applications responsible for specific features or domains (e.g., film catalog, user account, shopping cart).
* **Shared Component Library (`packages/shared-components`):** A library of reusable UI components to ensure consistency across all microfrontends and the shell.

## Prerequisites

* Node.js (v18 or later recommended)
* NPM (v8 or later recommended, for workspace support) or Yarn/PNPM. This guide uses NPM.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd film-platform-microfrontends
    ```

2.  **Install dependencies:**
    This command will install dependencies for all workspaces (shell, MFEs, shared-components) defined in the root `package.json`.
    ```bash
    npm install
    ```

## Running the Development Environment

You need to run the shell application and any microfrontends you are working on or want to see integrated.

1.  **To run all applications simultaneously (Shell and all existing MFEs):**
    Open your terminal in the project root directory (`film-platform-microfrontends`) and run:
    ```bash
    npm run dev:all
    ```
    This will start each application on its pre-configured port.

2.  **To run individual applications:**
    If you only need to work on a specific MFE or the shell:
    * **Shell:** `npm run dev:shell` (Runs on `http://localhost:5000`)
    * **Film Catalog MFE:** `npm run dev:catalog` (Runs on `http://localhost:5001`)
    * **User Account MFE:** `npm run dev:user` (Runs on `http://localhost:5002`)
    * **Shopping Cart MFE:** `npm run dev:cart` (Runs on `http://localhost:5003`)
    * **Notifications MFE:** `npm run dev:notifications` (Runs on `http://localhost:5004`)
    *(Ensure MFEs are running before starting the shell if you want to see them loaded).*

3.  **Access the application:**
    Open your browser and navigate to `http://localhost:5000` (the shell application's address).

## Project Structure

All applications and shared libraries reside within the `packages/` directory:
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
└── README.md
```

## Developing a New Microfrontend (MFE)

Follow these steps to create and integrate a new microfrontend:

1.  **Create MFE Directory and Initialize Project:**
    * Create a new directory for your MFE within `packages/`:
        ```bash
        mkdir packages/mfe-your-feature-name
        cd packages/mfe-your-feature-name
        ```
    * Initialize a new Vite + React project:
        ```bash
        npm create vite@latest . -- --template react
        ```
        (Follow the prompts, choosing React and JavaScript/TypeScript).

2.  **Install Dependencies:**
    Install `vite-plugin-federation` for module federation capabilities.
    ```bash
    npm install @originjs/vite-plugin-federation
    # Also install react, react-dom if not already added by vite template, and react-router-dom if needed
    npm install react react-dom react-router-dom
    ```

3.  **Configure `vite.config.js`:**
    Create or modify `vite.config.js` in your MFE's root. **Crucially, assign a unique port number** that doesn't conflict with other MFEs or the shell.

    ```javascript
    // packages/mfe-your-feature-name/vite.config.js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import federation from '@originjs/vite-plugin-federation';

    // CHOOSE A UNIQUE PORT (e.g., 5005, 5006, etc.)
    const MFE_PORT = 500X; // Replace X with a unique number

    export default defineConfig({
      plugins: [
        react(),
        federation({
          name: 'mfeYourFeatureName', // Unique name for this MFE (camelCase)
          filename: 'remoteEntry.js', // Standard filename
          exposes: {
            // What this MFE will expose to the shell
            './YourFeatureApp': './src/YourFeatureApp.jsx', // e.g., './YourFeatureApp': './src/YourFeatureApp.jsx'
          },
          shared: ['react', 'react-dom', 'react-router-dom'], // Dependencies to share
        }),
      ],
      build: {
        modulePreload: false,
        target: 'esnext',
        minify: false,
        cssCodeSplit: true,
        assetsDir: "dist/assets", // Important for correct asset paths
      },
      server: {
        port: MFE_PORT,
      },
      preview: { // Important for testing the build with the shell
        port: MFE_PORT,
        strictPort: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
      }
    });
    ```
    * Replace `mfeYourFeatureName` with a unique name for your MFE.
    * Replace `./YourFeatureApp` and `./src/YourFeatureApp.jsx` with your MFE's main component.
    * **Ensure `MFE_PORT` is unique.**

4.  **Create the Exposed Component:**
    In your MFE's `src/` directory, create the main component that you specified in `exposes` (e.g., `YourFeatureApp.jsx`).
    ```jsx
    // packages/mfe-your-feature-name/src/YourFeatureApp.jsx
    import React from 'react';

    const YourFeatureApp = () => {
      return (
        <div style={{ padding: '20px', border: '2px dashed teal' }}>
          <h2>Welcome to the [Your Feature Name] Microfrontend!</h2>
          {/* Your MFE's content goes here */}
        </div>
      );
    };

    export default YourFeatureApp;
    ```
    Ensure your MFE's `src/main.jsx` renders this component for standalone development.

5.  **Update Root `package.json`:**
    Add scripts to the root `film-platform-microfrontends/package.json` for your new MFE:
    ```jsonc
    // In film-platform-microfrontends/package.json
    "scripts": {
      // ... existing scripts ...
      "dev:yourfeature": "npm run dev --workspace=mfe-your-feature-name",
      "build:yourfeature": "npm run build --workspace=mfe-your-feature-name",
      // Add "dev:yourfeature" to the "dev:all" script's parallel execution list
      // e.g., "dev:all": "npm-run-all --parallel dev:catalog dev:user ... dev:yourfeature dev:shell",
    },
    ```
    Make sure to also add `mfe-your-feature-name` to the `workspaces` array if it's not covered by `packages/*`.

6.  **Register MFE in the Shell Application:**
    * **Add to Shell's `vite.config.js`:**
        Open `packages/shell/vite.config.js` and add your new MFE to the `remotes` configuration.
        ```javascript
        // packages/shell/vite.config.js
        // ...
        federation({
          name: 'shellHost',
          remotes: {
            // ... existing remotes ...
            mfeYourFeatureName: `http://localhost:${MFE_PORT}/dist/assets/remoteEntry.js`, // Use the same name and port as your MFE's config
          },
          shared: ['react', 'react-dom', 'react-router-dom'],
        }),
        // ...
        ```
    * **Add Route in Shell's `App.jsx`:**
        Open `packages/shell/src/App.jsx` to add navigation and a route for your MFE.
        ```jsx
        // packages/shell/src/App.jsx
        // ... (import Link, Route, etc. from react-router-dom)
        // ... (import MFEComponentLoader if not already present)

        // Add your MFE's page component
        const YourFeaturePage = () => <MFEComponentLoader remoteName="mfeYourFeatureName" exposedModule="./YourFeatureApp" fallbackText="Loading Your Feature..." />;

        function App() {
          return (
            <div className="shell-app">
              <header className="shell-header">
                {/* ... */}
                <nav>
                  <ul className="shell-nav">
                    {/* ... existing links ... */}
                    <li><Link to="/your-feature-path">Your Feature</Link></li>
                  </ul>
                </nav>
              </header>
              <main className="shell-content">
                <Routes>
                  {/* ... existing routes ... */}
                  <Route path="/your-feature-path" element={<YourFeaturePage />} />
                </Routes>
              </main>
              {/* ... */}
            </div>
          );
        }
        // ...
        ```

7.  **Restart Development Servers:**
    If `npm run dev:all` was running, stop it and restart it to pick up the new MFE and shell configurations. Otherwise, start your new MFE's dev server and the shell's dev server.

## Using the Shared Component Library (`shared-components`)

The `packages/shared-components` directory contains reusable UI components (Buttons, Cards, Modals, etc.) to maintain visual and functional consistency.

1.  **Location:** `packages/shared-components/`
    * Components are typically defined in `packages/shared-components/src/`
    * They are exported from `packages/shared-components/src/index.js` (or `index.ts`).

2.  **Adding as a Dependency:**
    The `shared-components` library should already be recognized by NPM workspaces. To explicitly define it as a dependency in an MFE or the Shell's `package.json`:
    ```json
    "dependencies": {
      "shared-components": "workspace:*",
      // ... other dependencies
    }
    ```
    Then run `npm install` in that MFE's/Shell's directory, or `npm install` from the root.

3.  **Importing and Using Components:**
    Once added as a dependency, you can import components directly:
    ```jsx
    // Example in an MFE (e.g., packages/mfe-film-catalog/src/FilmCatalogApp.jsx)
    import React from 'react';
    import { Button, Card } from 'shared-components'; // Assuming Button and Card are exported

    const FilmCatalogApp = () => {
      return (
        <div>
          <h2>Film Catalog</h2>
          <Card title="Featured Film">
            <p>This is an amazing film description.</p>
            <Button onClick={() => alert('More info!')}>Learn More</Button>
          </Card>
        </div>
      );
    };

    export default FilmCatalogApp;
    ```

4.  **Contributing to Shared Components:**
    * The development of shared components is primarily handled by the designated lead/team for this library.
    * New components should be generic and reusable.
    * Follow established coding styles and add them to the export file (`packages/shared-components/src/index.js`).

## Key Technologies

* **React:** For building user interfaces.
* **Vite:** As the build tool and development server, offering fast performance.
* **`@originjs/vite-plugin-federation`:** To enable Module Federation with Vite, allowing runtime integration of separately compiled and deployed applications.
* **React Router:** For client-side routing within the shell and potentially within MFEs.
* **NPM Workspaces:** For managing the monorepo structure.

## Building for Production

To build all applications for production:
```bash
npm run build:all
```

This will create production-ready bundles in the dist/ folder of each application (shell, each MFE). The vite-plugin-federation ensures that the remoteEntry.js files are correctly generated and referenced.

## Note on Production URLs for Remotes:
The remoteEntry.js URLs in the shell's vite.config.js are currently set to localhost. For production, these URLs must be updated to point to the actual deployed locations of your MFEs' remoteEntry.js files. This can be managed via environment variables or different Vite configurations for production.