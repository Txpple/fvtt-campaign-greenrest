// check.mjs — the filing lint. Enforces CLAUDE.md's filing rules mechanically, so the repo stays
// clean without anyone having to remember them. Runs at every Claude Code session start (after
// sync) and on `npm run check`. Warn-only: it always exits 0, unless `--strict` is passed.
// No dependencies.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const warn = (file, why) => problems.push(`${file}: ${why}`);

// Rule 1 — the root set is fixed. A new root file or folder has to be added here on purpose.
const ROOT = new Set([
  '.git', '.gitignore', '.gitattributes', '.claude', 'node_modules', 'out',
  'CLAUDE.md', 'README.md', 'STATUS.md', 'STYLE.md', 'BOOTSTRAP.md', 'campaign.json',
  'package.json', 'package-lock.json', 'sync.ps1', 'sync-repos.txt',
  'plot', 'world', 'plans', 'conventions', 'art', 'maps', 'sessions',
  'party-snapshots', 'inbox', 'templates', 'scripts', 'book',
  'foundry', 'LICENSE', // the world backup, and the licence a public repo carries
]);
for (const name of fs.readdirSync(root)) {
  if (!ROOT.has(name)) warn(name, 'not part of the fixed root set — file it (CLAUDE.md → "Where things go") or put it in inbox/');
}

// Rule 2 — no versions in filenames. Git is the version history. Version words count only as a
// trailing suffix ("the-final-stand" is a fine slug; "plan-final" is not).
const VERSIONED =
  /[\s_.-](v\d+|rev\d*|revised|final|new|old|copy|backup|draft\d*|\d+)$|handoff|\(\d+\)|\d{4}-\d{2}-\d{2}/i;
// Rule 9 — kebab-case markdown.
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*\.md$/;

function walk(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap(d => {
    const rel = `${dir}/${d.name}`;
    return d.isDirectory() ? walk(rel) : [rel];
  });
}

// Curated folders: markdown only, kebab-case, unversioned.
for (const dir of ['plot', 'world', 'plans', 'conventions', 'templates']) {
  for (const rel of walk(dir)) {
    const base = path.basename(rel);
    if (base === '.gitkeep' || base === 'README.md') continue;
    if (!base.endsWith('.md')) {
      // Rule 3 — markdown is the source; Word / PDF are views.
      warn(rel, `${path.extname(base) || 'a non-markdown file'} does not belong here — the .md is the source; exports go to out/, returned Word edits to inbox/`);
      continue;
    }
    if (!KEBAB.test(base)) warn(rel, 'name must be lowercase kebab-case .md');
    if (VERSIONED.test(base.replace(/\.md$/, ''))) warn(rel, 'looks versioned or dated — git is the version history; edit the one file in place');
  }
}

// plot/ holds exactly one document — the tools read the newest file there.
const plotDocs = walk('plot').filter(f => f.endsWith('.md'));
if (plotDocs.length !== 1) warn('plot/', `must hold exactly one .md (the canon spine), found ${plotDocs.length}`);

// Plans: session-NN-<slug>.md.
for (const rel of walk('plans').filter(f => f.endsWith('.md') && !f.endsWith('README.md'))) {
  if (!/^session-\d{2}-[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(path.basename(rel))) {
    warn(rel, 'plans are named session-NN-<slug>.md — one per session (a table script is a section, not a sibling)');
  }
}

// World entries: frontmatter from templates/world-entry.md, filed under the folder for their kind.
const KIND_DIR = { npc: 'npcs', place: 'places', faction: 'factions', item: 'items' };
for (const rel of walk('world').filter(f => f.endsWith('.md') && !f.endsWith('README.md'))) {
  const text = fs.readFileSync(path.join(root, rel), 'utf8');
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1];
  if (!fm) { warn(rel, 'missing frontmatter — start from templates/world-entry.md'); continue; }
  const field = k => new RegExp(`^${k}:\\s*([^#\\r\\n]*)`, 'm').exec(fm)?.[1].trim().replace(/^["']|["']$/g, '');
  const kind = field('kind');
  const status = field('status');
  if (!KIND_DIR[kind]) warn(rel, `kind must be one of ${Object.keys(KIND_DIR).join(', ')} (got "${kind ?? ''}")`);
  else if (rel.split('/')[1] !== KIND_DIR[kind]) warn(rel, `kind "${kind}" belongs in world/${KIND_DIR[kind]}/`);
  if (!['draft', 'canon'].includes(status)) warn(rel, `status must be draft or canon (got "${status ?? ''}") — retire by deleting`);
}

// Session directories: the scribe's own naming (YYYY-MM-DD with an optional slug).
for (const name of fs.existsSync(path.join(root, 'sessions')) ? fs.readdirSync(path.join(root, 'sessions')) : []) {
  const isDir = fs.statSync(path.join(root, 'sessions', name)).isDirectory();
  if (isDir && !/^\d{4}-\d{2}-\d{2}(-[a-z0-9-]+)?$/.test(name)) warn(`sessions/${name}`, 'session dirs are YYYY-MM-DD[-slug]');
  if (!isDir && !['README.md', '.gitignore'].includes(name)) warn(`sessions/${name}`, 'loose file — sessions/ holds only session directories');
}

// Unresolved 🆕 canon in plans that have been played.
for (const rel of walk('plans').filter(f => f.endsWith('.md'))) {
  const text = fs.readFileSync(path.join(root, rel), 'utf8');
  if (/Status:\s*played/i.test(text) && text.includes('🆕')) {
    warn(rel, 'played, but still carries 🆕 proposed canon — fold it into plot/ or world/, or cut it');
  }
}

const inbox = walk('inbox').filter(f => !f.endsWith('/README.md'));

if (problems.length) {
  console.log(`check: ${problems.length} filing problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
} else {
  console.log('check: filing clean');
}
console.log(inbox.length ? `check: inbox has ${inbox.length} item(s) awaiting triage: ${inbox.map(f => f.slice(6)).join(', ')}` : 'check: inbox empty');
process.exit(process.argv.includes('--strict') && problems.length ? 1 : 0);
