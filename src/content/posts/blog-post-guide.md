---
title: Blog Post Guide
pubDate: 2026-08-03
featured: false
unlisted: true
tags:
  - meta
  - reference
description: >-
  Every markdown feature this site supports, rendered live. Keep it open in a
  second tab while you write and copy whatever you need.
---

This post is a live reference. Everything below is rendered by the same
pipeline your posts go through, so what you see here is exactly what you'll
get. The source is at `src/content/posts/blog-post-guide.md` — open it beside
this page and copy whatever you need.

## Headings

Start at `##`. The `#` level is generated from your `title` in the frontmatter,
so writing `#` in the body gives the page two competing titles.

```markdown
## A major section
### A subsection
#### A minor point
```

### This is an h3

Use it for a subdivision of a section.

#### This is an h4

Rarely needed. If you're reaching for h5, the post probably wants splitting up.

## Emphasis and inline formatting

```markdown
*italic*, **bold**, ***both***, `inline code`, ~~struck through~~
```

Renders as: *italic*, **bold**, ***both***, `inline code`, ~~struck through~~.

Inline code is the one you'll use most — wrap any `identifier`, `flag`, or
`file/path.ts` in backticks and it picks up the monospace stack and a subtle
background.

## Links

```markdown
[an external link](https://astro.build)
[a link to another post](/blog/hello-world)
[a link to a tag](/blog/tags/meta)
```

[An external link](https://astro.build), [a link to another
post](/blog/hello-world), and [a link to a tag](/blog/tags/meta). Internal
links start with `/` — no domain, so they keep working if the domain changes.

## Lists

Unordered lists use `-`. Indent by two spaces to nest.

```markdown
- A bullet
- Another bullet
  - A nested one
  - And another
- Back to the top level
```

- A bullet
- Another bullet
  - A nested one
  - And another
- Back to the top level

Ordered lists use `1.` — and you can write `1.` for every item; markdown
numbers them for you.

1. First step
2. Second step
3. Third step
   1. A sub-step
   2. Another sub-step

## Code blocks

Put the language after the opening fence. Highlighting runs **at build time**
via Shiki, so none of the colour costs the reader anything. Hover a block and a
**Copy** button appears in its titlebar.

````markdown
```go
func main() {
	fmt.Println("hello")
}
```
````

Here's Go:

```go
package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("not found")

func Lookup(store map[string]int, key string) (int, error) {
	value, ok := store[key]
	if !ok {
		return 0, fmt.Errorf("lookup %q: %w", key, ErrNotFound)
	}
	return value, nil
}
```

Java:

```java
@Service
public class OrderService {
    private final OrderRepository repository;

    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Order place(OrderRequest request) {
        var order = Order.from(request);
        return repository.save(order);
    }
}
```

TypeScript:

```typescript
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function parsePort(raw: string): Result<number> {
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    return { ok: false, error: `invalid port: ${raw}` };
  }
  return { ok: true, value: port };
}
```

SQL:

```sql
SELECT c.id, c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE c.created_at >= NOW() - INTERVAL '30 days'
GROUP BY c.id, c.name
HAVING COUNT(o.id) > 3
ORDER BY order_count DESC;
```

YAML — handy when you're documenting config:

```yaml
services:
  api:
    image: ghcr.io/example/api:1.4.0
    environment:
      DATABASE_URL: postgres://localhost:5432/app
    depends_on:
      - postgres
```

Shell, for commands:

```bash
npm run dev          # drafts visible
npm run build        # drafts excluded
npx astro check      # type-check frontmatter
```

A diff, which colours added and removed lines:

```diff
- draft: true
+ draft: false
```

Languages worth knowing: `java`, `go`, `ts`, `js`, `tsx`, `python`, `sql`,
`yaml`, `json`, `bash`, `dockerfile`, `html`, `css`, `diff`, `astro`.

## Blockquotes

```markdown
> A quote. It switches to the heading serif with a coloured rule.
```

> Kafka gives you a durable, replayable, partition-ordered log. It does not give
> you global ordering, and it does not make your database writes transactional
> with your consumption.

Blockquotes render in the heading serif with a coloured left rule, so a pulled
quote reads as a different voice rather than as indented prose.

## Tables

```markdown
| Approach | Lookup | Memory |
| --- | --- | --- |
| Array scan | O(n) | Low |
| Hash table | O(1) average | Higher |
```

| Approach | Lookup | Memory | Notes |
| --- | --- | --- | --- |
| Array scan | O(n) | Low | Fine below a few hundred items |
| Binary search | O(log n) | Low | Needs the data sorted |
| Hash table | O(1) average | Higher | Worst case is O(n) |
| B-tree index | O(log n) | Higher | What your database actually does |

Wide tables scroll inside their own box — the page itself never scrolls
sideways.

## Footnotes

```markdown
Constant time, amortised.[^resize]

[^resize]: A resize is O(n), but rarely enough to average out.
```

Hash table lookup is constant time, amortised.[^resize] Kafka's ordering
guarantee is per-partition.[^partition]

Footnotes collect at the foot of the page with backlinks. The definitions can
go anywhere in the file; putting them at the bottom is conventional.

## Images

Put files in `public/images/` and link from the site root:

```markdown
![A diagram of two hash buckets colliding](/images/collision.png)
```

**Always write the alt text.** It's what a screen reader announces, and what
shows if the image fails to load. Describe what the image *says*, not what it
*is* — "two buckets colliding" beats "diagram".

## Horizontal rules

Three hyphens on their own line:

```markdown
---
```

---

That's a rule above this line. Note the exception: `---` at the very top of the
file is frontmatter, not a rule.

## Line breaks

Markdown collapses single newlines. To force a line break inside a paragraph,
end the line with **two spaces**, or use a blank line to start a new paragraph.

## What isn't supported

- **Components.** This site has no UI framework, so there's no `.mdx` and no
  embedded interactive widgets.
- **Raw HTML** works but is rarely needed. Prefer markdown.
- **Task lists** (`- [ ]`) render as list items with literal brackets. Not worth
  using here.

## Frontmatter

Every post starts with a frontmatter block. The full field list is in
[Updating This Site](/blog/updating-this-site), but the short version:

```yaml
---
title: Blog Post Guide      # required
pubDate: 2026-08-03         # required
featured: true              # optional — star on the index, shown on the home page
draft: false                # optional — true hides it from the built site
tags:                       # optional
  - meta
  - reference
description: >-             # optional — falls back to your first paragraph
  One sentence for the blog index and the social preview card.
---
```

[^resize]: Growing the table is O(n), but it happens rarely enough that the
    average cost per insert stays constant.

[^partition]: Messages are ordered within a single partition. Across
    partitions there is no ordering at all — a topic with twelve partitions is
    twelve independent logs sharing a name.
