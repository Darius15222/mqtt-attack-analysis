import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "1. Dataset: MQTTset",
 "blocuri": [
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Link: https://www.kaggle.com/datasets/cnrieiit/mqttset",
    "Sursa originală: Vaccari, I., Chiola, G., Aiello, M., Mongelli, M., Cambiaso, E. (2020). MQTTset, a New Dataset for Machine Learning Techniques on MQTT. Sensors, 20(22), 6578. https://doi.org/10.3390/s20226578",
    "Licență: CC BY-NC-SA 4.0. Usability pe Kaggle: 10.00.",
    "Dimensiune pe Kaggle: versiunea 5, 9,57 GB, 24 de fișiere."
   ]
  },
  {
   "tip": "text",
   "text": "MQTTset conține trafic de rețea MQTT (protocolul de mesagerie folosit în IoT), atât legitim, cât și cu atacuri. Rețeaua simulată este o casă inteligentă, cu senzori emulați cu IoT-Flock (temperatură, lumină, umiditate, mișcare, CO-Gas, fum, ventilator, încuietoare) conectați la un broker Eclipse Mosquitto. Traficul a fost capturat la broker."
  },
  {
   "tip": "text",
   "text": "Atacurile incluse sunt: Flooding DoS, MQTT Publish Flood, SlowITe, Malformed Data și Brute Force Authentication."
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "versiunea redusă a datasetului (reduced): 330.926 de pachete (rânduri) și 34 de coloane, adică 33 de variabile despre fiecare pachet și ținta target, care spune dacă pachetul este normal sau ce atac este."
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
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "numărul de pachete din fiecare clasă și procentul din total (pachete / 330.926 · 100)."
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "descrierea variabilelor (3, 5), formulele (4), diferențele dintre clase (6), legăturile dintre variabile (7), două modele de predicție (8, 9), arbori de decizie (10), reguli de asociere (11), comparația cu literatura (12) și o concluzie pe atacuri (13)."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "versiunea redusă, pentru că încape în memorie și este echilibrată: jumătate trafic normal, jumătate atacuri (165.463 fiecare). Analiza se face pe toate cele 6 clase, nu doar normal față de atac, pentru că atacurile diferă mult între ele."
  }
 ]
}

export default date
