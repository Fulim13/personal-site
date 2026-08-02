# Project notes

A personal portfolio + writing archive on Astro. Publishing is `git push` to
`main`; Cloudflare Pages builds and deploys from a private GitHub repository.
There is no CI workflow in this repo by design — see ADR-0006.

## Read these first

- [CONTEXT.md](./CONTEXT.md) — the glossary. Use these words in code and prose.
  Notably: a piece of writing is a **Post** (never "article" or "essay").
- [docs/adr/](./docs/adr/) — why the stack is what it is. Check before
  proposing a change to Astro, the build, fonts, or the two-zone design.
  ADR-0002 is superseded; ADR-0005 is the live one.
- [README.md](./README.md) — how to author content.

## Invariants — do not break without saying so

1. **No client-side JavaScript, anywhere.** The only script on any page is the
   ~300-byte inline theme snippet in `BaseLayout.astro`. There is no UI
   framework installed; adding one reopens ADR-0005 rather than being a tweak.
2. **Posts are plain `.md`.** MDX went out with the interactive content.
3. **No web fonts.** System font stacks only (ADR-0004).
4. **Two visual registers.** Portfolio (`/`, `/projects`) is playful; the blog
   (`/blog`) is austere. Shared fundamentals in `tokens.css`/`base.css`,
   zone-specific ornament in `portfolio.css`/`writing.css` (ADR-0003).

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and
`astro dev logs`.

Run `npx astro check` before committing. Nothing runs it for you — there is
no CI — so a type error reaches `main` unless you check locally.

Drafts (`draft: true`) are visible in `dev` and excluded from `build`. To verify
draft filtering still works, run `npm run build` and grep `dist/`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
