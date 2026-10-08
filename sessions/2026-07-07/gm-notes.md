# GM notes — Session 1 (2026-07-07)

## Loose threads & hooks live at the table

- **The Traveller's Letter is UNREAD.** Jetten pocketed it (card posted 3× but contents never
  read aloud). It's addressed "in a careful hand to someone in Daggerford." Decide what's in it
  before someone opens it at the campfire.
- **The Waterdhavian merchant.** Jetten recognized the dead high-elf woman as a person of
  bourgeois importance from Waterdeep; her human companion and two Lathanderite guards died with
  her. The party buried them and know roughly who she was — a name/consequence (family, guild,
  reward, someone waiting in Daggerford — possibly the letter's addressee) is an open door.
- **"Driven here from some purpose."** Thomas's History 17 got the seeded line that hobgoblins
  don't normally raid the Trade Way and these were scouring unfamiliar land. The party clocked it
  ("it's abnormal for hobgoblins to attack a trade route this close to town"). Whatever the
  intended truth is, it's now on the record.
- **Brother Tobin's blessing** landed as intended — the "some fields cannot fail, others starve a
  mile off" line about Chauntea's strange gifts is the first breadcrumb of the valley's wrongness,
  delivered and player-visible. Barley-Token is on Jetten's sheet.
- **Pibb & Josk, forgers,** rode north to Daggerford unmolested. Thomas knows every legitimate
  document-dealer in town and knows they aren't one. Recurring-NPC potential.
- **The prisoner died with questions unasked** — Thomas explicitly wanted more interrogation time
  and Jetten executed the prisoner first. Minor intra-party friction seed; also the party never
  learned whether anything else lairs deeper in the cave (there isn't — DM said natural cave,
  nothing else of interest).

## Bookkeeping — applied at the table (verify in world)

- **Vault split (Item Piles, ~00:23–00:27):** Morgash — Ember-Touched Greatsword, Keoghtom's
  Ointment, 207 gp (left old greatsword in chest) · Gren — Wand of the War Mage +1, Periapt of
  Wound Closure, 207 gp · Thomas — +1 Shield, Stone of Good Luck, Cloak of Protection, 206 gp
  (left spare shield) · Jetten — Quiver of Ehlonna, 2× +1 Dagger, 414 gp.
- **Cave loot (Item Piles, ~02:32–02:44):** Thomas — Rose-Gold Longsword (**attuned overnight →
  identified as First Light**), Hooded Lantern, Rations, Small Cask of Southern Wine, Bolt of
  Fine Cloth, Backpack, Traveler's Clothes · Jetten — Traveller's Letter, Healer's Kit · Gren —
  Driftglobe, Pouch of Cut Gems (90 gp when sold) · Morgash — Small Cask of Southern Wine,
  Potion of Healing · coin pouch split: 15 gp + 10 sp each.
- **No level-up** (milestone = per shard; 0 shards). All four PCs long rested (new day).
- **✅ NaN-attunement watch — AUDIT RUN 2026-07-08, corruption confirmed + repaired:** 16 fresh
  `attunement:"NaN"` (every non-loot item the two Item Piles batches moved — 14 across all four
  PCs + the old Greatsword/Shield deposited in the vault pile). All captured pre-scrub, then
  repaired to correct values; flags forensic pinned the cause to the Item Piles transfer path
  itself (18/18 corrupted items carry its transfer flag; controls clean; v3.3.2). Evidence in
  the notes repo: `evidence/nan-attunement-2026-07-08-session1-loot.md`.
  **DM follow-ups from the audit:** ① Thomas must ATTUNE Cloak of Protection + Stone of Good
  Luck — the corruption had been leaking their bonuses without attunement; his AC drops to 20
  until he attunes (First Light + both = exactly his 3 slots). ② Sheet vs notes discrepancies:
  Jetten has ONE +1 Dagger (notes say 2×); the vault sharing log recorded Jetten taking 207 gp
  (notes say 414). ③ Re-run the audit after any session with Item Piles transfers.

## Rules & house rulings made at the table (now precedent)

- **All healing is doubled** (stated as standing house rule; Jetten's Healing Word 2d4+3=5 → 10
  applied, hobgoblin shaman's 5 also doubled? — DM applied doubling to PC healing; confirm it's
  meant to apply to monsters too).
- **Re-roll rule:** a roll made with the wrong mode (adv/dis) is re-rolled ("if you don't do a
  roll right, you have to do it over").
- **Non-lethal melee** (2024 KO rule) used for the pommel-strike subdual; Gren's Intimidation
  ran as opposed check vs. the hobgoblin's Wisdom.
- DM discretion advantage examples set: Thomas gets advantage on Insight/Investigation in his
  scribe wheelhouse (forgers, documents, well-appointed guards).

## Fix-list (DM said "I have a whole list of stuff to fix" — observed items)

- **Hobgoblin Archer longbow had a bogus `3d4` poison rider** — caused a monster crit for ~15 on
  Morgash, corrected live to 8. DM fixed the actor mid-fight; **verify the Warrior/Captain items
  too** (the Captain's greatsword card also showed a `1d6` poison rider — intended? The Shaman's
  Vine Staff poison is legit).
- **Bless didn't expire on long rest** ("How interesting — the Bless spells still on despite you
  all rested") — stale effect cleanup needed.
- **Light spell expired prematurely** mid-dungeon per Gren ("it should not have expired") — recast.
- **Combat tracker glitched** when adding combatants (DM had to work around); the Shaman was
  meant to be in from the start but entered the tracker late — in-fiction it arrived mid-fight.
- **Gren's metamagic roster needs reconciling:** player expected Subtle Spell; sheet had Careful
  (not Subtle) at first, then DM found Subtle "in other features" sorted oddly; in-fight Gren said
  "I don't have Twin Spell." World-state doc says Careful+Twinned — sheet, player intent, and doc
  disagree. Settle the two options officially (note: Empowered was the standing suggestion for
  next level).
- **Browser support:** Safari and DuckDuckGo broke card pop-ups/UI for Robert and Drew — both
  moved to Chrome and everything worked. Tell players: **Chrome only.**
- **Vision setting** was wrong on at least one token ("Vision was not set properly") — fixed live.
- **Jetten's name:** canon is **"Jetten Elisedil"** (the actor sheet is master). Actor sheet, bio
  journal, Thomas's backstory and chat alias all read "Elisedil"; placed-token nameplates read
  "Jetten" per the first-name house convention. The "Ellisedell" reading above was a typo in a prep
  note — it never existed in the world.
- Discord audio: Drew's echo fixed via Voice Isolation setting; he also had one-way audio twice
  (log out/in fixed it). First-session noise, no action needed beyond Chrome note.

## Quotes of the night

- *"I take no orders from no one but my captain. … I am captain now."* — the last hobgoblin,
  pointing at the corpse, minutes before Jetten's shortsword
- *"The lady's been strange with her gifts of late. Some fields simply cannot fail; others starve
  a mile off."* — Brother Tobin, priest of Chauntea
- *"I know that you want to retire, but perhaps in the hag coven we can find you a spouse. Seems
  like the perfect place for you."* — Gren, to Morgash
- *"They will feel the wrath, and you will have your back. Vengeance, I swear."* — Morgash
- *"The blessings of Moonbow be upon you. Look at us — orcs and elves being friends."* — Jetten,
  healing Morgash mid-fight
- *"Light a candle, don't curse the darkness, as they say."* — Jetten, as Gren's Light blew his
  stealth
- *"Man, if I keep rolling like this, I need some more whiskey."* — Jetten
- *"Finally hit something. Finally!"* — Morgash, after an evening of Graze chip damage
- *"I won't take anything from the dead who follow the same god as me — out of respect."* — Thomas

## Scheduling

- Next session **Tuesday 2026-07-14** (Tuesday confirmed as the slot).
- Two players travel in the weeks after the 14th; plan a break or drop-in coverage.
