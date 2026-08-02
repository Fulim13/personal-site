import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { excerpt, getPosts } from '../lib/content';
import { site } from '../site.config';

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: `${site.title} — Blog`,
    description: site.description,
    // Astro guarantees context.site is set because `site` is configured.
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: excerpt(post, 300),
      link: `/blog/${post.id}/`,
      categories: [...post.data.tags],
    })),
    customData: '<language>en</language>',
  });
}
