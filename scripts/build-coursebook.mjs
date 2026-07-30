#!/usr/bin/env node
/**
 * Bundles public/academy/coursebook into a single self-contained HTML file with the
 * fonts inlined as data URIs, so the course book can be dropped onto any host
 * (or embedded) without carrying its font directory along.
 *
 *   node scripts/build-coursebook.mjs --out dist/coursebook.html
 *   node scripts/build-coursebook.mjs --fragment --out dist/coursebook-fragment.html
 *
 * --fragment strips the document wrapper (doctype/html/head/body) and keeps the
 * title, styles, markup and script, for hosts that supply their own shell.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, 'public/academy/coursebook/index.html');

const args = process.argv.slice(2);
const fragment = args.includes('--fragment');
const outIdx = args.indexOf('--out');
const out = resolve(root, outIdx > -1 ? args[outIdx + 1] : 'dist/coursebook.html');

let html = readFileSync(src, 'utf8');

// Inline every ./fonts/*.woff2 referenced by the stylesheet. The licensed
// Agrandir Wide faces live at ../fonts/ and are deliberately left as-is —
// they are absent from the repo, and the page falls back to Work Sans.
html = html.replace(/url\('\.\/fonts\/([^']+)'\)/g, (_, file) => {
  const bytes = readFileSync(resolve(root, 'public/academy/coursebook/fonts', file));
  return `url('data:font/woff2;base64,${bytes.toString('base64')}')`;
});

if (fragment) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
  const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
  const title = head.match(/<title>[\s\S]*?<\/title>/)[0];
  const style = head.match(/<style>[\s\S]*?<\/style>/)[0];
  html = `${title}\n${style}\n${body}\n`;
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);

const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log(`${fragment ? 'Fragment' : 'Standalone page'} written to ${out} (${kb} KB)`);
