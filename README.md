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
| culorile claselor, cifrele graficelor interactive | `src/data/cifre.ts` |
| descrierea de pe prima pagină | `src/pages/Dashboard.tsx` (`DESCRIERE`) |
| graficele (PNG) | `public/img/` |
| datele graficelor interactive | `public/date/*.json` |
| scripturile afișate | `cod/` |

Fiecare capitol de analiză din docx are aceeași ordine (capitolele 2, 4 și 14, care nu sunt analize, au doar „Ce facem și de ce”), cu titlurile părților ca paragrafe bold, nenumerotate:
**Ce facem și de ce** → **Ipoteza** (sau **Scopul**, unde nu se testează nimic) → **Pașii** (Intrare / Calcul /
Ieșire / Decizie) → **Demonstrația** (secțiunile N.M, tabele, grafice) → **Concluzia**. `genereaza.py` le recunoaște
după text, iar site-ul le numerotează 1-5 și pune concluzia într-un panou verde.

Regenerare din docx (suprascrie `src/data/capNN.ts` și `public/img/`):

```bash
python3 scripts/genereaza.py ../../Facultate/ai-ml/MQTTset_site.docx
python3 scripts/date_grafice.py <date.csv> <rezultate/corelatii> <noduri_clasificare.csv> <reguli_atac.csv>
python3 scripts/cod_pdf.py cod.html   # apoi se tipărește în public/MQTTset_cod.pdf (Chromium, A4)
```

## Cum e organizat codul

```
src/
  main.tsx, App.tsx        pornirea aplicației și rutele (#/, #/capitol/<slug>, #/cod)
  pages/
    Dashboard.tsx          pagina principală: descrierea scurtă (Hero) și cardurile capitolelor
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
    cifre.ts               culorile claselor, matricea de confuzie
    capNN.ts               conținutul, generat din docx (ce e înainte de capitolul 1 nu intră pe site)
  lib/
    tema.ts                culorile temei pentru grafice (aceleași ca în index.css)
    format.ts              numere în format românesc, numărul capitolului pe două cifre
    sectiuni.ts            id-urile secțiunilor („10.4” → „s-10-4”), pentru linkuri și cuprins
    useDateGrafic.ts       încarcă un JSON din public/date/
    scripturi.ts           scripturile din cod/, citite la build
    evidentiereCod.ts      colorarea codului cu Shiki
scripts/                   generarea datelor din docx și din rezultatele analizei
```

Pentru un grafic interactiv nou: un fișier în `src/components/grafice/`, adăugat în `Grafice.tsx` și în tipul `IdGrafic` din `tipuri.ts`, apoi pus într-un capitol din `capitole.ts` (`grafice: [{ id, dupa }]`).

## Publicare

Orice `git push` pe `main` reconstruiește și publică site-ul automat (GitHub Actions, `.github/workflows/deploy.yml`), în 1-2 minute.
