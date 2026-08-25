/* ============================================================================
   app.js — boot, routing and the theme toggle.

   You should never need to edit this file. To add a tab, add a line to `nav`
   in content/site.js and a matching <section data-route="..."> in index.html.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.SITE || {};
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  var routes = panels.map(function (p) { return p.dataset.route; });
  var HOME = (S.nav && S.nav[0] && S.nav[0].route) || routes[0] || "home";

  /* -- routing ------------------------------------------------------------ */

  function currentRoute() {
    var r = (location.hash || "").replace(/^#\/?/, "").split(/[?&]/)[0];
    return routes.indexOf(r) !== -1 ? r : HOME;
  }

  function show(route, isInitial) {
    panels.forEach(function (p) {
      p.classList.toggle("is-active", p.dataset.route === route);
    });

    document.querySelectorAll("#nav a").forEach(function (a) {
      if (a.dataset.route === route) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    var active = panels.filter(function (p) { return p.dataset.route === route; })[0];
    if (!active) return;

    var label = (S.nav || []).filter(function (t) { return t.route === route; })[0];
    document.title = (label && route !== HOME ? label.label + " · " : "") + (S.name || "");

    if (!isInitial) {
      // Move focus to the new panel so keyboard and screen-reader users land
      // in the right place, then scroll back to the top of the page.
      active.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }

  window.addEventListener("hashchange", function () { show(currentRoute(), false); });

  /* -- theme -------------------------------------------------------------- */

  var ORDER = ["auto", "light", "dark"];
  var LABEL = { auto: "Auto", light: "Light", dark: "Dark" };

  function readTheme() {
    try {
      var t = localStorage.getItem("theme");
      return ORDER.indexOf(t) !== -1 ? t : "auto";
    } catch (e) { return "auto"; }
  }

  function applyTheme(t) {
    if (t === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;

    var btn = document.getElementById("theme-toggle");
    var lbl = document.getElementById("theme-toggle-label");
    if (lbl) lbl.textContent = LABEL[t];
    if (btn) btn.setAttribute("title", "Colour theme: " + LABEL[t] + " (click to change)");

    try {
      if (t === "auto") localStorage.removeItem("theme");
      else localStorage.setItem("theme", t);
    } catch (e) { /* private browsing — the choice just won't persist */ }
  }

  /* -- boot --------------------------------------------------------------- */

  function boot() {
    Render.sidebar(S);
    Render.home(S);
    Render.software(window.SOFTWARE);
    Render.teaching(window.TEACHING);
    Render.cv(window.CV);

    var toggle = document.getElementById("theme-toggle");
    applyTheme(readTheme());
    toggle.addEventListener("click", function () {
      applyTheme(ORDER[(ORDER.indexOf(readTheme()) + 1) % ORDER.length]);
    });

    show(currentRoute(), true);

    loadPublications();
  }

  function loadPublications() {
    var body = document.getElementById("pubs-body");
    body.innerHTML = '<p class="empty">Loading publications…</p>';

    fetch("content/publications.bib", { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status + " " + r.statusText);
        return r.text();
      })
      .then(function (text) {
        var out = BibTeX.parse(text);

        if (!out.entries.length) {
          Render.pubsError(
            "No publications found in content/publications.bib.",
            out.errors.length
              ? "The parser reported: " + Render.esc(out.errors.join("; "))
              : "The file was read successfully but contains no BibTeX entries."
          );
          return;
        }

        Render.publications(out.entries, S);

        // Entries parsed, but something in the file was malformed — say so
        // above the list rather than silently dropping papers.
        if (out.errors.length) {
          var warn = document.createElement("div");
          warn.className = "error";
          warn.style.marginBottom = "1rem";
          warn.innerHTML = "<p><strong>Some entries in publications.bib could not be read " +
            "and were skipped.</strong></p><p>" + Render.esc(out.errors.join(" · ")) + "</p>";
          body.insertBefore(warn, body.firstChild);
        }
      })
      .catch(function (err) {
        var isFile = location.protocol === "file:";
        Render.pubsError(
          isFile ? "Publications can’t be loaded from a file:// URL."
                 : "Could not load content/publications.bib.",
          isFile
            ? "Browsers block reading local files from a page opened directly from disk. " +
              "Run <code>python3 -m http.server 8000</code> in the project folder and open " +
              "<code>http://localhost:8000</code> instead."
            : "The browser reported: <code>" + Render.esc(err.message) + "</code>. " +
              "Check that <code>content/publications.bib</code> exists and was committed."
        );
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
