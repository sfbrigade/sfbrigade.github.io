# sfcivictech.org

A quick migration of the existing site content into a lightly-styled Astro build.


## ✅ To do

- [ ] Compress HTML in build
- [ ] Set `base` tag by looking at the current domain name?  Different configs?
- [ ] Restore dark mode when some text colors are fixed
- [ ] Add more interesting header fonts
- [X] Add SEO metadata to all pages
- [X] Fix favicon
- [X] Clean up jekyll code from old posts
- [X] Always show the first image in a blog post as the thumbnail
- [X] Don't show the image key in the frontmatter at the top of the post if it's used within the post
- [X] Make nav bar responsive on narrow screens
- [X] Set or improve blog descriptions
- [X] Replace img with Image in post markdown


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
