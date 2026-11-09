import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "12. Comparație cu literatura",
 "blocuri": [
  {
   "tip": "text",
   "text": "Cele cinci articole din capitolul 2 folosesc același set de date. Comparăm ce date și clase au folosit, ce variabile au păstrat, ce metodă au aplicat și ce rezultat raportează cu ce am făcut noi."
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "cele 5 articole din capitolul 2. La cele două articole Al Hanif și Ilyas am citit textul integral; la Imran et al., Choi și Cho și Prabhugaonkar et al. doar rezumatul, pentru că editurile nu permit descărcarea automată a textului."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "pentru fiecare articol am extras datele și clasele, variabilele alese, metoda și cel mai bun rezultat raportat, apoi le-am pus lângă rezultatele noastre din capitolele 7, 10 și 13."
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "tabelul de mai jos și observațiile de sub el."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "comparăm doar ce scrie în articole, fără să refacem modelele lor. Cifrele nu se compară una la una, pentru că articolele folosesc alte clase, alte variabile și altă împărțire a datelor; de aceea comparăm mai ales variabilele și metoda."
  },
  {
   "tip": "tabel",
   "antet": [
    "Articol",
    "Date și clase",
    "Variabile",
    "Metodă",
    "Rezultat raportat"
   ],
   "randuri": [
    [
     "Al Hanif și Ilyas (Sensors, 2024)",
     "MQTTset redus; 2 clase (normal, atac); 70% construcție, 30% test",
     "10 din 33, alese după corelația Pearson și importanța din ExtraTrees și Random Forest: tcp.flags, tcp.time_delta, tcp.len, mqtt.qos, mqtt.dupflag, mqtt.len, mqtt.hdrflags, mqtt.conack.flags, mqtt.msg, mqtt.msgid",
     "arbore de decizie (fără limită de adâncime), KNN, Random Forest, AdaBoost, XGBoost",
     "accuracy 0,9629 la arbore și 0,9633 la Random Forest (cel mai bun); tot 0,9629 la arbore cu toate cele 33 de variabile"
    ],
    [
     "Al Hanif și Ilyas (IJAIA, 2024)",
     "MQTTset redus; 3 clase (legitimate, dos, bruteforce); 80% / 20%; clase echilibrate cu SMOTE",
     "aceleași 10, alese cu K-Best, corelația Pearson și PCA",
     "arbore de decizie, Random Forest, KNN, XGBoost și combinații de modele (stacking, voting, bagging)",
     "accuracy 0,9520 la arbore și 0,9538 la stacking și voting; recall la dos între 0,91 și 0,92 la toate modelele"
    ],
    [
     "Imran et al. (2023), după rezumat",
     "MQTTset; normal și cele 5 atacuri",
     "alese prin analiza corelației (rezumatul nu le enumeră)",
     "Random Forest, arbore de decizie, Naive Bayes, MLP, rețea neuronală, regresie logistică, Gradient Boost",
     "scopul este timpul de predicție: la dos scade de la 0,92 la 0,77, la malformed de la 2,92 la 0,49 (rezumatul nu dă unitatea și nici accuracy)"
    ],
    [
     "Choi și Cho (2022), după rezumat",
     "MQTTset; normal și cele 5 atacuri",
     "variabile noi: indexul portului sursă, lungimea TCP, tipul mesajului MQTT, keep alive, confirmarea conectării",
     "Seq2Seq (rețea neuronală care lucrează pe secvențe)",
     "accuracy 99,97%"
    ],
    [
     "Prabhugaonkar et al. (2022), după rezumat",
     "MQTTset; rezumatul vorbește de trafic IoT etichetat și neetichetat",
     "nu apar în rezumat",
     "rețele neuronale (DNN, autoencoder) antrenate federat (FedSGD, FedAvg, FedProx), față de antrenarea centralizată",
     "rezumatul nu dă cifre"
    ],
    [
     "Lucrarea de față",
     "MQTTset redus; 6 clase la statistică și reguli, 2 clase la regresia logistică și arbore; 70% / 30% doar la arbori, separat pe fiecare clasă",
     "7 la arbore: tcp.flags, mqtt.msgtype, tcp.len, tcp.time_delta, mqtt.qos, mqtt.dupflag, mqtt.ver, alese după testele din capitolul 6 și corelațiile Spearman din capitolul 7",
     "teste statistice, regresii, arbore cu test statistic la fiecare împărțire (5 niveluri, 15 frunze), reguli de asociere",
     "arbore: accuracy 0,9524, F1 0,9504; pentru fiecare atac, o regulă cu confidence de cel puțin 0,96"
    ]
   ]
  },
  {
   "tip": "text",
   "eticheta": "De ce diferă cifrele",
   "text": ""
  },
  {
   "tip": "text",
   "text": "Tabelul de mai jos pune una lângă alta alegerile care schimbă rezultatul. Imran et al. și Prabhugaonkar et al. nu apar, pentru că rezumatele lor nu dau accuracy."
  },
  {
   "tip": "tabel",
   "antet": [
    "Ce diferă",
    "Al Hanif și Ilyas (Sensors)",
    "Al Hanif și Ilyas (IJAIA)",
    "Choi și Cho",
    "Lucrarea de față",
    "Cum schimbă cifra"
   ],
   "randuri": [
    [
     "Clasele",
     "2: normal, atac",
     "3: legitimate, dos, bruteforce",
     "6: normal și cele 5 atacuri",
     "2 la arbore: normal, atac",
     "La 2 clase ajunge ca atacul să fie recunoscut ca atac; la 3 sau 6 modelul trebuie să spună și ce atac, deci sarcina e mai grea."
    ],
    [
     "Ce se analizează",
     "fiecare pachet separat",
     "fiecare pachet separat",
     "secvențe de pachete, legate prin portul sursă",
     "fiecare pachet separat",
     "Legătura cu conexiunea deosebește pachetele doar ACK, pe care analiza pe pachet nu le poate deosebi; probabil de aici vin cei 99,97%."
    ],
    [
     "Variabilele",
     "10, cu mqtt.msg, mqtt.msgid, mqtt.len, mqtt.hdrflags",
     "aceleași 10",
     "5: port sursă, tcp.len, tipul mesajului, keep alive, confirmarea conectării",
     "7, fără mqtt.msg, mqtt.msgid, mqtt.len, mqtt.hdrflags",
     "mqtt.msg și mqtt.msgid pot ajuta modelul fără să descrie atacul (sunt conținut și număr de ordine); portul sursă aduce informația despre conexiune."
    ],
    [
     "Modelul",
     "arbore fără limită de adâncime, parametri aleși cu grid search și validare încrucișată",
     "arbore și combinații de modele",
     "rețea neuronală Seq2Seq",
     "arbore cu 5 niveluri și 15 frunze, cu test statistic la fiecare împărțire",
     "Un arbore mai adânc sau o combinație de modele prinde mai multe detalii, dar nu se mai citește ca reguli."
    ],
    [
     "Împărțirea datelor",
     "70% / 30%",
     "80% / 20%",
     "nu apare în rezumat",
     "70% / 30% doar la arbori, separat pe fiecare clasă",
     "Efect mic: setul de test are zeci de mii de pachete în toate cazurile."
    ],
    [
     "Echilibrarea claselor",
     "nu e nevoie (setul redus e jumătate normal, jumătate atac)",
     "SMOTE (pachete sintetice pentru clasa mai mică)",
     "nu apare în rezumat",
     "nu e nevoie (jumătate normal, jumătate atac)",
     "SMOTE schimbă doar datele de construcție; testul rămâne pe pachete reale."
    ],
    [
     "Metrica",
     "accuracy (și precision, recall, F1)",
     "accuracy și, pe fiecare clasă, precision, recall, F1",
     "accuracy",
     "accuracy și F1 pe clasa atac",
     "Accuracy și F1 nu sunt aceeași măsură; de aceea comparăm accuracy cu accuracy (0,9629 față de 0,9524)."
    ]
   ]
  },
  {
   "tip": "text",
   "eticheta": "Ce arată",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Variabilele: aceleași variabile apar în toate lucrările. Din cele 7 variabile ale arborelui nostru, 5 (tcp.flags, tcp.time_delta, tcp.len, mqtt.qos, mqtt.dupflag) sunt și în setul de 10 al lui Al Hanif și Ilyas. Choi și Cho folosesc lungimea TCP, tipul mesajului și keep alive, adică exact variabilele care în capitolul 13 deosebesc dos și bruteforce (mqtt.msgtype) și slowite (mqtt.kalive = 65.535).",
    "Ce am exclus noi și ei au păstrat: mqtt.msg și mqtt.msgid, care sunt conținutul mesajului și un număr de ordine, nu măsurători (secțiunea 5), și mqtt.len și mqtt.hdrflags, pe care le-am scos ca redundante (corelația 0,94 cu tcp.len; hdrflags pune la un loc tipul mesajului, QoS și dupflag). La ei, trecerea de la 33 la 10 variabile nu schimbă accuracy (0,9629); la noi, excluderile nu schimbă F1 (0,9505 față de 0,9504, secțiunea 10.2). Ambele rezultate arată că multe variabile din set sunt de prisos.",
    "Metoda de alegere a variabilelor: Al Hanif și Ilyas folosesc corelația Pearson și importanța din modele. Noi am folosit Spearman, pentru că variabilele nu au distribuție normală și au valori extreme (secțiunea 7); la tcp.len cu mqtt.len diferența este mare: Pearson 0,274, Spearman 0,939. Imran et al. folosesc tot corelația, dar ca să micșoreze timpul de antrenare, nu ca să explice atacurile.",
    "Rezultatul, la aceeași formă a problemei (2 clase, 70% / 30%, setul redus): arborele lui Al Hanif și Ilyas ajunge la accuracy 0,9629, al nostru la 0,9524, cu aproximativ 1 punct procentual mai puțin (1,05). Arborele lor nu are limită de adâncime și folosește mqtt.msg și mqtt.msgid; al nostru are 5 niveluri și 15 frunze, care se citesc direct ca reguli (10.4).",
    "Aceeași limită la dos: la 3 clase, recall-ul la dos este între 0,91 și 0,92 la toate modelele lui Al Hanif și Ilyas, inclusiv la combinațiile de modele. Arborele nostru prinde 91,1% din pachetele dos (8,9% ratate, 10.5), iar cele ratate sunt mai ales pachete care sunt doar ACK. Pare o limită a datelor, nu a modelului: un pachet ACK de la dos arată la fel ca unul normal.",
    "Doar Choi și Cho trec mult peste (99,97%). Ei folosesc indexul portului sursă, care leagă pachetele aceleiași conexiuni, și un model care lucrează pe secvențe. Setul redus nu are porturi, deci noi analizăm fiecare pachet separat. Rezultatul lor sugerează că pachetele pe care noi nu le putem deosebi (doar ACK) devin recognoscibile când se ține cont de conexiune.",
    "Prabhugaonkar et al. au alt scop (antrenarea modelelor fără ca datele să fie adunate într-un singur loc), deci nu se compară direct cu noi."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Limită",
   "text": "la Imran et al., Choi și Cho și Prabhugaonkar et al. comparația se bazează doar pe rezumat; detaliile (variabilele exacte, împărțirea datelor) nu au putut fi verificate."
  }
 ]
}

export default date
