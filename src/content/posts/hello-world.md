---
title: Hello, world
pubDate: 2026-08-02
tags:
  - meta
---

This is an ordinary Post. It is a plain markdown file, and it **fetches no
JavaScript at all** — the only scripts are a few hundred bytes inlined in the
page, for the theme and the code-block copy buttons.

That is the deal the whole site is built around: it is HTML and CSS, and the
reading experience is the feature.

## What you get for free

Standard markdown works as you would expect. Code blocks are highlighted by
Shiki at build time, using Catppuccin Latte in light mode and Mocha in dark:

```go
func Excerpt(body string, maxLength int) string {
	plain := strings.Join(strings.Fields(body), " ")
	if len(plain) <= maxLength {
		return plain
	}
	return plain[:strings.LastIndex(plain[:maxLength], " ")] + "…"
}
```

Footnotes land at the foot of the page, with proper backlinks.[^1]

> Blockquotes switch to the heading serif and pick up a coloured rule, which
> makes a pulled quote read as a different voice rather than as indented prose.

| Thing | Weight |
| --- | --- |
| This page's CSS | a few KB |
| This page's JS | under 1 KB, inline |
| Web fonts | none |

## Publishing

There is no publish button. Commit this file to `main` and push; Cloudflare
Pages builds the site and serves it. To hide something while you
work on it, set `draft: true` in the frontmatter — it stays visible locally and
disappears from the production build.

[^1]: Like this one. The `[^1]` syntax is standard markdown, so these Posts stay
    readable in any editor and on GitHub itself.
