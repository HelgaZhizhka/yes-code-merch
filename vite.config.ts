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
      sourcemap: true, // always generate source maps for easier debugging
      minify: isStaging ? false : 'esbuild', // disable minification in staging, enable in production
      rollupOptions: {
        // additional rollup options if needed
      },
    },
    define: {
      __STAGING__: JSON.stringify(isStaging),
    },
  };
});
