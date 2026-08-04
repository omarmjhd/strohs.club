---
# Copy this file to content/competitions/<name>.md and rename BOTH the file and the
# slug below to the same <name>. Everything else has a working default.

# ---- REQUIRED ----------------------------------------------------------------
# The name of the event, as a heading and in the Competitions menu.
title: New Competition

# The last part of the web address, and the name of every file this page
# generates. Must match the file name: new-competition.md -> /competitions/new-competition
slug: new-competition

# Lower numbers come first in the Competitions menu. The existing events are
# 1 to 5; the shared-rules page sits at 99.
order: 50

# ---- OPTIONAL — delete any line you do not need -------------------------------
# One line under the title, and the headline on the share image.
tagline: One line saying what this event is.

# One or two lines for the competition card on the home page.
blurb: A short version of the tagline, for the home page card.

# Two or three sentences. This opens the PDF, the share image and the slide, so
# it has to make sense on its own. The `>-` keeps it on several lines here and
# joins them into one paragraph.
summary: >-
  What the event is, how it is scored, and what winning it earns you. Two or
  three sentences is the right length — the one-page PDF puts this directly
  under the title.

# Highlight colours, in quotes. Defaults to the STROH's navy.
# accent: "#4A1D8A"
# accent2: "#E97724"

# Artwork. Both must already exist in public/brand/ — see that folder for the
# list. `hero` sits beside the title, `logo` is used on the PDF and the image.
hero: /brand/strohs-badge.png
logo: /brand/strohs-badge.png

# The Key Facts panel on the right, and the fact strip across the PDF. Four is
# the number that fits.
keyFacts:
  - label: Format
    value: How it is played
  - label: When
    value: The window it runs in
  - label: How to qualify
    value: Who can enter, and how
  - label: The prize
    value: What the winner gets

# "notes" marks a shared-rules page rather than an event: it is left out of the
# home page cards and the Standings menu. Leave this out for a real competition.
# kind: notes

# Live standings. Publish the Google Sheet to the web first (File > Share >
# Publish to web), then copy the block from content/competitions/muni-tour.md
# and swap in your own URL and tab IDs.
# standingsUrl: https://docs.google.com/spreadsheets/d/e/.../pubhtml
# standings:
#   csvBase: https://docs.google.com/spreadsheets/d/e/.../pub
#   hideColumns: [Course]
#   boards:
#     - { title: "Season Points", gid: "0", mode: table }

# Extra lists used only by the share image. See content/competitions/opnszn.md.
# social:
#   scoring:
#     - "One line per rule"

# Which files to build. Start with the page only; add pdf, png or slides once
# the wording has settled and they will appear in the Documents panel.
outputs: [page]

# Set this to draft to keep the whole event out of every PDF, image, deck and
# the Almanac while it is still being written. `draftIds` are rows in
# docs/RECONCILIATION.md. A draft page must not ask for pdf/png/slides above.
# status: draft
# draftIds: [D-06]
---

## How Scoring Works

Explain the format first. This is the part a newcomer reads.

## How to Enter

1. What to do before you play.
2. Who you have to play with, and the shared rules in the
   [General Competition Notes](/competitions/competition-notes).
3. How and when to post the score.

## Tie-Breakers

What happens when two players finish level.
