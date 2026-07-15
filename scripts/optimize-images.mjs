// Regenerates site images in place at web-appropriate dimensions.
// Originals are preserved in git history (see perf/site-optimization branch).
// Usage: node scripts/optimize-images.mjs
import { existsSync } from 'node:fs';
import { rename, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

// maxWidth caps the longest rendered size (incl. 2x retina); quality tuned per format.
const TARGETS = [
  { dir: 'public/assets/images', maxWidth: 1600, files: [
    'hero-image', 'collaboration', 'event-format', 'talk-1', 'talk-2', 'talk-3', 'talk-4',
    'event-crowd', 'grid-1', 'grid-2', 'grid-3',
  ]},
  { dir: 'public/academy', maxWidth: 2000, files: [
    'hero', 'hero-media', 'hero-purple', 'hero-yellow',
  ]},
  { dir: 'public/academy/img', maxWidth: 1600, files: [
    'audience', 'building', 'collab', 'crowd', 'room', 'stage',
  ]},
];

const fmt = (bytes) => `${(bytes / 1024).toFixed(0)}KB`;

async function optimizeOne(file, maxWidth, format) {
  const tmp = `${file}.tmp`;
  const before = (await stat(file)).size;
  let pipeline = sharp(file).resize({ width: maxWidth, withoutEnlargement: true });
  pipeline = format === 'webp'
    ? pipeline.webp({ quality: 80 })
    : pipeline.jpeg({ quality: 78, progressive: true, mozjpeg: true });
  await pipeline.toFile(tmp);
  const after = (await stat(tmp)).size;
  if (after < before) {
    await rename(tmp, file);
    console.log(`${path.relative(ROOT, file)}: ${fmt(before)} -> ${fmt(after)}`);
  } else {
    const { unlink } = await import('node:fs/promises');
    await unlink(tmp);
    console.log(`${path.relative(ROOT, file)}: ${fmt(before)} kept (already optimal)`);
  }
}

for (const { dir, maxWidth, files } of TARGETS) {
  for (const name of files) {
    for (const ext of ['jpg', 'webp']) {
      const file = path.join(ROOT, dir, `${name}.${ext}`);
      if (existsSync(file)) {
        await optimizeOne(file, maxWidth, ext === 'webp' ? 'webp' : 'jpeg');
      }
    }
  }
}
console.log('Done.');
