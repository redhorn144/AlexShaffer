/* ============================================================================
   teaching.js — the Teaching tab.

   Courses are grouped automatically under the `group` field, in the order the
   groups first appear below. Every field except `title` is optional.
   ========================================================================== */

window.TEACHING = [

  // Optional paragraph at the top of the tab. Delete the whole `intro` entry
  // (the object with `intro:`) if you don't want one.
  //{ intro: `` },

  {
    group: "Instructor of Record",
    title: "Cryptography",
    institution: "Academy High School",
    term: "Fall 2024",
    blurb: "This was an elective course introducing high school students to topics in cryptography. The course covered topics from linear algebra and number theory, along with basic ciphers, modern asymmetric techniques, and an introduction to quantum computing.",
    links: [
      { label: "Course site", href: "https://redhorn144.github.io/AHCryptography/" }
    ]
  },

  {
    group: "Teaching Assistant",
    title: "CS 450 - Numerical Analysis",
    institution: "University of Illinois Urbana-Champaign",
    term: "Fall 2026"
  }
  /*{
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
  }*/

];
