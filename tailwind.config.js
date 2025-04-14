/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      // Theme extensions are now primarily handled via CSS variables in global.css
      // Keep this extend block if you have other non-variable extensions or plugins need it.
    },
  },
  plugins: [],
};
