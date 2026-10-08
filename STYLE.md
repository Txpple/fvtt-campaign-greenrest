# House style — the session record

The style every file in `sessions/` was written to, by the `session-scribe` skill
(`fvtt-mcp-sessionscribe`), following `fvtt-mcp-dnd5e/.claude/skills/_shared/campaign-repo.md`. The
facts (roster, journal names, output set) are in `campaign.json`; this file is taste.
The next campaign's `STYLE.md` carries the same rules forward without Greenrest's names.

## The output set

Four documents, each as HTML **and** PDF, every session: **1 player recap · 2 combat stats · 3 GM
notes — story · 4 GM notes — mechanics** (`recap`, `combat-log`, `gm-notes-story`,
`gm-notes-mechanics`). Sessions 1–6 predate the split and have a single `gm-notes.md` (see
`sessions/README.md`).

- `gm-notes-story` — **plot only**: what changed in the world, what is now canon (said out loud, on
  tape), promises made and their status, threads left open, loot with story weight, quotes of the
  night. Nothing about the system or the table.
- `gm-notes-mechanics` — **system and table only**: the bookkeeping checklist to apply to the live
  world (levels, items, coin, renames), automation that cost time ranked by minutes lost, rulings
  made so they stay consistent, player / table observations, a pointer to the combat report.

PDFs are rendered with Edge headless, which honours the print CSS in the templates (one call per
document, `-Wait`):

