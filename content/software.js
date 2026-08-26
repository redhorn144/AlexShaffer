/* ============================================================================
   software.js — the Software tab.

   Each object below becomes one card. Delete the placeholders and add your own.
   Every field except `name` is optional: leave one out and it simply won't
   render. Order here is the order on the page.
   ========================================================================== */

window.SOFTWARE = [
  {
    name: "lazyfit",

    // One or two sentences. What is it, and who is it for?
    blurb: `A small python package that performs radial basis function (RBF) interpolation and optimizes over basis function and shape parameter.`,

    // Small tags under the title. Language, ecosystem, domain — whatever helps.
    tags: ["Python", "RBF", "Interpolation"],

    // Optional status pill. Suggested values: "Active", "Maintained",
    // "Archived", "Beta". Delete the line to show no pill.
    status: "Active",

    // Buttons. Delete any you don't have.
    links: [
      { label: "GitHub",        href: "https://github.com/redhorn144/lazyfit" },
      { label: "PyPI",          href: "https://pypi.org/project/lazyfit/" }
    ],

    // Optional one-line install/usage snippet shown in a code box.
    code: "pip install lazyfit"
  }
];


/*
{
    name: "placeholder-package",

    // One or two sentences. What is it, and who is it for?
    blurb: `A placeholder description of a software package you maintain.
            Explain what problem it solves in plain language — most visitors
            will decide whether to click through based on this sentence alone.`,

    // Small tags under the title. Language, ecosystem, domain — whatever helps.
    tags: ["Python", "Placeholder", "Open Source"],

    // Optional status pill. Suggested values: "Active", "Maintained",
    // "Archived", "Beta". Delete the line to show no pill.
    status: "Active",

    // Buttons. Delete any you don't have.
    links: [
      { label: "GitHub",        href: "https://github.com/" },
      { label: "Documentation", href: "https://example.com/" },
      { label: "PyPI",          href: "https://pypi.org/" }
    ],

    // Optional one-line install/usage snippet shown in a code box.
    code: "pip install placeholder-package"
  },

  {
    name: "another-placeholder-tool",
    blurb: `A second placeholder entry, this one without a status pill or a code
            snippet, to show what a leaner card looks like.`,
    tags: ["Julia", "Numerics"],
    links: [
      { label: "GitHub", href: "https://github.com/" }
    ]
  },

  {
    name: "placeholder-dataset",
    blurb: `Datasets and reproducibility artefacts belong here too — anything you
            release that isn't a paper.`,
    tags: ["Dataset", "Reproducibility"],
    status: "Archived",
    links: [
      { label: "Zenodo", href: "https://zenodo.org/" },
      { label: "Paper",  href: "#/publications" }
    ]
  }

*/