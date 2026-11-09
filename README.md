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
```

## Publicare

Orice `git push` pe `main` reconstruiește și publică site-ul automat (GitHub Actions, `.github/workflows/deploy.yml`), în 1-2 minute.
