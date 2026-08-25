# files/

Drop downloadable files here — your CV, paper PDFs, slides, posters.

They're served at the same path you see on disk, so a file saved as
`files/cv.pdf` is referenced from the content files as:

```js
pdf: "files/cv.pdf"
```

The placeholder content already points at `files/cv.pdf`, so adding a file with
that exact name is enough to make the CV link work. Until then those links will
404 — that's expected.

Keep filenames lowercase with hyphens (`smith-2026-preprint.pdf`) and avoid
spaces; it saves URL-encoding headaches later.
