import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base MUST match the repo name for GitHub Pages project sites:
// https://<user>.github.io/varsity-sports/
export default defineConfig({
  plugins: [react()],
  base: (process.env.CF_PAGES || process.env.VITE_BASE_PATH === '/') ? '/' : '/varsity-sports/',
  build: {
    chunkSizeWarningLimit: 1200
  }
});
