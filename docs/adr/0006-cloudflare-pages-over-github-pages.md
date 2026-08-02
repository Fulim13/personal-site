# Hosting on Cloudflare Pages, from a private repository

Status: accepted

The site is deployed by **Cloudflare Pages**, built from a **private** GitHub repository. There is deliberately **no deploy workflow in this repo** — Cloudflare's Git integration clones and builds on every push to `main`, so a GitHub Actions workflow would be a second, redundant build.

## Why not GitHub Pages

GitHub Pages was the original choice and would otherwise still be fine. The deciding constraint is repository visibility. From GitHub's documentation: *"If the account that owns the repository uses GitHub Free or GitHub Free for organizations, the repository must be public."* Publishing Pages from a private repository requires GitHub Pro or above.

Cloudflare Pages has no such restriction — its GitHub App clones with an installation token, so visibility is irrelevant to it. Keeping the source private therefore costs nothing on Cloudflare and about $4/month on GitHub.

Two secondary benefits came along with it, neither of which drove the decision: static assets are served unmetered rather than against GitHub's soft 100 GB/month limit, and every branch and pull request gets a preview deployment — which partially restores what was given up in choosing `draft: true` over a branch-per-post workflow.

## Consequences

- **Build settings live in the Cloudflare dashboard, not in this repo**: build command `npm run build`, output directory `dist`, production branch `main`. A future reader will not find them in version control, which is the main cost of this decision.
- `NODE_VERSION` is pinned via `.nvmrc`, because Cloudflare's default Node has historically lagged behind Astro's minimum.
- `public/CNAME` was removed. It is a GitHub Pages mechanism; Cloudflare resolves the custom domain from its own dashboard and DNS.
- `fulim.tech` must have its nameservers delegated to Cloudflare. The apex record works through CNAME flattening, which a conventional registrar cannot provide.
- Nothing about the build itself is Cloudflare-specific. Moving to Netlify, Vercel or back to GitHub Pages is a matter of pointing another builder at `npm run build` and `dist/`.
