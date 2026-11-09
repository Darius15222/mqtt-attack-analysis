import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "10. Arbori de decizie",
 "blocuri": [
  {
   "tip": "text",
   "text": "Un arbore de decizie împarte pachetele în grupuri tot mai omogene, prin întrebări simple de tipul „tcp.len ≤ 20?”. Fiecare grup final (frunză) dă o predicție: clasa majoritară la clasificare, media la regresie. Am construit doi arbori: unul care prezice dacă un pachet este atac (is_attack) și unul care prezice tcp.len. Formulele sunt în secțiunea 4."
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "cele 330.926 de pachete: 231.648 pentru construcție (70%) și 99.278 pentru test (30%), ținta și predictorii din 10.2."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "la fiecare nod: statistica T și p pentru fiecare predictor, corecția Bonferroni, apoi predictorul cu cel mai mic p și pragul cel mai bun (10.1)."
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "arborii (desen și reguli); matricea de confuzie, Accuracy, Sensitivity, Precision și F1 la clasificare; MAE, RMSE și R² la regresie."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizii",
   "text": "arborii sunt construiți cu funcția ctree din pachetul R partykit, care face la fiecare nod testul statistic și corecția Bonferroni descrise în 10.1; scriptul complet este cod/09_cap10_arbori_ctree.R. Evaluarea se face pe pachetele nefolosite la construcție: pe datele pe care a fost construit, un arbore poate părea mai bun decât este. Pachetele fiecărei clase se împart separat la întâmplare (seed 42), ca proporțiile să fie aceleași în ambele părți (la flood: 429 și 184). Pachetele din aceeași conexiune nu sunt independente (9.7), deci p-urile sunt prea optimiste; ele servesc doar la alegerea împărțirilor."
  },
  {
   "tip": "sectiune",
   "titlu": "10.1 Cum se construiește arborele"
  },
  {
   "tip": "text",
   "eticheta": "Pasul 1, testul",
   "text": "pentru fiecare predictor se calculează T și p. La un predictor categoric și ținta is_attack, T = (n - 1) / n · χ² pe tabelul categorii × (normal, atac), adică practic χ². Altfel, T = (n - 1) · R², cu R² = r² Pearson la un predictor numeric sau suma pătratelor dintre grupuri / suma pătratelor totală la unul categoric. p vine din distribuția χ² cu 1 grad de libertate (numeric) sau k - 1 (k categorii)."
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
     "Cu sute de mii de pachete, aproape orice împărțire iese semnificativă, deci fără limită arborele ar face frunze din câteva pachete. Clasa cea mai mică, flood, are 613 pachete (429 la construcție); 300 este sub cele 429, deci limita nu împiedică o frunză doar cu flood (în arborii finali flood nu are totuși una proprie)."
    ],
    [
     "minprob",
     "0,01 (valoarea implicită)",
     "O frunză trebuie să aibă și cel puțin 1% din pachetele nodului care se împarte, deci limita este cea mai mare dintre 300 și 1% din nod: 2.317 la rădăcină, 300 în nodurile cu sub 30.000 de pachete."
    ],
    [
     "maxdepth",
     "5 la clasificare, 4 la regresie",
     "Ales din tabelul din 10.3."
    ]
   ]
  },
  {
   "tip": "subtitlu",
   "text": "Exemplu de calcul: rădăcina arborelui de clasificare"
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "cele 231.648 de pachete de construcție (115.824 normale și 115.824 atac)."
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
     "45.575",
     "1",
     "9,8 · 10⁻⁹⁹⁰⁰",
     "6,8 · 10⁻⁹⁸⁹⁹"
    ],
    [
     "mqtt.msgtype",
     "χ²",
     "43.126",
     "10",
     "1,8 · 10⁻⁹³⁴⁹",
     "1,3 · 10⁻⁹³⁴⁸"
    ],
    [
     "mqtt.dupflag",
     "χ²",
     "13.781",
     "1",
     "2,4 · 10⁻²⁹⁹⁵",
     "1,7 · 10⁻²⁹⁹⁴"
    ],
    [
     "tcp.flags",
     "χ²",
     "12.784",
     "7",
     "8,1 · 10⁻²⁷⁶⁸",
     "5,6 · 10⁻²⁷⁶⁷"
    ],
    [
     "tcp.len",
     "T",
     "5.509",
     "1",
     "6,1 · 10⁻¹¹⁹⁹",
     "4,3 · 10⁻¹¹⁹⁸"
    ],
    [
     "mqtt.ver",
     "χ²",
     "2.305",
     "1",
     "5,8 · 10⁻⁵⁰³",
     "4,1 · 10⁻⁵⁰²"
    ],
    [
     "tcp.time_delta",
     "T",
     "1.935",
     "1",
     "1,4 · 10⁻⁴²²",
     "9,7 · 10⁻⁴²²"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "Cel mai mic p îl are mqtt.qos, deci rădăcina se împarte după el. mqtt.msgtype are o statistică apropiată (43.126), dar pe 10 grade de libertate, deci p mai mare. mqtt.qos are doar valorile 0 și 1, deci un singur prag (≤ 0 față de > 0), cu tabelul observat O (așteptat E = total rând · total coloană / N):"
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
     "115.824 (96.782,5)",
     "77.741 (96.782,5)"
    ],
    [
     "mqtt.qos > 0",
     "0 (19.041,5)",
     "38.083 (19.041,5)"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "χ² = 3.746 + 3.746 + 19.042 + 19.042 = 45.576 (fiecare termen este (O - E)² / E). ctree dă T = 45.575: același χ² înmulțit cu (n - 1) / n. Ramura > 0 are 38.083 de pachete, toate dos: separarea perfectă din 9.4, pe care arborele o folosește direct, ca regulă."
  },
  {
   "tip": "text",
   "eticheta": "Unde schimbă Bonferroni",
   "text": "în acești arbori, nicăieri. Fără corecție (testtype = \"Univariate\"), arborele de clasificare are aceleași 15 frunze și aceleași predicții. Cel mai mare p ajustat dintr-o împărțire este 0,026, în nodul 4 (41.482 de pachete, 99,99% atac): se testează 5 predictori (mqtt.qos și mqtt.dupflag au aici o singură valoare), cel mai mic p este 0,0053 (mqtt.msgtype), iar 1 - (1 - 0,0053)⁵ = 0,026, sub 0,05, deci nodul se împarte."
  },
  {
   "tip": "text",
   "text": "Codul (R, pachetul partykit; scriptul complet, cu împărțirea 70/30 și toate tabelele din capitol, este în cod/09_cap10_arbori_ctree.R):"
  },
  {
   "tip": "cod",
   "text": "library(partykit)\nctl <- ctree_control(teststat = \"quadratic\", testtype = \"Bonferroni\", mincriterion = 0.95,\n                     minsplit = 20, minbucket = 300, maxdepth = 5)\nm <- ctree(is_attack ~ tcp.flags + mqtt.msgtype + tcp.len + tcp.time_delta +\n             mqtt.qos + mqtt.dupflag + mqtt.ver, data = constructie, control = ctl)\ninfo_node(node_party(m))$criterion   # T și p la rădăcină (tabelul de mai sus)\npredict(m, newdata = test)           # predicțiile pe test (10.5)"
  },
  {
   "tip": "sectiune",
   "titlu": "10.2 Predictorii"
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
     "Deosebește bruteforce, malformed și slowite (6.1, 13)."
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
   "text": "nu intră variabilele constante, mqtt.msg și mqtt.msgid (secțiunea 5), mqtt.len (corelația 0,94 cu tcp.len, 7.1), mqtt.hdrflags (un cod care pune la un loc tipul mesajului, QoS și dupflag) și restul grupului de conectare, nenul doar în pachetele de conectare, pe care le reprezintă mqtt.ver. Nici mqtt.retain nu intră: este nenul la doar 0,04% din pachete. Verificare: cu toate cele 19 variabile neconstante, F1 pe test este 0,9505, față de 0,9504, deci excluderile nu pierd informație; acel arbore pune însă la rădăcină mqtt.hdrflags, un cod hex greu de citit. mqtt.qos (T) și mqtt.dupflag (χ²) au amândouă valorile 0 și 1: pentru o variabilă 0/1 și ținta is_attack, χ² = n · r² și T = (n - 1) · r², deci cele două teste dau practic același rezultat (la rădăcină, T = 45.575 și χ² = 45.576 pentru mqtt.qos)."
  },
  {
   "tip": "sectiune",
   "titlu": "10.3 Alegerea adâncimii (maxdepth)"
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "arbori cu maxdepth de la 2 la 6, restul la fel; pentru fiecare, metricile pe construcție și pe test."
  },
  {
   "tip": "text",
   "eticheta": "Regula",
   "text": "cea mai mică adâncime de la care F1 (respectiv R²) pe test nu mai crește cu cel puțin 0,005 la nicio adâncime următoare."
  },
  {
   "tip": "tabel",
   "antet": [
    "maxdepth",
    "Frunze",
    "Accuracy construcție",
    "F1 construcție",
    "Accuracy test",
    "F1 test"
   ],
   "randuri": [
    [
     "2",
     "3",
     "0,8107",
     "0,8391",
     "0,8087",
     "0,8376"
    ],
    [
     "3",
     "5",
     "0,8434",
     "0,8144",
     "0,8438",
     "0,8149"
    ],
    [
     "4",
     "9",
     "0,9078",
     "0,8992",
     "0,9089",
     "0,9006"
    ],
    [
     "5",
     "15",
     "0,9510",
     "0,9489",
     "0,9524",
     "0,9504"
    ],
    [
     "6",
     "20",
     "0,9510",
     "0,9489",
     "0,9524",
     "0,9504"
    ]
   ]
  },
  {
   "tip": "tabel",
   "antet": [
    "maxdepth (regresie)",
    "Frunze",
    "R² construcție",
    "R² test",
    "MAE test"
   ],
   "randuri": [
    [
     "2",
     "4",
     "0,1179",
     "0,1122",
     "140,39"
    ],
    [
     "3",
     "8",
     "0,1678",
     "0,1565",
     "61,06"
    ],
    [
     "4",
     "13",
     "0,2311",
     "0,2625",
     "58,39"
    ],
    [
     "5",
     "17",
     "0,2311",
     "0,2625",
     "58,29"
    ],
    [
     "6",
     "20",
     "0,2311",
     "0,2625",
     "58,29"
    ]
   ]
  },
  {
   "tip": "imagine",
   "src": "arbore_adancime.png"
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "am ales maxdepth = 5 la clasificare, pentru că de acolo F1 pe test nu mai crește (0,9504 la 5 și la 6; arborele de adâncime 6 are mai multe frunze, dar exact aceleași predicții), și 4 la regresie, pentru că de la 4 la 6 R² pe test rămâne 0,2625. Valorile pe construcție și pe test sunt apropiate, deci arborii nu învață pe de rost: cu minbucket = 300, frunzele sunt prea mari pentru asta."
  },
  {
   "tip": "sectiune",
   "titlu": "10.4 Arborele de clasificare"
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "arborele final (maxdepth = 5, ales în 10.3), construit pe cele 231.648 de pachete de construcție."
  },
  {
   "tip": "imagine",
   "src": "arbore_clasificare.png"
  },
  {
   "tip": "text",
   "text": "Fiecare nod arată numărul lui, variabila aleasă și p-ul ajustat; pe ramuri sunt condițiile (0x18 = 0x00000018). Bara din frunză arată din ce clase sunt pachetele ei."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "fiecare pachet de construcție coboară prin arbore până la o frunză; pentru fiecare frunză numărăm pachetele, procentul de atac și clasele, iar frunza prezice valoarea majoritară (atac sau normal). Regula este șirul de condiții de pe drumul de la rădăcină la frunză."
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
     "8.800",
     "100,0%",
     "Atac",
     "bruteforce 4.281; malformed 3.031; alte 3 clase"
    ],
    [
     "7",
     "mqtt.qos ≤ 0 și mqtt.msgtype = 0 și tcp.flags = 0x00000018",
     "719",
     "99,2%",
     "Atac",
     "slowite 713; legitimate 6"
    ],
    [
     "8",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {1, 2, 4, 5, 8, 9, 14} și tcp.flags ∈ {0x00000002, 0x00000004, 0x00000011, 0x00000012, 0x00000014, 0x00000018}",
     "31.963",
     "100,0%",
     "Atac",
     "dos 27.242; bruteforce 2.015; alte 3 clase"
    ],
    [
     "11",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {0, 1, 2, 4, 5, 8, 9, 14} și tcp.flags = 0x00000010 și tcp.time_delta ≤ 1e-06",
     "9.736",
     "99,5%",
     "Atac",
     "dos 9.334; bruteforce 340; alte 3 clase"
    ],
    [
     "12",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {0, 1, 2, 4, 5, 8, 9, 14} și tcp.flags = 0x00000010 și tcp.time_delta ≤ 2e-05 și tcp.time_delta > 1e-06",
     "51.451",
     "19,3%",
     "Normal",
     "legitimate 41.518; dos 8.306; alte 4 clase"
    ],
    [
     "14",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {0, 1, 2, 4, 5, 8, 9, 14} și tcp.flags = 0x00000010 și tcp.time_delta > 2e-05 și tcp.time_delta ≤ 2,5e-05",
     "2.250",
     "81,5%",
     "Atac",
     "dos 1.652; legitimate 417; alte 4 clase"
    ],
    [
     "15",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {0, 1, 2, 4, 5, 8, 9, 14} și tcp.flags = 0x00000010 și tcp.time_delta > 2,5e-05",
     "13.719",
     "97,2%",
     "Atac",
     "dos 6.497; bruteforce 3.433; alte 4 clase"
    ],
    [
     "19",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {3, 13} și tcp.len ≤ 8",
     "1.131",
     "1,3%",
     "Normal",
     "legitimate 1.116; malformed 12; alte 2 clase"
    ],
    [
     "20",
     "mqtt.qos ≤ 0 și mqtt.msgtype = 12 și tcp.len ≤ 8",
     "924",
     "0,0%",
     "Normal",
     "legitimate 924"
    ],
    [
     "22",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {3, 12, 13} și tcp.len ≤ 10 și tcp.len > 8",
     "11.964",
     "0,0%",
     "Normal",
     "legitimate 11.960; malformed 4"
    ],
    [
     "23",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {3, 12, 13} și tcp.len ≤ 13 și tcp.len > 10",
     "47.500",
     "0,0%",
     "Normal",
     "legitimate 47.500"
    ],
    [
     "25",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {3, 12, 13} și tcp.len > 13 și tcp.flags ∈ {0x00000010, 0x00000019}",
     "547",
     "100,0%",
     "Atac",
     "malformed 546; bruteforce 1"
    ],
    [
     "27",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {3, 12, 13} și tcp.len > 13 și tcp.flags = 0x00000018 și tcp.len ≤ 20",
     "12.478",
     "4,3%",
     "Normal",
     "legitimate 11.946; malformed 532"
    ],
    [
     "28",
     "mqtt.qos ≤ 0 și mqtt.msgtype ∈ {3, 12, 13} și tcp.len > 20 și tcp.flags = 0x00000018",
     "383",
     "100,0%",
     "Atac",
     "flood 199; malformed 143; încă o clasă"
    ],
    [
     "29",
     "mqtt.qos > 0",
     "38.083",
     "100,0%",
     "Atac",
     "dos 38.083"
    ]
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "regulile confirmă capitolele anterioare: mqtt.qos > 0 este numai dos (frunza 29, separarea din 9.4); flagurile SYN, RST, FIN cu ACK și PSH+ACK la mesajele care nu sunt PUBLISH sau ping duc în frunzele 6, 7 și 8 (peste 99% atac); un tcp.time_delta foarte mic (≤ 1e-06) înseamnă aproape numai dos (frunza 11). Traficul normal tipic îl formează mesajele de publicare sau ping cu tcp.len ≤ 13 (frunzele 19-23) sau cu PSH și ACK și tcp.len ≤ 20 (frunza 27). ctree împarte și noduri în care ambele ramuri prezic același lucru (nodul 4, cu frunzele 6, 7 și 8, toate atac), pentru că testul compară proporțiile din ramuri, nu predicțiile; de aceea are 15 frunze."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "cu tcp.len împărțit manual în 0, 1-20 și 21+ (în loc de valorile brute), F1 pe test este 0,9526 față de 0,9504. Am păstrat valorile brute: diferența e mică, iar arborele găsește singur pragul 20 (nodul 26), chiar limita aleasă manual."
  },
  {
   "tip": "sectiune",
   "titlu": "10.5 Evaluarea arborelui de clasificare"
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "cele 99.278 de pachete de test; fiecare coboară prin arbore până la o frunză și primește predicția ei."
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
     "TP = 45.319",
     "FP = 409",
     "45.728"
    ],
    [
     "Prezis normal",
     "FN = 4.320",
     "TN = 49.230",
     "53.550"
    ]
   ]
  },
  {
   "tip": "tabel",
   "antet": [
    "Metrică",
    "Calcul (test)",
    "Construcție",
    "Test"
   ],
   "randuri": [
    [
     "Accuracy",
     "(45.319 + 49.230) / 99.278",
     "0,9510",
     "0,9524"
    ],
    [
     "Sensitivity",
     "45.319 / (45.319 + 4.320)",
     "0,9095",
     "0,9130"
    ],
    [
     "Precision",
     "45.319 / (45.319 + 409)",
     "0,9919",
     "0,9911"
    ],
    [
     "F1",
     "2 · 0,9911 · 0,9130 / (0,9911 + 0,9130)",
     "0,9489",
     "0,9504"
    ]
   ]
  },
  {
   "tip": "tabel",
   "antet": [
    "Clasa (test)",
    "Pachete",
    "Clasificate greșit",
    "% greșite"
   ],
   "randuri": [
    [
     "legitimate",
     "49.639",
     "409",
     "0,8%"
    ],
    [
     "dos",
     "39.067",
     "3.462",
     "8,9%"
    ],
    [
     "bruteforce",
     "4.350",
     "10",
     "0,2%"
    ],
    [
     "malformed",
     "3.277",
     "243",
     "7,4%"
    ],
    [
     "slowite",
     "2.761",
     "528",
     "19,1%"
    ],
    [
     "flood",
     "184",
     "77",
     "41,8%"
    ]
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "când arborele spune atac, aproape mereu are dreptate (doar 409 alarme false). Scapă însă 4.320 de atacuri, iar 95% dintre ele sunt în frunza 12: pachete doar cu ACK, pe care variabilele folosite nu le deosebesc de cele normale. De aici erorile mari la slowite și flood. Bruteforce și malformed, pe care regresia logistică din 9.6 nu le deosebea de pachetele normale goale, sunt recunoscute aproape toate, prin tcp.flags."
  },
  {
   "tip": "sectiune",
   "titlu": "10.6 Arborele de regresie (tcp.len)"
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
   "text": "mqtt.len nu intră, pentru că este aproape aceeași informație ca ținta (corelația 0,94). Clasa intră, ca să vedem cât depinde mărimea pachetului de tipul atacului. Bonferroni cu k = predictorii testați în nod (cel mult 4)."
  },
  {
   "tip": "imagine",
   "src": "arbore_regresie.png"
  },
  {
   "tip": "text",
   "text": "Frunzele arată tcp.len pe scară logaritmică: cutia de la Q1 la Q3, linia de la minim la maxim, mediana și media; media este valoarea prezisă."
  },
  {
   "tip": "tabel",
   "antet": [
    "Metrică",
    "Calcul (test)",
    "Construcție",
    "Test"
   ],
   "randuri": [
    [
     "MAE",
     "5.797.320 / 99.278",
     "56,45",
     "58,39"
    ],
    [
     "RMSE",
     "rădăcina din (69.163.599.201 / 99.278)",
     "818,95",
     "834,67"
    ],
    [
     "R²",
     "1 - 69.163.599.201 / 93.777.323.028",
     "0,2311",
     "0,2625"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "Prima împărțire pune dos și flood de o parte (frunzele 17-25) și celelalte clase de cealaltă (frunzele 4-14). Flood nu are o frunză proprie: cele 429 de pachete flood de construcție ajung în frunzele 17, 24 și 25, împreună cu dos. Pachetele flood sunt fie goale, fie foarte mari, iar de la ele vine 92% din suma pătratelor erorilor pe test; de aceea RMSE este mult mai mare decât MAE, iar R² este doar 0,26. La dos, toate cele 16.556 de pachete de construcție de tip 3 sau 12 doar cu ACK au exact 1.460 bytes (frunza 22)."
  },
  {
   "tip": "text",
   "text": "Comparația cu regresia liniară (capitolul 8), pe aceleași intrări și aceeași împărțire 70/30, cu aceleași setări ctree ca mai sus (maxdepth = 4):"
  },
  {
   "tip": "tabel",
   "antet": [
    "Ce se prezice",
    "Din ce",
    "R² dreaptă (test)",
    "R² arbore (test)"
   ],
   "randuri": [
    [
     "mqtt.len (ca în 8.1)",
     "tcp.len",
     "0,070",
     "0,897"
    ],
    [
     "tcp.time_delta (ca în 8.2)",
     "tcp.len și mqtt.len",
     "0,0014",
     "0,0039"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "La 8.1 arborele urmează relațiile diferite din fiecare grup de pachete (normal, dos, flood), pe care o singură dreaptă nu le poate prinde. La 8.2 nici arborele nu reușește: timpul dintre pachete nu depinde de lungimea lor."
  }
 ]
}

export default date
