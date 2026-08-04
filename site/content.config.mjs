import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { DRAFT_MARKER } from '../scripts/lib/content.mjs';
import { pagePatterns } from './lib/nav.mjs';

// Frontmatter reaches the layouts as plain strings, so it never passes through the remark
// plugin that cleans the body. Without this the markers render as visible escaped text in
// the Key Facts panel. The site keeps draft prose and drops only the markers; the artifact
// pipeline does the opposite.
const prose = () => z.string().transform((s) => s.replace(DRAFT_MARKER, '').trim());

const keyFact = z.object({
  label: prose(),
  value: prose(),
  link: z.string().optional(),
});

const competitions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/competitions' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number(),
    kind: z.enum(['competition', 'notes']).default('competition'),
    tagline: prose().optional(),
    blurb: prose().optional(),
    summary: prose().optional(),
    accent: z.string().optional(),
    accent2: z.string().optional(),
    hero: z.string().optional(),
    logo: z.string().optional(),
    standingsUrl: z.string().optional(),
    standings: z
      .object({
        csvBase: z.string(),
        hideColumns: z.array(z.string()).default([]),
        boards: z.array(
          z.object({
            title: z.string(),
            gid: z.string(),
            mode: z.enum(['sections', 'table']).default('sections'),
            // A header name, or a 0-based column index when the sheet's header text
            // is unreliable.
            requireColumns: z
              .array(z.union([z.string(), z.number()]).transform(String))
              .default([]),
            // Highlights the cut lines and draws the projected bracket.
            cut: z.object({ bye: z.number(), playoff: z.number() }).optional(),
          })
        ),
      })
      .optional(),
    keyFacts: z.array(keyFact).default([]),
    // Free-form per-template blocks consumed by templates/social.mjs.
    social: z.record(z.any()).optional(),
    outputs: z.array(z.enum(['page', 'pdf', 'png', 'slides'])).default(['page']),
    // Honoured by scripts/lib/content.mjs. Declared here too because z.object strips
    // unknown keys, which previously left layouts unable to see draft state at all.
    status: z.enum(['confirmed', 'draft']).default('confirmed'),
    draftIds: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  // An explicit allowlist, not '**/*.md': the competition files also satisfy this
  // schema, so a recursive glob would silently mount five phantom top-level pages.
  loader: glob({ pattern: pagePatterns(), base: './content' }),
  schema: z.object({
    title: z.string(),
    subtitle: prose().optional(),
    order: z.number().default(999),
    heroImage: z.string().optional(),
    quickFacts: z.array(keyFact).default([]),
    principles: z.array(z.object({ title: prose(), body: prose() })).default([]),
    outputs: z.array(z.enum(['page', 'pdf', 'png', 'slides'])).default(['page']),
    status: z.enum(['confirmed', 'draft']).default('confirmed'),
    draftIds: z.array(z.string()).default([]),
    slug: z.string().optional(),
    // No path-derived `slug` behaviour: the glob loader returns `data.slug` as the entry
    // id when present, so a page that sets it moves its own URL — only do that deliberately.
  }).strict(),
});

export const collections = { competitions, pages };
