import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "10. Arbori de decizie",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Regresia logistică din capitolul 9 nu a folosit variabilele categoriale (de exemplu tcp.flags, care ar fi cerut codificare în mai multe coloane) și nici pe cele care separă perfect (mqtt.qos). Un arbore de decizie le folosește direct: împarte pachetele în grupuri tot mai omogene, prin întrebări simple de tipul „tcp.len ≤ 20?”. Fiecare grup final (frunză) dă o predicție: clasa majoritară la clasificare, media la regresie. Am construit doi arbori: unul care prezice dacă un pachet este atac (is_attack) și unul care prezice tcp.len."
  },
  {
   "tip": "text",
   "eticheta": "Pe scurt",
   "text": "am ales adâncimea 5, de la care F1 nu mai crește. Prima întrebare e mqtt.qos > 0, iar arborele recunoaște corect 95,1% din pachete, cu doar 1.269 de alarme false. Ratează mai ales pachetele care au doar flagul ACK."
  },
  {
   "tip": "text",
   "eticheta": "De ținut minte",
   "text": "arborele folosește direct variabilele pe care regresia nu le putea folosi (tcp.flags, mqtt.qos), iar fiecare frunză e o regulă care se poate citi."
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
     "Nod, frunză",
     "nod = grup de pachete la care se pune o întrebare; frunză = grup final, care dă răspunsul",
     "frunza prezice clasa majoritară din ea",
     "frunza 29: 54.431 de pachete, toate dos"
    ],
    [
     "Adâncime",
     "câte întrebări pune arborele, una după alta",
     "mai adânc = deosebiri mai fine, dar arbore mai greu de citit",
     "aleasă: 5"
    ],
    [
     "Corecția Bonferroni",
     "p se înmulțește cu numărul de variabile încercate",
     "altfel o variabilă ar ieși bună doar din întâmplare",
     "p = 0,01 cu 7 variabile → 0,07"
    ],
    [
     "TP, FP, FN, TN",
     "atac prins, alarmă falsă, atac ratat, normal recunoscut",
     "căsuțele matricei de confuzie",
     "150.659, 1.269, 14.804, 164.194"
    ],
    [
     "Accuracy",
     "cât din total e recunoscut corect",
     "de la 0 la 1",
     "0,9514"
    ],
    [
     "Sensitivity",
     "din atacurile reale, câte sunt prinse",
     "mare = ratează puține atacuri",
     "0,9105"
    ],
    [
     "Precision",
     "din pachetele numite „atac”, câte chiar sunt atac",
     "mare = puține alarme false",
     "0,9916"
    ],
    [
     "F1",
     "o singură notă din Sensitivity și Precision",
     "mare doar dacă amândouă sunt mari",
     "0,949"
    ],
    [
     "MAE",
     "eroarea medie (cât greșește, în medie)",
     "în aceeași unitate ca valoarea (bytes)",
     "57,02"
    ],
    [
     "RMSE",
     "ca MAE, dar erorile mari cântăresc mai mult (se ridică la pătrat)",
     "mult peste MAE → câteva erori foarte mari",
     "823,17"
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
   "text": "câteva întrebări simple despre cele 7 variabile ale pachetului din 10.2 ajung ca să recunoaștem corect marea majoritate a pachetelor. Al doilea arbore arată cât de bine se poate prezice tcp.len din clasă și tipul pachetului."
  },
  {
   "tip": "text",
   "eticheta": "Ce testăm",
   "text": "la fiecare nod, H0: predictorul nu are legătură cu ținta. Nodul se împarte doar dacă p ajustat este sub 0,05."
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
   "text": "toate cele 330.926 de pachete, ținta și predictorii din 10.2."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "",
   "puncte": [
    "10.1 cum se construiește arborele: la fiecare nod, statistica T și p pentru fiecare predictor, corecția Bonferroni, apoi predictorul cu cel mai mic p și pragul cel mai bun;",
    "10.2 alegem predictorii;",
    "10.3 alegem adâncimea maximă;",
    "10.4 arborele de clasificare și frunzele lui;",
    "10.5 cât de bine recunoaște atacurile;",
    "10.6 arborele de regresie pentru tcp.len."
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "",
   "puncte": [
    "arborii (desen și reguli);",
    "la clasificare: matricea de confuzie, Accuracy, Sensitivity, Precision și F1;",
    "la regresie: MAE, RMSE și R²."
   ]
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizii",
   "text": "",
   "puncte": [
    "arborii sunt construiți cu funcția ctree din pachetul R partykit (scriptul cod/09_cap10_arbori_ctree.R);",
    "arborii se construiesc și se verifică pe toate pachetele: un arbore construit doar pe 70% din pachete are pe celelalte 30% F1 = 0,950, cât pe toate (0,949), deci nu prezice mai prost pachete pe care nu le-a văzut;",
    "p-urile sunt prea optimiste, pentru că pachetele aceleiași conexiuni nu sunt independente (9.2); ele servesc doar la alegerea împărțirilor."
   ]
  },
  {
   "tip": "parte",
   "fel": "demonstratie",
   "titlu": "Demonstrația"
  },
  {
   "tip": "sectiune",
   "titlu": "10.1 Cum se construiește arborele"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "arborele trebuie să aleagă, la fiecare nod, ce întrebare pune. ctree alege predictorul cel mai legat de țintă printr-un test statistic și se oprește singur când nicio întrebare nu mai e sigură (p ajustat peste 0,05)."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează",
   "text": ""
  },
  {
   "tip": "text",
   "eticheta": "Pasul 1, testul",
   "text": "pentru fiecare predictor se măsoară cât de legat este de țintă, cu statistica T (la variabilele categoriale este practic χ² din capitolul 6: T = (n - 1) / n · χ², cu n pachete în nod), și se calculează p."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 2, Bonferroni",
   "text": "fiecare p se înmulțește cu numărul de predictori testați în nod (7 la rădăcină). Fără corecție, dacă niciun predictor n-ar fi legat de țintă, cel puțin unul din 7 teste ar ieși totuși sub 0,05 în 30% din cazuri (1 - 0,95⁷ = 0,30)."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 3, variabila",
   "text": "dacă cel mai mic p ajustat este sub 0,05, nodul se împarte după acel predictor; altfel devine frunză."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 4, pragul",
   "text": "pentru predictorul ales se încearcă toate împărțirile în două ramuri (de exemplu tcp.len ≤ 20 și > 20) și se alege cea care desparte cel mai bine normalul de atac."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 5, oprirea",
   "text": "pașii se repetă în fiecare ramură, până când nicio împărțire nu mai este sigură, o ramură ar avea sub 300 de pachete (ca să nu existe reguli făcute din câteva pachete) sau s-a ajuns la adâncimea maximă (10.3)."
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
   "text": "un nod cu 6 pachete: 4 au mqtt.qos = 0 (2 normale, 2 atac), iar 2 au mqtt.qos = 1 (ambele atac)."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "E: dacă qos n-ar avea legătură cu ținta, ramura qos = 0 ar avea 4 · 2 / 6 = 1,33 normale și 2,67 atac, iar ramura qos = 1 ar avea 0,67 normale și 1,33 atac;",
    "χ² = (2 - 1,33)² / 1,33 + (2 - 2,67)² / 2,67 + (0 - 0,67)² / 0,67 + (2 - 1,33)² / 1,33 = 1,5, deci T = 5 / 6 · 1,5 = 1,25 și p = 0,26;",
    "p este peste 0,05, deci nodul nu se împarte: rămâne frunză și prezice „atac” (4 din 6 pachete). Cu atât de puține pachete, diferența poate fi întâmplătoare."
   ]
  },
  {
   "tip": "subtitlu",
   "text": "Pe datele noastre: rădăcina arborelui de clasificare"
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "toate cele 330.926 de pachete (165.463 normale și 165.463 atac)."
  },
  {
   "tip": "text",
   "text": "mqtt.qos are cea mai mare statistică (T = 65.146; urmează mqtt.msgtype, cu 61.485), deci rădăcina se împarte după el. mqtt.qos are doar valorile 0 și 1, deci un singur prag (≤ 0 față de > 0), cu tabelul observat O (așteptat E = total rând · total coloană / N):"
  },
  {
   "tip": "tabel",
   "antet": [
    "Ramură",
    "Normal: O (E)",
    "Atac: O (E)"
   ],
   "randuri": [
    [
     "mqtt.qos ≤ 0",
     "165.463 (138.247,5)",
     "111.032 (138.247,5)"
    ],
    [
     "mqtt.qos > 0",
     "0 (27.215,5)",
     "54.431 (27.215,5)"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "χ² = 5.357,7 + 5.357,7 + 27.215,5 + 27.215,5 = 65.146 (fiecare termen este (O - E)² / E), practic egal cu T. Ramura > 0 are 54.431 de pachete, toate dos: separarea perfectă din 9.3, pe care arborele o folosește direct, ca regulă."
  },
  {
   "tip": "sectiune",
   "titlu": "10.2 Predictorii"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "arborele poate folosi orice tip de variabilă, dar variabilele care repetă aceeași informație îl fac greu de citit, fără să-l facă mai bun."
  },
  {
   "tip": "tabel",
   "antet": [
    "Predictor",
    "Tip",
    "Test (pasul 1)",
    "De ce intră"
   ],
   "randuri": [
    [
     "tcp.flags",
     "categorial",
     "χ²",
     "Deosebește bruteforce, malformed și slowite (6.3)."
    ],
    [
     "mqtt.msgtype",
     "categorial",
     "χ²",
     "Tipul mesajului; tipul 4 (PUBACK) apare aproape doar la dos (6.1, mqtt.hdrflags 0x40)."
    ],
    [
     "tcp.len",
     "numeric",
     "T = (n - 1) · r²",
     "Mare la dos și flood (6.1)."
    ],
    [
     "tcp.time_delta",
     "numeric",
     "T = (n - 1) · r²",
     "Mic la dos și flood (6.1)."
    ],
    [
     "mqtt.qos",
     "numeric (0 sau 1)",
     "T = (n - 1) · r²",
     "Valoarea 1 doar la dos (9.3)."
    ],
    [
     "mqtt.dupflag",
     "binar (0 sau 1)",
     "χ²",
     "Valoarea 1 doar la dos (9.3)."
    ],
    [
     "mqtt.ver",
     "binar (0 sau 4)",
     "χ²",
     "Reprezintă grupul de conectare (7.1)."
    ]
   ]
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizii",
   "text": "",
   "puncte": [
    "nu intră variabilele constante, mqtt.msg și mqtt.msgid (capitolul 5);",
    "nu intră mqtt.len (corelația 0,94 cu tcp.len, 7.1) și nici mqtt.hdrflags (un cod care pune la un loc tipul mesajului, QoS și dupflag);",
    "nu intră restul grupului de conectare, nenul doar în pachetele de conectare, pe care le reprezintă mqtt.ver;",
    "nu intră mqtt.retain: este nenul la doar 0,04% din pachete;",
    "verificare: cu toate cele 19 variabile neconstante, F1 este tot 0,9494, deci excluderile nu pierd informație; acel arbore pune însă la rădăcină mqtt.hdrflags, un cod hex greu de citit."
   ]
  },
  {
   "tip": "sectiune",
   "titlu": "10.3 Alegerea adâncimii (maxdepth)"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "un arbore prea scurt ratează atacuri, iar unul prea adânc are multe frunze și reguli greu de citit."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "arbori cu maxdepth de la 2 la 6, restul la fel; pentru fiecare, metricile pe toate pachetele."
  },
  {
   "tip": "text",
   "eticheta": "Regula",
   "text": "cea mai mică adâncime de la care F1 (respectiv R²) nu mai crește cu cel puțin 0,005 la nicio adâncime următoare."
  },
  {
   "tip": "text",
   "eticheta": "F1",
   "text": "nota arborelui care ghicește clasa, de la 0 la 1. E mare doar dacă arborele ratează puține atacuri și dă puține alarme false: F1 = 2 · Precision · Sensitivity / (Precision + Sensitivity), explicate în 10.5. Exemplu: arborele prinde doar 1 atac din 5 (Sensitivity 0,2), fără alarme false (Precision 1): F1 = 2 · 1 · 0,2 / 1,2 = 0,33."
  },
  {
   "tip": "text",
   "eticheta": "R²",
   "text": "nota arborelui care ghicește un număr (tcp.len), de la 0 la 1: cât de aproape sunt predicțiile de valorile reale, față de a spune mereu media. R² = 1 - suma erorilor arborelui la pătrat / suma abaterilor de la medie la pătrat. Exemplu: valori reale 10, 20, 30 (media 20, abateri 100 + 0 + 100 = 200), predicții 12, 20, 28 (erori 4 + 0 + 4 = 8): R² = 1 - 8 / 200 = 0,96."
  },
  {
   "tip": "imagine",
   "src": "arbore_adancime.png",
   "latime": 1530,
   "inaltime": 578
  },
  {
   "tip": "text",
   "eticheta": "Cum se citește",
   "text": "pe orizontală, adâncimea maximă (de la 2 la 6); pe verticală, nota arborelui: F1 în stânga (clasificare), R² în dreapta (regresie). Linia punctată marchează adâncimea aleasă. Valorile, pentru adâncimile 2-6: F1 0,839, 0,815, 0,900, 0,949, 0,949; R² 0,116, 0,164, 0,242, 0,242, 0,242."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "am ales maxdepth = 5 la clasificare, pentru că de acolo F1 nu mai crește (0,9494 la 5 și la 6; arborele de adâncime 6 are mai multe frunze, dar exact aceleași predicții), și 4 la regresie, pentru că de la 4 la 6 R² crește doar de la 0,2420 la 0,2421."
  },
  {
   "tip": "sectiune",
   "titlu": "10.4 Arborele de clasificare"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "arborele final arată regulile („dacă … atunci atac”) după care recunoaște atacurile."
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "arborele final (maxdepth = 5, ales în 10.3), construit pe toate cele 330.926 de pachete."
  },
  {
   "tip": "text",
   "eticheta": "Cum s-a construit",
   "text": "pașii din 10.1, repetați de sus în jos. La rădăcină, mqtt.qos e cea mai legată de atac, deci prima întrebare e „mqtt.qos > 0?”; răspunsul „da” duce la 54.431 de pachete, toate dos (frunza 29). Celelalte 276.495 de pachete merg mai departe, iar în fiecare grup testul se reia pe cele 7 variabile: apar pe rând mqtt.msgtype, tcp.flags, tcp.len și tcp.time_delta. O ramură se oprește când nicio întrebare nu mai are p sub 0,05, când ar rămâne sub 300 de pachete sau la a 5-a întrebare. Rezultă 15 frunze."
  },
  {
   "tip": "imagine",
   "src": "arbore_clasificare.png",
   "latime": 1700,
   "inaltime": 1200
  },
  {
   "tip": "text",
   "eticheta": "Cum se citește",
   "text": "pornești de sus, de la rădăcină. Fiecare nod arată numărul lui, variabila aleasă și p-ul ajustat; pe ramuri sunt condițiile (0x18 = 0x00000018). Un pachet urmează ramura care i se potrivește până la o frunză; bara din frunză arată din ce clase sunt pachetele ajunse acolo."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "fiecare pachet coboară prin arbore până la o frunză; pentru fiecare frunză numărăm pachetele, procentul de atac și clasele, iar frunza prezice valoarea majoritară (atac sau normal). Regula este șirul de condiții de pe drumul de la rădăcină la frunză."
  },
  {
   "tip": "tabel",
   "antet": [
    "Frunza",
    "Regula",
    "Pachete",
    "% atac",
    "Prezice",
    "Ce conține"
   ],
   "randuri": [
    [
     "6",
     "mqtt.qos ≤ 0 și mqtt.msgtype = 0 și tcp.flags ∈ {0x00000002, 0x00000004, 0x00000011, 0x00000012, 0x00000014}",
     "12.575",
     "100,0%",
     "Atac",
     "bruteforce 6.112; malformed 4.332; alte 3 clase"
    ],
    [
     "7",
     "mqtt.qos ≤ 0 și mqtt.msgtype = 0 și tcp.flags = 0x00000018",
     "1.033",
     "99,1%",
     "Atac",
     "slowite 1.024; legitimate 9"
    ],
    [
     "8",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {1, 2, 4, 5, 8, 9, 14} și tcp.flags ∈ {0x00000002, 0x00000004, 0x00000011, 0x00000012, 0x00000014, 0x00000018}",
     "45.665",
     "100,0%",
     "Atac",
     "dos 38.886; bruteforce 2.866; alte 3 clase"
    ],
    [
     "11",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {0, 1, 2, 4, 5, 8, 9, 14} și tcp.flags = 0x00000010 și tcp.time_delta ≤ 1e-06",
     "13.907",
     "99,5%",
     "Atac",
     "dos 13.327; bruteforce 490; alte 3 clase"
    ],
    [
     "12",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {0, 1, 2, 4, 5, 8, 9, 14} și tcp.flags = 0x00000010 și tcp.time_delta ≤ 2e-05 și tcp.time_delta > 1e-06",
     "73.482",
     "19,1%",
     "Normal",
     "legitimate 59.448; dos 11.768; alte 4 clase"
    ],
    [
     "14",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {0, 1, 2, 4, 5, 8, 9, 14} și tcp.flags = 0x00000010 și tcp.time_delta > 2e-05 și tcp.time_delta ≤ 2,5e-05",
     "3.301",
     "80,8%",
     "Atac",
     "dos 2.406; legitimate 635; alte 4 clase"
    ],
    [
     "15",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {0, 1, 2, 4, 5, 8, 9, 14} și tcp.flags = 0x00000010 și tcp.time_delta > 2,5e-05",
     "19.653",
     "97,2%",
     "Atac",
     "dos 9.342; bruteforce 4.918; alte 4 clase"
    ],
    [
     "19",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {3, 13} și tcp.len ≤ 8",
     "1.605",
     "1,3%",
     "Normal",
     "legitimate 1.584; malformed 17; alte 2 clase"
    ],
    [
     "20",
     "mqtt.qos ≤ 0 și mqtt.msgtype = 12 și tcp.len ≤ 8",
     "1.338",
     "0,0%",
     "Normal",
     "legitimate 1.338"
    ],
    [
     "22",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {3, 12, 13} și tcp.len ≤ 12 și tcp.len > 8",
     "20.697",
     "0,0%",
     "Normal",
     "legitimate 20.691; malformed 6"
    ],
    [
     "23",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {3, 12, 13} și tcp.len ≤ 13 și tcp.len > 12",
     "63.867",
     "0,0%",
     "Normal",
     "legitimate 63.866; malformed 1"
    ],
    [
     "25",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {3, 12, 13} și tcp.len > 13 și tcp.flags ∈ {0x00000010, 0x00000019}",
     "787",
     "100,0%",
     "Atac",
     "malformed 786; bruteforce 1"
    ],
    [
     "27",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {3, 12, 13} și tcp.len > 13 și tcp.flags = 0x00000018 și tcp.len ≤ 20",
     "18.009",
     "4,1%",
     "Normal",
     "legitimate 17.267; malformed 742"
    ],
    [
     "28",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {3, 12, 13} și tcp.len > 20 și tcp.flags = 0x00000018",
     "576",
     "100,0%",
     "Atac",
     "flood 298; malformed 225; încă o clasă"
    ],
    [
     "29",
     "mqtt.qos > 0",
     "54.431",
     "100,0%",
     "Atac",
     "dos 54.431"
    ]
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "regulile confirmă capitolele anterioare:",
   "puncte": [
    "mqtt.qos > 0 este numai dos (frunza 29, separarea din 9.3);",
    "flagurile SYN, RST, FIN cu ACK și PSH+ACK la mesajele care nu sunt PUBLISH sau ping duc în frunzele 6, 7 și 8 (peste 99% atac);",
    "un tcp.time_delta foarte mic (≤ 1e-06) înseamnă aproape numai dos (frunza 11);",
    "traficul normal tipic îl formează mesajele de publicare sau ping cu tcp.len ≤ 13 (frunzele 19-23) sau cu PSH și ACK și tcp.len ≤ 20 (frunza 27), plus pachetele doar ACK cu tcp.time_delta între 1 și 20 µs (frunza 12, unde se amestecă și 11.768 de pachete dos)."
   ]
  },
  {
   "tip": "sectiune",
   "titlu": "10.5 Evaluarea arborelui de clasificare"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "vedem câte pachete recunoaște corect și ce greșește."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează",
   "text": "fiecare pachet primește predicția frunzei lui și se compară cu clasa reală:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "TP = atac prezis atac; FP = normal prezis atac (alarmă falsă); FN = atac prezis normal (atac ratat); TN = normal prezis normal;",
    "Accuracy = (TP + TN) / N: cât din total este corect;",
    "Sensitivity = TP / (TP + FN): câte atacuri sunt prinse;",
    "Precision = TP / (TP + FP): din pachetele declarate atac, câte chiar sunt;",
    "F1 = 2 · Precision · Sensitivity / (Precision + Sensitivity): o singură notă, mare doar dacă amândouă sunt mari."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
   "text": "10 pachete, 5 atac și 5 normale; arborele prinde 4 atacuri, ratează unul și dă o alarmă falsă: TP = 4, FN = 1, FP = 1, TN = 4. Accuracy = 8 / 10 = 0,8; Sensitivity = 4 / 5 = 0,8; Precision = 4 / 5 = 0,8; F1 = 0,8."
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "toate cele 330.926 de pachete; fiecare coboară prin arbore până la o frunză și primește predicția ei."
  },
  {
   "tip": "tabel",
   "antet": [
    "",
    "Atac real",
    "Normal real",
    "Total"
   ],
   "randuri": [
    [
     "Prezis atac",
     "TP = 150.659",
     "FP = 1.269",
     "151.928"
    ],
    [
     "Prezis normal",
     "FN = 14.804",
     "TN = 164.194",
     "178.998"
    ]
   ]
  },
  {
   "tip": "tabel",
   "antet": [
    "Metrică",
    "Calcul",
    "Valoare"
   ],
   "randuri": [
    [
     "Accuracy",
     "(150.659 + 164.194) / 330.926",
     "0,9514"
    ],
    [
     "Sensitivity",
     "150.659 / (150.659 + 14.804)",
     "0,9105"
    ],
    [
     "Precision",
     "150.659 / (150.659 + 1.269)",
     "0,9916"
    ],
    [
     "F1",
     "2 · 0,99165 · 0,91053 / (0,99165 + 0,91053)",
     "0,9494"
    ]
   ]
  },
  {
   "tip": "tabel",
   "antet": [
    "Clasa",
    "Pachete",
    "Clasificate greșit",
    "% greșite"
   ],
   "randuri": [
    [
     "legitimate",
     "165.463",
     "1.269",
     "0,8%"
    ],
    [
     "dos",
     "130.223",
     "11.768",
     "9,0%"
    ],
    [
     "bruteforce",
     "14.501",
     "32",
     "0,2%"
    ],
    [
     "malformed",
     "10.924",
     "851",
     "7,8%"
    ],
    [
     "slowite",
     "9.202",
     "1.856",
     "20,2%"
    ],
    [
     "flood",
     "613",
     "297",
     "48,5%"
    ]
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "",
   "puncte": [
    "când arborele spune atac, aproape mereu are dreptate (doar 1.269 de alarme false);",
    "scapă însă 14.804 atacuri, iar 95% dintre ele sunt în frunza 12: pachete doar cu ACK, pe care variabilele folosite nu le deosebesc de cele normale; de aici erorile mari la slowite și flood;",
    "bruteforce (0,2% greșite) și malformed (7,8%), pe care regresia logistică din 9.4 nu le deosebea de pachetele normale goale, sunt recunoscute în mare parte prin tcp.flags, mqtt.msgtype și, la pachetele doar ACK, prin tcp.time_delta (frunzele 11 și 15)."
   ]
  },
  {
   "tip": "sectiune",
   "titlu": "10.6 Arborele de regresie (tcp.len)"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "vedem dacă un arbore prezice o valoare numerică (tcp.len) mai bine decât dreapta din capitolul 8."
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "ținta tcp.len și predictorii target (cele 6 clase), tcp.flags, mqtt.msgtype și tcp.time_delta."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizii",
   "text": "",
   "puncte": [
    "mqtt.len nu intră, pentru că este aproape aceeași informație ca ținta (corelația 0,94);",
    "clasa intră, ca să vedem cât depinde mărimea pachetului de tipul atacului."
   ]
  },
  {
   "tip": "imagine",
   "src": "arbore_regresie.png",
   "latime": 1700,
   "inaltime": 1200
  },
  {
   "tip": "text",
   "eticheta": "Cum se citește",
   "text": "frunzele arată tcp.len pe scară logaritmică: cutia de la Q1 la Q3, linia de la minim la maxim, mediana și media; media este valoarea prezisă."
  },
  {
   "tip": "tabel",
   "antet": [
    "Metrică",
    "Calcul",
    "Valoare"
   ],
   "randuri": [
    [
     "MAE",
     "18.870.202 / 330.926",
     "57,02"
    ],
    [
     "RMSE",
     "rădăcina din (224.239.493.953 / 330.926)",
     "823,17"
    ],
    [
     "R²",
     "1 - 224.239.493.953 / 295.838.561.317",
     "0,2420"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "Prima împărțire pune dos și flood de o parte (frunzele 17-25) și celelalte clase de cealaltă (frunzele 4-14). Flood nu are o frunză proprie: cele 613 pachete flood ajung în frunzele 17, 24 și 25 (unul în frunza 20), împreună cu dos. Pachetele flood sunt fie goale, fie foarte mari, iar de la ele vine 90% din suma pătratelor erorilor; de aceea RMSE este mult mai mare decât MAE, iar R² este doar 0,24."
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
   "text": "3 pachete cu lungimile reale 10, 20 și 90, prezise 20, 20 și 50, deci erorile sunt 10, 0 și 40. MAE = (10 + 0 + 40) / 3 = 16,7; RMSE = rădăcina din [(100 + 0 + 1.600) / 3] = 23,8. RMSE iese mai mare, pentru că eroarea de 40 cântărește mult după ridicarea la pătrat. La fel la noi: RMSE (823,17) e mult peste MAE (57,02), din cauza câtorva erori foarte mari, la pachetele flood."
  },
  {
   "tip": "text",
   "text": "Comparația cu regresia liniară (capitolul 8), pe aceleași intrări și pe toate pachetele, cu aceleași setări ctree ca mai sus (maxdepth = 4):"
  },
  {
   "tip": "tabel",
   "antet": [
    "Ce se prezice",
    "Din ce",
    "R² dreaptă",
    "R² arbore"
   ],
   "randuri": [
    [
     "mqtt.len (ca în 8.1)",
     "tcp.len",
     "0,075",
     "0,899"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "La 8.1 arborele urmează relațiile diferite din fiecare grup de pachete (normal, dos, flood), pe care o singură dreaptă nu le poate prinde."
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
     "Câteva întrebări simple recunosc corect majoritatea pachetelor.",
     "arborele de clasificare, adâncimea 5 (10.4, 10.5)",
     "15 frunze, 5 din 7 variabile; 95,1% din pachete corecte, F1 = 0,949",
     "Confirmată. Ratează mai ales pachetele doar cu ACK."
    ],
    [
     "tcp.len se poate prezice din clasă și tipul pachetului.",
     "arborele de regresie (10.6)",
     "R² = 0,24",
     "Parțial. Pachetele flood, fie goale, fie uriașe, dau 90% din suma pătratelor erorilor."
    ]
   ]
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Când spune „atac”, aproape mereu are dreptate: doar 1.269 de alarme false din 330.926 de pachete.",
    "Scapă 14.804 atacuri, iar 95% dintre ele sunt în frunza 12: pachete doar cu ACK, care arată la fel ca cele normale.",
    "Arborele care prezice mqtt.len din tcp.len ajunge la R² = 0,899, față de 0,075 la dreapta din 8.1, pentru că urmează separat fiecare grup de pachete (10.6)."
   ]
  }
 ]
}

export default date
