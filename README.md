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
| [Deploying to Cloudflare Pages](https://fulim.tech/blog/deploying-to-cloudflare) | The deploy pipeline, Cloudflare build settings, and what delegating nameservers actually means |

Locally these are `/blog/blog-post-guide`, `/blog/updating-this-site` and
`/blog/deploying-to-cloudflare`.

## Project docs

| File | What it is |
| --- | --- |
| [CONTEXT.md](./CONTEXT.md) | The glossary. What "Post", "Tech Card" and "Featured" mean here |
| [AGENTS.md](./AGENTS.md) | Invariants and conventions, for humans and coding agents |
| [docs/adr/](./docs/adr/) | Why the stack is what it is, including the decisions that were reversed |

---

## TODO

Nothing here blocks a deploy, but the first group is visible to anyone who
visits.

### Placeholder content on public pages

- [ ] **`src/content/projects/jpeg.md`** renders a literal **TODO** block on a
      public page. Write the blurb and body, or delete the file.
- [ ] **Job blurbs** in `src/data/experience.yaml` all still say *"Write one or
      two sentences here for someone outside the company."* — three of them.
- [ ] **Hero intro paragraph** in `src/pages/index.astro`
      (`<p class="hero__intro">`) is written in my voice, not yours. Two or
      three sentences.
- [ ] **`tagline`** in `src/site.config.ts` is `'Backend engineer'` — a guess
      from your stack. Confirm or change.
- [ ] **Tech card `level`, `years` and `flavour`** in `src/data/tech.yaml` are
      invented for all 14 entries. Only you know the real numbers.

### Facts to confirm

- [ ] **Enlliance dates.** You wrote *"Oct 2021 – Jan 2021"*, which ends before
      it starts. `experience.yaml` assumes **Jan 2022**.
- [ ] **AWS credential link.** `url` is commented out on the certification entry
      in `experience.yaml`; add the Credly badge URL when you have it.
- [ ] **`repo` in `src/content/projects/this-site.md`** points at
      `github.com/Fulim13/personal-site`. Update it to the repository you
      actually create — and remove it if the repo stays private, since a link to
      a private repo 404s for visitors.

### Deployment

- [ ] Create the private GitHub repository and push.
- [ ] Connect it to Cloudflare Pages (build settings, and `NODE_VERSION=22`).
- [ ] Delegate `fulim.tech` nameservers to Cloudflare.
- [ ] Add `fulim.tech` under the project's **Custom domains**.

All four are walked through in
[Deploying to Cloudflare Pages](https://fulim.tech/blog/deploying-to-cloudflare).

### Sample content to delete once you have your own

- [ ] `src/content/posts/hello-world.md`
- [ ] `src/content/posts/what-kafka-actually-guarantees.md`
- [ ] `src/content/posts/an-unfinished-thought.md` (the draft demo)
- [ ] `src/content/projects/this-site.md`

### Deferred by choice

Each was considered and postponed, not forgotten.

- [ ] **Per-post Open Graph images.** Currently one static card
      (`public/og-default.png`, regenerate with
      `python3 scripts/make-og-image.py`). Per-post cards would be a dependency
      and a route, with no content changes.
- [ ] **Newsletter.** Deferred until there are three or four posts worth
      subscribing to.
- [ ] **Analytics and comments.** Both declined. Cloudflare Web Analytics is
      cookieless and one script if you change your mind.
- [ ] **An `/about` page.** The home page intro covers it for now.
