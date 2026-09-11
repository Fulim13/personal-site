# fulim.tech

Personal site and writing archive for Fu Lim. Astro, no UI framework, no web
fonts, no fetched JavaScript. Publishing is `git push` — Cloudflare Pages builds
and deploys from `main`.

```sh
npm install
npm run dev        # http://localhost:4321 — drafts visible
npx astro check    # type-check; nothing runs this for you
npm run build      # production build; drafts excluded
npm run preview    # serve dist/ to check the real build
```

---

## Reference guides

The documentation lives on the site itself, as **unlisted posts** — real pages
at real URLs, kept off the blog index, the RSS feed, the sitemap and search
results. Read them with `npm run dev`, or at these links once deployed.

| Guide | What it covers |
| --- | --- |
| [Blog Post Guide](https://fulim.tech/blog/blog-post-guide) | Every markdown feature, rendered live beside its source — headings, code blocks, tables, footnotes, images |
| [Updating This Site](https://fulim.tech/blog/updating-this-site) | Where content lives, every frontmatter property for posts and projects, and how to add a job, qualification, certification or technology |

Locally these are `/blog/blog-post-guide` and `/blog/updating-this-site`.

## Project docs

| File | What it is |
| --- | --- |
| [CONTEXT.md](./CONTEXT.md) | The glossary. What "Post", "Tech Card" and "Featured" mean here |
| [AGENTS.md](./AGENTS.md) | Invariants and conventions, for humans and coding agents |
| [docs/adr/](./docs/adr/) | Why the stack is what it is, including the decisions that were reversed |

---
