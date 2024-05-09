import { defineConfig } from "astro/config";
import icon from "astro-icon";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  //	site: "https://www.sfcivictech.org/"
  //	base: "",
  site: "https://sfbrigade.github.io",
  base: "/astro-static-site/",
  trailingSlash: "ignore",
  compressHTML: false,
  integrations: [icon({
    include: {
      // Include only specific `fa` icons in the bundle
      fa: ["twitter", "facebook", "linkedin", "github", "slack", "meetup"]
    }
  }), tailwind()]
});