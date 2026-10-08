# fvtt-campaign-greenrest

**The Broken Heart of Greenrest** — a complete Dungeons & Dragons campaign (5e, 2024 rules), played on
Foundry VTT over nine sessions, July–September 2026, and kept here whole: the DM's plot canon and
session prep, the session record (transcripts, recaps, combat logs, GM notes), the party snapshots,
the art, the maps, the Foundry world as it ended, and the finished chronicle.

It is published as a worked example — of a campaign repo in the Open Roll 5e layout
([`fvtt-suite-openroll5e`](https://github.com/Txpple/fvtt-suite-openroll5e)), and of what the
family's tools produce: the dnd5e MCP server's world builds, the session scribe's records, the
illustration builder's art. Nothing here is in progress; the campaign is over and the story is told.
**Spoilers everywhere, obviously.**

## Where to start

- **The chronicle:** [`book/the-broken-heart-of-greenrest.pdf`](book/the-broken-heart-of-greenrest.pdf)
  — the whole campaign as one illustrated book, with the narrator's notes, a "What If…?" appendix of
  the endings not taken, and the bestiary.
- **How each night actually went:** [`sessions/`](sessions/README.md) — every session's transcript,
  recap, combat report and GM notes, each as markdown and as a PDF.
- **What the DM knew:** [`plot/plot.md`](plot/plot.md), the one canon document. **How each session
  was prepared:** [`plans/`](plans/), with the table scripts. **The standing rules:**
  [`conventions/`](conventions/).
- **The world itself:** [`foundry/`](foundry/README.md) — every world document as JSON and the assets
  that were made for it.

**The filing rules and the tooling map are in [`CLAUDE.md`](CLAUDE.md)**; where things stand in
[`STATUS.md`](STATUS.md).

```
CLAUDE.md          filing rules · tooling · where things go
STATUS.md          where things stand
campaign.json      facts the tools read (party, journals, speakers, outputs)
STYLE.md           house style for the session record
BOOTSTRAP.md       getting a local copy
plot/plot.md       THE canon spine — one file
plans/             session-NN-<slug>.md — prep as played, table scripts included
conventions/       standing rules: house rules + how the Foundry world was built
art/               approved art + SHELF.md
maps/              source maps
sessions/          the session record — transcript, recap, combat log, GM notes, per session
party-snapshots/   PC sheets at every wrap
book/              the chronicle — HTML source, parts, images, build script, and the PDF
foundry/           the Foundry world: our assets + every world document as JSON
scripts/           the filing lint, the Word export, the public scrub, the session-PDF renderer
world/ inbox/ templates/ out/   as in the template layout (world/ unused here)
```

```bash
npm install                            # once per machine — md2docx's one dependency
npm run check                          # filing lint
node scripts/public-scrub.mjs --dry    # what was removed for publication (re-runnable)
node scripts/render-session-docs.mjs   # re-render the session PDFs the scribe never made
python book/build.py <bestiary.json>   # rebuild the chronicle's HTML (see book/README.md)
```

## What was taken out before publishing

The players agreed to this record being public. Even so, `scripts/public-scrub.mjs` (committed, so
the rule is on the record) removed:

- **Discord identities** — user IDs, handles, the server and channel names, recording IDs. Speakers
  in the transcripts are the characters (or "DM"); players appear by first name only, as they did
  at the table. Players' travel plans and the like were cut from the GM notes.
- **Licensed book text** — the Foundry world export and the party snapshots carried every
  item's and creature's full rules text, and for anything that came from a purchased D&D book
  module (Player's Handbook, Dungeon Master's Guide, Monster Manual, Heroes of Faerûn) that text
  is the publisher's. Those documents are **stubbed, not dropped**: name, type, art, mechanics and
  the compendium source UUID stay, so the world still restores and relinks against your own copies
  of the books; only the prose fields are blank.
- **Third-party audio** — the Tabletop Audio tracks in the world's playlists. The playlist
  documents keep the paths.

Raw session audio was never committed. The git history is a single commit: the campaign's working
history named people and carried the unscrubbed files, and it stays private.

## Licensing

The campaign's own text, art, world documents and scripts are
[CC BY-NC 4.0](LICENSE). What is not ours is not covered:

- **Dungeons & Dragons and the Forgotten Realms.** *The Broken Heart of Greenrest* is unofficial
  Fan Content permitted under the
  [Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy). Not approved/endorsed
  by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of
  the Coast LLC. This includes the Sword Coast map in `maps/` and the Forgotten Realms names and
  places throughout.
- **Battlemaps and map props** by [Tom Cartos](https://www.tomcartos.com/) (the Greenrest town set,
  the hag lair, the Temple of Night, the green dragon's lair) and
  [Forgotten Adventures](https://www.forgotten-adventures.net/), in `maps/` and under
  `foundry/assets/`, were bought and used for this table under their own licences. They are here
  so the world restores; they are not relicensed by this repo and are not for redistribution on
  their own.
