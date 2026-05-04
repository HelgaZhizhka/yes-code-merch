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
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-router': ['@tanstack/react-router'],
            'vendor-query': ['@tanstack/react-query'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-radix': [
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-dialog',
              '@radix-ui/react-label',
              '@radix-ui/react-popover',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-select',
              '@radix-ui/react-slider',
              '@radix-ui/react-slot',
              '@radix-ui/react-tooltip',
              '@radix-ui/react-visually-hidden',
            ],
          },
        },
      },
    },
    define: {
      __STAGING__: JSON.stringify(isStaging),
    },
  };
});
