# Editing the STROH's website

You do not need to know how websites work to change this one. Everything on the site is a
text file in the `content/` folder, and you can edit those files in your web browser on
github.com. This page is the whole job.

---

## The idea, in one picture

```
content/competitions/muni-tour.md   ──►  the page at strohs.club/competitions/muni-tour
             (one file you edit)    ──►  a printable one-page PDF
                                    ──►  a square image for Instagram and Discord
                                    ──►  a slide in the onboarding deck
                                    ──►  a chapter in the Almanac
```

One file per thing STROH's has: each competition, each About page, the season, the
community. Edit the file once and everything above updates by itself. You never edit the
PDF or the slides — they are built from the file.

---

## Changing wording on a page that already exists

1. Go to the repo on github.com and open the file under `content/`. The page at
   `/competitions/muni-tour` is `content/competitions/muni-tour.md`.
2. Click the pencil icon (top right of the file).
3. Type. It is ordinary text: `**bold**`, `_italic_`, `- ` for a bullet, `## ` for a heading.
4. Scroll down, write one line saying what you changed, and click **Commit changes**.
5. Wait about five minutes and reload the site.

**Leave the block at the very top alone** unless you mean to change it — that is the
settings block, and it is described below.

---

## Adding a whole new page

Start from a template. There are two, and they are complete working files: copy one, change
the words, and it will build.

| I want to add | Copy | To |
|---|---|---|
| A competition or event | `docs/templates/new-competition.md` | `content/competitions/<name>.md` |
| Any other page | `docs/templates/new-page.md` | one of the folders below |

Where a plain page goes decides which menu it appears in:

| Put the file here | It appears under | Its address is |
|---|---|---|
| `content/about/<name>.md` | About | `/about/<name>` |
| `content/season/<name>.md` | The Season | `/season/<name>` |
| `content/competitions/<name>.md` | Competitions | `/competitions/<slug>` |

**A file anywhere else does nothing at all.** It will not appear on the site, in a menu, or
in any PDF, and the build will stop and tell you so. If you genuinely want a page that is in
no menu — the way `/roll-of-honour` is — someone has to add its name to `ROOT_PAGES` in
`site/lib/nav.mjs`. Ask in the Discord; it is a one-line change.

### Doing it in the browser

1. Open `docs/templates/new-page.md` on github.com and copy everything.
2. Click **Add file → Create new file** at the top of the repo.
3. Type the full path in the name box, including the folder:
   `content/about/committee.md`. GitHub creates the folder for you.
4. Paste, edit, **Commit changes**.

Name the file in lower case with hyphens instead of spaces — `club-championship.md`, not
`Club Championship.md`. The file name becomes part of the web address.

---

## The settings block

The lines between the two rows of `---` at the top are settings, not page text:

```yaml
---
title: Charity
subtitle: A season-long donation drive, and the creative ways members chip in.
order: 5
---
```

- `title` is required on every file. `slug` and `order` are also required on a competition.
- Every other setting is optional, and both templates list all of them with a line saying
  what each one does. **The templates are the reference** — there is no other list to learn.
- Spelling counts. `sumary:` is not `summary:`, and the build will stop rather than quietly
  drop your sentence. The error tells you which line and what you probably meant.
- A value with a colon or a `#` in it needs quotes: `value: "Sunday: the final"`.
- `order` is a bare number — `order: 5`, never `order: "5"`.

---

## Things that are not confirmed yet

Wrap anything the committee has not signed off in draft markers, each on a line of its own:

```markdown
<!-- draft:D-06 -->
The entry fee is $40 and the field is capped at 40 players.
<!-- /draft:D-06 -->
```

The words between the markers **stay on the website** and are **left out** of every PDF,
share image, slide deck and the Almanac — the things people download, print and keep. That
way a number nobody has agreed to does not end up in a document that outlives the argument.

`D-06` is a row in [`RECONCILIATION.md`](RECONCILIATION.md), the list of open editorial
questions. Add a row there saying what is waiting on whom, and use its ID.

Three rules: an opening marker always needs a closing one, they cannot overlap, and each
sits alone on its own line. Get it wrong and the build stops — an unclosed marker used to
mean the unratified prose was printed in every PDF, so it is not allowed to be a warning.

The same thing works inside the settings block, for a fact that is not settled:

```yaml
  - label: Where
    value: "<!-- draft:D-01 -->Landa Park Golf Course<!-- /draft:D-01 -->"
```

For a page that is entirely unconfirmed, use `status: draft` instead — that holds the whole
file back from every document, and names it in the Almanac's list of omissions.

---

## The `outputs` line

```yaml
outputs: [page, pdf, png, slides]
```

That list is the only thing that decides which files get built for a page:

| Word | What you get |
|---|---|
| `page` | the page on the website |
| `pdf` | a branded one-page PDF, linked from the page's Documents panel |
| `png` | a square image for Instagram and Discord |
| `slides` | a slide in the onboarding deck |

Add a word and the file appears at the next build. Remove one and the old file is deleted.
Leave the line out entirely and you get `[page]`. The Almanac ignores this list — every page
that is not a whole-file draft is in the Almanac.

Two things to know. Ask for `pdf` and the PDF is built from `summary`, `keyFacts` and the
body, so a page with no `summary` makes a thin one. And a page with `status: draft` builds
no documents at all, so it must not ask for any.

---

## Before you push

If you have the repo on your laptop:

```bash
npm install     # once
npm run check   # a few seconds — reads your files and tells you what is wrong
```

`npm run check` is written to be read. It gives you the file, the line and the fix:

```
  content/competitions/summer-scramble.md
    line 6   "sumary" is not a setting this file understands.
             > Did you mean "summary"? Two or three sentences. Opens the PDF, the
               share image and the slide.
```

If you are working in the browser instead, you do not need any of that: **the same check
runs automatically** on every commit and every pull request. Look for the tick or the cross
next to your commit on github.com — click the cross and the same plain-English message is at
the bottom of the log. Nothing broken ever reaches the live site; a failed check just means
the site keeps serving the previous version until you fix it.

If you would like someone to look before it goes live, use **Create a new branch for this
commit and start a pull request** on the commit screen rather than committing straight to
`main`.

---

## Six things that catch people out

1. **A misspelled setting name.** `sumary:` stops the build. That is deliberate — it used to
   be silently ignored, which meant your sentence just never appeared.
2. **A file in the wrong folder.** `content/rules.md` is in no section, so it builds nothing.
   See the table above.
3. **`slug:` on a plain page.** It secretly moves the page's address. Only competitions use
   `slug`, and there it must match the file name.
4. **Two files with the same name or slug.** One of them silently disappears. The check
   catches it; the site would not.
5. **An unclosed `<!-- draft: -->` marker.** Stops the build, on purpose.
6. **Changing the Discord invite in a page.** The real one lives in `site/lib/links.mjs` and
   is quoted in several files. Change it there first, then everywhere it is quoted, or the
   build will stop and tell you which file disagrees.

---

## Not going to use GitHub at all?

A page can be kept in a Google Doc instead, and the site will read it once an hour. Setting
that up is a one-line change someone else makes once; after it, you only ever open Google
Drive. See [AUTHORING-GOOGLE-DRIVE.md](AUTHORING-GOOGLE-DRIVE.md).

---

## Who to ask

Post in the Discord, or tag `@jdonelson` or `@omarmjhdpr`. Nothing you can do in a `.md`
file can break the live site: it either builds and deploys, or it fails the check and the
site stays exactly as it was.
