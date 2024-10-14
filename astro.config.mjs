// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: 'https://milrosen.github.io',
  base: 'portfolio-v4',
  integrations: [react()]
});
