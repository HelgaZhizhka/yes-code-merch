/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  tsr: {
    appDirectory: 'src',
  },
  plugins: [tsconfigPaths(), viteReact(), tailwindcss()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
