import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  server: { port: 3000 },
  plugins: [
    devtools({ eventBusConfig: { port: 43070 } }),
    tailwindcss(),
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart({ srcDirectory: 'src' }),
    viteReact(),
    ...(command === 'build' ? [netlify()] : []),
  ],
}))
