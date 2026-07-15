// Imports the 2026 brand photo set (Elie's PL_CNTRLSHFT_WEB series) into the
// site's image slots, generating web-sized jpg + webp pairs in place.
// Source folder: ~/CTRL+SHIFT/CNTRL_SHIFT (FROM ELIE)
// Usage: node scripts/import-brand-photos.mjs
import path from 'node:path';
import sharp from 'sharp';

const SRC = '/Users/joshmaldonado/CTRL+SHIFT/CNTRL_SHIFT (FROM ELIE)';
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../public/assets/images');

// slot -> [orientation folder, source file, max width]
const MAPPING = {
  'hero-image':    ['Landscape', 'PL_CNTRLSHFT_WEB-17.jpg', 1600],
  'event-crowd':   ['Landscape', 'PL_CNTRLSHFT_WEB-11.jpg', 1600],
  'grid-1':        ['Landscape', 'PL_CNTRLSHFT_WEB-41.jpg', 1600],
  'grid-2':        ['Landscape', 'PL_CNTRLSHFT_WEB-47.jpg', 1600],
  'grid-3':        ['Landscape', 'PL_CNTRLSHFT_WEB-27.jpg', 1600],
  'event-format':  ['Landscape', 'PL_CNTRLSHFT_WEB-7.jpg', 1600],
  'collaboration': ['Landscape', 'PL_CNTRLSHFT_WEB-66.jpg', 1600],
  'talk-1':        ['Vertical', 'PL_CNTRLSHFT_WEB-8.jpg', 1200],
  'talk-2':        ['Vertical', 'PL_CNTRLSHFT_WEB-22.jpg', 1200],
  'talk-3':        ['Vertical', 'PL_CNTRLSHFT_WEB-29.jpg', 1200],
  'talk-4':        ['Vertical', 'PL_CNTRLSHFT_WEB-69.jpg', 1200],
};

for (const [slot, [folder, file, width]] of Object.entries(MAPPING)) {
  const src = path.join(SRC, folder, file);
  const base = sharp(src).resize({ width, withoutEnlargement: true });
  const jpg = await base.clone().jpeg({ quality: 78, progressive: true, mozjpeg: true }).toFile(path.join(OUT, `${slot}.jpg`));
  const webp = await base.clone().webp({ quality: 80 }).toFile(path.join(OUT, `${slot}.webp`));
  console.log(`${slot}: ${file} -> jpg ${(jpg.size / 1024).toFixed(0)}KB, webp ${(webp.size / 1024).toFixed(0)}KB`);
}
console.log('Done.');
