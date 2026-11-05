import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Dynamically discover all HTML files in pages/
const pagesDir = resolve(__dirname, 'pages');
const pageInputs: Record<string, string> = {
  main: resolve(__dirname, 'index.html'),
};

if (fs.existsSync(pagesDir)) {
  fs.readdirSync(pagesDir).forEach((file) => {
    if (file.endsWith('.html')) {
      const name = file.replace(/\.html$/, '');
      pageInputs[`pages/${name}`] = resolve(pagesDir, file);
    }
  });
}

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: pageInputs,
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
