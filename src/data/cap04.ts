import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "4. Termeni și formule",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Termenii folosiți în temă, fiecare într-o frază: ce înseamnă și fie formula, fie secțiunea unde este explicat pas cu pas, cu exemplu."
  },
  {
   "tip": "text",
   "eticheta": "Pe scurt",
   "text": "îl folosești ca pe un dicționar: când întâlnești un termen și vrei definiția pe scurt; pentru calculul pas cu pas și un exemplu, mergi la secțiunea indicată în a treia coloană."
  },
  {
   "tip": "text",
   "eticheta": "De ținut minte",
   "text": "fiecare capitol are și propriul tabel „Termeni noi”, cu exemple; aici sunt principalii termeni la un loc."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "calculele s-au făcut în Python (pandas, scipy, statsmodels) și în R (partykit, pentru arbori), pe toate cele 330.926 de pachete."
  },
  {
   "tip": "tabel",
   "antet": [
    "Termen",
    "Ce înseamnă",
    "Formula sau unde este explicat"
   ],
   "randuri": [
    [
     "Media",
     "Valoarea tipică, doar dacă distribuția e aproape normală; o strică valorile extreme.",
     "x̄ = (x1 + x2 + ... + xn) / n; exemplu în 5.3."
    ],
    [
     "Abaterea standard",
     "Cât de împrăștiate sunt valorile în jurul mediei.",
     "s = rădăcina din [suma (xi - x̄)² / (n - 1)]."
    ],
    [
     "Mediana, Q1, Q3",
     "Mediana: valoarea din mijloc a valorilor sortate. Între Q1 și Q3 stă jumătatea din mijloc a pachetelor.",
     "Mediana: poziția (n + 1) / 2 în șirul sortat. Q1 și Q3: pozițiile 1 + 0,25 · (n - 1) și 1 + 0,75 · (n - 1). La tcp.len: mediana 10, Q1 = 0, Q3 = 14."
    ],
    [
     "Codul hex (tcp.flags)",
     "Fiecare flag este o putere a lui 2: FIN 1, SYN 2, RST 4, PSH 8, ACK 16.",
     "0x00000018 = 1 · 16 + 8 = 24 = ACK (16) + PSH (8)."
    ],
    [
     "Stele",
     "Citirea rapidă a lui p.",
     "*** p sub 0,001; ** sub 0,01; * sub 0,05; „-” = testul nu se poate calcula."
    ],
    [
     "χ² (chi-pătrat)",
     "Dacă o variabilă categorială depinde de clasă.",
     "6.3"
    ],
    [
     "Kruskal-Wallis",
     "Dacă o variabilă numerică diferă între cele 6 clase.",
     "6.2"
    ],
    [
     "Mann-Whitney",
     "Dacă un atac diferă de traficul normal.",
     "6.4"
    ],
    [
     "Corelația Pearson (r)",
     "Cât de bine stau două variabile pe o dreaptă, pe valorile reale.",
     "r = suma (xi - x̄)(yi - ȳ) / rădăcina din [suma (xi - x̄)² · suma (yi - ȳ)²]; comparată cu Spearman în 7.4."
    ],
    [
     "Corelația Spearman (ρ, rho)",
     "Dacă două variabile cresc și scad împreună; nu o strică valorile extreme.",
     "Formula lui Pearson, aplicată pe ranguri; capitolul 7 (Metoda)."
    ],
    [
     "Regresia liniară, reziduu, R²",
     "Dreapta care prezice y din x, eroarea ei la fiecare pachet și cât de bine se potrivește.",
     "Capitolul 8 (Metoda)."
    ],
    [
     "Durbin-Watson",
     "Dacă erorile pachetelor vecine sunt legate între ele.",
     "Aproape de 2 = nelegate; capitolul 8 (Metoda)."
    ],
    [
     "Logaritmul ln(1 + x)",
     "Micșorează valorile foarte mari; se adună 1 pentru că ln(0) nu există.",
     "8.1"
    ],
    [
     "Regresia logistică",
     "Probabilitatea ca un pachet să fie atac.",
     "Capitolul 9 (Metoda)."
    ],
    [
     "Devianța",
     "Cât de prost prezice un model; mai mică = mai bine.",
     "-2 · logaritmul verosimilității; 9.4."
    ],
    [
     "Std. Error și z",
     "Cât de sigur e un coeficient și de câte erori e departe de 0.",
     "z = coeficient / Std. Error; |z| peste 1,96 → p sub 0,05; 9.4."
    ],
    [
     "VIF",
     "Dacă o variabilă se poate ghici din celelalte (atunci coeficienții nu sunt de încredere).",
     "VIF = 1 / (1 - R²), cu R² al variabilei prezise din celelalte; 9.2."
    ],
    [
     "EPV",
     "Câte atacuri revin fiecărei variabile din model; prea puține fac coeficienții nesiguri.",
     "EPV = numărul de atacuri / numărul de variabile; minim 10-15; 9.2."
    ],
    [
     "Distanța Cook",
     "Cât s-ar schimba modelul fără un singur pachet.",
     "Peste 0,5 merită verificat, peste 1 pachetul e influent; 9.2."
    ],
    [
     "Regresia Firth",
     "Regresia logistică cu o penalizare care împiedică coeficienții să crească la infinit când o valoare apare doar la o clasă.",
     "9.3"
    ],
    [
     "Statistica T și corecția Bonferroni",
     "Cât de legat este un predictor de țintă; corecția pentru mai multe teste făcute deodată.",
     "p ajustat = p · k, cu k predictori testați; 10.1."
    ],
    [
     "Arborele de decizie",
     "Întrebări simple („variabila ≤ prag?”) care împart pachetele în grupuri; fiecare frunză dă o predicție.",
     "10.1"
    ],
    [
     "Matricea de confuzie, Accuracy, Sensitivity, Precision, F1",
     "Câte pachete sunt recunoscute corect și ce greșeli face modelul.",
     "10.5"
    ],
    [
     "MAE și RMSE",
     "Cât greșește în medie predicția unei valori numerice; RMSE pune greutate mai mare pe greșelile mari.",
     "MAE = suma |y - ŷ| / n; RMSE = rădăcina din [suma (y - ŷ)² / n]; 10.6."
    ],
    [
     "Item, support, confidence, lift, Apriori",
     "Regulile de asociere: cât de des apare o regulă, cât de des are dreptate și de câte ori crește șansa.",
     "11.2"
    ]
   ]
  }
 ]
}

export default date
