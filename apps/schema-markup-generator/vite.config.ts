import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => ({
  server: { port: 3003 },
  plugins: [
    devtools({ eventBusConfig: { port: 43073 } }),
    tailwindcss(),
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    viteReact(),
  ],
}))
