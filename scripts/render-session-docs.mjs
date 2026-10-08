// render-session-docs.mjs — the session PDFs the scribe never made, rendered the way it would have.
//
// The session scribe produced the four-document set (recap · combat log · GM notes story ·
// GM notes mechanics) as HTML + PDF only from session 7 on, and never printed a transcript. For
// the public record every session gets the same treatment:
//
//   transcript.md        → transcript.html       → transcript.pdf       (all sessions)
//   recap.md             → recap-print.html      → recap.pdf            (sessions without a recap.pdf, 1–5)
//   gm-notes.md          → gm-notes.html         → gm-notes.pdf         (sessions with the single
//                                                                        gm-notes.md, 1–6)
//
// The HTML is the house family: the same palette, type and print rules as the scribe's
// templates (fvtt-mcp-sessionscribe/.claude/skills/session-scribe/templates/), so the PDFs read as
// one set. Printing is headless Edge exactly as the scribe does it (src/pdf.ts): its own profile,
// no header/footer, wait for the file to stop growing. Look at every page before committing.
//
//   node scripts/render-session-docs.mjs            all sessions, HTML + PDF
//   node scripts/render-session-docs.mjs 2026-07-07 one session
//   --html-only                                     skip Edge
// A PDF the scribe itself produced is never touched: this script only writes an output whose PDF
// is missing or whose HTML carries this script's marker comment.
// No dependencies.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const htmlOnly = args.includes('--html-only');
const only = args.filter(a => /^\d{4}-\d{2}-\d{2}/.test(a));
const CAMPAIGN = JSON.parse(fs.readFileSync(path.join(root, 'campaign.json'), 'utf8')).name;
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const MARK = '<!-- rendered by scripts/render-session-docs.mjs from the markdown beside it -->';

// ---------------------------------------------------------------------------------------------
// Session index: number and title from sessions/README.md's table.
// ---------------------------------------------------------------------------------------------
const index = {};
for (const m of fs.readFileSync(path.join(root, 'sessions/README.md'), 'utf8').matchAll(/^\| (\d+) \| `(\d{4}-\d{2}-\d{2})` \| (.+?) \|$/gm)) {
  index[m[2]] = { no: Number(m[1]), title: m[3].trim() };
}
const longDate = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// ---------------------------------------------------------------------------------------------
// Markdown → HTML. Only what the session record uses: headings, paragraphs, bullet lists (two
// levels, with continuation lines), numbered lists, checklists, block quotes, tables, rules, and
// inline bold / italic / code / links.
// ---------------------------------------------------------------------------------------------
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inline(s) {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(“"'—–-])\*(?!\s)([^*]+?)\*(?=[\s.,;:!?)”"'—–-]|$)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[\s(])_(?!\s)([^_]+?)_(?=[\s.,;:!?)]|$)/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}

/** Parse markdown into blocks: {type, ...}. Lists carry items with nested children. */
function parse(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;
  const peek = () => lines[i] ?? null;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = /^(#{1,4}) (.+)$/.exec(line))) { blocks.push({ type: 'h', level: m[1].length, text: m[2] }); i++; continue; }
    if (/^---+\s*$/.test(line)) { blocks.push({ type: 'hr' }); i++; continue; }
    if (/^> /.test(line) || line === '>') {
      const q = [];
      while (i < lines.length && (/^> ?/.test(lines[i]))) q.push(lines[i].replace(/^> ?/, '')), i++;
      blocks.push({ type: 'quote', blocks: parse(q.join('\n')) });
      continue;
    }
    if (/^\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i]), i++;
      const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(1).filter(r => !/^\|[\s:|-]+\|$/.test(r)).map(cells);
      blocks.push({ type: 'table', head, body });
      continue;
    }
    if (/^(\s*)([-*]|\d+\.) /.test(line)) {
      blocks.push(parseList());
      continue;
    }
    // paragraph: run of non-blank, non-structural lines
    const p = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4} |---+\s*$|> |\||\s*([-*]|\d+\.) )/.test(lines[i])) p.push(lines[i].trim()), i++;
    blocks.push({ type: 'p', text: p.join(' ') });
  }
  return blocks;

  function parseList() {
    const first = /^(\s*)([-*]|\d+\.) /.exec(lines[i]);
    const indent = first[1].length;
    const ordered = /\d/.test(first[2]);
    const items = [];
    while (i < lines.length) {
      const m = /^(\s*)([-*]|\d+\.) (.*)$/.exec(lines[i]);
      if (!m || m[1].length !== indent) {
        if (m && m[1].length > indent && items.length) { items[items.length - 1].children.push(parseList()); continue; }
        break;
      }
      i++;
      let text = m[3];
      // continuation lines: indented deeper than the marker, not a new item
      while (i < lines.length && lines[i].trim() && !/^(\s*)([-*]|\d+\.) /.test(lines[i]) && /^\s+/.test(lines[i]) && lines[i].search(/\S/) > indent) {
        text += ' ' + lines[i].trim(); i++;
      }
      let check = null;
      const c = /^\[([ xX])\] /.exec(text);
      if (c) { check = c[1] !== ' '; text = text.slice(4); }
      items.push({ text, check, children: [] });
      // blank line inside a list keeps the list going only if the next non-blank is an item at this depth
      if (i < lines.length && !lines[i].trim()) {
        let j = i; while (j < lines.length && !lines[j].trim()) j++;
        const n = /^(\s*)([-*]|\d+\.) /.exec(lines[j] ?? '');
        if (n && n[1].length >= indent) i = j; else break;
      }
    }
    return { type: 'list', ordered, items };
  }
}

