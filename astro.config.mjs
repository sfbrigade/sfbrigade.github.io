import { defineConfig } from "astro/config";
import icon from "astro-icon";

export default defineConfig({
	//	site: "https://www.sfcivictech.org/"
	//	base: "",
	site: "https://sfbrigade.github.io",
	base: "/astro-static-site/",
	trailingSlash: "never",
	compressHTML: false,
	integrations: [
		icon({
			include: {
				// Include only specific `fa` icons in the bundle
				fa: ["twitter", "facebook", "linkedin", "github", "slack", "meetup"],
			},
		}),
	],
});
