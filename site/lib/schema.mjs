// The frontmatter schemas for both collections, and one line of plain-English help per
// field. Kept out of content.config.mjs and free of `astro:` imports so the pre-push
// checker can validate a file with the very same schema Astro will use — a second,
// hand-written copy of these rules is how the two readers of `content/` drifted before.
//
// `astro/zod` is the same zod instance `astro:content` re-exports.

import { z } from 'astro/zod';
import { DRAFT_MARKER } from '../../scripts/lib/content.mjs';

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

export const competitionSchema = z
  .object({
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
  })
  .strict();

export const pageSchema = z
  .object({
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
  })
  .strict();

export const schemaFor = (collection) =>
  collection === 'competitions' ? competitionSchema : pageSchema;

// What each field is for, in words an author can act on. `scripts/check-content.mjs`
// prints these instead of a schema error, and fails if a field here has no help.
export const FIELD_HELP = {
  title: 'The heading at the top of the page, and the name in the nav. Required.',
  slug: 'The last part of the web address. Required on a competition, and it should match the file name.',
  order: 'A number. Lower numbers come first in the nav and in the Almanac.',
  kind: '"competition" (the default) or "notes" for a shared-rules page that is not an event.',
  tagline: 'One line under the title on a competition page.',
  subtitle: 'One line under the title on a plain page.',
  blurb: 'One or two lines for the competition card on the home page.',
  summary: 'Two or three sentences. Opens the PDF, the share image and the slide.',
  accent: 'The page\'s highlight colour, as "#RRGGBB" in quotes.',
  accent2: 'A second highlight colour, as "#RRGGBB" in quotes.',
  hero: 'The artwork beside a competition title, e.g. /brand/comp-muni-tour.png.',
  heroImage: 'The artwork above a plain page title, e.g. /brand/strohs-script.png.',
  logo: 'The badge used on the generated PDF and share image.',
  standingsUrl: 'Link to the published Google Sheet of standings.',
  standings: 'The live leaderboard configuration. Copy the block from muni-tour.md.',
  keyFacts: 'The Key Facts panel on a competition page: a list of label/value pairs.',
  quickFacts: 'The Quick Facts panel on a plain page: a list of label/value pairs.',
  principles: 'A list of title/body cards, as on the Getting Started page.',
  social: 'Extra lists used only by the share image. Copy the shape from a similar file.',
  outputs: 'Which files to build: any of page, pdf, png, slides. Defaults to [page].',
  status: '"confirmed", or "draft" to keep the whole file out of every PDF, image and deck.',
  draftIds: 'The reconciliation IDs behind a draft file, e.g. [D-05]. See docs/RECONCILIATION.md.',
};
