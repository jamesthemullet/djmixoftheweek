// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

const isProduction = process.env.NODE_ENV === "production";
const siteUrl = isProduction
  ? "https://djmixoftheweek.com"
  : "http://localhost:4321";

export default defineConfig({
  site: siteUrl,
  integrations: [mdx(), sitemap()],
});
