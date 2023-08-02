import { defineConfig } from 'astro/config'
import path from 'node:path'
import sass from 'sass'
import mkTailwindFunctions from 'sass-tailwind-functions'
import react from '@astrojs/react'

const tailwindFunctions = mkTailwindFunctions(
  sass,
  path.resolve('./tailwind.config.cjs'),
)

const tina = () => ({
  name: 'tina-cms',
  hooks: {
    'astro:config:setup': ({ addClientDirective, opts }) => {
      addClientDirective({
        name: 'tina',
        entrypoint: './client-directives/tina.mjs',
      })
    },
  },
})

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
          },
        },
      },
    },
  },
})
