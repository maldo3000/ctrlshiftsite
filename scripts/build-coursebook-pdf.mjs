#!/usr/bin/env node
/**
 * Renders the course book as a print edition PDF.
 *
 * Reads the chapter data straight out of public/academy/sample-coursebook/index.html
 * (so the book and the PDF can never drift), poses and screenshots each interactive
 * so it survives on paper as a figure, then typesets the whole thing: title page,
 * contents, part dividers, running header and page numbers.
 *
 *   npm i -D playwright && npx playwright install chromium   # once
 *   node scripts/build-coursebook-pdf.mjs [out.pdf]
 *
 * Playwright is deliberately NOT a dependency of this project — it is only needed
 * to produce the PDF, which is a once-an-edition job.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('This script needs Playwright:\n  npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BOOK = resolve(root, 'public/academy/sample-coursebook/index.html');
const FONT_DIR = resolve(root, 'public/academy/sample-coursebook/fonts');
const SRC = pathToFileURL(BOOK).href;
const OUT = resolve(root, process.argv[2] || 'dist/CTRL-SHIFT-Academy-Generative-Media.pdf');
const WEB_URL = 'ctrlshift.community/academy/sample-coursebook';

const font = (f) => readFileSync(resolve(FONT_DIR, f)).toString('base64');
const FONTS = {
  work: font('work-sans-latin.woff2'),
  mono: font('space-mono-latin-400.woff2'),
  monoBold: font('space-mono-latin-700.woff2'),
  text: font('newsreader-latin.woff2'),
  textItalic: font('newsreader-italic-latin.woff2'),
};

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
);
const ctx = await browser.newContext({
  viewport: { width: 1180, height: 1400 },
  colorScheme: 'light',
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

await page.goto(SRC, { waitUntil: 'networkidle' });
await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));

const { PARTS, CHAPTERS, GLOSSARY } = await page.evaluate(() => ({
  PARTS: PARTS.map((p) => ({ ...p })),
  CHAPTERS: CHAPTERS.map((c) => ({
    id: c.id, part: c.part, n: c.n, title: c.title, thesis: c.thesis,
    outcome: c.outcome || '', terms: c.terms || [], deliverable: c.deliverable || '',
    body: c.body, quiz: c.quiz || [], tasks: c.tasks || [],
  })),
  GLOSSARY: GLOSSARY.map((g) => [g[0], g[1]]),
}));

console.log(`${CHAPTERS.length} chapters, ${GLOSSARY.length} glossary entries`);

/* ---- Pose the interactives ----
 * A figure of an empty form teaches nothing. Each of these puts the tool into
 * the state a reader would find instructive, so the printed figure carries the
 * same lesson the live version does. */

