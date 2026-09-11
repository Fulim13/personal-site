/**
 * Everything about *you* that the templates need, in one file.
 *
 * Site-wide values used by the layouts and pages.
 */

export const site = {
  author: 'Fu Lim',
  /** Shown in the browser tab and as the site-wide title. */
  title: 'Fu Lim',
  /** Used on the home page above your name. */
  tagline: 'Backend Engineer',
  /** Used as the fallback meta description on pages without their own. */
  description:
    'Personal site of Fu Lim — projects, career, and writing about how software works.',
  /** Shown in the footer. */
  startYear: 2026,

  /**
   * Shown on the home page. The footer no longer lists these.
   * `icon` must be a name defined in src/components/Icon.astro.
   */
  socials: [
    {
      label: 'GitHub',
      href: 'https://github.com/Fulim13',
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/fu-lim-wong',
      icon: 'linkedin',
    },
  ],

  nav: [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Projects', href: '/projects' },
  ],
} as const;

/** Which zone a path belongs to. Drives the two visual registers (ADR-0003). */
export function zoneFor(pathname: string): 'writing' | 'portfolio' {
  return pathname.startsWith('/blog') ? 'writing' : 'portfolio';
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function formatDate(date: Date): string {
  return DATE_FORMAT.format(date);
}

/** Turns "2021-04" or "2021-04-01" into "Apr 2021". Blank means "Present". */
export function formatMonth(value?: string): string {
  if (!value) return 'Present';
  const [year, month] = value.split('-');
  if (!month) return year!;
  const d = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
  }).format(d);
}

/** Months since epoch, so ranges can be compared and subtracted. */
function monthIndex(value: string): number {
  const [year, month] = value.split('-');
  return Number(year) * 12 + (month ? Number(month) - 1 : 0);
}

/**
 * Inclusive month count, matching how LinkedIn counts: Aug 2025 – Jul 2026 is
 * "1 yr", not "11 mos". An open-ended range runs to today.
 */
export function monthsBetween(start: string, end?: string): number {
  const from = monthIndex(start);
  const now = new Date();
  const to = end
    ? monthIndex(end)
    : now.getFullYear() * 12 + now.getMonth();
  return Math.max(1, to - from + 1);
}

/** 18 → "1 yr 6 mos". 6 → "6 mos". 24 → "2 yrs". */
export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
  if (rest > 0) parts.push(`${rest} ${rest === 1 ? 'mo' : 'mos'}`);
  return parts.join(' ') || '1 mo';
}

/** Sorts newest-first; an entry with no `end` counts as ongoing. */
export function byMostRecent(
  a: { start: string; end?: string },
  b: { start: string; end?: string },
): number {
  if (!a.end && b.end) return -1;
  if (a.end && !b.end) return 1;
  return monthIndex(b.start) - monthIndex(a.start);
}
