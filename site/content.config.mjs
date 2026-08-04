import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { pagePatterns } from './lib/nav.mjs';
import { competitionSchema, pageSchema } from './lib/schema.mjs';

const competitions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/competitions' }),
  schema: competitionSchema,
});

const pages = defineCollection({
  // An explicit allowlist, not '**/*.md': the competition files also satisfy this
  // schema, so a recursive glob would silently mount five phantom top-level pages.
  loader: glob({ pattern: pagePatterns(), base: './content' }),
  schema: pageSchema,
});

export const collections = { competitions, pages };
