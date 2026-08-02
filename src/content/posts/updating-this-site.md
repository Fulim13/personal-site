---
title: Updating This Site
pubDate: 2026-08-03
featured: false
unlisted: true
tags:
  - meta
  - reference
description: >-
  Where every piece of content lives, what each frontmatter property does, and
  how to add a job, a qualification, a certification or a technology.
---

Everything on this site is a file. There's no dashboard and no database —
publishing is committing to `main` and pushing. This post is the map.

If you want the markdown syntax instead, that's in the [Blog Post
Guide](/blog/blog-post-guide). For how it reaches the internet, see [Deploying
to Cloudflare Pages](/blog/deploying-to-cloudflare).

## Where things live

```text
src/
├── content/
│   ├── posts/            ← blog posts (.md)
│   └── projects/         ← one file per project (.md)
├── data/
│   ├── experience.yaml   ← work, education, certifications
│   └── tech.yaml         ← the stack cards on the home page
├── content.config.ts     ← the schemas — edit to add a new property
└── site.config.ts        ← your name, tagline, social links, nav
```

Two rules that apply everywhere:

1. **The filename becomes the URL.** `src/content/posts/why-kafka.md` serves at
   `/blog/why-kafka`. Use lowercase and hyphens, and don't rename after
   publishing — that breaks every link anyone has shared.
2. **The build validates everything.** Miss a required property or use the wrong
   type and `npm run build` fails naming the file and the field. That's on
   purpose; a loud failure beats a page silently rendering blank.

## Blog post properties

```yaml
---
title: What Kafka actually guarantees
pubDate: 2026-07-18
updatedDate: 2026-08-01
featured: true
draft: false
tags:
  - kafka
  - distributed systems
description: >-
  "Exactly once" is doing a lot of work in that sentence.
---
```

| Property | Required | Type | What it does |
| --- | --- | --- | --- |
| `title` | **yes** | text | The `<h1>` and the browser tab |
| `pubDate` | **yes** | date | `YYYY-MM-DD`. Sorts the index and the RSS feed |
| `updatedDate` | no | date | Renders as "updated 1 August 2026" |
| `featured` | no | true/false | Star on the blog index, and shown under *Selected writing* on the home page |
| `draft` | no | true/false | `true` hides it from the built site entirely |
| `unlisted` | no | true/false | `true` builds the page but keeps it out of every listing |
| `tags` | no | list | Each tag gets its own page and a coloured chip |
| `description` | no | text | The blog index summary and the social card. Falls back to your opening paragraph |

A few things worth knowing:

- **Use `featured` sparingly.** If everything is featured, nothing is.
- **Write multi-word tags with spaces**, not hyphens — `distributed systems`
  displays as "Distributed systems" and still slugs to
  `/blog/tags/distributed-systems`. Writing `distributed-systems` gives you the
  ugly "Distributed-systems" on screen.
- **`description` supports multi-line values** with `>-` followed by indented
  lines, as above.

### Drafts

Set `draft: true` and the post stays visible on `localhost` but disappears from
the production build, the RSS feed and the sitemap. Publishing is a one-word
change:

```diff
- draft: true
+ draft: false
```

The repository is private, so a draft is visible only to you and to anyone you
grant access. To keep a file out of the build entirely as well, prefix its name
with an underscore (`_scratch.md`) — the content glob skips it.

### Unlisted posts

There's a third state between draft and published. `unlisted: true` **builds
the page and serves it at its normal URL**, but keeps it out of everything that
lists posts:

| | `draft: true` | `unlisted: true` | neither |
| --- | --- | --- | --- |
| Has a URL in production | no | **yes** | yes |
| Blog index | no | no | yes |
| Tag pages and counts | no | no | yes |
| RSS feed | no | no | yes |
| Sitemap | no | no | yes |
| `noindex` for search engines | — | **yes** | no |

This post and the [Blog Post Guide](/blog/blog-post-guide) both use it: they're
reference material worth linking to, but they'd be noise on the blog index and
in the feed.

Two consequences worth knowing. An unlisted post renders its tags as **plain
chips rather than links**, because tag pages are built from listed posts only —
a tag used solely by unlisted posts has no page to link to. And an unlisted post
carries a quiet banner at the top, so future-you doesn't wonder why it never
appeared on the index.

Unlisted is not private. The page is on the public internet and anyone with the
link can read it — it is hidden from *navigation*, not from people. Only `draft`
keeps something off the web entirely.

## Project properties

One markdown file per project in `src/content/projects/`. Unlike posts, the
body is expected — the prose is what makes a portfolio worth reading rather
than a list of repository links.

```yaml
---
title: Pixel Sorter
blurb: A browser tool that sorts image pixels along arbitrary paths.
year: 2025
featured: true
draft: false
tech:
  - TypeScript
  - Canvas
repo: https://github.com/Fulim13/pixel-sorter
url: https://pixel-sorter.example.com
post: how-pixel-sorting-works
---
```

| Property | Required | Type | What it does |
| --- | --- | --- | --- |
| `title` | **yes** | text | Card heading and page title |
| `blurb` | **yes** | text | One line, shown on the projects grid |
| `year` | **yes** | number | Sorts the grid. A number, not a date |
| `tech` | no | list | Coloured chips on the card |
| `repo` | no | URL | Adds a **Source** link |
| `url` | no | URL | Adds a **Live** link |
| `post` | no | text | A post filename without `.md` — adds **Read the write-up** |
| `featured` | no | true/false | Sorts to the front of the grid |
| `draft` | no | true/false | Hides it |

Projects have **no `pubDate`**. They sort by `featured` first, then `year`
descending.

`repo` and `url` must be full URLs including `https://` — the schema rejects a
bare domain.

## Adding a job

