# Sidebar folders: `NN - Name`, one colour per chapter

Every sidebar that holds campaign content (Actors, Items, Scenes, Journals) uses the same folder
scheme: `NN - Name` (space-hyphen-space). Each **chapter has one colour**, reused identically in
every tab where that chapter appears. Subfolders inherit their chapter's colour.

The world's chapters, as the campaign ended:

| # | Folder | Colour |
| --- | --- | --- |
| 00 | Party Camp | `#f39c12` |
| 01 | Daggerford | `#c2913f` |
| 02 | Trade Way | `#6a9358` |
| 03 | Misty Forest | `#8172a6` |
| 04 | Greenrest | `#4a9d5f` |
| 05 | The Hollow | `#3f8fa6` |
| 06 | Widow Fen | `#7a7a3d` |
| 07 | Temple of Shar | `#5c3a7d` |
| 08 | The Wyrmwood | `#79a832` |
| 09 | Conclusion | `#b5577a` |

- **`99 - ` + black (`#000000`) was the parking lot** for content whose place in the running order
  the players hadn't settled; it was promoted to a real number once the party committed. None is
  left.
- **Non-chapter folders** sit outside the scheme with fixed colours: Actor `DM` and the GM journal
  folders (`GM Notes`, `GM Quick Ref`) `#7d3a3a`; `Player Characters` and the `Player Handouts`
  journal folder `#3e8e7e`; `Adventure Log` `#3a7d44`; Actor `The Party` `#6b7fb5`.
- **Order comes from the NAME only.** Foundry v14 ignores the folder `sort` field, so the `NN`
  prefix is what orders the list.

**Why:** the sidebar is the GM's at-a-glance index during play. The number gives running order, and
the shared colour makes "everything in this chapter" visible across tabs at once.

**How to apply:** a chapter gets a folder in every tab that needs one, with the same prefix and the
same hex. Audits compare colours *across* tabs — drift shows up as an Item folder in a slightly
different shade from its Scene folder.
