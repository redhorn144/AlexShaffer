/* ============================================================================
   media.js — simulation clips: the Home rail, the Gallery grid, the lightbox.

   You should never need to edit this file. Clips are listed in content/media.js.

   Two things here are load-bearing and easy to break if edited casually:

   1. <video> needs BOTH `muted` and `playsinline` or mobile browsers refuse to
      autoplay it at all.
   2. An IntersectionObserver plays only the clips that are actually on screen.
      Without it, a Gallery of autoplaying videos pins the CPU and burns the
      visitor's bandwidth.
   ========================================================================== */

(function (global) {
  "use strict";

  var esc = Render.esc;
  var prose = Render.prose;

  var reduced = global.matchMedia &&
                global.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -- one media element -------------------------------------------------- */

  function isVideo(item) { return !!(item && (item.mp4 || item.webm)); }

  // `eager` is for the Home rail (one clip, load it now); the Gallery passes
  // false so tiles cost nothing until they scroll into view.
  function mediaHTML(item, eager) {
    if (!isVideo(item)) {
      return '<img class="media-el" src="' + esc(item.image || "") + '" ' +
             'alt="' + esc(item.alt || item.title || "") + '" loading="lazy">';
    }

    var sources = "";
    if (item.webm) sources += '<source src="' + esc(item.webm) + '" type="video/webm">';
    if (item.mp4) sources += '<source src="' + esc(item.mp4) + '" type="video/mp4">';

    return '<video class="media-el" ' +
           (reduced ? "" : "autoplay ") + 'muted loop playsinline ' +
           'preload="' + (eager ? "metadata" : "none") + '" ' +
           (item.poster ? 'poster="' + esc(item.poster) + '" ' : "") +
           'aria-label="' + esc(item.alt || item.title || "") + '">' +
           sources +
           "</video>";
  }

  function figureHTML(item, eager, cls) {
    // `aspect` lets a clip keep its own shape rather than being letterboxed
    // into the default 16:9. Accepts "4 / 3", "594 / 550", "1.6", etc.
    var shape = item.aspect
      ? ' style="--frame-aspect:' + esc(String(item.aspect)) + '"'
      : "";
    return '<div class="' + cls + '"' + shape +
           ' data-media-id="' + esc(item.id || "") + '">' +
             mediaHTML(item, eager) +
             '<button class="media-expand" type="button" ' +
               'data-expand="' + esc(item.id || "") + '" ' +
               'aria-label="Expand ' + esc(item.title || "clip") + '">' +
               Render.icon("expand") +
             "</button>" +
           "</div>";
  }

  /* -- visibility: play what's on screen, pause what isn't ---------------- */

  var observer = null;

  function observe(root) {
    if (!global.IntersectionObserver) return;
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) {
            if (v.preload === "none") v.preload = "metadata";
            if (!reduced) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          } else {
            v.pause();
          }
        });
      }, { rootMargin: "200px 0px", threshold: 0.1 });
    }
    (root || document).querySelectorAll("video.media-el").forEach(function (v) {
      observer.observe(v);
    });
  }

  // Called on route change so a hidden tab isn't decoding frames.
  function pauseAll() {
    document.querySelectorAll("video.media-el").forEach(function (v) { v.pause(); });
  }

  /* -- Home rail ---------------------------------------------------------- */

  function rail(el, items) {
    if (!el) return;
    if (!items || !items.length) { el.innerHTML = ""; return; }

    function draw(i) {
      var item = items[i];
      var thumbs = items.length < 2 ? "" :
        '<div class="thumbs" role="tablist" aria-label="Choose a clip">' +
          items.map(function (it, k) {
            return '<button class="thumb" type="button" role="tab" ' +
                     'data-index="' + k + '" ' +
                     'aria-selected="' + (k === i) + '" ' +
                     'aria-label="' + esc(it.title || ("Clip " + (k + 1))) + '" ' +
                     'title="' + esc(it.title || "") + '">' +
                     mediaThumb(it) +
                   "</button>";
          }).join("") +
        "</div>";

      el.innerHTML =
        '<div class="rail-card">' +
          figureHTML(item, true, "media-frame") +
          '<div class="rail-meta">' +
            '<h3 class="rail-title">' + esc(item.title || "") + "</h3>" +
            (item.caption ? '<p class="rail-caption">' + prose(item.caption) + "</p>" : "") +
          "</div>" +
          thumbs +
        "</div>";

      observe(el);
    }

    el.addEventListener("click", function (ev) {
      var t = ev.target.closest("[data-index]");
      if (!t) return;
      draw(parseInt(t.dataset.index, 10));
      // Keep focus on the equivalent button after the redraw.
      var again = el.querySelector('[data-index="' + t.dataset.index + '"]');
      if (again) again.focus();
    });

    draw(0);
  }

  // Thumbnails use the poster/image where possible — a grid of live <video>
  // elements is a lot of decoding for something 60px wide.
  function mediaThumb(item) {
    var still = item.poster || item.image;
    if (still) {
      return '<img src="' + esc(still) + '" alt="" loading="lazy">';
    }
    return '<span class="thumb-fallback" aria-hidden="true">' +
           Render.icon("play") + "</span>";
  }

  /* -- Gallery tab -------------------------------------------------------- */

  function gallery(el, items) {
    if (!el) return;
    if (!items || !items.length) {
      el.innerHTML = '<p class="empty">No clips listed yet. Add them in ' +
                     "<code>content/media.js</code>.</p>";
      return;
    }

    el.innerHTML = '<div class="gallery">' + items.map(function (item) {
      return '<figure class="gallery-item">' +
               figureHTML(item, false, "media-frame") +
               "<figcaption>" +
                 '<h3 class="gallery-title">' + esc(item.title || "") + "</h3>" +
                 (item.caption ? '<p class="gallery-caption">' + prose(item.caption) + "</p>" : "") +
                 (item.description ? '<p class="gallery-desc">' + prose(item.description) + "</p>" : "") +
               "</figcaption>" +
             "</figure>";
    }).join("") + "</div>";

    observe(el);
  }

  /* -- lightbox ----------------------------------------------------------- */

  var box = null, lastFocus = null;

  function ensureBox() {
    if (box) return box;
    box = document.createElement("div");
    box.className = "lightbox";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML =
      '<div class="lightbox-backdrop" data-close></div>' +
      '<div class="lightbox-panel" role="document">' +
        '<button class="lightbox-close" type="button" data-close ' +
                'aria-label="Close">' + Render.icon("close") + "</button>" +
        '<div class="lightbox-body"></div>' +
        '<p class="lightbox-caption"></p>' +
      "</div>";
    document.body.appendChild(box);

    box.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-close]")) close();
    });
    document.addEventListener("keydown", function (ev) {
      if (box.hidden) return;
      if (ev.key === "Escape") { close(); return; }
      if (ev.key === "Tab") trap(ev);
    });
    return box;
  }

  function trap(ev) {
    var f = box.querySelectorAll("button, video[controls], a[href]");
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { last.focus(); ev.preventDefault(); }
    else if (!ev.shiftKey && document.activeElement === last) { first.focus(); ev.preventDefault(); }
  }

  function open(item, trigger) {
    ensureBox();
    lastFocus = trigger || document.activeElement;

    // Controls are wanted here, unlike the silent inline loops.
    var html = mediaHTML(item, true);
    html = html.replace("<video ", "<video controls ");

    box.querySelector(".lightbox-body").innerHTML = html;
    box.querySelector(".lightbox-caption").innerHTML =
      "<strong>" + esc(item.title || "") + "</strong>" +
      (item.caption ? " — " + prose(item.caption) : "");
    box.setAttribute("aria-label", item.title || "Clip");
    box.hidden = false;
    document.body.classList.add("has-lightbox");

    var v = box.querySelector("video");
    if (v && !reduced) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    box.querySelector(".lightbox-close").focus();
  }

  function close() {
    if (!box || box.hidden) return;
    box.hidden = true;
    box.querySelector(".lightbox-body").innerHTML = "";
    document.body.classList.remove("has-lightbox");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  // One delegated listener covers the rail, the gallery, and anything added later.
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-expand]");
    if (!b) return;
    var items = global.MEDIA || [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === b.dataset.expand) { open(items[i], b); return; }
    }
  });

  global.Media = {
    rail: rail,
    gallery: gallery,
    pauseAll: pauseAll,
    featured: function () {
      return (global.MEDIA || []).filter(function (m) { return m.featured; });
    }
  };

})(window);
