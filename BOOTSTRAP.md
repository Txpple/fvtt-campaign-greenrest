# BOOTSTRAP — getting a local copy

This campaign is finished; the repo is its record, published as an example. A clone is for reading,
for restoring the world, or for using the layout as a starting point. There are no sync hooks to
wire.

```powershell
git clone https://github.com/Txpple/fvtt-campaign-greenrest.git "D:\Workbench\FVTT\Repos\fvtt-campaign-greenrest"
cd "D:\Workbench\FVTT\Repos\fvtt-campaign-greenrest"; npm install
npm run check
```

`npm install` is only needed to rebuild a Word view (`npm run docx`) or run the filing lint. The
session PDFs re-render with `node scripts/render-session-docs.mjs` (headless Edge); the chronicle
with the command in `book/README.md`.

Raw session audio (`sessions/*/audio/`) was never committed and is not needed for anything here.
