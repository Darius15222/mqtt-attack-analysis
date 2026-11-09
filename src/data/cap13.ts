import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "13. Concluzie: ce variabile indică fiecare atac",
 "blocuri": [
  {
   "tip": "text",
   "text": "Tabelul pune cap la cap rezultatele din secțiunile 5 și 6. Toate cele 19 variabile testate diferă semnificativ între clase (p sub 0,001), dar aici sunt cele la care atacul se vede cel mai clar față de traficul normal. Pentru variabilele categorice am luat valoarea la care procentul din atac depășește cel mai mult procentul din normal, iar pentru cele numerice am comparat medianele și cuartila Q3. Interpretarea din coloana a treia este a noastră."
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "procentele fiecărei valori pe clase și medianele cu Q3 din capitolul 6."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "la variabilele categorice, pentru fiecare valoare se scade procentul de la normal din procentul de la atac și se păstrează valorile cu diferența cea mai mare. Exemplu: la bruteforce, tcp.flags = 0x00000011 apare la 22,4% din pachete, iar la normal la 0%, deci diferența este 22,4 puncte procentuale. La numerice se compară mediana și Q3 cu cele de la normal."
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "pentru fiecare atac, variabilele care îl deosebesc de traficul normal (tabelul de mai jos)."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "diferența de procent (atac minus normal) arată direct ce valoare apare la atac și lipsește la normal, deci ce poate semnala atacul; la numerice, mediana și Q3 arată unde stau valorile tipice, fără să fie trase de valorile extreme."
  },
  {
   "tip": "tabel",
   "antet": [
    "Atac",
    "Variabile care îl indică (atac față de normal)",
    "Ce înseamnă"
   ],
   "randuri": [
    [
     "dos",
     "mqtt.msgtype = 4 (confirmare de publicare) la 29,8% din pachete, față de 0% la normal; mqtt.hdrflags = 0x00000040, în aceleași pachete; mqtt.dupflag = 1 la 14,4%, față de 0%; mqtt.len și tcp.len mari (Q3 = 168 și 116, față de 11 și 13 la normal); tcp.time_delta foarte mic (mediana 3e-06 față de 7,6e-05).",
     "Pachete foarte dese, cu mesaje lungi și confirmări de publicare, care la normal lipsesc."
    ],
    [
     "bruteforce",
     "mqtt.msgtype = 0 (fără strat MQTT, conform presupunerii din secțiunea 3) la 79,9%, față de 36,7%; tcp.flags = 0x00000011 (FIN și ACK) la 22,4%, față de 0%; mqtt.ver = 4 la 9,9%, față de 0%; tcp.len și mqtt.len cu Q3 = 0.",
     "Pachete fără conținut, multe doar de conectare și de închidere a conexiunii."
    ],
    [
     "malformed",
     "mqtt.msgtype = 0 la 66,5%, față de 36,7%; tcp.flags = 0x00000004 (RST) la 14,5%, față de 0%; mqtt.ver = 4 la 7,5%, față de 0%; mqtt.len mic (Q3 = 3).",
     "Conexiuni întrerupte brusc (RST) și pachete scurte."
    ],
    [
     "slowite",
     "mqtt.msgtype = 0 la 77,9%, față de 36,7%; tcp.flags = 0x00000002 (SYN) la 11,1%, față de 0%; mqtt.ver = 4 la 11,0%, față de 0%; mqtt.len = 0 (Q3 = 0); mqtt.kalive = 65.535 la 11,0%, față de 0% (valoarea maximă: clientul cere brokerului să-i țină conexiunea deschisă 18 ore fără niciun mesaj).",
     "Multe cereri de conectare (SYN) fără date, cu keep alive maxim: conexiuni ținute deschise cât mai mult, ca brokerul să rămână fără conexiuni libere."
    ],
    [
     "flood",
     "tcp.len cu Q3 = 32.759, față de 13 la normal (pachete foarte mari); tcp.time_delta mic (mediana 1,7e-05 față de 7,6e-05); mqtt.msgtype = 0 la 50,6%, față de 36,7%.",
     "Pachete mari, trimise rapid. Sunt doar 613, deci concluzia e mai puțin sigură."
    ]
   ]
  },
  {
   "tip": "text",
   "text": "Variabilele mqtt.msgtype și mqtt.hdrflags indică aceleași pachete, deci contează ca o singură informație. Bruteforce, malformed și slowite seamănă între ele (pachete fără conținut, cu mqtt.msgtype = 0) și se deosebesc mai ales prin tcp.flags: FIN și ACK, RST și respectiv SYN. Slowite se mai vede și prin mqtt.kalive = 65.535, valoare pe care nu o are niciun alt tip de trafic. Dos și flood se văd din dimensiunea pachetelor (tcp.len, mqtt.len) și din tcp.time_delta mic. Ele se deosebesc între ele prin mqtt.msgtype = 4 și mqtt.dupflag = 1, prezente la dos și absente la flood."
  },
  {
   "tip": "text",
   "text": "Regresia liniară (secțiunea 8) confirmă diferența dintre normal și atacuri. La traficul normal, mqtt.len urmează tcp.len aproape perfect (R² = 0,997), iar la atacuri relația se rupe (R² între 0,002 și 0,762, cu pante diferite). Pe tot setul, o singură dreaptă nu e potrivită (R² = 0,075, după logaritm 0,843). Timpul dintre pachete nu se poate prezice din dimensiunea lor (R² = 0,0014)."
  },
  {
   "tip": "text",
   "text": "Regresia logistică (secțiunea 9) și corelația Pearson (7.4): mqtt.qos și mqtt.dupflag apar doar la atacuri, deci regresia obișnuită nu le poate estima (erori standard de peste zece mii) și am folosit Firth, care dă erori finite. Fără ele, tcp.len, tcp.time_delta și mqtt.len rămân predictori semnificativi, iar devianța scade de la 458.761 la 337.501. Modelul final dă probabilitate peste 0,9 la 43% din pachetele dos și la 49% din cele flood, dar la bruteforce, malformed și slowite dă aceeași probabilitate ca la pachetele normale goale (0,42). Corelația Pearson dintre tcp.len și mqtt.len este 0,274 (Spearman 0,939), iar r² este egal cu R² din regresia liniară 1."
  },
  {
   "tip": "text",
   "text": "Arborii de decizie (secțiunea 10) ajung la aceleași variabile: arborele de clasificare recunoaște corect 95,2% din pachetele de test (F1 = 0,950) cu 15 frunze, pornind de la mqtt.qos (numai dos), mqtt.msgtype și tcp.flags. Spre deosebire de regresia logistică, folosește direct variabilele categorice și pe cele care separă perfect. Ratează mai ales pachetele dos, slowite și flood care sunt doar confirmări ACK. Un arbore care prezice mqtt.len din tcp.len prinde relațiile diferite din fiecare grup de pachete (R² = 0,897 față de 0,070 la dreapta din 8.1, comparația din 10.6); arborele care prezice tcp.len din clasă și tipul pachetului ajunge doar la R² = 0,26, din cauza pachetelor flood."
  },
  {
   "tip": "text",
   "text": "Regulile de asociere (secțiunea 11) dau, pentru fiecare atac, combinațiile de valori care îl anunță, cu confidence de cel puțin 0,96: qos = 1 sau dupflag = 1 la dos, CONNECT cu conținut la bruteforce, FIN+PSH+ACK sau RST la malformed, pachete cu conținut fără mesaj MQTT la slowite și tcp.len peste 1.460 la flood. Pachetele care sunt doar ACK rămân greu de recunoscut și cu această metodă."
  }
 ]
}

export default date
