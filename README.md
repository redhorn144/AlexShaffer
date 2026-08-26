# Personal academic website

A static personal site for GitHub Pages. No build step, no dependencies, no
frameworks — just HTML, CSS and JavaScript. Publications are read from a real
BibTeX file at page load, so updating your publication list means replacing a
`.bib`.

**The rule of thumb:** everything you edit lives in `content/`. You should never
need to touch `index.html` or `assets/` except to add a whole new tab.

---

## Preview it locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Edit a file, save, refresh.

Opening `index.html` directly by double-clicking it will *mostly* work, but the
Publications tab will be empty — browsers block pages loaded from `file://` from
reading local files. Use the command above instead.

## Publish it

Everything is already committed on `main`. On GitHub:

**Settings → Pages → Build and deployment → Source: _Deploy from a branch_**,
branch `main`, folder `/ (root)`. Save.

A minute later the site is live at
<https://redhorn144.github.io/AlexShaffer/>. Every `git push` to `main`
redeploys it — there's no build to wait on.

> **Want the shorter URL?** Renaming this repository to `redhorn144.github.io`
> moves the site to <https://redhorn144.github.io/> instead. Nothing in the code
> needs to change — every path is relative.

---

## What to edit

| I want to change… | Edit this file |
| --- | --- |
| Name, photo, affiliation, sidebar links | `content/site.js` |
| Bio, research interests, news items | `content/site.js` |
| Which tabs exist and their order | `content/site.js` (the `nav` list) |
| Publications | `content/publications.bib` |
| Simulation clips (Home rail + Gallery tab) | `content/media.js` |
| Software projects | `content/software.js` |
| Courses | `content/teaching.js` |
| Which PDF the CV tab links to | `content/cv.js` |
| Colours and fonts | `assets/css/style.css` (section 1 only) |
| Page title, description, social preview | `index.html` (top of the file) |

PDFs, slides and your CV go in `files/`. Photos go in `assets/img/`.

### Simulation clips

`content/media.js` drives two places at once: entries marked `featured: true`
appear in the sticky rail on the Home tab, and every entry appears on the
Gallery tab with its longer `description`.

Each entry is either a video or an image:

```js
{
  id: "channel-flow",                       // must be unique
  title: "Turbulent Channel Flow",
  caption: "Spectral element DNS · Nek5000",
  mp4:    "files/media/channel-flow.mp4",   // video: this is the required one
  webm:   "files/media/channel-flow.webm",  //        optional, smaller
  poster: "files/media/channel-flow.jpg",   //        shown while loading
  alt:    "Vorticity isosurfaces in a turbulent channel flow",
  featured: true,
  description: `Longer text, Gallery tab only.`
}
```

Use `image: "files/media/figure.png"` instead of the `mp4`/`webm` pair for a
still figure. The site ships with animated SVG placeholders so you can see the
layout before your clips are ready.

**[files/media/README.md](files/media/README.md) has the ffmpeg commands** that
produce web-ready files, and explains why each flag matters. Read it before
adding your first clip — video committed to git stays in the repository history
permanently, so it's worth getting the file size right the first time.

Clips are muted and loop automatically. Only clips actually on screen play; the
rest stay paused so the page doesn't chew through CPU and bandwidth. If a visitor
has "reduce motion" enabled, nothing autoplays.

### The CV tab

Save your CV as `files/cv.pdf` and the tab is done — it shows View and Download
buttons plus an inline preview of the file. Until that file exists, the tab says
so rather than showing an empty box.

To point at a different filename or an external URL, change `pdf` in
`content/cv.js`. To drop the inline preview and show only the buttons, set
`embed: false` there. The preview is hidden on phones regardless, since mobile
browsers handle embedded PDFs badly.

### A note on quotes

The content files are JavaScript, so text is wrapped in quotes. Two rules:

- Text in `` `backticks` `` can span multiple lines and may contain HTML
  (`<a href="…">`, `<em>`, `<strong>`). These are the "prose" fields — bios,
  blurbs, news text.
- Text in `"double quotes"` must stay on one line. If the text itself contains a
  double quote, either use backticks instead or escape it as `\"`.

