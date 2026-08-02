---
title: This site
blurb: A personal site with two deliberate visual registers — a playful portfolio and an austere reading experience.
year: 2026
featured: true
tech:
  - Astro
  - TypeScript
repo: https://github.com/Fulim13/personal-site
url: https://fulim.tech
---

The site you are reading. It is deliberately two things at once, and the seam is
on purpose.

## Two registers

The portfolio — home and this page — is playful: colour, cards, a timeline. The
blog is austere: a 780px measure, an old-style serif for headings, near
monochrome, no ornament. The navigation boundary is the signal that the register
has changed.

Splitting them was the riskiest decision in the build. Done carelessly it reads
as inconsistency; the mitigation is that the shift is total and simultaneous —
the top stripe thins, the measure narrows, the colour drains — so it reads as a
door rather than a mistake.

## Constraints

- **No web fonts.** Zero font bytes. Every face is a system stack, so there is
  no layout shift and nothing to download.
- **No JavaScript.** Not "a little" — the only script on any page is a
  ~300-byte inline snippet that prevents a flash of the wrong theme.
- **Publishing is `git push`.** No dashboard, no CMS, no build step to remember.

## What I would do differently

Decide what the site is *for* before choosing the stack. This one was designed
around interactive essays, picked up a UI framework to support them, and then
dropped the essays — leaving a build that was heavier than the site needed. The
framework came back out. Deciding first would have been cheaper than deciding
twice.
