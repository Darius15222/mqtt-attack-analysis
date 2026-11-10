import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "1. Dataset: MQTTset",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Înainte de orice analiză aflăm ce date avem: de unde vin și ce trafic conțin."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Link: https://www.kaggle.com/datasets/cnrieiit/mqttset",
    "Sursa originală: Vaccari, I., Chiola, G., Aiello, M., Mongelli, M., Cambiaso, E. (2020). MQTTset, a New Dataset for Machine Learning Techniques on MQTT. Sensors, 20(22), 6578. https://doi.org/10.3390/s20226578",
    "Pe Kaggle: licență CC BY-NC-SA 4.0, usability 10,00, versiunea 5 (9,57 GB, 24 de fișiere)."
   ]
  },
  {
   "tip": "text",
   "text": "MQTTset conține trafic MQTT (protocolul prin care dispozitivele IoT își trimit mesaje) dintr-o casă inteligentă simulată: senzori de temperatură, lumină, umiditate, mișcare, gaz, fum, plus un ventilator și o încuietoare trimit date unui broker (serverul care primește și distribuie mesajele). Pe lângă traficul normal, conține 5 atacuri: Flooding DoS, MQTT Publish Flood, SlowITe, Malformed Data și Brute Force Authentication."
  },
  {
   "tip": "parte",
   "fel": "ipoteza",
   "titlu": "Scopul"
  },
  {
   "tip": "text",
   "text": "Aici nu testăm nimic. Numărăm pachetele din fiecare clasă (normal și cele 5 atacuri), pentru că numărul lor contează:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "o clasă cu puține pachete dă concluzii mai puțin sigure (flood are doar 613);",
    "cu jumătate trafic normal și jumătate atacuri, un procent mare de răspunsuri corecte chiar înseamnă ceva. La 99% trafic normal, un model care spune mereu „normal” ar avea 99% corect fără să prindă niciun atac."
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
   "text": "versiunea redusă a datasetului: 330.926 de pachete (rânduri), fiecare cu 33 de variabile și ținta target, care spune dacă pachetul este normal sau ce atac este."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "numărul de pachete din fiecare clasă și procentul din total (pachete / 330.926 · 100)."
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "tabelul din Demonstrație, cu numărul și procentul pachetelor din fiecare clasă. Toate capitolele următoare lucrează pe aceste date."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "versiunea redusă, pentru că încape în memorie și are jumătate trafic normal, jumătate atacuri (165.463 fiecare). Lucrăm pe toate cele 6 clase, nu doar normal față de atac, pentru că atacurile diferă mult între ele."
  },
  {
   "tip": "text",
   "eticheta": "Datele folosite",
   "text": "fișierul redus, exact cum este descărcat, fără rânduri scoase sau valori modificate. Pregătirile cerute de fiecare metodă se fac doar în cod și sunt descrise în capitolul ei."
  },
  {
   "tip": "parte",
   "fel": "demonstratie",
   "titlu": "Demonstrația"
  },
  {
   "tip": "tabel",
   "antet": [
    "Clasă (target)",
    "Pachete",
    "% din total"
   ],
   "randuri": [
    [
     "legitimate (normal)",
     "165.463",
     "50,00%"
    ],
    [
     "dos",
     "130.223",
     "39,35%"
    ],
    [
     "bruteforce",
     "14.501",
     "4,38%"
    ],
    [
     "malformed",
     "10.924",
     "3,30%"
    ],
    [
     "slowite",
     "9.202",
     "2,78%"
    ],
    [
     "flood",
     "613",
     "0,19%"
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
    "Setul are 330.926 de pachete: jumătate trafic normal (165.463), jumătate atacuri (165.463).",
    "Atacurile nu sunt egale între ele: dos are 39,35% din tot setul, flood doar 0,19% (613 pachete).",
    "De aceea, unde se poate, analizele compară fiecare atac separat cu traficul normal, nu doar „atac” cu „normal”."
   ]
  }
 ]
}

export default date
