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
   "tip": "text",
   "eticheta": "Pe scurt",
   "text": "articolele folosesc în mare aceleași variabile, ajung la o Accuracy apropiată (0,9629 față de 0,9514 la noi), iar articolul IJAIA ratează, ca noi, aproximativ 9% din pachetele dos. Doar un articol trece mult peste, pentru că urmărește conexiunea întreagă, nu pachetul singur."
  },
  {
   "tip": "text",
   "eticheta": "De ținut minte",
   "text": "limita vine din date (fiecare pachet e analizat singur), nu din metodă."
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
   "text": "cifrele se compară doar orientativ: articolele folosesc alte clase și altă împărțire a datelor. Comparăm mai ales variabilele și limitele."
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
     "Accuracy 0,9629",
     "noi: 0,9514, cu aproximativ 1 punct procentual mai puțin, dar cu un arbore de 15 frunze care se citește ca reguli"
    ],
    [
     "Al Hanif și Ilyas (IJAIA, 2024)",
     "3 clase (legitimate, dos, bruteforce), arbori și combinații de modele",
     "recall la dos (Sensitivity din 10.5: cât din dos este prins) între 0,91 și 0,92",
     "noi: 91,0% din pachetele dos recunoscute ca atac; aceeași limită"
    ],
    [
     "Choi și Cho (2022)",
     "rețea neuronală pe secvențe de pachete, legate prin portul sursă",
     "Accuracy 99,97%",
     "mult peste: urmăresc conexiunea; setul nostru nu are porturi, deci analizăm fiecare pachet separat"
    ],
    [
     "Imran et al. (2023)",
     "mai multe modele, cu variabile alese după corelații, ca predicția să fie mai rapidă",
     "nu dă Accuracy",
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
   "tip": "tabel",
   "antet": [
    "Ce voiam să aflăm",
    "Cum am aflat",
    "Rezultat"
   ],
   "randuri": [
    [
     "Ajung alte lucrări pe aceleași date la aceleași rezultate?",
     "comparația cu cele 5 articole din capitolul 2 (tabelul de mai sus)",
     "Da, în mare: aceleași variabile, Accuracy apropiată și, la articolul IJAIA, aceeași limită. Doar Choi și Cho trec mult peste, pentru că urmăresc conexiunea."
    ]
   ]
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Aceleași variabile: 5 dintre cei 7 predictori ai arborelui nostru (10.2: tcp.flags, tcp.time_delta, tcp.len, mqtt.qos, mqtt.dupflag) sunt și în setul de 10 al lui Al Hanif și Ilyas.",
    "Rezultat apropiat și aceeași limită: arborele lor are Accuracy 0,9629, al nostru 0,9514; și ei, și noi ratăm aproximativ 9% din pachetele dos, mai ales pachetele doar cu ACK.",
    "Doar Choi și Cho trec mult peste (99,97%), pentru că urmăresc conexiunea, nu pachetul singur. Limita vine din date (fiecare pachet analizat separat), nu din metodă."
   ]
  }
 ]
}

export default date
