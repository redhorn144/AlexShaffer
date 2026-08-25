/* ============================================================================
   site.js — who you are, and what tabs exist.
   This is the main file you edit. Everything here shows up in the sidebar
   or on the Home tab.

   Text in `backticks` can span multiple lines and may contain simple HTML
   like <a href="...">links</a>, <em>italics</em> and <strong>bold</strong>.
   ========================================================================== */

window.SITE = {

  /* --- Sidebar identity ------------------------------------------------- */

  name: "Your Name",
  title: "Placeholder Position",
  affiliation: "Department of Placeholder, Placeholder University",

  // Swap in your own photo: drop it in assets/img/ and point to it here.
  // e.g. "assets/img/portrait.jpg"
  avatar: "assets/img/avatar.svg",

  /* --- Sidebar links ---------------------------------------------------- */
  // Order is the order they appear. Delete any you don't want.
  // `icon` picks the little glyph — available icons are listed in README.md.
  links: [
    { label: "Email",           href: "mailto:you@example.edu",              icon: "mail" },
    { label: "Google Scholar",  href: "https://scholar.google.com/",         icon: "scholar" },
    { label: "GitHub",          href: "https://github.com/",                 icon: "github" },
    { label: "arXiv",           href: "https://arxiv.org/a/placeholder",     icon: "arxiv" },
    { label: "ORCID",           href: "https://orcid.org/0000-0000-0000-0000", icon: "orcid" },
    { label: "CV (PDF)",        href: "files/cv.pdf",                        icon: "file" }
  ],

  /* --- Home tab --------------------------------------------------------- */

  // Short line under your name on the Home tab. Keep it to one sentence.
  tagline: "One-sentence summary of what you work on and why it matters.",

  // Separate paragraphs with a blank line.
  bio: `
    Placeholder biography paragraph. Describe your research programme in plain
    language: the questions you care about, the methods you use, and the kinds
    of problems you like to work on. Two or three sentences is plenty here.

    A second placeholder paragraph. This is a good place for your background —
    where you trained, where you've worked, and anything else a visitor should
    know before they email you.

    A third, optional paragraph. Mention that you're recruiting students, open
    to collaboration, or whatever else you want people to act on.
  `,

  // Each interest becomes a card on the Home tab.
  // `blurb` is optional — delete it and you get just the heading.
  interests: [
    {
      title: "First Research Interest",
      blurb: "One or two sentences on what this area covers and what you contribute to it."
    },
    {
      title: "Second Research Interest",
      blurb: "Placeholder description of a second thread of your research programme."
    },
    {
      title: "Third Research Interest",
      blurb: "Placeholder description of a third thread of your research programme."
    },
    {
      title: "Fourth Research Interest",
      blurb: "Placeholder description. Add or remove entries freely — the grid reflows."
    }
  ],

  // Short news items on the Home tab. Set to [] to hide the section entirely.
  news: [
    { date: "2026-06", text: "Placeholder news item — a paper accepted, a talk given, an award." },
    { date: "2026-03", text: "Placeholder news item — new preprint posted to arXiv." },
    { date: "2025-11", text: "Placeholder news item — started a new position." }
  ],

  /* --- Publications tab ------------------------------------------------- */

  // Bolds your name wherever it appears in a citation.
  // Add every spelling that shows up in your .bib file.
  me: {
    last: "Shaffer",
    initials: ["A"]          // first initials you publish under
  },

  /* --- Navigation ------------------------------------------------------- */
  // To add a tab: add a line here, then copy a <section data-route="..."> block
  // in index.html and give it the same route name. See README.md.
  nav: [
    { route: "home",         label: "Home" },
    { route: "publications", label: "Publications" },
    { route: "software",     label: "Software" },
    { route: "teaching",     label: "Teaching" },
    { route: "cv",           label: "CV" }
  ],

  /* --- Footer ----------------------------------------------------------- */

  footer: `Last updated 2026. Built with plain HTML, CSS and JavaScript.`
};
