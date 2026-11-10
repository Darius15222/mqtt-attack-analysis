import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "11. Reguli de asociere",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Din capitolul 10 știm că arborele spune doar „atac” sau „normal”. Regulile de asociere spun și ce atac. O regulă de asociere are forma DACĂ A, ATUNCI B: pachetele care au valorile din A au des și valoarea B. A (stânga) și B (dreapta) sunt seturi de itemi, iar un item este o pereche variabilă=valoare, de exemplu tcp.flags=RST. Căutăm regulile care au un atac în dreapta, adică combinațiile de valori care anunță atacul. Formulele sunt în secțiunea 4."
  },
  {
   "tip": "parte",
   "fel": "ipoteza",
   "titlu": "Scopul"
  },
  {
   "tip": "text",
   "text": "Aici nu testăm o ipoteză. Vrem, pentru fiecare atac, combinațiile de valori după care îl recunoaștem și cât de sigure sunt (confidence)."
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
   "text": "cele 330.926 de pachete, fiecare scris ca o tranzacție: setul celor 7 itemi pe care îi are (11.1)."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "",
   "puncte": [
    "11.1 fiecare pachet devine o tranzacție, o listă de itemi „variabilă=valoare”;",
    "11.2 algoritmul Apriori găsește combinațiile de itemi care apar des (support peste un prag), apoi din ele regulile cu confidence peste un prag; pentru fiecare regulă se calculează și lift;",
    "11.3 o rulare pe toate pachetele;",
    "11.4 regulile pentru fiecare atac;",
    "11.5 regulile față de arborele din capitolul 10."
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "o rulare pe toate pachetele (11.3) și regulile pentru fiecare atac (11.4)."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizii",
   "text": "",
   "puncte": [
    "Apriori din biblioteca mlxtend (Python);",
    "o tranzacție este un pachet, pentru că setul de date nu are un identificator de conexiune sau de sesiune care să grupeze pachetele;",
    "folosim toate pachetele, ca la arbori."
   ]
  },
  {
   "tip": "parte",
   "fel": "demonstratie",
   "titlu": "Demonstrația"
  },
  {
   "tip": "sectiune",
   "titlu": "11.1 Pachetele ca tranzacții"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "Apriori numără combinații de valori, nu lucrează cu numere, deci fiecare pachet trebuie scris ca o listă de itemi „variabilă=valoare”."
  },
  {
   "tip": "text",
   "text": "Apriori lucrează cu itemi, nu cu numere, deci variabilele numerice se împart în intervale. Am folosit aceleași variabile ca la arbori (10.2), fără mqtt.ver, care marchează aceleași pachete ca mqtt.msgtype = CONNECT. În tabele, variabilele apar cu numele scurte din prima coloană."
  },
  {
   "tip": "tabel",
   "antet": [
    "Variabila (nume scurt)",
    "Itemi",
    "De unde vin valorile"
   ],
   "randuri": [
    [
     "tcp.flags (flags)",
     "8: ACK, PSH+ACK, FIN+ACK, SYN, SYN+ACK, RST, FIN+PSH+ACK, RST+ACK",
     "Codurile hex traduse în flaguri (secțiunea 4)."
    ],
    [
     "mqtt.msgtype (msgtype)",
     "11: fără MQTT (0), CONNECT, CONNACK, PUBLISH, PUBACK, PUBREC, SUBSCRIBE, SUBACK, PINGREQ, PINGRESP, DISCONNECT",
     "Numele tipurilor (capitolul 3); 0 înseamnă un pachet TCP fără mesaj MQTT."
    ],
    [
     "mqtt.qos (qos), mqtt.dupflag (dupflag)",
     "2 fiecare: 0 și 1",
     "Valorile, așa cum sunt."
    ],
    [
     "tcp.len (len)",
     "4: 0, 1-20, 21-1460, 1461+",
     "Limita 20 este cea din 10.4. 1.460 este cel mai mare segment TCP obișnuit într-o rețea Ethernet: cele mai mari mesaje dos (23.673) au exact 1.460, iar peste această limită sunt numai pachete flood (293)."
    ],
    [
     "tcp.time_delta (delta)",
     "4: Q1 (≤ 3 µs), Q2 (≤ 26 µs), Q3 (≤ 170 µs), Q4 (mai mult)",
     "Limitele sunt cuartilele. În Q1 intră 33% din pachete, nu 25%, pentru că 10% au exact 3 µs."
    ],
    [
     "target",
     "6: clasele",
     "Coloana target."
    ]
   ]
  },
  {
   "tip": "text",
   "text": "În total sunt 37 de itemi. Fiecare pachet are exact 7 itemi, câte unul din fiecare variabilă. Primele pachete din set, ca tranzacții:"
  },
  {
   "tip": "tabel",
   "antet": [
    "Pachet",
    "Tranzacția (itemii pachetului)"
   ],
   "randuri": [
    [
     "1",
     "flags=ACK, msgtype=fără MQTT, qos=0, dupflag=0, len=0, delta=Q2, target=legitimate"
    ],
    [
     "2",
     "flags=PSH+ACK, msgtype=PUBLISH, qos=1, dupflag=0, len=21-1460, delta=Q1, target=dos"
    ],
    [
     "3",
     "flags=PSH+ACK, msgtype=PUBACK, qos=0, dupflag=0, len=1-20, delta=Q1, target=dos"
    ],
    [
     "4",
     "flags=PSH+ACK, msgtype=PUBLISH, qos=1, dupflag=0, len=21-1460, delta=Q1, target=dos"
    ],
    [
     "5",
     "flags=ACK, msgtype=fără MQTT, qos=0, dupflag=0, len=0, delta=Q2, target=legitimate"
    ]
   ]
  },
  {
   "tip": "imagine",
   "src": "ar_itemi.png",
   "latime": 1500,
   "inaltime": 1240
  },
  {
   "tip": "text",
   "eticheta": "Ce arată",
   "text": "dupflag=0 și qos=0 sunt în majoritatea pachetelor, deci apar în multe reguli fără să spună ceva despre atacuri. Itemii atacurilor mici (bruteforce 4,38%, malformed 3,30%, slowite 2,78%, flood 0,19%) sunt sub linia de 5%."
  },
  {
   "tip": "sectiune",
   "titlu": "11.2 Cum se găsesc regulile: Apriori"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "cu 37 de itemi există foarte multe combinații posibile; Apriori le sare pe cele care sigur sunt rare, ca să nu le numere degeaba."
  },
  {
   "tip": "text",
   "eticheta": "Ce măsurăm la o regulă A → B",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "support = cât din toate pachetele au și A, și B: cât de des apare regula;",
    "confidence = din pachetele cu A, câte au și B: cât de des are regula dreptate;",
    "lift = confidence / cât de des apare B în tot setul: peste 1 înseamnă că A face B mai probabil decât în general."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu mic",
   "text": "5 pachete: {SYN, bruteforce}, {SYN, bruteforce}, {SYN, normal}, {ACK, normal}, {ACK, normal}. Pentru regula SYN → bruteforce:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "support = 2 / 5 = 0,4 (2 pachete au și SYN, și bruteforce);",
    "confidence = 2 / 3 = 0,67 (din cele 3 pachete cu SYN, 2 sunt bruteforce);",
    "lift = 0,67 / (2 / 5 = 0,4) = 1,67: un pachet cu SYN este bruteforce de 1,67 ori mai des decât un pachet oarecare."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează (Apriori)",
   "text": ""
  },
  {
   "tip": "text",
   "eticheta": "Pasul 1",
   "text": "fiecare item se numără; rămân itemii cu support cel puțin egal cu pragul (itemii frecvenți)."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 2",
   "text": "din itemii frecvenți se formează toate perechile (candidații); se numără și rămân perechile frecvente."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 3",
   "text": "din seturile frecvente de k - 1 itemi se formează candidații cu k itemi. Un candidat se păstrează doar dacă toate subseturile lui sunt frecvente: dacă {A, B} apare rar, {A, B, C} apare și mai rar, deci nu mai trebuie numărat."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 4",
   "text": "se repetă până nu mai rămâne niciun candidat (la noi, cel mult 7 itemi, câte unul pe variabilă)."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 5",
   "text": "din fiecare set frecvent se scot regulile cu un item în dreapta și ceilalți în stânga; rămân cele cu confidence cel puțin egal cu pragul."
  },
  {
   "tip": "text",
   "text": "Pașii pe datele noastre, la rularea din 11.3 (support minim 0,05):"
  },
  {
   "tip": "tabel",
   "antet": [
    "Itemi în set (k)",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8"
   ],
   "randuri": [
    [
     "Candidați",
     "37",
     "153",
     "232",
     "211",
     "127",
     "42",
     "6",
     "0"
    ],
    [
     "Frecvenți",
     "18",
     "94",
     "197",
     "210",
     "127",
     "42",
     "6",
     "0"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "Fără Apriori, la k = 2 s-ar număra toate cele 666 de perechi din cei 37 de itemi; așa se numără doar cele 153 de perechi din cei 18 itemi frecvenți. La k = 3 se numără 232 de candidați în loc de toate cele 816 triplete din cei 18 itemi. Toți cei 6 candidați de la k = 7 sunt frecvenți, iar la k = 8 nu mai există candidați, deci algoritmul se oprește."
  },
  {
   "tip": "subtitlu",
   "text": "Pe datele noastre: {flags=FIN+ACK} → {target=bruteforce}"
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "4.198 de pachete au FIN+ACK, 14.501 sunt bruteforce, iar 3.252 sunt și una și alta."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "",
   "puncte": [
    "support = 3.252 / 330.926 = 0,0098;",
    "confidence = 3.252 / 4.198 = 0,775;",
    "lift = 0,775 / (14.501 / 330.926 = 0,0438) = 17,7."
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "din pachetele cu FIN+ACK, 77,5% sunt bruteforce, de 17,7 ori mai des decât bruteforce în tot setul (4,38%). Combinația apare însă rar: în 0,98% din pachete."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "păstrăm doar regulile cu un singur item în dreapta, ca fiecare regulă să se citească „aceste valori → o valoare”. O regulă mai lungă rămâne doar dacă are confidence mai mare decât toate regulile mai scurte cu același item în dreapta și cu stânga inclusă în a ei. De exemplu, {qos=1} → dos are confidence 1, deci {qos=1, msgtype=PUBLISH} → dos nu mai spune nimic nou."
  },
  {
   "tip": "text",
   "text": "Codul (am verificat biblioteca pe un exemplu mic, calculat de mână: dă aceleași seturi frecvente și aceleași confidence):"
  },
  {
   "tip": "cod",
   "text": "import pandas as pd\nfrom mlxtend.frequent_patterns import apriori, association_rules\nitemi = pd.get_dummies(tranzactii.astype(str), prefix_sep=\"=\")   # o coloană TRUE/FALSE pe item\nfrecvente = apriori(itemi, min_support=0.05, use_colnames=True)\nreguli = association_rules(frecvente, metric=\"confidence\", min_threshold=0.6)\nreguli = reguli[reguli.consequents.apply(len) == 1]   # un item în dreapta"
  },
  {
   "tip": "sectiune",
   "titlu": "11.3 Rularea pe toate pachetele (support 0,05, confidence 0,6)"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "o primă rulare, cu praguri obișnuite, arată ce tipare frecvente are tot setul."
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "support minim 0,05, adică o combinație trebuie să apară în cel puțin 16.547 de pachete, și confidence minim 0,6."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "",
   "puncte": [
    "support 0,05, adică cel puțin un pachet din 20, ca regulile să descrie tipare frecvente, nu cazuri izolate;",
    "confidence 0,6, ca regula să aibă dreptate la majoritatea pachetelor care îndeplinesc partea stângă."
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "1.861 de reguli cu un item în dreapta; după scoaterea celor redundante rămân 308:",
   "puncte": [
    "70 cu 2 itemi;",
    "152 cu 3;",
    "75 cu 4;",
    "11 cu 5."
   ]
  },
  {
   "tip": "text",
   "text": "Support este între 0,051 și 0,836, confidence între 0,60 și 1, iar lift între 0,70 și 8,51 (mediana 1,96). Cele 10 reguli cu cel mai mare lift:"
  },
  {
   "tip": "tabel",
   "antet": [
    "Stânga (DACĂ)",
    "Dreapta (ATUNCI)",
    "Support",
    "Confidence",
    "Lift",
    "Pachete"
   ],
   "randuri": [
    [
     "delta=Q1, flags=PSH+ACK, qos=0, target=dos",
     "msgtype=PUBACK",
     "0,072",
     "1,000",
     "8,51",
     "23.710"
    ],
    [
     "delta=Q1, len=1-20, target=dos",
     "msgtype=PUBACK",
     "0,060",
     "1,000",
     "8,51",
     "19.742"
    ],
    [
     "len=1-20, target=dos",
     "msgtype=PUBACK",
     "0,085",
     "0,999",
     "8,50",
     "28.235"
    ],
    [
     "flags=PSH+ACK, qos=0, target=dos",
     "msgtype=PUBACK",
     "0,117",
     "0,999",
     "8,50",
     "38.841"
    ],
    [
     "delta=Q1, flags=PSH+ACK, qos=0",
     "msgtype=PUBACK",
     "0,072",
     "0,994",
     "8,46",
     "23.710"
    ],
    [
     "delta=Q1, flags=PSH+ACK, len=1-20",
     "msgtype=PUBACK",
     "0,060",
     "0,994",
     "8,46",
     "19.742"
    ],
    [
     "delta=Q1, len=1-20",
     "msgtype=PUBACK",
     "0,060",
     "0,994",
     "8,46",
     "19.742"
    ],
    [
     "msgtype=PUBLISH, target=dos",
     "qos=1",
     "0,164",
     "1,000",
     "6,08",
     "54.431"
    ],
    [
     "flags=ACK, len=21-1460, target=dos",
     "qos=1",
     "0,072",
     "1,000",
     "6,08",
     "23.673"
    ],
    [
     "dupflag=1",
     "qos=1",
     "0,057",
     "1,000",
     "6,08",
     "18.707"
    ]
   ]
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
    "regulile cu lift mare descriu atacul dos din interior: confirmările PUBACK (tcp.len 1-20, PSH+ACK, timp foarte mic) și mesajele PUBLISH cu qos = 1;",
    "dupflag=1 → qos=1 are confidence 1: mesajele retrimise au mereu qos 1;",
    "în dreapta, dintre clase apar doar legitimate (46 de reguli) și dos (20). Celelalte atacuri au fiecare sub 5% din pachete, deci nicio combinație cu ele nu ajunge la support 0,05."
   ]
  },
  {
   "tip": "sectiune",
   "titlu": "11.4 Regulile pentru fiecare atac"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "la 11.3 atacurile mici nu apar, pentru că au fiecare sub 5% din pachete; aici căutăm direct regulile care se termină cu un atac."
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "aceleași tranzacții. Păstrăm doar regulile care au un atac în dreapta (dos, bruteforce, malformed, slowite sau flood) și nicio clasă în stânga."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizii",
   "text": "confidence minim 0,5: regula are dreptate în cel puțin jumătate din pachete. Support minim se dă în număr de pachete, pentru că atacurile mici nu ajung la 5%. Numărul de reguli (fără cele redundante) pentru două praguri:"
  },
  {
   "tip": "tabel",
   "antet": [
    "Support minim",
    "dos",
    "bruteforce",
    "malformed",
    "slowite",
    "flood"
   ],
   "randuri": [
    [
     "300 de pachete (0,091%)",
     "23",
     "7",
     "6",
     "7",
     "0"
    ],
    [
     "150 de pachete (0,045%)",
     "24",
     "7",
     "8",
     "7",
     "1"
    ]
   ]
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "am ales 150. La 300, flood nu are nicio regulă: 306 dintre pachetele lui sunt ACK goale, la fel ca multe pachete normale, iar singurul grup care îl deosebește (tcp.len peste 1.460) are 293 de pachete, sub prag. 150 este aproximativ jumătate din 293. Celelalte atacuri primesc aproape aceleași reguli la ambele praguri."
  },
  {
   "tip": "text",
   "text": "Cele mai sigure 3 reguli pentru fiecare atac (ordonate după confidence, apoi după support):"
  },
  {
   "tip": "tabel",
   "antet": [
    "Atac",
    "Stânga (DACĂ)",
    "Pachete",
    "Support",
    "Confidence",
    "Lift"
   ],
   "randuri": [
    [
     "dos",
     "qos=1",
     "54.431",
     "0,1645",
     "1,000",
     "2,5"
    ],
    [
     "dos",
     "delta=Q1, msgtype=PUBACK",
     "23.710",
     "0,0716",
     "1,000",
     "2,5"
    ],
    [
     "dos",
     "dupflag=1",
     "18.707",
     "0,0565",
     "1,000",
     "2,5"
    ],
    [
     "bruteforce",
     "delta=Q4, len=21-1460, msgtype=CONNECT",
     "1.136",
     "0,0034",
     "0,962",
     "22,0"
    ],
    [
     "bruteforce",
     "len=21-1460, msgtype=CONNECT",
     "1.424",
     "0,0043",
     "0,962",
     "21,9"
    ],
    [
     "bruteforce",
     "delta=Q3, flags=FIN+ACK",
     "1.446",
     "0,0044",
     "0,938",
     "21,4"
    ],
    [
     "malformed",
     "flags=FIN+PSH+ACK",
     "738",
     "0,0022",
     "1,000",
     "30,3"
    ],
    [
     "malformed",
     "delta=Q1, flags=RST",
     "279",
     "0,0008",
     "1,000",
     "30,3"
    ],
    [
     "malformed",
     "delta=Q3, flags=RST",
     "1.164",
     "0,0035",
     "0,998",
     "30,2"
    ],
    [
     "slowite",
     "len=21-1460, msgtype=fără MQTT",
     "1.024",
     "0,0031",
     "1,000",
     "36,0"
    ],
    [
     "slowite",
     "delta=Q4, flags=PSH+ACK, msgtype=fără MQTT",
     "1.017",
     "0,0031",
     "1,000",
     "36,0"
    ],
    [
     "slowite",
     "delta=Q2, flags=SYN+ACK",
     "932",
     "0,0028",
     "0,999",
     "35,9"
    ],
    [
     "flood",
     "len=1461+",
     "293",
     "0,0009",
     "1,000",
     "539,8"
    ]
   ]
  },
  {
   "tip": "imagine",
   "src": "ar_graf.png",
   "latime": 1600,
   "inaltime": 1080
  },
  {
   "tip": "imagine",
   "src": "ar_scatter.png",
   "latime": 1800,
   "inaltime": 760
  },
  {
   "tip": "text",
   "text": "În stânga, rularea pe toate pachetele: multe reguli au confidence 1, dar puține au lift mare. În dreapta, regulile pe atacuri: dos are reguli cu support mare (până la 16%), celelalte atacuri sub 1%."
  },
  {
   "tip": "text",
   "eticheta": "Ce arată",
   "text": "cele 5 atacuri au fiecare cel puțin o regulă cu confidence de cel puțin 0,96:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "dos: qos=1 (54.431 de pachete) și dupflag=1 apar numai la dos; la fel, confirmările PUBACK venite foarte repede (Q1).",
    "bruteforce: mesaje CONNECT cu conținut (tcp.len 21-1460), adică cereri de conectare cu nume și parolă, și, cu confidence 0,94, conexiuni închise (FIN+ACK) cu timpul în Q3.",
    "malformed: flagurile FIN+PSH+ACK (toate cele 738 de pachete) și RST.",
    "slowite: pachete cu conținut, dar fără mesaj MQTT recunoscut, și SYN+ACK cu timpul în Q2.",
    "flood: tcp.len peste 1.460, 293 de pachete, confidence 1."
   ]
  },
  {
   "tip": "text",
   "text": "Lift-ul nu se compară între atacuri: cel mai mare lift posibil este 1 / proporția atacului, adică 2,54 la dos (1 / 0,3935) și 540 la flood (1 / 0,00185). De aceea ordonăm după confidence."
  },
  {
   "tip": "sectiune",
   "titlu": "11.5 Regulile față de arborele de decizie"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "verificăm dacă două metode diferite ajung la aceleași valori."
  },
  {
   "tip": "text",
   "text": "Regulile ajung la aceleași valori ca arborele din 10.4: qos=1 → dos este și prima împărțire a arborelui, iar RST, SYN, FIN cu ACK și PSH+ACK la mesajele care nu sunt PUBLISH sau ping duc în frunzele 6, 7 și 8 (atac). Arborele spune însă doar normal sau atac, iar regulile spun și ce atac. Nici regulile nu deosebesc pachetele care sunt doar ACK: cele 306 pachete flood ACK goale nu apar în nicio regulă, la fel cum arborele ratează 294 dintre ele în frunza 12."
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
    "Fiecare dintre cele 5 atacuri are cel puțin o regulă cu confidence de cel puțin 0,96 (11.4).",
    "dos: qos=1 sau dupflag=1. bruteforce: mesaje CONNECT cu conținut. malformed: flagurile FIN+PSH+ACK și RST. slowite: pachete cu conținut, dar fără mesaj MQTT. flood: tcp.len peste 1.460.",
    "Regulile ajung la aceleași valori ca arborele (11.5), dar spun și ce atac este, nu doar „atac”.",
    "Nici regulile nu recunosc confirmările ACK goale ale atacurilor."
   ]
  }
 ]
}

export default date
