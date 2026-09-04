import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/canoe-layout-planner/',
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
  build: { outDir: 'dist-pages', emptyOutDir: true },
});
