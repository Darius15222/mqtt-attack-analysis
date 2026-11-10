import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "13. Concluzie: ce variabile indică fiecare atac",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Capitolele 5-11 au răspuns, fiecare, la o parte din întrebare. Aici le adunăm: întâi tabelul cu valorile care indică fiecare atac (din capitolele 5 și 6), apoi ce adaugă regresiile, arborii și regulile (capitolele 8-11)."
  },
  {
   "tip": "parte",
   "fel": "ipoteza",
   "titlu": "Scopul"
  },
  {
   "tip": "text",
   "text": "Vrem un răspuns direct la întrebarea temei: după ce valori recunoaștem fiecare atac."
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
   "text": "pentru fiecare atac, variabilele care îl deosebesc de traficul normal (tabelul de mai jos; coloana „Ce înseamnă” este interpretarea noastră)."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "diferența de procent (atac minus normal) arată direct ce valoare apare la atac și lipsește la normal, deci ce poate semnala atacul; la numerice, mediana și Q3 arată unde stau valorile tipice, fără să fie trase de valorile extreme."
  },
  {
   "tip": "parte",
   "fel": "demonstratie",
   "titlu": "Demonstrația"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "toate cele 19 variabile testate diferă între clase (p sub 0,001, capitolul 6), deci testul singur nu spune care contează; în tabel rămân doar valorile la care atacul se vede cel mai clar față de traficul normal."
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
     "mqtt.qos = 1 la 41,8% din pachete, față de 0% la normal; mqtt.msgtype = 4 (confirmare de publicare) la 29,8% din pachete, față de 0% la normal; mqtt.hdrflags = 0x00000040, în aceleași pachete; mqtt.dupflag = 1 la 14,4%, față de 0%; mqtt.len și tcp.len mari (Q3 = 168 și 116, față de 11 și 13 la normal); tcp.time_delta foarte mic (mediana 3e-06 față de 7,6e-05).",
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
   "text": "Ce deosebește atacurile între ele:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "mqtt.msgtype și mqtt.hdrflags indică aceleași pachete, deci contează ca o singură informație;",
    "bruteforce, malformed și slowite seamănă între ele (pachete fără conținut, cu mqtt.msgtype = 0) și se deosebesc între ele prin RST (aproape doar la malformed: 1.584 din cele 1.592 de pachete RST, adică 14,5% din malformed), prin FIN și ACK (mai des la bruteforce, 22,4%, față de 8,3% la malformed) și prin mqtt.kalive = 65.535 (doar la slowite, valoare pe care nu o are niciun alt tip de trafic);",
    "SYN apare la toate trei în proporții apropiate (8-11%), deci le deosebește de traficul normal, nu între ele;",
    "dos și flood se văd din dimensiunea pachetelor (tcp.len, mqtt.len) și din tcp.time_delta mic; se deosebesc între ele prin mqtt.qos = 1, mqtt.msgtype = 4 și mqtt.dupflag = 1, prezente la dos și absente la flood."
   ]
  },
  {
   "tip": "text",
   "text": "Regresia liniară (secțiunea 8) confirmă diferența dintre normal și atacuri:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "la traficul normal, mqtt.len urmează tcp.len aproape perfect (R² = 0,997), iar la atacuri relația se rupe (R² între 0,002 și 0,762, cu pante diferite);",
    "pe tot setul, o singură dreaptă nu e potrivită (R² = 0,075, după logaritm 0,843);",
    "timpul dintre pachete nu se poate prezice din dimensiunea lor (R² = 0,0014);",
    "corelația Pearson dintre tcp.len și mqtt.len este 0,274 (Spearman 0,939), iar r² este egal cu R² din regresia liniară 1 (7.4)."
   ]
  },
  {
   "tip": "text",
   "text": "Regresia logistică (secțiunea 9):"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "mqtt.qos și mqtt.dupflag apar doar la atacuri, deci regresia obișnuită nu le poate estima (erori standard de peste zece mii); am folosit Firth, care dă erori finite;",
    "fără ele, tcp.len, tcp.time_delta și mqtt.len rămân predictori semnificativi, iar devianța scade de la 458.761 la 337.501;",
    "modelul final dă probabilitate peste 0,9 la 43% din pachetele dos și la 49% din cele flood, dar la cel puțin jumătate din pachetele bruteforce, malformed și slowite dă aproximativ aceeași probabilitate ca la pachetele normale goale (0,42)."
   ]
  },
  {
   "tip": "text",
   "text": "Arborii de decizie (secțiunea 10) folosesc o parte din aceleași variabile (mqtt.qos, mqtt.msgtype, tcp.flags, tcp.len, tcp.time_delta):"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "arborele de clasificare recunoaște corect 95,1% din pachete (F1 = 0,949) cu 15 frunze, pornind de la mqtt.qos (numai dos), mqtt.msgtype și tcp.flags;",
    "spre deosebire de regresia logistică, folosește direct variabilele categorice și pe cele care separă perfect;",
    "ratează mai ales pachetele dos, slowite și flood care sunt doar confirmări ACK;",
    "un arbore care prezice mqtt.len din tcp.len prinde relațiile diferite din fiecare grup de pachete (R² = 0,899 față de 0,075 la dreapta din 8.1, comparația din 10.6); arborele care prezice tcp.len din clasă și tipul pachetului ajunge doar la R² = 0,24, din cauza pachetelor flood."
   ]
  },
  {
   "tip": "text",
   "text": "Regulile de asociere (secțiunea 11) dau, pentru fiecare atac, combinațiile de valori care îl anunță, cu confidence de cel puțin 0,96:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "dos: qos = 1 sau dupflag = 1;",
    "bruteforce: CONNECT cu conținut;",
    "malformed: FIN+PSH+ACK sau RST;",
    "slowite: pachete cu conținut fără mesaj MQTT;",
    "flood: tcp.len peste 1.460."
   ]
  },
  {
   "tip": "text",
   "text": "Pachetele care sunt doar ACK rămân greu de recunoscut și cu această metodă."
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
    "Fiecare atac are valori care apar numai (sau aproape numai) la el, dar ele marchează doar o parte din pachetele lui: dos prin mqtt.qos = 1 (41,8% din pachetele dos) și confirmările PUBACK, flood prin tcp.len peste 1.460 (48%), malformed prin RST (14,5%) și FIN+PSH+ACK, slowite prin mqtt.kalive = 65.535 (11%), bruteforce prin cererile CONNECT cu conținut și, mai slab, prin FIN+ACK (77,5% din pachetele cu FIN+ACK sunt bruteforce).",
    "Arborele și regulile de asociere, care pot folosi și variabilele categorice, ajung la aceleași variabile ca testele pe clase: mqtt.qos, mqtt.msgtype, tcp.flags, tcp.len și tcp.time_delta. Regresiile nu folosesc variabilele categorice (tcp.flags, mqtt.msgtype): confirmă partea despre dimensiunea pachetelor și timpul dintre ele, iar despre mqtt.qos și mqtt.dupflag arată doar că apar numai la atacuri (9.4, 9.5).",
    "Limita: confirmările ACK goale ale atacurilor arată la fel ca cele normale, deci nu pot fi recunoscute doar din pachet."
   ]
  }
 ]
}

export default date
