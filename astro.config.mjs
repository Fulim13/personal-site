// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

/**
 * Posts marked `unlisted: true` are reachable at their URL but must stay out of
 * the sitemap, alongside the `noindex` tag the page itself carries.
 *
 * The frontmatter is read straight off disk because astro.config.mjs runs
 * before the content layer exists and cannot import `astro:content`.
 */
function unlistedPostPaths() {
  const dir = 'src/content/posts';
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .filter((file) => {
      const source = fs.readFileSync(path.join(dir, file), 'utf8');
      const frontmatter = source.split('---')[1] ?? '';
      return /^unlisted:\s*true\s*$/m.test(frontmatter);
    })
    .map((file) => `/blog/${file.replace(/\.md$/, '')}/`);
}

const UNLISTED = unlistedPostPaths();

// The canonical origin. Used for RSS item links, the sitemap, canonical tags
// and the Open Graph URL — nothing else in the codebase refers to the domain,
// so this is the single place to change it.
//
// No `base` is needed: the site is served from the root of the custom domain.
const SITE = 'https://fulim.tech';

// https://astro.build/config
export default defineConfig({
  site: SITE,

  // No UI framework integration. The site uses only the small inline scripts
  // in BaseLayout.astro. See docs/adr/0005.
  integrations: [
    sitemap({
      filter: (page) => !UNLISTED.some((unlisted) => page.endsWith(unlisted)),
    }),
  ],

  markdown: {
    shikiConfig: {
      // Dual themes emit both colour sets as CSS variables; src/styles/base.css
      // switches between them on [data-theme], not on prefers-color-scheme,
      // because the theme is user-togglable.
      themes: {
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
      },
      wrap: true,
    },
  },
});
