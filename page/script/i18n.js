/* Interface language and localized data. Russian is the complete base locale;
 * other locales are partial overlays merged over it, so anything not translated
 * falls back to Russian. Images are shared and never localized. */
(function (root) {
  'use strict';
  var BASE = 'ru';
  var languages = [{id: 'ru', label: 'Русский'}, {id: 'en', label: 'English'}, {id: 'fr', label: 'Français'}];
  var STORAGE_KEY = 'fs-lang';
  var dictionary = {}, baseDictionary = {};

  function normalize(value) {
    value = String(value || '').toLowerCase().slice(0, 2);
    return languages.some(function (l) { return l.id === value; }) ? value : null;
  }
  function stored() {
    try { return normalize(root.localStorage.getItem(STORAGE_KEY)); } catch (error) { return null; }
  }
  function detect() {
    var fromQuery = null;
    try { fromQuery = normalize(new URLSearchParams(root.location.search).get('lang')); } catch (error) {}
    var nav = root.navigator && (root.navigator.languages || [root.navigator.language]) || [];
    return fromQuery || stored() || nav.map(normalize).find(Boolean) || BASE;
  }
  var lang = detect();

  function isObject(v) { return v && typeof v === 'object' && !Array.isArray(v); }
  /* Objects merge by key and arrays of objects by index; everything else,
   * including arrays of strings, is replaced by the overlay. */
  function merge(base, overlay) {
    if (overlay === undefined) return base;
    if (isObject(base) && isObject(overlay)) {
      var result = Object.assign({}, base);
      Object.keys(overlay).forEach(function (key) { result[key] = merge(base[key], overlay[key]); });
      return result;
    }
    if (Array.isArray(base) && Array.isArray(overlay) && overlay.length && overlay.every(isObject)) {
      var length = Math.max(base.length, overlay.length), out = [];
      for (var i = 0; i < length; i++) out.push(i < overlay.length ? merge(base[i], overlay[i]) : base[i]);
      return out;
    }
    return overlay;
  }

  /* options.replace: the overlay file replaces the Russian one as a whole
   * (FAQ, whose structure differs per language). A missing or failing overlay
   * leaves the Russian file in place. */
  function json(path, options) {
    options = options || {};
    var target = options.lang ? normalize(options.lang) || BASE : lang;
    var base = root.FSCache.json('locales/' + BASE + '/' + path);
    if (target === BASE) return base;
    var overlay = root.FSCache.json('locales/' + target + '/' + path).catch(function () { return undefined; });
    return Promise.all([base, overlay]).then(function (pair) {
      if (pair[1] === undefined) return pair[0];
      return options.replace ? pair[1] : merge(pair[0], pair[1]);
    });
  }

  function load(code) {
    return Promise.resolve().then(function () { return root.FSCache.json('locales/' + code + '/ui.json'); }).catch(function () { return {}; });
  }
  var ready = Promise.all([load(BASE), lang === BASE ? null : load(lang)]).then(function (pair) {
    baseDictionary = pair[0];
    dictionary = pair[1] ? Object.assign({}, pair[0], pair[1]) : pair[0];
    if (root.document) {
      root.document.title = t('page.title');
      var meta = root.document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', t('page.description'));
    }
    return lang;
  });

  var rules = null;
  function plural(n) {
    try { rules = rules || new Intl.PluralRules(lang); return rules.select(n); } catch (error) { return 'other'; }
  }
  /* t('key', {n: 3, name: 'x'}): `{name}` placeholders; an entry may be an
   * object of plural forms ({one, few, many, other}) chosen by `n`. */
  function t(key, vars) {
    var entry = dictionary[key];
    if (entry === undefined) entry = baseDictionary[key];
    if (entry === undefined) return key;
    if (isObject(entry)) entry = entry[plural(Number(vars && vars.n))] || entry.other || entry.many || '';
    return String(entry).replace(/\{(\w+)\}/g, function (match, name) {
      return vars && vars[name] !== undefined ? vars[name] : match;
    });
  }

  function set(code) {
    code = normalize(code);
    if (!code) return;
    try { root.localStorage.setItem(STORAGE_KEY, code); } catch (error) {}
    var url = new URL(root.location.href);
    url.searchParams.set('lang', code);
    root.location.assign(url.toString());
  }

  if (root.document && root.document.documentElement) root.document.documentElement.lang = lang;

  var api = {languages: languages, base: BASE, normalize: normalize, merge: merge, json: json, ready: ready, t: t, set: set,
    get lang() { return lang; }};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FSI18n = api;
})(typeof window !== 'undefined' ? window : globalThis);
