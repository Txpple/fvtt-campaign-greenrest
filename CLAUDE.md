# fvtt-campaign-greenrest — the campaign repo (public example)

*The Broken Heart of Greenrest* — played to its end over nine sessions, 7 July to 29 September 2026.
**The campaign is complete.** This repo is its archive and its final deliverable, filed the way the
Open Roll 5e campaign template is filed, and published as the worked example of that layout. It
names the players by first name, with their agreement; `README.md` says what was removed before it
went public, and `scripts/public-scrub.mjs` is how.

**Finished.** Nothing here is in progress. The Foundry world is backed up in `foundry/`; the
story is told in `book/`. Change things only to fix an error.

## The deliverable

`book/the-broken-heart-of-greenrest.pdf` is the campaign's final document: the whole story told as
one chronicle, with narrator notes, maps, the art, a "What If…?" appendix and the bestiary. Its
source is `book/the-broken-heart-of-greenrest.html`, assembled from `book/parts/*.html` by
`book/build.py` (see `book/README.md`). Rebuild it only to fix an error; the story is finished.

## Tooling — what read and wrote this repo

The contract between the tools and a campaign repo is
`fvtt-mcp-dnd5e/.claude/skills/_shared/campaign-repo.md` in the Open Roll 5e suite
(`fvtt-suite-openroll5e`). Nothing here needs to run again; the map is kept so the archive is
legible.

| Tool (repo · MCP server) | What it used here |
| --- | --- |
| **fvtt-mcp-dnd5e** · `foundry-greenrest5e` (the live table world) / `foundry-local5e` (a stale mirror) | The Foundry bridge for world `the-broken-heart-of-greenrest`. `plot-drift-check`, `session-audit`, `bestiary-builder`, `tom-cartos-import` and the build skills read `plot/`, `plans/`, `sessions/`, `campaign.json` and `conventions/`. |
| **fvtt-mcp-sessionscribe** · `sessionscribe` | `session-scribe`: Craig recording + Foundry chat → `sessions/<date>/` and `party-snapshots/`, per `campaign.json` and `STYLE.md`. |
| **fvtt-mcp-imagegen** · `imagegen` | `illustration-builder`: read `art/SHELF.md`; approved pieces are in `art/`. |

Two scripts are this repo's own: `scripts/public-scrub.mjs` (what was removed for publication,
re-runnable) and `scripts/render-session-docs.mjs` (the session PDFs the scribe never made,
rendered the way it would have).

## Filing rules

The same as the campaign template's, plus one archive folder (`foundry/`). In short:

1. **Every document has exactly one home** — the table below. Anything else goes in `inbox/`.
   Never add a root file or folder; propose one instead.
2. **No versions in filenames.** git is the history. No `v2`, `revised`, `final`, `handoff`, or
   dates outside `sessions/` and `party-snapshots/`.
3. **Markdown is the source; Word and PDF are views.** Exports go to `out/` (not committed). The
   exceptions are `book/`, where the PDF *is* the deliverable and is committed beside its source,
   and `sessions/`, where each record's PDF is committed beside its markdown as part of the record.
4. **Canon lives in `plot/` only** (this campaign never grew a `world/`; its cast lives in
   `plot/plot.md` §3–4 and the campaign is over, so `world/` stays empty).
5. **Update in place; retire by deleting.** No pointer stubs, no archive folders.
6. **Generated folders are tool-owned:** `sessions/`, `party-snapshots/`.
7. **Names:** lowercase kebab-case `.md`; plans are `plans/session-NN-<slug>.md`, a table script
   is a section of the plan, not a sibling. `npm run check` enforces this.

### Where things go

| It is… | It goes in |
| --- | --- |
| The story spine and canon | `plot/plot.md` — the ONE file |
| Prep for one session | `plans/session-NN-<slug>.md` (frozen once played) |
| A standing rule — Foundry building, house rules, table conventions | `conventions/<topic>.md` |
| House style for the session record | `STYLE.md` |
| Tool facts (party, journals, speakers, outputs) | `campaign.json` |
| Approved art + the art rules | `art/` + `art/SHELF.md` |
| Source battlemaps | `maps/` |
| Session records, party snapshots | `sessions/`, `party-snapshots/` |
| **The finished chronicle** | **`book/`** — HTML source, `parts/`, `img/`, `build.py`, and the PDF |
| The Foundry world as it ended — our uploaded assets and every world document as JSON | `foundry/` (see `foundry/README.md`) |
| Where things stand | `STATUS.md` |
| The licence | `LICENSE` (CC BY-NC 4.0 for what is ours; `README.md` says what is not) |
| A Word/PDF export | `out/` (not committed) |
| Don't know yet | `inbox/` — triaged to empty |

## Sync

None. The repo is final; nothing pushes it. `sync.ps1` and `sync-repos.txt` stay only so the layout
matches the template.
