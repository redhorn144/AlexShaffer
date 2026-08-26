/* ============================================================================
   bibtex.js — a small, dependency-free BibTeX parser.

   You should never need to edit this file. It turns content/publications.bib
   into structured objects for render.js.

   Public API:
     BibTeX.parse(text)  -> { entries: [...], errors: [...] }
     BibTeX.decode(text) -> LaTeX-escaped string as plain Unicode

   Each entry looks like:
     { key, type, category, fields: {...}, authors: [...],
       year: Number|null, month: Number, raw: "@article{...}" }

   Each author looks like:
     { first, last, initials, corporate: Bool, others: Bool }
   ========================================================================== */

(function (global) {
  "use strict";

  /* -- LaTeX decoding ----------------------------------------------------- */

  // Combining diacritics; NFC normalisation folds them into real characters.
  var ACCENTS = {
    "'": "́", "`": "̀", '"': "̈", "^": "̂", "~": "̃",
    "=": "̄", ".": "̇", "u": "̆", "v": "̌", "H": "̋",
    "r": "̊", "c": "̧", "k": "̨", "d": "̣", "b": "̱"
  };

  var SYMBOLS = {
    ss: "ß", ae: "æ", AE: "Æ", oe: "œ", OE: "Œ",
    aa: "å", AA: "Å", o: "ø", O: "Ø",
    l: "ł", L: "Ł", i: "ı", j: "ȷ",
    dag: "†", ddag: "‡", copyright: "©", pounds: "£",
    ldots: "…", dots: "…"
  };

  // Characters that are escaped in LaTeX and must survive brace-stripping.
  var ESCAPED = { "{": "", "}": "", "%": "", "&": "",
                  "_": "", "#": "", "$": "" };
  var UNESCAPE = {};
  Object.keys(ESCAPED).forEach(function (c) { UNESCAPE[ESCAPED[c]] = c; });

  function applyAccent(mark, arg) {
    var base = decode(arg);
    // A dotless i/j takes its dot back when accented.
    if (base === "ı") base = "i";
    if (base === "ȷ") base = "j";
    if (!base) return "";
    // Accent attaches to the first character, not the whole word.
    return (base.charAt(0) + mark + base.slice(1));
  }

  function decode(s) {
    if (s == null) return "";
    s = String(s);

    // 1. Park escaped specials out of harm's way.
    s = s.replace(/\\([{}%&_#$])/g, function (m, c) { return ESCAPED[c]; });

    // 2. Math delimiters carry no meaning for us.
    s = s.replace(/\$/g, "");

    // 3. Unwrap font/formatting commands, innermost first.
    var FONT = /\\(?:textbf|textit|textrm|textsc|texttt|textup|textnormal|emph|mbox|text|ensuremath|protect)\s*\{([^{}]*)\}/g;
    for (var i = 0; i < 4 && FONT.test(s); i++) { FONT.lastIndex = 0; s = s.replace(FONT, "$1"); }
    FONT.lastIndex = 0;

    // 4. Accents: \'{e}  \'e  \c{c}  \c c  \H{o}  \H o
    s = s.replace(/\\(['`"^~=.]|[uvHrckdb])\s*\{([^{}]*)\}/g, function (m, a, arg) {
      return ACCENTS[a] ? applyAccent(ACCENTS[a], arg) : m;
    });
    s = s.replace(/\\(['`"^~=.])\s*(\\?[a-zA-Z])/g, function (m, a, ch) {
      return applyAccent(ACCENTS[a], ch);
    });
    s = s.replace(/\\([uvHrckdb])\s+([a-zA-Z])(?![a-zA-Z])/g, function (m, a, ch) {
      return applyAccent(ACCENTS[a], ch);
    });

    // 5. Standalone symbol commands.
    s = s.replace(/\\(ss|ae|AE|oe|OE|aa|AA|ldots|dots|dag|ddag|copyright|pounds|[oOlLij])(?![a-zA-Z])/g,
      function (m, name) { return SYMBOLS[name] !== undefined ? SYMBOLS[name] : m; });

    // 6. Drop anything else that still looks like a command.
    s = s.replace(/\\[a-zA-Z]+\s*/g, "");
    s = s.replace(/\\(.)/g, "$1");

    // 7. Dashes.
    s = s.replace(/---/g, "—").replace(/--/g, "–");

    // 8. Braces have done their job (they only guarded capitalisation).
    s = s.replace(/[{}]/g, "");

    // 9. Whitespace, then ties. Order matters: \s also matches U+00A0.
    s = s.replace(/\s+/g, " ").trim();
    s = s.replace(/~/g, " ");

    // 10. Put the escaped specials back.
    s = s.replace(/[-]/g, function (c) { return UNESCAPE[c]; });

    return s.normalize ? s.normalize("NFC") : s;
  }

  // For URLs, DOIs and arXiv ids. These must NOT go through decode(): it would
  // turn "--" in a DOI into an en dash and "~" in a URL into a space.
  // Braces and LaTeX escapes still have to come off, and BibTeX exporters wrap
  // long URLs across lines, so whitespace goes too.
  function plain(s) {
    if (s == null) return "";
    return String(s)
      .replace(/\\([{}%&_#$])/g, "$1")
      .replace(/[{}]/g, "")
      .replace(/\s*[\r\n]\s*/g, "")  // rejoin URLs the exporter wrapped
      .trim();                       // but keep spaces inside a local filename
  }

  /* -- Low-level readers -------------------------------------------------- */

  function BibError(msg) { this.message = msg; }
  BibError.prototype.toString = function () { return this.message; };

  // s[i] must be "{". Returns [contents, indexAfterClosingBrace].
  function readBraced(s, i) {
    var depth = 0, out = "", start = i;
    for (; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === "\\" && i + 1 < s.length) { out += c + s.charAt(i + 1); i++; continue; }
      if (c === "{") { depth++; if (depth === 1) continue; }
      else if (c === "}") { depth--; if (depth === 0) return [out, i + 1]; }
      out += c;
    }
    throw new BibError("Unbalanced braces starting at character " + start +
                       " — a “{” is never closed.");
  }

  // s[i] must be '"'. Returns [contents, indexAfterClosingQuote].
  function readQuoted(s, i) {
    var depth = 0, out = "", start = i;
    for (i++; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === "\\" && i + 1 < s.length) { out += c + s.charAt(i + 1); i++; continue; }
      if (c === "{") depth++;
      else if (c === "}") depth--;
      else if (c === '"' && depth === 0) return [out, i + 1];
      out += c;
    }
    throw new BibError("Unbalanced quotes starting at character " + start +
                       " — a double quote is never closed.");
  }

  function skipWs(s, i) {
    while (i < s.length && /\s/.test(s.charAt(i))) i++;
    return i;
  }

  // A field value: brace group, quoted string, number, or @string abbreviation,
  // any number of them joined with "#".
  function readValue(s, i, strings) {
    var out = "";
    for (;;) {
      i = skipWs(s, i);
      var c = s.charAt(i), part;
      if (c === "{") { part = readBraced(s, i); out += part[0]; i = part[1]; }
      else if (c === '"') { part = readQuoted(s, i); out += part[0]; i = part[1]; }
      else {
        var m = /^[^\s,}#]+/.exec(s.slice(i));
        if (!m) break;
        var word = m[0];
        out += Object.prototype.hasOwnProperty.call(strings, word.toLowerCase())
          ? strings[word.toLowerCase()] : word;
        i += word.length;
      }
      i = skipWs(s, i);
      if (s.charAt(i) === "#") { i++; continue; }
      break;
    }
    return [out, i];
  }

  /* -- Name parsing ------------------------------------------------------- */

  // Split on " and " at brace depth 0.
  function splitNames(s) {
    var parts = [], depth = 0, cur = "";
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === "{") depth++;
      else if (c === "}") depth--;
      if (depth === 0 && /\s/.test(c)) {
        var m = /^\s+and\s+/.exec(s.slice(i));
        if (m) { parts.push(cur); cur = ""; i += m[0].length - 1; continue; }
      }
      cur += c;
    }
    parts.push(cur);
    return parts.map(function (p) { return p.trim(); }).filter(Boolean);
  }

  function splitTopLevel(s, sep) {
    var parts = [], depth = 0, cur = "";
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === "{") depth++;
      else if (c === "}") depth--;
      if (c === sep && depth === 0) { parts.push(cur); cur = ""; continue; }
      cur += c;
    }
    parts.push(cur);
    return parts.map(function (p) { return p.trim(); });
  }

  function initialsOf(given) {
    return splitTopLevel(given, " ")
      .filter(Boolean)
      .map(function (tok) {
        var d = decode(tok);
        return d ? d.charAt(0).toUpperCase() + "." : "";
      })
      .filter(Boolean)
      .join(" ");
  }

  // Is the whole string one brace group, e.g. "{The X Collaboration}"?
  function isWholeGroup(s) {
    if (s.charAt(0) !== "{") return false;
    try { return readBraced(s, 0)[1] === s.length; } catch (e) { return false; }
  }

  function parseName(raw) {
    if (/^others$/i.test(raw.trim())) {
      return { first: "", last: "", initials: "", corporate: false, others: true };
    }
    if (isWholeGroup(raw)) {
      return { first: "", last: decode(raw), initials: "", corporate: true, others: false };
    }

    var commas = splitTopLevel(raw, ",");
    var given, family;

    if (commas.length >= 2) {
      // "von Last, First" or "von Last, Jr, First"
      family = commas[0];
      given = commas[commas.length - 1];
    } else {
      // "First von Last"
      var toks = splitTopLevel(raw, " ").filter(Boolean);
      if (toks.length <= 1) {
        return { first: "", last: decode(raw), initials: "", corporate: false, others: false };
      }
      var lead = toks.slice(0, -1);
      // Lowercase leading words ("van", "de la") belong to the surname.
      var vonAt = lead.findIndex(function (t) { return /^[a-z]/.test(decode(t)); });
      if (vonAt === -1) { given = lead.join(" "); family = toks[toks.length - 1]; }
      else {
        given = lead.slice(0, vonAt).join(" ");
        family = lead.slice(vonAt).concat(toks.slice(-1)).join(" ");
      }
    }

    return {
      first: decode(given),
      last: decode(family),
      initials: initialsOf(given),
      corporate: false,
      others: false
    };
  }

  /* -- Categories & months ------------------------------------------------ */

  var MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
                 jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

  function monthOf(v) {
    if (!v) return 0;
    var s = String(v).trim().toLowerCase();
    var n = parseInt(s, 10);
    if (!isNaN(n) && n >= 1 && n <= 12) return n;
    return MONTHS[s.slice(0, 3)] || 0;
  }

  function categorise(type, fields) {
    var isPreprint = !!(fields.eprint || fields.archiveprefix || fields.arxiv);
    switch (type) {
      case "article":
        return isPreprint && !fields.journal ? "Preprint" : "Journal";
      case "inproceedings":
      case "conference":
      case "proceedings":
        return "Conference";
      case "misc":
      case "unpublished":
        return isPreprint ? "Preprint" : "Other";
      default:
        return "Other";
    }
  }

  /* -- The parser --------------------------------------------------------- */

  function parse(text) {
    var entries = [], errors = [], strings = {}, i = 0, n = text.length;

    while (i < n) {
      var c = text.charAt(i);

      // Outside an entry, "%" comments out the rest of the line.
      if (c === "%") { var nl = text.indexOf("\n", i); i = nl === -1 ? n : nl + 1; continue; }
      if (c !== "@") { i++; continue; }

      var head = /^@\s*([A-Za-z]+)\s*[{(]/.exec(text.slice(i));
      if (!head) { i++; continue; }   // a stray "@" (an email address, say)

      var start = i;
      var type = head[1].toLowerCase();
      var bodyAt = i + head[0].length - 1;   // index of "{" or "("

      try {
        var open = text.charAt(bodyAt);
        var body, after;
        if (open === "{") { var r = readBraced(text, bodyAt); body = r[0]; after = r[1]; }
        else {
          // Parenthesised entries: @type( ... ). Find the ")" that closes it,
          // ignoring any that sit inside a brace group.
          var d = 0, close = -1;
          for (var p = bodyAt + 1; p < n; p++) {
            var pc = text.charAt(p);
            if (pc === "\\") { p++; continue; }
            else if (pc === "{") d++;
            else if (pc === "}") d--;
            else if (pc === ")" && d === 0) { close = p; break; }
          }
          if (close === -1) throw new BibError("Unclosed @" + type + "( ... ) entry.");
          body = text.slice(bodyAt + 1, close);
          after = close + 1;
        }

        if (type === "comment" || type === "preamble") { i = after; continue; }

        if (type === "string") {
          var eq = body.indexOf("=");
          if (eq > 0) {
            var sname = body.slice(0, eq).trim().toLowerCase();
            strings[sname] = readValue(body, eq + 1, strings)[0];
          }
          i = after;
          continue;
        }

        // --- a real entry ---
        var j = skipWs(body, 0);
        var keyEnd = body.indexOf(",", j);
        var key, rest;
        if (keyEnd === -1) { key = body.slice(j).trim(); rest = ""; }
        else { key = body.slice(j, keyEnd).trim(); rest = body.slice(keyEnd + 1); }

        var fields = {}, k = 0;
        while (k < rest.length) {
          k = skipWs(rest, k);
          if (k >= rest.length) break;
          if (rest.charAt(k) === ",") { k++; continue; }

          var fm = /^([A-Za-z][A-Za-z0-9_:.\-]*)\s*=/.exec(rest.slice(k));
          if (!fm) {
            // Not a field we can make sense of — skip to the next comma.
            var nc = rest.indexOf(",", k);
            if (nc === -1) break;
            k = nc + 1;
            continue;
          }
          var fname = fm[1].toLowerCase();
          var vr = readValue(rest, k + fm[0].length, strings);
          fields[fname] = vr[0];
          k = vr[1];
          if (rest.charAt(k) === ",") k++;
        }

        var yearNum = parseInt(decode(fields.year || fields.date || ""), 10);

        entries.push({
          key: key,
          type: type,
          fields: fields,
          category: categorise(type, fields),
          authors: splitNames(fields.author || "").map(parseName),
          editors: splitNames(fields.editor || "").map(parseName),
          year: isNaN(yearNum) ? null : yearNum,
          month: monthOf(fields.month),
          raw: text.slice(start, after).trim()
        });

        i = after;

      } catch (err) {
        var line = text.slice(0, start).split("\n").length;
        errors.push("Line " + line + ": " + (err.message || String(err)));
        // Don't spin on a broken entry — resume after this "@".
        i = start + 1;
      }
    }

    // Newest first; month breaks ties; then title, so the order is stable.
    entries.sort(function (a, b) {
      if ((b.year || 0) !== (a.year || 0)) return (b.year || 0) - (a.year || 0);
      if (b.month !== a.month) return b.month - a.month;
      return decode(a.fields.title || "").localeCompare(decode(b.fields.title || ""));
    });

    return { entries: entries, errors: errors };
  }

  global.BibTeX = { parse: parse, decode: decode, plain: plain };

})(window);
