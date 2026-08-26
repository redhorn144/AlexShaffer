/* ============================================================================
   site.js — who you are, and what tabs exist.
   This is the main file you edit. Everything here shows up in the sidebar
   or on the Home tab.

   Text in `backticks` can span multiple lines and may contain simple HTML
   like <a href="...">links</a>, <em>italics</em> and <strong>bold</strong>.
   ========================================================================== */

window.SITE = {

  /* --- Sidebar identity ------------------------------------------------- */

  name: "Alex Shaffer",
  title: "Doctoral Candidate",
  affiliation: "School of Computing, University of Illinois Urbana-Champaign",

  // Swap in your own photo: drop it in files/ and point to it here.
  // e.g. "files/portrait.jpg"
  avatar: "files/headshot.JPG",

  /* --- Sidebar links ---------------------------------------------------- */
  // Order is the order they appear. Delete any you don't want.
  // `icon` picks the little glyph — available icons are listed in README.md.
  links: [
    // Showing the address as the label makes it copy-pasteable. Any link whose
    // href starts with "mailto:" also gets a copy-to-clipboard button.
    { label: "aws9@illinois.edu", href: "mailto:aws9@illinois.edu",       icon: "mail" },
    { label: "Google Scholar",  href: "https://scholar.google.com/citations?user=0okiGmwAAAAJ&hl=en&oi=sra",         icon: "scholar" },
    { label: "GitHub",          href: "https://github.com/redhorn144",                 icon: "github" },
    { label: "CV (PDF)",        href: "files/cv.pdf",                        icon: "file" }
  ],

  /* --- Home tab --------------------------------------------------------- */

  // Short line under your name on the Home tab. Keep it to one sentence.
  tagline: "High Order methods for PDEs, Scientific Computing, and Numerical Analysis",

  // Separate paragraphs with a blank line.
  bio: `
    I work with high order numerical methods to solve partial differential equations (PDEs).
    My research focuses on developing these method as well as leveraging them to solve challening 
    problems such as the incompressible Navier-Stokes equations and the incompressible magnetohydrodynamics (MHD) equations. 
    I work on meshless methods such as radial basis function (RBF) pseudo-spectral methods.
    I also use spectral element methods to study the incompressible Navier-Stokes equations and the incompressible MHD equations.
    Simulations of these equations have applications in fluid dynamics, geophysics, fusion energy, and much more.

    I recieved an undergraduate degree in Physics from the University of Illinois Urbana-Champaign in 2025. I then joined the School of Computing at the University of Illinois Urbana-Champaign to pursue a PhD in Computer Science. 
    I currently work with Prof. Paul Fischer and Prof. Luke Olson.
  `,

  // Each interest becomes a card on the Home tab.
  // `blurb` is optional — delete it and you get just the heading.
  interests: [
    {
      title: "Meshless High Order Methods",
      blurb: "Radial basis function (RBF) methods are a class of meshless methods that may be used to solve PDEs. I specialize in pseudo-spectral RBF methods, specifically the least-squares RBF partition of unity method (RBF-PUM). I work on parallel implementations of this method including iterative solvers and preconditioners."
    },
    {
      title: "Spectral Element Methods",
      blurb: "Spectral element methods use high order polynomials to efficiently solve PDEs at scale. I work with Nek5000 and NekRS to solve the incompressible Navier-Stokes equations and the incompressible magnetohydrodynamics (MHD) equations with applications in fluid dynamics, geophysics, and fusion energy."
    }
  ],

  // Short news items on the Home tab. Set to [] to hide the section entirely.
  news: [
    
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
    { route: "gallery",      label: "Gallery" },
    { route: "publications", label: "Publications" },
    { route: "software",     label: "Software" },
    { route: "teaching",     label: "Teaching" },
    { route: "cv",           label: "CV" }
  ],

  /* --- Footer ----------------------------------------------------------- */

  footer: `Last updated 2026. Built with plain HTML, CSS and JavaScript.`
};
