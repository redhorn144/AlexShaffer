/* ============================================================================
   render.js — turns the data in content/ into HTML.

   You should never need to edit this file to change content. The one thing
   worth knowing: fields described as "prose" in the content files may contain
   HTML (links, <em>, <strong>); everything else is escaped automatically.
   ========================================================================== */

(function (global) {
  "use strict";

  /* -- helpers ------------------------------------------------------------ */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Prose fields are written by the site owner, so HTML is allowed through —
  // but leading indentation from the source file is stripped.
  function prose(s) {
    return String(s == null ? "" : s).replace(/^[ \t]+/gm, "").trim();
  }

  function paragraphs(s) {
    return prose(s).split(/\n\s*\n/).filter(Boolean)
      .map(function (p) { return "<p>" + p.replace(/\n/g, " ") + "</p>"; }).join("");
  }

  var MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function niceDate(s) {
    var m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(String(s || "").trim());
    if (!m) return esc(s);
    var label = MONTH_ABBR[parseInt(m[2], 10) - 1] + " " + m[1];
    return m[3] ? parseInt(m[3], 10) + " " + label : label;
  }

  /* -- icons -------------------------------------------------------------- */

  var STROKE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
               'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var FILLED = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">';

  var ICONS = {
    mail:   STROKE + '<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 6 9-6"/></svg>',
    file:   STROKE + '<path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5z"/><path d="M14 2.5v5h5M9 13h6M9 17h6"/></svg>',
    link:   STROKE + '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
    globe:  STROKE + '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5a15 15 0 0 1 0 19a15 15 0 0 1 0-19z"/></svg>',
    scholar: STROKE + '<path d="M12 3.5 1.5 9 12 14.5 22.5 9 12 3.5z"/><path d="M5.5 11v5.5c0 1.9 2.9 3.5 6.5 3.5s6.5-1.6 6.5-3.5V11"/></svg>',
    arxiv:  STROKE + '<path d="M4 4.5h16M4 19.5h16"/><path d="m9 8.5-3 7M15 8.5l3 7M8 12h8"/></svg>',
    github: FILLED + '<path d="M12 1.8a10.2 10.2 0 0 0-3.2 19.9c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10.2 10.2 0 0 0 12 1.8z"/></svg>',
    orcid:  FILLED + '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8.2 17.1H6.9V8.6h1.3v8.5zM7.5 7.5a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zm4 9.6h-1.3V8.6h3.2c2.6 0 4 1.8 4 4.3s-1.6 4.2-4 4.2h-1.9zm0-7.3v6.1h1.7c1.9 0 2.8-1.3 2.8-3s-.8-3.1-2.8-3.1h-1.7z"/></svg>',
    linkedin: FILLED + '<path d="M4.5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2.8 9.3h3.4v11.2H2.8zM9.3 9.3h3.3v1.5c.5-.9 1.7-1.8 3.4-1.8 3 0 4.2 1.8 4.2 5v6.5h-3.4v-5.9c0-1.6-.6-2.5-1.9-2.5s-2.2 1-2.2 2.5v5.9H9.3z"/></svg>',
    bluesky: FILLED + '<path d="M12 10.4C10.9 8.3 7.9 4.4 5.2 2.5 2.6.7 1.6 1 1 1.3.2 1.7 0 2.9 0 3.6c0 .7.4 5.8.7 6.7.8 2.8 3.8 3.8 6.6 3.5h.4c-2.8.4-5.3 1.5-2 5.2 3.5 3.8 4.8-.8 5.5-3.2.7 2.4 1.5 6.9 5.4 3.2 3-3.2.8-4.7-2-5.2h.4c2.8.3 5.8-.7 6.6-3.5.3-.9.7-6 .7-6.7 0-.7-.2-1.9-1-2.3-.6-.3-1.6-.6-4.2 1.2-2.7 1.9-5.7 5.8-6.8 7.9z"/></svg>',
    twitter: FILLED + '<path d="M17.7 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.7L4.3 21H1l7.7-8.8L1.3 3H8l4.7 6.2zm-1.2 16h1.8L7.6 4.8H5.7z"/></svg>',
    copy:   STROKE + '<rect x="9" y="9" width="12.5" height="12.5" rx="2"/><path d="M5.5 15H4.5a2 2 0 0 1-2-2V4.5a2 2 0 0 1 2-2H13a2 2 0 0 1 2 2v1"/></svg>',
    check:  STROKE + '<path d="m4.5 12.5 5 5 10-11"/></svg>',
    expand: STROKE + '<path d="M9 3.5H3.5V9M15 3.5h5.5V9M9 20.5H3.5V15M15 20.5h5.5V15"/></svg>',
    play:   STROKE + '<path d="M7 4.5v15l13-7.5z"/></svg>',
    close:  STROKE + '<path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/></svg>'
  };

  function icon(name) {
    return ICONS[name] || ICONS.link;
  }

  /* -- sidebar ------------------------------------------------------------ */

  function sidebar(S) {
    var av = document.getElementById("avatar");
    av.src = S.avatar || "assets/img/avatar.svg";
    av.alt = S.name ? "Photograph of " + S.name : "";

    document.getElementById("identity-name").textContent = S.name || "";
    document.getElementById("identity-title").textContent = S.title || "";
    document.getElementById("identity-affil").textContent = S.affiliation || "";

    document.getElementById("nav").innerHTML = (S.nav || []).map(function (t) {
      return '<a href="#/' + esc(t.route) + '" data-route="' + esc(t.route) + '">' +
             esc(t.label) + "</a>";
    }).join("");

    var linkBox = document.getElementById("links");

    linkBox.innerHTML = (S.links || []).map(function (l) {
      var href = l.href || "";
      var ext = /^https?:/i.test(href);
      var mail = /^mailto:/i.test(href);

      var h = "<li>" +
        '<a href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" +
        icon(l.icon) + "<span>" + esc(l.label) + "</span></a>";

      // Selecting text inside a link is fiddly (browsers start a drag), so
      // mailto: entries get an explicit copy button.
      if (mail) {
        h += '<button class="copy-btn" type="button" ' +
             'data-copy="' + esc(href.replace(/^mailto:/i, "")) + '" ' +
             'aria-label="Copy email address" title="Copy email address">' +
             icon("copy") + "</button>";
      }
      return h + "</li>";
    }).join("");

    linkBox.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-copy]");
      if (!b) return;
      ev.preventDefault();
      copyText(b.dataset.copy, b);
    });

    document.getElementById("site-foot").innerHTML = prose(S.footer || "");
    document.title = S.name || document.title;
  }

  // Copy `text`, flipping `btn` to a tick for a moment as confirmation.
  function copyText(text, btn) {
    function ok() {
      var original = btn.innerHTML;
      btn.innerHTML = icon("check");
      btn.classList.add("copied");
      btn.setAttribute("title", "Copied");
      setTimeout(function () {
        btn.innerHTML = original;
        btn.classList.remove("copied");
        btn.setAttribute("title", "Copy email address");
      }, 1500);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, legacy);
    } else {
      legacy();
    }

    // Clipboard API needs a secure context; plain http://localhost is fine but
    // a bare http:// host is not, so keep the old path available.
    function legacy() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        ok();
      } catch (e) { /* nothing more we can do; the address is visible anyway */ }
    }
  }

  /* -- home --------------------------------------------------------------- */

  function home(S) {
    var h = "";

    if (S.tagline) h += '<p class="lede">' + prose(S.tagline) + "</p>";
    if (S.bio) h += '<div class="prose">' + paragraphs(S.bio) + "</div>";

    if (S.interests && S.interests.length) {
      h += '<h3 class="section-head">Research Interests</h3><div class="interests">';
      h += S.interests.map(function (it) {
        return '<div class="interest"><h3>' + esc(it.title) + "</h3>" +
               (it.blurb ? "<p>" + prose(it.blurb) + "</p>" : "") + "</div>";
      }).join("");
      h += "</div>";
    }

    if (S.news && S.news.length) {
      h += '<h3 class="section-head">News</h3><ul class="news">';
      h += S.news.map(function (nw) {
        return "<li><time>" + niceDate(nw.date) + "</time><span>" + prose(nw.text) + "</span></li>";
      }).join("");
      h += "</ul>";
    }

    // Two columns on wide screens: text left, simulation clips right.
    // app.js fills #home-rail via Media.rail() once every script has loaded.
    document.getElementById("home-body").innerHTML =
      '<div class="home-grid">' +
        '<div class="home-main">' + h + "</div>" +
        '<aside class="home-rail" id="home-rail" aria-label="Simulation clips"></aside>' +
      "</div>";
  }

  /* -- publications ------------------------------------------------------- */

  function isMe(author, me) {
    if (!me || !me.last || author.others || author.corporate) return false;
    if (author.last.toLowerCase() !== String(me.last).toLowerCase()) return false;
    if (!me.initials || !me.initials.length) return true;
    var got = (author.initials || "").charAt(0).toUpperCase();
    return me.initials.some(function (x) {
      return String(x).charAt(0).toUpperCase() === got;
    });
  }

  function authorsHTML(authors, me) {
    if (!authors.length) return "";
    var names = authors.map(function (a) {
      if (a.others) return "<span>et al.</span>";
      var txt = a.corporate ? a.last
              : (a.initials ? a.initials + " " : "") + a.last;
      return "<span" + (isMe(a, me) ? ' class="me"' : "") + ">" + esc(txt) + "</span>";
    });
    return names.join(", ");
  }

  function venueHTML(e) {
    var f = e.fields, D = BibTeX.decode, bits = [];
    function em(x) { return "<em>" + esc(D(x)) + "</em>"; }

    switch (e.type) {
      case "article":
        if (f.journal) {
          var v = em(f.journal);
          if (f.volume) v += " " + esc(D(f.volume));
          if (f.number) v += "(" + esc(D(f.number)) + ")";
          bits.push(v);
        }
        if (f.pages) bits.push(esc(D(f.pages)));
        break;

      case "inproceedings":
      case "conference":
        // Google Scholar and some institutional exporters emit `conference`
        // where BibTeX proper wants `booktitle`; accept either.
        var proc = f.booktitle || f.conference;
        if (proc) bits.push("In " + em(proc));
        if (f.series) bits.push(esc(D(f.series)));
        if (f.pages) bits.push("pp. " + esc(D(f.pages)));
        if (f.address) bits.push(esc(D(f.address)));
        if (f.publisher || f.organization) {
          bits.push(esc(D(f.publisher || f.organization)));
        }
        break;

      case "incollection":
      case "inbook":
        if (f.booktitle) bits.push("In " + em(f.booktitle));
        if (f.pages) bits.push("pp. " + esc(D(f.pages)));
        if (f.publisher) bits.push(esc(D(f.publisher)));
        break;

      case "book":
        if (f.publisher) bits.push(esc(D(f.publisher)));
        if (f.address) bits.push(esc(D(f.address)));
        break;

      case "phdthesis":
        bits.push(esc(D(f.type || "Ph.D. thesis")));
        if (f.school) bits.push(esc(D(f.school)));
        break;

      case "mastersthesis":
        bits.push(esc(D(f.type || "Master's thesis")));
        if (f.school) bits.push(esc(D(f.school)));
        break;

      case "techreport":
        if (f.institution) bits.push(esc(D(f.institution)));
        bits.push(esc(D(f.type || "Technical report")) +
                  (f.number ? " " + esc(D(f.number)) : ""));
        break;

      default:
        if (f.journal) bits.push(em(f.journal));
        if (f.booktitle || f.conference) bits.push("In " + em(f.booktitle || f.conference));
        if (f.howpublished) bits.push(esc(D(f.howpublished)));
    }

    var eprint = f.eprint || f.arxiv;
    if (eprint) {
      bits.push("arXiv:" + esc(D(eprint)) +
                (f.primaryclass ? " [" + esc(D(f.primaryclass)) + "]" : ""));
    }
    if (!bits.length && f.note) bits.push(esc(D(f.note)));

    return bits.join(", ");
  }

  function actionsHTML(e) {
    // P, not decode: these are addresses, not prose. See BibTeX.plain.
    var f = e.fields, P = BibTeX.plain, out = [];
    function btn(href, label) {
      out.push('<a class="btn" href="' + esc(href) + '" target="_blank" rel="noopener">' +
               esc(label) + "</a>");
    }

    if (f.pdf) btn(P(f.pdf), "PDF");
    if (f.doi) btn("https://doi.org/" + P(f.doi).replace(/^https?:\/\/doi\.org\//i, ""), "DOI");
    if (f.eprint || f.arxiv) {
      var id = P(f.eprint || f.arxiv);
      btn(/^https?:/i.test(id) ? id : "https://arxiv.org/abs/" + id, "arXiv");
    }
    if (f.url) btn(P(f.url), "Link");
    if (f.code) btn(P(f.code), "Code");
    if (f.slides) btn(P(f.slides), "Slides");
    if (f.video) btn(P(f.video), "Video");
    if (f.poster) btn(P(f.poster), "Poster");

    out.push('<button class="btn" type="button" data-bib="' + esc(e.key) + '">BibTeX</button>');
    return '<div class="pub-actions">' + out.join("") + "</div>";
  }

  function entryHTML(e, me) {
    var f = e.fields, D = BibTeX.decode;
    var h = '<article class="pub" id="pub-' + esc(e.key) + '">';

    h += '<div class="pub-title">' + esc(D(f.title || "(untitled)")) + "</div>";
    var au = authorsHTML(e.authors, me);
    if (au) h += '<div class="pub-authors">' + au + "</div>";

    var venue = venueHTML(e);
    if (venue) h += '<div class="pub-venue">' + venue + "</div>";

    if (f.award) h += '<div><span class="pub-award">★ ' + esc(D(f.award)) + "</span></div>";

    if (f.abstract) {
      h += '<details class="pub-abstract"><summary>Abstract</summary><p>' +
           esc(D(f.abstract)) + "</p></details>";
    }

    h += actionsHTML(e);
    h += '<pre class="bib-box" data-bib-for="' + esc(e.key) + '" hidden>' +
         esc(e.raw) + "</pre>";
    h += "</article>";
    return h;
  }

  // Everything a search box should look at.
  function haystack(e) {
    var D = BibTeX.decode, f = e.fields;
    return [
      D(f.title), D(f.journal), D(f.booktitle), D(f.publisher), D(f.school),
      D(f.institution), D(f.note), D(f.series), e.year, e.category, e.key,
      e.authors.map(function (a) { return a.first + " " + a.last; }).join(" ")
    ].join(" ").toLowerCase();
  }

  var CAT_ORDER = ["Journal", "Conference", "Preprint", "Other"];

  function publications(entries, S) {
    var body = document.getElementById("pubs-body");
    var me = S.me;

    entries.forEach(function (e) { e._hay = haystack(e); });

    var present = CAT_ORDER.filter(function (c) {
      return entries.some(function (e) { return e.category === c; });
    });

    var chips = ['<button class="chip" type="button" data-cat="all" aria-pressed="true">' +
                 'All <span class="count">' + entries.length + "</span></button>"];
    present.forEach(function (c) {
      var n = entries.filter(function (e) { return e.category === c; }).length;
      chips.push('<button class="chip" type="button" data-cat="' + esc(c) +
                 '" aria-pressed="false">' + esc(c) +
                 ' <span class="count">' + n + "</span></button>");
    });

    body.innerHTML =
      '<div class="pub-toolbar">' +
        '<input class="pub-search" type="search" id="pub-search" ' +
               'placeholder="Search titles, authors, venues…" ' +
               'aria-label="Search publications">' +
        (present.length > 1 ? '<div class="chips">' + chips.join("") + "</div>" : "") +
      "</div>" +
      '<div class="pub-list" id="pub-list" aria-live="polite"></div>' +
      '<p style="margin-top:1.5rem"><a class="btn" href="content/publications.bib" ' +
        'download>Download all as .bib</a></p>';

    var list = document.getElementById("pub-list");
    var state = { q: "", cat: "all" };

    function draw() {
      var q = state.q.trim().toLowerCase();
      var terms = q ? q.split(/\s+/) : [];

      var shown = entries.filter(function (e) {
        if (state.cat !== "all" && e.category !== state.cat) return false;
        return terms.every(function (t) { return e._hay.indexOf(t) !== -1; });
      });

      if (!shown.length) {
        list.innerHTML = '<p class="empty">No publications match that search.</p>';
        return;
      }

      var html = "", lastYear = null;
      shown.forEach(function (e) {
        var y = e.year == null ? "Undated" : e.year;
        if (y !== lastYear) { html += '<h3 class="pub-year">' + esc(y) + "</h3>"; lastYear = y; }
        html += entryHTML(e, me);
      });
      list.innerHTML = html;
    }

    document.getElementById("pub-search").addEventListener("input", function (ev) {
      state.q = ev.target.value;
      draw();
    });

    var chipBox = body.querySelector(".chips");
    if (chipBox) {
      chipBox.addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-cat]");
        if (!b) return;
        state.cat = b.dataset.cat;
        chipBox.querySelectorAll(".chip").forEach(function (c) {
          c.setAttribute("aria-pressed", String(c === b));
        });
        draw();
      });
    }

    // Show/hide the raw BibTeX for one entry.
    list.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-bib]");
      if (!b) return;
      var card = b.closest(".pub");
      var box = card && card.querySelector(".bib-box");
      if (!box) return;
      box.hidden = !box.hidden;
      if (!box.hidden && navigator.clipboard) {
        navigator.clipboard.writeText(box.textContent).then(function () {
          var was = b.textContent;
          b.textContent = "Copied ✓";
          setTimeout(function () { b.textContent = was; }, 1400);
        }, function () { /* clipboard blocked — the text is visible anyway */ });
      }
    });

    draw();
  }

  function pubsError(msg, detail) {
    document.getElementById("pubs-body").innerHTML =
      '<div class="error"><p><strong>' + esc(msg) + "</strong></p>" +
      (detail ? "<p>" + detail + "</p>" : "") + "</div>";
  }

  /* -- software ----------------------------------------------------------- */

  function software(list) {
    var body = document.getElementById("software-body");
    if (!list || !list.length) {
      body.innerHTML = '<p class="empty">No software listed yet.</p>';
      return;
    }
    body.innerHTML = '<div class="cards">' + list.map(function (p) {
      var h = '<div class="card"><div class="card-head"><h3>' + esc(p.name) + "</h3>";
      if (p.status) h += '<span class="pill pill-accent">' + esc(p.status) + "</span>";
      h += "</div>";
      if (p.blurb) h += "<p>" + prose(p.blurb) + "</p>";
      if (p.tags && p.tags.length) {
        h += '<div class="tags">' + p.tags.map(function (t) {
          return '<span class="pill">' + esc(t) + "</span>";
        }).join("") + "</div>";
      }
      if (p.code) h += '<code class="card-code">' + esc(p.code) + "</code>";
      if (p.links && p.links.length) {
        h += '<div class="card-actions">' + p.links.map(function (l) {
          var ext = /^https?:/i.test(l.href || "");
          return '<a class="btn" href="' + esc(l.href) + '"' +
                 (ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(l.label) + "</a>";
        }).join("") + "</div>";
      }
      return h + "</div>";
    }).join("") + "</div>";
  }

  /* -- teaching ----------------------------------------------------------- */

  function teaching(list) {
    var body = document.getElementById("teaching-body");
    if (!list || !list.length) {
      body.innerHTML = '<p class="empty">No teaching listed yet.</p>';
      return;
    }

    var h = "", groups = [], byGroup = {};

    list.forEach(function (c) {
      if (c.intro) { h += '<p class="lede">' + prose(c.intro) + "</p>"; return; }
      var g = c.group || "Courses";
      if (!byGroup[g]) { byGroup[g] = []; groups.push(g); }
      byGroup[g].push(c);
    });

    groups.forEach(function (g) {
      h += '<h3 class="section-head">' + esc(g) + "</h3>";
      h += byGroup[g].map(function (c) {
        var s = '<div class="course"><div class="course-head"><h3>' + esc(c.title) + "</h3>";
        if (c.term) s += '<span class="course-term">' + esc(c.term) + "</span>";
        s += "</div>";
        if (c.institution) s += '<p class="course-where">' + esc(c.institution) + "</p>";
        if (c.blurb) s += '<p class="course-blurb">' + prose(c.blurb) + "</p>";
        if (c.links && c.links.length) {
          s += '<div class="course-actions">' + c.links.map(function (l) {
            var ext = /^https?:/i.test(l.href || "");
            return '<a class="btn" href="' + esc(l.href) + '"' +
                   (ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(l.label) + "</a>";
          }).join("") + "</div>";
        }
        return s + "</div>";
      }).join("");
    });

    body.innerHTML = h;
  }

  /* -- cv ----------------------------------------------------------------- */

  function cv(data) {
    var body = document.getElementById("cv-body");

    if (!data || !data.pdf) {
      body.innerHTML = '<p class="empty">No CV linked yet. Add one by setting ' +
                       '<code>pdf</code> in <code>content/cv.js</code>.</p>';
      return;
    }

    var href = esc(data.pdf);
    var h = "";

    if (data.note) h += '<p class="cv-note">' + prose(data.note) + "</p>";

    h += '<div class="cv-actions">' +
           '<a class="btn btn-lead" href="' + href + '" target="_blank" rel="noopener">' +
             icon("file") + " View CV (PDF)</a>" +
           '<a class="btn" href="' + href + '" download>Download</a>' +
           (data.updated ? '<span class="cv-updated">Updated ' + esc(data.updated) + "</span>" : "") +
         "</div>";

    if (data.embed !== false) {
      h += '<div class="cv-frame-wrap" id="cv-frame-wrap">' +
             '<iframe class="cv-frame" src="' + href + '#view=FitH" ' +
                     'title="Curriculum vitae"></iframe>' +
           "</div>" +
           '<p class="cv-small">The preview is hidden on small screens — ' +
             'use the buttons above to open the PDF.</p>';
    }

    body.innerHTML = h;

    // If the file isn't there yet, say so plainly instead of showing an
    // empty grey box. file:// can't be probed, so skip the check there.
    if (location.protocol !== "file:" && /^(?!https?:)/i.test(data.pdf)) {
      fetch(data.pdf, { method: "HEAD" })
        .then(function (r) { if (!r.ok) throw new Error(String(r.status)); })
        .catch(function () {
          var wrap = document.getElementById("cv-frame-wrap");
          var msg = '<p class="empty">No PDF at <code>' + href + '</code> yet — ' +
                    "save your CV there and it will appear here.</p>";
          if (wrap) wrap.innerHTML = msg;
          else body.insertAdjacentHTML("beforeend", msg);
          var small = body.querySelector(".cv-small");
          if (small) small.remove();
        });
    }
  }

  global.Render = {
    sidebar: sidebar,
    home: home,
    publications: publications,
    pubsError: pubsError,
    software: software,
    teaching: teaching,
    cv: cv,
    icon: icon,
    esc: esc,
    prose: prose
  };

})(window);
