# Visualisations are Preact islands; D3 is used for maths only

Status: **superseded by [ADR-0005](./0005-no-client-side-javascript.md)** — interactive content was dropped from the site, and with it Preact, MDX and D3. Retained for the record; nothing below is still in force.

Visualisations are written as Astro islands using **Preact with `preact/compat`**, so they are authored in the React API the author already knows. **D3 is imported à la carte for its maths modules only** (`d3-scale`, `d3-shape`, `d3-force`, `d3-interpolate`); rendering is done by Preact, or by `<canvas>` behind a ref where imperative control is needed. `d3.select()` must not be used to mutate DOM that Preact owns.

## Considered Options

- **No framework** (plain TypeScript + canvas/SVG, as samwho.dev does). Genuinely the lightest, and the right answer had we stayed on Hugo. Rejected as inconsistent with [ADR-0001](./0001-astro-over-hugo.md) — we took on Astro's dependency cost specifically to get islands and the npm ecosystem, so declining to use them wastes the purchase.
- **Svelte islands.** Best technical fit for state-that-animates, and a small runtime. Rejected because the author has existing React fluency, which outweighs the abstract fit — essays are months of work each, and fluency compounds.
- **React proper.** Rejected in favour of Preact on reversibility, not size: moving Preact → React is a one-line config change with no code edits, whereas nobody migrates a working React site back to Preact to save ~40 KB. Given two close options, we took the reversible one.

## Consequences

- ~40 KB gzipped saved on every Post carrying a Visualisation, versus React + ReactDOM.
- **React-only libraries that reach into internals — framer-motion, visx, react-spring — may not work.** If one becomes necessary, switch the alias in `astro.config.mjs` to React proper; this is the expected and accepted exit.
- Keeping D3 off the DOM avoids the well-known React/D3 ownership conflict, at the cost of hand-writing render logic that `d3.select()` would otherwise generate.
