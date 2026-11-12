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
   "text": "Din capitolul 8 știm că o dreaptă nu prezice bine valorile pachetelor. Acum prezicem direct probabilitatea ca un pachet să fie atac și aflăm ce variabile o cresc sau o scad. Ținta este is_attack: 0 pentru traficul normal, 1 pentru oricare dintre cele 5 atacuri (câte 165.463 de pachete)."
  },
  {
   "tip": "text",
   "eticheta": "Pe scurt",
   "text": "mqtt.qos = 1 apare numai la atacuri (separare), așa că modelul obișnuit nu-i poate da un coeficient; regresia Firth îl estimează, dar doar confirmă că mqtt.qos = 1 înseamnă sigur atac. Modelul final, fără mqtt.qos și mqtt.dupflag, arată că un pachet mai mare și venit mai repede are șansă mai mare să fie atac. Prinde dos și flood, dar nu și pachetele goale."
  },
  {
   "tip": "text",
   "eticheta": "De ținut minte",
   "text": "separare → Firth → model fără separare → prinde dos și flood, nu și restul → arbori (capitolul 10)."
  },
  {
   "tip": "subtitlu",
   "text": "Termeni noi"
  },
  {
   "tip": "tabel",
   "antet": [
    "Termen",
    "Ce reprezintă",
    "Cum se citește",
    "Exemplu"
   ],
   "randuri": [
    [
     "Logit (scor)",
     "β0 + β1 · x1 + …, din care iese probabilitatea: p = 1 / (1 + e la puterea -logit)",
     "logit 0 → p = 0,5; logit mare → p aproape de 1",
     "logit = -1 + 0,1 · tcp.len: pachet gol p = 0,27"
    ],
    [
     "Verosimilitate",
     "cât de bine se potrivesc probabilitățile prezise cu realitatea",
     "algoritmul alege coeficienții care o fac cât mai mare",
     "0,88 · (1 - 0,27) = 0,64"
    ],
    [
     "Std. Error",
     "cât de sigur e un coeficient",
     "valoarea reală e aproximativ coeficientul ± 2 · Std. Error; uriașă = coeficientul nu înseamnă nimic",
     "tcp.len: 0,0293 ± 2 · 0,0005, adică între 0,0283 și 0,0303"
    ],
    [
     "z",
     "coeficientul împărțit la Std. Error: de câte erori e departe de 0",
     "|z| peste 1,96 → p sub 0,05; nu spune cât de mare e efectul",
     "tcp.len: 63,47"
    ],
    [
     "Devianța",
     "cât de prost prezice modelul",
     "mai mică = mai bine",
     "458.761 fără variabile, 337.501 cu cele 3"
    ],
    [
     "Separare",
     "o valoare apare numai la o clasă",
     "coeficientul ei crește la nesfârșit",
     "mqtt.qos = 1 → mereu atac"
    ],
    [
     "Regresia Firth",
     "o penalizare care oprește coeficienții să crească la nesfârșit",
     "erorile standard redevin mici",
     "eroarea lui mqtt.qos: 14.714 → 2,35"
    ],
    [
     "VIF",
     "cât de bine se poate ghici o variabilă din celelalte",
     "peste 5-10 = spune același lucru ca altele, coeficienții nu mai sunt siguri",
     "mqtt.len: 42,5"
    ],
    [
     "EPV",
     "câte atacuri sunt la fiecare variabilă din model",
     "minim 10-15",
     "aproximativ 33.000"
    ],
    [
     "Distanța Cook",
     "cât schimbă modelul un singur pachet",
     "peste 0,5 = pachetul merită verificat; peste 1 = influent",
     "maxim 0,0197"
    ]
   ]
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
    "coeficienții se aleg astfel încât probabilitățile prezise să se potrivească cât mai bine cu realitatea (atac sau normal); metoda se numește verosimilitate maximă."
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
   "eticheta": "Cum se citește",
   "text": "pentru fiecare variabilă, o cutie la traficul normal și una la atac. Cutia cuprinde jumătatea din mijloc a pachetelor, iar linia din ea e mediana; axa e logaritmică."
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "la atac, pachetele sunt mai mari (tcp.len și mqtt.len) și vin mai des: timpul tipic este 0,000012 secunde la atac, față de 0,000076 la normal."
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
     "Încălcată: pachetele aceleiași conexiuni seamănă între ele. O notăm ca limită în Concluzie."
    ],
    [
     "3. Absența multicoliniarității (VIF)",
     "Încălcată în modelul cu 5 variabile: mqtt.len 42,5 și mqtt.qos 42,9 (peste 10); tcp.len 1,08, tcp.time_delta 1,00, mqtt.dupflag 1,44. În modelul final (9.4), fără mqtt.qos și mqtt.dupflag, VIF devine 1,08, 1,00 și 1,08."
    ],
    [
     "4. Absența separării perfecte",
     "Încălcată: mqtt.qos = 1 și mqtt.dupflag = 1 apar doar la atacuri. Vezi 9.3."
    ],
    [
     "5. Dimensiunea eșantionului (EPV)",
     "Respectată: 165.463 de atacuri la 5 predictori, adică aproximativ 33.000 pe predictor, mult peste minimul de 10-15."
    ],
    [
     "6. Absența valorilor extreme influente (distanța Cook)",
     "Respectată: niciun pachet singur nu schimbă modelul (distanța Cook maximă este 0,0197, sub pragul de 0,5). Graficul este sub tabel."
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
   "tip": "text",
   "eticheta": "Cum se citește",
   "text": "fiecare linie verticală e un pachet (în ordinea din fișier), iar înălțimea ei e distanța Cook, adică cât s-ar schimba modelul fără acel pachet. Pragul de îngrijorare e 0,5; cea mai înaltă linie ajunge doar la 0,0197."
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
   "text": "mqtt.qos = 1 și mqtt.dupflag = 1 apar doar la atacuri (separare). Ca să ajungă la probabilitatea 1, algoritmul mărește coeficientul lui mqtt.qos la nesfârșit (55,5 după 10 pași, 79,8 după 30), iar erorile standard ies uriașe (14.714 și 23.026). Rezultatul nu înseamnă nimic, deși variabilele sunt foarte utile."
  },
  {
   "tip": "text",
   "eticheta": "Soluția",
   "text": "regresia Firth adaugă o penalizare care împiedică coeficienții să crească la nesfârșit."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează Firth",
   "text": "la verosimilitate se adaugă o penalizare care crește când coeficienții se apropie de infinit, deci maximul se găsește la o valoare finită. Într-un caz simplu, este ca și cum s-ar adăuga o jumătate de pachet în fiecare căsuță a tabelului: nicio căsuță nu mai are 0, deci probabilitatea nu mai poate fi exact 1."
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
   "text": "3 pachete cu mqtt.qos = 1, toate atac. Fără Firth, probabilitatea de atac este 3 / 3 = 1, iar coeficientul crește la infinit. Cu Firth, ea devine 3,5 / (3,5 + 0,5) = 0,875, iar coeficientul rămâne finit."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "cu Firth, erorile standard devin mici (2,35 și 2,76), dar coeficientul lui mqtt.qos (60,7) spune doar că mqtt.qos = 1 înseamnă sigur atac; în același model, mqtt.len are coeficientul -0,287. De aceea, în 9.4 facem modelul fără aceste două variabile."
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
   "text": "Devianța scade de la 458.761 fără nicio variabilă la 337.501 cu cele 3 variabile."
  },
  {
   "tip": "text",
   "eticheta": "Cum se citesc coloanele",
   "text": "Estimate e coeficientul, iar z = Estimate / Std. Error. Dacă |z| trece de 1,96, p e sub 0,05. La noi toate trec mult de 1,96 (tcp.len 63,47, mqtt.len 16,81, tcp.time_delta -133,61), deci toate contează."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "tcp.len și mqtt.len au coeficienți pozitivi (0,0293 și 0,0048): un pachet mai mare are probabilitate mai mare să fie atac;",
    "tcp.time_delta are coeficient negativ (-3,34): un pachet venit mai repede are probabilitate mai mare să fie atac;",
    "semnul lui mqtt.len se schimbă între modelul cu toate variabilele (-0,287, Firth, 9.3) și cel final (0,0048). Este efectul multicoliniarității: mqtt.len și mqtt.qos spun aproape același lucru (corelația Pearson 0,99, 7.4; VIF = 42,5 în modelul cu 5 variabile), așa că modelul cu amândouă împarte efectul între ele, chiar cu semn schimbat."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "pachet normal tipic (medianele din 6.1: tcp.len = 12, tcp.time_delta = 0,000076, mqtt.len = 10): logit = -0,3084 + 0,0293 · 12 - 3,3445 · 0,000076 + 0,0048 · 10 = 0,091, deci p = 0,52; deși pachetul este normal, p trece puțin de 0,5;",
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
   "eticheta": "Cum se citește",
   "text": "curba arată probabilitatea de atac dată de model (pe verticală, de la 0 la 1) pe măsură ce crește timpul de la pachetul anterior (pe orizontală), pentru un pachet cu lungimile tipice traficului normal."
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
   "eticheta": "Cum se citește",
   "text": "pe orizontală, probabilitatea de atac dată de model (0 = sigur normal, 1 = sigur atac); pe verticală, câte pachete au primit-o (scară logaritmică). Albastru = pachete normale în realitate, roz = atacuri, mov închis = cele două se suprapun. Un model perfect ar avea tot albastrul lângă 0 și tot rozul lângă 1."
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
    "bruteforce, malformed și slowite: cel puțin jumătate din pachete primesc 0,42, ca pachetele normale goale (tcp.len și mqtt.len 0). Pentru ele cele 3 variabile nu ajung; le deosebesc tcp.flags (6.3) și câmpurile de conectare."
   ]
  },
  {
   "tip": "parte",
   "fel": "concluzie",
   "titlu": "Concluzia"
  },
  {
   "tip": "tabel",
   "antet": [
    "Ce credem",
    "Cum verificăm",
    "Rezultat",
    "Verdict"
   ],
   "randuri": [
    [
     "Pachetele mari au probabilitate mai mare să fie atac.",
     "regresia logistică, modelul final (9.4)",
     "tcp.len +0,0293 și mqtt.len +0,0048, ambele cu p sub 0,001",
     "Confirmată. Coeficienți pozitivi: pachet mai mare, șansă mai mare."
    ],
    [
     "Pachetele dese au probabilitate mai mare să fie atac.",
     "regresia logistică, modelul final (9.4)",
     "tcp.time_delta -3,34, p sub 0,001",
     "Confirmată. Coeficient negativ: pachet venit mai repede, șansă mai mare."
    ]
   ]
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "mqtt.qos și mqtt.dupflag apar doar la atacuri, deci modelul obișnuit nu le poate estima; Firth le estimează, dar coeficienții arată doar că mqtt.qos = 1 înseamnă sigur atac (9.3).",
    "Modelul recunoaște dos și flood: 43% și 49% din pachetele lor primesc peste 0,9, iar pachetele normale nu trec de 0,59 (9.4).",
    "Nu deosebește bruteforce, malformed și slowite de pachetele normale goale; pentru ele trebuie tcp.flags, pe care le folosesc arborii (capitolul 10).",
    "Limită: pachetele aceleiași conexiuni nu sunt independente, deci p și erorile standard sunt prea optimiste."
   ]
  }
 ]
}

export default date
