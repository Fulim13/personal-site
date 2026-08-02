# The site has two deliberate visual registers

Status: accepted

The site is a portfolio and a writing archive in one. These serve different readers with different goals, so they are styled differently on purpose: **Home and Projects are playful** (illustrated, colourful, trading-card treatment of the tech stack), while **`/blog` is austere** — the restrained, near-monochrome, typography-led reading experience modelled on samwho.dev. The navigation boundary is the signal that the register has changed.

## Considered Options

- **Playful everywhere.** Rejected: it discards the long-form reading experience that the whole design was specified around.
- **Austere everywhere**, with the tech stack as a plain grouped list. Rejected by the author, who wanted the trading-card idea.
- **Card *structure* in the site's own restrained palette** — keeping the conceit but not the colour. Rejected in favour of a fuller separation.

## Consequences

- Two sets of design tokens must be maintained. Shared primitives (type scale, spacing, the grey ramp, dark-mode variables) stay common; the accent palette and ornament diverge by zone.
- **The zone boundary must be legible.** If a reader can't tell they've crossed from portfolio into writing, the site reads as inconsistent rather than deliberate. Navigation, page header treatment, and background should all shift together at `/blog`.
- Pokémon's trade dress is trademarked. Cards must be an original stylisation — the card *format* (portrait, type, stats, flavour line), not a replica of the real one.
- The blog's zero-JavaScript property is unaffected: the playful zone's weight is confined to Home and Projects.
