import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "8. Regresie liniară",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Din capitolul 7 știm că tcp.len și mqtt.len cresc împreună (R = 0,94). Acum vedem dacă o valoare a unui pachet se poate calcula din alta. Exemplul principal sunt cele două lungimi: tcp.len este mărimea conținutului TCP (plicul), iar mqtt.len este lungimea mesajului MQTT dus în el (scrisoarea din plic). Dacă scrisoarea ocupă mereu aceeași parte din plic, din mărimea plicului aflăm lungimea scrisorii fără s-o mai citim. La un atac, scrisoarea poate lipsi sau poate fi ruptă în mai multe plicuri, iar regula nu mai merge; tocmai asta ne interesează."
  },
  {
   "tip": "parte",
   "fel": "ipoteza",
   "titlu": "Ipoteza"
  },
  {
   "tip": "text",
   "eticheta": "Ce credem",
   "text": "lungimea conținutului TCP (tcp.len) determină lungimea mesajului MQTT (mqtt.len), pentru că mesajul MQTT stă în conținutul TCP. Verificăm și dacă timpul dintre pachete depinde de lungimea lor și dacă legătura dintre lungimi este alta la atacuri decât la traficul normal."
  },
  {
   "tip": "text",
   "eticheta": "Ce testăm",
   "text": "H0 (ipoteza de nul) spune că panta este 0, adică X nu influențează Y. Dacă p este sub 0,05, respingem H0. 8.1 și 8.2 testează această ipoteză; 8.3 doar compară pantele și R² între clase, fără test."
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
   "text": "toate cele 330.926 de pachete; toate calculele folosesc toate pachetele. Doar graficele cu puncte desenează 8.000 de pachete alese la întâmplare (la 8.3, cel mult 3.000 pe clasă): cu toate, punctele s-ar suprapune într-o pată."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "",
   "puncte": [
    "Metoda: dreapta celor mai mici pătrate și condițiile ei;",
    "8.1 mqtt.len din tcp.len, pe tot setul;",
    "8.2 tcp.time_delta din tcp.len și mqtt.len;",
    "8.3 mqtt.len din tcp.len, separat pe fiecare clasă."
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "pentru fiecare regresie: β0, β1 (și β2 la regresia multiplă), p pentru fiecare coeficient, R², reziduurile și graficele lor."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "calculele s-au făcut în Python (statsmodels, metoda celor mai mici pătrate)."
  },
  {
   "tip": "parte",
   "fel": "demonstratie",
   "titlu": "Demonstrația"
  },
  {
   "tip": "subtitlu",
   "text": "Metoda: dreapta celor mai mici pătrate"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "vrem o formulă simplă care, din X (ce știm), dă Y (ce prezicem): Y = β0 + β1 · X."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "β1 = suma (x - x̄)(y - ȳ) / suma (x - x̄)²: panta, adică cu cât crește Y când X crește cu 1;",
    "β0 = ȳ - β1 · x̄: valoarea prezisă a lui Y când X este 0;",
    "reziduu = valoarea reală minus valoarea prezisă; dreapta aleasă are cea mai mică sumă a pătratelor reziduurilor;",
    "R² = 1 - suma reziduurilor² / suma (y - ȳ)²: cât de bine se potrivește dreapta, de la 0 (deloc) la 1 (perfect);",
    "la mai multe variabile X, coeficienții se rezolvă împreună, cu aceeași regulă."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
   "text": "punctele (1, 2), (2, 3), (3, 7):"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "x̄ = 2, ȳ = 4; suma (x - x̄)(y - ȳ) = (-1)(-2) + 0 + (1)(3) = 5; suma (x - x̄)² = 2;",
    "β1 = 5 / 2 = 2,5 și β0 = 4 - 2,5 · 2 = -1, deci dreapta este y = -1 + 2,5 · x;",
    "valorile prezise: 1,5, 4 și 6,5; reziduurile: 0,5, -1 și 0,5; suma pătratelor lor = 1,5;",
    "suma (y - ȳ)² = 4 + 1 + 9 = 14, deci R² = 1 - 1,5 / 14 = 0,89."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Condiții verificate",
   "text": "dacă nu se respectă, p și R² nu sunt de încredere."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "relația este liniară (scatter);",
    "nu sunt valori extreme care trag dreapta (scatter);",
    "reziduurile au aceeași împrăștiere pe toată dreapta (graficul reziduurilor);",
    "reziduurile sunt aproximativ normale (histograma reziduurilor, fără 1% din valori la fiecare capăt, ca forma să se vadă, cu curba normală suprapusă, plus asimetria și kurtosis între -1 și 1);",
    "variabilele sunt continue: respectată, tcp.len și mqtt.len sunt în bytes, tcp.time_delta în secunde;",
    "observațiile sunt independente: testul Durbin-Watson compară fiecare reziduu cu cel de pe rândul anterior; o valoare de 2 înseamnă că reziduurile vecine nu sunt legate. Aici iese 2,00 la regresia 1 și 1,99 la regresia 2, dar independența tot nu poate fi confirmată: pachetele aceleiași conexiuni rămân legate între ele (aceeași limită ca la 9.2)."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "R² aproape de 1 arată că dreapta merge; p arată doar dacă panta este diferită de 0. La 8.1 și 8.2 urmăm aceeași ordine: scatter, coeficienții cu p și R², condițiile, predicția. La 8.3 doar calculăm dreapta pe fiecare clasă și comparăm pantele și R²."
  },
  {
   "tip": "sectiune",
   "titlu": "8.1 Regresia 1: mqtt.len în funcție de tcp.len, pe tot setul"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "este perechea numerică cea mai corelată (Spearman 0,94) și are o explicație: mesajul MQTT stă în conținutul TCP."
  },
  {
   "tip": "text",
   "eticheta": "Ipoteza",
   "text": "tcp.len determină mqtt.len. H0: panta este 0, adică tcp.len nu influențează mqtt.len. Modelul este mqtt.len = β0 + β1 · tcp.len."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "facem regresia pe valorile brute și după transformarea ln(1 + x). Valorile extreme (flood) strică relația liniară, iar logaritmul le micșorează; se adună 1 pentru că multe valori sunt 0, iar ln(0) nu există."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": ""
  },
  {
   "tip": "imagine",
   "src": "reg1_scatter.png",
   "latime": 1430,
   "inaltime": 546
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
     "Brute: la fiecare byte în plus în tcp.len, mqtt.len crește în medie cu 0,018. Logaritm: la o creștere de 1% a lui (1 + tcp.len), (1 + mqtt.len) crește cu aproximativ 0,78%; la valori mari, unde 1 nu mai contează, același lucru e valabil direct pentru tcp.len și mqtt.len."
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
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "x̄ = 152,59 și ȳ = 31,72;",
    "β1 = 5,283 · 10⁹ / 2,958 · 10¹¹ = 0,0179 (0,017856 nerotunjit);",
    "β0 = 31,72 - 0,017856 · 152,59 = 29,00;",
    "suma pătratelor reziduurilor = 1,159 · 10⁹, iar suma (y - ȳ)² = 1,253 · 10⁹, deci R² = 1 - 1,159 / 1,253 = 0,075."
   ]
  },
  {
   "tip": "text",
   "text": "Pe valorile logaritmate se aplică aceleași formule."
  },
  {
   "tip": "text",
   "eticheta": "Predicție",
   "text": "pentru tcp.len = 13, dreapta dă mqtt.len = 29,00 + 0,0179 · 13 = 29,2, deși valoarea tipică reală este 11."
  },
  {
   "tip": "imagine",
   "src": "reg1_reziduuri.png",
   "latime": 1430,
   "inaltime": 910
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "dreapta pe tot setul prezice prost:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "corelația Spearman dintre cele două variabile era 0,94 (secțiunea 7), dar R² pe valori brute este doar 0,075. Spearman măsoară dacă cresc împreună, pe ranguri, iar regresia cere o dreaptă pe valorile reale;",
    "cauza se vede în scatter: o parte din pachetele dos au mqtt.len în jur de 170, la valori foarte diferite ale lui tcp.len, iar pachetele flood mari (tcp.len peste 1.460, până la 32.768) au mqtt.len de cel mult 16. Aceste grupuri și valori extreme trag dreapta, deci condițiile despre relația liniară și despre valorile extreme nu sunt respectate;",
    "reziduurile (graficul de mai sus) nu au împrăștiere constantă și nu sunt normale: histograma nu urmează curba normală, iar asimetria lor este 1,06 și kurtosis 9,5 la valorile brute, respectiv -0,73 și 5,9 după logaritm. Nici condițiile despre împrăștierea și forma reziduurilor nu sunt respectate."
   ]
  },
  {
   "tip": "sectiune",
   "titlu": "8.2 Regresia 2: tcp.time_delta în funcție de tcp.len și mqtt.len (multiplă)"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "verificăm dacă timpul dintre pachete se poate prezice din dimensiunea lor."
  },
  {
   "tip": "text",
   "eticheta": "Ipoteza",
   "text": "dimensiunea pachetului influențează timpul scurs de la pachetul anterior. H0: ambele pante sunt 0. Modelul este tcp.time_delta = β0 + β1 · tcp.len + β2 · mqtt.len, cu timpul în secunde."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "regresie multiplă cu ambele lungimi, ca să vedem efectul fiecăreia când cealaltă rămâne fixă."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "scatter-ul arată că timpul dintre pachete este aproape mereu sub o secundă (96,7% din pachete), oricare ar fi lungimea; 730 de pachete au 58 până la 60 de secunde. Nu se vede nicio dreaptă."
  },
  {
   "tip": "imagine",
   "src": "reg2_scatter.png",
   "latime": 1200,
   "inaltime": 450
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
   "tip": "imagine",
   "src": "reg2_reziduuri.png",
   "latime": 1430,
   "inaltime": 546
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "regresia nu are valoare predictivă (R² = 0,0014). Timpul dintre pachete nu se poate prezice din dimensiunea lor, în acord cu corelațiile Spearman de cel mult 0,25 din secțiunea 7. Modelul prezice chiar timpi negativi pentru 44 de pachete (până la -0,85 secunde), deși un timp nu poate fi negativ. Reziduurile sunt departe de normal: histograma nu urmează curba normală (asimetria 20,7, kurtosis 432). Graficul reziduurilor arată și câteva pachete cu reziduuri de aproape 60 de secunde, iar restul stau strânse lângă 0: există valori extreme, iar împrăștierea nu este aceeași, deci nici condițiile despre valorile extreme și despre împrăștierea reziduurilor nu sunt respectate."
  },
  {
   "tip": "sectiune",
   "titlu": "8.3 Regresia 3: aceeași regresie (mqtt.len în funcție de tcp.len), separat pe clase"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "în capitolele 6 și 7 clasele diferă mult, deci o singură dreaptă pe tot setul amestecă reguli diferite."
  },
  {
   "tip": "text",
   "eticheta": "Ipoteza",
   "text": "relația dintre tcp.len și mqtt.len este diferită la traficul normal și la fiecare atac. Comparăm pantele și R² între clase, fără un test formal între pante."
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
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "ultima coloană a tabelului arată R² după transformarea logaritmică."
  },
  {
   "tip": "imagine",
   "src": "reg3_pe_clase.png",
   "latime": 1690,
   "inaltime": 910
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
   "eticheta": "Ce înseamnă",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "normal (legitimate): dreapta se potrivește aproape perfect (R² = 0,997, panta 0,850). Aici tcp.len ia doar valori între 0 și 20, iar mqtt.len urmează tcp.len;",
    "la toate atacurile relația se strică: R² este 0,405 la dos, 0,167 la bruteforce, 0,148 la malformed și 0,002 la slowite (panta este chiar negativă, -0,045). La flood R² este 0,762, dar panta este practic 0 (0,0004): mqtt.len rămâne în jur de 15 oricât de mare este tcp.len. R² iese totuși mare pentru că flood are două grupuri, 310 pachete goale (tcp.len și mqtt.len 0) și 293 de pachete uriașe cu mqtt.len de cel mult 16, iar dreapta le unește;",
    "după logaritm, R² crește mult la bruteforce (0,979), malformed (0,903) și flood (0,964), dar rămâne mic la slowite (0,084). Transformarea ajută la unele clase, nu la toate;",
    "față de secțiunea 7.3: corelația Spearman era 1,00 la bruteforce și malformed, dar R² liniar pe valori brute este 0,167 și 0,148. Spearman arată că variabilele cresc împreună, iar regresia liniară cere ca punctele să stea pe o dreaptă, ceea ce nu se întâmplă cu valori extreme."
   ]
  },
  {
   "tip": "text",
   "text": "Ca linie de referință: la tcp.len = 13, dreapta traficului normal prezice mqtt.len = 11,0 (valoarea reală tipică este 11). Un pachet flood, cu tcp.len = 32.000 și mqtt.len în jur de 15, cade departe de această dreaptă (la normal tcp.len nu depășește 20, deci pentru 32.000 dreapta este extrapolată, adică folosită mult în afara valorilor din care a fost calculată)."
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
    "Pe tot setul, o dreaptă leagă slab tcp.len de mqtt.len: R² = 0,075, adică dreapta explică doar 7,5% din variație. După logaritm, R² urcă la 0,843, dar condițiile regresiei tot nu sunt respectate (8.1).",
    "Timpul dintre pachete nu se poate prezice din lungimea lor (R² = 0,0014, 8.2).",
    "La traficul normal, mqtt.len urmează aproape perfect tcp.len (R² = 0,997): toate pachetele normale stau la cel mult 2 bytes de dreapta lor. La atacuri legătura se strică (R² între 0,002 și 0,762, 8.3).",
    "Dreapta traficului normal nu este însă un detector bun: majoritatea pachetelor bruteforce (90%), malformed (97%) și slowite (78%) stau și ele pe ea, mai ales pachetele goale. Se abat de la ea mai ales pachetele dos (doar 38% pe dreaptă) și flood (51%).",
    "Valoarea p (sub 0,001 aproape peste tot; doar tcp.len are 0,043 la 8.2) nu ajută aici: cu 330.926 de pachete, aproape orice pantă iese „diferită de 0”. Ce contează este R²."
   ]
  }
 ]
}

export default date