`src/data/experience.yaml` holds three different things, separated by `kind`.
The home page renders one timeline per kind.

```yaml
- id: ifast-it-specialist
  kind: work
  company: iFAST Global Hub AI
  role: IT Specialist
  employment: Full-time
  start: 2025-08
  end: 2026-07
  location: Kuala Lumpur
  blurb: >-
    One or two sentences for someone outside the company.
  highlights:
    - Something you shipped, with a number attached if you have one.
  tech:
    - Angular
    - Java
```

| Property | Required | What it does |
| --- | --- | --- |
| `id` | **yes** | Unique across the file. Never displayed |
| `kind` | no | `work` (default), `education`, or `certification` |
| `company` | **yes** | Employer, institution, or issuing body |
| `role` | **yes** | Job title, qualification, or certificate name |
| `employment` | no | `Full-time`, `Internship`, `Contract`… |
| `start` | **yes** | `YYYY-MM`, or `YYYY` where only the year matters |
| `end` | no | Omit for a role you still hold |
| `location` | no | Shown in the meta line |
| `blurb` | no | A sentence or two |
| `highlights` | no | Bullet list. Two or three at most |
| `tech` | no | Coloured chips |
| `url` | no | Credential link — certifications only |

Three behaviours worth knowing:

**Durations are computed, never typed.** `2025-08` to `2026-07` renders as
"1 yr", counted inclusively the way LinkedIn does. Omit `end` and it renders
"Present" with a green marker, counting to today.

**Two roles at one employer group automatically.** Consecutive entries sharing
the same `company` string collapse under one heading with a combined total, so
a promotion reads as a progression rather than two unrelated jobs. Nothing to
configure — just spell the company identically.

**File order doesn't matter.** Each timeline sorts newest-first, with ongoing
roles at the top.

### Adding a qualification

```yaml
- id: tarumt-degree
  kind: education
  company: Tunku Abdul Rahman University of Management and Technology
  role: Bachelor of Software Engineering
  start: 2023
  end: 2025
```

Bare years need no quotes. Education entries deliberately show **no duration** —
"2 yrs 1 mo" is not how anyone describes a degree.

### Adding a certification

```yaml
- id: aws-solutions-architect
  kind: certification
  company: Amazon Web Services
  role: AWS Certified Solutions Architect
  start: 2026-08
  url: https://www.credly.com/badges/your-badge-id
```

`start` is the issue date and renders as "Issued Aug 2026". `end` is ignored.
Adding `url` turns the title into a link to the credential.

## Adding to the stack

`src/data/tech.yaml`. Each entry becomes one card on the home page.

```yaml
- id: kafka
  name: Apache Kafka
  type: messaging
  glyph: 📨
  level: 4
  years: 3
  flavour: A log you can replay, which fixes more outages than it causes.
  featured: true
```

| Property | Required | What it does |
| --- | --- | --- |
| `id` | **yes** | Unique across the file |
| `name` | **yes** | Shown on the card |
| `type` | **yes** | One of the ten below. Sets the card's accent colour |
| `glyph` | **yes** | One or two characters, or an emoji |
| `level` | **yes** | `1`–`5`, drawn as pips. 5 means you could teach it |
| `years` | no | Small figure next to the name |
| `flavour` | **yes** | The italic line at the bottom |
| `featured` | no | Adds a subtle foil tint. Three or four at most |

**The ten types**, each with its own colour:

| | | |
| --- | --- | --- |
| `language` | `framework` | `runtime` |
| `data` | `messaging` | `infra` |
| `tooling` | `testing` | `design` |
| `practice` | | |

Anything else fails the build with a list of the valid options.

`glyph` is deliberately a character rather than an image, so the page stays
asset-free — no logo files to download, nothing to go stale when a company
rebrands. Two-letter abbreviations (`TS`, `Go`) work as well as emoji.

Cards group by type automatically, then sort by level. File order is ignored.

> The `flavour` line is the part people actually read. "Fast until someone
> stores a two-megabyte JSON blob in it" tells a reader more about your
> experience than any number of pips.

### Adding an eleventh type

Two edits. Add the name to `TECH_TYPES` in `src/content.config.ts`:

```typescript
export const TECH_TYPES = [
  'language',
  'framework',
  // …
  'security',
] as const;
```

Then give it a colour in `src/styles/portfolio.css`:

```css
.tech-card[data-type='security'] { --card-accent: var(--accent-teal); }
```

## Changing your name and links

`src/site.config.ts` holds everything about you:

```typescript
export const site = {
  author: 'Fu Lim',
  title: 'Fu Lim',
  tagline: 'Backend engineer',
  description: '…',
  startYear: 2026,

  socials: [
    { label: 'GitHub', href: 'https://github.com/Fulim13', icon: 'github' },
    { label: 'LinkedIn', href: '…', icon: 'linkedin' },
  ],

  nav: [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Projects', href: '/projects' },
  ],
} as const;
```

`icon` must match a name defined in `src/components/Icon.astro`. To add a third
social link you'll need to add its icon path there too.

**Your intro paragraph isn't in this file.** It's prose, so it lives in the
markup — edit the `<p class="hero__intro">` block in `src/pages/index.astro`.

## Publishing

```bash
npm run dev        # http://localhost:4321 — drafts visible
npx astro check    # type-check everything, including frontmatter
npm run build      # production build; drafts excluded
```

Then commit and push to `main`. Cloudflare Pages builds and deploys it, usually
within a couple of minutes. There is no other step — the whole pipeline is
described in [Deploying to Cloudflare Pages](/blog/deploying-to-cloudflare).

If the build fails, read the error — it names the file and the property. Nearly
every failure is a missing required field, a date in the wrong shape, or a
`type` that isn't in the allowed list.
