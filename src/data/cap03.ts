import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "3. Variabilele din dataset",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Ca să înțelegem rezultatele, trebuie să știm ce înseamnă fiecare coloană din date: ce parte a pachetului descrie și ce valori are."
  },
  {
   "tip": "text",
   "text": "Tabelul descrie fiecare dintre cele 34 de coloane (33 de variabile și ținta), grupate pe 7 grupe după ce descriu în protocol: TCP, antetul MQTT, conectare, răspunsul la conectare, mesajul „will\", abonare și conținutul mesajului."
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
   "text": "cele 34 de coloane și valorile lor din date."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "",
   "puncte": [
    "exemplul normal: cea mai frecventă valoare la pachetele legitimate, cu procentul ei;",
    "exemplul atac: la fiecare valoare se calculează ce procent din pachetele care o au sunt atacuri; se păstrează valorile cu cel puțin 99%, iar dintre ele cea mai frecventă, cu procentul din pachetele de atac care o au;",
    "dacă nu există o asemenea valoare, se arată cea mai frecventă valoare la atac;",
    "la mqtt.msg și mqtt.msgid (conținut și număr de ordine) se arată tot cea mai frecventă valoare;",
    "numărul din prima coloană a tabelului este poziția coloanei în dataset."
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "tabelul de mai jos: pentru fiecare coloană, ce înseamnă în protocol și ce valori are la normal și la atac."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizii",
   "text": "",
   "puncte": [
    "grupare după partea din protocol (nu după tipul variabilei), pentru că variabilele din același grup descriu același fel de pachet și apar împreună (în 7.1, cleansess, kalive, proto_len și ver din grupul de conectare au corelație 1 între ele);",
    "pragul de 99%, ca valoarea aleasă să apară aproape numai la atac."
   ]
  },
  {
   "tip": "parte",
   "fel": "demonstratie",
   "titlu": "Demonstrația"
  },
  {
   "tip": "tabel",
   "antet": [
    "#",
    "Variabilă",
    "Strat",
    "Categorie",
    "Descriere",
    "Exemplu normal",
    "Exemplu atac"
   ],
   "randuri": [
    [
     "1. TCP (rețea)"
    ],
    [
     "1",
     "tcp.flags",
     "TCP",
     "TCP Header",
     "Steagurile TCP ale pachetului, scrise în hex (de exemplu 0x18 = PSH+ACK, 0x10 = ACK, 0x02 = SYN, 0x04 = RST).",
     "0x00000018 (63,3%)",
     "0x00000011 (2,5% din atac)"
    ],
    [
     "2",
     "tcp.time_delta",
     "TCP",
     "Network Timing",
     "Timpul în secunde de la pachetul anterior din aceeași conexiune TCP.",
     "3e-06 (17,4%)",
     "1e-06 (19,4% din atac)"
    ],
    [
     "3",
     "tcp.len",
     "TCP",
     "TCP Payload",
     "Câți bytes de date are pachetul TCP (fără antet).",
     "13 (38,6%)",
     "1460 (14,3% din atac)"
    ],
    [
     "2. Antet MQTT (orice pachet)"
    ],
    [
     "17",
     "mqtt.hdrflags",
     "MQTT",
     "MQTT Header",
     "Primul octet al antetului MQTT, în hex: tipul mesajului plus flagurile DUP, QoS și RETAIN.",
     "0x00000030 (61,6%)",
     "0x00000040 (23,5% din atac)"
    ],
    [
     "22",
     "mqtt.msgtype",
     "MQTT",
     "Packet Type",
     "Tipul pachetului MQTT (1 = CONNECT, 2 = CONNACK, 3 = PUBLISH, 4 = PUBACK, 5 = PUBREC, 8 = SUBSCRIBE, 9 = SUBACK, 12 = PINGREQ, 13 = PINGRESP, 14 = DISCONNECT).",
     "3 (61,6%)",
     "4 (23,5% din atac)"
    ],
    [
     "16",
     "mqtt.dupflag",
     "MQTT",
     "MQTT Header",
     "Flag: pachetul este o retrimitere a unui pachet anterior (duplicat).",
     "0 (100,0%)",
     "1 (11,3% din atac)"
    ],
    [
     "25",
     "mqtt.qos",
     "MQTT",
     "Quality of Service",
     "Nivelul de garanție la livrare (0, 1 sau 2). În date apar doar 0 și 1.",
     "0 (100,0%)",
     "1 (32,9% din atac)"
    ],
    [
     "26",
     "mqtt.retain",
     "MQTT",
     "Message State",
     "Flag: brokerul păstrează ultimul mesaj de pe acel topic.",
     "0 (100,0%)",
     "1 (0,1% din atac)"
    ],
    [
     "19",
     "mqtt.len",
     "MQTT",
     "MQTT Payload",
     "Lungimea restului mesajului MQTT, în bytes.",
     "11 (38,6%)",
     "2 (25,5% din atac)"
    ],
    [
     "3. Conectare (cererea clientului)"
    ],
    [
     "15",
     "mqtt.conflags",
     "MQTT",
     "MQTT Protocol",
     "Octetul întreg de flaguri din CONNECT (cleansess, passwd, uname, will...).",
     "0 (100,0%)",
     "0x00000002 (1,1% din atac)"
    ],
    [
     "8",
     "mqtt.conflag.cleansess",
     "MQTT",
     "MQTT Protocol",
     "Flagul „clean session” din cererea de conectare (CONNECT).",
     "0 (100,0%)",
     "1 (2,0% din atac)"
    ],
    [
     "9",
     "mqtt.conflag.passwd",
     "MQTT",
     "MQTT Protocol",
     "Flag: cererea de conectare conține parolă.",
     "0 (100,0%)",
     "1 (0,9% din atac)"
    ],
    [
     "13",
     "mqtt.conflag.uname",
     "MQTT",
     "MQTT Protocol",
     "Flag: cererea de conectare conține nume de utilizator.",
     "0 (100,0%)",
     "1 (0,9% din atac)"
    ],
    [
     "11",
     "mqtt.conflag.reserved",
     "MQTT",
     "MQTT Protocol",
     "Bitul rezervat din CONNECT.",
     "0 (100,0%)",
     "0 (100,0%)"
    ],
    [
     "18",
     "mqtt.kalive",
     "MQTT",
     "MQTT Config",
     "Keep alive: câte secunde așteaptă brokerul un semn de la client înainte să închidă conexiunea.",
     "0 (100,0%)",
     "60 (1,3% din atac)"
    ],
    [
     "24",
     "mqtt.protoname",
     "MQTT",
     "Protocol Meta",
     "Numele protocolului din cererea de conectare („MQTT”).",
     "0 (100,0%)",
     "MQTT (2,0% din atac)"
    ],
    [
     "23",
     "mqtt.proto_len",
     "MQTT",
     "Protocol Meta",
     "Lungimea numelui protocolului (4 pentru „MQTT”).",
     "0 (100,0%)",
     "4 (2,0% din atac)"
    ],
    [
     "29",
     "mqtt.ver",
     "MQTT",
     "Protocol Meta",
     "Versiunea protocolului MQTT (4 = 3.1.1).",
     "0 (100,0%)",
     "4 (2,0% din atac)"
    ],
    [
     "4. Răspuns la conectare"
    ],
    [
     "4",
     "mqtt.conack.flags",
     "MQTT",
     "MQTT Protocol",
     "Octetul de flaguri din CONNACK, răspunsul brokerului la o cerere de conectare.",
     "0 (100,0%)",
     "0x00000000 (2,0% din atac)"
    ],
    [
     "5",
     "mqtt.conack.flags.reserved",
     "MQTT",
     "MQTT Protocol",
     "Biții rezervați din CONNACK.",
     "0 (100,0%)",
     "0 (100,0%)"
    ],
    [
     "6",
     "mqtt.conack.flags.sp",
     "MQTT",
     "MQTT Protocol",
     "Flagul „session present” din CONNACK.",
     "0 (100,0%)",
     "0 (100,0%)"
    ],
    [
     "7",
     "mqtt.conack.val",
     "MQTT",
     "MQTT Protocol",
     "Codul de răspuns al brokerului la conectare (0 = acceptat, 5 = refuzat, neautorizat).",
     "0 (100,0%)",
     "5 (0,9% din atac)"
    ],
    [
     "5. Mesaj „will\" (testament)"
    ],
    [
     "14",
     "mqtt.conflag.willflag",
     "MQTT",
     "MQTT Protocol",
     "Flag: clientul definește un mesaj „will”.",
     "0 (100,0%)",
     "0 (100,0%)"
    ],
    [
     "10",
     "mqtt.conflag.qos",
     "MQTT",
     "MQTT Protocol",
     "Nivelul QoS al mesajului „will” din CONNECT.",
     "0 (100,0%)",
     "0 (100,0%)"
    ],
    [
     "12",
     "mqtt.conflag.retain",
     "MQTT",
     "MQTT Protocol",
     "Flag: mesajul „will” este păstrat de broker.",
     "0 (100,0%)",
     "0 (100,0%)"
    ],
    [
     "30",
     "mqtt.willmsg",
     "MQTT",
     "Last Will",
     "Mesajul „will” (testamentul clientului).",
     "0 (100,0%)",
     "0 (100,0%)"
    ],
    [
     "31",
     "mqtt.willmsg_len",
     "MQTT",
     "Last Will",
     "Lungimea mesajului „will”.",
     "0 (100,0%)",
     "0 (100,0%)"
    ],
    [
     "32",
     "mqtt.willtopic",
     "MQTT",
     "Last Will",
     "Topicul pe care se trimite mesajul „will”.",
     "0 (100,0%)",
     "0 (100,0%)"
    ],
    [
     "33",
     "mqtt.willtopic_len",
     "MQTT",
     "Last Will",
     "Lungimea topicului „will”.",
     "0 (100,0%)",
     "0 (100,0%)"
    ],
    [
     "6. Abonare"
    ],
    [
     "27",
     "mqtt.sub.qos",
     "MQTT",
     "MQTT Subscription",
     "QoS cerut de client la abonare (SUBSCRIBE).",
     "0 (100,0%)",
     "0 (100,0%)"
    ],
    [
     "28",
     "mqtt.suback.qos",
     "MQTT",
     "MQTT Subscription",
     "QoS acordat de broker la abonare (SUBACK).",
     "0 (100,0%)",
     "0 (100,0%)"
    ],
    [
     "7. Conținut mesaj"
    ],
    [
     "20",
     "mqtt.msg",
     "MQTT",
     "Payload Data",
     "Conținutul mesajului publicat (textul trimis de senzor).",
     "0 (38,4%)",
     "0 (60,3%); 0.0 (5,6%, doar la slowite)"
    ],
    [
     "21",
     "mqtt.msgid",
     "MQTT",
     "Identifier",
     "Identificatorul mesajului (număr de ordine).",
     "0 (100,0%)",
     "0 (43,5%)"
    ],
    [
     "Ținta"
    ],
    [
     "34",
     "target",
     "Țintă",
     "Classification",
     "Tipul de trafic: legitimate, dos, bruteforce, malformed, slowite sau flood.",
     "legitimate",
     "dos, bruteforce, malformed, slowite, flood"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "Sursa descrierilor: specificația MQTT 3.1.1 și numele câmpurilor din Wireshark, nu documentația datasetului, care nu le explică."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Categoriile (coloana a patra) spun ce rol are câmpul în protocol (antet TCP, antet MQTT, timp și așa mai departe).",
    "La mqtt.msgtype, valoarea 0 (la 36,7% din pachetele normale și la 38,2% din atacuri) nu e o definiție din date, ci o presupunere (pachete fără mesaj MQTT). Presupunerea se sprijină pe date: la toate pachetele cu mqtt.msgtype = 0, mqtt.hdrflags și mqtt.len sunt și ele 0.",
    "În general, 0 la un câmp MQTT înseamnă că pachetul nu are acel câmp: mqtt.conack.flags este 0x00000000 exact la cele 3.282 de pachete CONNACK și 0 la toate celelalte, iar mqtt.protoname este MQTT exact la cele 3.282 de pachete CONNECT și 0 în rest.",
    "Deci „0” și „0x00000000” nu înseamnă același lucru: primul este câmp lipsă, al doilea un CONNACK cu toate flagurile 0."
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
    "Cele 34 de coloane descriu 7 părți ale pachetului: TCP, antetul MQTT, conectarea, răspunsul la conectare, mesajul „will”, abonarea și conținutul mesajului.",
    "Valoarea 0 la un câmp MQTT înseamnă de obicei că pachetul nu are acel câmp. De exemplu, mqtt.protoname este MQTT doar la cele 3.282 de pachete CONNECT și 0 în rest.",
    "Unele valori apar aproape numai la atac (coloana „Exemplu atac”). Ele sunt primii candidați pentru recunoașterea atacurilor în capitolele următoare."
   ]
  }
 ]
}

export default date
