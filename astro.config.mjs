import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import icon from "astro-icon";

const oldCivcURL = "/blog/2019-06-22-introducing-civc-tech-to-san-franciscos-underserved-communities";

export default defineConfig({
	site: "https://www.sfcivictech.org",
	base: "",
	trailingSlash: "ignore",
	compressHTML: true,
	redirects: {
		// backward-compat redirects for the old "-v2" URLs used during the
		// redesign, now that the v2 pages have taken over the clean paths
		"/v2": "/",
		"/about-v2": "/about",
		"/blog-v2": "/blog",
		"/blog-v2/[slug]": "/blog/[slug]",
		"/code-of-conduct-v2": "/code-of-conduct",
		"/donate-v2": "/donate",
		"/events-v2": "/events",
		"/get-started-v2": "/get-started",
		"/projects-v2": "/projects",
		"/propose-v2": "/propose",
		"/roles-v2": "/roles",
		"/sponsor-v2": "/sponsor",
		// redirect old post URL to the corrected slug (fixing the typo)
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
		}
	}
});
