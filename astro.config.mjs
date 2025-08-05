// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

import alpinejs from '@astrojs/alpinejs';

const isProduction = process.env.NODE_ENV === 'production';
const siteUrl = isProduction ? 'https://djmixoftheweek.com' : 'http://localhost:4321';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  site: siteUrl,
  integrations: [
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    mdx(),
    sitemap(),
    alpinejs(),
  ],
});
