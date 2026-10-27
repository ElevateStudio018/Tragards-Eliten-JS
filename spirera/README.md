# Spirera AB – hemsida

Statisk sajt (HTML/CSS/JS, inget byggsteg). Öppna `index.html`.

- **Hero:** samma uppbyggnad som [spirera.framer.website](https://spirera.framer.website/) – grön pill-meny, video i fullskärm, Roboto Serif-rubrik som tonar in bokstav för bokstav, limegrön + glasknapp och glaskortet nere till höger. På mobil: vit meny med limegrön plusknapp och knappar i full bredd.
- **Resten:** en blandning av våra sajter för Essens (varm off-white, lugna textspalter, kursiva nyckelord, numrerade steg, bildgrid med glasetiketter) och Ängö (tjänster med bild, etiketter med färgstreck, förskjuten bild med färgblock bakom, färgat CTA-band, mörk sidfot med org.nr).

## Innan lansering

- **E-post:** formuläret öppnar ett ifyllt mejl till `info@spirera.se` (`data-mailto` i `index.html`). Byt till rätt adress. Lägg gärna till telefonnummer i kontaktdelen och i heron.
- **Bilder och video** kommer från Framer-mallen (LeapFly). Byt mot Spireras egna foton med samma filnamn i `img/` när de finns.
- Inga omdömen, betyg eller siffror är påhittade – heron visar tjänster och kundgrupper i stället för mallens "4.97/5" och "98 %".

Video komprimerad med:
```sh
ffmpeg -i original.mp4 -an -c:v libx264 -preset slow -crf 24 -vf scale=1920:-2 -pix_fmt yuv420p -movflags +faststart video/hero.mp4
ffmpeg -i original.mp4 -an -c:v libx264 -preset slow -crf 25 -vf scale=960:-2 -pix_fmt yuv420p -movflags +faststart video/hero-mobil.mp4
```
