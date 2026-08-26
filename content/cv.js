/* ============================================================================
   cv.js — the CV tab.

   The tab is just a link to your CV PDF, with an inline preview of it.

   To use it: save your CV as files/cv.pdf (or change the path below).
   Until that file exists the tab shows a short note saying so.
   ========================================================================== */

window.CV = {

  // Path to the PDF, relative to the site root. A full URL works too.
  pdf: "files/cv.pdf",

  // Optional. Shown next to the buttons — handy for "last updated" dates.
  // Delete the line if you don't want it.
  updated: "Placeholder date",

  // Optional sentence above the buttons. Delete the line to omit it.
  note: `A placeholder line introducing your CV — for example, pointing people
         to your publications tab for the most current list of papers.`,

  // Show the PDF inline underneath the buttons. Set to false for links only.
  // (The preview is always hidden on small screens, where phone browsers
  // handle PDFs poorly.)
  embed: true
};
