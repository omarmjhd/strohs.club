# Editing a page from Google Drive

For an administrator who is never going to open GitHub. You keep a **Google Doc** (or a
Google Sheet), the site reads it once an hour, and any change you have made appears on
strohs.club a few minutes later.

This is optional and per page. Most pages are edited as described in
[AUTHORING.md](AUTHORING.md); a page set up this way is edited **only** in Google Drive —
the copy in the repo is regenerated and any hand edit to it is overwritten.

---

## Setting one up

### 1. Write the page in a Google Doc

Start the Doc with a **two-column table** — Insert → Table → 2×1 — and put one setting per
row. Then write the page underneath it, normally: headings, bold, bullets, links all
survive.

> | Setting | Value |
> | --- | --- |
> | Title | Summer Scramble |
> | Order | 6 |
> | One-liner | A two-person scramble, played in the heat |
> | Summary | Two players, one ball, three hours. Pairs are drawn on the day. |
> | Key fact: Format | Two-person scramble |
> | Key fact: When | July, date to be confirmed |
> | Documents | page, pdf |
>
> ## How it works
>
> Pairs are drawn on the day. **Best ball** each shot.

Recognised settings, in whatever capitalisation you like:

| Write this | It sets |
|---|---|
| Title *(required)* | the page heading and the menu entry |
| Order | where it sits in the menu — a number |
| One-liner / Tagline | the line under the title |
| Subtitle | the line under the title, on a non-competition page |
| Summary | the two or three sentences that open the PDF and the share image |
| Blurb / Card text | the home page card |
| Key fact: *anything* | one row of the Key Facts panel |
| Documents | any of `page, pdf, png, slides` |
| Artwork / Logo | a picture already in the site's `public/brand/` folder |
| Colour | the page's highlight colour, like `#4A1D8A` |
| Status | `draft` to keep the whole page out of every PDF and image |

Anything else in the first column stops the sync with a message saying so, and suggests the
setting you probably meant. Nothing half-converted is ever published.

### 2. Share it

**Share → General access → Anyone with the link → Viewer.** The site reads the Doc without
signing in, so this step is what makes it work. Do not put anything in the Doc you would not
put on the website.

### 3. Register it — a one-line change, once

Someone with repo access adds an entry to `content-sources.json`:

```json
{
  "sources": [
    {
      "file": "content/competitions/summer-scramble.md",
      "from": "https://docs.google.com/document/d/1AbC.../edit",
      "note": "Josh's working copy"
    }
  ]
}
```

`file` decides where the page lives on the site, exactly as in
[AUTHORING.md](AUTHORING.md#adding-a-whole-new-page): a file under `content/competitions/`
becomes a competition, one under `content/about/` appears in the About menu.

That is the only setup. From then on it is Google Drive only.

---

## Using a Sheet instead

Better when the page is mostly facts. Two columns — `Setting` and `Value` — the same names as
above, and then a row whose first column is **Body**: every row after it is one paragraph or
one bullet of the page, written in the second column. Leave a row blank to leave a blank
line.

| Setting | Value |
|---|---|
| Title | Summer Scramble |
| Order | 6 |
| Body | `## How it works` |
| | |
| | `- Pairs are drawn on the day.` |

Publish it with **File → Share → Publish to web**, or share the link as above.

---

## What happens after you edit

1. Once an hour, the **Sync content from Google Drive** job reads every registered file.
2. It converts each one to markdown and compares it with what is already in the repo. No
   change, nothing happens.
3. A change is checked with the same `npm run check` every other edit goes through. **If the
   check fails, nothing is committed** and the site keeps serving the previous version — a
   mistyped setting cannot take a page down.
4. What passes is committed and the site rebuilds. Total time from Save to live: usually
   under ten minutes, at worst just over an hour.

To publish immediately instead of waiting, someone with repo access can open the **Actions**
tab on github.com, pick **Sync content from Google Drive**, and click **Run workflow**.

Anyone with the repo can preview a change before it goes anywhere:

```bash
npm run sync -- --dry-run   # says what would change, writes nothing
npm run sync                # writes the files
npm run check               # the usual check
```

---

## A worked example: the page that exists today

`content/competitions/muni-tour-google.md` was created this way. Start to finish:

**1 — A new Google Doc**, beginning with a 2×1 table and the page written underneath:

| Setting | Value |
| --- | --- |
| Title | Muni Tour Google |
| Slug | muni-tour-google |
| Order | 6 |
| One-liner | The Muni Tour, but the edits come from the STROH's Google Drive |
| Key fact: Format | Season-long net points race |
| Documents | page, pdf, png |

**2 — Share → Anyone with the link → Viewer.** Without this the site gets Google's sign-in
page, and the sync says so rather than writing anything.

**3 — One entry in `content-sources.json`:**

```json
{
  "file": "content/competitions/muni-tour-google.md",
  "from": "https://docs.google.com/document/d/13FO.../edit?usp=sharing",
  "note": "Muni Tour — Google Doc trial"
}
```

The `file` path is what decides everything else: under `content/competitions/` it becomes a
competition, with a menu entry, a home page card, a PDF and a share image.

**4 — `npm run sync -- --dry-run`.** The first real run refused, twice, and both were the
author's mistakes rather than bugs:

```
"Documents" does not accept "social". Use any of: page, pdf, png, slides.
"Slug" is "muni-tour-google-" but this page is registered as muni-tour-google.md.
```

Nothing half-converted is ever written. Fix the Doc, run again.

**5 — `npm run sync`**, then `npm run check`. The generated file is ordinary markdown, and
from here nothing else in the project knows or cares that it came from Google.

---

## Docs or markdown? Choosing per page

You do not have to pick one for the whole site — this is a per-page decision, and the two can
sit side by side in `content/` indefinitely.

| | Google Doc | Markdown on GitHub |
|---|---|---|
| Who can edit | anyone you share the Doc with | anyone with repo access |
| Learning curve | none | a pencil icon and a commit message |
| Goes live | within the hour, automatically | within about five minutes of committing |
| Review before publishing | none — the Doc is the site | possible, via a pull request |
| Who changed what | in the Doc's revision history | in `git log`, by name |
| Mistakes | caught by the sync; nothing partial is published | caught by `npm run check` and CI |
| Rolling back | fix the Doc; reverting the repo is undone next sync | `git revert` |
| Editing the markdown | overwritten on the next sync | it *is* the source |

**Reach for a Doc when** the page changes often, the person maintaining it will not touch
GitHub, or several people want to draft together.

**Reach for markdown when** the page is stable, you want the change reviewed before it is
public, or you care that `git log` records who wrote what — every synced change is committed
by `strohs-bot`, whoever actually typed it.

**The trade in one line:** a Doc removes every barrier to editing, including the ones that
catch mistakes before they are public.

---

## What this cannot do

- **Only the settings in the table above.** Live standings boards, the `social` blocks behind
  the share images and the nav registry are still repo edits.
- **No pictures from the Doc.** An image pasted into a Google Doc is not carried across; use
  `Artwork` to name one of the files already in `public/brand/`.
- **Draft markers still have to be typed** as `<!-- draft:D-06 -->` on their own line, exactly
  as in [AUTHORING.md](AUTHORING.md#things-that-are-not-confirmed-yet). Google Docs will try
  to autocorrect the dashes — turn off Tools → Preferences → Automatic substitution if it
  does.
- **The Doc is the only copy that matters.** Once a page is registered, editing its `.md` in
  GitHub is pointless: the next sync overwrites it. The generated file says so at the top.
- **Google is a dependency.** If Drive is unreachable the job fails and the site keeps
  serving what it already has. Nothing breaks; nothing updates either.
