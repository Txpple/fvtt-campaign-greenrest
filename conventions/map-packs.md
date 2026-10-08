# Map-pack imports: maps only

`campaign.json` → `scenePacks: { "mode": "maps-only", "bornExplored": true }` is the standing mode.
The `tom-cartos-import` skill (`fvtt-mcp-dnd5e`) reads it from there.

- **Scenes only:** walls, doors, lights, mood, teleporters, standalone tiles. **Never** the pack's
  journals, scene→journal links, or legend map pins.
- **Why:** the DM repurposes the maps into Greenrest — Ostenwold's buildings became Greenrest
  locations with the campaign's own NPCs (Elder Oswin Applewhite, Selma the apothecary…). Pack lore
  entering the world is drift risk, not value.
- Scenes land in the chapter folders (`conventions/foundry-folders.md`) under the DM's scene names,
  not the pack's. The imported map images live at
  `worlds/the-broken-heart-of-greenrest/assets/tom-cartos/<pack>/`. They are the packs' own assets
  and are not in `foundry/assets/`; re-import the pack to restore them.
- **Born explored:** every town and interior map carries
  `flags["fvtt-mod-autoexplore"].enabled: true`, stamped at create time. The
  `fvtt-mod-autoexplore` house module shows the whole floor plan in the dim "explored" state from the
  start, with actors only in real line of sight. It is stateless and per-scene; the GM can toggle it
  in the scene config's Custom tab. The GM's own quick peek is the gm-vision toggle, CTRL+G.
- **Tile props:** the GM's drag-on tile library lives at
  `worlds/the-broken-heart-of-greenrest/assets/tiles/props/Greenrest/`. The `NxN` in a tile's name is
  its grid footprint (e.g. Seamless Grass 8x8).
