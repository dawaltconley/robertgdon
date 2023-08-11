declare module 'astro' {
  interface AstroClientDirectives {
    'client:tina'?: boolean
  }
}

// Make d.ts a module to similate common packaging setups where the entry `index.d.ts` would augment the types
export {}
