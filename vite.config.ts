import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { handleCatalogApi } from './server/catalog-api.mjs';

const isRailway = Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);

const catalogApiPlugin = {
  name: 'catalog-api',
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (!request.url?.startsWith('/api/catalog/')) {
        next();
        return;
      }
      void handleCatalogApi(request, response).catch(() => {
        response.statusCode = 500;
        response.end('Catalog API failed');
      });
    });
  },
};

export default defineConfig({
  base: isRailway ? '/' : '/hongbaiji-grid/',
  plugins: [catalogApiPlugin, react()],
  preview: {
    allowedHosts: ['hongbaiji-grid-production.up.railway.app'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
