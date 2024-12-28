# sfcivictech.org

The SF Civic Tech website, built using Astro and served on GitHub Pages.  Currently, lightly styled with Pico CSS, but it's awaiting a talented designer to give it a full makeover.


## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |


## 🚀 Deploy

On every commit to `main`, the static site is re-built using [Astro](https://astro.build) and then deployed to GitHub Pages using the [deploy.yml](.github/workflows/deploy.yml) workflow.  Pull requests will trigger the build as well, so you can check for CI/CD issues, but the site will not be deployed.


## 📦 Packages

The `astro-icon` package is currently pinned to v1.1.1, due to an issue with [how it handles](https://github.com/natemoo-re/astro-icon/issues/249) the `viewBox` attribute.
