import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "5. Statistică descriptivă",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Înainte să comparăm atacurile cu traficul normal, ne uităm la fiecare variabilă pe tot setul: ce tip are, ce valori ia și dacă are valori ieșite din tipar. De aici alegem cum descriem datele și ce teste folosim în capitolul 6."
  },
  {
   "tip": "parte",
   "fel": "ipoteza",
   "titlu": "Scopul"
  },
  {
   "tip": "text",
   "text": "Aici nu testăm o ipoteză. Vrem să aflăm:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "ce variabile sunt constante (nu ajută la nimic);",
    "dacă variabilele numerice au distribuție normală (de asta depind media și testele pe care le folosim);",
    "dacă există valori extreme."
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
   "text": "toate cele 330.926 de pachete, fără împărțire pe clase."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "",
   "puncte": [
    "5.1 tipul fiecărei variabile și variabilele constante;",
    "5.2 forma distribuției la variabilele numerice (asimetrie și kurtosis);",
    "5.3 cum descriem fiecare variabilă: medie sau mediană;",
    "5.4 valorile extreme (regula IQR)."
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "tabelul cu tipul și valoarea tipică a fiecărei variabile, verificarea formei și câte un grafic pe variabilă."
  },
  {
   "tip": "parte",
   "fel": "demonstratie",
   "titlu": "Demonstrația"
  },
  {
   "tip": "sectiune",
   "titlu": "5.1 Tipul fiecărei variabile"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "tipul decide ce putem calcula: o medie are sens pentru o lungime în bytes, nu pentru un cod hex."
  },
  {
   "tip": "text",
   "eticheta": "Tipurile",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "numerică: un număr măsurat (bytes sau secunde), la care au sens media și diferențele: tcp.len, tcp.time_delta, mqtt.len, mqtt.kalive (are doar 7 valori distincte, dar este tot un timp în secunde);",
    "binară: două valori, 0 = lipsă și o valoare nenulă = prezent (de exemplu 1, sau 4 la mqtt.ver); la mqtt.conack.val, 0 cuprinde și conectările acceptate;",
    "ordinală: mqtt.qos, ale cărui niveluri 0, 1, 2 au ordine;",
    "categorială: coduri hex sau valori fără ordine;",
    "text, identificator și constantă (o singură valoare)."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
   "text": "o coloană cu valorile 0, 0, 0, 0 este constantă: toate pachetele arată la fel, deci ea nu poate deosebi un atac de un pachet normal."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "tipul și valoarea tipică a fiecărei variabile (cum se alege valoarea tipică: 5.3):"
  },
  {
   "tip": "tabel",
   "antet": [
    "Variabilă",
    "Tip",
    "Reprezentare"
   ],
   "randuri": [
    [
     "1. TCP (rețea)"
    ],
    [
     "tcp.flags",
     "categorială",
     "0x00000018 (55,46%)"
    ],
    [
     "tcp.time_delta",
     "numerică",
     "2,60e-05 [3,00e-06, 1,70e-04]"
    ],
    [
     "tcp.len",
     "numerică",
     "10 [0, 14]"
    ],
    [
     "2. Antet MQTT (orice pachet)"
    ],
    [
     "mqtt.hdrflags",
     "categorială",
     "0 (37,46%)"
    ],
    [
     "mqtt.msgtype",
     "categorială",
     "3 (47,90%)"
    ],
    [
     "mqtt.dupflag",
     "binară",
     "5,65% cu valoare ≠ 0"
    ],
    [
     "mqtt.qos",
     "ordinală",
     "0 [0, 0]; 16,45% au 1"
    ],
    [
     "mqtt.retain",
     "binară",
     "0,04% cu valoare ≠ 0"
    ],
    [
     "mqtt.len",
     "numerică",
     "2 [0, 11]"
    ],
    [
     "3. Conectare (cererea clientului)"
    ],
    [
     "mqtt.conflags",
     "categorială",
     "0 (99,01%)"
    ],
    [
     "mqtt.conflag.cleansess",
     "binară",
     "0,99% cu valoare ≠ 0"
    ],
    [
     "mqtt.conflag.passwd",
     "binară",
     "0,43% cu valoare ≠ 0"
    ],
    [
     "mqtt.conflag.uname",
     "binară",
     "0,43% cu valoare ≠ 0"
    ],
    [
     "mqtt.conflag.reserved",
     "constantă",
     "0 în toate rândurile"
    ],
    [
     "mqtt.kalive",
     "numerică",
     "0 [0, 0]"
    ],
    [
     "mqtt.protoname",
     "categorială",
     "0 (99,01%)"
    ],
    [
     "mqtt.proto_len",
     "binară",
     "0,99% cu valoare ≠ 0"
    ],
    [
     "mqtt.ver",
     "binară",
     "0,99% cu valoare ≠ 0"
    ],
    [
     "4. Răspuns la conectare"
    ],
    [
     "mqtt.conack.flags",
     "categorială",
     "0 (99,01%)"
    ],
    [
     "mqtt.conack.flags.reserved",
     "constantă",
     "0 în toate rândurile"
    ],
    [
     "mqtt.conack.flags.sp",
     "constantă",
     "0 în toate rândurile"
    ],
    [
     "mqtt.conack.val",
     "binară",
     "0,43% cu valoare ≠ 0"
    ],
    [
     "5. Mesaj „will\" (testament)"
    ],
    [
     "mqtt.conflag.willflag",
     "constantă",
     "0 în toate rândurile"
    ],
    [
     "mqtt.conflag.qos",
     "constantă",
     "0 în toate rândurile"
    ],
    [
     "mqtt.conflag.retain",
     "constantă",
     "0 în toate rândurile"
    ],
    [
     "mqtt.willmsg",
     "constantă",
     "0 în toate rândurile"
    ],
    [
     "mqtt.willmsg_len",
     "constantă",
     "0 în toate rândurile"
    ],
    [
     "mqtt.willtopic",
     "constantă",
     "0 în toate rândurile"
    ],
    [
     "mqtt.willtopic_len",
     "constantă",
     "0 în toate rândurile"
    ],
    [
     "6. Abonare"
    ],
    [
     "mqtt.sub.qos",
     "constantă",
     "0 în toate rândurile"
    ],
    [
     "mqtt.suback.qos",
     "constantă",
     "0 în toate rândurile"
    ],
    [
     "7. Conținut mesaj"
    ],
    [
     "mqtt.msg",
     "text",
     "0 (49,32%); „0.0” separat, doar la slowite (2,78%)"
    ],
    [
     "mqtt.msgid",
     "identificator",
     "nu se raportează (doar număr de ordine)"
    ],
    [
     "Ținta"
    ],
    [
     "target",
     "categorială (ținta)",
     "legitimate (50,00%)"
    ]
   ]
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "12 variabile sunt constante (o singură valoare în tot setul), deci nu deosebesc nimic și nu intră în capitolele următoare. mqtt.msg și mqtt.msgid nu se analizează: sunt conținutul mesajului și un număr de ordine, nu măsurători."
  },
  {
   "tip": "sectiune",
   "titlu": "5.2 Forma distribuției: asimetrie și kurtosis"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "media descrie bine datele doar dacă au formă de clopot: cele mai multe valori la mijloc, tot mai puține spre capete, la fel de multe în stânga și în dreapta. Tot de forma asta depind testele pe care le putem folosi."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează",
   "text": "se pornește de la abaterea fiecărei valori față de medie, d = valoarea - media, și se calculează trei medii: m2 = media lui d la pătrat (varianța), m3 = media lui d la puterea a treia și m4 = media lui d la puterea a patra."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "asimetria = m3 / m2 la puterea 1,5. La puterea a treia semnul abaterii se păstrează: o coadă lungă spre valori mari dă asimetrie pozitivă, una spre valori mici dă asimetrie negativă. Aproape de 0 înseamnă simetrică;",
    "kurtosis (în exces) = m4 / (m2 la pătrat) - 3. La puterea a patra semnul dispare, iar valorile departe de medie contează foarte mult, deci kurtosis măsoară cozile. Se scade 3 ca distribuția normală să aibă 0. Pozitiv mare înseamnă vârf ascuțit și multe valori extreme, negativ înseamnă vârf aplatizat sau mai multe vârfuri;",
    "regula: distribuția este aproximativ normală dacă amândouă sunt între -1 și 1 (o regulă practică des folosită)."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
   "text": "valorile 1, 2, 2, 3, 10: media este 3,6, m2 = 10,64, m3 = 47,23, m4 = 347,33. Asimetria simplă este 47,23 / 10,64 la puterea 1,5 = 1,36 (2,03 cu corecția de eșantion), iar kurtosis simplu este 347,33 / 10,64 la pătrat - 3 = 0,07 (4,27 cu corecția). Valoarea 10 trage coada spre dreapta, deci asimetria este pozitivă."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "cele patru variabile numerice, pe tot setul. Cifrele sunt calculate în Python (pandas, .skew() și .kurt()), cu varianta corectată pentru eșantion (o formulă ajustată ca să nu subestimeze pe date puține); la 330.926 de rânduri diferența față de formulele de mai sus este neglijabilă."
  },
  {
   "tip": "tabel",
   "antet": [
    "Variabilă",
    "Asimetrie",
    "Kurtosis",
    "Concluzie"
   ],
   "randuri": [
    [
     "tcp.time_delta",
     "20,67",
     "432,8",
     "nu e normală"
    ],
    [
     "tcp.len",
     "28,06",
     "937,1",
     "nu e normală"
    ],
    [
     "mqtt.kalive",
     "17,96",
     "320,7",
     "nu e normală"
    ],
    [
     "mqtt.len",
     "1,90",
     "2,8",
     "nu e normală"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "Graficele de mai jos sunt câte unul pe variabilă: histogramă la numerice, procente la categorii. Nu există grafic pentru cele 12 constante (o singură bară) și pentru mqtt.msg și mqtt.msgid (text și identificator)."
  },
  {
   "tip": "galerie",
   "imagini": [
    {
     "tip": "imagine",
     "src": "desc_target.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.conack.flags.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.conack.val.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.conflag.cleansess.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.conflag.passwd.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.conflag.uname.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.conflags.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.dupflag.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.hdrflags.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.kalive.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.len.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.msgtype.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.proto_len.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.protoname.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.qos.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.retain.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.ver.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_tcp.flags.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_tcp.len.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_tcp.time_delta.png",
     "latime": 600,
     "inaltime": 420,
     "legenda": ""
    }
   ]
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "toate sunt departe de normal (cea mai apropiată, mqtt.len, are asimetrie 1,90 și kurtosis 2,8, deci tot în afara pragului). Media nu le descrie bine (5.3)."
  },
  {
   "tip": "sectiune",
   "titlu": "5.3 Medie sau mediană"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "când datele nu au formă de clopot, câteva valori foarte mari trag media departe de pachetul tipic."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează",
   "text": "mediana este valoarea din mijloc după ce valorile se pun în ordine; Q1 este valoarea sub care stau 25% din pachete, iar Q3 cea sub care stau 75%. Valoarea tipică, după tip:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "numerice: mediană [Q1, Q3];",
    "binare: procentul de valori diferite de 0;",
    "mqtt.qos: mediană [Q1, Q3] și procentul de valori 1;",
    "categorii, text și cod hex: valoarea cea mai frecventă, cu procentul ei."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
   "text": "valorile 2, 3, 3, 4, 100: media este 112 / 5 = 22,4, deși 4 din cele 5 valori sunt cel mult 4; mediana este 3, iar Q1 = 3 și Q3 = 4."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "tcp.flags: 183.548 din 330.926 de pachete au 0x00000018, adică 183.548 / 330.926 = 55,46%;",
    "mqtt.dupflag: 18.707 pachete au valoarea 1, adică 5,65%;",
    "tcp.len: mediana 10, Q1 = 0, Q3 = 14 (calculul pozițiilor este în secțiunea 4)."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "la variabilele numerice folosim mediana [Q1, Q3], iar în capitolul 6 teste pe ranguri, care nu sunt trase de valorile foarte mari."
  },
  {
   "tip": "sectiune",
   "titlu": "5.4 Valori extreme (regula IQR)"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "vrem să știm dacă valorile ieșite din tipar sunt greșeli de măsurare, care s-ar scoate, sau grupuri reale de pachete."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează",
   "text": "IQR = Q3 - Q1; o valoare este extremă dacă iese din [Q1 - 1,5 · IQR, Q3 + 1,5 · IQR]."
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
   "text": "valorile 2, 3, 3, 4, 100: Q1 = 3, Q3 = 4, IQR = 1, limita de sus este 4 + 1,5 · 1 = 5,5, deci 100 este extremă."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "tcp.len: peste 35 (Q1 = 0, Q3 = 14, IQR = 14, deci 14 + 1,5 · 14 = 35); 61.133 de pachete (18,47%), 99% dos;",
    "mqtt.len: peste 27,5; 56.123 (16,96%), 97% dos;",
    "tcp.time_delta: peste 0,00042 secunde; 69.620 (21,04%), 64% trafic normal;",
    "mqtt.kalive: Q1 = Q3 = 0, deci orice valoare nenulă este extremă; 3.282 (0,99%), toate la atacuri."
   ]
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "nu scoatem valorile extreme: sunt grupuri întregi de pachete (mesajele mari dos, pauzele traficului normal), nu erori de măsurare, și tocmai ele deosebesc clasele. De aceea folosim mediana și teste pe ranguri, care nu sunt trase de ele."
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
    "12 variabile sunt constante și 2 nu sunt măsurători (mqtt.msg, mqtt.msgid), deci rămân 19 variabile pentru capitolele următoare (5.1).",
    "Nicio variabilă numerică nu are distribuție normală, deci folosim mediana [Q1, Q3] și teste pe ranguri, care înlocuiesc valorile cu locul lor în ordine crescătoare (5.2, 5.3, capitolul 6).",
    "Valorile extreme nu sunt erori: tcp.len mare apare aproape numai la dos (99%), iar pauzele lungi (tcp.time_delta mare) mai ales la traficul normal (64%). Le păstrăm, pentru că tocmai ele deosebesc clasele (5.4)."
   ]
  }
 ]
}

export default date
