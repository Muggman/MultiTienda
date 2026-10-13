import angular from '@analogjs/vite-plugin-angular';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig, normalizePath } from 'vite';

const projectDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'resolve-angular-src',
        enforce: 'pre',
        resolveId(id) {
          if (id.startsWith('/src/')) {
            return normalizePath(path.resolve(projectDir, '.' + id));
          }
          return null;
        }
      },
      angular({
        tsconfig: path.resolve(projectDir, './tsconfig.app.json')
      }),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(projectDir, './src'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
