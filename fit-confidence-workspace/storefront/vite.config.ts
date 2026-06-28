import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '.env') });

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '@nest': path.resolve(__dirname, './src/shared/types'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../extensions/theme-app-extension/assets'), // Set your specific output folder here
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => (assetInfo?.name?.endsWith('.css') ? 'app-styles.css' : '[name]-[hash][extname]'),
        entryFileNames: 'app.min.js',
        chunkFileNames: 'app.min.js',
        manualChunks: () => 'all',
      },
      plugins: [
        {
          name: 'remove-html',
          generateBundle(_options, bundle) {
            // Iterate over bundle entries and delete HTML files
            Object.keys(bundle).forEach((key) => {
              if (key.endsWith('.html')) delete bundle[key];
            });
          },
        },
      ],
    },
  },
});
