import { defineConfig } from 'astro/config'
import path from 'node:path'
import * as sass from 'sass'
import react from '@astrojs/react'
import mkTailwindFunctions from 'sass-tailwind-functions'
import { sassLegacyFunctions } from './src/lib/node/image-config.ts'
import tina from 'astro-tina'

const tailwindFunctions = mkTailwindFunctions(
  sass,
  path.resolve('./tailwind.config.cjs'),
)

// https://astro.build/config
export default defineConfig({
  site: 'https://robertgdon.com',
  output: 'static',
  integrations: [react(), tina()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['node_modules', 'src/styles'],
          quietDeps: true,
          functions: {
            ...tailwindFunctions,
            ...sassLegacyFunctions,
          },
        },
      },
    },
  },
})
