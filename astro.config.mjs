import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

const oldCivcURL = "/blog/2019-06-22-introducing-civc-tech-to-san-franciscos-underserved-communities";

export default defineConfig({
	site: "https://www.sfcivictech.org",
	base: "",
	trailingSlash: "ignore",
	compressHTML: true,
	redirects: {
		// redirect old post URL to a new one without the typo
		[oldCivcURL]: oldCivcURL.replace("civc", "civic"),
	},
	integrations: [
		react(),
		icon({
			iconDir: "src/assets/icons",
			include: {
				// include only specific `fa` icons in the bundle
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
		},

		plugins: [tailwindcss()]
	}
});
