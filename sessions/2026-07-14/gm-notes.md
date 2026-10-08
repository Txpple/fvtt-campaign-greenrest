# GM notes — Session 2 (2026-07-14)

## Loose threads & hooks live at the table

- **The will-o'-wisp ESCAPED** — vanished mid-fight and never resurfaced (Lantern of Revealing
  swept the hall: gone). Gren swore an on-record vendetta: *"It tricked us — it, and all of its
  kind, in the future."* A fled wisp is a sequel hook by design (GM key). Decide where it
  drifts next.
- **The Greenrest Tonic is in Thomas's pack and the label was read aloud** — the party now
  knows Greenrest brews a dream-suppressing draught ("sleeps utterly, without dreams, for seven
  nights… nor say why anyone would brew such a thing") *before ever seeing the village*. First
  domino of the valley's secret. Expect them to ask Selma about it — or worse, drink it.
- **Goldthorn's mask is OFF** — identified at the table and attuned by Jetten (Faerie Fire
  1/day, the "worthy hand" lore read aloud). **Dawnthorn no longer exists in the live world**
  (verified post-session): the world Items directory holds exactly ONE Gilded Scimitar — the
  `Hidden Shrine` folder master `LsTqXwIdBNwaYh9K`, trueName **Goldthorn** — plus Jetten's
  attuned copy. world-state.md's "TWO masked scimitars (Dawnthorn + Goldthorn)" entry is stale
  cache (world-state syncs on request only — update it next sync). If Dawnthorn is meant to
  exist somewhere, it needs re-authoring.
- **The dead fey/elf beside the loot** — months dead, dagger still on the body (Goldthorn's
  "bearer lost to the webs"?). Unnamed, unexamined past a glance. A name/backstory is an open
  door — ties naturally to the Hidden Shrine loot's provenance.
- **The lintel line was never found.** "…a light, and a road home" (Ancient Structure GM page)
  went unread — Jetten's Perception 15 got only "etchings you can't possibly read." The
  thin-place/fey-veil layer also stayed hidden (Thomas Arcana 12 and 7 both missed the DC 15).
  The mystery is intact for a return visit — or stays lost, per the "longer thread than one
  night" note.
- **The blight-source thread is live.** Gren: "we need to find its source"; Morgash tried to
  backtrail (Survival 14). The blackened-sap trail from the GM key was never surfaced. The
  corruption-seep line ("it seeped in from somewhere deeper") remains available foreshadowing.
- **The larder had no living victims** — bones picked clean (Medicine 12/5 told them nothing
  more). The rescue-a-witness lever went unused; no survivor testimony about how the lights
  work.
- **The watchtower** overlooking Greenrest (~300 yards) was explicitly offered as a next-session
  option before descending. Prep it either way.

## Bookkeeping — applied at the table (verify in world)

- **Loot (Item Piles, ~10:01–10:03 PM):** Jetten — Gilded Scimitar (**identified → Goldthorn,
  attuned overnight**) + Cloak of Elvenkind · Thomas — Lantern of Revealing + A Dose of
  Greenrest Tonic · Morgash — Potion of Healing · **67 gp each ×4** (pile auto-split).
- **⚠️ LEVEL 4 — milestone hit (reached Greenrest).** Players' homework before 2026-08-11:
  self-serve level-up to 4 in Foundry (feat/ASI choice at 4). Expect drive-by logins while
  the DM is idle — **have level-up support ready** (level-up-pc tool / inspect-pc-advancement),
  and verify all four sheets say 4 before next session.
- **Jetten recovered half his spent arrows** (+4 back to quiver) — he called it out explicitly;
  verify count.
- Long rest completed by all four (temple, night of day two). Keoghtom's Ointment: **2 doses
  consumed** by Morgash (of the jar's supply — verify remaining uses). Thomas spent 15 of his
  Lay on Hands pool; Gren burned both 2nd-level slots + sorcery points; all reset on the rest.
- **Lantern of Revealing:** Thomas equipped it; at the table it was treated as attunable
  ("another one of these items that somebody could attune to"). RAW (2024 DMG) it requires
  **no attunement** — decide before someone wastes a slot on it.
- **⚠️ NaN-attunement audit (2026-07-14, post-session): CORRUPTION RECURRED — found + repaired
  same night.** The `--transfer` tripwire probe passed (**BEHAVIOR-OK**, served file healthy),
  but 3 of the 5 table-transferred items arrived `attunement:"NaN"` anyway: **Goldthorn**
  (→ repaired to "required", attuned stays true), **Cloak of Elvenkind** (→ "required"),
  **Lantern of Revealing** (→ "" — 2024 needs no attunement; this bugged value is also why it
  looked attunable at the table). Tonic + Potion clean (the potion merged into an existing
  stack, bypassing the buggy path). Root cause reading: **the DM's Chrome ran a stale cached
  pre-hotfix module.js** — the transformer executes on the transferring client, so the
  server-side probe can't clear a session by itself. Evidence: notes repo
  `evidence/nan-attunement-2026-07-14-session2-loot.md`.
  **🔒 New standing rule: hard-reload the DM's Foundry tab (Ctrl+Shift+R) before any session
  with Item Piles transfers** — and keep the post-session audit standing (second consecutive
  transfer session that didn't audit clean).

## Rules & rulings made at the table (now precedent)

- **Lair actions introduced** (run at initiative 20, "you can beat it with higher initiative")
  — the wisp entered on the lair beat. First use in this campaign.
- **Cover as attacker penalty:** DM applied **−2 on the attack roll** for half cover / shooting
  through an ally's space (RAW is +2 AC to the target — same math, keep the convention
  consistent).
- **Precision Attack clarified:** adds to the attack roll only, never to damage (came up twice
  with Anthony).
- **Re-roll rule reaffirmed:** Gren re-rolled a Scorching Ray attack made without his advantage
  ("I'll take the risk") — wrong-mode rolls get redone, even fishing for crits.
- **Subtle Spell / Spellfire Burst reading settled:** Spellfire Burst triggers on spending ≥1
  sorcery point as part of a Magic action **or bonus action** — metamagic isn't required to
  arm it; the feature text's phrasing was agreed to be sloppy. (Gren used Subtle+Magic Missile
  anyway for the wisp — fine.)
