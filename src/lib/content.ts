import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Project = CollectionEntry<'projects'>;

/**
 * Drafts live on `main` next to published work and are filtered out of
 * production builds only. `astro dev` and `astro preview` of a dev build show
 * them, so you can read your work in situ before publishing.
 */
const includeDrafts = !import.meta.env.PROD;

const byNewest = (a: Post, b: Post) =>
  b.data.pubDate.getTime() - a.data.pubDate.getTime();

/**
 * Every Post that should get a URL — including unlisted ones. Use this for
 * route generation only.
 */
export async function getRoutablePosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) =>
    includeDrafts ? true : data.draft === false,
  );
  return posts.sort(byNewest);
}

/**
 * Posts that appear in listings: the blog index, tag pages and counts, the RSS
 * feed, and the home page. Unlisted Posts are reachable by URL but never
 * surface here.
 */
export async function getPosts(): Promise<Post[]> {
  return (await getRoutablePosts()).filter((post) => !post.data.unlisted);
}

/** Featured Posts first, then the rest — both newest-first within their group. */
export async function getPostsGrouped(): Promise<{
  featured: Post[];
  rest: Post[];
}> {
  const posts = await getPosts();
  return {
    featured: posts.filter((p) => p.data.featured),
    rest: posts.filter((p) => !p.data.featured),
  };
}

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', ({ data }) =>
    includeDrafts ? true : data.draft === false,
  );
  return projects.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return b.data.year - a.data.year;
  });
}

/** Every tag in use, with counts, most-used first. */
export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Post descriptions are optional (Q16), so when one is missing we derive a
 * short extract from the body for the meta description, the OG card and the
 * blog index. Strips frontmatter leftovers, MDX imports, headings, and markup.
 */
export function excerpt(post: Post, maxLength = 180): string {
  if (post.data.description) return post.data.description;

  const body = post.body ?? '';
  const firstProse = body
    .replace(/^import\s.+$/gm, '')
    .replace(/^export\s.+$/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/^#{1,6}\s.+$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block.length > 0);

  if (!firstProse) return '';

  const plain = firstProse
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= maxLength) return plain;
  return plain.slice(0, plain.lastIndexOf(' ', maxLength)).trimEnd() + '…';
}

/** "typescript, web dev" -> "typescript", "web-dev" for URLs. */
export function tagSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

/** Display form: tags are authored lowercase, shown with a capital. */
export function tagLabel(tag: string): string {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

const TONE_COUNT = 9;

function hashTone(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return (hash % TONE_COUNT) + 1;
}

let tagTones: Map<string, number> | null = null;

/**
 * Colour slot (1–9) per blog tag, resolved so that no two tags collide while
 * there are nine or fewer of them. Each tag starts from a hash of its name — so
 * the colour is stable as the site grows — and only moves to the next free slot
 * if that one is already taken. A pure hash gave "meta" and "kafka" the same
 * colour, which looked like a bug.
 */
export async function getTagTones(): Promise<Map<string, number>> {
  if (tagTones) return tagTones;

  const map = new Map<string, number>();
  const used = new Set<number>();

  for (const { tag } of await getTags()) {
    let tone = hashTone(tag);
    for (let i = 0; i < TONE_COUNT && used.has(tone); i++) {
      tone = (tone % TONE_COUNT) + 1;
    }
    used.add(tone);
    map.set(tag, tone);
  }

  tagTones = map;
  return map;
}

/**
 * Colour slot for a technology chip. Purely hash-based: there are far more
 * technologies than colours, so collisions are unavoidable and harmless here —
 * these are decoration, not a legend.
 */
export function techTone(name: string): number {
  return hashTone(name.toLowerCase());
}
