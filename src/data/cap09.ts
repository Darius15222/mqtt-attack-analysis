import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "9. Regresie logistică",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Din capitolul 8 știm că o dreaptă nu prezice bine valorile pachetelor. Acum prezicem direct ce ne interesează: cât de probabil este ca un pachet să fie atac, după valorile lui, și ce variabile cresc sau scad această probabilitate. Ținta este is_attack: 0 pentru traficul normal (legitimate) și 1 pentru oricare dintre cele 5 atacuri, câte 165.463 de pachete în fiecare grup."
  },
  {
   "tip": "parte",
   "fel": "ipoteza",
   "titlu": "Ipoteza"
  },
  {
   "tip": "text",
   "eticheta": "Ce credem",
   "text": "pachetele mari și dese (tcp.len și mqtt.len mari, tcp.time_delta mic) au o probabilitate mai mare să fie atac."
  },
  {
   "tip": "text",
   "eticheta": "Ce testăm",
   "text": "H0: coeficientul unui predictor este 0, adică predictorul nu schimbă probabilitatea de atac. Dacă p este sub 0,05, respingem H0."
  },
  {
   "tip": "parte",
   "fel": "pasi",
   "titlu": "Pașii"
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
   "text": "",
   "puncte": [
    "Metoda: de la valorile pachetului la probabilitatea de atac;",
    "9.1 alegem variabilele;",
    "9.2 le comparăm la normal și la atac;",
    "9.3 verificăm condițiile regresiei;",
    "9.4 modelul cu toate variabilele: apare o problemă (separarea);",
    "9.5 regresia Firth rezolvă problema;",
    "9.6 modelul final, fără variabilele care separă, și probabilitățile prezise;",
    "9.7 limitele."
   ]
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
   "tip": "parte",
   "fel": "demonstratie",
   "titlu": "Demonstrația"
  },
  {
   "tip": "subtitlu",
   "text": "Metoda: de la valori la probabilitatea de atac"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "ținta are doar două valori (atac sau normal). O dreaptă ar putea prezice -0,3 sau 1,4, care nu sunt probabilități; regresia logistică dă mereu un număr între 0 și 1."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "scorul: logit = β0 + β1 · x1 + β2 · x2 + ... (poate fi orice număr);",
    "probabilitatea: p = 1 / (1 + e la puterea -logit); logit 0 dă p = 0,5, logit mare dă p aproape de 1, logit foarte negativ dă p aproape de 0;",
    "un coeficient pozitiv crește probabilitatea de atac, unul negativ o scade;",
    "coeficienții nu au o formulă directă, ca la regresia liniară: se caută pas cu pas (algoritmul IRLS din statsmodels pornește de la o estimare și o corectează pas cu pas; 11 pași la modelul final) valorile pentru care etichetele reale (atac sau normal) sunt cele mai probabile. Metoda se numește verosimilitate maximă."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu mic",
   "text": "un model cu logit = -1 + 0,1 · tcp.len:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "pachet gol (tcp.len = 0): logit = -1, deci p = 1 / (1 + e¹) = 0,27;",
    "pachet de 30 de bytes: logit = -1 + 3 = 2, deci p = 1 / (1 + e⁻²) = 0,88;",
    "dacă al doilea pachet chiar este atac și primul chiar este normal, verosimilitatea este 0,88 · (1 - 0,27) = 0,64; algoritmul caută coeficienții care fac acest produs, pe toate pachetele, cât mai mare."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "din semnul și mărimea coeficienților aflăm ce variabile împing un pachet spre „atac”. Restul capitolului alege variabilele, verifică condițiile și construiește modelul."
  },
  {
   "tip": "sectiune",
   "titlu": "9.1 Variabilele"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "modelul are nevoie de variabile cu valori numerice."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "tcp.len, mqtt.len și tcp.time_delta (numerice), mqtt.qos (ordinală, cu valorile 0 și 1 în date) și mqtt.dupflag (binară)."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "am ales variabilele numerice și binare, pentru că categoriile (tcp.flags, mqtt.msgtype) ar cere codificare în mai multe coloane."
  },
  {
   "tip": "sectiune",
   "titlu": "9.2 Tabelul pe cele 2 grupuri"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "înainte de model, vedem cum diferă variabilele alese între normal și atac."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "mediană (Q1, Q3) la numerice și n (%) la mqtt.dupflag. p: Mann-Whitney la numerice (inclusiv mqtt.qos), chi-pătrat la mqtt.dupflag (capitolul 6)."
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
   "tip": "imagine",
   "src": "log_box.png",
   "latime": 1200,
   "inaltime": 450
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "la atac, tcp.len și mqtt.len au Q3 mult mai mare (pachete mari la dos și flood), iar tcp.time_delta este mult mai mic (pachete mai dese). Graficul este pe scară logaritmică, pentru că valorile acoperă mai multe ordine de mărime."
  },
  {
   "tip": "sectiune",
   "titlu": "9.3 Condițiile regresiei logistice"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "dacă o condiție nu se respectă, coeficienții sau p nu sunt de încredere."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": ""
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
     "Încălcată: mqtt.qos = 1 (54.431 de pachete) și mqtt.dupflag = 1 (18.707) apar doar la atacuri, deci din ele atacul se prezice perfect (separare cvasi-completă: valoarea 1 apare doar la atac, valoarea 0 la ambele clase). Vezi 9.4 și 9.5."
    ],
    [
     "5. Dimensiunea eșantionului (EPV)",
     "Respectată: EPV = cazurile din clasa mai rară / numărul de predictori = 165.463 / 5 = 33.093 de evenimente pe predictor (cele două clase au câte 165.463 de pachete), mult peste minimul de 10-15."
    ],
    [
     "6. Absența valorilor extreme influente (distanța Cook)",
     "Respectată, la modelul final (9.6). Distanța Cook arată cât s-ar schimba coeficienții dacă am scoate un singur pachet; cea mai mare este 0,0197 (pachetul de pe rândul 3.095), mult sub pragul critic de 0,5 sau 1. 546 de pachete (0,16%) depășesc pragul relativ 4/n = 0,000012, dar niciunul nu se apropie de pragul critic. Reziduul deviance arată cât de prost prezice modelul un pachet: 445 de pachete (0,13%) au reziduul peste 2 în valoare absolută și 280 peste 3 (maximul 8,59); modelul le prezice prost, dar niciunul nu are influență mare (Cook sub 0,02). Formula: Cook_i = r_i² · h_i / (k · (1 - h_i)²), cu r_i reziduul Pearson al pachetului (eticheta minus probabilitatea prezisă, împărțită la abaterea ei standard), h_i influența lui asupra coeficienților (leverage) și k = 4 coeficienți. Graficul este sub tabel."
    ]
   ]
  },
  {
   "tip": "imagine",
   "src": "cook.png",
   "latime": 1300,
   "inaltime": 520
  },
  {
   "tip": "sectiune",
   "titlu": "9.4 Modelul cu toate variabilele: apare separarea"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "pornim de la toate cele 5 variabile, ca să vedem efectul fiecăreia."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": ""
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
   "text": "Null deviance: 458.760,8 pe 330.925 grade de libertate. Residual deviance: 281.029,1 pe 330.920 grade de libertate. AIC: 281.041,1. Null deviance arată cât de prost prezice un model fără predictori, iar Residual deviance același lucru pentru modelul nostru; cu cât scade mai mult, cu atât predictorii ajută. Gradele de libertate sunt numărul de pachete minus numărul de coeficienți."
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "aceasta este separarea cvasi-completă (o valoare apare doar la atacuri): când mqtt.qos = 1, pachetul este mereu atac, deci algoritmul tot mărește coeficientul, ca să ajungă la probabilitatea 1. De aceea erorile standard ies 14.714 și 23.026, iar p este aproape 1, deși variabilele sunt foarte informative. Estimările lor nu sunt de încredere."
  },
  {
   "tip": "text",
   "text": "Se vede și din pași: algoritmul se oprește după 30 de pași, când deviance nu se mai schimbă, dar coeficientul lui mqtt.qos crește la fiecare pas: 55,5 după 10 pași, 64,8 după 15, 69,8 după 20, 74,8 după 25 și 79,8 după 30. Eroarea lui standard crește odată cu el (1,2, apoi 8, 99, 1.209 și 14.714). Coeficientul nu are o valoare finală, deci cifrele lui din tabel depind doar de momentul în care s-a oprit algoritmul. Coeficienții celorlalte variabile nu se mai schimbă după 15 pași; la mqtt.dupflag însă eroarea standard crește și ea (12,8, apoi 155, 1.892 și 23.026)."
  },
  {
   "tip": "sectiune",
   "titlu": "9.5 Aceleași variabile, cu regresia Firth"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "vrem să vedem efectul lui mqtt.qos fără să-l scoatem, deci avem nevoie de un model în care coeficienții nu mai cresc la nesfârșit."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează",
   "text": "regresia Firth adaugă la verosimilitate o penalizare (formula din secțiunea 4), care împiedică coeficienții să crească la nesfârșit. Este implementată în Python (numpy), în scriptul 04."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează Chisq",
   "text": "pentru fiecare variabilă se reface modelul cu coeficientul ei fixat la 0, păstrând aceeași penalizare, iar Chisq = 2 · (logaritmul verosimilității penalizate al modelului complet - cel al modelului cu coeficientul fixat la 0). p vine din distribuția χ² cu 1 grad de libertate. Verosimilitatea arată cât de probabile sunt etichetele reale după model: cu cât e mai mare, cu atât modelul explică mai bine datele."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": ""
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
   "text": "Testele globale verifică dacă cei 5 predictori, luați împreună, schimbă probabilitatea de atac:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Likelihood ratio test = 173.322 pe 5 grade de libertate (p sub 0,001): compară verosimilitatea modelului complet cu cea a modelului fără predictori;",
    "Wald test = 27.339 pe 5 grade de libertate (p sub 0,001): pornește de la coeficienți și erorile lor standard."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "erorile standard sunt acum finite (2,35 și 2,76, față de 14.714 și 23.026). Coeficientul mare al lui mqtt.qos (60,7) arată doar separarea, nu o mărime de efect;",
    "mqtt.dupflag are p = 0,002, dar coeficientul lui negativ (-11,4) nu are sens practic. Toate cele 18.707 pachete cu mqtt.dupflag = 1 au și mqtt.qos = 1 (sunt printre cele 54.431) și toate sunt atacuri, deci modelul doar împarte separarea între cele două variabile: pentru aceste pachete, contribuția totală este 60,7 - 11,4 = 49,3, tot uriașă."
   ]
  },
  {
   "tip": "text",
   "text": "Pentru coeficienți ușor de interpretat facem, în 9.6, un model fără variabilele care separă."
  },
  {
   "tip": "sectiune",
   "titlu": "9.6 Modelul fără separare: tcp.len, tcp.time_delta, mqtt.len"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "mqtt.qos și mqtt.dupflag separă perfect (apar doar la atacuri), iar mqtt.qos are și VIF 42,9 (9.3); fără ele, coeficienții se pot citi."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": ""
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
    "tcp.len are coeficient pozitiv (0,0293): un pachet cu mai mult conținut TCP are probabilitate mai mare să fie atac. La fel mqtt.len (0,0048);",
    "tcp.time_delta are coeficient negativ (-3,34): cu cât trece mai puțin timp de la pachetul anterior, cu atât crește probabilitatea de atac. Se potrivește cu medianele din 9.2 (1,2e-05 la atac față de 7,6e-05 la normal);",
    "semnul lui mqtt.len se schimbă între modelul cu toate variabilele (-0,287) și cel final (0,0048). Este efectul multicoliniarității (VIF = 42,5 în modelul cu 5 variabile)."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu de calcul",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "pachet normal tipic (tcp.len = 13, tcp.time_delta = 0,000076, mqtt.len = 11): logit = -0,3084 + 0,0293 · 13 - 3,3445 · 0,000076 + 0,0048 · 11 = 0,125, deci p = 1 / (1 + e la puterea -0,125) = 0,53;",
    "pachet dos tipic (116; 0,000003; 168): logit = 3,90 și p = 0,98;",
    "pachet gol venit după o secundă (0; 1; 0): logit = -3,65 și p = 0,025."
   ]
  },
  {
   "tip": "imagine",
   "src": "log_curba.png",
   "latime": 1050,
   "inaltime": 480
  },
  {
   "tip": "text",
   "text": "Curba arată cum transformă modelul logit în probabilitate: la lungimile mediane ale traficului normal (tcp.len = 12, mqtt.len = 10), probabilitatea de atac scade de la 0,52 (pachet venit imediat) la 0,04 după o secundă."
  },
  {
   "tip": "imagine",
   "src": "log_prob.png",
   "latime": 1050,
   "inaltime": 480
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "probabilitatea prezisă pentru fiecare pachet:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "normal: nu depășește 0,59 (mediana 0,42);",
    "dos și flood: 43% din pachetele dos și 49% din cele flood primesc peste 0,9 (pachete mari și dese);",
    "bruteforce, malformed și slowite: cel puțin jumătate din pachete primesc aproximativ 0,42, aceeași valoare ca pachetele normale goale: au tcp.len și mqtt.len 0, iar logit = -0,3084 dă p = 0,42. Pentru ele cele 3 variabile nu ajung; le deosebesc mai ales tcp.flags (6.3) și câmpurile de conectare (capitolul 13), care nu sunt în model."
   ]
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
    "Pentru coeficienții Firth nu am calculat intervale de încredere (domeniul în care se află probabil coeficientul real); la Firth se recomandă metoda profilată, pe care nu am aplicat-o."
   ]
  },
  {
   "tip": "parte",
   "fel": "concluzie",
   "titlu": "Concluzia"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "mqtt.qos și mqtt.dupflag apar doar la atacuri (separare cvasi-completă), deci regresia obișnuită nu le poate estima. Regresia Firth le dă erori standard finite, dar coeficienții lor arată doar separarea (9.4, 9.5).",
    "În modelul final, un pachet are probabilitate mai mare de atac când are mai mult conținut (tcp.len, mqtt.len) și când vine mai repede după pachetul anterior (tcp.time_delta mic) (9.6).",
    "Modelul recunoaște bine pachetele mari și dese: 43% din pachetele dos și 49% din cele flood primesc probabilitate peste 0,9, iar pachetele normale nu trec de 0,59 (9.6).",
    "Nu deosebește bruteforce, malformed și slowite: cel puțin jumătate din pachetele lor primesc în jur de 0,42, ca pachetele normale goale. Pentru ele trebuie tcp.flags și câmpurile de conectare, care nu sunt în model."
   ]
  }
 ]
}

export default date
