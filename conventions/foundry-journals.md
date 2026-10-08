# Journals: one journal per kind, a page per thing

**Never one journal per monster, session, PC or handout.** Each kind of thing is one journal with a
page per entry, pages sorted alphabetically (or by their `Session N` prefix). The world's journal
sidebar as the campaign ended:

| Folder | Journals | Who sees it |
| --- | --- | --- |
| **Adventure Log** `#3a7d44` | **Session Diary** (a page per session, `Session N — <title>`, the date in the body) · **Bestiary** (a page per creature) · **Player Backstories** (a page per PC) · **Player Handouts** (a page per handout) · **What You Know** (the players' catch-up on what they've learned) · **Scenes from the Road** | Players can open them; individual pages can be GM-only |
| **Player Handouts** `#3e8e7e` | One journal per illustrated story beat shown to the table — the Widow Fen's first sight and parlor, Veck's cell, the Drowned Temple, the Dreamer and Corin, the gilt-framed portrait | Revealed when the beat is played |
| **GM Notes** `#7d3a3a` | A GM key per chapter, 01–05 (`NN <Chapter> — GM Key`, a page per location) | GM only |
| **GM Quick Ref** `#7d3a3a` | One-page table references: encounter cards, the main cast, the Church of the Earthmother | GM only |
| **09 - Conclusion** `#b5577a` | The finale's beats: Oswin pleads, the fourth dream, the Duskheart's offer, the Heart Knot | GM only |

`The Web of Greenrest` (the GM's relationship web) and the `✦ Title Card` sit at the root.

- **Bestiary** — art plus the Monster Manual *narrative* only, never the stat block, built with the
  `bestiary-builder` skill (`campaign.json` → `journals.bestiary`). **A page goes in only after the
  party has fought the thing.** A creature they haven't met yet can be staged as a GM-only page
  inside the open journal.
- **Session Diary** — written by `session-scribe` after each session (`campaign.json` →
  `journals.sessionDiary`; style in `STYLE.md`).
- **Player Handouts** (the journal) — also carries *The Buildings of Greenrest*: its five village
  pages ride along as GM-only pages.
- **Merge rule** (when consolidating stray journals): a single-page source donates its journal *name*
  to the page; a multi-page source keeps its page names.
- **Mixed visibility:** the journal entry is player-observable and each page carries its own
  ownership, so GM-only pages can sit inside a journal the players browse.

**Why:** one journal per thing buries the sidebar. One journal per kind keeps it a short list the
players can browse and the GM can scan mid-game.
