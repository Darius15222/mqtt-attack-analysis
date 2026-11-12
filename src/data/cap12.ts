import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "12. Comparație cu literatura",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Din capitolele 5-11 avem rezultatele noastre. Cele cinci articole din capitolul 2 folosesc același set de date, deci verificăm dacă ajung la aceleași concluzii."
  },
  {
   "tip": "parte",
   "fel": "ipoteza",
   "titlu": "Scopul"
  },
  {
   "tip": "text",
   "text": "Vrem să vedem dacă rezultatele noastre se potrivesc cu ale altor lucrări pe aceleași date și, unde diferă, de ce."
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
   "text": "cele 5 articole din capitolul 2; la 3 dintre ele (Imran et al., Choi și Cho, Prabhugaonkar et al.) am avut doar rezumatul."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "pentru fiecare articol, ce au făcut și ce rezultat raportează, pus lângă rezultatul nostru."
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "tabelul de mai jos și 3 concluzii."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "cifrele nu se compară una la una: articolele folosesc alte clase și altă împărțire a datelor. Comparăm mai ales variabilele și limitele."
  },
  {
   "tip": "parte",
   "fel": "demonstratie",
   "titlu": "Demonstrația"
  },
  {
   "tip": "text",
   "eticheta": "Ce au făcut articolele, față de noi",
   "text": ""
  },
  {
   "tip": "tabel",
   "antet": [
    "Articol",
    "Ce au făcut",
    "Rezultat",
    "Față de noi"
   ],
   "randuri": [
    [
     "Al Hanif și Ilyas (Sensors, 2024)",
     "arbore de decizie, 2 clase (normal, atac), 10 variabile",
     "accuracy 0,9629",
     "noi: 0,9514, cu aproximativ 1 punct procentual mai puțin, dar cu un arbore de 15 frunze care se citește ca reguli"
    ],
    [
     "Al Hanif și Ilyas (IJAIA, 2024)",
     "3 clase (legitimate, dos, bruteforce), arbori și combinații de modele",
     "recall la dos (cât din dos este prins) între 0,91 și 0,92",
     "noi: 91,1% din pachetele dos recunoscute ca atac; aceeași limită"
    ],
    [
     "Choi și Cho (2022)",
     "rețea neuronală pe secvențe de pachete, legate prin portul sursă",
     "accuracy 99,97%",
     "mult peste: urmăresc conexiunea; setul nostru nu are porturi, deci analizăm fiecare pachet separat"
    ],
    [
     "Imran et al. (2023)",
     "mai multe modele, cu variabile alese după corelații, ca predicția să fie mai rapidă",
     "nu dă accuracy",
     "alt scop (timpul de predicție)"
    ],
    [
     "Prabhugaonkar et al. (2022)",
     "rețele neuronale antrenate fără ca datele să fie adunate într-un singur loc",
     "nu dă cifre",
     "alt scop"
    ]
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
    "Aceleași variabile: 5 din cele 7 variabile ale arborelui nostru (tcp.flags, tcp.time_delta, tcp.len, mqtt.qos, mqtt.dupflag) sunt și în setul de 10 al lui Al Hanif și Ilyas.",
    "Rezultat apropiat și aceeași limită: arborele lor are accuracy 0,9629, al nostru 0,9514; și ei, și noi ratăm aproximativ 9% din pachetele dos, mai ales pachetele doar cu ACK.",
    "Doar Choi și Cho trec mult peste (99,97%), pentru că urmăresc conexiunea, nu pachetul singur. Limita vine din date (fiecare pachet analizat separat), nu din metodă."
   ]
  }
 ]
}

export default date
