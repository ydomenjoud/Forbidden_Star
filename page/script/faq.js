/* Forbidden Stars — FAQ.
 * Настраивает window.FS_FAQ для script.js (data/FAQ.json).
 * Цвета разделов подставляет script.js из general.json (expansion.color).
 *
 * Формат FAQ.json:  [ {Category, items:[ {SubCategory, items:[ {Faction, picture,
 *   items:[ {Phrase, Main, Id?, Source?, Card?, CardSource?, RuleSource?, RelatedSources?, LegacySource?} ] } ] } ] } ]
 */
(function () {
  'use strict';

  window.FS_FAQ = {
    src: 'data/FAQ.json', // logical path, resolved by FSI18n
    get hero() {
      var t = window.FSI18n.t;
      return { kicker: t('faq.kicker'), title: t('faq.title'), blurb: t('faq.blurb') };
    },
    // Заполняется из general.json.expansion.color при загрузке
    dots: ['#d8a657'],

    flatten: function (raw) {
      var DOTS = this.dots && this.dots.length ? this.dots : ['#d8a657'];
      var navTopics = [{ key: 'all', name: window.FSI18n.t('faq.all'), kind: 'all', dot: DOTS[0] }];
      var cats = [];
      var count = { all: 0 };
      (raw || []).forEach(function (cat, ci) {
        var ckey = 'c' + ci;
        var catObj = {
          key: ckey,
          name: cat.Category || window.FSI18n.t('faq.section', { n: ci + 1 }),
          dot: DOTS[(ci + 1) % DOTS.length],
          subs: [],
        };
        navTopics.push({ key: ckey, name: catObj.name, kind: 'cat', dot: catObj.dot });
        count[ckey] = 0;
        (cat.items || []).forEach(function (sub, si) {
          var skey = ckey + '_s' + si;
          var subObj = { key: skey, name: sub.SubCategory || window.FSI18n.t('faq.group', { n: si + 1 }), factions: [] };
          var subCount = 0;
          (sub.items || []).forEach(function (fac) {
            var facObj = { faction: fac.Faction || '', picture: fac.picture || '', items: [] };
            (fac.items || []).forEach(function (it) {
              if (!it || !it.Phrase) return;
              var id = it.Id || (window.FSNav ? window.FSNav.faqId(cat.Category, sub.SubCategory, fac.Faction, it.Phrase, it.Source) : (ckey + '_' + skey + '_' + count.all));
              facObj.items.push({ id: id, q: it.Phrase, a: it.Main || '', source: it.Source || '',
                card: it.Card || '', cardSource: it.CardSource || '', ruleSource: it.RuleSource || '', relatedSources: it.RelatedSources || [], legacySource: it.LegacySource || '' });
              subCount++; count[ckey]++; count.all++;
            });
            if (facObj.items.length) subObj.factions.push(facObj);
          });
          if (subObj.factions.length) {
            count[skey] = subCount;
            navTopics.push({ key: skey, name: subObj.name, kind: 'sub', parent: ckey });
            catObj.subs.push(subObj);
          }
        });
        cats.push(catObj);
      });
      return { navTopics: navTopics, cats: cats, count: count };
    },
  };
})();
