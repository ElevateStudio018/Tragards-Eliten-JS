# Trädgårdseliten JS – ny hemsida (5 designförslag)

Statisk sajt i ren HTML/CSS/JS – inget byggsteg. Öppna `index.html` för att välja mellan förslagen.

| Förslag | Stil |
|---|---|
| `forslag-1/` | Häcken – häckklippningsfotot i heron, vitt och skogsgrönt |
| `forslag-2/` | Gräset – åkgräsklipparen i heron, prisräknaren direkt efter |
| `forslag-3/` | Ränderna – randiga gräsmattan, varm off-white |
| `forslag-4/` | Teamet – David och Lukas vid bilen, mörkt tema |
| `forslag-5/` | Vattning – svart och limegrönt |

Alla förslag använder Poppins, rundade knappar och deras egna foton och texter från nuvarande sajt.

## Designregler (mot "AI-slop")

- Riktigt foto över hela heron, vänsterställd text, en huvudknapp och telefonnumret som textlänk.
- Inga ikonkort i rader, inga etiketter ovanför rubriker, inga piller, statusprickar, glow eller gradienter.
- Tjänster som en lista med linjer i stället för kort. Varierade kolumnbredder (7/5, 5/7, 6/5).
- Pill-formade knappar, små radier på bilder och fält.
- Konkret text: riktiga namn, telefonnummer och tjänster – inga påhittade siffror.

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
