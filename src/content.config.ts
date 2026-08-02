import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content model. See CONTEXT.md for what these words mean.
 *
 * Writing zone  → posts    (plain markdown)
 * Portfolio zone → projects (markdown), experience + tech (structured YAML)
 *
 * The split is by shape, not convention: Experience and Tech Card are pure
 * records with no prose body, so they live in one YAML file each rather than
 * as directories of near-empty markdown.
 */

const posts = defineCollection({
  // `[^_]*` lets you park a file as _scratch.md and have it ignored entirely,
  // which is a stronger form of hiding than `draft: true`.
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Excluded from production builds; still visible in `astro dev`. */
    draft: z.boolean().default(false),
    /**
     * Built and reachable at its URL, but absent from every listing — the blog
     * index, tag pages and counts, the RSS feed, the home page, and the
     * sitemap. For reference material you want to link to but not publish.
     */
    unlisted: z.boolean().default(false),
    /** Surfaced above ordinary Posts on the blog index. */
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    /**
     * Optional. When absent, the meta description and OG card fall back to the
     * Post's opening prose. Add one when the automatic extract reads badly.
     */
    description: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** One line for the showcase grid. */
    blurb: z.string(),
    year: z.number().int(),
    tech: z.array(z.string()).default([]),
    repo: z.url().optional(),
    url: z.url().optional(),
    /** Related Post slug, if this project has a write-up in the Writing zone. */
    post: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** Which timeline an Experience appears on. */
export const EXPERIENCE_KINDS = ['work', 'education', 'certification'] as const;

const experience = defineCollection({
  loader: file('src/data/experience.yaml'),
  schema: z.object({
    kind: z.enum(EXPERIENCE_KINDS).default('work'),
    /** Employer, institution, or issuing body. */
    company: z.string(),
    /** Job title, qualification, or certificate name. */
    role: z.string(),
    /** e.g. Full-time, Internship, Contract. Work entries only. */
    employment: z.string().optional(),
    /**
     * `YYYY-MM`, or `YYYY` where only the year is meaningful. Coerced because
     * YAML parses a bare `2023` as a number, and quoting every year would be
     * an easy thing to forget.
     */
    start: z.coerce.string(),
    /** Omit for a position still held. Ignored for certifications. */
    end: z.coerce.string().optional(),
    location: z.string().optional(),
    blurb: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    tech: z.array(z.string()).default([]),
    /** Certifications only — link to the credential. */
    url: z.url().optional(),
  }),
});

/** The ten card types. Each maps to one accent colour in portfolio.css. */
export const TECH_TYPES = [
  'language',
  'framework',
  'runtime',
  'data',
  'messaging',
  'infra',
  'tooling',
  'testing',
  'design',
  'practice',
] as const;

const tech = defineCollection({
  loader: file('src/data/tech.yaml'),
  schema: z.object({
    name: z.string(),
    type: z.enum(TECH_TYPES),
    /** A single character or emoji, used instead of an image asset. */
    glyph: z.string(),
    /** 1–5. Drives the card's pip meter. */
    level: z.number().int().min(1).max(5),
    years: z.number().optional(),
    /** The card's italic flavour line. Keep it short and a little funny. */
    flavour: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts, projects, experience, tech };
