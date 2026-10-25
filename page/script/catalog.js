/* One card model from the existing faction manifests and Russian text. */
(function (root) {
  'use strict';
  var modes=root.FSModes || (typeof require==='function'?require('./modes.js'):null);
  var folders = {combat:'combat',orders:'orders',events:'events',backs:'backs',faction_card:'faction_card',map:'maps'};
  var playable = ['combat','orders','events'], supported = ['base','gif','sow','dl'];
  function manifest(general, data) {
    var files = Object.assign({},general.filenames,data.filenames || {}), result = {};
    Object.keys(folders).forEach(function (category) {
      var list = files[category] || [];
      if (!Array.isArray(list) || (category === 'combat' && list.some(function (tier) { return !Array.isArray(tier); }))) throw new Error('Некорректный манифест: ' + category);
      result[category] = list;
    });
    return result;
  }
  // Fallback labels. Printing is Russian-only and passes no translator; the browser passes FSI18n.t.
  var RU={'label.set':'Набор {n}','label.back':'Задник','label.sheet':'Справочник','label.map':'Карта {x}','label.order':'Приказ {n}','label.event':'Событие {n}','label.sheetBack':'Оборот','label.sheetAbilities':'Способности и отряды'};
  function word(t,key,vars) {
    if(t)return t(key,vars);
    return RU[key].replace(/\{(\w+)\}/g,function (m,name) {return vars&&vars[name]!==undefined?vars[name]:m;});
  }
  function factionCards(general, data, expansion, faction, factionTitle, t) {
    if (!supported.includes(expansion) || !general.expansion.folder.includes(expansion) || !/^[a-z]+$/.test(faction)) throw new Error('Неподдерживаемая фракция');
    var files = manifest(general,data), cards = [], ids = new Set(), labels = general.labels || {};
    factionTitle = factionTitle || faction;
    Object.keys(folders).forEach(function (category) {
      var groups = category === 'combat' ? files.combat : [files[category]];
      groups.forEach(function (group,tier) { group.forEach(function (file,index) {
        if (!/^[a-zA-Z0-9_.-]+\.jpg$/.test(file)) throw new Error('Некорректное имя файла: ' + file);
        var relative = folders[category] + '/' + file, src = 'factions/' + expansion + '/' + faction + '/' + relative;
        var raw = category === 'combat' ? (data.combatText || [])[tier]?.[index] : (data[category + 'Text'] || [])[index];
        var sourceText=raw?.sourceText || data.sourceText?.[category] || 'printed';
        if(!['printed','template'].includes(sourceText))throw new Error('Некорректный тип исходного изображения: '+relative);
        var text = raw ? category === 'combat' ? {title:raw.title,background:raw.general,foreground:raw.unit,icons:raw.icons,source:raw.source,aspect:raw.aspect,raster:!!data.rasterText} : Object.assign({},raw,{raster:!!data.rasterText || !!raw.raster}) : null;
        var kind = playable.includes(category) ? category : null;
        var component = (data.componentsText || {})[relative];
        if (component) { text = component; kind = 'overlay'; }
        var tierLabel = (data.tierLabels || [])[tier] || (labels.tiers || [])[tier] || word(t,'label.set',{n:tier+1});
        var label = text && text.title;
        if (!label) {
          if (category === 'combat') label = factionTitle + ' · ' + tierLabel + ' ' + (index+1);
          else if (category === 'backs') label = (labels.backs || {})[file.slice(0,-4)] || word(t,'label.back');
          else if (category === 'faction_card') label = factionTitle + ' ' + word(t,'label.sheet') + (group.length>1 ? ' '+(index+1) : '');
          else if (category === 'map') label = word(t,'label.map',{x:/^map_([A-Z])\.jpg$/i.exec(file)?.[1].toUpperCase() || String.fromCharCode(65+index)});
          else label = word(t,category === 'orders' ? 'label.order' : 'label.event',{n:index+1});
        }
        var id = expansion + '/' + faction + '/' + folders[category] + '/' + file.slice(0,-4);
        var card = {id:id,factionId:expansion+'/'+faction,exp:expansion,fac:faction,category:category,file:file,tier:tier,index:index,
          title:text && text.title || label,label:label,tierLabel:tierLabel,src:src,kind:kind,text:text,
          template:(data.templates || {})[relative] || null,aspect:playable.includes(category) ? data.cardAspect || null : null,factionTitle:factionTitle,nativeText:sourceText==='printed'};
        if(category==='combat'&&data.combatFrame)card.template=Object.assign({},card.template,{frame:data.combatFrame});
        // A manifest still names the original asset. Atlas views describe its
        // printed sides; the first view retains existing card IDs and links.
        var views = category === 'faction_card' && component?.views || [component || {}];
        if (!Array.isArray(views) || !views.length) throw new Error('Нет сторон листа: ' + relative);
        var sides = new Set();
        views.forEach(function (view, side) {
          var entry = Object.assign({},card);
          // A locale may ship its own raster for sheets whose lettering is baked in.
          if (component?.image) entry.artSrc = component.image;
          if (category === 'faction_card' && data.factionSheet) {
            var sheet = data.factionSheet;
            if (!['front','back'].includes(view.side) || sides.has(view.side) || !sheet.abilities?.length) throw new Error('Некорректная сторона листа: ' + relative);
            sides.add(view.side);
            entry.id += side ? '/' + view.side : '';
            entry.src += side ? '?side=' + encodeURIComponent(view.side) : '';
            entry.title = entry.label = sheet.title + ' · ' + word(t,view.side === 'back' ? 'label.sheetBack' : 'label.sheetAbilities');
            entry.kind = 'sheet';
            entry.text = Object.assign({},view,{title:entry.title,sheet:sheet,
              general:sheet.abilities.map(function (ability) { return ability.title + ': ' + ability.text; }).join(' *newpara* ')});
          }
          if (ids.has(entry.id)) throw new Error('Повторяющийся ID: ' + entry.id); ids.add(entry.id);
          cards.push(entry);
        });
      }); });
    });
    return cards;
  }
  function printCatalog(spec,general,factionDocs,texts,displayMode,rnb,language) {
    var russian=!language || language==='ru';
    if (spec.id !== 'mixed' || spec.schemaVersion !== 4 || spec.widthMm !== 63 || spec.heightMm !== 88 || spec.dpi !== 300 || !Array.isArray(spec.expansions) || new Set(spec.expansions).size !== spec.expansions.length) throw new Error('Неподдерживаемая спецификация печати');
    var factions = [], cards = [], ids = new Set();
    spec.expansions.forEach(function (expansion) {
      if (!supported.includes(expansion) || !general.expansion.folder.includes(expansion) || (spec.excluded || []).some(function (e) { return e.expansion===expansion; })) throw new Error('Не подтверждён печатный формат: ' + expansion);
      var doc = factionDocs[expansion];
      if (!doc || !Array.isArray(doc.folder) || doc.folder.length !== doc.name.length || new Set(doc.folder).size !== doc.folder.length) throw new Error('Нет списка фракций: ' + expansion);
      doc.folder.forEach(function (faction,index) {
        var id = expansion+'/'+faction, data = texts[id];
        if (!data) throw new Error('Нет русского текста: ' + id);
        var name = doc.name[index], files = manifest(general,data);
        factions.push({id:id,title:name,expansion:expansion,renderMode:'composite'});
        factionCards(general,data,expansion,faction,name).filter(function (c) { return playable.includes(c.category); }).forEach(function (card) {
          if (ids.has(card.id)) throw new Error('Повторяющийся ID: ' + card.id); ids.add(card.id);
          if (!card.text || (russian ? !/[А-Яа-яЁё]/.test(card.title) : !card.title) || !(card.text.background || card.text.foreground || card.text.general) || data.rasterText) throw new Error('Нет подтверждённого русского шаблона: ' + card.id);
          if (/^(base|gif)$/.test(expansion) && (!card.template || (card.category==='combat' ? !card.template.picture : !card.template.patches?.length))) throw new Error('Нет чистого шаблона: ' + card.id);
          var back = spec.backTypes[card.category];
          if (!/^[a-z0-9_]+\.jpg$/.test(back || '') || !files.backs.includes(back)) throw new Error('Нет рубашки нужного типа: ' + card.id);
          cards.push(Object.assign(modes.apply(card,displayMode,rnb),{back:back,backSrc:'factions/'+id+'/backs/'+back}));
        });
      });
    });
    if (!Array.isArray(spec.calibrationIds) || new Set(spec.calibrationIds).size!==spec.calibrationIds.length || spec.calibrationIds.some(function (id) { return !ids.has(id); })) throw new Error('Контрольный набор отсутствует в манифестах');
    return Object.assign({},spec,{factions:factions,cards:cards,displayMode:modes.normalize(displayMode),ruleVersion:modes.normalize(displayMode)==='rnb'?rnb.version:null});
  }
  // Localized data is addressed by its logical path ('factions/general.json'). The Russian files are the
  // base; a 'xx:' prefix names the overlay of language xx. Source versions of Russian print sets only
  // hash the Russian files, so they stay valid; other languages also hash their overlay files.
  function localePath(path) {
    var overlay=/^([a-z]{2}):(.*)$/.exec(path);
    if(overlay)return 'locales/'+overlay[1]+'/'+overlay[2];
    return path==='data/print-catalog.json'?path:'locales/ru/'+path;
  }
  function sourcePaths(expansion,faction,displayMode,language) {
    var paths=['data/print-catalog.json','factions/general.json','factions/'+expansion+'/faction.json','factions/'+expansion+'/'+faction+'/text.json'];
    if(language && language!=='ru')paths=paths.concat(paths.slice(1).map(function (path) {return language+':'+path;}));
    if(modes.normalize(displayMode)==='rnb')paths.push('data/rnb.json');
    return paths.sort();
  }
  function localized(path,options) {return root.FSI18n?root.FSI18n.json(path,options):root.FSCache.json(localePath(path));}
  async function loadFactionCards(expansion,faction,displayMode) {
    var data = await Promise.all([localized('factions/general.json'),localized('factions/'+expansion+'/faction.json'),localized('factions/'+expansion+'/'+faction+'/text.json')]);
    var index = data[1].folder.indexOf(faction); if (index<0) throw new Error('Нет фракции: '+expansion+'/'+faction);
    var rnb=await modes.load(displayMode);
    return factionCards(data[0],data[2],expansion,faction,data[1].name[index]).map(function (c) {return modes.apply(c,displayMode,rnb);});
  }
  async function loadPrintCatalog(displayMode,language) {
    language=language||'ru';
    var rnb=await modes.load(displayMode);
    var pair = await Promise.all([root.FSCache.json('data/print-catalog.json'),localized('factions/general.json',{lang:language})]), spec=pair[0],general=pair[1],docs={},texts={},versions={};
    await Promise.all(spec.expansions.map(async function (expansion) {
      var doc=docs[expansion]=await localized('factions/'+expansion+'/faction.json',{lang:language});
      await Promise.all(doc.folder.map(async function (faction) { var id=expansion+'/'+faction;texts[id]=await localized('factions/'+id+'/text.json',{lang:language});versions[id]=await root.FSCache.fingerprint(sourcePaths(expansion,faction,displayMode,language),localePath); }));
    }));
    var catalog=printCatalog(spec,general,docs,texts,displayMode,rnb,language);catalog.cards.forEach(function (card) { card.sourceVersion=versions[card.factionId]; });
    return {catalog:catalog,cards:catalog.cards};
  }
  var api={folders:folders,manifest:manifest,factionCards:factionCards,printCatalog:printCatalog,sourcePaths:sourcePaths,loadFactionCards:loadFactionCards,loadPrintCatalog:loadPrintCatalog};
  if (typeof module!=='undefined' && module.exports) module.exports=api;
  else root.FSCatalog=api;
})(typeof window!=='undefined'?window:globalThis);
