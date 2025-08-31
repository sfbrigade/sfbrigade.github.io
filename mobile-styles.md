# Mobile and Tablet Responsive Plan

## Findings

- __Tailwind setup__: Tailwind v4 via CSS-first in `src/styles/global.css` using `@import "tailwindcss";` and `@plugin "@tailwindcss/typography"`.
- __Typography tokens__: `@theme` defines `--text-sm` through `--text-6xl`. Components like `src/components/BigText.astro` use `text-9xl`, so we should add `--text-7xl`–`--text-9xl` with fluid sizing to avoid overflow on small screens.
- __Page container__: `src/layouts/Page.astro` sets `body` to `max-w-[920px] mx-auto`, matching the 12-col grid (12 cols + 11 gaps = 23 × unit = 920px). We will keep this, and add responsive horizontal padding so mobile has breathing room.
- __Spacing system__: `--unit` is `40px` in `src/styles/global.css`; spacing tokens (e.g., `--spacing-2u`) are based on it. We will make `--unit` responsive so small screens tighten spacing while desktop remains aligned to 920px.
- __BigText layout__: Two-column row with `anchor` prop to swap sides. On mobile, heading should always appear first (top), regardless of `anchor`. We will stack on mobile and apply `md:flex-row` plus conditional `md:flex-row-reverse`.
- __Navigation__: `src/components/HeaderNav.astro` includes a mobile menu but the hamburger button is commented and inside a `md:flex` block, so it never appears on small screens. We'll expose a `md:hidden` button, wire ARIA, and toggle the panel.

## Principles

- __Stack-first__: Default to single column on mobile; switch to rows/grids at breakpoints.
- __Fluid display type__: Use fluid tokens for very large headings to keep the brand feel while preventing overflow.
- __Accessible nav__: Clear hamburger on mobile, adequate tap targets, ARIA attributes, and keyboard-friendly behavior.
- __Consistent spacing__: Drive gaps and section paddings from `--unit`, scaling by breakpoint.

## Implementation Plan

1. __Tokens (now)__
   - Add `--text-7xl`, `--text-8xl`, `--text-9xl` with `clamp()` in `src/styles/global.css`.
   - Make `--unit` responsive: smaller on mobile, 40px on desktop to preserve 920px grid alignment.

2. __Container (now)__
   - Keep `body.max-w-[920px] mx-auto` in `src/layouts/Page.astro`.
   - Add `px-4 sm:px-6` to `body` for mobile/tablet side padding.

3. __Navigation (now)__
   - Make hamburger button visible on mobile (`md:hidden`).
   - Toggle `#mobile-menu` visibility and `aria-expanded`.
   - Ensure menu panel is easy to tap and aligns with the 920px container.

4. __BigText (next)__
   - Stack on mobile with heading first; apply `md:flex-row`/`md:flex-row-reverse` according to `anchor`.
   - Use responsive text sizes (e.g., `text-6xl md:text-8xl`) or the new fluid tokens.

5. __Grids & content (next)__
   - Standardize common grids to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
   - Use `prose` sizing variants and responsive images with `sizes`.

## Acceptance Checklist

- __No horizontal scroll__ at 320–375px.
- __Headings never clip__; big titles wrap cleanly.
- __Nav works on mobile__ (visible button, toggles, ARIA correct).
- __Cards reflow__ 1/2/3 cols at the expected breakpoints.
- __Consistent paddings__ by breakpoint; desktop retains 920px grid alignment.
