import type { Bloc } from './tipuri'

const date: Bloc[] = [
 {
  "tip": "subtitlu",
  "text": "Rezumat"
 },
 {
  "tip": "text",
  "text": "Analizăm setul MQTTset (330.926 de pachete MQTT dintr-o casă inteligentă simulată, jumătate trafic normal și jumătate cinci tipuri de atac) ca să găsim combinațiile de variabile care indică fiecare atac. Am folosit statistică descriptivă și teste pe clase, corelații, regresie liniară și logistică, arbori de decizie și reguli de asociere. Toate cele 19 variabile testate diferă între clase (p sub 0,001), iar mqtt.qos = 1 și mqtt.dupflag = 1 apar numai la dos. Arborele de clasificare recunoaște corect 95,2% din pachetele de test, iar regulile de asociere dau pentru fiecare atac o combinație cu confidence de cel puțin 0,96. Pachetele care sunt doar confirmări ACK rămân greu de deosebit de traficul normal."
 },
 {
  "tip": "text",
  "eticheta": "Obiectiv",
  "text": "variabilele și combinațiile de valori care deosebesc fiecare atac de traficul normal."
 },
 {
  "tip": "text",
  "eticheta": "Ipoteze (H0)",
  "text": "cap. 6: fiecare variabilă are aceeași distribuție în toate cele 6 clase; cap. 7: corelația dintre două variabile este 0; cap. 8: panta regresiei este 0; cap. 9: coeficientul fiecărui predictor este 0; cap. 10: la fiecare nod, fiecare predictor este independent de țintă. La regulile de asociere (cap. 11) nu se testează o ipoteză: se păstrează regulile cu support și confidence peste prag."
 }
]

export default date
