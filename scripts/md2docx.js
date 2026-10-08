const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, LevelFormat, ShadingType, convertInchesToTwip,
} = require('docx');

const src = fs.readFileSync(process.argv[2], 'utf8');
// Default output: out/<basename>.docx at the repo root — a view, never committed (CLAUDE.md →
// "Word round-trip"). Overwritten each run; a lock error means the DM has it open in Word.
const out = process.argv[3] ||
  path.join(__dirname, '..', 'out', path.basename(process.argv[2]).replace(/\.md$/i, '.docx'));
fs.mkdirSync(path.dirname(out), { recursive: true });

// ---- inline markdown -> TextRuns ----
function inlineRuns(text, base = {}) {
  // strip markdown links -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const runs = [];
  // recursive tokenizer: **bold**, *ital*, _ital_, `code`, nesting allowed both ways
  const walk = (seg, style) => {
    const re = /(\*\*((?:[^*]|\*(?!\*))+?)\*\*)|(\*((?:[^*]|\*\*(?:[^*]|\*(?!\*))+?\*\*)+?)\*)|(_([^_\n]+)_)|(`([^`]+)`)/g;
    let l = 0, mm;
    while ((mm = re.exec(seg)) !== null) {
      if (mm.index > l) runs.push(new TextRun({ text: seg.slice(l, mm.index), ...style, ...base }));
      if (mm[2] !== undefined) walk(mm[2], { ...style, bold: true });
      else if (mm[4] !== undefined) walk(mm[4], { ...style, italics: true });
      else if (mm[6] !== undefined) walk(mm[6], { ...style, italics: true });
      else if (mm[8] !== undefined) runs.push(new TextRun({ text: mm[8], font: 'Consolas', size: 18, ...style, ...base }));
      l = mm.index + mm[0].length;
    }
    if (l < seg.length) runs.push(new TextRun({ text: seg.slice(l), ...style, ...base }));
  };
  walk(text, {});
  return runs.length ? runs : [new TextRun({ text: '', ...base })];
}

// ---- block parsing ----
const lines = src.split(/\r?\n/);
const children = [];
let i = 0;

// join hard-wrapped continuation lines within a logical block
function collect(first, isContinuation) {
  let buf = first;
  while (i < lines.length && isContinuation(lines[i])) {
    buf += ' ' + lines[i].trim();
    i++;
  }
  return buf;
}

const numbering = {
  config: [{
    reference: 'bullets',
    levels: [0, 1].map(l => ({
      level: l, format: LevelFormat.BULLET, text: l === 0 ? '•' : '◦',
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: convertInchesToTwip(0.3 + 0.3 * l), hanging: convertInchesToTwip(0.18) } } },
    })),
  }],
};

function para(text, opts = {}) {
  return new Paragraph({ children: inlineRuns(text, opts.runProps || {}), ...opts.p });
}

while (i < lines.length) {
  const line = lines[i];
  i++;
  if (/^\s*$/.test(line)) continue;
  if (/^---+\s*$/.test(line)) continue;

  // headings
  let m;
  if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
    const lvl = m[1].length;
    const hl = [HeadingLevel.TITLE, HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3][lvl - 1];
    children.push(new Paragraph({ children: inlineRuns(m[2]), heading: hl, spacing: { before: lvl === 1 ? 0 : 240, after: 120 } }));
    continue;
  }

  // blockquote
  if (/^>\s?/.test(line)) {
    let quote = [line.replace(/^>\s?/, '')];
    while (i < lines.length && /^>\s?/.test(lines[i])) { quote.push(lines[i].replace(/^>\s?/, '')); i++; }
    // merge hard-wrapped lines within the quote; blank quote lines separate paragraphs
    const qparas = [];
    let cur = '';
    for (const q of quote) {
      if (/^\s*$/.test(q)) { if (cur) qparas.push(cur); cur = ''; }
      else cur = cur ? cur + ' ' + q.trim() : q.trim();
    }
    if (cur) qparas.push(cur);
    for (const qp of qparas) {
      children.push(new Paragraph({
        children: inlineRuns(qp, { color: '444444' }),
        indent: { left: convertInchesToTwip(0.35) },
        border: { left: { style: BorderStyle.SINGLE, size: 18, color: '999999', space: 8 } },
        spacing: { after: 100 },
      }));
    }
    continue;
  }

  // table
  if (/^\|/.test(line) && i < lines.length && /^\|[\s:-]+\|/.test(lines[i])) {
    const headerCells = line.split('|').slice(1, -1).map(s => s.trim());
    i++; // skip separator
    const rows = [];
    while (i < lines.length && /^\|/.test(lines[i])) {
      rows.push(lines[i].split('|').slice(1, -1).map(s => s.trim()));
      i++;
    }
    const ncols = headerCells.length;
    const total = 9360; // 6.5in
    const colw = Array(ncols).fill(Math.floor(total / ncols));
    const mkCell = (txt, isHead) => new TableCell({
      width: { size: colw[0], type: WidthType.DXA },
      shading: isHead ? { type: ShadingType.CLEAR, fill: 'E8E4D8' } : undefined,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ children: inlineRuns(txt, isHead ? { bold: true } : {}) })],
    });
    children.push(new Table({
      columnWidths: colw,
      width: { size: total, type: WidthType.DXA },
      rows: [
        new TableRow({ tableHeader: true, children: headerCells.map(c => mkCell(c, true)) }),
        ...rows.map(r => new TableRow({ children: r.map(c => mkCell(c, false)) })),
      ],
    }));
    children.push(new Paragraph({ text: '' }));
    continue;
  }

  // checklist
  if ((m = line.match(/^-\s+\[( |x)\]\s+(.*)$/))) {
    const checked = m[1] === 'x';
    const text = collect(m[2], l => /^\s{4,}\S/.test(l) && !/^\s*-\s/.test(l));
    children.push(new Paragraph({
      children: [new TextRun({ text: checked ? '☑  ' : '☐  ' }), ...inlineRuns(text)],
      indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.25) },
      spacing: { after: 60 },
    }));
    continue;
  }

  // bullets (2 levels)
  if ((m = line.match(/^(\s*)-\s+(.*)$/))) {
    const lvl = m[1].length >= 2 ? 1 : 0;
    const text = collect(m[2], l => /^\s+\S/.test(l) && !/^\s*(-|\d+\.)\s/.test(l) && !/^\s*$/.test(l));
    children.push(new Paragraph({
      children: inlineRuns(text),
      numbering: { reference: 'bullets', level: lvl },
      spacing: { after: 60 },
    }));
    continue;
  }

  // numbered list
  if ((m = line.match(/^(\d+)\.\s+(.*)$/))) {
    const n = m[1];
    const text = collect(m[2], l => /^\s+\S/.test(l) && !/^\s*(-|\d+\.)\s/.test(l) && !/^\s*$/.test(l));
    children.push(new Paragraph({
      children: [new TextRun({ text: n + '.  ', bold: true }), ...inlineRuns(text)],
      indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.25) },
      spacing: { after: 60 },
    }));
    continue;
  }

  // plain paragraph (merge hard-wrapped lines)
  {
    const text = collect(line.trim(), l => /^\S/.test(l) && !/^(#|>|\||-|\d+\.)/.test(l.trim()[0] === '-' ? '-' : l) && !/^(#{1,4}\s|>\s?|\|)/.test(l) && !/^\s*$/.test(l) && !/^-\s/.test(l) && !/^\d+\.\s/.test(l) && !/^---+$/.test(l));
    children.push(new Paragraph({ children: inlineRuns(text), spacing: { after: 120 } }));
  }
}

const doc = new Document({
  numbering,
  styles: {
    default: {
      document: { run: { font: 'Georgia', size: 21 }, paragraph: { spacing: { line: 276 } } },
      title: { run: { font: 'Georgia', size: 44, bold: true, color: '2F4F3E' } },
      heading1: { run: { font: 'Georgia', size: 30, bold: true, color: '2F4F3E' } },
      heading2: { run: { font: 'Georgia', size: 25, bold: true, color: '3E5C4C' } },
      heading3: { run: { font: 'Georgia', size: 22, bold: true, color: '3E5C4C' } },
    },
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1440, right: 1440 } } },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  try {
    fs.writeFileSync(out, buf);
  } catch (e) {
    if (e.code === 'EBUSY' || e.code === 'EPERM') {
      console.error(`${out} is locked — close it in Word and run again. Don't write a copy beside it.`);
      process.exit(1);
    }
    throw e;
  }
  console.log('wrote', out, buf.length, 'bytes');
});
