// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'


// https://astro.build/config
export default defineConfig({
  site: 'https://milrosen.github.io',
  base: 'portfolio-v4',
  markdown: {
    syntaxHighlight: "prism",
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [react(), mdx()]
});
