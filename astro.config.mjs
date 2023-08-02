import { defineConfig } from 'astro/config';

import react from "@astrojs/react";

const tina = () => ({
  name: 'tina-cms',
  hooks: {
    'astro:config:setup': ({ addClientDirective, opts }) => {
      addClientDirective({
        name: 'tina',
        entrypoint: './client-directives/tina.mjs',
      })
    }
  }
})

// https://astro.build/config
export default defineConfig({
  site: 'https://robertgdon.com',
  output: 'static',
  integrations: [react(), tina()]
});
