import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "6. Statistică pe categorii",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Din capitolul 5 știm cum arată fiecare variabilă pe tot setul. Acum o comparăm între traficul normal și fiecare dintre cele 5 atacuri: o variabilă care arată la fel peste tot nu ne ajută să recunoaștem atacurile."
  },
  {
   "tip": "parte",
   "fel": "ipoteza",
   "titlu": "Ipoteza"
  },
  {
   "tip": "text",
   "eticheta": "Ce credem",
   "text": "variabilele arată altfel la atacuri decât la traficul normal. Faptul că atacurile diferă și între ele îl citim din tabel, nu îl testăm."
  },
  {
   "tip": "text",
   "eticheta": "Ce testăm",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "toate cele 6 clase: H0: variabila arată la fel în toate (Kruskal-Wallis la numerice și la mqtt.qos, 6.2; χ² la celelalte, 6.3);",
    "fiecare atac față de normal, la numerice și la mqtt.qos: H0: atacul arată la fel ca traficul normal (Mann-Whitney, 6.4);",
    "dacă p este sub 0,05, respingem H0."
   ]
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
   "text": "cele 330.926 de pachete, împărțite după coloana target în 6 clase, și 19 variabile: cele 33, fără cele 12 constante și fără mqtt.msg și mqtt.msgid (conținutul mesajului și un număr de ordine)."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "",
   "puncte": [
    "6.1 valoarea tipică a fiecărei variabile în fiecare clasă;",
    "6.2 Kruskal-Wallis: diferă o variabilă numerică între cele 6 clase?",
    "6.3 χ²: diferă o variabilă categorică sau binară între cele 6 clase?",
    "6.4 Mann-Whitney: care atac diferă de traficul normal?"
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "tabelul de mai jos (19 variabile × 6 clase, cu p) și câte un grafic pe variabilă."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizii",
   "text": "",
   "puncte": [
    "6 clase, nu 2 (normal și atac), pentru că atacurile diferă mult între ele;",
    "prag α = 0,05: acceptăm o șansă de 5% să găsim o diferență care de fapt nu există."
   ]
  },
  {
   "tip": "parte",
   "fel": "demonstratie",
   "titlu": "Demonstrația"
  },
  {
   "tip": "sectiune",
   "titlu": "6.1 Valoarea tipică pe fiecare clasă"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "ca să vedem, în cifre, cum arată fiecare variabilă la normal și la fiecare atac."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează",
   "text": "pentru fiecare clasă se iau doar pachetele ei, iar valoarea tipică se alege ca în 5.3:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "numerice și mqtt.qos: mediană [Q1, Q3];",
    "binare: procentul de valori diferite de 0;",
    "categorii și cod hex: valoarea cea mai frecventă, cu procentul ei."
   ]
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "mediană, nu medie: nici pe clase distribuțiile nu au formă de clopot. De exemplu, tcp.len la normal este 0 la 36,7% din pachete și între 10 și 14 la 61%, iar media 7,8 cade între grupuri, unde aproape nu există pachete."
  },
  {
   "tip": "text",
   "eticheta": "Exemplu de celulă",
   "text": "tcp.len la legitimate: se sortează cele 165.463 de valori; mediana este valoarea de la poziția (165.463 + 1) / 2 = 82.732, adică 12; Q1 (poziția 41.366,5) este 0, iar Q3 (poziția 124.097,5) este 13. În tabel apare 12 [0, 13]."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "la variabilele categorice apare doar valoarea cea mai frecventă din fiecare clasă, cu procentul ei, deci procentele de pe o coloană nu dau 100% (la legitimate, 0x00000018 are 63,31%, iar restul de 36,69% este 0x00000010). Ultima coloană este p-ul testului pe cele 6 clase: KW = Kruskal-Wallis (6.2), χ² = chi-pătrat (6.3); *** înseamnă p sub 0,001."
  },
  {
   "tip": "tabel",
   "antet": [
    "Variabilă",
    "legitimate",
    "dos",
    "bruteforce",
    "malformed",
    "slowite",
    "flood",
    "p"
   ],
   "randuri": [
    [
     "1. TCP (rețea)"
    ],
    [
     "tcp.flags",
     "0x00000018 (63,31%)",
     "0x00000018 (53,48%)",
     "0x00000010 (37,71%)",
     "0x00000010 (27,32%)",
     "0x00000010 (44,36%)",
     "0x00000010 (49,92%)",
     "<0,001 *** (χ²)"
    ],
    [
     "tcp.time_delta",
     "7,60e-05 [4,00e-06, 0,9989]",
     "3,00e-06 [1,00e-06, 6,40e-05]",
     "1,33e-04 [5,10e-05, 0,0011]",
     "1,36e-04 [4,00e-05, 0,001]",
     "9,10e-05 [1,00e-05, 3,79e-04]",
     "1,70e-05 [5,00e-06, 3,80e-05]",
     "<0,001 *** (KW)"
    ],
    [
     "tcp.len",
     "12 [0, 13]",
     "20 [0, 116]",
     "0 [0, 0]",
     "0 [0, 5]",
     "0 [0, 3]",
     "0 [0, 32759]",
     "<0,001 *** (KW)"
    ],
    [
     "2. Antet MQTT (orice pachet)"
    ],
    [
     "mqtt.hdrflags",
     "0x00000030 (61,62%)",
     "0x00000040 (29,83%)",
     "0 (79,86%)",
     "0 (66,53%)",
     "0 (77,92%)",
     "0 (50,57%)",
     "<0,001 *** (χ²)"
    ],
    [
     "mqtt.msgtype",
     "3 (61,62%)",
     "3 (41,80%)",
     "0 (79,86%)",
     "0 (66,53%)",
     "0 (77,92%)",
     "0 (50,57%)",
     "<0,001 *** (χ²)"
    ],
    [
     "mqtt.dupflag",
     "0,00% cu valoare ≠ 0",
     "14,37% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "<0,001 *** (χ²)"
    ],
    [
     "mqtt.qos",
     "0 [0, 0]; 0,00% au 1",
     "0 [0, 1]; 41,80% au 1",
     "0 [0, 0]; 0,00% au 1",
     "0 [0, 0]; 0,00% au 1",
     "0 [0, 0]; 0,00% au 1",
     "0 [0, 0]; 0,00% au 1",
     "<0,001 *** (KW)"
    ],
    [
     "mqtt.retain",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "0,01% cu valoare ≠ 0",
     "1,10% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "<0,001 *** (χ²)"
    ],
    [
     "mqtt.len",
     "10 [0, 11]",
     "2 [0, 168]",
     "0 [0, 0]",
     "0 [0, 3]",
     "0 [0, 0]",
     "0 [0, 15]",
     "<0,001 *** (KW)"
    ],
    [
     "3. Conectare (cererea clientului)"
    ],
    [
     "mqtt.conflags",
     "0 (100,00%)",
     "0 (99,99%)",
     "0 (90,14%)",
     "0 (92,49%)",
     "0 (88,96%)",
     "0 (99,84%)",
     "<0,001 *** (χ²)"
    ],
    [
     "mqtt.conflag.cleansess",
     "0,00% cu valoare ≠ 0",
     "0,01% cu valoare ≠ 0",
     "9,86% cu valoare ≠ 0",
     "7,51% cu valoare ≠ 0",
     "11,04% cu valoare ≠ 0",
     "0,16% cu valoare ≠ 0",
     "<0,001 *** (χ²)"
    ],
    [
     "mqtt.conflag.passwd",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "9,81% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "<0,001 *** (χ²)"
    ],
    [
     "mqtt.conflag.uname",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "9,83% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "<0,001 *** (χ²)"
    ],
    [
     "mqtt.kalive",
     "0 [0, 0]",
     "0 [0, 0]",
     "0 [0, 0]",
     "0 [0, 0]",
     "0 [0, 0]",
     "0 [0, 0]",
     "<0,001 *** (KW)"
    ],
    [
     "mqtt.protoname",
     "0 (100,00%)",
     "0 (99,99%)",
     "0 (90,14%)",
     "0 (92,49%)",
     "0 (88,96%)",
     "0 (99,84%)",
     "<0,001 *** (χ²)"
    ],
    [
     "mqtt.proto_len",
     "0,00% cu valoare ≠ 0",
     "0,01% cu valoare ≠ 0",
     "9,86% cu valoare ≠ 0",
     "7,51% cu valoare ≠ 0",
     "11,04% cu valoare ≠ 0",
     "0,16% cu valoare ≠ 0",
     "<0,001 *** (χ²)"
    ],
    [
     "mqtt.ver",
     "0,00% cu valoare ≠ 0",
     "0,01% cu valoare ≠ 0",
     "9,86% cu valoare ≠ 0",
     "7,51% cu valoare ≠ 0",
     "11,04% cu valoare ≠ 0",
     "0,16% cu valoare ≠ 0",
     "<0,001 *** (χ²)"
    ],
    [
     "4. Răspuns la conectare"
    ],
    [
     "mqtt.conack.flags",
     "0 (100,00%)",
     "0 (99,99%)",
     "0 (90,14%)",
     "0 (92,49%)",
     "0 (88,96%)",
     "0 (99,84%)",
     "<0,001 *** (χ²)"
    ],
    [
     "mqtt.conack.val",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "9,85% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "0,00% cu valoare ≠ 0",
     "<0,001 *** (χ²)"
    ]
   ]
  },
  {
   "tip": "text",
   "eticheta": "Nu apar în tabel",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "grupele „Mesaj will\" și „Abonare\" (toate variabilele lor sunt constante);",
    "cele 3 constante din celelalte grupe (conflag.reserved, conack.flags.reserved, conack.flags.sp);",
    "mqtt.msg și mqtt.msgid (conținutul mesajului și un număr de ordine)."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Ce se observă",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "mqtt.qos este 0 la toate clasele, în afară de dos (41,8% au 1);",
    "mqtt.kalive are mediana 0 la toate clasele, dar la slowite 11,04% dintre pachete au valoarea 65.535;",
    "tcp.len are Q3 de 13 la normal, 116 la dos și 32.759 la flood;",
    "câmpurile de conectare sunt nenule mai ales la bruteforce, malformed și slowite (7 până la 11%; la dos și flood sub 0,2%)."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "aceste diferențe se pierd dacă punem toate atacurile într-un singur grup. Dacă diferențele sunt reale sau doar întâmplătoare, aflăm din teste (6.2-6.4)."
  },
  {
   "tip": "sectiune",
   "titlu": "6.2 Kruskal-Wallis: variabilele numerice și mqtt.qos"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "compară toate cele 6 clase deodată și lucrează pe ranguri (locul fiecărei valori în ordine), deci nu cere formă de clopot (5.2) și nu este tras de valorile foarte mari. ANOVA, testul clasic, compară mediile și presupune distribuție normală, deci nu se potrivește aici. mqtt.qos intră tot aici, pentru că nivelurile lui au ordine."
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
    "toate valorile, din toate clasele, se pun într-un singur șir crescător și primesc rangul 1, 2, 3, …; valorile egale primesc media rangurilor lor;",
    "pentru fiecare clasă se adună rangurile ei: R;",
    "H = 12 / (N · (N + 1)) · suma (R² / n) - 3 · (N + 1), cu N = toate valorile și n = valorile clasei;",
    "p vine din distribuția χ² cu (numărul de clase - 1) grade de libertate. Dacă o clasă stă mereu „mai sus” sau „mai jos” în șir, H iese mare și p mic."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu mic",
   "text": "tcp.len la 3 clase, câte 3 pachete: bruteforce 0, 5, 11; normal 10, 12, 13; dos 100, 116, 168."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "șirul crescător: 0, 5, 10, 11, 12, 13, 100, 116, 168, cu rangurile 1-9;",
    "R bruteforce = 1 + 2 + 4 = 7; R normal = 3 + 5 + 6 = 14; R dos = 7 + 8 + 9 = 24;",
    "H = 12 / (9 · 10) · (7² / 3 + 14² / 3 + 24² / 3) - 3 · 10 = 6,49;",
    "cu 2 grade de libertate, p = 0,039, sub 0,05: cele 3 clase diferă."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "tcp.len pe cele 6 clase: H = 39.233, p sub 0,001. La fel, toate variabilele numerice și mqtt.qos au p sub 0,001 (coloana p, KW, din tabelul din 6.1)."
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "clasele diferă, dar testul nu spune care dintre ele; pentru asta este 6.4."
  },
  {
   "tip": "sectiune",
   "titlu": "6.3 χ²: variabilele categorice și binare"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "la coduri (de exemplu tcp.flags) nu există ordine sau medie, deci nu putem face ranguri. Putem doar număra câte pachete au fiecare valoare în fiecare clasă (frecvențe) și compara cu ce ar fi dacă variabila n-ar avea legătură cu clasa."
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
    "O = numărul de pachete pentru fiecare pereche (valoare, clasă);",
    "E = numărul așteptat dacă n-ar exista nicio legătură: E = total rând · total coloană / N;",
    "χ² = suma, pe toate celulele, a lui (O - E)² / E;",
    "grade de libertate = (rânduri - 1) · (coloane - 1); din χ² și gradele de libertate se obține p."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu mic",
   "text": "mqtt.dupflag la 100 de pachete normale și 100 dos: normal 100 cu 0 și 0 cu 1; dos 86 cu 0 și 14 cu 1."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "E: valoarea 0 apare la 186 din 200 de pachete, deci 93 la fiecare clasă; valoarea 1 la 14, deci 7 la fiecare clasă;",
    "χ² = (100 - 93)² / 93 + (0 - 7)² / 7 + (86 - 93)² / 93 + (14 - 7)² / 7 = 0,53 + 7 + 0,53 + 7 = 15,05;",
    "grade de libertate = (2 - 1) · (2 - 1) = 1, deci p = 0,0001: dupflag diferă între cele două clase."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "tcp.flags, pas cu pas. Aceeași metodă s-a aplicat la toate variabilele categorice și binare din tabelul din 6.1."
  },
  {
   "tip": "text",
   "eticheta": "Intrare (datele)",
   "text": "pentru fiecare pachet, valoarea lui tcp.flags și clasa lui (target). Câteva rânduri din date (numărul rândului din fișier; primele două pachete legitimate și primul pachet din fiecare atac):"
  },
  {
   "tip": "tabel",
   "antet": [
    "rând",
    "tcp.flags",
    "tcp.len",
    "mqtt.len",
    "target"
   ],
   "randuri": [
    [
     "1",
     "0x00000010",
     "0",
     "0",
     "legitimate"
    ],
    [
     "5",
     "0x00000010",
     "0",
     "0",
     "legitimate"
    ],
    [
     "2",
     "0x00000018",
     "90",
     "165",
     "dos"
    ],
    [
     "47",
     "0x00000011",
     "0",
     "0",
     "bruteforce"
    ],
    [
     "37",
     "0x00000018",
     "14",
     "12",
     "malformed"
    ],
    [
     "7",
     "0x00000018",
     "29",
     "0",
     "slowite"
    ],
    [
     "1421",
     "0x00000018",
     "32759",
     "15",
     "flood"
    ]
   ]
  },
  {
   "tip": "text",
   "eticheta": "Pasul 1, tabelul de contingență (O)",
   "text": "se numără pachetele pentru fiecare pereche (valoare tcp.flags, clasă). Pe rânduri sunt cele 8 valori, pe coloane cele 6 clase. Coloana „flaguri” traduce codul hex (secțiunea 4)."
  },
  {
   "tip": "tabel",
   "antet": [
    "tcp.flags",
    "flaguri",
    "legitimate",
    "dos",
    "bruteforce",
    "malformed",
    "slowite",
    "flood",
    "total"
   ],
   "randuri": [
    [
     "0x00000002",
     "SYN",
     "0",
     "15",
     "1.430",
     "902",
     "1.024",
     "1",
     "3.372"
    ],
    [
     "0x00000004",
     "RST",
     "0",
     "0",
     "0",
     "1.584",
     "8",
     "0",
     "1.592"
    ],
    [
     "0x00000010",
     "ACK",
     "60.708",
     "60.516",
     "5.469",
     "2.984",
     "4.082",
     "306",
     "134.065"
    ],
    [
     "0x00000011",
     "FIN, ACK",
     "0",
     "33",
     "3.252",
     "903",
     "8",
     "2",
     "4.198"
    ],
    [
     "0x00000012",
     "SYN, ACK",
     "0",
     "15",
     "1.430",
     "902",
     "1.024",
     "1",
     "3.372"
    ],
    [
     "0x00000014",
     "RST, ACK",
     "0",
     "0",
     "0",
     "41",
     "0",
     "0",
     "41"
    ],
    [
     "0x00000018",
     "PSH, ACK",
     "104.755",
     "69.644",
     "2.920",
     "2.870",
     "3.056",
     "303",
     "183.548"
    ],
    [
     "0x00000019",
     "FIN, PSH, ACK",
     "0",
     "0",
     "0",
     "738",
     "0",
     "0",
     "738"
    ],
    [
     "total",
     "",
     "165.463",
     "130.223",
     "14.501",
     "10.924",
     "9.202",
     "613",
     "330.926"
    ]
   ]
  },
  {
   "tip": "text",
   "eticheta": "Pasul 2, procente pe clasă",
   "text": "fiecare număr se împarte la totalul coloanei lui, deci fiecare coloană dă 100%. Exemplu: 104.755 / 165.463 = 63,31% la legitimate."
  },
  {
   "tip": "tabel",
   "antet": [
    "tcp.flags",
    "flaguri",
    "legitimate",
    "dos",
    "bruteforce",
    "malformed",
    "slowite",
    "flood"
   ],
   "randuri": [
    [
     "0x00000002",
     "SYN",
     "0,00%",
     "0,01%",
     "9,86%",
     "8,26%",
     "11,13%",
     "0,16%"
    ],
    [
     "0x00000004",
     "RST",
     "0,00%",
     "0,00%",
     "0,00%",
     "14,50%",
     "0,09%",
     "0,00%"
    ],
    [
     "0x00000010",
     "ACK",
     "36,69%",
     "46,47%",
     "37,71%",
     "27,32%",
     "44,36%",
     "49,92%"
    ],
    [
     "0x00000011",
     "FIN, ACK",
     "0,00%",
     "0,03%",
     "22,43%",
     "8,27%",
     "0,09%",
     "0,33%"
    ],
    [
     "0x00000012",
     "SYN, ACK",
     "0,00%",
     "0,01%",
     "9,86%",
     "8,26%",
     "11,13%",
     "0,16%"
    ],
    [
     "0x00000014",
     "RST, ACK",
     "0,00%",
     "0,00%",
     "0,00%",
     "0,38%",
     "0,00%",
     "0,00%"
    ],
    [
     "0x00000018",
     "PSH, ACK",
     "63,31%",
     "53,48%",
     "20,14%",
     "26,27%",
     "33,21%",
     "49,43%"
    ],
    [
     "0x00000019",
     "FIN, PSH, ACK",
     "0,00%",
     "0,00%",
     "0,00%",
     "6,76%",
     "0,00%",
     "0,00%"
    ],
    [
     "total",
     "",
     "100%",
     "100%",
     "100%",
     "100%",
     "100%",
     "100%"
    ]
   ]
  },
  {
   "tip": "imagine",
   "src": "tcpflags_100.png",
   "latime": 1125,
   "inaltime": 540
  },
  {
   "tip": "text",
   "eticheta": "Pasul 3, valorile așteptate (E)",
   "text": "dacă tcp.flags n-ar avea legătură cu clasa, fiecare clasă ar avea aceleași procente ca tot setul. E = total rând · total coloană / N. Exemplu: 0x00000011 la bruteforce: E = 4.198 · 14.501 / 330.926 = 183,95, dar s-au observat O = 3.252."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 4, χ²",
   "text": "pentru fiecare dintre cele 48 de celule se calculează (O - E)² / E, iar rezultatele se adună. Celula de mai sus dă (3.252 - 183,95)² / 183,95 = 51.170, cea mai mare contribuție. Suma tuturor celulelor: χ² = 196.049."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 5, p",
   "text": "grade de libertate (câte celule ale tabelului pot varia liber când totalurile sunt fixe; de ele depinde cât de mare trebuie să fie χ² ca să conteze): df = (8 - 1) · (6 - 1) = 35. Pentru χ² = 196.049 cu 35 de grade de libertate, p este practic 0 (sub 0,001), deci respingem H0: distribuția lui tcp.flags diferă între clase."
  },
  {
   "tip": "text",
   "text": "Codul (Python): aceiași pași, cu bibliotecile pandas și scipy:"
  },
  {
   "tip": "cod",
   "text": "import pandas as pd\nfrom scipy.stats import chi2_contingency\nd = pd.read_csv(\"mqttdataset_reduced.csv\")\nO = pd.crosstab(d[\"tcp.flags\"], d[\"target\"])   # pasul 1\nprocente = O / O.sum() * 100                    # pasul 2\nchi2, p, df, E = chi2_contingency(O)            # pașii 3, 4 și 5\nprint(round(chi2), df, p)                       # 196049 35 0.0"
  },
  {
   "tip": "text",
   "eticheta": "Ce arată",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "traficul normal are doar 0x00000010 (ACK) și 0x00000018 (PSH și ACK), adică pachete de confirmare și de date;",
    "celelalte valori apar doar la atacuri: SYN și SYN+ACK la bruteforce, malformed și slowite (conexiuni noi), FIN+ACK mai ales la bruteforce (22,43%), iar RST (0x00000004), FIN+PSH+ACK și RST+ACK aproape numai la malformed."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "χ² arată doar că cel puțin o clasă diferă; ce atac diferă de normal se citește în tabelul procentelor (Pasul 2)."
  },
  {
   "tip": "sectiune",
   "titlu": "6.4 Mann-Whitney: fiecare atac față de normal"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "Kruskal-Wallis (6.2) spune doar că cele 6 clase nu arată la fel. Ca să aflăm care atac diferă de traficul normal, comparăm fiecare atac cu normalul, câte două clase odată, tot pe ranguri."
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
    "se iau toate perechile (pachet normal, pachet din atac);",
    "U = numărul perechilor în care pachetul normal are valoarea mai mare (o egalitate contează 0,5);",
    "dacă cele două clase arată la fel, U este aproape de jumătate din numărul perechilor; cu cât U este mai departe de jumătate, cu atât p este mai mic."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu mic",
   "text": "tcp.len, 4 pachete normale (10, 12, 13, 14) și 4 dos (20, 100, 116, 168):"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "sunt 4 · 4 = 16 perechi; în niciuna pachetul normal nu este mai mare, deci U = 0 (jumătatea ar fi 8);",
    "p = 0,029, sub 0,05: dos diferă de normal."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "flood față de normal la tcp.time_delta: 165.463 · 613 = 101.428.819 perechi; U = 48.313.904,5, adică 47,6% din perechi, aproape de jumătate; p = 0,042, doar puțin sub 0,05."
  },
  {
   "tip": "text",
   "text": "Atac față de normal, la numerice și mqtt.qos (p necorectat): toate comparațiile ies cu *** (p sub 0,001), cu două excepții:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "tcp.time_delta: flood față de normal are doar * (p = 0,042, exemplul de mai sus);",
    "mqtt.qos: comparațiile cu bruteforce, malformed, slowite și flood nu se pot calcula, pentru că valorile sunt 0 și la normal, și la atac."
   ]
  },
  {
   "tip": "text",
   "text": "Stelele din grafice arată aceste comparații (atac față de normal). Graficele, câte unul pe variabilă, compară cele 6 clase:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "numerice: boxplot, cu stelele atac față de normal;",
    "categorii: procente pe clasă;",
    "mqtt.qos și mqtt.kalive: tot procente pe clasă, cu stele, pentru că au doar câteva valori (0 și 1, respectiv 0, 60 și 65.535, plus 1, 2, 3 și 234 la câte 41 de pachete malformed), pe care o cutie nu le-ar arăta;",
    "tcp.time_delta: axa este logaritmică, iar valorile 0 sunt desenate la 1e-06 s (cea mai mică valoare nenulă), pentru că logaritmul lui 0 nu există."
   ]
  },
  {
   "tip": "galerie",
   "imagini": [
    {
     "tip": "imagine",
     "src": "test_tcp.flags.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_tcp.time_delta.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_tcp.len.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.hdrflags.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.msgtype.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.dupflag.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.qos.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.retain.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.len.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.conflags.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.conflag.cleansess.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.conflag.passwd.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.conflag.uname.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.kalive.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.protoname.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.proto_len.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.ver.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.conack.flags.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.conack.val.png",
     "latime": 780,
     "inaltime": 504,
     "legenda": ""
    }
   ]
  },
  {
   "tip": "text",
   "eticheta": "Limită",
   "text": "testele presupun că fiecare pachet este independent de celelalte, dar pachetele din aceeași conexiune seamănă între ele; de aceea p iese mai mic decât ar trebui."
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
    "Toate cele 19 variabile diferă între clase (p sub 0,001, 6.2 și 6.3). Cu atâtea pachete, p iese mic și la diferențe mici, deci cât de mare e diferența se citește în tabel (6.1).",
    "Cele mai clare diferențe: mqtt.qos = 1 apare doar la dos, mqtt.kalive = 65.535 doar la slowite, iar tcp.len are valori mult mai mari la dos și flood (Q3 = 116 și 32.759, față de 13 la normal) (6.1).",
    "tcp.flags: traficul normal are doar ACK și PSH+ACK; SYN, FIN+ACK, RST și celelalte apar doar la atacuri (6.3).",
    "Aproape fiecare atac diferă de normal la fiecare variabilă numerică; excepția clară este flood la tcp.time_delta (6.4).",
    "Atacurile arată diferit și între ele (tabelul pe clase), deci nu le punem într-un singur grup decât acolo unde metoda o cere (7.4 și capitolele 9 și 10)."
   ]
  }
 ]
}

export default date
