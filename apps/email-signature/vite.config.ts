import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'fs';
import path from 'path';

const packageJson = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

export default defineConfig(() => ({
  server: { port: 3002 },
  optimizeDeps: {
    // Avoid 504 "Outdated Optimize Dep" after dependency/lockfile changes
    force: process.env.NODE_ENV === 'development',
  },
  plugins: [
    devtools({ eventBusConfig: { port: 43072 } }),
    tailwindcss(),
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart({ srcDirectory: 'src' }),
    viteReact(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
}));
