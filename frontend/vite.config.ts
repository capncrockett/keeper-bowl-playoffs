import { defineConfig } from 'vite';
import type { CSSOptions } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const lightningcssOptions = {
  // Teach Lightning CSS about CSS Houdini @property, used by DaisyUI radial progress
  customAtRules: {
    property: {
      prelude: '<custom-ident>',
      body: 'declaration-list',
    },
  },
} satisfies NonNullable<CSSOptions['lightningcss']>;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      // Skip Tailwind's Lightning CSS optimizer (it doesn't recognize @property yet)
      optimize: false,
    }), // Tailwind v4 integration
  ],
  css: {
    transformer: 'lightningcss',
    lightningcss: lightningcssOptions,
  },
  build: {
    // Avoid DaisyUI's @property warning during minification
    cssMinify: 'lightningcss',
  },
});
