# The Broken Heart of Greenrest — the chronicle

The campaign's final deliverable: nine sessions told as one story, with the narrator's notes,
three maps, forty-odd illustrations, an Afterword for the next campaign, a "What If…?" appendix
of the endings not taken, and the bestiary.

- `the-broken-heart-of-greenrest.pdf` — the book (A4, ~94 pages). Rendered with headless Edge from
  the HTML; nothing splits across a page.
- `the-broken-heart-of-greenrest.html` — the same, as a single page; built, not hand-edited.
- `parts/` — the source, in reading order: head/styles, front matter, the four parts, Appendix A.
- `img/` — every image at 1600 px; `img/bestiary/` the creature art.
- `build.py` — concatenates `parts/` and generates Appendix B from a dump of the world's Bestiary
  journal (`python build.py <bestiary.json>`; the JSON is a list of `{name, images, html}` per
  page, produced with `manage-journals get` on the `Bestiary` journal).

To re-render the PDF after a fix:

```powershell
Start-Process "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" -Wait -NoNewWindow `
  -ArgumentList @("--headless=new","--disable-gpu","--no-pdf-header-footer",
  "--print-to-pdf=`"<repo>\book\the-broken-heart-of-greenrest.pdf`"",
  "`"file:///<repo as forward slashes>/book/the-broken-heart-of-greenrest.html`"")
```

Sources: `sessions/*/recap.md` for what happened (the source of truth), `plot/plot.md` for what the
narrator knows, `plans/session-09-the-heart-knot.md` for the What-Ifs. Art: the session
illustrations and handouts already in `art/`, plus the pieces made for the book (also in `art/`).
