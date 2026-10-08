"""Assemble book/the-broken-heart-of-greenrest.html from parts/ and the bestiary dump.

Usage:  python build.py <path-to-bestiary.json>
The bestiary JSON is the dump of the world's Bestiary journal (name, images, html per page).
"""
import json, re, sys, html
from pathlib import Path

HERE = Path(__file__).parent
parts = sorted((HERE / "parts").glob("*.html"))
out = []
for p in parts:
    out.append(p.read_text(encoding="utf-8"))

# ---- Appendix: bestiary -----------------------------------------------------
MET = {
    "Hobgoblins": "Chapter I · the cave below the bridge on the Trade Way",
    "Blights": "Chapter II · the clearing in the Misty Forest",
    "Ettercap": "Chapter II · the web-halls of the ruined fey temple",
    "Will-o'-Wisp": "Chapter II · the lure at the cleft — it escaped, and Gren has not forgotten",
    "Displacer Beast": "Chapter III · the Kestrels' camp — three beasts and the alpha",
    "Skeletons": "Chapter IV · the catacombs of the Hollow Shrine",
    "Zombies": "Chapter IV · the Hollow Shrine, and Hesper's two silent attendants",
    "Wight": "Chapter IV · Osric, Hesper, Cadoc — and Aldous and Edda of the Kestrel Company",
    "Peryton": "Chapter V · Longshadow and two others, at the temple ruin on the road out",
    "Bullywugs": "Chapter VI · the Widow Fen — enthralled, with a purplish glow behind the eyes",
    "Animated Objects": "Chapter VI · the hags' treetop village",
    "Green Hags": "Chapter VI · Hazel and Mabel, once three sisters",
    "Sharrans": "Chapter VII · the Iris — Harrow Vane, high priest; zealots, enforcers and acolytes",
    "Shambling Mound": "Chapter VIII · the drowned temple of the Wyrmwood",
    "Druid": "Chapter VIII · the geased druid of the Wyrmwood — “must serve the master”",
    "Giant Crocodile": "Chapter VIII · the Wyrmwood's flooded hall",
    "Green Dragons": "Chapter VIII · Bramblemaw",
}
# art overrides: the world's own portraits where the stock art does not fit
ART = {
    "Sharrans": [("img/bestiary/sharran-harrow-vane.jpg", "Harrow Vane, high priest of the Iris"),
                 ("img/bestiary/sharran-zealot.jpg", "A zealot"),
                 ("img/bestiary/sharran-enforcer.jpg", "An enforcer"),
                 ("img/bestiary/sharran-acolyte.jpg", "An acolyte")],
    "Green Dragons": [("img/bestiary/green-dragons.jpg", "Bramblemaw")],
    "Druid": [("img/bestiary/druid-world.jpg", "The Wyrmwood's druid")],
}
ORDER = ["Hobgoblins", "Blights", "Ettercap", "Will-o'-Wisp", "Displacer Beast", "Skeletons", "Zombies", "Wight",
         "Peryton", "Bullywugs", "Animated Objects", "Green Hags", "Sharrans", "Shambling Mound", "Druid",
         "Giant Crocodile", "Green Dragons"]

pages = {p["name"]: p for p in json.load(open(sys.argv[1], encoding="utf-8"))}

def body_text(h):
    h = re.sub(r"<figure.*?</figure>", "", h, flags=re.S)
    h = re.sub(r"<img[^>]*>", "", h)
    h = re.sub(r'<section[^>]*>|</section>|<div class="wrap">|</div>', "", h)
    h = re.sub(r'<p class="lead">', '<p class="lead">', h)
    return h.strip()

app = ['<section class="part"><div class="n">Appendix B</div><h1>A Bestiary of the Misty Forest</h1>'
       '<div class="sub">Every creature the company fought, as the world\'s own Bestiary records it — the narrative only, never the numbers. A page went in only after the thing had been faced.</div></section>',
       '<section class="chapter bestiary"><h2><span class="kicker">Appendix B</span>A Bestiary of the Misty Forest</h2>']
for name in ORDER:
    pg = pages[name]
    imgs = ART.get(name) or [(im["file"], im.get("caption") or "") for im in pg["images"] if im.get("file")]
    wide = name == "Sharrans"
    figs = "".join(f'<figure style="margin:0 0 .6em"><img src="{src}" alt="{html.escape(cap or name)}">'
                   + (f'<figcaption>{html.escape(cap)}</figcaption>' if cap else "") + '</figure>' for src, cap in imgs)
    if wide:
        figs = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">' + "".join(
            f'<figure style="margin:0"><img src="{src}" alt="{html.escape(cap)}" style="width:100%"><figcaption style="font-size:9pt">{html.escape(cap)}</figcaption></figure>'
            for src, cap in imgs) + '</div>'
        app.append(f'<div class="entry wide"><div><h3>{html.escape(name)}</h3><div class="met">{MET[name]}</div>{figs}{body_text(pg["html"])}</div></div>')
    else:
        app.append(f'<div class="entry"><div>{figs}</div><div><h3>{html.escape(name)}</h3><div class="met">{MET[name]}</div>{body_text(pg["html"])}</div></div>')
app.append('</section>')
out.append("\n".join(app))
out.append("</div></body></html>\n")
(HERE / "the-broken-heart-of-greenrest.html").write_text("\n".join(out), encoding="utf-8")
print("built", sum(len(x) for x in out), "chars")
