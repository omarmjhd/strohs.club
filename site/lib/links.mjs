// External links that appear in more than one place. Imported by the Astro app, by the
// markdown-link check in scripts/, and by the slide builder, so it must stay free of
// `astro:` imports and TypeScript.
//
// The Discord invite is here because it is a credential as much as a URL: it is published on
// a public site, and rotating a leaked or expired one previously meant editing eight files
// and rebuilding the deck.

export const DISCORD_INVITE = 'https://discord.gg/frNSUn5ZmC';
export const DISCORD_LABEL = 'discord.gg/frNSUn5ZmC';
export const INSTAGRAM = 'https://instagram.com/strohs_roost';

// The scoring app: where members post rounds and where the standings on this site come from.
// A separate Cloudflare Worker, not part of this build. Changing this URL also means updating
// `csvBase` in content/competitions/*.md and the Discord OAuth redirect over in that app.
export const SCORING_APP = 'https://strohs-scoring.strohs-scoring.workers.dev';

// Markdown cannot import, so content files write the literal URL. This lets the build fail
// when one of them drifts from the value above rather than quietly serving a dead invite.
export const CANONICAL_LINKS = [DISCORD_INVITE, INSTAGRAM];
