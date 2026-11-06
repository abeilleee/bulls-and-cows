/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    open: true,
  },
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@utils': resolve(import.meta.dirname, 'src/utils'),
    },
  },
});
