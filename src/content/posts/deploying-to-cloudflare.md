---
title: Deploying to Cloudflare Pages
pubDate: 2026-08-03
featured: false
unlisted: true
tags:
  - meta
  - reference
description: >-
  How this site gets from a git push to fulim.tech — including what delegating
  nameservers actually means and where to click.
---

This site is hosted on **Cloudflare Pages**, built from a private GitHub
repository. There is no CI workflow in the repo: Cloudflare's Git integration
*is* the deployment mechanism.

```text
git push origin main
  └→ Cloudflare's GitHub App webhook fires
     └→ clone (installation token, so a private repo is fine)
        └→ npm ci
           └→ npm run build
              └→ upload dist/
                 └→ live on fulim.tech          ~1–2 min
```

## Why not GitHub Pages

GitHub Pages was the original choice and would work fine — except for one line
in GitHub's documentation:

> If the account that owns the repository uses GitHub Free or GitHub Free for
> organizations, the repository must be public.

Publishing Pages from a private repository needs GitHub Pro. Cloudflare has no
such restriction: its GitHub App clones with an installation token, so
repository visibility is irrelevant to it. Private hosting costs nothing.

Two things came along for free: static assets are served **unmetered** rather
than against GitHub's soft 100 GB/month limit, and every branch gets a preview
deployment.

## Part 1 — Push the repository

Create a **private** repository on GitHub. The name does not matter — Cloudflare
serves the custom domain, so there is no `username.github.io` requirement.

```bash
git add -A
git commit -m "Initial site"
git remote add origin https://github.com/Fulim13/<repo>.git
git push -u origin main
```

## Part 2 — Connect Cloudflare Pages

**Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.**

You will be asked to install the **Cloudflare GitHub App**. Choose *Only select
repositories* and pick this one — it does not need access to anything else.

Then set the build configuration:

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |
| Root directory | `/` |

Add one environment variable:

| Name | Value |
| --- | --- |
| `NODE_VERSION` | `22` |

There is a committed `.nvmrc` that says the same thing, but Cloudflare's default
Node has historically lagged behind Astro's minimum of 22.12, and the
environment variable is the reliable one. Skipping it produces a first build
that fails with an unhelpful syntax error.

Save, and the first deployment runs immediately. It will land on a
`*.pages.dev` URL — that works right away, before any DNS is involved.

## Part 3 — Delegating nameservers

This is the step that sounds more mysterious than it is.

**What it means.** When someone types `fulim.tech`, their computer asks the
internet "who is in charge of this domain?" The answer is currently *your
registrar* — the company you bought the domain from. Delegating nameservers
changes that answer to *Cloudflare*, so Cloudflare gets to decide what
`fulim.tech` points at.

**Why it is needed.** The apex domain — `fulim.tech` with no `www` — cannot use
a `CNAME` record. That is a rule of DNS itself, not a limitation of any
provider. Cloudflare works around it with **CNAME flattening**, which resolves
the target and serves the resulting addresses as if they were `A` records. That
only works if Cloudflare is answering for the domain.

### Step by step

**1. Add the domain to Cloudflare.**

Dashboard → **Add a site** → type `fulim.tech` → choose the **Free** plan.
Cloudflare scans your existing DNS records and copies them. Check that list
before continuing — if you have email on this domain, the `MX` records must
appear there, or mail will stop when the switch takes effect.

**2. Copy the two nameservers Cloudflare gives you.**

They look like this, and the words differ for every account:

```text
gina.ns.cloudflare.com
rick.ns.cloudflare.com
```

**3. Change them at your registrar.**

Log in where you bought the domain. Find the domain and look for a section
called **Nameservers**, **DNS**, or **Domain settings**. It will currently be
set to the registrar's own defaults — something like `ns1.yourregistrar.com`.

Switch it to **Custom nameservers** and replace *both* entries with the two
Cloudflare gave you. Remove the registrar's originals; do not leave them
alongside. Save.

**4. Wait.**

Cloudflare emails you when the domain becomes **Active**, usually within
minutes, occasionally up to 24 hours. Nothing else can proceed until then. You
can check yourself:

```bash
dig +short NS fulim.tech
```

Once that prints the two `ns.cloudflare.com` names, delegation has taken effect.

## Part 4 — Point the domain at the site

Back in the Pages project: **Custom domains → Set up a domain →** enter
`fulim.tech`.

Because Cloudflare now runs the DNS, it creates the record itself — there is
nothing to copy and paste. Repeat with `www.fulim.tech` if you want the `www`
form to work too; Cloudflare will redirect it to the apex.

TLS certificates are issued automatically. Give it a few minutes before
worrying that `https://` is not working yet.

## What you get from then on

- **Every push to `main` deploys.** No workflow file, no secrets, no API token.
- **Preview deployments** for every branch and pull request, each on its own
  URL — useful for reading a long draft in place before merging it.
- **One-click rollback** from the deployment history if a push breaks the site.

Drafts behave identically on Cloudflare to how they behave locally: the filters
key off `import.meta.env.PROD`, which `astro build` sets regardless of who runs
it.

## Things that go wrong

**The build fails with a syntax error on the first try.** Node is too old. Set
`NODE_VERSION` to `22`.

**The domain shows a Cloudflare error page.** DNS has propagated but the Pages
custom domain is not attached yet. Finish Part 4.

**`https://` warns about the certificate.** It has not been issued yet. Wait,
then reload.

**Email stopped working.** The `MX` records were not carried over in Part 3,
step 1. Re-add them under **DNS → Records** in Cloudflare.

**Nothing type-checks the code any more.** Deleting the GitHub Actions workflow
removed the only thing running `astro check`. Cloudflare runs `npm run build`,
which catches content-schema errors but not TypeScript ones. Run it yourself:

```bash
npx astro check
```
