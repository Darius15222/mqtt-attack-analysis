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
   "text": "Din capitolul 9 știm că regresia logistică nu poate folosi variabilele categorice (de exemplu tcp.flags) și pe cele care separă perfect (mqtt.qos). Un arbore de decizie le folosește direct: împarte pachetele în grupuri tot mai omogene, prin întrebări simple de tipul „tcp.len ≤ 20?”. Fiecare grup final (frunză) dă o predicție: clasa majoritară la clasificare, media la regresie. Am construit doi arbori: unul care prezice dacă un pachet este atac (is_attack) și unul care prezice tcp.len."
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
    "arborii sunt construiți cu funcția ctree din pachetul R partykit, care face la fiecare nod testul statistic și corecția Bonferroni descrise în 10.1; scriptul complet este cod/09_cap10_arbori_ctree.R;",
    "arborii se construiesc și se verifică pe toate pachetele, fără împărțire în construcție și test; verificat pe pachetele din care a fost construit, un arbore poate părea puțin mai bun decât este, dar cu frunze de cel puțin 300 de pachete diferența e mică;",
    "pachetele din aceeași conexiune nu sunt independente (9.7), deci p-urile sunt prea optimiste; ele servesc doar la alegerea împărțirilor."
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
   "text": "pentru fiecare predictor se calculează T și p (metoda ctree). La un predictor categoric și ținta is_attack, T = (n - 1) / n · χ² pe tabelul categorii × (normal, atac), adică practic χ². Altfel, T = (n - 1) · R², cu R² = r² Pearson la un predictor numeric sau, la un predictor categoric cu țintă numerică (arborele de regresie, 10.6), suma pătratelor dintre grupuri / suma pătratelor totală. p vine din distribuția χ² cu 1 grad de libertate (numeric) sau c - 1 (c categorii)."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 2, Bonferroni",
   "text": "fiecare p se ajustează cu numărul de predictori testați în nod, k: p ajustat = 1 - (1 - p)^k, practic p · k când p este mic. La rădăcină k = 7; mai jos k poate fi mai mic, pentru că un predictor cu o singură valoare în nod nu se mai testează. Fără corecție, șansa ca măcar unul din 7 teste să iasă sub 0,05 doar din întâmplare ar fi 1 - 0,95⁷ = 30%."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 3, variabila",
   "text": "dacă cel mai mic p ajustat este sub 0,05, nodul se împarte după acel predictor; altfel devine frunză. Când p-urile sunt atât de mici încât calculatorul le dă 0 (în tabelul de mai jos sunt calculate pe logaritm), ctree compară predictorii după T. Dacă pentru predictorul ales nu găsește o împărțire validă, trece la următorul: în nodul 16, tcp.flags are T cel mai mare, dar împărțirea se face după tcp.len."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 4, pragul",
   "text": "pentru predictorul ales se încearcă toate împărțirile în două ramuri (la numeric, fiecare valoare distinctă ca prag, ≤ și >; la categoric, grupări ale categoriilor) și se alege cea cu cea mai mare statistică de test între cele două ramuri."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 5, oprirea",
   "text": "pașii se repetă în fiecare ramură, până când nodul are sub 20 de pachete, o ramură ar avea sub 300 de pachete sau sub 1% din nod (minprob), ori s-a ajuns la maxdepth."
  },
  {
   "tip": "tabel",
   "antet": [
    "Parametru",
    "Valoare",
    "De ce"
   ],
   "randuri": [
    [
     "α",
     "0,05",
     "Pragul uzual, ca în capitolul 6."
    ],
    [
     "Corecția p",
     "Bonferroni: 1 - (1 - p)^k, k = predictorii testați în nod (cel mult 7 la clasificare, 4 la regresie)",
     "Câte un test pentru fiecare predictor, la fiecare nod."
    ],
    [
     "minsplit",
     "20",
     "Nu contează aici: cu minbucket = 300, un nod care se împarte are oricum cel puțin 600 de pachete."
    ],
    [
     "minbucket",
     "300",
     "Cu sute de mii de pachete, aproape orice împărțire iese semnificativă, deci fără limită arborele ar face frunze din câteva pachete. Clasa cea mai mică, flood, are 613 pachete; 300 este sub acest număr, deci limita nu împiedică o frunză doar cu flood (în arborii finali flood nu are totuși una proprie)."
    ],
    [
     "minprob",
     "0,01 (valoarea implicită)",
     "O frunză trebuie să aibă și cel puțin 1% din pachetele nodului care se împarte, deci limita este cea mai mare dintre 300 și 1% din nod: 3.309 la rădăcină, 300 în nodurile cu sub 30.000 de pachete."
    ],
    [
     "maxdepth",
     "5 la clasificare, 4 la regresie",
     "Ales din tabelul din 10.3."
    ]
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu mic",
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
   "tip": "tabel",
   "antet": [
    "Predictor",
    "Statistică",
    "Valoare",
    "df",
    "p",
    "p ajustat"
   ],
   "randuri": [
    [
     "mqtt.qos",
     "T",
     "65.146",
     "1",
     "1,6 · 10⁻¹⁴¹⁴⁹",
     "1,1 · 10⁻¹⁴¹⁴⁸"
    ],
    [
     "mqtt.msgtype",
     "T",
     "61.485",
     "10",
     "2,1 · 10⁻¹³³³⁵",
     "1,5 · 10⁻¹³³³⁴"
    ],
    [
     "mqtt.dupflag",
     "T",
     "19.828",
     "1",
     "1,6 · 10⁻⁴³⁰⁸",
     "1,1 · 10⁻⁴³⁰⁷"
    ],
    [
     "tcp.flags",
     "T",
     "18.179",
     "7",
     "8,8 · 10⁻³⁹³⁹",
     "6,2 · 10⁻³⁹³⁸"
    ],
    [
     "tcp.len",
     "T",
     "7.759",
     "1",
     "1,6 · 10⁻¹⁶⁸⁷",
     "1,1 · 10⁻¹⁶⁸⁶"
    ],
    [
     "mqtt.ver",
     "T",
     "3.315",
     "1",
     "2,1 · 10⁻⁷²²",
     "1,5 · 10⁻⁷²¹"
    ],
    [
     "tcp.time_delta",
     "T",
     "2.757",
     "1",
     "3,3 · 10⁻⁶⁰¹",
     "2,3 · 10⁻⁶⁰⁰"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "mqtt.qos are cel mai mic p și cea mai mare statistică T, deci rădăcina se împarte după el (în calculator toate p-urile ies 0, așa că ctree alege după T, ca la Pasul 3). mqtt.msgtype are o statistică apropiată (61.485), dar pe 10 grade de libertate, deci p mai mare. mqtt.qos are doar valorile 0 și 1, deci un singur prag (≤ 0 față de > 0), cu tabelul observat O (așteptat E = total rând · total coloană / N):"
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
   "text": "χ² = 5.357,7 + 5.357,7 + 27.215,5 + 27.215,5 = 65.146 (fiecare termen este (O - E)² / E). ctree dă tot T = 65.146: același χ² înmulțit cu (n - 1) / n, deci practic egal. Ramura > 0 are 54.431 de pachete, toate dos: separarea perfectă din 9.4, pe care arborele o folosește direct, ca regulă."
  },
  {
   "tip": "text",
   "eticheta": "Unde schimbă Bonferroni",
   "text": "în acești arbori, nicăieri. Fără corecție (testtype = \"Univariate\"), arborele de clasificare are aceleași 15 frunze și aceleași predicții. Cel mai mare p ajustat dintr-o împărțire este 0,00063, în nodul 21 (84.564 de pachete, aproape toate normale): se testează 2 predictori (tcp.len și tcp.time_delta), cel mai mic p este 0,000314 (tcp.len), iar 1 - (1 - 0,000314)² = 0,00063, mult sub 0,05, deci nodul se împarte."
  },
  {
   "tip": "text",
   "text": "Codul (R, pachetul partykit; scriptul complet, cu toate tabelele din capitol, este în cod/09_cap10_arbori_ctree.R):"
  },
  {
   "tip": "cod",
   "text": "library(partykit)\nctl <- ctree_control(teststat = \"quadratic\", testtype = \"Bonferroni\", mincriterion = 0.95,\n                     minsplit = 20, minbucket = 300, maxdepth = 5)\nm <- ctree(is_attack ~ tcp.flags + mqtt.msgtype + tcp.len + tcp.time_delta +\n             mqtt.qos + mqtt.dupflag + mqtt.ver, data = d, control = ctl)\ninfo_node(node_party(m))$criterion   # T și p la rădăcină (tabelul de mai sus)\npredict(m)                           # predicția fiecărui pachet (10.5)"
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
     "categoric",
     "χ²",
     "Deosebește bruteforce, malformed și slowite (6.3, 13)."
    ],
    [
     "mqtt.msgtype",
     "categoric",
     "χ²",
     "Tipul mesajului; tipul 4 apare aproape doar la dos (13)."
    ],
    [
     "tcp.len",
     "numeric",
     "T = (n - 1) · r²",
     "Mare la dos și flood (13)."
    ],
    [
     "tcp.time_delta",
     "numeric",
     "T = (n - 1) · r²",
     "Mic la dos și flood (13)."
    ],
    [
     "mqtt.qos",
     "numeric (0 sau 1)",
     "T = (n - 1) · r²",
     "Valoarea 1 doar la dos (9.4)."
    ],
    [
     "mqtt.dupflag",
     "binar (0 sau 1)",
     "χ²",
     "Valoarea 1 doar la dos (9.4)."
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
    "nu intră variabilele constante, mqtt.msg și mqtt.msgid (secțiunea 5);",
    "nu intră mqtt.len (corelația 0,94 cu tcp.len, 7.1) și nici mqtt.hdrflags (un cod care pune la un loc tipul mesajului, QoS și dupflag);",
    "nu intră restul grupului de conectare, nenul doar în pachetele de conectare, pe care le reprezintă mqtt.ver;",
    "nu intră mqtt.retain: este nenul la doar 0,04% din pachete;",
    "verificare: cu toate cele 19 variabile neconstante, F1 este tot 0,9494, deci excluderile nu pierd informație; acel arbore pune însă la rădăcină mqtt.hdrflags, un cod hex greu de citit;",
    "mqtt.qos (T) și mqtt.dupflag (χ²) au amândouă valorile 0 și 1: pentru o variabilă 0/1 și ținta is_attack, χ² = n · r² și T = (n - 1) · r², deci cele două teste dau practic același rezultat (la rădăcină, T = 65.146,1 și χ² = 65.146,3 pentru mqtt.qos)."
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
   "tip": "tabel",
   "antet": [
    "maxdepth",
    "Frunze",
    "Accuracy",
    "F1"
   ],
   "randuri": [
    [
     "2",
     "3",
     "0,8101",
     "0,8386"
    ],
    [
     "3",
     "5",
     "0,8435",
     "0,8145"
    ],
    [
     "4",
     "9",
     "0,9081",
     "0,8996"
    ],
    [
     "5",
     "15",
     "0,9514",
     "0,9494"
    ],
    [
     "6",
     "20",
     "0,9514",
     "0,9494"
    ]
   ]
  },
  {
   "tip": "tabel",
   "antet": [
    "maxdepth (regresie)",
    "Frunze",
    "R²",
    "MAE"
   ],
   "randuri": [
    [
     "2",
     "4",
     "0,1161",
     "138,47"
    ],
    [
     "3",
     "8",
     "0,1642",
     "59,84"
    ],
    [
     "4",
     "13",
     "0,2420",
     "57,02"
    ],
    [
     "5",
     "17",
     "0,2421",
     "56,92"
    ],
    [
     "6",
     "20",
     "0,2421",
     "56,92"
    ]
   ]
  },
  {
   "tip": "imagine",
   "src": "arbore_adancime.png",
   "latime": 1530,
   "inaltime": 578
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
   "tip": "imagine",
   "src": "arbore_clasificare.png",
   "latime": 1700,
   "inaltime": 1200
  },
  {
   "tip": "text",
   "text": "Fiecare nod arată numărul lui, variabila aleasă și p-ul ajustat; pe ramuri sunt condițiile (0x18 = 0x00000018). Bara din frunză arată din ce clase sunt pachetele ei."
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
    "mqtt.qos > 0 este numai dos (frunza 29, separarea din 9.4);",
    "flagurile SYN, RST, FIN cu ACK și PSH+ACK la mesajele care nu sunt PUBLISH sau ping duc în frunzele 6, 7 și 8 (peste 99% atac);",
    "un tcp.time_delta foarte mic (≤ 1e-06) înseamnă aproape numai dos (frunza 11);",
    "traficul normal tipic îl formează mesajele de publicare sau ping cu tcp.len ≤ 13 (frunzele 19-23) sau cu PSH și ACK și tcp.len ≤ 20 (frunza 27), plus pachetele doar ACK cu tcp.time_delta între 1 și 20 µs (frunza 12, unde se amestecă și 11.768 de pachete dos)."
   ]
  },
  {
   "tip": "text",
   "text": "ctree împarte și noduri în care ambele ramuri prezic același lucru, de exemplu nodul 4, cu frunzele 6, 7 și 8, toate atac. Motivul: testul compară proporțiile din ramuri, nu predicțiile. În ramura cu mqtt.msgtype = 0 sunt 9 pachete normale din 13.608, în cealaltă niciunul din 45.665, iar diferența iese semnificativă. De aceea arborele are 15 frunze."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "cu tcp.len împărțit manual în 0, 1-20 și 21+ (în loc de valorile brute), F1 este 0,9517 față de 0,9494. Am păstrat valorile brute: diferența e mică, iar arborele găsește singur pragul 20 (nodul 26), chiar limita aleasă manual."
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
   "eticheta": "Exemplu mic",
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
    "bruteforce (0,2% greșite) și malformed (7,8%), pe care regresia logistică din 9.6 nu le deosebea de pachetele normale goale, sunt recunoscute în mare parte prin tcp.flags, mqtt.msgtype și, la pachetele doar ACK, prin tcp.time_delta (frunzele 11 și 15)."
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
    "clasa intră, ca să vedem cât depinde mărimea pachetului de tipul atacului;",
    "Bonferroni cu k = predictorii testați în nod (cel mult 4)."
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
   "text": "Frunzele arată tcp.len pe scară logaritmică: cutia de la Q1 la Q3, linia de la minim la maxim, mediana și media; media este valoarea prezisă."
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
   "text": "Prima împărțire pune dos și flood de o parte (frunzele 17-25) și celelalte clase de cealaltă (frunzele 4-14). Flood nu are o frunză proprie: cele 613 pachete flood ajung în frunzele 17, 24 și 25 (unul în frunza 20), împreună cu dos. Pachetele flood sunt fie goale, fie foarte mari, iar de la ele vine 90% din suma pătratelor erorilor; de aceea RMSE este mult mai mare decât MAE, iar R² este doar 0,24. La dos, toate cele 23.673 de pachete cu mqtt.msgtype 3 (PUBLISH) sau 12 (PINGREQ) și doar flagul ACK au exact 1.460 bytes (frunza 22)."
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
    ],
    [
     "tcp.time_delta (ca în 8.2)",
     "tcp.len și mqtt.len",
     "0,0014",
     "0,0040"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "La 8.1 arborele urmează relațiile diferite din fiecare grup de pachete (normal, dos, flood), pe care o singură dreaptă nu le poate prinde. La 8.2 nici arborele nu reușește: timpul dintre pachete nu se poate prezice din lungimea lor (R² 0,0040); legătura pe ranguri din 7.4 (Spearman 0,25) este prea slabă pentru o predicție."
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
    "Ipoteza se confirmă: arborele de clasificare recunoaște corect 95,1% din pachete (F1 = 0,949), cu 15 frunze și doar 5 dintre cele 7 variabile (mqtt.qos, mqtt.msgtype, tcp.flags, tcp.len, tcp.time_delta).",
    "Când spune „atac”, aproape mereu are dreptate: doar 1.269 de alarme false din 330.926 de pachete.",
    "Scapă 14.804 atacuri, iar 95% dintre ele sunt în frunza 12: pachete doar cu ACK, care arată la fel ca cele normale.",
    "Arborele care prezice mqtt.len din tcp.len ajunge la R² = 0,899, față de 0,075 la dreapta din 8.1, pentru că urmează separat fiecare grup de pachete (10.6). Arborele care prezice tcp.len ajunge doar la R² = 0,24: 90% din suma pătratelor erorilor vine de la pachetele flood."
   ]
  }
 ]
}

export default date
