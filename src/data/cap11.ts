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
   "text": "Din capitolul 10 știm că arborele spune doar „atac” sau „normal”. Regulile de asociere spun și ce atac. O regulă are forma DACĂ A, ATUNCI B: pachetele cu valorile din A au des și valoarea B. Căutăm regulile care au un atac în dreapta."
  },
  {
   "tip": "text",
   "eticheta": "Pe scurt",
   "text": "pentru fiecare regulă măsurăm cât de des apare (support), cât de des are dreptate (confidence) și de câte ori face atacul mai probabil (lift). Fiecare atac are o regulă sigură în cel puțin 96% din cazuri."
  },
  {
   "tip": "text",
   "eticheta": "De ținut minte",
   "text": "la atacurile rare pragul de support trebuie coborât, altfel regulile lor nu apar deloc."
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
     "Tranzacție, item",
     "tranzacție = un pachet scris ca listă de itemi; item = o pereche variabilă=valoare",
     "fiecare pachet are 7 itemi",
     "flags=SYN"
    ],
    [
     "Regulă A → B",
     "DACĂ pachetul are A, ATUNCI are des și B",
     "B este de obicei un atac",
     "flags=FIN+ACK → bruteforce"
    ],
    [
     "Support",
     "cât din toate pachetele au și A, și B",
     "cât de des apare regula",
     "0,0098"
    ],
    [
     "Confidence",
     "din pachetele cu A, câte au și B",
     "cât de des are regula dreptate; 1 = mereu",
     "0,775"
    ],
    [
     "Lift",
     "confidence împărțit la cât de des apare B în general",
     "peste 1 = A face B mai probabil",
     "17,7"
    ],
    [
     "Apriori",
     "algoritmul care găsește combinațiile frecvente fără să le numere pe toate",
     "sare peste combinațiile care sigur sunt rare",
     "la perechi: 153 numărate în loc de 666"
    ]
   ]
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
    "o tranzacție este un pachet, pentru că datele nu spun care pachete sunt din aceeași conexiune;",
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
   "text": "Variabilele numerice se împart în intervale. Folosim aceleași variabile ca la arbori (10.2), fără mqtt.ver; în tabele apar cu numele scurte din prima coloană."
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
     "Codurile hex traduse în flaguri (capitolul 4)."
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
     "Limita 20 este cea din 10.4. 1.460 este cel mai mare segment TCP obișnuit într-o rețea Ethernet: 23.673 de pachete dos au exact 1.460 de bytes, cea mai mare lungime la dos, iar peste această limită sunt numai pachete flood (293)."
    ],
    [
     "tcp.time_delta (delta)",
     "4: Q1 (≤ 3 µs), Q2 (≤ 26 µs), Q3 (≤ 170 µs), Q4 (mai mult)",
     "Limitele sunt cuartilele lui tcp.time_delta (5.3), de aici numele: Q1 = sfertul cu timpii cei mai mici, Q4 = cel cu cei mai mari. În Q1 intră 33% din pachete, nu 25%, pentru că 10% au exact 3 µs."
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
   "text": "În total sunt 37 de itemi; fiecare pachet are exact 7, câte unul din fiecare variabilă. Exemplu: primul pachet din set este {flags=ACK, msgtype=fără MQTT, qos=0, dupflag=0, len=0, delta=Q2, target=legitimate}."
  },
  {
   "tip": "imagine",
   "src": "ar_itemi.png",
   "latime": 1500,
   "inaltime": 1240
  },
  {
   "tip": "text",
   "eticheta": "Cum se citește",
   "text": "fiecare bară e un item (variabilă=valoare), iar lungimea ei e support-ul, adică procentul de pachete care îl au. Linia punctată e pragul de 5% (support 0,05) din 11.3."
  },
  {
   "tip": "text",
   "eticheta": "Ce arată",
   "text": "dupflag=0 (94%) și qos=0 (84%) apar în aproape toate pachetele, deci nu spun nimic despre atacuri. Atacurile mici (bruteforce, malformed, slowite, flood) sunt sub linia de 5%."
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
   "eticheta": "Exemplu",
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
   "text": "se numără fiecare item; rămân cei care apar destul de des (support cel puțin egal cu pragul)."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 2",
   "text": "din itemii rămași se formează perechi, apoi grupuri de 3 și așa mai departe, păstrând doar combinațiile frecvente. O combinație se numără doar dacă toate părțile ei sunt frecvente: dacă {A, B} apare rar, {A, B, C} apare și mai rar."
  },
  {
   "tip": "text",
   "eticheta": "Pasul 3",
   "text": "din fiecare combinație frecventă se scot regulile cu un item în dreapta; rămân cele cu confidence cel puțin egal cu pragul."
  },
  {
   "tip": "text",
   "text": "Pe datele noastre, la perechi Apriori numără doar 153 de combinații, în loc de toate cele 666 posibile din cei 37 de itemi."
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
   "text": "păstrăm doar regulile cu un item în dreapta și scoatem regulile care nu spun nimic nou: {qos=1} → dos are deja confidence 1, deci {qos=1, msgtype=PUBLISH} → dos este în plus. O regulă cu un item în plus rămâne doar dacă are confidence mai mare: la bruteforce, delta=Q4 crește confidence de la 0,9615 la 0,9619, deci rămân amândouă."
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
   "text": "support minim 0,05 (o combinație trebuie să apară în cel puțin 16.547 de pachete, adică un pachet din 20) și confidence minim 0,6 (regula are dreptate la majoritatea pachetelor)."
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "308 reguli, după scoaterea celor care nu spun nimic nou."
  },
  {
   "tip": "text",
   "eticheta": "Ce arată",
   "text": "în dreapta, dintre clase apar doar legitimate și dos. Celelalte atacuri au fiecare sub 5% din pachete, deci nicio combinație cu ele nu ajunge la support 0,05."
  },
  {
   "tip": "sectiune",
   "titlu": "11.4 Regulile pentru fiecare atac"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "la 11.3 atacurile mici nu apar; aici căutăm direct regulile care se termină cu un atac."
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
   "text": "confidence minim 0,5 (regula are dreptate în cel puțin jumătate din pachete) și support minim 150 de pachete, pentru că atacurile mici nu ajung la 5%."
  },
  {
   "tip": "text",
   "eticheta": "De ce 150 și nu 300",
   "text": "la 300, flood nu are nicio regulă, pentru că singurul grup care îl deosebește (tcp.len peste 1.460) are doar 293 de pachete."
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
   "tip": "text",
   "eticheta": "Cum se citește",
   "text": "liniile gri duc de la valori (stânga) la o regulă (cercul din mijloc), apoi la atac (dreapta). Un cerc mare înseamnă o regulă care apare des."
  },
  {
   "tip": "imagine",
   "src": "ar_scatter.png",
   "latime": 1800,
   "inaltime": 760
  },
  {
   "tip": "text",
   "eticheta": "Cum se citește",
   "text": "fiecare punct e o regulă: pe orizontală support (cât de des apare), pe verticală confidence (cât de des are dreptate). În stânga sunt toate cele 308 reguli, colorate după lift; în dreapta regulile pe atacuri, colorate după atac, cu support pe scară logaritmică."
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
   "text": "Lift-ul nu se compară între atacuri: la un atac rar poate fi mult mai mare (până la 540 la flood, față de 2,5 la dos). De aceea ordonăm după confidence."
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
   "text": "Regulile ajung la aceleași valori ca arborele din 10.4: qos=1 → dos este și prima lui împărțire, iar flagurile rare, singure sau împreună cu tipul mesajului, duc și acolo în frunze de atac (6, 7 și 8). Diferența: arborele spune doar „atac”, regulile spun și ce atac. Nici regulile nu recunosc pachetele care sunt doar ACK."
  },
  {
   "tip": "parte",
   "fel": "concluzie",
   "titlu": "Concluzia"
  },
  {
   "tip": "tabel",
   "antet": [
    "Ce voiam să aflăm",
    "Cum am aflat",
    "Rezultat"
   ],
   "randuri": [
    [
     "După ce valori recunoaștem fiecare atac?",
     "Apriori, regulile cu un atac în dreapta (11.4)",
     "Fiecare dintre cele 5 atacuri are cel puțin o regulă cu confidence de cel puțin 0,96."
    ]
   ]
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "dos: qos=1 sau dupflag=1. bruteforce: mesaje CONNECT cu conținut. malformed: flagurile FIN+PSH+ACK și RST. slowite: pachete cu conținut, dar fără mesaj MQTT. flood: tcp.len peste 1.460.",
    "Regulile ajung la aceleași valori ca arborele (11.5), dar spun și ce atac este, nu doar „atac”.",
    "Nici regulile nu recunosc confirmările ACK goale ale atacurilor."
   ]
  }
 ]
}

export default date
