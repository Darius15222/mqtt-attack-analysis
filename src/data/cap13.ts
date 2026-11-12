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
   "text": "Capitolele 5-11 au răspuns, fiecare, la o parte din întrebare. Aici le adunăm într-un singur răspuns, pentru fiecare atac."
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
   "text": "rezultatele din capitolele 5-11."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "pentru fiecare atac păstrăm valorile care apar la el și lipsesc (aproape) la traficul normal, apoi verificăm dacă metodele din capitolele 8-11 ajung la aceleași valori."
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "tabelul pe atacuri (coloana „Ce înseamnă” este interpretarea noastră) și ce confirmă fiecare metodă."
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
    "După ce îl recunoaștem (față de traficul normal)",
    "Ce înseamnă"
   ],
   "randuri": [
    [
     "dos",
     "mqtt.qos = 1 (41,8% din pachete) și mqtt.dupflag = 1 (14,4%), care apar doar la dos; confirmări de publicare (PUBACK, 29,8%); pachete mari (Q3 116 față de 13) și foarte dese",
     "Pachete foarte dese, cu mesaje lungi și confirmări, care la normal lipsesc."
    ],
    [
     "bruteforce",
     "flagul FIN+ACK (22,4%, la normal 0%); cereri de conectare cu nume și parolă; 80% din pachete fără mesaj MQTT (la normal 37%)",
     "Încearcă parole: se conectează, închide conexiunea, încearcă din nou."
    ],
    [
     "malformed",
     "flagul RST (14,5%, la normal 0%) și FIN+PSH+ACK (doar aici); pachete scurte",
     "Pachete stricate, la care conexiunea este oprită brusc."
    ],
    [
     "slowite",
     "mqtt.kalive = 65.535 (11%, doar aici); flagurile SYN și SYN+ACK (11%); pachete cu conținut, dar fără mesaj MQTT",
     "Ține conexiunile deschise cât mai mult (keep alive maxim, aproximativ 18 ore), ca serverul să rămână fără conexiuni libere."
    ],
    [
     "flood",
     "pachete foarte mari (tcp.len peste 1.460; Q3 32.759 față de 13) și trimise rapid",
     "Sunt doar 613 pachete, deci concluzia este mai puțin sigură."
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
    "bruteforce, malformed și slowite seamănă (multe pachete fără mesaj MQTT) și se deosebesc prin flaguri (FIN+ACK, RST, SYN) și prin mqtt.kalive;",
    "dos și flood se văd din mărimea și viteza pachetelor; doar dos are mqtt.qos = 1 și mqtt.dupflag = 1."
   ]
  },
  {
   "tip": "text",
   "text": "Ce confirmă celelalte metode:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "regresia liniară (capitolul 8): la traficul normal, lungimea mesajului urmează exact mărimea pachetului (R² = 0,997); la atacuri regula se strică;",
    "regresia logistică (capitolul 9): pachetele mari și dese au șansă mare de atac (dos și flood), dar pachetele goale ale atacurilor arată ca cele normale;",
    "arborele de decizie (capitolul 10): recunoaște corect 95,1% din pachete, cu 15 frunze, pornind de la mqtt.qos, mqtt.msgtype și tcp.flags;",
    "regulile de asociere (capitolul 11): fiecare atac are o regulă cu confidence de cel puțin 0,96, cu valorile din tabel."
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
    "Fiecare atac are valori care apar numai (sau aproape numai) la el, dar ele marchează doar o parte din pachetele lui: de exemplu, mqtt.qos = 1 la 41,8% din pachetele dos, mqtt.kalive = 65.535 la 11% din cele slowite.",
    "Toate metodele ajung la aceleași variabile: mqtt.qos, mqtt.msgtype, tcp.flags, tcp.len și tcp.time_delta.",
    "Limita: confirmările ACK goale ale atacurilor arată la fel ca cele normale, deci nu pot fi recunoscute doar din pachet."
   ]
  }
 ]
}

export default date
