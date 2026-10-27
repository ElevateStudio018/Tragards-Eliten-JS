# Spirera AB – hemsida

Statisk sajt (HTML/CSS/JS, inget byggsteg). Öppna `index.html`.

- **Hero:** samma uppbyggnad som [spirera.framer.website](https://spirera.framer.website/) – grön pill-meny, video i fullskärm, Roboto Serif-rubrik som tonar in bokstav för bokstav, limegrön + glasknapp och glaskortet nere till höger. På mobil: vit meny med limegrön plusknapp och knappar i full bredd.
- **Resten:** en blandning av våra sajter för Essens (varm off-white, lugna textspalter, kursiva nyckelord, numrerade steg, bildgrid med glasetiketter) och Ängö (tjänster med bild, etiketter med färgstreck, förskjuten bild med färgblock bakom, färgat CTA-band, mörk sidfot med org.nr).

## Innan lansering

- **E-post:** formuläret öppnar ett ifyllt mejl till `info@spirera.se` (`data-mailto` i `index.html`). Byt till rätt adress. Lägg gärna till telefonnummer i kontaktdelen och i heron.
- **Bilder och video** är fria foton från [Pexels](https://www.pexels.com) (se tabellen nedan) – inget är kopierat från Framer-mallen. Byt gärna mot Spireras egna foton med samma filnamn i `img/`.
- Inga omdömen, betyg eller siffror är påhittade – heron visar tjänster och kundgrupper i stället för mallens "4.97/5" och "98 %".

Videon (de första 20 sekunderna) komprimerad med:
```sh
ffmpeg -i original.mp4 -an -c:v libx264 -preset slow -crf 24 -vf scale=1920:-2 -pix_fmt yuv420p -movflags +faststart video/hero.mp4
ffmpeg -i original.mp4 -an -c:v libx264 -preset slow -crf 25 -vf scale=960:-2 -pix_fmt yuv420p -movflags +faststart video/hero-mobil.mp4
```

## Bilder (Pexels)

| Fil | Pexels-ID |
| --- | --- |
| `video/hero.mp4`, `video/hero-mobil.mp4` | [video 31290564](https://www.pexels.com/video/31290564/) |
| `img/design.webp` | [6614837](https://www.pexels.com/photo/6614837/) |
| `img/bygg.webp` | [7587879](https://www.pexels.com/photo/7587879/) |
| `img/skotsel.webp` | [5231138](https://www.pexels.com/photo/5231138/) |
| `img/radgivning.webp` | [31656168](https://www.pexels.com/photo/31656168/) |
| `img/plantering.webp` | [7728869](https://www.pexels.com/photo/7728869/) |
| `img/natursten.webp` | [33966133](https://www.pexels.com/photo/33966133/) |
| `img/gang.webp` | [32416206](https://www.pexels.com/photo/32416206/) |
| `img/innergard.webp` | [17037585](https://www.pexels.com/photo/17037585/) |
| `img/tradack.webp` | [8180361](https://www.pexels.com/photo/8180361/) |
