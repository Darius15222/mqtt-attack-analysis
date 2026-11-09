import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "8. Regresie liniară",
 "blocuri": [
  {
   "tip": "text",
   "text": "Regresia liniară prezice o variabilă (Y) din una sau mai multe variabile (X). Formulele sunt în secțiunea 4. Fiecare regresie are aceiași pași: ipoteza, scatter, coeficienți cu p și R², verificarea condițiilor, predicție. Calculele s-au făcut în Python (statsmodels, cele mai mici pătrate) pe cele 330.926 de pachete; graficele sunt pe 8.000 de pachete luate la întâmplare."
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "variabila de prezis (Y) și variabila sau variabilele din care se prezice (X), pentru fiecare pachet."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "se caută dreapta cu cea mai mică sumă a pătratelor reziduurilor (metoda celor mai mici pătrate). La o singură variabilă X, β1 = suma (x - x̄)(y - ȳ) / suma (x - x̄)² și β0 = ȳ - β1 · x̄. La mai multe variabile, coeficienții se rezolvă împreună, cu aceeași regulă."
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "β0, β1 (și β2 la regresia multiplă), p pentru fiecare coeficient, R² și reziduurile."
  },
  {
   "tip": "text",
   "eticheta": "Condiții verificate",
   "text": "1) relația este liniară (scatter); 2) nu sunt valori extreme care trag dreapta (scatter); 3) reziduurile au aceeași împrăștiere pe toată dreapta (graficul reziduurilor); 4) reziduurile sunt aproximativ normale (histograma reziduurilor cu curba normală suprapusă, plus asimetria și kurtosis între -1 și 1); 5) variabilele sunt continue: respectată, tcp.len și mqtt.len sunt în bytes, tcp.time_delta în secunde; 6) observațiile sunt independente: testul Durbin-Watson, DW = suma (e_t - e_t-1)² / suma e_t², cu e_t reziduul rândului t, compară fiecare reziduu cu cel de pe rândul anterior; dă 2,00 la regresia 1 și 1,99 la regresia 2, iar 2 înseamnă reziduuri vecine necorelate. Totuși, pachetele aceleiași conexiuni rămân legate între ele, iar ordinea rândurilor din fișier nu este neapărat ordinea din captură, deci independența nu poate fi confirmată (aceeași limită ca la 9.3). Dacă nu se respectă, p și R² nu sunt de încredere."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizii",
   "text": "regresia 1 folosește perechea numerică cea mai corelată (Spearman 0,94), care are și o explicație: mesajul MQTT stă în conținutul TCP. Regresia 2 verifică dacă timpul dintre pachete se poate prezice din dimensiunea lor. Regresia 3 repetă regresia 1 pe fiecare clasă, pentru că în capitolul 6 clasele diferă mult."
  },
  {
   "tip": "sectiune",
   "titlu": "8.1 Regresia 1: mqtt.len în funcție de tcp.len, pe tot setul"
  },
  {
   "tip": "text",
   "text": "Ipoteza: tcp.len (conținutul TCP) determină mqtt.len, pentru că mesajul MQTT stă în conținutul TCP. H0: panta este 0, adică tcp.len nu influențează mqtt.len. Modelul este mqtt.len = β0 + β1 · tcp.len."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "facem regresia pe valorile brute și după transformarea ln(1 + x). Valorile extreme (flood) strică relația liniară, iar logaritmul le micșorează; se adună 1 pentru că multe valori sunt 0, iar ln(0) nu există."
  },
  {
   "tip": "imagine",
   "src": "reg1_scatter.png"
  },
  {
   "tip": "tabel",
   "antet": [
    "Parametru",
    "Valori brute",
    "După logaritm",
    "Interpretare"
   ],
   "randuri": [
    [
     "Intercept (β0)",
     "29,00",
     "0,110",
     "Valoarea prezisă pentru mqtt.len când tcp.len = 0. La valorile brute, 29 de bytes nu are sens: un pachet fără conținut TCP nu are mesaj MQTT."
    ],
    [
     "Pantă (β1)",
     "0,0179",
     "0,778",
     "Brute: la fiecare byte în plus în tcp.len, mqtt.len crește în medie cu 0,018. Logaritm: la o creștere de 1% a lui tcp.len, mqtt.len crește cu aproximativ 0,78%."
    ],
    [
     "p pentru pantă",
     "sub 0,001",
     "sub 0,001",
     "Panta diferă de 0. Cu atâtea pachete, p iese mic aproape oricum, deci nu spune cât de bună e dreapta."
    ],
    [
     "R²",
     "0,075",
     "0,843",
     "Brute: tcp.len explică doar 7,5% din variația lui mqtt.len. După logaritm: 84,3%."
    ]
   ]
  },
  {
   "tip": "text",
   "eticheta": "Calcul pas cu pas (valori brute)",
   "text": "x̄ = 152,59 și ȳ = 31,72. β1 = 5,283 · 10⁹ / 2,958 · 10¹¹ = 0,0179. β0 = 31,72 - 0,0179 · 152,59 = 29,00. Suma pătratelor reziduurilor = 1,159 · 10⁹, iar suma (y - ȳ)² = 1,253 · 10⁹, deci R² = 1 - 1,159 / 1,253 = 0,075. Pe valorile logaritmate se aplică aceleași formule."
  },
  {
   "tip": "text",
   "eticheta": "Predicție",
   "text": "pentru tcp.len = 13, dreapta dă mqtt.len = 29,00 + 0,0179 · 13 = 29,2, deși valoarea tipică reală este 11. Dreapta pe tot setul prezice prost."
  },
  {
   "tip": "text",
   "text": "Observații:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Corelația Spearman dintre cele două variabile era 0,94 (secțiunea 7), dar R² pe valori brute este doar 0,075. Spearman măsoară dacă cresc împreună, pe ranguri, iar regresia cere o dreaptă pe valorile reale.",
    "Cauza se vede în scatter: o parte din pachetele dos au mqtt.len în jur de 170, la valori foarte diferite ale lui tcp.len, iar pachetele flood au tcp.len până la 32.768 cu mqtt.len de cel mult 16. Aceste grupuri și valori extreme trag dreapta, deci condițiile 1 și 2 (relație liniară, fără valori extreme) nu sunt respectate.",
    "Reziduurile (graficul de mai jos) nu au împrăștiere constantă și nu sunt normale: histograma nu urmează curba normală, iar asimetria lor este 1,06 și kurtosis 9,5 la valorile brute, respectiv -0,73 și 5,9 după logaritm. Condițiile 3 și 4 nu sunt respectate."
   ]
  },
  {
   "tip": "imagine",
   "src": "reg1_reziduuri.png"
  },
  {
   "tip": "sectiune",
   "titlu": "8.2 Regresia 2: tcp.time_delta în funcție de tcp.len și mqtt.len (multiplă)"
  },
  {
   "tip": "text",
   "text": "Ipoteza: dimensiunea pachetului influențează timpul scurs de la pachetul anterior. H0: ambele pante sunt 0. Modelul este tcp.time_delta = β0 + β1 · tcp.len + β2 · mqtt.len, cu timpul în secunde."
  },
  {
   "tip": "imagine",
   "src": "reg2_scatter.png"
  },
  {
   "tip": "text",
   "text": "Scatter-ul arată că timpul dintre pachete este aproape mereu 0 (sub o secundă), oricare ar fi lungimea; doar câteva pachete au 58 până la 60 de secunde. Nu se vede nicio dreaptă."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "regresie multiplă cu ambele lungimi, ca să vedem efectul fiecăreia când cealaltă rămâne fixă."
  },
  {
   "tip": "tabel",
   "antet": [
    "Parametru",
    "Valoare",
    "p",
    "Interpretare"
   ],
   "randuri": [
    [
     "Intercept (β0)",
     "0,319",
     "sub 0,001",
     "Timpul prezis (în secunde) când ambele lungimi sunt 0."
    ],
    [
     "tcp.len (β1)",
     "1,07e-05",
     "0,043 (*)",
     "La fiecare byte în plus în tcp.len, timpul crește cu 0,00001 secunde, ținând mqtt.len fix. Efect neglijabil, iar p trece abia de 0,05."
    ],
    [
     "mqtt.len (β2)",
     "-0,0017",
     "sub 0,001 (***)",
     "La fiecare byte în plus în mqtt.len, timpul scade cu 0,0017 secunde, ținând tcp.len fix. La 100 de bytes, scade cu 0,17 secunde, mic față de abaterea standard a lui tcp.time_delta (2,78)."
    ],
    [
     "R²",
     "0,0014",
     "",
     "Cele două variabile explică doar 0,14% din variația timpului dintre pachete."
    ]
   ]
  },
  {
   "tip": "text",
   "eticheta": "Predicție",
   "text": "pentru tcp.len = 13 și mqtt.len = 11, dreapta dă 0,319 + 0,0000107 · 13 - 0,0017 · 11 = 0,30 secunde, deși mediana traficului normal este 0,000076 secunde."
  },
  {
   "tip": "text",
   "text": "Concluzie: regresia nu are valoare predictivă (R² = 0,0014). Timpul dintre pachete nu se poate prezice din dimensiunea lor, în acord cu corelațiile Spearman de cel mult 0,25 din secțiunea 7. Reziduurile sunt departe de normal: histograma nu urmează curba normală (asimetria 20,7, kurtosis 432). Graficul reziduurilor arată și câteva pachete cu reziduuri de aproape 60 de secunde, iar restul stau strânse lângă 0: există valori extreme, iar împrăștierea nu este aceeași, deci nici condițiile 2 și 3 nu sunt respectate."
  },
  {
   "tip": "imagine",
   "src": "reg2_reziduuri.png"
  },
  {
   "tip": "sectiune",
   "titlu": "8.3 Regresia 3: aceeași regresie (mqtt.len în funcție de tcp.len), separat pe clase"
  },
  {
   "tip": "text",
   "text": "Ipoteza: relația dintre tcp.len și mqtt.len este diferită la traficul normal și la fiecare atac. Comparăm pantele și R² între clase, fără un test formal între pante. Ultima coloană arată R² după transformarea logaritmică."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "aceleași formule ca la 8.1, aplicate separat pe pachetele fiecărei clase (6 regresii)."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "condițiile nu le verificăm separat pe fiecare clasă, pentru că aici regresia servește doar la compararea pantelor și a R² între clase; nu facem predicții și nu interpretăm p."
  },
  {
   "tip": "imagine",
   "src": "reg3_pe_clase.png"
  },
  {
   "tip": "tabel",
   "antet": [
    "Clasă",
    "Pachete",
    "Intercept",
    "Pantă",
    "R² (brute)",
    "R² (logaritm)"
   ],
   "randuri": [
    [
     "legitimate",
     "165.463",
     "-0,10",
     "0,8502",
     "0,997",
     "0,987"
    ],
    [
     "dos",
     "130.223",
     "41,60",
     "0,0945",
     "0,405",
     "0,807"
    ],
    [
     "bruteforce",
     "14.501",
     "2,53",
     "0,1166",
     "0,167",
     "0,979"
    ],
    [
     "malformed",
     "10.924",
     "3,68",
     "0,1233",
     "0,148",
     "0,903"
    ],
    [
     "slowite",
     "9.202",
     "3,71",
     "-0,0446",
     "0,002",
     "0,084"
    ],
    [
     "flood",
     "613",
     "1,53",
     "0,0004",
     "0,762",
     "0,964"
    ]
   ]
  },
  {
   "tip": "text",
   "text": "Observații:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Normal (legitimate): dreapta se potrivește aproape perfect (R² = 0,997, panta 0,850). Aici tcp.len ia doar valori între 0 și 20, iar mqtt.len urmează tcp.len.",
    "La toate atacurile relația se strică: R² este 0,405 la dos, 0,167 la bruteforce, 0,148 la malformed și 0,002 la slowite (panta este chiar negativă, -0,045). La flood R² este 0,762, dar panta este practic 0 (0,0004): mqtt.len rămâne în jur de 15 oricât de mare este tcp.len.",
    "După logaritm, R² crește mult la bruteforce (0,979), malformed (0,903) și flood (0,964), dar rămâne mic la slowite (0,084). Transformarea ajută la unele clase, nu la toate.",
    "Față de secțiunea 7.3: corelația Spearman era 1,00 la bruteforce și malformed, dar R² liniar pe valori brute este 0,167 și 0,148. Spearman arată că variabilele cresc împreună, iar regresia liniară cere ca punctele să stea pe o dreaptă, ceea ce nu se întâmplă cu valori extreme."
   ]
  },
  {
   "tip": "text",
   "text": "Ca linie de referință: la tcp.len = 13, dreapta traficului normal prezice mqtt.len = 11,0 (valoarea reală tipică este 11). Un pachet flood, cu tcp.len = 32.000 și mqtt.len în jur de 15, cade departe de această dreaptă (la normal tcp.len nu depășește 20, deci pentru 32.000 dreapta este extrapolată)."
  }
 ]
}

export default date