- **Healing-doubled house rule: not visibly applied this session.** Lay on Hands healed exactly
  the points spent (10, then 5); Healing Word applied as rolled (11); Keoghtom's as rolled
  (10, 14). Either the rule quietly lapsed or nobody flagged it — **confirm whether "all
  healing doubled" still stands** before it matters at low HP.
- 2024 KO/subdual, Sap/Slow/Vex/Graze masteries, Dreadful Strike (2d6 psychic, PB/long rest,
  any turn) all ran clean via the sheet feats built post-session-1.

## Fix-list (observed tech/content issues)

- **Ettercap Multiattack card shows a broken enricher:** "makes one .mmBite0000000000 attack" —
  a mangled UUID/reference in the Multiattack description on the Ettercap actor(s). Fix the
  text on Ettercap (and check Broodling/Broodmother variants).
- **Players can't apply compendium effects to themselves** ("only the GM can do that" — Gren's
  Mage Armor drag failed; DM applied it manually, twice). Decide: raise player permissions for
  effect application, or fold into the automation rollout.
- **Gren's client was pause-blocked at combat start** — world pause (deliberate, anti-wander)
  also blocked his sheet interactions ("my game is paused and I can't get on my character").
  Consider unpausing at initiative, or check whether fvtt-mod-openserver/pause behavior can
  exempt sheet UI.
- **Light spell never mechanically applied to Thomas** — cast twice in the fiction, hand-waved
  at the cave ("we'll just say Thomas has light"). Harmless, but the recurring pattern is
  spell-effect application friction (same root as Mage Armor above).
- **A stray duplicate PC token** appeared when dragging the party onto the forest scene
  ("there's two of you now") — DM cleaned up live; worth a quick scene audit for orphans.
- **Automation rollout planned** (DM, on-record): after ~1–2 more sessions, turn on
  auto-apply damage/riders. Players are now targeting-proficient; this session ran visibly
  smoother than session 1 (carousel, skull icons, initiative gate all praised).
- **Pipeline note (5090 box):** Windows Application Control now blocks the session-scribe
  venv's `python.exe` trampoline. Workaround that worked tonight: run the uv **base**
  interpreter (`AppData\Roaming\uv\python\cpython-3.12.13...\python.exe`) with `PYTHONPATH` →
  venv site-packages and the three `nvidia\*\bin` dirs prepended to PATH. Transcription was
  otherwise flawless (large-v3, 5 tracks in ~11 min).

## Quotes of the night

- *"One of our fairy friends may be in distress — we should investigate."* — Gren, taking the
  bait exactly as designed
- *"How delightful. It was a trap, guys."* — Jetten, spotting the ettercap ambush mid-sneak
- *"You were so great leading us through the woods… what did you roll, like a zero for
  initiative?"* — Jetten, as Morgash followed a day of Survival 23/21 with a natural 1
- *"He was dating Lae'zel for a while… and she dumped him."* — the DM, on Morgash's Baldur's
  Gate years; Morgash: *"She broke my heart."* Gren: *"A little too bony for my likes."*
- *"You don't know shit about will-o'-wisps."* — the DM, adjudicating Thomas's Arcana 7
- *"We're going to call you Thomas the Silent."* — Jetten, after the flat-out crit
- *"Let's not eat the mushrooms, guys."* — Jetten
- *"So cool. You're such an edge lord."* — Jetten, attuning to Goldthorn
- *"We're going to seek vengeance on that will-o'-wisp. It tricked us — it, and all of its
  kind, in the future."* — Gren
- *"This was the learning curve. It's going to get harder now."* — the DM, closing
- Meta but worth keeping: the players spontaneously praised the emailed session summaries
  ("so cool… so thoughtful") — DM: "the whole thing is wired up to Claude."

## Scheduling

- **Next session: Tuesday 2026-08-11, 8:00 PM ET** — Robert put it on his calendar at the
  table; DM will send an email around the date.
- Two players are abroad until **2026-08-10** — "I'll suck it up and deal with the jet lag."
- Between now and then: players level to 4 remotely; DM prep = Greenrest village + watchtower
  + shard-choice fork.

---

**NaN audit result (2026-07-14, post-session):** 3× NaN found on session-2 loot (Goldthorn,
Cloak of Elvenkind, Lantern of Revealing) — **repaired same night**; details in the
Bookkeeping section above and notes repo `evidence/nan-attunement-2026-07-14-session2-loot.md`.

**One more player-facing follow-up from the audit:** Jetten's **Cloak of Elvenkind is not
attuned** (he attuned only Goldthorn) — its stealth/perception magic is dormant until he
spends a slot on it. Worth telling Drew alongside the level-4 homework.