function render(blocks) {
  return blocks.map(b => {
    switch (b.type) {
      case 'h': return `<h${b.level}>${inline(b.text)}</h${b.level}>`;
      case 'hr': return '<hr>';
      case 'p': return `<p>${inline(b.text)}</p>`;
      case 'quote': return `<blockquote>${render(b.blocks)}</blockquote>`;
      case 'table': return `<div class="scroll"><table class="data"><thead><tr>${b.head.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${b.body.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      case 'list': {
        const isCheck = b.items.every(it => it.check !== null);
        const tag = b.ordered ? 'ol' : 'ul';
        const cls = ` class="${isCheck ? 'check ' : ''}${b.cont ? 'cont' : ''}"`.replace(/ class=" ?"/, '').replace(/ "/, '"');
        const start = b.cont && b.ordered ? ' start="2"' : '';
        return `<${tag}${cls}${start}>${b.items.map(it => `<li${it.check ? ' class="done"' : ''}>${inline(it.text)}${it.children.map(render1).join('')}</li>`).join('')}</${tag}>`;
      }
    }
  }).join('\n');
}
const render1 = b => render([b]);

/** Split blocks into {lead, sections:[{heading, blocks}]} on level-2 headings; the level-1 is dropped. */
function sections(blocks) {
  const out = { lead: [], sections: [] };
  let cur = null;
  for (const b of blocks) {
    if (b.type === 'h' && b.level === 1) continue;
    if (b.type === 'h' && b.level === 2) { cur = { heading: b.text, blocks: [] }; out.sections.push(cur); continue; }
    (cur ? cur.blocks : out.lead).push(b);
  }
  return out;
}
/**
 * The scribe's print rule: a heading travels with its first block inside a .keep. A list counts
 * as its first item only (a whole long list in the keep pushes the section to a new page and
 * leaves the one before it empty). `tail` (the footer) rides in a keep with the last block, so it
 * never lands alone on a page.
 */
function keepSection(heading, blocks, tail = '') {
  let [first, ...rest] = blocks;
  if (first?.type === 'list' && first.items.length > 1) {
    rest = [{ ...first, items: first.items.slice(1), cont: true }, ...rest];
    first = { ...first, items: first.items.slice(0, 1) };
  }
  const last = tail && rest.length ? rest.pop() : null;
  return `<section>\n<div class="keep"><h2>${inline(heading)}</h2>\n${first ? render1(first) : ''}</div>\n${render(rest)}${last ? `<div class="keep">${render1(last)}${tail}</div>` : tail}</section>`;
}

// ---------------------------------------------------------------------------------------------
// Shared print CSS (the scribe's gm-notes / combat-log family) and the three documents.
// ---------------------------------------------------------------------------------------------
const FAMILY = `
  :root{--bg:#f4f1ea;--surface:#fffdf8;--rule:#e2d9c8;--edge:#d8cfc0;--ink:#3d3225;--ink2:#4a3f30;
    --muted:#8a7a5c;--head:#6b5535;--accent:#9c5442;--accent-soft:#f2ead9;--band:#b3a284;
    --serif:Georgia,'Times New Roman',serif}
  *{box-sizing:border-box} html,body{margin:0;padding:0}
  body{background:var(--bg);font-family:var(--serif);color:var(--ink2);-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .wrap{max-width:860px;margin:0 auto;padding:24px 8px}
  .sheet{background:var(--surface);border:1px solid var(--edge);border-radius:8px;overflow:hidden}
  header{padding:28px 32px 18px;border-bottom:3px double var(--band)}
  .eyebrow{margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}
  h1{margin:6px 0 4px;font-size:27px;line-height:1.2;color:var(--ink)}
  .sub{margin:0;font-size:13px;color:var(--muted)}
  section{padding:6px 32px}
  h2{margin:22px 0 8px;font-size:18px;color:var(--head);border-bottom:1px solid var(--rule);padding-bottom:5px}
  h3{margin:18px 0 6px;font-size:15px;color:var(--head);letter-spacing:.3px}
  h4{margin:14px 0 4px;font-size:14px;color:var(--head)}
  p{margin:0 0 12px;font-size:15px;line-height:1.65}
  .lead{font-style:italic} strong{color:var(--ink)} code{font-size:.9em;color:var(--head)} hr{border:0;border-top:1px solid var(--rule);margin:14px 0}
  ul,ol{margin:0 0 14px;padding-left:22px;font-size:15px;line-height:1.65} li{margin-bottom:6px} li ul,li ol{margin:4px 0 0} .keep ul,.keep ol{margin-bottom:0} ul.cont,ol.cont{margin-top:0}
  .check{list-style:none;padding-left:4px} .check li{padding-left:26px;position:relative}
  .check li::before{content:"\\2610";position:absolute;left:0;top:0;color:var(--muted)} .check li.done::before{content:"\\2611";color:var(--accent)}
  .scroll{overflow-x:auto;margin:0 0 16px}
  table.data{border-collapse:collapse;width:100%;font-size:14px}
  table.data th{text-align:left;color:var(--head);font-size:12px;letter-spacing:.6px;text-transform:uppercase;border-bottom:1.5px solid var(--rule);padding:7px 10px 6px}
  table.data td{padding:7px 10px;border-bottom:1px solid var(--rule);vertical-align:top;line-height:1.5} table.data tr:last-child td{border-bottom:none}
  blockquote{margin:0 0 14px;padding:8px 16px;border-left:3px solid var(--rule);font-size:15px;line-height:1.6} blockquote p{margin:0 0 6px}
  footer{padding:14px 32px 22px;border-top:1px solid var(--rule);font-size:12px;color:#9c8f78}
  .keep{display:flow-root;break-inside:avoid;page-break-inside:avoid}
  @media print{
    body{background:#fff} .wrap{padding:0} .sheet{border:none;border-radius:0} section,header{padding-left:0;padding-right:0} .scroll{overflow:visible}
    h2,h3,h4{page-break-after:avoid;break-after:avoid}
    p,li,tr,blockquote,table.data,.scroll{page-break-inside:avoid;break-inside:avoid}
    h2 + p,h3 + p,p:has(+ .scroll),p:has(+ ul),p:has(+ ol){page-break-after:avoid;break-after:avoid}
    p{orphans:3;widows:3}
  }`;

function gmNotesHtml(md, s) {
  const { lead, sections: secs } = sections(parse(md));
  const footer = `<footer>GM-only. Compiled from the transcript, the chat log and the live sheets by the session scribe.</footer>`;
  const body = secs.map((sec, k) => keepSection(sec.heading, sec.blocks, k === secs.length - 1 ? footer : ''));
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Session ${s.no} — GM Notes · ${esc(s.title)}</title>
<style>${FAMILY}
  @page{margin:0.6in 0.6in 0.7in;@bottom-center{content:"Session ${s.no} \\00B7  GM Notes \\00B7  " counter(page);font-family:Georgia,serif;font-size:8pt;color:#9c8f78}}
  @page :first{@bottom-center{content:none}}
</style></head>
<body><div class="wrap"><div class="sheet">
<header>
  <p class="eyebrow">${esc(CAMPAIGN)} &mdash; Session ${s.no} &mdash; GM Notes</p>
  <h1>${esc(s.title)}</h1>
  <p class="sub">${longDate(s.date)} &middot; plot and bookkeeping: what changed, what is canon, rulings, threads, quotes</p>
</header>
<section><div class="keep"><p class="lead">The GM's record of the session, spoiler-tolerant: the companion to the player recap. Nothing here was shown to the players.</p>${lead.length ? render(lead) : ''}</div></section>
${body.join('\n')}
</div></div></body></html>
`;
}

function recapPrintHtml(md, s) {
  const blocks = parse(md);
  const { lead, sections: secs } = sections(blocks);
  const tldr = lead.find(b => b.type === 'p');
  const rest = lead.filter(b => b !== tldr);
  const footer = `<footer>Recorded at the table &mdash; transcribed &amp; chronicled by the party scribe.</footer>`;
  const body = secs.map((sec, k) => keepSection(sec.heading, sec.blocks, k === secs.length - 1 ? footer : ''));
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>Session ${s.no} — ${esc(s.title)}</title>
<style>
@page { size: Letter; margin: 0.65in 0.7in 0.75in;
  @bottom-center { content: "${esc(s.title).replace(/"/g, '\\"')} \\00B7  " counter(page); font-family: Georgia, serif; font-size: 8pt; color: #9c8f78; } }
@page :first { @bottom-center { content: none; } }
*{box-sizing:border-box} html,body{margin:0;padding:0;background:#fff}
body{font-family:Georgia,'Times New Roman',serif;color:#4a3f30;font-size:11pt;line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{max-width:7.1in;margin:0 auto}
header{border-bottom:3px double #b3a284;padding-bottom:10pt;margin-bottom:14pt}
.eyebrow{margin:0;font-size:8.5pt;letter-spacing:2px;text-transform:uppercase;color:#8a7a5c}
h1{margin:4pt 0 2pt;font-size:25pt;line-height:1.15;color:#3d3225;font-weight:normal}
.date{margin:0;font-size:10pt;color:#8a7a5c}
.tldr{font-style:italic;font-size:11.5pt;margin:0 0 8pt}
section{margin:18pt 0 0;padding:0}
h2{margin:0 0 8pt;font-size:14.5pt;color:#6b5535;font-weight:normal;letter-spacing:.2px;border-bottom:1px solid #e2d9c8;padding-bottom:3pt;break-after:avoid;page-break-after:avoid}
h3{margin:10pt 0 4pt;font-size:12pt;color:#6b5535;font-weight:bold;break-after:avoid}
p{margin:0 0 8pt;break-inside:avoid;page-break-inside:avoid;orphans:3;widows:3}
ul,ol{margin:0 0 8pt;padding-left:16pt} li{margin:0 0 6pt;break-inside:avoid;page-break-inside:avoid} li ul{margin:4pt 0 0} .keep ul,.keep ol{margin-bottom:0} ul.cont,ol.cont{margin-top:0}
code{font-size:.9em;color:#6b5535} hr{border:0;border-top:1px solid #e2d9c8;margin:10pt 0}
.keep{display:flow-root;break-inside:avoid;page-break-inside:avoid}
blockquote{margin:2pt 0 10pt;padding:6pt 12pt;border-left:3px solid #d8cfc0;background:#faf6ec;font-style:italic;font-size:10.5pt;color:#5d4e38;break-inside:avoid;page-break-inside:avoid} blockquote p{margin:0 0 4pt}
.scroll{margin:0 0 8pt} table.data{border-collapse:collapse;width:100%;font-size:10pt}
table.data th{text-align:left;color:#6b5535;font-size:8.5pt;letter-spacing:.6px;text-transform:uppercase;border-bottom:1.5px solid #e2d9c8;padding:4pt 6pt}
table.data td{padding:4pt 6pt;border-bottom:1px solid #e2d9c8;vertical-align:top} tr{break-inside:avoid}
footer{margin-top:14pt;padding-top:6pt;border-top:1px solid #e2d9c8;font-size:8.5pt;color:#9c8f78}
</style></head>
<body><div class="page">
<header>
  <p class="eyebrow">${esc(CAMPAIGN)} &mdash; Session ${s.no}</p>
  <h1>${esc(s.title)}</h1>
  <p class="date">${longDate(s.date)}</p>
</header>
${tldr ? `<p class="tldr">${inline(tldr.text)}</p>` : ''}
${render(rest)}
${body.join('\n')}
</div></body></html>
`;
}

// Transcript: a timeline, one unbreakable row per utterance or event. No table (Chrome splits
// table cells across printed pages); a grid row per line instead.
function transcriptHtml(md, s) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const meta = {};
  for (const m of md.matchAll(/^- \*\*(.+?):\*\* (.+)$/gm)) meta[m[1]] = m[2];
  const rows = [];
  const speakers = new Map();
  for (const line of lines) {
    let m;
    if ((m = /^\*\*\[(\d\d:\d\d:\d\d)\] (.+?):\*\* (.*)$/.exec(line))) {
      speakers.set(m[2], (speakers.get(m[2]) ?? 0) + 1);
      rows.push(`<div class="row say"><span class="t">${m[1]}</span><span class="who">${esc(m[2])}</span><span class="txt">${inline(m[3])}</span></div>`);
    } else if ((m = /^> (🎲|💬|🤫) `\[(\d\d:\d\d:\d\d)\]` (.*)$/.exec(line))) {
      const kind = { '🎲': 'roll', '💬': 'chat', '🤫': 'whisper' }[m[1]];
      rows.push(`<div class="row ev ${kind}"><span class="t">${m[2]}</span><span class="who">${m[1]}</span><span class="txt">${inline(m[3])}</span></div>`);
    }
  }
  const legend = [...speakers.entries()].sort((a, b) => b[1] - a[1]).map(([n, c]) => `${esc(n)} <span class="n">(${c})</span>`).join(' &middot; ');
  const rec = meta.Recorded ?? '';
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Session ${s.no} — Transcript · ${esc(s.title)}</title>
<style>${FAMILY}
  .legend{font-size:13px;color:var(--muted);margin:6px 0 0;line-height:1.6} .legend .n{color:#b3a284}
  .row{display:grid;grid-template-columns:62px 150px 1fr;gap:0 10px;padding:4px 0;border-bottom:1px dotted var(--rule);
    font-size:12.5px;line-height:1.5;break-inside:avoid;page-break-inside:avoid}
  .row .t{color:#b3a284;font-size:11px;padding-top:1px;font-variant-numeric:tabular-nums}
  .row .who{color:var(--head);font-weight:bold}
  .row .txt{color:var(--ink2)}
  .row.ev .txt{color:var(--muted)} .row.ev .who{font-weight:normal;text-align:left}
  .row.roll{background:#faf6ec} .row.whisper{background:#f3eee6}
  .row.whisper .txt{color:#8a6a5c}
  .key{font-size:12px;color:var(--muted);margin:0 0 10px} .key span{display:inline-block;margin-right:14px}
  @page{margin:0.55in 0.55in 0.65in;@bottom-center{content:"Session ${s.no} \\00B7  Transcript \\00B7  " counter(page);font-family:Georgia,serif;font-size:8pt;color:#9c8f78}}
  @page :first{@bottom-center{content:none}}
  @media print{.row{font-size:10.5pt;line-height:1.4} .row .t{font-size:8.5pt}}
</style></head>
<body><div class="wrap"><div class="sheet">
<header>
  <p class="eyebrow">${esc(CAMPAIGN)} &mdash; Session ${s.no} &mdash; Transcript</p>
  <h1>${esc(s.title)}</h1>
  <p class="sub">${longDate(s.date)}${rec ? ` &middot; recorded ${esc(rec)}` : ''}${meta.Model ? ` &middot; transcribed with ${esc(meta.Model)}` : ''}${meta['Chat events'] ? ` &middot; chat events: ${esc(meta['Chat events'])}` : ''}</p>
  <p class="legend">${legend}</p>
</header>
<section>
<div class="keep">
<p class="lead">The whole session as the recording and the Foundry chat log have it: every speaker's track transcribed by machine and merged on the clock, with the table's rolls and chat cards in between. Verbatim and unedited &mdash; the stumbles, the cross-talk and the mis-hearings are the real thing.</p>
<p class="key"><span>🎲 a roll</span><span>💬 a chat card (an item, a feature, the party stash)</span><span>🤫 a whisper or a blind roll the players did not see</span></p>
${rows[0] ?? ''}
</div>
${rows.slice(1, -1).join('\n')}
<div class="keep">${rows.length > 1 ? rows[rows.length - 1] : ''}<footer>Transcribed from the table recording and the Foundry chat export by the session scribe. Machine transcription; names and spellings are the model's best guess.</footer></div>
</section>
</div></div></body></html>
`;
}

// ---------------------------------------------------------------------------------------------
// Edge
// ---------------------------------------------------------------------------------------------
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function settled(file, timeoutMs = 180_000) {
  const deadline = Date.now() + timeoutMs;
  let last = -1, steady = 0;
  while (Date.now() < deadline) {
    if (fs.existsSync(file)) {
      const size = fs.statSync(file).size;
      if (size > 0 && size === last) { if (++steady >= 2) return true; } else steady = 0;
      last = size;
    }
    await sleep(250);
  }
  return fs.existsSync(file);
}
const countPages = pdf => (fs.readFileSync(pdf).toString('latin1').match(/\/Type\s*\/Page(?![a-zA-Z])/g) ?? []).length;
async function print(html, pdf) {
  fs.rmSync(pdf, { force: true });
  const profile = path.join(os.tmpdir(), 'greenrest-edge-profile');
  spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--user-data-dir=${profile}`, `--print-to-pdf=${pdf}`, pathToFileURL(html).href], { stdio: 'ignore' });
  if (!(await settled(pdf))) throw new Error(`Edge wrote no PDF for ${html}`);
  const bytes = fs.statSync(pdf).size;
  if (bytes < 2000) throw new Error(`${pdf} is ${bytes} bytes: the page did not load`);
  return { bytes, pages: countPages(pdf) };
}

// ---------------------------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------------------------
const jobs = [];
for (const dir of fs.readdirSync(path.join(root, 'sessions')).sort()) {
  const abs = path.join(root, 'sessions', dir);
  if (!fs.statSync(abs).isDirectory() || !index[dir]) continue;
  if (only.length && !only.includes(dir)) continue;
  const s = { ...index[dir], date: dir };
  const has = f => fs.existsSync(path.join(abs, f));
  const ours = f => has(f) && fs.readFileSync(path.join(abs, f), 'utf8').includes(MARK);
  const emit = (src, out, fn, pdf) => {
    fs.writeFileSync(path.join(abs, out), MARK + '\n' + fn(fs.readFileSync(path.join(abs, src), 'utf8'), s));
    jobs.push({ dir, html: path.join(abs, out), pdf: path.join(abs, pdf) });
  };
  if (has('transcript.md') && (!has('transcript.pdf') || ours('transcript.html'))) emit('transcript.md', 'transcript.html', transcriptHtml, 'transcript.pdf');
  if (has('recap.md') && (!has('recap.pdf') || ours('recap-print.html'))) emit('recap.md', 'recap-print.html', recapPrintHtml, 'recap.pdf');
  if (has('gm-notes.md') && (!has('gm-notes.pdf') || ours('gm-notes.html'))) emit('gm-notes.md', 'gm-notes.html', gmNotesHtml, 'gm-notes.pdf');
}
for (const j of jobs) {
  const rel = path.relative(root, j.html);
  if (htmlOnly) { console.log(`${rel}: written`); continue; }
  const r = await print(j.html, j.pdf);
  console.log(`${rel} → ${path.basename(j.pdf)}: ${r.pages} pages, ${(r.bytes / 1024).toFixed(0)} KB`);
}
