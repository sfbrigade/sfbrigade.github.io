import { defineConfig } from "astro/config";
import icon from "astro-icon";

export default defineConfig({
	site: "https://www.sfcivictech.org",
	base: "",
	trailingSlash: "ignore",
	compressHTML: true,
	integrations: [
		icon({
			iconDir: "src/assets/icons",
			include: {
				// Include only specific `fa` icons in the bundle
				fa: [
					"twitter",
					"facebook",
					"linkedin",
					"github",
					"slack",
					"meetup",
					"external-link",
				],
			},
		}),
	],
});