const POSE = {
  diffusion: (node) => {
    const r = node.querySelector('#dif-range');
    r.value = 9;
    r.dispatchEvent(new Event('input', { bubbles: true }));
  },
  spine: (node) => {
    node.querySelectorAll('input[type="text"]').forEach((i) => {
      i.value = i.placeholder;
      i.dispatchEvent(new Event('input', { bubbles: true }));
    });
  },
  prompt: (node) => node.querySelector('#pr-fill').click(),
  timing: (node) => {
    const ta = node.querySelector('#t-text');
    ta.value = 'She had already written the letter. Three weeks it sat in her coat pocket, ' +
      'folded twice, going soft at the creases. Every shift she meant to hand it over, and ' +
      'every shift there was a reason not to — a bed short, a family waiting, someone who ' +
      'needed her to be steady for one more hour. The hospital did not know she was leaving. ' +
      'Neither, most days, did she. Then room four filled, and the man in it said her name ' +
      'like he had been waiting years to use it.';
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  },
  brief: (node) => {
    const vals = {
      'br-premise': 'A night-shift nurse has already resigned, but the patient in room four recognises her.',
      'br-audience': 'Festival short, watched on a laptop — then a vertical cutdown for social.',
      'br-feeling': 'Quiet, tense, unresolved.',
      'br-look': 'Single fluorescent source, hard top light, deep shadow, 50mm, desaturated green and bone white.',
      'br-spec': '90 seconds, 2.39:1 master, 9:16 and 16:9 derived.',
      'br-limits': 'Two characters, one location, no crowds. Three weeks. No dialogue on camera.',
    };
    Object.entries(vals).forEach(([id, v]) => {
      const el = node.querySelector('#' + id);
      if (!el) return;
      el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
  },
  workflow: (node) => {
    const vals = {
      'wf-inputs-tool': 'Reference library', 'wf-inputs-fb': 'Shared drive',
      'wf-ideation-tool': 'LLM, to interrogate', 'wf-ideation-fb': 'Notebook',
      'wf-generation-tool': 'Image model → video', 'wf-generation-fb': 'Open weights, local',
      'wf-refinement-tool': 'Inpaint + upscale', 'wf-refinement-fb': '',
      'wf-editing-tool': 'NLE with grading', 'wf-editing-fb': 'Second NLE',
      'wf-delivery-tool': 'Master + presets', 'wf-delivery-fb': '',
    };
    Object.entries(vals).forEach(([id, v]) => {
      const el = node.querySelector('#' + id);
      if (!el) return;
      el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
  },
  feedback: (node) => node.querySelectorAll('.opt').forEach((b) => b.click()),
  evaluate: (node) => {
    const picks = [2, 2, 1, 2, 1, 2];
    node.querySelectorAll('[data-c]').forEach((g, i) => {
      const chips = g.querySelectorAll('.chip');
      if (chips[picks[i]]) chips[picks[i]].click();
    });
  },
  cliche: (node) => {
    const boxes = node.querySelectorAll('input[type="checkbox"]');
    [3, 4, 8].forEach((i) => { if (boxes[i]) boxes[i].click(); });
  },
};

/* ---- Capture each mounted interactive as a figure ---- */

const figures = {}; // chapterId -> { widgetName: {title, tag, png} }

for (const c of CHAPTERS) {
  if (!/data-widget/.test(c.body)) continue;
  await page.evaluate((id) => { location.hash = '#/' + id; }, c.id);
  await page.waitForTimeout(700);
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.waitForTimeout(250);

  const names = await page.$$eval('[data-widget]', (els) => els.map((e) => e.dataset.widget));
  figures[c.id] = {};

  for (const name of names) {
    if (name === 'glossary') continue; // typeset properly instead
    const el = await page.$(`[data-widget="${name}"]`);
    if (!el) continue;

    // Denoising is a sequence, and a sequence needs a filmstrip on paper —
    // a single frame cannot show structure arriving before detail.
    if (name === 'diffusion') {
      const steps = [0, 5, 12, 22, 40];
      const strip = [];
      for (const s of steps) {
        await el.evaluate((node, v) => {
          const r = node.querySelector('#dif-range');
          r.value = v;
          r.dispatchEvent(new Event('input', { bubbles: true }));
        }, s);
        await page.waitForTimeout(220);
        const cv = await el.$('#dif-cv');
        strip.push({ step: s, png: (await cv.screenshot({ type: 'png' })).toString('base64') });
      }
      figures[c.id][name] = {
        title: 'Denoising, step by step',
        tag: 'drag the slider',
        strip,
      };
      console.log(`  figure: ${c.id} / ${name} (filmstrip)`);
      continue;
    }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    if (POSE[name]) {
      await el.evaluate(POSE[name]);
      await page.waitForTimeout(450);
    }
    const meta = await el.evaluate((e) => ({
      title: e.querySelector('.widget-head h4')?.textContent || '',
      tag: e.querySelector('.widget-head .tag')?.textContent || '',
    }));
    const shot = await el.screenshot({ type: 'png' });
    figures[c.id][name] = { ...meta, png: shot.toString('base64') };
    console.log(`  figure: ${c.id} / ${name}`);
  }
}

await ctx.close();

/* ---- Typeset ---- */

const romanOf = (n) => (PARTS.find((p) => p.n === n) || {}).roman || '';
const partTitle = (n) => (PARTS.find((p) => p.n === n) || {}).title || '';

function bodyFor(c) {
  let html = c.body;
  html = html.replace(/<div class="widget" data-widget="([a-z]+)"><\/div>/g, (_, name) => {
    if (name === 'glossary') {
      return '<dl class="defs glossary-print">' + GLOSSARY.map(
        ([t, d]) => `<div class="def"><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`
      ).join('') + '</dl>';
    }
    const f = (figures[c.id] || {})[name];
    if (!f) return '';
    if (f.strip) {
      return `<figure class="fig fig-strip">
        <div class="strip">${f.strip.map((s) => `<div class="strip-cell">
          <img src="data:image/png;base64,${s.png}" alt="Denoising at step ${s.step}" />
          <span>step ${s.step}</span></div>`).join('')}</div>
        <figcaption><b>Interactive · ${esc(f.title)}</b> — the same generation at five points in the
        denoising run. Large structure resolves out of the noise first; surface detail only arrives
        at the end, which is why prompt words about layout matter more than words about texture.
        Live and draggable in the online edition at ${WEB_URL}</figcaption>
      </figure>`;
    }
    return `<figure class="fig">
      <img src="data:image/png;base64,${f.png}" alt="${esc(f.title)}" />
      <figcaption><b>Interactive · ${esc(f.title)}</b>${f.tag ? ' — ' + esc(f.tag.toLowerCase()) : ''}.
      Live and usable in the online edition at ${WEB_URL}</figcaption>
    </figure>`;
  });
  // the <dl class="def"> pattern in the source wraps each row in its own dl;
  // normalise to a single definition list per run so print spacing is even
  html = html.replace(/<div class="defs">/g, '<dl class="defs">')
             .replace(/<dl class="def">/g, '<div class="def">')
             .replace(/<\/dl>\s*<\/div>/g, '</div></dl>')
             .replace(/<\/dl>(\s*)<dl class="defs">/g, '</dl>$1<dl class="defs">');
  html = html.replace(/<\/dd><\/dl>/g, '</dd></div>');
  return html;
}

function quizFor(c) {
  if (!c.quiz.length) return '';
  return `<section class="block">
    <h3 class="block-h">Knowledge check</h3>
    ${c.quiz.map((q, i) => `<div class="q">
      <p class="q-stem">${i + 1}. ${esc(q.stem)}</p>
      <ol class="q-opts">${q.opts.map((o, oi) => `<li${oi === q.a ? ' class="right"' : ''}>${esc(o)}${oi === q.a ? ' <span class="tick">✓</span>' : ''}</li>`).join('')}</ol>
      <p class="q-why">${esc(q.why)}</p>
    </div>`).join('')}
  </section>`;
}

function tasksFor(c) {
  if (!c.tasks.length) return '';
  return `<section class="block">
    <h3 class="block-h">Practice</h3>
    <ul class="tasks">${c.tasks.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
  </section>`;
}

function glanceFor(c) {
  const rows = [];
  if (c.outcome) rows.push(`<div><dt>Outcome</dt><dd>${esc(c.outcome)}</dd></div>`);
  if (c.terms.length) rows.push(`<div><dt>Key terms</dt><dd>${c.terms.map(esc).join(' · ')}</dd></div>`);
  if (c.deliverable) rows.push(`<div><dt>Deliverable</dt><dd>${esc(c.deliverable)}</dd></div>`);
  if (!rows.length) return '';
  return `<dl class="glance">${rows.join('')}</dl>`;
}

const numbered = CHAPTERS.filter((c) => c.n <= 19);
const appendix = CHAPTERS.filter((c) => c.n > 19);

const contents = PARTS.map((p) => {
  const chs = CHAPTERS.filter((c) => c.part === p.n);
  if (!chs.length) return '';
  return `<div class="toc-part">
    <p class="toc-part-h"><span class="roman">${esc(p.roman)}</span> ${esc(p.title)}</p>
    ${chs.map((c) => `<p class="toc-row"><span class="toc-n">${c.n <= 19 ? String(c.n).padStart(2, '0') : '—'}</span> ${esc(c.title)}</p>`).join('')}
  </div>`;
}).join('');

const partDividers = {};
PARTS.forEach((p) => {
  const chs = CHAPTERS.filter((c) => c.part === p.n);
  partDividers[p.n] = `<section class="divider">
    <p class="divider-label">Part ${esc(p.roman)}</p>
    <h1 class="divider-title">${esc(p.title)}</h1>
    <p class="divider-blurb">${esc(p.blurb)}</p>
    <ol class="divider-list">${chs.map((c) => `<li><span>${c.n <= 19 ? String(c.n).padStart(2, '0') : '—'}</span>${esc(c.title)}</li>`).join('')}</ol>
  </section>`;
});

let flow = '';
let lastPart = 0;
for (const c of CHAPTERS) {
  if (c.part !== lastPart) { flow += partDividers[c.part]; lastPart = c.part; }
  flow += `<section class="chapter">
    <header class="ch-open">
      <p class="ch-part">Part ${esc(romanOf(c.part))} · ${esc(partTitle(c.part))}</p>
      <p class="ch-num">${c.n <= 19 ? 'Chapter ' + String(c.n).padStart(2, '0') : 'Appendix'}</p>
      <h1 class="ch-title">${esc(c.title)}</h1>
      <p class="ch-thesis">${esc(c.thesis)}</p>
      ${glanceFor(c)}
    </header>
    <div class="prose">${bodyFor(c)}</div>
    ${quizFor(c)}
    ${tasksFor(c)}
  </section>`;
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<title>CTRL+SHIFT Academy — Generative Media</title>
<style>
@font-face{font-family:'Work Sans';src:url(data:font/woff2;base64,${FONTS.work}) format('woff2');font-weight:400 800;font-display:block}
@font-face{font-family:'Space Mono';src:url(data:font/woff2;base64,${FONTS.mono}) format('woff2');font-weight:400;font-display:block}
@font-face{font-family:'Space Mono';src:url(data:font/woff2;base64,${FONTS.monoBold}) format('woff2');font-weight:700;font-display:block}
@font-face{font-family:'Newsreader';src:url(data:font/woff2;base64,${FONTS.text}) format('woff2');font-weight:200 800;font-style:normal;font-display:block}
@font-face{font-family:'Newsreader';src:url(data:font/woff2;base64,${FONTS.textItalic}) format('woff2');font-weight:200 800;font-style:italic;font-display:block}

:root{
  --ink:#0A0C07;
  --body:#16180F;
  --muted:#5A5F52;
  --rule:#C9CCC1;
  --rule-soft:#E2E4DB;
  --acid:#5B32A8;
  --display:'Work Sans',sans-serif;
  --mono:'Space Mono',monospace;
  --text:'Newsreader',Georgia,serif;
}

*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#fff}
body{font-family:var(--text);font-size:10.7pt;line-height:1.58;color:var(--body);-webkit-font-smoothing:antialiased}

/* ---------- title page ---------- */
.title-page{height:9.1in;display:flex;flex-direction:column;justify-content:center;break-after:page}
.lockup{font-family:var(--display);font-weight:700;font-size:11pt;letter-spacing:.16em;text-transform:uppercase;color:var(--ink)}
.lockup .academy{color:var(--acid)}
.title-page h1{font-family:var(--display);font-weight:800;font-size:52pt;line-height:.94;letter-spacing:-.035em;margin:.35in 0 0;color:var(--ink)}
.title-edition{font-family:var(--mono);font-size:8.5pt;letter-spacing:.24em;text-transform:uppercase;color:var(--muted);margin:.28in 0 0}
.title-lede{font-size:13pt;line-height:1.62;max-width:4.6in;margin:.42in 0 0}
.title-foot{margin-top:auto;border-top:1px solid var(--rule);padding-top:.16in;font-family:var(--mono);font-size:8pt;letter-spacing:.1em;color:var(--muted);text-transform:uppercase}

/* ---------- front matter ---------- */
.front{break-after:page}
.front h2,.toc h2{font-family:var(--display);font-weight:800;font-size:19pt;letter-spacing:-.02em;margin:0 0 .22in;color:var(--ink)}
.front p{margin:0 0 .13in;max-width:5.2in}
.front .note-strip{border-left:2px solid var(--ink);padding-left:.16in;margin:.24in 0 0}

/* ---------- contents ---------- */
.toc{break-after:page}
.toc-part{margin:0 0 .2in;break-inside:avoid}
.toc-part-h{font-family:var(--mono);font-size:8pt;letter-spacing:.2em;text-transform:uppercase;color:var(--acid);margin:0 0 .07in;border-bottom:1px solid var(--rule-soft);padding-bottom:.05in}
.toc-part-h .roman{color:var(--muted);margin-right:.5em}
.toc-row{font-family:var(--display);font-weight:500;font-size:11pt;margin:.055in 0;color:var(--ink)}
.toc-n{font-family:var(--mono);font-size:8.5pt;color:var(--muted);margin-right:.7em}

/* ---------- part dividers ---------- */
.divider{break-before:page;height:8.6in;display:flex;flex-direction:column;justify-content:center}
.divider-label{font-family:var(--mono);font-size:9pt;letter-spacing:.3em;text-transform:uppercase;color:var(--acid);margin:0}
.divider-title{font-family:var(--display);font-weight:800;font-size:36pt;line-height:1.02;letter-spacing:-.03em;margin:.14in 0 0;color:var(--ink);max-width:5.4in}
.divider-blurb{font-size:12.5pt;line-height:1.6;font-style:italic;color:var(--muted);max-width:4.5in;margin:.2in 0 0}
.divider-list{list-style:none;margin:.42in 0 0;padding:0;border-top:1px solid var(--rule)}
.divider-list li{font-family:var(--display);font-weight:500;font-size:11pt;padding:.075in 0;border-bottom:1px solid var(--rule-soft);color:var(--ink)}
.divider-list li span{font-family:var(--mono);font-size:8.5pt;color:var(--muted);margin-right:.8em}

/* ---------- chapter opener ---------- */
.chapter{break-before:page}
.ch-open{margin:0 0 .3in}
.ch-part{font-family:var(--mono);font-size:7.6pt;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);margin:0}
.ch-num{font-family:var(--mono);font-size:8.4pt;letter-spacing:.26em;text-transform:uppercase;color:var(--acid);margin:.1in 0 .06in}
.ch-title{font-family:var(--display);font-weight:800;font-size:27pt;line-height:1.03;letter-spacing:-.032em;margin:0;color:var(--ink)}
.ch-thesis{font-size:12.2pt;line-height:1.55;font-style:italic;color:var(--muted);margin:.14in 0 0;max-width:4.9in}

.glance{margin:.24in 0 0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:.1in 0;break-inside:avoid}
.glance>div{display:grid;grid-template-columns:.95in 1fr;gap:0 .16in;padding:.045in 0}
.glance dt{font-family:var(--mono);font-size:7.4pt;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);padding-top:.02in}
.glance dd{margin:0;font-size:10pt;line-height:1.5}

/* ---------- prose ---------- */
.prose p{margin:0 0 .105in;text-align:justify;hyphens:auto}
.prose h2{font-family:var(--display);font-weight:700;font-size:14.5pt;letter-spacing:-.018em;line-height:1.22;margin:.28in 0 .1in;color:var(--ink);break-after:avoid}
.prose h3{font-family:var(--mono);font-size:8.4pt;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);margin:.2in 0 .07in;break-after:avoid}
.prose ul,.prose ol{margin:0 0 .12in;padding-left:.22in}
.prose li{margin:0 0 .05in;line-height:1.5}
.prose li::marker{color:var(--muted)}
.prose strong{font-weight:600;color:var(--ink)}
.prose a{color:var(--ink);text-decoration:none}
.code,.prose code{font-family:var(--mono);font-size:.84em;background:#F1F2EC;padding:.04em .3em;border-radius:2px}

.lede{font-size:11.6pt;line-height:1.55}
.lede::first-letter{float:left;font-family:var(--display);font-weight:800;font-size:3.05em;line-height:.86;margin:.05em .09em 0 0;color:var(--ink)}

.pull{margin:.24in 0;border-left:2px solid var(--ink);padding-left:.19in;font-size:14pt;line-height:1.36;font-style:italic;color:var(--ink);break-inside:avoid}

.note{border-left:2px solid var(--ink);padding-left:.19in;margin:.22in 0;break-inside:avoid}
.note-label{display:block;font-family:var(--mono);font-size:7.4pt;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);margin:0 0 .05in}
.note p{margin:0;text-align:left}

.defs{margin:.14in 0;padding:0;border-top:1px solid var(--rule-soft)}
.defs .def{display:grid;grid-template-columns:1.15in 1fr;gap:0 .18in;border-bottom:1px solid var(--rule-soft);padding:.075in 0;break-inside:avoid}
.defs dt{font-family:var(--mono);font-size:8pt;line-height:1.4;color:var(--ink);padding-top:.02in}
.defs dd{margin:0;font-size:10pt;line-height:1.5}
.glossary-print .def{grid-template-columns:1.35in 1fr}

/* ---------- figures ---------- */
.fig{margin:.22in 0;padding:0;break-inside:avoid}
.fig img{width:100%;display:block;border:1px solid var(--rule);border-radius:6px}
.fig figcaption{font-family:var(--mono);font-size:7.4pt;line-height:1.5;color:var(--muted);margin-top:.07in}
.strip{display:grid;grid-template-columns:repeat(5,1fr);gap:.055in}
.strip-cell img{width:100%;display:block;border:1px solid var(--rule);border-radius:3px}
.strip-cell span{display:block;font-family:var(--mono);font-size:6.4pt;letter-spacing:.06em;color:var(--muted);margin-top:.035in;text-align:center}
.fig figcaption b{color:var(--ink);font-weight:700}

/* ---------- blocks ---------- */
.block{margin:.3in 0 0;border-top:1px solid var(--rule);padding-top:.13in;break-inside:avoid}
.block-h{font-family:var(--mono);font-size:8pt;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin:0 0 .12in}
.q{margin:0 0 .16in;break-inside:avoid}
.q-stem{font-family:var(--display);font-weight:600;font-size:10.4pt;line-height:1.42;margin:0 0 .06in;color:var(--ink)}
.q-opts{list-style:none;margin:0;padding:0;counter-reset:opt}
.q-opts li{position:relative;padding-left:.28in;font-size:10pt;line-height:1.45;margin:0 0 .03in;counter-increment:opt}
.q-opts li::before{content:counter(opt,upper-alpha);position:absolute;left:0;font-family:var(--mono);font-size:8pt;color:var(--muted)}
.q-opts li.right{font-weight:600;color:var(--ink)}
.q-opts .tick{color:var(--acid)}
.q-why{font-size:9.6pt;line-height:1.5;font-style:italic;color:var(--muted);margin:.06in 0 0;padding-left:.28in}
.tasks{list-style:none;margin:0;padding:0}
.tasks li{position:relative;padding-left:.28in;font-size:10.2pt;line-height:1.5;margin:0 0 .06in}
.tasks li::before{content:'';position:absolute;left:0;top:.055in;width:.115in;height:.115in;border:1px solid var(--muted);border-radius:2px}
</style></head>
<body>

<section class="title-page">
  <p class="lockup">CTRL+SHIFT <span class="academy">Academy</span></p>
  <h1>Generative<br />Media</h1>
  <p class="title-edition">Sample Course Book · First Edition</p>
  <p class="title-lede">Nineteen chapters on making films with generative tools — the models, the ecosystem, the economics, the craft and the pipeline. Written so that it still holds when every tool named in it has been replaced.</p>
  <p class="title-foot">Print edition · Interactive edition at ${WEB_URL}</p>
</section>

<section class="front">
  <h2>How to use this book</h2>
  <p>Every chapter states an outcome, defines its key terms, and ends with a knowledge check and a set of exercises to run on your own work. Chapters that produce something name the deliverable.</p>
  <p>Parts I and II are conceptual and can be read in any order. Parts III, IV and V are a production sequence: each one produces a deliverable the next depends on. If you only have time for three chapters, read <em>The Iteration Loop</em>, <em>Visual Language</em> and <em>Taste</em> — those are the skills that separate competent output from good work.</p>
  <div class="note-strip">
    <p>This book contains twenty-one interactive tools — a diffusion denoiser, a shot budget calculator, a prompt builder, a pipeline designer and others. They are reproduced here as figures. To actually use them, read the online edition at <strong>${WEB_URL}</strong>, which also tracks your progress and exports your notes.</p>
  </div>
</section>

<section class="toc">
  <h2>Contents</h2>
  ${contents}
</section>

${flow}

</body></html>`;

if (process.env.DUMP_HTML) writeFileSync(process.env.DUMP_HTML, html);

const ctx2 = await browser.newContext({ viewport: { width: 900, height: 1200 } });
const p2 = await ctx2.newPage();
await p2.setContent(html, { waitUntil: 'load' });
await p2.evaluate(() => document.fonts.ready);
await p2.waitForTimeout(1200);

mkdirSync(dirname(OUT), { recursive: true });

const pdfOpts = {
  path: OUT,
  format: 'Letter',
  printBackground: true,
  displayHeaderFooter: true,
  margin: { top: '0.78in', bottom: '0.72in', left: '0.95in', right: '0.95in' },
  headerTemplate: `<div style="width:100%;font-family:'Helvetica',sans-serif;font-size:6.5pt;letter-spacing:.14em;text-transform:uppercase;color:#8A8F82;padding:0 .95in;">
    <span style="float:left">CTRL+SHIFT Academy</span><span style="float:right">Generative Media</span></div>`,
  footerTemplate: `<div style="width:100%;font-family:'Helvetica',sans-serif;font-size:7pt;color:#8A8F82;text-align:center;padding:0 .95in;">
    <span class="pageNumber"></span></div>`,
};

try {
  await p2.pdf({ ...pdfOpts, outline: true, tagged: true });
  console.log('PDF written with outline + tags');
} catch (err) {
  console.log('outline/tagged unsupported, falling back:', err.message.split('\n')[0]);
  await p2.pdf(pdfOpts);
}

await browser.close();
console.log('→', OUT);
