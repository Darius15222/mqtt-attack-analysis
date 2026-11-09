import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "9. Regresie logistică",
 "blocuri": [
  {
   "tip": "text",
   "text": "Regresia logistică prezice o țintă binară (0 sau 1) din mai mulți predictori. Ținta este is_attack: 0 pentru traficul normal (legitimate) și 1 pentru oricare dintre cele 5 atacuri, câte 165.463 de pachete în fiecare grup. Formulele sunt în secțiunea 4."
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "cei 5 predictori din 9.1 și ținta is_attack, pentru fiecare dintre cele 330.926 de pachete."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "modelul calculează pentru fiecare pachet logit = β0 + β1 · x1 + ... și apoi probabilitatea de atac p = 1 / (1 + e la puterea -logit), care este mereu între 0 și 1. Coeficienții nu au o formulă directă, ca la regresia liniară: se caută pas cu pas (algoritmul IRLS din Python, statsmodels; 11 pași la modelul final) valorile care fac cel mai probabile etichetele reale (verosimilitate maximă)."
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "coeficienții cu p, deviance și probabilitatea de atac pentru fiecare pachet."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "cele 5 atacuri devin o singură clasă, pentru că regresia logistică prezice doar 0 sau 1. Cele două grupuri au același număr de pachete, deci nu e nevoie de ponderare."
  },
  {
   "tip": "sectiune",
   "titlu": "9.1 Variabilele"
  },
  {
   "tip": "text",
   "text": "Predictori: tcp.len, mqtt.len și tcp.time_delta (numerice), mqtt.qos (ordinală, cu valorile 0 și 1 în date) și mqtt.dupflag (binară). Am ales variabilele numerice și binare, pentru că categoriile (tcp.flags, mqtt.msgtype) ar cere codificare în mai multe coloane."
  },
  {
   "tip": "sectiune",
   "titlu": "9.2 Tabelul pe cele 2 grupuri"
  },
  {
   "tip": "tabel",
   "antet": [
    "Caracteristică",
    "Toate (N = 330.926)",
    "Normal (N = 165.463)",
    "Atac (N = 165.463)",
    "p"
   ],
   "randuri": [
    [
     "tcp.time_delta",
     "2,6e-05 (3e-06, 0,00017)",
     "7,6e-05 (4e-06, 0,9989)",
     "1,2e-05 (1e-06, 0,000103)",
     "sub 0,001"
    ],
    [
     "tcp.len",
     "10 (0, 14)",
     "12 (0, 13)",
     "8 (0, 93)",
     "sub 0,001"
    ],
    [
     "mqtt.len",
     "2 (0, 11)",
     "10 (0, 11)",
     "2 (0, 165)",
     "sub 0,001"
    ],
    [
     "mqtt.qos",
     "0 (0, 0)",
     "0 (0, 0)",
     "0 (0, 1)",
     "sub 0,001"
    ],
    [
     "mqtt.dupflag = 1",
     "18.707 (5,65%)",
     "0 (0,00%)",
     "18.707 (11,31%)",
     "sub 0,001"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "Mediană (Q1, Q3) la numerice și n (%) la mqtt.dupflag. p: Mann-Whitney la numerice, chi-pătrat la mqtt.dupflag."
  },
  {
   "tip": "imagine",
   "src": "log_box.png"
  },
  {
   "tip": "text",
   "text": "La atac, tcp.len și mqtt.len au Q3 mult mai mare (pachete mari la dos și flood), iar tcp.time_delta este mult mai mic (pachete mai dese). Grafic pe scară logaritmică, pentru că valorile acoperă mai multe ordine de mărime."
  },
  {
   "tip": "sectiune",
   "titlu": "9.3 Condițiile regresiei logistice"
  },
  {
   "tip": "text",
   "text": "De ce verificăm condițiile: dacă una nu se respectă, coeficienții sau p nu sunt de încredere."
  },
  {
   "tip": "tabel",
   "antet": [
    "Condiție",
    "Rezultat la datele noastre"
   ],
   "randuri": [
    [
     "1. Țintă binară",
     "Respectată: is_attack are 2 categorii, 0 și 1."
    ],
    [
     "2. Independența observațiilor",
     "Încălcată: pachetele aceleiași conexiuni nu sunt independente, iar setul nu are adrese IP ca să le grupăm. Ar trebui un model care grupează pachetele pe conexiuni, dar datele nu permit, deci o notăm ca limită."
    ],
    [
     "3. Absența multicoliniarității (VIF)",
     "tcp.len 1,08, mqtt.len 42,5, tcp.time_delta 1,00, mqtt.qos 42,9, mqtt.dupflag 1,44. mqtt.len și mqtt.qos depășesc 10. Modelul final (9.6) nu are mqtt.qos și mqtt.dupflag, iar VIF devine 1,08, 1,00 și 1,08."
    ],
    [
     "4. Absența separării perfecte",
     "Încălcată: mqtt.qos = 1 (54.431 de pachete) și mqtt.dupflag = 1 (18.707) apar doar la atacuri, deci din ele atacul se prezice perfect. Vezi 9.4 și 9.5."
    ],
    [
     "5. Dimensiunea eșantionului (EPV)",
     "Respectată: EPV = cazurile din clasa mai rară / numărul de predictori = 165.463 / 5 = 33.093 de evenimente pe predictor (cele două clase au câte 165.463 de pachete), mult peste minimul de 10-15."
    ],
    [
     "6. Absența valorilor extreme influente (distanța Cook)",
     "Respectată, la modelul final (9.6): cea mai mare distanță Cook este 0,0197 (pachetul de pe rândul 3.095), mult sub pragul critic de 0,5 sau 1. 546 de pachete (0,16%) depășesc pragul relativ 4/n = 0,000012, dar niciunul nu se apropie de pragul critic. Reziduurile deviance: 445 de pachete (0,13%) au reziduul peste 2 în valoare absolută și 280 peste 3 (maximul 8,59); modelul le prezice prost, dar niciunul nu are influență mare (Cook sub 0,02). Formula: Cook_i = r_i² · h_i / (k · (1 - h_i)²), cu r_i reziduul Pearson al pachetului, h_i influența lui asupra coeficienților (leverage) și k = 4 coeficienți. Graficul este sub tabel."
    ]
   ]
  },
  {
   "tip": "imagine",
   "src": "cook.png"
  },
  {
   "tip": "sectiune",
   "titlu": "9.4 Modelul cu toate variabilele: apare separarea"
  },
  {
   "tip": "tabel",
   "antet": [
    "Variabilă",
    "Estimate",
    "Std. Error",
    "z",
    "p"
   ],
   "randuri": [
    [
     "(Intercept)",
     "0,077",
     "0,0055",
     "14,147",
     "sub 0,001"
    ],
    [
     "tcp.len",
     "0,143",
     "0,0019",
     "76,695",
     "sub 0,001"
    ],
    [
     "mqtt.len",
     "-0,287",
     "0,0024",
     "-120,438",
     "sub 0,001"
    ],
    [
     "tcp.time_delta",
     "-3,780",
     "0,0553",
     "-68,329",
     "sub 0,001"
    ],
    [
     "mqtt.qos",
     "79,827",
     "14.714",
     "0,005",
     "0,996"
    ],
    [
     "mqtt.dupflag",
     "-10,717",
     "23.026",
     "-0,0005",
     "1,000"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "Null deviance: 458.760,8 pe 330.925 grade de libertate. Residual deviance: 281.029,1 pe 330.920 grade de libertate. AIC: 281.041,1."
  },
  {
   "tip": "text",
   "text": "Aceasta este separarea perfectă: când mqtt.qos = 1, pachetul este mereu atac, deci algoritmul tot mărește coeficientul, ca să ajungă la probabilitatea 1. De aceea erorile standard ies 14.714 și 23.026, iar p este aproape 1, deși variabilele sunt foarte informative. Estimările lor nu sunt de încredere."
  },
  {
   "tip": "text",
   "text": "Se vede și din pași: algoritmul se oprește după 30 de pași, când deviance nu se mai schimbă, dar coeficientul lui mqtt.qos crește la fiecare pas: 55,5 după 10 pași, 64,8 după 15, 69,8 după 20, 74,8 după 25 și 79,8 după 30. Eroarea lui standard crește odată cu el (1,2, apoi 8, 99, 1.209 și 14.714). Coeficientul nu are o valoare finală, deci cifrele lui din tabel depind doar de momentul în care s-a oprit algoritmul. Coeficienții celorlalte variabile nu se mai schimbă după 15 pași."
  },
  {
   "tip": "sectiune",
   "titlu": "9.5 Aceleași variabile, cu regresia Firth"
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "regresia Firth adaugă la verosimilitate o penalizare (formula din secțiunea 4), care împiedică coeficienții să crească la nesfârșit. Este implementată în Python și verificată pe un exemplu mic, cu o celulă zero, unde rezultatul se știe."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "Firth, ca să vedem efectul lui mqtt.qos fără să-l scoatem. Pentru coeficienți ușor de interpretat facem apoi, în 9.6, un model fără variabilele care separă."
  },
  {
   "tip": "tabel",
   "antet": [
    "Variabilă",
    "Estimate",
    "Std. Error",
    "Chisq",
    "p"
   ],
   "randuri": [
    [
     "(Intercept)",
     "0,0771",
     "0,0055",
     "",
     ""
    ],
    [
     "tcp.len",
     "0,1433",
     "0,0019",
     "22.995",
     "sub 0,001"
    ],
    [
     "mqtt.len",
     "-0,2873",
     "0,0024",
     "38.152",
     "sub 0,001"
    ],
    [
     "tcp.time_delta",
     "-3,7781",
     "0,0550",
     "16.953",
     "sub 0,001"
    ],
    [
     "mqtt.qos",
     "60,7032",
     "2,3456",
     "47.003",
     "sub 0,001"
    ],
    [
     "mqtt.dupflag",
     "-11,4496",
     "2,7572",
     "9,81",
     "0,002"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "Likelihood ratio test = 173.374 pe 5 grade de libertate (p sub 0,001); Wald test = 27.339 pe 5 grade de libertate (p sub 0,001)."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează Chisq",
   "text": "pentru fiecare variabilă se reface modelul cu coeficientul ei fixat la 0, păstrând aceeași penalizare, iar Chisq = 2 · (logaritmul verosimilității penalizate al modelului complet - cel al modelului cu coeficientul fixat la 0). p vine din distribuția χ² cu 1 grad de libertate."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Erorile standard sunt acum finite (2,35 și 2,76, față de 14.714 și 23.026). Coeficientul mare al lui mqtt.qos (60,7) arată doar separarea, nu o mărime de efect."
   ]
  },
  {
   "tip": "text",
   "text": "mqtt.dupflag are p = 0,002, dar coeficientul lui negativ (-11,4) nu are sens practic. Toate cele 18.707 pachete cu mqtt.dupflag = 1 au și mqtt.qos = 1 (sunt printre cele 54.431) și toate sunt atacuri, deci modelul doar împarte separarea între cele două variabile: pentru aceste pachete, contribuția totală este 60,7 - 11,4 = 49,3, tot uriașă."
  },
  {
   "tip": "sectiune",
   "titlu": "9.6 Modelul fără separare: tcp.len, tcp.time_delta, mqtt.len"
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "scoatem mqtt.qos și mqtt.dupflag, pentru că amândouă separă perfect (apar doar la atacuri), iar mqtt.qos are și VIF 42,9."
  },
  {
   "tip": "tabel",
   "antet": [
    "Variabilă",
    "Estimate",
    "Std. Error",
    "z",
    "p"
   ],
   "randuri": [
    [
     "(Intercept)",
     "-0,3084",
     "0,0048",
     "-64,90",
     "sub 0,001"
    ],
    [
     "tcp.len",
     "0,0293",
     "0,0005",
     "63,47",
     "sub 0,001"
    ],
    [
     "tcp.time_delta",
     "-3,3445",
     "0,0250",
     "-133,61",
     "sub 0,001"
    ],
    [
     "mqtt.len",
     "0,0048",
     "0,0003",
     "16,81",
     "sub 0,001"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "Null deviance: 458.760,8 pe 330.925 grade de libertate. Residual deviance: 337.501,4 pe 330.922 grade de libertate. AIC: 337.509,4."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "tcp.len are coeficient pozitiv (0,0293): un pachet cu mai mult conținut TCP are probabilitate mai mare să fie atac. La fel mqtt.len (0,0048).",
    "tcp.time_delta are coeficient negativ (-3,34): cu cât trece mai puțin timp de la pachetul anterior, cu atât crește probabilitatea de atac. Se potrivește cu medianele din 9.2 (1,2e-05 la atac față de 7,6e-05 la normal).",
    "Semnul lui mqtt.len se schimbă între modelul cu toate variabilele (-0,287) și cel final (0,0048). Este efectul multicoliniarității (VIF = 42,5 în modelul cu 5 variabile)."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu de calcul",
   "text": "un pachet normal tipic (tcp.len = 13, tcp.time_delta = 0,000076, mqtt.len = 11): logit = -0,3084 + 0,0293 · 13 - 3,3445 · 0,000076 + 0,0048 · 11 = 0,125, deci p = 1 / (1 + e la puterea -0,125) = 0,53. Un pachet dos tipic (116; 0,000003; 168): logit = 3,90 și p = 0,98. Un pachet gol venit după o secundă (0; 1; 0): logit = -3,65 și p = 0,025."
  },
  {
   "tip": "imagine",
   "src": "log_curba.png"
  },
  {
   "tip": "text",
   "text": "Curba arată cum transformă modelul logit în probabilitate: la lungimile mediane ale traficului normal (tcp.len = 12, mqtt.len = 10), probabilitatea de atac scade de la 0,52 (pachet venit imediat) la 0,04 după o secundă."
  },
  {
   "tip": "imagine",
   "src": "log_prob.png"
  },
  {
   "tip": "text",
   "text": "Probabilitatea prezisă pentru fiecare pachet. La normal nu depășește 0,59 (mediana 0,42). La atac, 43% din pachetele dos și 49% din cele flood primesc peste 0,9 (pachete mari și dese). La bruteforce, malformed și slowite, cel puțin jumătate din pachete primesc exact 0,42, aceeași valoare ca pachetele normale goale: au tcp.len și mqtt.len 0, iar logit = -0,3084 dă p = 0,42. Pentru ele cele 3 variabile nu ajung; le deosebesc mai ales tcp.flags (6.1) și câmpurile de conectare (capitolul 13), care nu sunt în model."
  },
  {
   "tip": "sectiune",
   "titlu": "9.7 Limite"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Independența este încălcată (pachete din aceleași conexiuni). Rezultatele arată ce variabile diferențiază atacul de normal, dar p și erorile standard sunt prea optimiste.",
    "Regresia Firth este calculată fără intervale de încredere profilate."
   ]
  }
 ]
}

export default date
