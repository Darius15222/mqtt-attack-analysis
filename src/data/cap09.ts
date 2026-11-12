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
    "9.1 alegem variabilele și vedem cum diferă între normal și atac;",
    "9.2 verificăm condițiile regresiei;",
    "9.3 modelul cu toate variabilele: problema (separarea) și soluția (regresia Firth);",
    "9.4 modelul final, fără variabilele care separă, și probabilitățile prezise."
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "coeficienții (ce variabile cresc sau scad șansa de atac) și probabilitatea de atac pentru fiecare pachet."
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
    "coeficienții se caută pas cu pas: algoritmul îi ajustează până când probabilitățile prezise se potrivesc cât mai bine cu etichetele reale (atac sau normal). Metoda se numește verosimilitate maximă."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
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
   "text": "din semnul și mărimea coeficienților aflăm ce variabile împing un pachet spre „atac”."
  },
  {
   "tip": "sectiune",
   "titlu": "9.1 Variabilele: normal față de atac"
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
   "tip": "imagine",
   "src": "log_box.png",
   "latime": 1200,
   "inaltime": 450
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "la atac, tcp.len și mqtt.len au Q3 mult mai mare (pachete mari la dos și flood), iar tcp.time_delta este mult mai mic (pachete mai dese: timpul tipic este 1,2e-05 secunde la atac, față de 7,6e-05 la normal). Graficul este pe scară logaritmică, pentru că valorile acoperă mai multe ordine de mărime."
  },
  {
   "tip": "sectiune",
   "titlu": "9.2 Condițiile regresiei logistice"
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
     "Încălcată: pachetele aceleiași conexiuni seamănă între ele, iar datele nu spun care pachete sunt din aceeași conexiune. O notăm ca limită în Concluzie."
    ],
    [
     "3. Absența multicoliniarității (VIF)",
     "tcp.len 1,08, mqtt.len 42,5, tcp.time_delta 1,00, mqtt.qos 42,9, mqtt.dupflag 1,44. mqtt.len și mqtt.qos depășesc 10. Modelul final (9.4) nu are mqtt.qos și mqtt.dupflag, iar VIF devine 1,08, 1,00 și 1,08."
    ],
    [
     "4. Absența separării perfecte",
     "Încălcată: mqtt.qos = 1 (54.431 de pachete) și mqtt.dupflag = 1 (18.707) apar doar la atacuri, deci din ele atacul se prezice perfect (separare cvasi-completă: valoarea 1 apare doar la atac, valoarea 0 la ambele clase). Vezi 9.3."
    ],
    [
     "5. Absența valorilor extreme influente (distanța Cook)",
     "Respectată, la modelul final (9.4). Distanța Cook arată cât s-ar schimba modelul dacă am scoate un singur pachet. Cea mai mare este 0,0197, mult sub pragul de 0,5: niciun pachet singur nu schimbă rezultatul. Graficul este sub tabel."
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
   "titlu": "9.3 Problema și soluția: separarea și regresia Firth"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "pornim de la toate cele 5 variabile, ca să vedem efectul fiecăreia."
  },
  {
   "tip": "text",
   "eticheta": "Problema",
   "text": "în modelul obișnuit cu toate cele 5 variabile, la mqtt.qos și mqtt.dupflag, erorile standard sunt uriașe (14.714 și 23.026), iar p este aproape 1. Aceasta este separarea cvasi-completă (o valoare apare doar la atacuri): când mqtt.qos = 1, pachetul este mereu atac, deci algoritmul tot mărește coeficientul, ca să ajungă la probabilitatea 1. De aceea erorile standard sunt atât de mari și p nu arată nimic, deși variabilele sunt foarte informative. Estimările lor nu sunt de încredere."
  },
  {
   "tip": "text",
   "text": "Se vede și din pașii algoritmului: coeficientul lui mqtt.qos crește la fiecare pas (55,5 după 10 pași, 79,8 după 30) și nu se oprește niciodată, deci valoarea lui nu înseamnă nimic."
  },
  {
   "tip": "text",
   "eticheta": "Soluția",
   "text": "regresia Firth adaugă o penalizare care împiedică coeficienții să crească la nesfârșit, deci mqtt.qos poate rămâne în model."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează χ² (chi-pătrat)",
   "text": "cât de mult se strică modelul dacă scoatem variabila; cu cât e mai mare, cu atât variabila contează mai mult."
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
    "χ²",
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
   "eticheta": "Ce înseamnă",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "erorile standard sunt acum finite (2,35 și 2,76, față de 14.714 și 23.026). Coeficientul mare al lui mqtt.qos (60,7) arată doar separarea, nu o mărime de efect;",
    "mqtt.dupflag primește -11,4, un coeficient fără sens practic: toate pachetele cu dupflag = 1 au și qos = 1 și sunt atacuri, deci modelul doar împarte separarea între cele două (60,7 - 11,4 = 49,3, tot uriașă)."
   ]
  },
  {
   "tip": "text",
   "text": "Pentru coeficienți ușor de interpretat facem, în 9.4, un model fără variabilele care separă."
  },
  {
   "tip": "sectiune",
   "titlu": "9.4 Modelul fără separare: tcp.len, tcp.time_delta, mqtt.len"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "mqtt.qos și mqtt.dupflag separă perfect (apar doar la atacuri), iar mqtt.qos are și VIF 42,9 (9.2); fără ele, coeficienții se pot citi."
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
   "text": "Devianța (cât de prost prezice modelul; mai mică = mai bine) scade de la 458.761 fără nicio variabilă la 337.501 cu cele 3 variabile."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "tcp.len are coeficient pozitiv (0,0293): un pachet cu mai mult conținut TCP are probabilitate mai mare să fie atac. La fel mqtt.len (0,0048);",
    "tcp.time_delta are coeficient negativ (-3,34): cu cât trece mai puțin timp de la pachetul anterior, cu atât crește probabilitatea de atac. Se potrivește cu medianele din 9.1 (1,2e-05 la atac față de 7,6e-05 la normal);",
    "semnul lui mqtt.len se schimbă între modelul cu toate variabilele (-0,287) și cel final (0,0048). Este efectul multicoliniarității: mqtt.len și mqtt.qos spun aproape același lucru (corelația Pearson 0,99, 7.4; VIF = 42,5 în modelul cu 5 variabile), așa că modelul cu amândouă împarte efectul între ele, chiar cu semn schimbat."
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
    "pachet normal tipic (tcp.len = 13, tcp.time_delta = 0,000076, mqtt.len = 11): logit = -0,3084 + 0,0293 · 13 - 3,3445 · 0,000076 + 0,0048 · 11 = 0,125, deci p = 1 / (1 + e la puterea -0,125) = 0,53; deși pachetul este normal, p trece puțin de 0,5: modelul nu separă bine pachetele mici normale de atacuri (se vede în graficul cu probabilitățile, mai jos);",
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
   "tip": "parte",
   "fel": "concluzie",
   "titlu": "Concluzia"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "mqtt.qos și mqtt.dupflag apar doar la atacuri (separare cvasi-completă), deci regresia obișnuită nu le poate estima. Regresia Firth le dă erori standard finite, dar coeficienții lor arată doar separarea (9.3).",
    "În modelul final, un pachet are probabilitate mai mare de atac când are mai mult conținut (tcp.len, mqtt.len) și când vine mai repede după pachetul anterior (tcp.time_delta mic) (9.4).",
    "Modelul recunoaște bine pachetele mari și dese: 43% din pachetele dos și 49% din cele flood primesc probabilitate peste 0,9, iar pachetele normale nu trec de 0,59 (9.4).",
    "Nu deosebește bruteforce, malformed și slowite: cel puțin jumătate din pachetele lor primesc în jur de 0,42, ca pachetele normale goale. Pentru ele trebuie tcp.flags și câmpurile de conectare, care nu sunt în model.",
    "Independența este încălcată (pachete din aceleași conexiuni). Rezultatele arată ce variabile diferențiază atacul de normal, dar p și erorile standard sunt prea optimiste."
   ]
  }
 ]
}

export default date
