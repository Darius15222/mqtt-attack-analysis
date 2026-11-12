import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "7. Matrici de corelație",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Din capitolul 6 știm că variabilele diferă între clase. Acum vedem care variabile spun același lucru: dacă două variabile sunt foarte legate, una e de prisos, iar la regresie (capitolele 8 și 9) două variabile foarte legate se încurcă una pe alta."
  },
  {
   "tip": "parte",
   "fel": "ipoteza",
   "titlu": "Ipoteza"
  },
  {
   "tip": "text",
   "eticheta": "Ce credem",
   "text": "lungimea conținutului TCP (tcp.len) și lungimea mesajului MQTT (mqtt.len) sunt puternic legate, pentru că mesajul MQTT stă în conținutul TCP. Câmpurile de conectare apar împreună, deci sunt și ele legate."
  },
  {
   "tip": "text",
   "eticheta": "Ce testăm",
   "text": "H0: corelația dintre două variabile este 0, adică nu sunt legate. Dacă p este sub 0,05, respingem H0."
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
   "text": "cele 13 variabile care au o ordine:",
   "puncte": [
    "4 numerice: tcp.time_delta, tcp.len, mqtt.len, mqtt.kalive;",
    "mqtt.qos (ordinală);",
    "8 binare: mqtt.dupflag, mqtt.retain, mqtt.conflag.cleansess, mqtt.conflag.passwd, mqtt.conflag.uname, mqtt.proto_len, mqtt.ver, mqtt.conack.val."
   ]
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "",
   "puncte": [
    "Metoda: corelația Spearman, pe ranguri;",
    "7.1 corelația fiecărei perechi, pe tot setul;",
    "7.2 perechile numerice cele mai corelate, cu R și p;",
    "7.3 aceleași corelații, separat pe fiecare clasă;",
    "7.4 corelația Pearson pentru perechile folosite în regresii."
   ]
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "valori între -1 și 1: hărți de culori (7.1, 7.3), graficul perechilor (7.2) și tabelul Pearson față de Spearman (7.4)."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizii",
   "text": "",
   "puncte": [
    "nu intră variabilele categoriale (tcp.flags, mqtt.hdrflags, mqtt.msgtype, mqtt.conflags, mqtt.protoname, mqtt.conack.flags) și nici ținta: valorile lor sunt coduri, nu cantități (0x00000018 nu este „mai mult” decât 0x00000010), deci o corelație calculată pe ele ar depinde doar de cum sunt numerotate codurile; legătura lor cu clasa se măsoară cu χ² (capitolul 6);",
    "binarele intră, pentru că au doar două valori, iar cele două valori au sens (lipsă sau prezență)."
   ]
  },
  {
   "tip": "parte",
   "fel": "demonstratie",
   "titlu": "Demonstrația"
  },
  {
   "tip": "subtitlu",
   "text": "Metoda: corelația Spearman"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "variabilele nu au distribuție normală și au valori extreme (capitolul 5). Spearman lucrează pe ranguri (locul fiecărei valori în ordine), deci un pachet uriaș contează doar ca „cel mai mare”, nu trage rezultatul. Pearson, pe valorile reale, apare separat în 7.4, pentru că de el depinde regresia liniară."
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
    "valorile fiecărei variabile se înlocuiesc cu rangul lor (cea mai mică primește rangul 1; valorile egale primesc media rangurilor lor);",
    "pe ranguri se aplică formula de corelație (secțiunea 4); fără valori egale, ea devine R = 1 - 6 · suma d² / (n · (n² - 1)), cu d = diferența dintre cele două ranguri ale aceluiași pachet;",
    "R = 1: cele două variabile cresc mereu împreună; R = 0: nicio legătură; R = -1: când una crește, cealaltă scade."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
   "text": "4 pachete, cu tcp.len 10, 12, 14, 20 și mqtt.len 8, 10, 12, 9:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "rangurile lui tcp.len: 1, 2, 3, 4; rangurile lui mqtt.len: 1, 3, 4, 2;",
    "d = 0, -1, -1, 2, deci suma d² = 0 + 1 + 1 + 4 = 6;",
    "R = 1 - 6 · 6 / (4 · 15) = 1 - 36 / 60 = 0,40: o legătură slabă, pentru că al patrulea pachet strică ordinea."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "R spune cât de des cele două variabile cresc împreună. p spune doar dacă legătura poate fi întâmplătoare; cu sute de mii de pachete, p iese mic chiar și la R mic."
  },
  {
   "tip": "sectiune",
   "titlu": "7.1 Tot setul"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "o privire de ansamblu: ce perechi sunt legate pe toate cele 330.926 de pachete."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "corelația Spearman a fiecărei perechi, ca hartă de culori:"
  },
  {
   "tip": "imagine",
   "src": "corr_tot.png",
   "latime": 1170,
   "inaltime": 988
  },
  {
   "tip": "text",
   "text": "Între numerice, tcp.len și mqtt.len au corelația 0,94 (cea mai puternică pereche). tcp.time_delta are cel mult 0,25 cu celelalte, iar mqtt.kalive 0,12 cu mqtt.len. mqtt.qos are 0,66 cu mqtt.len și 0,65 cu tcp.len."
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "variabilele de conectare (mqtt.conflag.cleansess, mqtt.kalive, mqtt.proto_len, mqtt.ver) au corelație 1 între ele: sunt nenule în aceleași 3.282 de pachete de conectare, deci sunt o singură informație repetată. mqtt.conflag.passwd și mqtt.conflag.uname au corelație 1 între ele și 0,65 până la 0,66 cu celelalte."
  },
  {
   "tip": "sectiune",
   "titlu": "7.2 Perechile numerice cele mai corelate, cu R și p"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "harta dă doar cifra; graficul arată cum stau pachetele pentru cele 3 perechi numerice cu cel mai mare R."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "R și p sunt calculate pe toate cele 330.926 de pachete; graficul desenează doar 8.000 de pachete alese la întâmplare, ca punctele să se vadă. Pe axe sunt rangurile, iar linia este dreapta care trece cel mai aproape de puncte. Punctele se aliniază în benzi orizontale și verticale pentru că multe pachete au aceeași valoare."
  },
  {
   "tip": "imagine",
   "src": "corr_scatter.png",
   "latime": 1560,
   "inaltime": 494
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "p este sub 0,001 la toate trei, dar doar prima pereche (tcp.len cu mqtt.len, R = 0,94) are legătură puternică. Cu atâtea rânduri, p mic nu înseamnă corelație mare."
  },
  {
   "tip": "sectiune",
   "titlu": "7.3 Pe categorii"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "o legătură pe tot setul poate veni din amestecul claselor; separat pe clase vedem dacă ea există și în interiorul fiecăreia."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "aceleași 13 variabile, calculate separat pentru fiecare clasă. Gri = variabila este constantă în clasa respectivă."
  },
  {
   "tip": "galerie",
   "imagini": [
    {
     "tip": "imagine",
     "src": "corr_legitimate.png",
     "latime": 1170,
     "inaltime": 988,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "corr_dos.png",
     "latime": 1170,
     "inaltime": 988,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "corr_bruteforce.png",
     "latime": 1170,
     "inaltime": 988,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "corr_malformed.png",
     "latime": 1170,
     "inaltime": 988,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "corr_slowite.png",
     "latime": 1170,
     "inaltime": 988,
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "corr_flood.png",
     "latime": 1170,
     "inaltime": 988,
     "legenda": ""
    }
   ]
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "normal (legitimate): 10 din cele 13 variabile sunt constante (toate binarele, mqtt.qos și mqtt.kalive). Rămân doar tcp.time_delta, tcp.len și mqtt.len, iar tcp.len cu mqtt.len au corelația 1,00;",
    "la atacuri variază mai multe variabile (2 până la 6 constante, față de 10 la normal). La bruteforce sunt constante doar mqtt.qos și mqtt.dupflag; la dos sunt constante mqtt.retain, mqtt.conflag.passwd, mqtt.conflag.uname și mqtt.conack.val;",
    "corelația dintre tcp.len și mqtt.len este 1,00 la normal, bruteforce și malformed, 0,90 la dos, 0,90 la flood și 0,60 la slowite."
   ]
  },
  {
   "tip": "text",
   "text": "Perechile cu corelație 1 (rotunjit: R de cel puțin 0,995) sunt mai multe la atacuri:"
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "dos: 6 din 36;",
    "bruteforce: 16 din 55;",
    "malformed: 7 din 28;",
    "slowite: 6 din 21;",
    "flood: 6 din 21."
   ]
  },
  {
   "tip": "text",
   "eticheta": "Ce înseamnă",
   "text": "redundanța din grupul de conectare apare la fiecare atac. Relația tcp.len - mqtt.len diferă de la o clasă la alta, de aceea regresia 3 (8.3) se face pe fiecare clasă."
  },
  {
   "tip": "sectiune",
   "titlu": "7.4 Corelația Pearson"
  },
  {
   "tip": "text",
   "eticheta": "De ce",
   "text": "regresia liniară (capitolul 8) lucrează pe valorile reale, nu pe ranguri. Pearson măsoară cât de strâns stau punctele pe o dreaptă și este legat direct de regresie: R² = r²."
  },
  {
   "tip": "text",
   "eticheta": "Cum se calculează",
   "text": "r = suma (x - x̄)(y - ȳ) / rădăcina din [suma (x - x̄)² · suma (y - ȳ)²] (secțiunea 4)."
  },
  {
   "tip": "text",
   "eticheta": "Exemplu",
   "text": "4 pachete cu tcp.len 10, 12, 14, 32.000 și mqtt.len 8, 10, 12, 15. Ordinea este aceeași la amândouă, deci Spearman = 1. Pearson este doar 0,84: pachetul de 32.000 bytes stă departe de dreapta celorlalte trei."
  },
  {
   "tip": "text",
   "eticheta": "Pe datele noastre",
   "text": "perechile din regresiile liniare (secțiunea 8) și fiecare variabilă folosită la regresia logistică (secțiunea 9), față de ținta binară is_attack (0 = legitimate, 1 = oricare dintre atacuri)."
  },
  {
   "tip": "text",
   "eticheta": "Calcul pentru tcp.len cu mqtt.len",
   "text": ""
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "x̄ = 152,59 și ȳ = 31,72;",
    "suma (x - x̄)(y - ȳ) = 5,283 · 10⁹;",
    "suma (x - x̄)² = 2,958 · 10¹¹;",
    "suma (y - ȳ)² = 1,253 · 10⁹;",
    "r = 5,283 · 10⁹ / rădăcina din (2,958 · 10¹¹ · 1,253 · 10⁹) = 0,274;",
    "p se obține din t = r · rădăcina din (n - 2) / rădăcina din (1 - r²)."
   ]
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "tabelul are doar perechile folosite mai departe, în regresii; celelalte nu sunt necesare."
  },
  {
   "tip": "tabel",
   "antet": [
    "Pereche",
    "Pearson r",
    "p (Pearson)",
    "Spearman R",
    "p (Spearman)"
   ],
   "randuri": [
    [
     "tcp.len cu mqtt.len",
     "0,274",
     "sub 0,001",
     "0,939",
     "sub 0,001"
    ],
    [
     "tcp.time_delta cu tcp.len",
     "-0,007",
     "sub 0,001",
     "0,247",
     "sub 0,001"
    ],
    [
     "tcp.time_delta cu mqtt.len",
     "-0,037",
     "sub 0,001",
     "0,246",
     "sub 0,001"
    ],
    [
     "tcp.len cu is_attack",
     "0,153",
     "sub 0,001",
     "0,147",
     "sub 0,001"
    ],
    [
     "mqtt.len cu is_attack",
     "0,409",
     "sub 0,001",
     "0,058",
     "sub 0,001"
    ],
    [
     "tcp.time_delta cu is_attack",
     "-0,091",
     "sub 0,001",
     "-0,301",
     "sub 0,001"
    ],
    [
     "mqtt.qos cu is_attack",
     "0,444",
     "sub 0,001",
     "0,444",
     "sub 0,001"
    ],
    [
     "mqtt.dupflag cu is_attack",
     "0,245",
     "sub 0,001",
     "0,245",
     "sub 0,001"
    ]
   ]
  },
  {
   "tip": "imagine",
   "src": "corr_pearson_spearman.png",
   "latime": 1253,
   "inaltime": 587
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
    "tcp.len cu mqtt.len: Pearson este 0,274, față de 0,939 la Spearman. Valorile extreme (flood, cu tcp.len până la 32.768 și mqtt.len mic) trag Pearson în jos, ca în exemplul de mai sus. r² = 0,274² = 0,075, adică exact R² din regresia liniară 1 (secțiunea 8.1);",
    "perechile cu tcp.time_delta au Pearson aproape de 0 (-0,007 și -0,037), dar Spearman în jur de 0,25: legătura există pe ranguri, nu este liniară;",
    "față de is_attack, cea mai mare corelație o are mqtt.qos (0,444), apoi mqtt.len (0,409). La mqtt.len, Spearman este doar 0,058: la atac, mqtt.len este fie mai mic decât la normal (mediana 2 față de 10), fie mult mai mare (Q3 = 165 față de 11). Pe ranguri, cele două efecte aproape se anulează; pe valorile reale, un mqtt.len de 165 cântărește mult mai mult decât unul de 2, deci câștigă valorile mari."
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
    "H0 se respinge: tcp.len și mqtt.len sunt puternic legate pe ranguri (R = 0,94, p sub 0,001, 7.1). Pe valorile reale legătura este slabă (Pearson 0,274, 7.4), din cauza pachetelor flood foarte mari. Din această pereche pornește regresia 1 (8.1).",
    "tcp.time_delta are corelații slabe cu celelalte 12 variabile (cel mult 0,25). Regresia 2 (8.2) verifică dacă timpul se poate totuși prezice din lungimi.",
    "mqtt.qos are 0,66 cu mqtt.len pe ranguri, iar pe valorile reale chiar 0,99 (Pearson, graficul din 7.4): toate cele 54.431 de pachete cu mqtt.qos = 1 sunt dos și au mqtt.len între 149 și 190, iar restul au în medie 4,7. De aici VIF-ul mare (42,5 și 42,9) de la regresia logistică (9.2).",
    "Grupul de conectare are corelație 1 (7.1). Într-un model ar ajunge o singură variabilă din grup.",
    "Pe clase, corelația tcp.len cu mqtt.len diferă (1,00 la normal, 0,60 la slowite, 7.3). De aici regresia 3 (8.3), pe fiecare clasă."
   ]
  }
 ]
}

export default date
