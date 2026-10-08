# Art reference shelf

The campaign's approved art and the rules it was made by, for the `illustration-builder` skill
(`fvtt-mcp-imagegen`). Everything in `art/` is approved; the Foundry copies are `.webp` under
`worlds/the-broken-heart-of-greenrest/assets/art/` (backed up in `foundry/assets/`), and the book's
copies are 1600-px JPEGs in `book/img/`.

## Identity anchors

The character references for every scene the party appears in, attached as `role: "character"` and
bound with their phrase in the prompt.

| PC | file | binding phrase |
| --- | --- | --- |
| Gren | `portrait-gren-greenmantle-611.png` | "a short white-bearded gnome in green and gold robes" |
| Morgash | `portrait-morgash-gravemaker-611.png` | "a bone-white orc in battered steel plate" |
| Thomas | `portrait-thomas-invictus-611.png` | "a blond human paladin with a golden sunburst on his breastplate" |
| Jetten | `portrait-jetten-elisedil-3010.png` | "a lean tan ash-haired elf archer in a red cloak, arms covered in grey-brown sleeves and leather bracers" |

The party is Thomas, Morgash, Gren and Jetten. Salyth was a DM test PC and has no portrait here.

## Style shelf

The three pieces that carry the house look, attached as `role: "style"` on every illustration call:

| file | why |
| --- | --- |
| `illustration-morgash-topples-bramblemaw-d231a8bd.png` | action, painterly, the house palette |
| `illustration-selma-and-the-finger-7f938226.png` | a lit interior, faces and hands at mid-distance, the comic register |
| `illustration-greenrest-children-play-the-breaking-at-the-inn-4dad5f67.png` | Greenrest in daylight — the town look, built on the Long Rest handout art |

A style reference with no character references beside it gets its *subject* copied. For a scene with
no PC or NPC in it, prompt from words alone or pair the style image with the scene's own references.

Tokens take the world's own tokens as the style reference (`worlds/<world>/assets/tokens/<name>.png`;
Morgash's is the usual pick).

## House portrait finish

The reference look is the Morgash/Gren pair: `soft diffuse dusk light, low contrast, muted palette,
matte powdery skin with no gloss or shine, gentle even lighting with no harsh highlights, matte oil
painting, visible painterly brushwork, soft storybook finish`, paired with `rich mid-tones and deep
shadows` so it does not wash out. Words like "gleaming" invite a glossy studio sheen; armour is
described as `worn … with a soft dull sheen` instead.

## What's here

- **PC portraits** — the four identity anchors above.
- **Session illustrations** — session 8 (the dream, the children's game at the Long Rest, Selma and
  the finger, the squirrels' embassy, the first breath, Invictus's shield bash, Morgash's topple,
  Gren's Fireball) and session 9 (Pudgy lives, the Duskheart speaks, the Dawnfather in the fog, the
  asking, Oswin and Pip, the Heart Knot, the last heart, the Dreamer goes free, the first autumn).
  The recaps carry them as `sessions/<date>/img/`.
- **The chronicle set**, made for `book/`: First Light in the cave, the Broodmother at the door, the
  grey tree, the weeping tree-woman, the Lantern of Revealing, Hesper on the slab, Jetten and the
  Graveheart, the healer and the holly, Morgash holding Thomas back, Thomas at the five graves, Hazel
  over Mabel, the Longshadow ruins, the Iris at dawn, Veck's cell at midnight, and the Widow Fen /
  Silver Gauntlet / Greenrest vista / Wyrmwood / Dreamer-and-Corin repaints.
- `illustration-bramblemaw-first-sight-c91785f7.png` — the party at the doors of Bramblemaw's lair;
  approved, not used in the recap or the book.
- `token-bramblemaw-a0a82155.png` — the Bramblemaw token art.
