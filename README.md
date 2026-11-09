# MQTT Attack Analysis

Dashboard pentru analiza setului MQTTset: ce variabile indică fiecare atac (statistică, regresii, arbori de decizie, reguli de asociere).

Site: https://darius15222.github.io/mqtt-attack-analysis/

## Lucru local

```bash
npm install
npm run dev        # http://localhost:5173/mqtt-attack-analysis/ , se reîncarcă la fiecare modificare
npm run build && npm run preview   # versiunea finală, ca pe GitHub Pages
```

## Unde e conținutul

| Ce vrei să schimbi | Fișierul |
|---|---|
| textul unui capitol (pași, tabele, imagini) | `src/data/capNN.ts` |
| titlul scurt, rezumatul, scripturile, graficele interactive ale unui capitol | `src/data/capitole.ts` |
| cifrele de pe dashboard, culorile claselor, pașii analizei | `src/data/cifre.ts` |
| graficele (PNG) | `public/img/` |
| datele graficelor interactive | `public/date/*.json` |
| scripturile afișate | `cod/` |

Regenerare din docx (suprascrie `src/data/capNN.ts`, `intro.ts` și `public/img/`):

```bash
python3 scripts/genereaza.py ../../Facultate/ai-ml/MQTTset_tema.docx
python3 scripts/date_grafice.py <date.csv> <rezultate/corelatii> <noduri_clasificare.csv> <reguli_atac.csv>
python3 scripts/cod_pdf.py cod.html   # apoi se tipărește în public/MQTTset_cod.pdf (Chromium, A4)
```

## Cum e organizat codul

```
src/
  main.tsx, App.tsx        pornirea aplicației și rutele (#/, #/capitol/<slug>, #/cod)
  pages/
    Dashboard.tsx          pagina principală, împărțită în secțiuni (Hero, CifreCheie, PasiiAnalizei, ...)
    Capitol.tsx            orice capitol: antet, tab-urile Analiza / Codul, navigare, cuprins
    CodComplet.tsx         toate scripturile și cum se rulează
  components/
    Layout.tsx             meniul lateral (desktop) și sertarul (telefon)
    Blocuri.tsx            afișează lista de blocuri a unui capitol, câte o componentă pe tip
    Pas.tsx, Tabel.tsx, Imagine.tsx, Txt.tsx, Cod.tsx
    grafice/               câte un fișier pe grafic interactiv + baza.tsx (setări ECharts comune)
                           GraficInteractiv.tsx le încarcă doar când e nevoie (ECharts e mare)
  data/
    tipuri.ts              forma blocurilor (text, pas, tabel, imagine, ...)
    capitole.ts            lista capitolelor: adresă, titlu din meniu, rezumat, scripturi, grafice
    cifre.ts               cifrele de pe dashboard, culorile claselor, matricea de confuzie
    intro.ts, capNN.ts     conținutul, generat din docx
  lib/
    tema.ts                culorile temei pentru grafice (aceleași ca în index.css)
    format.ts              numere în format românesc
    useDateGrafic.ts       încarcă un JSON din public/date/
    scripturi.ts           scripturile din cod/, citite la build
    evidentiereCod.ts      colorarea codului cu Shiki
scripts/                   generarea datelor din docx și din rezultatele analizei
```

Pentru un grafic interactiv nou: un fișier în `src/components/grafice/`, adăugat în `Grafice.tsx` și în tipul `IdGrafic` din `tipuri.ts`, apoi pus într-un capitol din `capitole.ts` (`grafice: [{ id, dupa }]`).

## Publicare

Orice `git push` pe `main` reconstruiește și publică site-ul automat (GitHub Actions, `.github/workflows/deploy.yml`), în 1-2 minute.
