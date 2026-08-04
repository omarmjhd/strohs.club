import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const keyFact = z.object({
  label: z.string(),
  value: z.string(),
  link: z.string().optional(),
});

const competitions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/competitions' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    navGroup: z.string(),
    order: z.number(),
    tagline: z.string(),
    blurb: z.string(),
    summary: z.string(),
    accent: z.string(),
    accent2: z.string().optional(),
    hero: z.string(),
    logo: z.string(),
    standingsUrl: z.string().optional(),
    keyFacts: z.array(keyFact).default([]),
    // Free-form per-template blocks consumed by templates/social.mjs.
    social: z.record(z.any()).optional(),
    outputs: z.array(z.enum(['page', 'pdf', 'png', 'slides'])).default(['page']),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './content' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    heroImage: z.string().optional(),
    quickFacts: z.array(keyFact).default([]),
  }),
});

export const collections = { competitions, pages };
