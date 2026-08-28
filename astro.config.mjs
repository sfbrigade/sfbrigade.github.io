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
		"/": "/v2",
		"/about": "/about-v2",
		"/blog": "/blog-v2",
		"/donate": "/donate-v2",
		"/events": "/events-v2",
		"/get-started": "/get-started-v2",
		"/projects": "/projects-v2",
		"/propose": "/propose-v2",
		"/roles": "/roles-v2",
		"/sponsor": "/sponsor-v2",
		// redirect old post URL to the corrected v2 slug (fixing the typo in one hop)
		[oldCivcURL]: oldCivcURL.replace("civc", "civic").replace("/blog/", "/blog-v2/"),
		// redirect individual blog post URLs to their v2 equivalents
		"/blog/[slug]": "/blog-v2/[slug]",
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
