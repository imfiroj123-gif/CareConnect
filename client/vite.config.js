// Vite configuration for the CareConnect React client.
// The /api proxy forwards API calls to the Express server on :5000
// so the frontend can use relative URLs like fetch('/api/patients').

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
