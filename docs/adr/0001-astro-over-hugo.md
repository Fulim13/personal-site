# Astro as the site generator, not Hugo

Status: accepted, but **the premise below no longer holds** — see [ADR-0005](./0005-no-client-side-javascript.md). Interactive essays were dropped, which was the whole reason Astro beat Hugo. We remain on Astro by inertia and because it ships zero JS by default, not because this argument still stands.

The site's primary format is **interactive visual essays** — hand-built, animated explanations in the vein of samwho.dev — not plain prose. We initially chose Hugo for its single-binary, zero-dependency build (its embedded esbuild `js.Build` can bundle TypeScript with no npm at all), which suited the original "as lightweight as possible" brief. We reversed to Astro once interactive essays became the primary format rather than an occasional extra.

## Considered Options

- **Hugo.** Single static binary, no `node_modules`, no upgrade treadmill, effectively no rot. `js.Build` (esbuild, embedded) handles TypeScript bundling per-page. Rejected because the moment an essay imports a visualisation library, esbuild resolves it from `node_modules` anyway — the zero-dependency property silently disappears, and we'd be paying Go-template friction for a benefit we no longer hold.
- **Astro.** Islands are purpose-built for "static page, interactive parts." Full npm ecosystem available (D3 et al.). Ships zero JS on pages that don't opt in.
- **Hand-rolled (~200 lines).** Rejected earlier; unreasonable once per-essay bundling and islands are required.

## Consequences

- We accept a large `node_modules`, a lockfile, and Astro's major-version upgrade cadence. This is a real, ongoing maintenance cost that Hugo would not have incurred.
- "Lightweight" is redefined and narrowed: **the shell and prose pages stay light; interactive essays pay for what they use.** It no longer means a small dependency footprint. For reference, samwho.dev's Bloom Filters essay ships ~663 KB of JavaScript while its shared CSS is ~26 KB with zero web fonts.
- Sidenotes must be produced by a remark/rehype plugin. The reference site's `.footnote-definition` markup is Zola's (pulldown-cmark) convention and will not appear by default.
