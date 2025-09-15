// @ts-check

import alpinejs from "@astrojs/alpinejs";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";

const isProduction = process.env.NODE_ENV === "production";
const siteUrl = isProduction
	? "https://djmixoftheweek.com"
	: "http://localhost:4321";

export default defineConfig({
	output: "server",
	adapter: vercel({
		webAnalytics: { enabled: true },
	}),
	site: siteUrl,
	integrations: [
		partytown({
			config: {
				forward: ["dataLayer.push"],
			},
		}),
		mdx(),
		alpinejs(),
	],
});
