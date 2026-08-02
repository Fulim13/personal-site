# The site ships no client-side JavaScript

Status: accepted — supersedes [ADR-0002](./0002-preact-islands-with-d3-as-a-maths-library.md), amends [ADR-0001](./0001-astro-over-hugo.md)

The site had been designed around **interactive visual essays** in the style of samwho.dev. That requirement was dropped in favour of keeping the site simple. With it goes every reason the front end had a UI framework.

Removed: `@astrojs/preact`, `preact`, `@astrojs/mdx`, `d3-scale`, `d3-shape`, the `src/components/viz/` directory, and the `Figure` wrapper. Posts are **plain `.md`** — the mixed `.md`/`.mdx` glob is gone, because MDX existed only to embed components.

## What "no JavaScript" means here

The rule is **no bundled or network-fetched JavaScript**: no UI framework, no hydration, no `_astro/*.js`, nothing the browser has to go and get. `dist/` contains zero `.js` files and the build should be checked against that.

A small number of `is:inline` snippets in `BaseLayout.astro` are permitted, because they cost one request-free block of bytes each and no dependency:

1. **Theme stamping** (~300 bytes, render-blocking by necessity) — sets `data-theme` before first paint so a chosen theme never flashes.
2. **Theme toggle** — flips and persists the choice.
3. **Code copy buttons** (~600 bytes) — attaches a Copy button to each `pre.astro-code`. Added later, on request; the clipboard has no CSS-only equivalent. If it never runs, no button is created and the code block is unchanged.

Anything beyond snippets of this size — or anything requiring a package — reopens this ADR.

## Consequences

- Runtime dependencies drop to three: `astro`, `@astrojs/rss`, `@astrojs/sitemap`.
- **No page fetches any JavaScript**, not just prose pages. The distinction ADR-0002 was protecting no longer exists.
- **ADR-0001's reasoning no longer holds.** Astro was chosen over Hugo *because* interactive essays needed islands and the npm ecosystem; absent that, Hugo's single-binary, no-`node_modules` argument would have won. We are staying on Astro because it is already built, it is an excellent static generator, and it ships zero JS by default — but a future reader should not mistake ADR-0001 for a still-live justification. If the `node_modules` maintenance burden ever becomes annoying, revisiting Hugo is reasonable and this is the note that says so.
- Adding one interactive figure later means reinstating an integration (`npx astro add preact`) and converting that single Post to `.mdx`. It is not a one-way door — but doing so reopens this decision rather than being a tweak.
