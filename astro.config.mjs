import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import icon from "astro-icon";

export default defineConfig({
	site: "https://www.sfcivictech.org",
	base: "",
	trailingSlash: "ignore",
	compressHTML: true,
	integrations: [
		react(),
		icon({
			iconDir: "src/assets/icons",
			include: {
				// Include only specific `fa` icons in the bundle
				fa: [
					"facebook",
					"linkedin",
					"github",
					"slack",
					"meetup",
					"external-link",
				],
				"fa6-brands": [
					"bluesky",
					"twitter",
				],
			},
		}),
	],
	vite: {
		css: {
			modules: {
				localsConvention: "camelCase",
			}
		}
	}
});
