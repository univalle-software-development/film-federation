// packages/shell/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell', // Or 'hostApp' like in the tutorial, 'shell' is fine.
      remotes: {
        mfeFilmCatalog: 'mfeFilmCatalog@http://localhost:5001/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5000,
    strictPort: true,
    cors: true
  },
  resolve: {
    preserveSymlinks: true,
  },
  optimizeDeps: {
    exclude: ['mfeFilmCatalog/FilmCatalogApp'], // This is correct and important
  },
});