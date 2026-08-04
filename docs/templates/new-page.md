---
# ---- REQUIRED ----------------------------------------------------------------
# The heading at the top of the page, and the name in the nav menu.
title: New Page

# ---- OPTIONAL — delete any line you do not need -------------------------------
# One line under the title. Also the description search engines show.
subtitle: One line saying what this page is for.

# Lower numbers come first inside this section's menu. Leave it out and the page
# goes last.
order: 50

# Artwork above the title. Must be a file that exists in public/ — see the list
# in public/brand/. Delete this line for no picture.
# heroImage: /brand/strohs-script.png

# The Quick Facts panel down the right-hand side. `link` is optional per fact.
# quickFacts:
#   - { label: "When", value: "Every other Sunday" }
#   - { label: "Where", value: "The Discord", link: "https://discord.gg/frNSUn5ZmC" }

# The card list at the top of the page, as on Getting Started.
# principles:
#   - title: All Are Welcome
#     body: Come out and play. Seriously.

# Which files to build from this page. `page` is the website itself; add `pdf`,
# `png` or `slides` and they appear in the Documents panel and in
# public/downloads/. Leave it out and you get the page only.
# outputs: [page, pdf]

# Set this to draft to keep the whole page out of every PDF, image, deck and the
# Almanac while still showing it on the website. `draftIds` are rows in
# docs/RECONCILIATION.md. A draft page must not ask for pdf/png/slides above.
# status: draft
# draftIds: [D-06]
---

Write the page here in normal markdown. This first paragraph is what the PDF and
the share image lead with, so make it stand on its own.

## A heading

- Bullet points work.
- **Bold** and _italic_ work.
- Links to other pages start with a slash: [Getting Started](/getting-started).

Anything not settled yet goes between draft markers, each on its own line. It
stays on the website and is left out of every PDF, image, deck and the Almanac.
Delete the example below, or add a `D-06` row to docs/RECONCILIATION.md saying
what is waiting to be confirmed:

<!-- draft:D-06 -->
The entry fee will be $40, to be confirmed at the next committee meeting.
<!-- /draft:D-06 -->
