import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "5. Statistică descriptivă",
 "blocuri": [
  {
   "tip": "text",
   "text": "Pentru fiecare variabilă din tabelul din capitolul 3, calculată pe tot fișierul (330.926 de rânduri). Reprezentarea depinde de tip: numericele sunt mediană [Q1, Q3] (Q1 = cuartila de 25%, Q3 = cea de 75%), pentru că distribuțiile nu sunt normale (vezi mai jos), variabilele binare sunt procentul de pachete cu valoare diferită de 0, variabila ordinală mqtt.qos este mediană [Q1, Q3] și procentul de valori 1, iar categoriile și variabilele cu text sau cod hex sunt cea mai frecventă valoare, cu procentul ei."
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
   "text": "1) tipul fiecărei variabile se stabilește după valorile ei: numerică (număr cu multe valori, la care au sens media și diferențele: tcp.len, tcp.time_delta, mqtt.len, mqtt.kalive), binară (doar două valori: 0 = lipsă și o valoare nenulă = prezent, de exemplu 1, sau 4 la mqtt.ver), ordinală (mqtt.qos, nivelurile 0, 1, 2 au ordine), categorială (coduri hex sau valori fără ordine), text, identificator și constantă (o singură valoare); 2) la numerice se verifică dacă distribuția este normală (tabelul de mai jos); 3) se calculează reprezentarea."
  },
  {
   "tip": "text",
   "eticheta": "Exemple",
   "text": "tcp.flags: 183.548 din 330.926 de pachete au 0x00000018, adică 183.548 / 330.926 = 55,46%. mqtt.dupflag: 18.707 pachete au valoarea 1, adică 5,65%. tcp.len: mediana 10, Q1 = 0, Q3 = 14 (calculul pozițiilor este în secțiunea 4)."
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "tabelul de mai jos, verificarea normalității și câte un grafic pe variabilă."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "12 variabile sunt constante (o singură valoare în tot setul), deci nu deosebesc nimic și nu intră în capitolele următoare. mqtt.msg și mqtt.msgid nu se analizează: sunt conținutul mesajului și un număr de ordine, nu măsurători."
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
     "0 (49,32%)"
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
   "tip": "text",
   "text": "Cum alegem reprezentarea la variabilele numerice: dacă distribuția e normală, folosim medie ± Std; dacă nu, mediană [Q1, Q3]. Normalitatea se verifică după forma distribuției, cu asimetria (skewness) și kurtosis: la o distribuție normală ambele sunt aproape de 0. Considerăm distribuția aproximativ normală dacă amândouă sunt între -1 și 1: este o regulă practică des folosită, la care forma rămâne apropiată de cea normală, iar media și Std descriu bine datele. Cele patru variabile numerice, pe tot setul:"
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
   "text": "Toate sunt departe de normal (cea mai apropiată, mqtt.len, are asimetrie 1,90 și kurtosis 2,8, deci tot în afara pragului), deci le reprezentăm prin mediană [Q1, Q3]."
  },
  {
   "tip": "text",
   "text": "Cum se calculează asimetria și kurtosis. Se pornește de la abaterea fiecărei valori față de medie, d = valoarea - media, și se calculează trei medii: m2 = media lui d la pătrat (varianța), m3 = media lui d la puterea a treia și m4 = media lui d la puterea a patra."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Asimetria = m3 / m2 la puterea 1,5. La puterea a treia semnul abaterii se păstrează: o coadă lungă spre valori mari dă asimetrie pozitivă, una spre valori mici dă asimetrie negativă. Aproape de 0 înseamnă simetrică.",
    "Kurtosis (în exces) = m4 / (m2 la pătrat) - 3. La puterea a patra semnul dispare, iar valorile departe de medie contează foarte mult, deci kurtosis măsoară cozile. Se scade 3 ca distribuția normală să aibă 0. Pozitiv mare înseamnă vârf ascuțit și multe valori extreme, negativ înseamnă vârf aplatizat sau mai multe vârfuri.",
    "Cifrele din tabel sunt calculate în Python (pandas, .skew() și .kurt()), care folosesc varianta corectată pentru eșantion. La 330.926 de rânduri diferența față de formulele de mai sus este neglijabilă."
   ]
  },
  {
   "tip": "text",
   "text": "Exemplu cu 5 valori (1, 2, 2, 3, 10): media este 3,6, m2 = 10,64, m3 = 47,23, m4 = 347,33. Asimetria simplă este 47,23 / 10,64 la puterea 1,5 = 1,36 (2,03 cu corecția de eșantion), iar kurtosis simplu este 347,33 / 10,64 la pătrat - 3 = 0,07 (4,27 cu corecția). Valoarea 10 trage coada spre dreapta, deci asimetria este pozitivă."
  },
  {
   "tip": "text",
   "eticheta": "Valori extreme (regula IQR)",
   "text": "o valoare este extremă dacă iese din [Q1 - 1,5 · IQR, Q3 + 1,5 · IQR], cu IQR = Q3 - Q1. tcp.len: peste 35, 61.133 de pachete (18,47%), 99% dos; mqtt.len: peste 27,5, 56.123 (16,96%), 97% dos; tcp.time_delta: peste 0,00042 secunde, 69.620 (21,04%), 64% trafic normal; mqtt.kalive: Q1 = Q3 = 0, deci orice valoare nenulă este extremă, 3.282 (0,99%), toate la atacuri."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "nu scoatem valorile extreme: sunt grupuri întregi de pachete (mesajele mari dos, pauzele traficului normal), nu erori de măsurare, și tocmai ele deosebesc clasele. De aceea folosim mediana și teste pe ranguri, care nu sunt trase de ele."
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
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.conack.flags.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.conack.val.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.conflag.cleansess.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.conflag.passwd.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.conflag.uname.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.conflags.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.dupflag.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.hdrflags.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.kalive.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.len.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.msgtype.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.proto_len.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.protoname.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.qos.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.retain.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_mqtt.ver.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_tcp.flags.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_tcp.len.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "desc_tcp.time_delta.png",
     "legenda": ""
    }
   ]
  }
 ]
}

export default date
