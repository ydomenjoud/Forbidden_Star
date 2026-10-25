# Forbidden Stars — cards and FAQ

**English** · [Français](README.fr.md) · [Русский](README.ru.md)

A multilingual reference (Russian, English, French) for the Forbidden Stars board game and its fan expansions. Faction cards, combat cards, orders, events and rules answers are gathered in one place. The Russian version is the most complete; English and French are layered on top of it.

**[Open the reference](https://molonlabem.github.io/Forbidden_Star/page/)**

## Features

- Browse cards by expansion, faction and type.
- Search by names and the available rules text, including the FAQ.
- Direct links to individual cards.
- Three card versions: "Classic", "Updated" and RNB. "Updated" opens by default; the selected version is kept in the link.
- Side-by-side version comparison: three layout examples and the verified RNB changes, with Russian texts, a faction filter and source links.
- Russian text with in-game symbols and a choice of token style.
- In card and FAQ descriptions, cubes and temporary values use the same symbols as on the cards; hover over a symbol to see its name.
- Supply, forge and reinforcement tokens keep a consistent orientation in colour and black-and-white, in descriptions and in print.
- Card zoom and mobile viewing.
- Sharp images in the grid: text is drawn losslessly at the source resolution, taking the screen DPI into account. Cards are shown more compactly; lazy loading and pausing the background queue when a card is opened are preserved.
- Printing directly on the site: tick cards to select them, add a whole faction, set the number of copies and preview A4 or Letter. A PDF with fronts, backs and cut marks is generated in the browser.

## Expansions

- Base game.
- Galaxy in Flames (Forgotten Worlds in Troll's version).
- Symphony of War (Forsaken Voids in Troll's version).
- The Dying Light.

## About the project

The project is based on the [English reference by Frytkownica](https://github.com/Frytkownica/Forbidden_Star). This version adds a Russian translation, English and French localisations, new material and interface improvements. Clarifications also draw on the [FS League library](https://fixed-crane-287.notion.site/387346118c5d80caa6c1d8d50a60bc74?v=388346118c5d80308e06000cf1c80ca0); source links are given in the FAQ.

The site lives in the `page/` directory and needs no build step. To view it locally, start an HTTP server from the repository root, for example `python3 -m http.server 8000`, and open <http://localhost:8000/page/>.

The main page loads the shared data and faction lists, and the card text when a faction is selected. Card counters appear once the faction's data has loaded. The global search loads all factions when a query is typed; version comparison loads only the factions of the examples shown. Printing loads its own catalogue when opened. Requests use a shared session cache, so data that has already been loaded is not downloaded again.

On a phone, the "Factions" button opens the navigation by expansion and faction; in the reference, sections are available through "FAQ topics".

The menu showing the current version name — "Classic", "Updated" or RNB — combines the version choice, the token style and the higher sharpness of opened cards. "Updated" keeps the current dynamic layout and opens by default, regardless of any earlier choice stored in the browser. An explicit version in the link or in an imported print set takes precedence. "Classic" shows the original images, including the original language; empty SoW templates still receive Russian text from JSON. Cropping of sheet sides, navigation and zoom are available in all versions. Old links without a version keep opening the updated cards.

On dynamic combat cards, margins and line spacing are reduced to leave more room for the artwork. The size of the main text is unchanged; general and unit effects are still separated by green and yellow plates. Their frames and soft shadows are drawn at the source scale, and only the paper below the shadow is stretched. This layout is shared by viewing and printing in "Updated", RNB and on the empty "Classic" templates. The finished "Classic" images are preserved; for the raster TDL translations, the plates fully cover the previous inscriptions.

The paper texture and shading show faintly through the rules text, like printed ink. The effect preserves the position and size of the letters in viewing and printing.

The free part of the left frame of combat cards is taken once from the source image and, where needed, stretched continuously; repeated strips are not used. In Base and GiF, the `combatFrame` field defines a verified section, shared by the faction, that has no printed symbols, including cards with five combat symbols.

On dynamic order upgrades, the line "ONCE PER ROUND" is centred, separated from the effect by a larger gap and set at 80% of the main text size. It uses the free bottom margin of the paper. Its position relative to other effects is preserved; the layout is identical in viewing and printing.

The order types are called "Планирование" (Strategize), "Развёртывание" (Deploy), "Доминирование" (Dominate) and "Продвижение" (Advance). In named mentions, the words "Приказ" (Order) and "Фаза" (Phase) are also capitalised: "Приказ Планирования", "в Фазу Действий". These names are also used in TDL, RNB and the FAQ; card names such as "Адаптивные Стратегии" keep their own wording.

"Version comparison" is available in the side menu and in the current-version menu. The "Classic → Updated" tab shows a combat card, an event and an order upgrade with identical rules, as well as an example of embedded tokens, cubes and temporary values. The "Updated → RNB" tab shows 22 verified entries: changes to effects, restrictions, command level and clarifications. A clarification already reflected in the updated version is marked separately. Cards can be enlarged and the Russian texts expanded side by side; the faction filter and the open side are kept in the link. The examples in `page/data/version-comparison.json` contain only stable IDs of the shared catalogue; the RNB explanations are in `changes` inside `page/data/rnb.json`. Images and rules come from the same catalogue and renderer as in ordinary viewing.

The kind of source is described by the `sourceText` field in the faction JSON: `printed` — an image with text, `template` — an empty template. The value can be set for a category or for a specific card. Classic mode uses this data, with no image recognition and no exception list in the code.

RNB is a separate snapshot of the rules from [Factions | RNB Mod](https://fixed-crane-287.notion.site/387346118c5d80caa6c1d8d50a60bc74?v=388346118c5d80308e06000cf1c80ca0), version 1.3.2 as of 24 October 2026, taking the [latest changelog](https://fixed-crane-287.notion.site/Changelog-3ca346118c5d801d8d58ddfa5ae1972a) into account. The names and texts of 324 cards of Base, GiF and SoW are stored in `page/data/rnb.json` as overrides keyed by stable ID; the original `text.json` files and the shared catalogue are preserved. RNB search also understands the previous names. Unchanged abilities of the 12 factions are inherited from their Russian JSON. The new illustrations of the changelog take precedence over outdated fields of the Notion database: "ВАААГХ!!!!" uses alternative effects, "Работай быстрее!" has command level 2, and seven plans carry the restriction on skipping an order when the effect is fully carried out. In RNB mode, TDL and cards with no published version explicitly show a switch to the updated rules. The site does not contact Notion while viewing: refreshing the snapshot requires checking the source and changing the JSON.

The sheets of all factions are presented separately, front and back. Abilities are available under the image; the magnifier enlarges the sheet for scrolling by finger, mouse or keyboard arrows. On the 14 translatable SoW and TDL sides, headings use Headline, prose uses Friz Quadrata (EventFont), and in-game symbols are drawn as separate ForbiddenStars fragments. Ordinary parentheses remain punctuation. Names of factions, subfactions, units and tokens are centred; long labels of starting forces may take two lines. The subfaction and ability names are bold, ability descriptions are regular. On the back, objective headings are bold, descriptions and story are italic, and the author's signature is right-aligned. Old letters are removed while keeping the unprinted areas of the source paper; the background behind the letters is restored from neighbouring clean areas, and ruled plates keep their horizontal lines. The translation layout is measured in the sheet's source coordinates, independently of the output resolution. The source images, Russian text and old links are preserved. SoW sheets are scaled up to 1.4× the source width, Base and GiF up to 1.15×; scaling does not invent illustration details.

To print, turn on "Print mode", tick cards or add a whole faction, then open "Print". In the window you can change the number of copies, the paper, the margins and the flip for double-sided printing. Cards have a nominal size of 63×88 mm; print the PDF at 100% scale, with no fit-to-page. Check the physical front/back alignment on the calibration sheet first. Base, GiF and SoW are available; the TDL print format is not yet confirmed.

List thumbnails use the same card version and token style as the sheet preview and the PDF. They are generated from the full print render and loaded as you scroll; there is no separate catalogue of raster thumbnails. A quality check is available before downloading: the "Quality before printing" section shows the number of cards checked and warnings about source illustrations below 300 DPI and text smaller than 6 pt. The "Check the whole set" button also checks cards outside the current sheet. The calibration set contains nine cards, including the densest texts; on A4 with 5 mm margins it takes one sheet of fronts and one of backs. The ruler must measure 100 mm. The `long` or `short` flip edge is included in the PDF name so that calibration files are not mixed up. The digital check does not confirm physical front/back alignment or legibility on a particular printer.

Printing uses the selected version; its name is shown in the window and in the PDF name. Card sets are saved separately for each version. The RNB source fingerprints include its JSON, and previews of different versions are not mixed in the cache.

In the PDF, pages come in pairs: 1–2 are the front and back of the first sheet, 3–4 of the second. The backs are mirrored so that, once the sheet is flipped, they line up with the fronts: by columns for the long edge, by rows for the short edge. In the printer settings, choose the same flip edge as shown in the print window.

Card rendering lives in `page/script/cardrender.js`: headings use Headline, rules text uses ForbiddenStars, and the "План" (Plan) and "Тактика" (Tactics) labels use EventFont, as in the original SoW implementation, TDL included. TDL combat and event card names sit closer to the left edge and at the vertical centre of the field, as in GiF and SoW; combat names use the shared source font size and shrink only when necessary. Order upgrade names and text stay centred; the placement of the name does not depend on the area where old letters are removed. The background of TDL names is restored from the unprinted margins of the frame without text recognition; the cleaning recipes for orders keep the vertical position of the texture so that no stripes appear. Line breaks keep a number together with its game symbol and, where possible, avoid a single word at the end of a paragraph. Before the font is reduced, excess spacing is shrunk first; the original paragraphs and wording are preserved. The layout is computed in shared logical coordinates and then drawn at the required resolution: the grid, the opened card and print keep identical line breaks. The shared event text area leaves room for the frame's decoration; font size and spacing are chosen from the text without pixel analysis. Viewing keeps the proportions of the source image; the PDF sets the physical size separately. For raster combat cards, the boundaries of the source parchment are detected from the image, so a short effect does not cover an unnecessary part of the illustration. The JSON keeps the rules and the cleaning recipes tied to the source images; repeated text-field sizes are not needed there. The translation coordinates on faction sheets and cards describe their fixed printed areas.

The names and rules of dynamic cards come from the faction's `locales/<language>/factions/…/text.json` through the shared catalogue. This text is used on the image, in the caption, in search and in the description of the opened card. `page/data/cardnames.json` serves as a fallback reference for images without text data; it does not override the headings from `text.json`.

The background of TDL order upgrade rules is restored from the clean edges of their paper field: the shared algorithm preserves the tint of the source and the lower bevels of the frame, without picking a light fragment among the old letters. Wording and text sizes play no part in the background cleaning.

## Site structure and images

| Directory | Purpose |
| --- | --- |
| `page/locales/` | Texts by language: `ru/` — the complete base (manifests, Russian text, FAQ, card names, RNB, `ui.json`), `en/` — translation on top of Russian (from `Frytkownica/Forbidden_Star`), `fr/` — French translation on top of Russian. Anything missing from `en/` or `fr/` is taken from `ru/`. Language: `?lang=ru` / `?lang=en` / `?lang=fr` or the drop-down at the right of the header. Printing is Russian-only for now. |
| `page/factions/` | Source images of the four expansions. The originals are needed by classic mode, the renderer, sheets, card backs and direct links. |
| `page/data/` | Print settings and IDs of comparison examples. The card list is built by the shared catalogue from the faction manifests. |
| `page/script/`, `page/style/` | Code for viewing, search, rendering and printing; shared styles. |
| `page/pictures/` | Shared combat card panels: `background.png`, `foreground.png`, `bottom.png`; left-strip symbols: `bolter.png`, `shield.png`, `moral.png`. They are drawn by `cardrender.js`. Symbols within text use the game font. |
| `page/pictures/icons/` | Section and faction icons of the FAQ, referenced in `locales/*/data/FAQ.json`. |
| `page/pictures/tokens/` | Coloured supply, forge and reinforcement tokens for text and cards. |
| `page/pictures/templates/` | 112 clean combat backgrounds of Base/GiF, six event parchment textures and five approved Tau samples. `sources.json` stores the origin, recipes and SHA-256; samples are kept even if they are not loaded during viewing. |
| `page/pictures/artwork/` | 112 pre-prepared detail layers for the Base/GiF combat illustrations at 2× resolution. The transparent WebP files are lossless and are overlaid on the source background by the shared renderer. |
| `page/pictures/rnb/` | Illustrations used by the RNB overrides. |
| `page/fonts/` | Three game fonts; `tokens/` holds the source SVGs of the token symbols embedded in ForbiddenStars. |

The templates are working resources of the shared renderer. Do not delete them because the HTML does not reference them: the paths of backgrounds and textures are stored in `templates` inside the faction JSON. The grid, the enlarged card, the print list, the sheet preview and the PDF use the shared catalogue and renderer; thumbnails of different versions and token styles are not mixed in the cache. Loading errors can be retried.

In the updated and RNB modes, the Base/GiF combat illustrations use local processing with [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN-ncnn-vulkan): each source fragment is processed as a single tile, then brought to 2× the size of the illustration area. A limited amount of fine detail is carried into the layer; the original drawing and colour remain the basis. A transparent mask protects the frame, icons, protruding decoration and text fields. The renderer keeps the same mask when the picture area is enlarged under a short effect. Generative redrawing and separate face restoration are not used. The source templates and classic cards are preserved. The `template.artwork` field holds the path, the area in pixels of the source template and the SHA-256 of the layer; this data is part of the print source fingerprint. The nominal DPI warnings for the source illustration are kept: upscaling is not proof of a new source resolution. No models run during viewing or printing; the preparation tools stay outside the site.

Development and verification tools, visual references and verification results are kept outside this repository. Repeatable release checks need the neighbouring `Forbidden_Star-QA` directory and its README. Local editor files and temporary output are not part of the site.

The code is distributed under [GPL-3.0](LICENSE). Forbidden Stars and the related images and materials belong to their rights holders. This is an unofficial fan project.
