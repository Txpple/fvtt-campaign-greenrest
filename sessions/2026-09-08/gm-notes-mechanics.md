# Session 7 — GM Notes · Mechanics (2026-09-08)

_The system, the sheets, and the table: bookkeeping to apply, automation that cost time,
rulings to keep consistent, and player-side observations. Plot is in `gm-notes-story.md`;
the combat numbers are in `combat-stats.md`._

---

## 1 · Bookkeeping to apply before Monday

- [ ] **Level 6, all four PCs.**
- [x] **Actor renamed** `Thomas A. Invictus` → **`Justiciar Invictus`** (id `dCMYjnrBUrdCqXwo`).
      This session's snapshot is `Justiciar Invictus.json`; every earlier one is
      `Thomas A. Invictus.json`. Same actor — keep that in mind when diffing.
- [x] **Duskheart** — on Jetten, attuned at the table.
- [x] **Vesper Staff** — on Gren. Attunement line changed tonight to **Cleric, Sorcerer, or
      Wizard** on both his copy and the world item (it read "Cleric or Wizard" and excluded him).
- [ ] **Robe of Protection** — Morgash said he'd drop the **Periapt of Wound Closure** to attune.
      Verify: he was at Maul of Momentum + Graveheart + Periapt.
- [ ] **Sera's Longbow** — Selma handed it back; Morgash claimed it. Confirm it left her
      inventory and is on his sheet.
- [ ] **Renlow Veck's Signet Ring** (Morgash, `Xo6UU8qyO0VQURwR`) — created pre-session as a
      bare ring. At the table Morgash took **the whole finger**. Rename/redescribe, or leave as
      flavour. One-line edit either way.
- [x] **Temple loot** — seven items, ~1,500 gp, in the party stash.
- [ ] **Party coin** — ~1,500 gp in from the hag hoard, 300 gp out for six Potions of Healing.
      Reconcile the stash.
- [ ] **Potions** — Jetten 2, Invictus 1, Morgash 1, Gren kept 2.
- [ ] **Heroic Inspiration for Morgash.** You said mid-fight that you *should* have given him one
      for the grapple argument and didn't. Award it at the top of session 8.

## 2 · Automation that cost time — fix before Monday

Ranked by minutes lost. Gren will do all of this again next session.

1. **Careful Spell + Fireball in Battle Flow.** Both Fireballs auto-rolled Dex saves for the
   *excluded* allies and auto-applied damage to them. You reverted four applications by hand
   the first time and five the second — and **the second revert is what un-killed Gren**, who
   went to 0 from his own spell through a timer-rolled save. This was the single biggest time
   sink of the night: two casts, two rounds of "let me undo that," and one resurrection-by-undo.
   Careful Spell needs to actually exclude the chosen creatures from the save prompt, or the
   prompt needs to not auto-roll.
2. **The 24-second decision timer auto-resolves saves.** It fired on two Fireball saves, a
   Spirit Guardians save, and a shield-bash offer. Auto-rolling a *save* on timeout is the
   dangerous case — it is how Gren dropped. Consider a longer timer, or timeout = prompt again,
   not timeout = roll.
3. **Spirit Guardians rolled a save for Gren out of range.** You flagged it as a bug and
   reverted. The emanation is picking up tokens outside the aura, or the wall isn't blocking.
4. **Stale Shield effect after a revert.** Because the rewind left a *Shield* effect on Gren, the
   reaction wasn't offered on the next hit and you reverted that damage by hand too. Reverts
   should clear effects they applied.
5. **Private rolls toggled on by accident** at the start of the floor fight. Jetten caught it.
   Cosmetic, but it confused two turns.

## 3 · Rulings made — keep consistent

- **Divine Smite is melee-weapon only.** No javelin smites (Invictus asked).
- **Find Steed is largely flavour indoors.** The steed doesn't come into the dungeon.
- **Dreadful Strike:** once per turn, uses = Wisdom modifier.
- **Prayer of Healing:** ten-minute cast, grants short-rest benefits. Used mid-dungeon; it
  materially changed the boss fight (52 HP across 8 hit dice plus superiority dice and sorcery
  points back). Expect it every session now.
- **Sorcerous Restoration** costs five sorcery points for a 3rd-level slot. Gren used the Pearl
  of Power instead — which became Fireball #2.
- **Non-proficiency with a tool kit** = no proficiency bonus, not inability to use it.
- **Bog Staff is not magical.** 1d8 plus stale bullywug poison, no +2. Told Gren.
- **Careful Spell RAW** is what you ruled: excluded allies take *nothing*. The automation is
  what's wrong, not the ruling.
- **Vow of Enmity** was pointed out to Invictus and never used. Worth a reminder — it's free
  advantage for a minute.

## 4 · Player and table observations

- **Robert isn't using his hotbar.** Every Lay on Hands and every Midnight attack was a sheet
  dig. You suggested dragging the common ones to the bar; it'll cost real time again at level 6
  with more options.
- **Anthony (Morgash)** generated 18 timed decisions — the most at the table — at a mid-pack
  12.5s average, and carried two roleplay scenes. The martial kit is fully in use.
- **Drew (Jetten)** is the fastest seat by a distance: 4.6s average, halved since session 6.
- **Tom (Gren)** is exporting his sheet to Claude for level-up help. You warned him it mixes
  2014 and 2024 rules; it will come up again at level 6 for everyone.
- **Craig flagged an encode warning on your track.** Audio came through fine; nothing lost.
- **Pacing:** 3h26m, combat began at 1h51m, nobody minded. The talk *was* the session.

## 5 · Combat observations — pointer

Full report in `combat-stats.md` / `combat-log.html`. The two things worth carrying forward:

- **Careful Spell prevented 188 damage for two sorcery points** — nearly the party's whole
  damage-taken total (201). It's the best spend two sessions running; see §2 for why it's also
  the biggest time cost.
- **Topple went 2 for 7** against DC 15 Con saves (86% last session). Sharran statblocks have
  good Con; the Maul is not the auto-prone it was against bullywugs.
