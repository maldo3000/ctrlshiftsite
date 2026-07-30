# CTRL+SHIFT Academy — Generative Media (Course Book)

The interactive course book for the Generative Media track, served at
`/academy/sample-coursebook/`. Nineteen chapters plus an appendix, with progress
tracking, knowledge checks, exercises, per-chapter notes and twenty-one
interactive teaching tools.

Built the same way as the Academy landing page next door: a standalone static
page in `public/`, no framework, no build step, no dependencies. It is not part
of the Vite app and does not affect the main bundle.

## Running it

```bash
npx http-server public -p 8899
# → http://127.0.0.1:8899/academy/sample-coursebook/
```

`vercel.json` carries the two rewrites that map `/academy/sample-coursebook` and
`/academy/sample-coursebook/` to `index.html`, matching the pattern used for
`/academy`. The existing `/academy/(.*)\.(jpg|png|svg|woff2|js|css)` cache
header rule already covers this folder's fonts.

To ship it somewhere else — a workshop handout, an offline copy — bundle it
into one file with the fonts inlined:

```bash
node scripts/build-coursebook.mjs --out dist/sample-coursebook.html
node scripts/build-coursebook.mjs --fragment --out dist/sample-coursebook-fragment.html
```

`--fragment` drops the document wrapper and keeps the title, styles, markup and
script, for a CMS or app shell that supplies its own page chrome.

## Editing the content

Everything lives in the `<script>` block at the bottom of `index.html`:

- `PARTS` — the six part groupings and their descriptions.
- `CHAPTERS` — one object per chapter: `id`, `part`, `n`, `title`, `thesis`,
  `outcome`, `terms`, optional `deliverable`, the `body` HTML, a `quiz` array
  and a `tasks` array. Reading time is computed from the body, so nothing needs
  updating by hand.
- `GLOSSARY` — term/definition pairs, rendered and filtered in the appendix.
- `WIDGETS` — one function per interactive. A chapter opts in by placing
  `<div class="widget" data-widget="name"></div>` anywhere in its body; the
  matching function is called with that element after the chapter renders.

Adding a chapter means adding one object to `CHAPTERS`. The contents rail,
search index, pager, progress meter and export all derive from that array.

## Branding

Uses the Academy's own tokens, redeclared at the top of the stylesheet:

- Ground `#070906`, raised `#0D100A`, white `#F4F7EE`, grey `#9AA093`, borders
  at `rgba(244,247,238,.11)`, and the same grain field at 4.5% opacity.
- Acid purple `#A06EE7` — the Generative Media track colour. (Creative Software
  runs `#F3E37F`; if this book is ever forked for that track, swapping the
  `--acid` token is the whole job.)
- **Agrandir Wide** for titles with **Work Sans** underneath, declared exactly
  as the landing page declares it and pointing at the same `../fonts/`
  directory — drop the licensed files in and both pages upgrade together.
  **Space Mono** for labels, numerals and data. **Aileron** for buttons.
  **Newsreader** for running prose, which is the one face the landing page does
  not use: it is here because this is long-form reading rather than a landing
  page. Swap `--text-face` if you would rather it matched exactly.

Colour is deliberately restricted to the part titles in the contents rail, the
lockup, and interactive or diagram components. The reading pane itself is black
and white, with no gradients and no nested panels — sections are separated by
single hairline rules.

Light and dark are both designed. The page follows the reader's system
preference; the toggle in the rail overrides it.

## State

Progress, quiz answers, exercise checkboxes and notes are stored in
`localStorage` under `ctrlshift.coursebook.v1`. Nothing is uploaded anywhere.
**Export** in the top bar downloads it all as Markdown.
