# The Foundry world, backed up

A copy of the live world `the-broken-heart-of-greenrest` (Foundry 14.368, dnd5e 6.0.5, on Molten
Hosting) as the campaign ended: everything we made for it. Taken 2026-10-01 through the
`foundry-greenrest5e` bridge and the world's public asset URLs.

```
foundry/
  assets/      our uploaded files, at their Data-relative paths (assets/ = the Data root)
    worlds/the-broken-heart-of-greenrest/world.json
    worlds/the-broken-heart-of-greenrest/assets/   art · audio · handouts · hearts · icons · journal
                                                   maps · portraits · sfx · tiles · tokens · ui
    assets/tokens/ · assets/mcp/                   uploads outside the world folder (blight token,
                                                   a commoner token, the GM users' avatars)
  documents/   one JSON file per world document, by collection
    actors/ (160) · items/ (73) · journal/ (30) · scenes/ (51) · macros/ (96) · tables/ (2)
    playlists/ (11) · folders/ (77) · settings/ (130)
```

Documents are the Foundry CLI's unpack of the world's LevelDB collections (`fvtt package unpack`
format: `<name>_<id>.json`, embedded documents inline — an actor's items and effects, a scene's
tokens, tiles, walls, lights and regions, a journal's pages). Asset paths inside them are
Data-relative, so `assets/` drops straight back into a Foundry `Data/` folder and every reference to
our own files resolves.

## What is not here

- **Module and system content** — the D&D books (PHB, DMG, MM, Heroes of Faerûn), JB2A, PSFX,
  core `icons/`, `systems/dnd5e/`, and the `soundscape-sfx/` library of the soundscape house
  module. Documents still point at them; they come back with the modules.
- **Tom Cartos map packs** — the imported maps under `assets/tom-cartos/` and the pack props named
  `TC_*` (tiles, chests). Re-import the packs to restore them (`conventions/map-packs.md`).
- **Generated or transient data** — scene thumbnails (Foundry rebuilds them), fog of war, combats,
  chat messages (each session's chat export is in `sessions/<date>/chatlog.json`).
- **Users** — logins and password hashes stay on the server.
- **Third-party module settings** (Midi-QOL, Automated Animations, Dice So Nice, Monk's, …) —
  `settings/` keeps `core.*`, `dnd5e.*` and the house modules' `fvtt-mod-*` only.
- **Module-made documents** — the Sequencer database journal and the Midi-QOL / DAE sample macros.
- **Superseded uploads** — the unused earlier token variants of Jetten and Invictus and the first
  Midnight icon. The world uses `jetten-v5.png`, `paladin-v2.png` and `midnight-longsword-v2.png`;
  those names are kept because the documents reference them.

## What the public copy leaves out

This is the published copy of the backup; `scripts/public-scrub.mjs` (re-runnable) made two
changes to it:

- **Licensed book text is stubbed.** Every embedded item, feature, spell and effect whose
  `_stats.compendiumSource` points into a purchased D&D book module (`dnd-players-handbook`,
  `dnd-dungeon-masters-guide`, `dnd-monster-manual`, `dnd-heroes-faerun`) keeps its name, type,
  art, mechanics and source UUID, but its prose fields (`system.description.value` / `.chat`,
  unidentified description, biography, effect descriptions) are empty. Restore the world with those
  modules installed and re-import from the compendia to get the text back; the UUIDs say where.
  1,377 descriptions in `documents/` and the party snapshots were blanked this way.
- **Tabletop Audio is gone.** The ten ambience tracks under `assets/.../assets/audio/` were
  Tabletop Audio's, not ours; the playlist documents keep their paths, so dropping the files back in
  restores the playlists. The two short turn-alert cues in `assets/sfx/` stay.

## Restoring

1. Install Foundry 14 with dnd5e 6.x, the same modules, and the Tom Cartos packs.
2. Copy `assets/` into the new install's `Data/`.
3. Pack each `documents/<collection>/` back into the world's LevelDB with the Foundry CLI
   (`fvtt package pack`), or import single documents through the sidebar's *Import Data*.
