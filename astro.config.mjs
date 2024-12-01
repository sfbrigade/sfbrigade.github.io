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
