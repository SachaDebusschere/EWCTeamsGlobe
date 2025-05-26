import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 8000,
    open: '/esports.html', // Ouvre directement la page esports.html comme le faisait le serveur Python
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        esports: resolve(__dirname, 'esports.html'),
        test: resolve(__dirname, 'test.html'),
      },
    },
  },
  // Préserve la structure des chemins d'origine pour les imports
  resolve: {
    alias: {
      '/js': resolve(__dirname, 'js'),
      '/public': resolve(__dirname, 'public'),
    },
  },
}); 