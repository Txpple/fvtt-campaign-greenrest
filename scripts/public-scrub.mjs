// public-scrub.mjs — what was taken out of this repo before it went public, as a script, so the
// rule is on the record and re-runnable. Idempotent: running it on an already-scrubbed tree
// changes nothing. No dependencies. `node scripts/public-scrub.mjs` (add --dry to only report).
//
// 1. Player privacy. Discord user IDs, Discord handles (as recording track names and as speaker
//    labels in sessions 3–5), the Discord server and channel names, and Craig recording IDs are
//    removed. Speakers are the character names (or "DM"), the way sessions 6–9 already had them.
//    Players' first names, as they appear in the Foundry chat log and the GM notes, stay.
// 2. Licensed D&D book text. The Foundry world export (foundry/documents/) and the party
//    snapshots carry every actor's and item's full rules text, and for anything that came from a
//    purchased D&D book module (Player's Handbook, Dungeon Master's Guide, Monster Manual, Heroes
//    of Faerûn) that text is the publisher's. Those documents are STUBBED, not dropped: name, type,
//    art, mechanics and the compendium source UUID stay, so the world still restores and relinks
//    against the owner's own copies of the books; only the prose fields are blanked.
// 3. Third-party audio. Tabletop Audio tracks (identified by their ID3 tags) are deleted from the
//    world's asset backup; the playlist documents keep the paths, so re-adding the files restores
//    the playlists.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dry = process.argv.includes('--dry');
const log = (...a) => console.log(...a);
let changes = 0;

const read = f => fs.readFileSync(path.join(root, f), 'utf8');
function write(f, text, before) {
  if (text === before) return false;
  changes++;
  if (!dry) fs.writeFileSync(path.join(root, f), text);
  return true;
}
function writeJson(f, obj, before) {
  const indent = /^\n?( +)"/m.exec(before)?.[1]?.length ?? 2;
  const text = JSON.stringify(obj, null, indent) + (before.endsWith('\n') ? '\n' : '');
  return write(f, text, before);
}
function walk(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap(d => {
    const rel = `${dir}/${d.name}`;
    return d.isDirectory() ? walk(rel) : [rel];
  });
}

// ---------------------------------------------------------------------------------------------
// 1 · Player privacy
// ---------------------------------------------------------------------------------------------

// Speaker labels as the recording tools emitted them → the names the record uses.
const SPEAKERS = {
  'Matthew (Txpple)': 'DM',
  "El'Azar (Tom)": 'Gren Greenmantle',
  'Robert Hickok': 'Thomas A. Invictus',
  Drew: 'Jetten Elisedil',
  acruzpr: 'Morgash the Gravemaker',
};
const speaker = name => SPEAKERS[name] ?? name;
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const HEADER = /^# (Session transcript|Public transcript) — .*$/m;
const headerFor = kind => `# ${kind} — The Broken Heart of Greenrest`;

for (const dir of fs.readdirSync(path.join(root, 'sessions'))) {
  const sdir = `sessions/${dir}`;
  if (!fs.statSync(path.join(root, sdir)).isDirectory()) continue;

  // craig-info.json — recording metadata.
  const craigFile = `${sdir}/craig-info.json`;
  if (fs.existsSync(path.join(root, craigFile))) {
    const before = read(craigFile);
    const j = JSON.parse(before);
    delete j.recordingId;
    if (j.guild !== undefined) j.guild = 'the table';
    if (j.channel !== undefined) j.channel = 'voice';
    for (const u of j.users ?? []) {
      delete u.id;
      delete u.discord;
      u.name = speaker(u.name);
    }
    if (writeJson(craigFile, j, before)) log(`${craigFile}: recording id, server, channel and user ids removed`);
  }

  // transcript-segments.json — per-track whisper output; track file names were Discord handles.
  const segFile = `${sdir}/transcript-segments.json`;
  if (fs.existsSync(path.join(root, segFile))) {
    const before = read(segFile);
    const j = JSON.parse(before);
    for (const t of j.tracks ?? []) {
      t.speaker = speaker(t.speaker);
      const n = /^(\d+)-/.exec(t.file)?.[1] ?? '0';
      t.file = `${n}-${slug(t.speaker)}.flac`;
    }
    if (writeJson(segFile, j, before)) log(`${segFile}: track names and speakers normalised`);
  }

  // transcript.md / transcript-public.md — the merged timeline.
  for (const name of ['transcript.md', 'transcript-public.md']) {
    const f = `${sdir}/${name}`;
    if (!fs.existsSync(path.join(root, f))) continue;
    const before = read(f);
    let text = before.replace(HEADER, (_, kind) => headerFor(kind));
    // Speaker labels: **[hh:mm:ss] Name:** … and the same names wherever the scribe wrote them
    // as a label (bold, followed by a colon).
    text = text.replace(/^(\*\*\[\d\d:\d\d:\d\d\] )(.+?)(:\*\*)/gm, (_, a, n, c) => a + speaker(n) + c);
    for (const [from, to] of Object.entries(SPEAKERS)) {
      text = text.split(`**${from}:**`).join(`**${to}:**`).split(`**${from}**`).join(`**${to}**`);
    }
    if (write(f, text, before)) log(`${f}: header and speaker labels normalised`);
  }
}