If the page goes blank after an edit, you almost certainly have a mismatched
quote or a missing comma. Open your browser's developer console (F12) — it will
name the file and the line.

---

## Publications in detail

`content/publications.bib` is an ordinary BibTeX file. Export from Zotero,
Mendeley, Google Scholar or your reference manager of choice and paste the
entries in — or replace the file wholesale.

Entries are grouped by `year`, newest first, with `month` breaking ties. Your
own name is bolded automatically; which name counts as yours is set by the `me`
block in `content/site.js`:

```js
me: { last: "Shaffer", initials: ["A"] }
```

Beyond the standard fields, these **optional** fields become buttons on an entry:

| Field | Becomes |
| --- | --- |
| `pdf` | a **PDF** button (a path like `files/paper.pdf`, or a full URL) |
| `doi` | a **DOI** button, linked through `doi.org` |
| `eprint` + `archivePrefix` | an **arXiv** button |
| `url` | a **Link** button |
| `code` | a **Code** button |
| `slides` | a **Slides** button |
| `video` | a **Video** button |
| `poster` | a **Poster** button |
| `abstract` | an expandable **Abstract** section |
| `award` | a highlighted badge (e.g. `award = {Best Paper Award}`) |

The filter chips (Journal / Conference / Preprint / Other) are worked out from
each entry's type, and only appear for categories you actually have.

The parser handles the usual LaTeX awkwardness: `{\"o}` → ö, `{\H o}` → ő,
`\&` → &, `---` → —, and braces that protect capitals (`{NASA}` stays NASA). If
one entry is malformed the rest of the file still loads, and a message names the
line so you can fix it.

---

## Adding a new tab

Two steps, both mechanical. Say you want a "Talks" tab:

**1.** Add it to `nav` in `content/site.js`:

```js
nav: [
  { route: "home",         label: "Home" },
  { route: "publications", label: "Publications" },
  { route: "talks",        label: "Talks" },        // ← new
  …
]
```

**2.** Add a matching section in `index.html`, next to the others:

```html
<section class="panel" data-route="talks" tabindex="-1" aria-labelledby="talks-h">
  <h2 class="panel-title" id="talks-h">Talks</h2>
  <div id="talks-body">
    <p>Write the content straight in here, as ordinary HTML.</p>
  </div>
</section>
```

The `route` in step 1 and the `data-route` in step 2 must match. That's it — the
tab appears, and `#/talks` links to it directly.

To **remove** a tab, delete both pieces. To **reorder** them, reorder `nav`.

---

## Icons

The `icon` field on sidebar links accepts: `mail`, `file`, `link`, `globe`,
`scholar`, `arxiv`, `github`, `orcid`, `linkedin`, `bluesky`, `twitter`.
Anything unrecognised falls back to a generic link icon.

---

## How it fits together

```
index.html          page shell; the empty <section> per tab
404.html            shown for unknown URLs
.nojekyll           tells GitHub Pages to serve files as-is

content/            ← everything you edit
  site.js             identity, bio, interests, news, links, nav
  publications.bib    BibTeX
  media.js            simulation clips
  software.js         project cards
  teaching.js         course list
  cv.js               path to your CV PDF

assets/
  css/style.css     design tokens first, then layout and components
  js/bibtex.js      BibTeX parser and LaTeX→Unicode conversion
  js/render.js      builds the HTML for each tab
  js/media.js       clip player, thumbnails, lightbox
  js/app.js         tab routing, theme toggle, boot
  img/sim-*.svg     animated placeholders, replace with real clips

files/              PDFs: CV, papers, slides
  media/            simulation clips (see its README for encoding)
```

Two content widths are in play, set at the top of `assets/css/style.css`:
`--measure` (42rem) keeps running text at a readable line length, while
`--wide` (78rem) lets grids, clips and the CV preview use the screen. The
Publications tab is deliberately pinned narrower than the rest — citations are
easier to scan that way.

Tabs are switched client-side using the URL hash (`#/publications`), so links to
a specific tab work and the back button behaves normally.

The site follows the reader's system light/dark setting by default; the toggle in
the sidebar overrides it and remembers the choice.
