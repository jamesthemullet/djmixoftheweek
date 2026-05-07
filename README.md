# DJ Mix of the Week

A site for discovering and browsing DJ mixes, built with [Astro](https://astro.build) and deployed on Vercel.

## Features

- Browse mixes by DJ, genre, and nationality
- League of mixes rankings
- RSS feed
- SEO-friendly with sitemap and OpenGraph data

## Getting Started

```sh
yarn install
yarn dev        # Start local dev server at localhost:4321
yarn build      # Type-check and build for production
yarn preview    # Preview production build locally
```

## Other Commands

| Command           | Action                              |
| :---------------- | :---------------------------------- |
| `yarn lint`       | Check code with Biome               |
| `yarn lint:fix`   | Auto-fix lint issues                |
| `yarn test:unit`  | Run unit tests with Vitest          |
| `yarn test:e2e`   | Run end-to-end tests with Playwright|

## Project Structure

```
src/
├── components/    # Astro/UI components
├── content/       # Markdown/MDX content collections
├── layouts/       # Page layouts
└── pages/         # File-based routes
public/            # Static assets
```
