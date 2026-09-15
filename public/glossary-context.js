/* Personal dictionary -> Soniox `context` + a line for the GPT prompts.
 *
 * Cloud entries come from /api/glossary (signed-in users); entries kept on this
 * device live in localStorage "fm_glossary_v1", so the dictionary also works
 * signed out. Managed at /dictionary.
 *
 *   window.fmGlossary.load(lang)  -> Promise<{context, prompt}>  (refresh + cache)
 *   window.fmGlossary.get()       -> the cached value, ready to drop into a config
 */
(function () {
  var LS = "fm_glossary_v1", NL = String.fromCharCode(10), cache = { context: null, prompt: "" };

  function localTerms() {
    try { var a = JSON.parse(localStorage.getItem(LS) || "[]"); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }

  function build(list, lang) {
    var words = [], pairs = [], seen = {}, spell = [], keep = [];
    (list || []).forEach(function (t) {
      if (!t || !t.term || t.active === false) return;
      if (lang && t.langs && t.langs.length && t.langs.indexOf(lang) < 0) return;
      var display = t.display || t.term, aliases = t.aliases || [];
      [display, t.term].concat(aliases).forEach(function (w) { if (w && !seen[w]) { seen[w] = 1; words.push(w); } });
      aliases.forEach(function (a) { if (a && a !== display) pairs.push({ source: a, target: display }); });
      if (t.keep_original !== false) { pairs.push({ source: t.term, target: display }); keep.push(display); }
      spell.push(display + (aliases.length ? " (also heard as: " + aliases.join(", ") + ")" : ""));
    });

    var ctx = null;
    if (words.length || pairs.length) {
      ctx = {};
      if (words.length) ctx.terms = words.slice(0, 400);
      if (pairs.length) ctx.translation_terms = pairs.slice(0, 400);
      // Soniox caps the context at ~10,000 characters.
      while (JSON.stringify(ctx).length > 9000) {
        if (ctx.translation_terms && ctx.translation_terms.length) ctx.translation_terms.pop();
        else if (ctx.terms && ctx.terms.length) ctx.terms.pop();
        else break;
      }
    }

    var prompt = "";
    if (spell.length) {
      prompt = "Names and terms from the user's dictionary - always write them exactly like this:" + NL + spell.join(NL);
      if (keep.length) prompt += NL + "Never translate or re-spell these: " + keep.join(", ") + ".";
    }
    return { context: ctx, prompt: prompt.slice(0, 9000) };
  }

  function load(lang) {
    var mine = localTerms();
    return fetch("/api/glossary", { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .catch(function () { return null; })
      .then(function (d) {
        var cloud = (d && d.terms) || [], ids = {};
        cloud.forEach(function (c) { if (c && c.client_id) ids[c.client_id] = 1; });
        var all = cloud.concat(mine.filter(function (x) { return !x.client_id || !ids[x.client_id]; }));
        cache = build(all, lang);
        return cache;
      });
  }

  window.fmGlossary = {
    load: load,
    get: function () { return cache; },
    build: build,
  };
  try { load(); } catch (e) {}
})();
