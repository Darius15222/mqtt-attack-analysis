import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "6. Statistică pe categorii",
 "blocuri": [
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
   "text": "1) pentru fiecare clasă se iau doar pachetele ei; 2) pentru fiecare variabilă se calculează valoarea din celulă, după tip (mai jos); 3) se face un test pe toate cele 6 clase: Kruskal-Wallis la numerice și mqtt.qos, χ² la categorii și binare; 4) se face Mann-Whitney între fiecare atac și normal. Formulele și câte un exemplu numeric sunt în secțiunea 4."
  },
  {
   "tip": "text",
   "eticheta": "Exemplu de celulă",
   "text": "tcp.len la legitimate: se sortează cele 165.463 de valori; mediana este valoarea de la poziția (165.463 + 1) / 2 = 82.732, adică 12; Q1 (poziția 41.366,5) este 0, iar Q3 (poziția 124.097,5) este 13. În tabel apare 12 [0, 13]."
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
   "text": "mediană și nu medie, pentru că la fiecare clasă asimetria sau kurtosis ies din intervalul -1 până la 1 (distribuții nenormale: unele au valori extreme care trag media, altele au două grupuri de valori; de exemplu, tcp.len la normal este 0 la 36,7% din pachete și între 10 și 14 la 61%, iar media 7,8 cade între grupuri, unde aproape nu există pachete). Kruskal-Wallis și nu ANOVA, din același motiv. χ² la categorii, pentru că acolo se compară frecvențe, nu valori. 6 clase și nu 2 (normal și atac), pentru că atacurile diferă mult între ele. Prag α = 0,05, pragul uzual."
  },
  {
   "tip": "text",
   "text": "Aceleași variabile ca la punctul 5, calculate separat pentru traficul normal (legitimate) și pentru fiecare dintre cele 5 atacuri (dos, bruteforce, malformed, slowite, flood). Reprezentarea e aceeași: mediană [Q1, Q3] la numerice (la niciuna dintre clase nu sunt normale: asimetria sau kurtosis ies din intervalul -1 până la 1, în afară de cazurile în care variabila e constantă), procentul de valori diferite de 0 la binare, mediană [Q1, Q3] la mqtt.qos și cea mai frecventă valoare, cu procentul ei, la categorii și cod hex."
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
   "text": "Ultima coloană a tabelului este valoarea p a testului față de cele 6 clase: KW = Kruskal-Wallis (numerice și mqtt.qos), χ² = chi-pătrat (restul). H0: variabila arată la fel în toate clasele. Pragul este α = 0,05. *** înseamnă p sub 0,001."
  },
  {
   "tip": "text",
   "text": "Nu apar în tabel grupele „Mesaj will\" și „Abonare\" (toate variabilele lor sunt constante), cele 3 constante din celelalte grupe (conflag.reserved, conack.flags.reserved, conack.flags.sp) și mqtt.msg, mqtt.msgid (conținutul mesajului și un număr de ordine)."
  },
  {
   "tip": "text",
   "text": "Ce se observă: mqtt.qos este 0 la toate clasele, în afară de dos (41,8% au 1). mqtt.kalive are mediana 0 la toate clasele, dar la slowite 11,04% dintre pachete au valoarea 65.535. tcp.len are Q3 de 13 la normal, 116 la dos și 32.759 la flood. Câmpurile de conectare sunt nenule mai ales la bruteforce, malformed și slowite (7 până la 11%; la dos și flood sub 0,2%). Aceste diferențe se pierd dacă punem toate atacurile într-un singur grup."
  },
  {
   "tip": "text",
   "text": "Toate cele 19 variabile testate au p sub 0,001 (***), deci diferă între clase. Cu 330.926 de rânduri, p mic poate apărea și la diferențe mici, deci p singur nu spune cât de mare e diferența: aceasta se citește în tabelul pe clase de mai sus. Pachetele aceleiași conexiuni nu sunt independente, deci p este prea optimist."
  },
  {
   "tip": "text",
   "text": "Atac față de normal, la variabilele numerice și mqtt.qos (Mann-Whitney, p necorectat): toate comparațiile ies cu *** (p sub 0,001), cu două excepții. La tcp.time_delta, flood față de normal are doar * (p = 0,042). La mqtt.qos, comparațiile cu bruteforce, malformed, slowite și flood nu se pot calcula, pentru că valorile sunt 0 și la normal, și la atac. Stelele din grafice arată aceste comparații (atac față de normal)."
  },
  {
   "tip": "text",
   "text": "Graficele de mai jos, câte unul pe variabilă, compară cele 6 clase: boxplot cu stelele atac față de normal la numerice, procente pe clasă la categorii. La mqtt.qos și mqtt.kalive sunt tot procente pe clasă, cu stele, pentru că au doar câteva valori (0 și 1, respectiv 0, 60 și 65.535, plus 1, 2, 3 și 234 la câte 41 de pachete malformed), pe care o cutie nu le-ar arăta. La tcp.time_delta axa este logaritmică, iar valorile 0 sunt desenate la 1e-06 s (cea mai mică valoare nenulă), pentru că logaritmul lui 0 nu există."
  },
  {
   "tip": "galerie",
   "imagini": [
    {
     "tip": "imagine",
     "src": "test_tcp.flags.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_tcp.time_delta.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_tcp.len.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.hdrflags.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.msgtype.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.dupflag.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.qos.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.retain.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.len.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.conflags.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.conflag.cleansess.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.conflag.passwd.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.conflag.uname.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.kalive.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.protoname.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.proto_len.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.ver.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.conack.flags.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "test_mqtt.conack.val.png",
     "legenda": ""
    }
   ]
  },
  {
   "tip": "sectiune",
   "titlu": "6.1 Exemplu complet: tcp.flags și testul χ²"
  },
  {
   "tip": "text",
   "text": "În tabelul de mai sus, la variabilele categorice apare doar valoarea cea mai frecventă din fiecare clasă, cu procentul ei, deci procentele de pe o coloană nu dau 100%. De exemplu, la legitimate 0x00000018 are 63,31%, iar restul de 36,69% este 0x00000010. Mai jos este distribuția completă a lui tcp.flags și calculul testului χ², pas cu pas. Aceeași metodă s-a aplicat la toate variabilele categorice și binare din tabel."
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
   "src": "tcpflags_100.png"
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
   "text": "grade de libertate: df = (8 - 1) · (6 - 1) = 35. Pentru χ² = 196.049 cu 35 de grade de libertate, p este practic 0 (sub 0,001), deci respingem H0: distribuția lui tcp.flags diferă între clase."
  },
  {
   "tip": "text",
   "eticheta": "Codul (Python)",
   "text": "aceiași pași, cu bibliotecile pandas și scipy:"
  },
  {
   "tip": "cod",
   "text": "import pandas as pd\nfrom scipy.stats import chi2_contingency\nd = pd.read_csv(\"mqttdataset_reduced.csv\")\nO = pd.crosstab(d[\"tcp.flags\"], d[\"target\"])   # pasul 1\nprocente = O / O.sum() * 100                    # pasul 2\nchi2, p, df, E = chi2_contingency(O)            # pașii 3, 4 și 5\nprint(round(chi2), df, p)                       # 196049 35 0.0"
  },
  {
   "tip": "text",
   "eticheta": "Ce arată",
   "text": "traficul normal are doar 0x00000010 (ACK) și 0x00000018 (PSH și ACK), adică pachete de confirmare și de date. Celelalte valori apar doar la atacuri: SYN și SYN+ACK la bruteforce, malformed și slowite (conexiuni noi), FIN+ACK mai ales la bruteforce (22,43%), iar RST (0x00000004), FIN+PSH+ACK și RST+ACK aproape numai la malformed."
  }
 ]
}

export default date
