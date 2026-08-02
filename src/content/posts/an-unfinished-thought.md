---
title: An unfinished thought
pubDate: 2026-08-02
draft: true
tags:
  - meta
---

This Post exists to prove the draft mechanism works.

You can see it when you run `npm run dev`, and it appears in the blog index with
a `draft` chip next to the date. Run `npm run build` and it vanishes — it is not
in `dist/` at all, and it is absent from the RSS feed and the sitemap.

The repository is private, so this text is visible only to me. That was the
point of the trade: unfinished work lives on `main` rather than on a long-lived
branch that would need rebasing every time the layout changed.

When it is ready, change one word:

```diff
- draft: true
+ draft: false
```

Commit, push, and it is published.
