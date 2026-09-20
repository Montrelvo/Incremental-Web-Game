import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative assets work on GitHub project Pages, Capacitor and Electron file URLs.
  base: './',
  build: { rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } } },
});
