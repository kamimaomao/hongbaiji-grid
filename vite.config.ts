import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const isRailway = Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);

export default defineConfig({
  base: isRailway ? '/' : '/hongbaiji-grid/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
