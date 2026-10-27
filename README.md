# Trädgårdseliten JS – ny hemsida (5 designförslag)

Statisk sajt i ren HTML/CSS/JS – inget byggsteg. Öppna `index.html` för att välja mellan förslagen.

| Förslag | Stil |
|---|---|
| `forslag-1/` | Klassisk – vit och skogsgrön |
| `forslag-2/` | Fullbild – stor bild överst |
| `forslag-3/` | Mörk – mörkt tema med limegrönt |
| `forslag-4/` | Mjuk – beige och olivgrönt, bildmosaik |
| `forslag-5/` | Lime – varumärkets limegröna som huvudfärg |

Alla förslag använder Poppins, rundade knappar och samma innehåll, bilder och texter från nuvarande sajt.

## Smarta funktioner (i `shared/te.js`)

- **Prisräknare** – välj häck, gräsmatta, buskar, rabatter, löv eller fruktträd, ange mått och se pris direkt. RUT-avdrag för privatpersoner, exkl. moms för företag. Snabbval för tomtstorlek, återkommande gräsklippning per säsong.
- **Skicka som offertförfrågan** – uppskattningen klistras in i kontaktformuläret med ett klick.
- **Säsongstips** – sajten visar vad som passar att göra just den här månaden och markerar tjänsterna.
- Räknarens val sparas i webbläsaren till nästa besök.

## Att justera innan lansering

- **Priser:** `PRICING` och tidsåtgången per tjänst i `shared/te.js` är uppskattningar (550 kr/h inkl. moms). Sätt era riktiga priser.
- **Kontaktformuläret** öppnar besökarens mejlprogram (`mailto:`). Vill ni ta emot förfrågningar direkt kan det kopplas till t.ex. Formspree.
- Växlaren mellan förslag (`shared/switcher.js`) tas bort när ett förslag är valt.

## Köra lokalt

```sh
python3 -m http.server
```
och öppna http://localhost:8000