// campaign.json — the scribe's speaker map was keyed by Discord user id.
{
  const f = 'campaign.json';
  const before = read(f);
  const j = JSON.parse(before);
  const sp = j.sessions?.speakers;
  if (sp && Object.keys(sp).some(k => /^\d{17,19}$/.test(k))) {
    j.sessions.speakers = Object.fromEntries(
      Object.values(sp).map((name, i) => [`discord-user-${i + 1}`, name])
    );
    if (writeJson(f, j, before)) log(`${f}: speaker map re-keyed (Discord user ids removed)`);
  }
}

// ---------------------------------------------------------------------------------------------
// 2 · Licensed book text → stubs
// ---------------------------------------------------------------------------------------------

const PAID = /^Compendium\.dnd-(monster-manual|players-handbook|dungeon-masters-guide|heroes-faerun)\./;
let stubbed = 0;

function blank(obj, key) {
  if (obj && typeof obj[key] === 'string' && obj[key] !== '') {
    obj[key] = '';
    return true;
  }
  return false;
}
function stub(doc) {
  let hit = false;
  const sys = doc.system ?? {};
  hit = blank(sys.description, 'value') || hit;
  hit = blank(sys.description, 'chat') || hit;
  hit = blank(sys.unidentified, 'description') || hit;
  hit = blank(sys.details?.biography, 'value') || hit;
  hit = blank(sys.details?.biography, 'public') || hit;
  for (const a of Object.values(sys.activities ?? {})) {
    hit = blank(a.description, 'chatFlavor') || hit;
  }
  for (const e of doc.effects ?? []) hit = blank(e, 'description') || hit;
  return hit;
}
function visit(node) {
  if (Array.isArray(node)) return node.forEach(visit);
  if (!node || typeof node !== 'object') return;
  if (PAID.test(node._stats?.compendiumSource ?? '') && stub(node)) stubbed++;
  for (const k of Object.keys(node)) if (k !== '_stats') visit(node[k]);
}

for (const f of [...walk('foundry/documents'), ...walk('party-snapshots')].filter(f => f.endsWith('.json'))) {
  const before = read(f);
  const j = JSON.parse(before);
  const n = stubbed;
  visit(j);
  if (stubbed > n && writeJson(f, j, before)) log(`${f}: ${stubbed - n} licensed description(s) stubbed`);
}

// ---------------------------------------------------------------------------------------------
// 3 · Third-party audio
// ---------------------------------------------------------------------------------------------

const AUDIO = 'foundry/assets/worlds/the-broken-heart-of-greenrest/assets';
for (const f of walk(AUDIO).filter(f => /\.(mp3|ogg|wav|flac)$/i.test(f))) {
  const head = fs.readFileSync(path.join(root, f)).subarray(0, 65536).toString('latin1');
  if (/tabletopaudio\.com|T\x00a\x00b\x00l\x00e\x00t\x00o\x00p\x00 \x00A\x00u\x00d\x00i\x00o/.test(head)) {
    changes++;
    if (!dry) fs.rmSync(path.join(root, f));
    log(`${f}: Tabletop Audio track removed`);
  }
}

// ---------------------------------------------------------------------------------------------
// Report, and a last sweep for anything the rules above should have caught.
// ---------------------------------------------------------------------------------------------

log(`\nscrub: ${changes} file(s) ${dry ? 'would change' : 'changed'}; ${stubbed} licensed description(s) stubbed this run`);

const leftovers = [];
const TEXT = /\.(md|json|html|txt)$/;
const skip = /^(node_modules|\.git|out|inbox)\/|^sessions\/[^/]+\/audio\//; // audio/ is gitignored
for (const f of walk('.').map(f => f.slice(2)).filter(f => TEXT.test(f) && !skip.test(f))) {
  const text = read(f);
  const sessionFile = f.startsWith('sessions/') || f === 'campaign.json';
  if (sessionFile && /\b\d{17,19}\b/.test(text)) leftovers.push(`${f}: 17–19-digit number (Discord id?)`);
  if (/Simpleliquid|Audio Chanel|roberthickok|acruzpr|drew_26936|Robert Hickok|\(Txpple\)|El'Azar/.test(text)) {
    leftovers.push(`${f}: Discord handle or server name`);
  }
}
if (leftovers.length) {
  log('scrub: LEFTOVERS to look at by hand:');
  for (const l of leftovers) log(`  - ${l}`);
} else {
  log('scrub: no leftovers');
}
