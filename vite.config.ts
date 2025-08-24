/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const isStaging = mode === 'staging';

  return {
    tsr: {
      appDirectory: 'src',
    },
    plugins: [tsconfigPaths(), viteReact(), tailwindcss()],
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    build: {
      sourcemap: isStaging,
      minify: isStaging ? false : 'esbuild',
      rollupOptions: {},
    },
    define: {
      __STAGING__: JSON.stringify(isStaging),
    },
  };
});
