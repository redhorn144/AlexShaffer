/* ============================================================================
   cv.js — the CV tab.

   The tab shows a link to your full PDF, then the sections listed below.
   Each section is { heading, items: [...] }. Each item can have:

       when    left-hand column (a year, a range, whatever you like)
       what    the bold main line
       where   the line underneath
       detail  optional smaller third line

   Add, remove and reorder sections freely — nothing else needs changing.
   ========================================================================== */

window.CV = {

  // Path to your full CV. Drop the file in files/ and point to it here.
  // Set to null to hide the download button.
  pdf: "files/cv.pdf",

  // Optional line under the heading.
  note: "A short PDF version is linked above; the summary below is kept current.",

  sections: [

    {
      heading: "Education",
      items: [
        {
          when: "2020 – 2024",
          what: "Ph.D. in Placeholder Studies",
          where: "Placeholder University",
          detail: "Dissertation: “A Placeholder Dissertation Title Spanning Several Words.” Advisor: Prof. Placeholder."
        },
        {
          when: "2018 – 2020",
          what: "M.S. in Placeholder Studies",
          where: "Another Placeholder University"
        },
        {
          when: "2014 – 2018",
          what: "B.S. in Placeholder Science",
          where: "Placeholder College",
          detail: "Minor in Placeholder Mathematics."
        }
      ]
    },

    {
      heading: "Positions",
      items: [
        {
          when: "2024 – present",
          what: "Placeholder Position",
          where: "Department of Placeholder, Placeholder University",
          detail: "One line on what you do there."
        },
        {
          when: "2022",
          what: "Placeholder Research Internship",
          where: "Placeholder Research Lab"
        }
      ]
    },

    {
      heading: "Awards & Honours",
      items: [
        { when: "2026", what: "Best Paper Award", where: "Placeholder Conference on Placeholder Topics" },
        { when: "2024", what: "Placeholder Dissertation Prize", where: "Placeholder University" },
        { when: "2021", what: "Placeholder Graduate Fellowship", where: "Placeholder Funding Agency" }
      ]
    },

    {
      heading: "Invited Talks",
      items: [
        { when: "2026", what: "A Placeholder Talk Title", where: "Placeholder Seminar Series, Placeholder University" },
        { when: "2025", what: "Another Placeholder Talk Title", where: "Placeholder Workshop, Placeholder City" }
      ]
    },

    {
      heading: "Service",
      items: [
        { when: "2025 – present", what: "Reviewer", where: "Journal of Placeholder Studies; Placeholder Conference" },
        { when: "2024", what: "Organiser", where: "Placeholder Workshop on Placeholder Methods" }
      ]
    }

  ]
};
