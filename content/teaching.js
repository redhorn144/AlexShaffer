/* ============================================================================
   teaching.js — the Teaching tab.

   Courses are grouped automatically under the `group` field, in the order the
   groups first appear below. Every field except `title` is optional.
   ========================================================================== */

window.TEACHING = [

  // Optional paragraph at the top of the tab. Delete the whole `intro` entry
  // (the object with `intro:`) if you don't want one.
  { intro: `A placeholder sentence about your teaching philosophy or the kinds
            of courses you enjoy teaching. Keep it short — the list below does
            most of the work.` },

  {
    group: "Instructor of Record",
    title: "PLC 401 — A Placeholder Advanced Course",
    institution: "Placeholder University",
    term: "Spring 2026",
    blurb: "One-line description of the course content and level.",
    links: [
      { label: "Syllabus", href: "files/cv.pdf" },
      { label: "Course site", href: "https://example.com/" }
    ]
  },

  {
    group: "Instructor of Record",
    title: "PLC 210 — A Placeholder Intermediate Course",
    institution: "Placeholder University",
    term: "Fall 2025",
    blurb: "One-line description of the course content and level."
  },

  {
    group: "Teaching Assistant",
    title: "PLC 101 — A Placeholder Introductory Course",
    institution: "Placeholder University",
    term: "Fall 2024, Spring 2025",
    blurb: "Led weekly discussion sections and held office hours."
  },

  {
    group: "Guest Lectures & Workshops",
    title: "A Placeholder Workshop on Placeholder Methods",
    institution: "Placeholder Summer School",
    term: "July 2025",
    links: [
      { label: "Materials", href: "https://github.com/" }
    ]
  }

];