```powershell
Start-Process "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" -Wait -NoNewWindow `
  -ArgumentList @("--headless=new","--disable-gpu","--no-pdf-header-footer",
                  "--print-to-pdf=`"<SDIR>\recap.pdf`"","`"file:///<SDIR as forward slashes>/recap.html`"")
```

A PDF under ~20 KB means the page didn't load.

### Clean page breaks

- **recap.pdf renders from a print twin, `recap-print.html`**, never from recap.html: the same text
  in a block layout (no tables) on a white page. Chrome fragments text inside table cells across
  pages; recap.html stays the email-safe version.
- **Nothing splits across a page:** paragraphs, list items, quotes, figures and endmatter entries are
  `break-inside: avoid`; every `h2` is glued to its first block — and to a picture straight after it —
  so no heading sits alone at a page foot. A short section moves to the next page whole.
- **Endmatter as entries:** Spoils and Deeds are a bold title line, then the text (capitalised), with a
  thin rule between entries; quotes are the line, then the attribution. The endmatter flows on after
  the story under a double rule, with no forced page break before it.
- **Page numbers** in the footer (`@page { @bottom-center }`), none on the first page.
- The combat log and both GM notes follow the same break rules (tables, callouts and an intro line
  that leads into a table or chart stay together).
- **Every page is looked at before shipping** — rendered with pdf.js in the Browser pane over a
  localhost server and paged through.

## recap.html — the player recap

Reference implementations: `sessions/2026-07-14/recap.html` (the register) and
`sessions/2026-07-07/recap.html` (structure and endmatter; its prose runs a notch more florid than
the register).

- **Third person, always.** The recap is a chronicle about the party, never addressed to them: "all
  four of them dreamed", "the priest came up to meet them", "the mayor bought them eggs", "level
  six, all four of them". The only permitted "you/your/we/our" is inside quoted or italicised
  dialogue. **Before shipping, grep the HTML for `\b(you|your|yours|we|our|us)\b` and check every
  hit is inside a quote** — reported speech ("the priest argued that your power…") counts as a slip;
  rewrite it as third-person reported speech ("that Thomas's power…"). The Session Diary page
  follows the same rule.
- **Dice as narrative, never numerals.** The blow-by-blow of checks, crits, failed saves and big hits
  is woven into the prose at full detail, but the words carry the magnitude, not the numbers. Crit →
  "his blade found the perfect seam"; nat-20 lore check → "his temple schooling surfaced with
  perfect, word-for-word clarity"; failed save → "neither had the will to shake it"; near-death →
  "beaten to the ragged edge of standing." No raw numerals in the prose.
- **Name the mechanics.** When a PC or monster invokes a spell, feature, feat, maneuver or mastery,
  call it by its game name — Magic Missile, Vow of Enmity, Relentless Endurance, Thunderous Smite,
  Action Surge, Hunter's Mark, Displacement — wrapped in a bit of flavour but direct about what was
  used. Never narrate around the ability ("magic that cannot miss", "his oath's enmity").
  **Styling:** ability / spell / feature names are *italics* in Title Case when named or invoked —
  "<em>Magic Missile</em>", "his <em>Relentless Endurance</em> refused the fall". Once a trait has
  been introduced and the prose refers to it as a phenomenon, it drops to lowercase — "its light
  tore the <em>displacement</em> off the pack". Named magic items and NPCs keep plain Title Case
  (First Light, Lantern of Revealing, Lae'zel).
- **Never surface the DM's narration prompts.** When the DM asks a player to narrate ("how would you
  like to kill him?"), the output of that exchange is the fiction — rendered as straight narration or
  quote, never "Thomas, asked how he'd like to finish the alpha". The ask is table process.
- **Dreams get bullets and specificity.** The dream sequences are the campaign's reveal engine and
  are never compressed into a summary paragraph: a short framing paragraph, then one bullet per
  dreamer carrying the specific content — the imagery, the named people (Lae'zel, the sister, the
  wife and children, the village elders), the emotional turn, and any anomalies (Jetten's moonstone
  necklace glowing, dreaming in trance). Same treatment in the Session Diary page. A dreamless night
  is itself a called-out beat.
- **Fun endmatter, in-character only.** After Spoils & Progress come **Quotable Quotes** (the night's
  best verbatim table lines with dry one-line attributions — in-character / in-world only) and
  **Deeds of the Day** (in-world superlative awards, one per PC or so, e.g. "Arrow of the Day",
  "Finest Masonry in Faerûn"). No meta, no player names, no technical-issues talk anywhere in
  recap.html — UI / audio / browser troubles belong in gm-notes-mechanics only.
- **Register: narrative, not purple.** Plain direct sentences; one flourish per paragraph is plenty.
  Keep the beats and the humour, lose the ornament ("on the lair's own dark heartbeat", "truer than
  true" are the kind of phrase that goes).
- **Combat register: punchy.** Short sentences, hard verbs, one beat per sentence, momentum over
  ornament. "Thunder cracked across the ruin. The beast flew backward through Morgash's reach — his
  opportunity strike killed it in the air." Long braided clauses and lyrical similes are for the
  quiet scenes. Named ability + hard verb + consequence is the unit of combat prose.
- **Combat beats are factually precise and credit smart play.** Who killed what is not
  style-flexible (Gren's magic missiles killed the Broodmother, not the wisp — the wisp escaped;
  Morgash read the ettercap's glances and dashed to block the door *before* the Broodmother burst
  through). When a sentence about attacking X sits next to a kill of Y, the target of each is
  unmistakable.
- **Found-item text is quoted verbatim when it matters.** A plot-loaded item gets its full in-world
  description — e.g. the Greenrest Tonic's vial description plus its label line ("One swallow,
  seventh-day, as ever. — Selma.") — then who read it aloud, before any paraphrase.
- `recap.md` (the canonical GM record) is exempt: exact rolls and damage numbers are welcome there.

### Illustrations

The recap is **illustrated end to end** from session 8 on: the boss fight's big beats *and* the town
and roleplay moments, roughly one picture per story section (session 8: the dream, the children's
game, Selma and the finger, the squirrels, then four from the dragon fight). Captions are in-world
and number-free.

- **Every scene is grounded in the world:** the battlemap for the terrain, PC portraits for the
  party, the world's NPC tokens and portraits for everyone else, and the handout art for buildings
  (the Long Rest's picture is in *Player Handouts*), following `art/SHELF.md` and the
  illustration-builder loop — canon check, then the flaw pass at zoom, every image.
- **Where it happened is canon.** The location of every scene is checked against the transcript
  before prompting (the children's game happened outside the Long Rest, in the field beside the inn
  — not under the tree in the square).
- Finals live in `art/`; 1600-px JPEG copies in `sessions/<date>/img/`, numbered in reading order.

## The combat log

Reference: `sessions/2026-08-31/combat-stats.md` + the HTML built from the skill's
`templates/combat-log.html`. It is **GM-facing**, so exact numerals are wanted here — the
no-numerals rule belongs to recap.html only.

- **Open on the one headline fact, in numbers.** Session 6's was "one creature did 90% of the
  damage to the party." The rest of the report supports it.
- **A required "what the buffs and features actually bought" section.** For every spell, maneuver,
  mastery and feat that touched a number: what did it *produce*? Damage added, damage prevented,
  misses converted, saves flipped, outcomes changed. The counterfactual is computed where it exists
  — *Careful Spell prevented 71 damage for one sorcery point* is the model line, arrived at by
  summing what each ally would have taken. **Duds are named as plainly as the winners** — "Innate
  Sorcery raised the DC 15→16 and changed no outcome" is exactly as useful as a win.
- **When the party gets wrecked, the probability is worked off the sheets before anything is called
  a balance problem.** Session 6's near-TPK was a ~1-in-90 run of saves, not a broken statblock.
  Quote the odds.
- **Charts:** single-series magnitude bars only, one accent hue, direct-labelled with the value, no
  legend, never a two-hue categorical set. `.track` / `.fill` must be `display:block` or the bars
  silently do not render.
- **Traceability:** every number comes from the ledger or the transcript; monster token UUIDs are
  resolved to names by hand.
- **No table / tech / meta talk.** Prompt timeouts, module bugs and player names stay in
  gm-notes-mechanics — including *suspected* automation faults dressed as a dud. A buff that measured
  zero because of a suspected bug goes to the mechanics notes, not the duds list.

## The Session Diary page

After recap.html, one player-visible text page is appended to the world's single **Session Diary**
journal (folder *Adventure Log*) — never a new journal per session (`conventions/foundry-journals.md`).
Page name = `Session N — <title>`, e.g. "Session 3 — The Road Interlude"; the date lives in the page
body; the pages sort by name, so the `Session N` prefix does the work. Content is the `mcp-journal`
format (p.lead TL;DR → h2.spaced story beats → readaloud blocks for item / lore quotes → "Where Things
Stand" ul), the same player-safe boundary, the same third-person rule and the same register as
recap.html — the in-game handout twin of the email recap, minus Quotable Quotes / Deeds of the Day.

## Party snapshots

Two artifacts per snapshot date, both committed:

- **Full JSON backup** — for each party PC, `manage-actors` `export` →
  `party-snapshots/YYYY-MM-DD/<PC>.json`. The roster is the four in `campaign.json`; never Salyth (a
  DM test PC).
- **Human digest** — `party-snapshots/YYYY-MM-DD.md` from the live sheets. Per PC: class / subclass +
  level, HP max, AC, the six ability scores, feats / ASIs taken, weapon masteries, spell slots,
  attuned + equipped magic items, notable consumables **with their remaining charges / doses /
  counts**. Format reference: `party-snapshots/2026-08-31.md`.

Craig ↔ Foundry clock skew for pairing the recording with the chat log is `sessions.skewSeconds: 0`
in `campaign.json`.
