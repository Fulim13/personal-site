# No web fonts — system font stacks only

Status: accepted

The site downloads **zero font bytes**. Typography is built entirely from system font stacks (sourced from modernfontstacks.com): an old-style serif for headings, a humanist sans for body text, and `ui-monospace` for code. This follows the reference site, samwho.dev, which was verified to contain no `@font-face` rules at all.

We accept **typographic non-determinism** — the exact face a reader sees depends on their operating system — in exchange for eliminating the single heaviest asset a text-led site would otherwise carry, and removing font loading as a source of layout shift entirely.

## Consequences

- Headings render as Iowan Old Style, Palatino, or a comparable old-style serif depending on platform; body text as Seravek, Gill Sans Nova, Ubuntu, or Calibri. **Android falls back to plainer faces than macOS or Windows.** This is accepted, not a defect.
- Any design review must be done on more than one operating system. A layout tuned only against the macOS rendering may not hold elsewhere.
- Adding a single web font later is easy in isolation, but would undo the zero-layout-shift property and should be treated as a reversal of this decision, not a tweak.
