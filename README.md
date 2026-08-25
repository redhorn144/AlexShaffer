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
| Software projects | `content/software.js` |
| Courses | `content/teaching.js` |
| CV timeline and PDF link | `content/cv.js` |
| Colours and fonts | `assets/css/style.css` (section 1 only) |
| Page title, description, social preview | `index.html` (top of the file) |

PDFs, slides and your CV go in `files/`. Photos go in `assets/img/`.

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
  software.js         project cards
  teaching.js         course list
  cv.js               CV timeline

assets/
  css/style.css     design tokens first, then layout and components
  js/bibtex.js      BibTeX parser and LaTeX→Unicode conversion
  js/render.js      builds the HTML for each tab
  js/app.js         tab routing, theme toggle, boot

files/              PDFs: CV, papers, slides
```

Tabs are switched client-side using the URL hash (`#/publications`), so links to
a specific tab work and the back button behaves normally.

The site follows the reader's system light/dark setting by default; the toggle in
the sidebar overrides it and remembers the choice.
