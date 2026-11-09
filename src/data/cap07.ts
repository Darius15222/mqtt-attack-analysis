import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "7. Matrici de corelație",
 "blocuri": [
  {
   "tip": "text",
   "text": "Corelația arată cât de strâns sunt legate două variabile între ele. Dacă două variabile spun același lucru, una e de prisos, iar la regresie două variabile foarte corelate se încurcă una pe alta."
  },
  {
   "tip": "pas",
   "fel": "intrare",
   "eticheta": "Intrare",
   "text": "cele 13 variabile care au o ordine: 4 numerice (tcp.time_delta, tcp.len, mqtt.len, mqtt.kalive), mqtt.qos (ordinală) și 8 binare (mqtt.dupflag, mqtt.retain, mqtt.conflag.cleansess, mqtt.conflag.passwd, mqtt.conflag.uname, mqtt.proto_len, mqtt.ver, mqtt.conack.val), pe toate pachetele (7.1) și separat pe clase (7.3)."
  },
  {
   "tip": "pas",
   "fel": "calcul",
   "eticheta": "Calcul",
   "text": "pentru fiecare pereche de variabile, valorile fiecăreia se înlocuiesc cu rangul lor (cea mai mică primește rangul 1), iar pe ranguri se aplică formula de corelație (Spearman, secțiunea 4)."
  },
  {
   "tip": "pas",
   "fel": "iesire",
   "eticheta": "Ieșire",
   "text": "o matrice cu corelația fiecărei perechi, afișată ca hartă de culori. Valorile sunt între -1 și 1; gri înseamnă variabilă constantă, la care corelația nu se poate calcula."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizii",
   "text": "nu intră variabilele categorice (tcp.flags, mqtt.hdrflags, mqtt.msgtype, mqtt.conflags, mqtt.protoname, mqtt.conack.flags) și nici ținta. Valorile lor sunt coduri, nu cantități: 0x00000018 nu este „mai mult” decât 0x00000010, deci o corelație calculată pe ele ar depinde doar de cum sunt numerotate codurile. Legătura lor cu clasa se măsoară cu χ² (capitolul 6). Binarele intră, pentru că au doar două valori, iar cele două valori au sens (lipsă sau prezență). Spearman și nu Pearson, pentru că variabilele nu au distribuție normală și au valori extreme; Pearson apare separat în 7.4, pentru că de el depinde regresia liniară."
  },
  {
   "tip": "sectiune",
   "titlu": "7.1 Tot setul"
  },
  {
   "tip": "imagine",
   "src": "corr_tot.png"
  },
  {
   "tip": "text",
   "text": "Variabilele de conectare (mqtt.conflag.cleansess, mqtt.kalive, mqtt.proto_len, mqtt.ver) au corelație 1 între ele: sunt nenule în aceleași 3.282 de pachete de conectare, deci sunt o singură informație repetată. mqtt.conflag.passwd și mqtt.conflag.uname au corelație 1 între ele și 0,65 până la 0,66 cu celelalte."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Între numerice, tcp.len și mqtt.len au corelația 0,94 (cea mai puternică pereche). tcp.time_delta are cel mult 0,25 cu celelalte, iar mqtt.kalive 0,12 cu mqtt.len. mqtt.qos are 0,66 cu mqtt.len și 0,65 cu tcp.len."
   ]
  },
  {
   "tip": "sectiune",
   "titlu": "7.2 Perechile numerice cele mai corelate, cu R și p"
  },
  {
   "tip": "imagine",
   "src": "corr_scatter.png"
  },
  {
   "tip": "text",
   "text": "Cele 3 perechi numerice cu cea mai mare corelație Spearman (R), pe un eșantion de 8.000 de pachete, cu dreaptă de regresie pe ranguri. Valoarea p este sub 0,001 la toate trei, dar doar prima pereche (tcp.len cu mqtt.len, R = 0,94) are legătură puternică. Cu atâtea rânduri, p mic nu înseamnă corelație mare. Punctele se aliniază în benzi orizontale și verticale pentru că multe pachete au aceeași valoare."
  },
  {
   "tip": "sectiune",
   "titlu": "7.3 Pe categorii"
  },
  {
   "tip": "text",
   "text": "Aceleași 13 variabile, calculate separat pentru fiecare clasă. Gri = variabila este constantă în clasa respectivă."
  },
  {
   "tip": "galerie",
   "imagini": [
    {
     "tip": "imagine",
     "src": "corr_legitimate.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "corr_dos.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "corr_bruteforce.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "corr_malformed.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "corr_slowite.png",
     "legenda": ""
    },
    {
     "tip": "imagine",
     "src": "corr_flood.png",
     "legenda": ""
    }
   ]
  },
  {
   "tip": "text",
   "text": "Normal (legitimate): 10 din cele 13 variabile sunt constante (toate binarele, mqtt.qos și mqtt.kalive). Rămân doar tcp.time_delta, tcp.len și mqtt.len, iar tcp.len cu mqtt.len au corelația 1,00."
  },
  {
   "tip": "text",
   "text": "La atacuri variază mai multe variabile (2 până la 6 constante, față de 10 la normal), iar perechile cu corelație 1 sunt mai multe: 6 din 36 la dos, 16 din 55 la bruteforce, 7 din 28 la malformed, 6 din 21 la slowite și 6 din 21 la flood. Redundanța din grupul de conectare apare la fiecare atac."
  },
  {
   "tip": "text",
   "text": "Variabilele constante diferă după atac. La bruteforce sunt constante doar mqtt.qos și mqtt.dupflag. La dos sunt constante mqtt.retain, mqtt.conflag.passwd, mqtt.conflag.uname și mqtt.conack.val."
  },
  {
   "tip": "lista",
   "ordonata": false,
   "start": 1,
   "elemente": [
    "Corelația dintre tcp.len și mqtt.len este 1,00 la normal, bruteforce și malformed, 0,90 la dos, 0,90 la flood și 0,60 la slowite."
   ]
  },
  {
   "tip": "subtitlu",
   "text": "La ce ne-a ajutat corelația"
  },
  {
   "tip": "text",
   "text": "1) tcp.len și mqtt.len (0,94) poartă aproape aceeași informație. Din această pereche pornește regresia 1 (8.1)."
  },
  {
   "tip": "text",
   "text": "2) tcp.time_delta are corelații slabe cu toate (cel mult 0,25). Regresia 2 (8.2) verifică dacă timpul se poate totuși prezice din lungimi."
  },
  {
   "tip": "text",
   "text": "3) mqtt.qos are 0,66 cu mqtt.len pe ranguri, iar pe valorile reale chiar 0,99 (Pearson, graficul din 7.4): toate cele 54.431 de pachete cu mqtt.qos = 1 sunt dos și au mqtt.len între 149 și 190, iar restul au în medie 4,7. De aici VIF-ul mare (42,5 și 42,9) de la regresia logistică (9.3)."
  },
  {
   "tip": "text",
   "text": "4) Grupul de conectare are corelație 1. Într-un model ar ajunge o singură variabilă din grup."
  },
  {
   "tip": "text",
   "text": "5) Pe clase, corelația tcp.len cu mqtt.len diferă (1,00 la normal, 0,60 la slowite). De aici regresia 3 (8.3), pe fiecare clasă."
  },
  {
   "tip": "sectiune",
   "titlu": "7.4 Corelația Pearson"
  },
  {
   "tip": "text",
   "text": "Până aici am folosit Spearman, pe ranguri. Pearson măsoară cât de strâns stau punctele pe o dreaptă, pe valorile reale, și este legat direct de regresia liniară: R² = r². Tabelul are perechile din regresiile liniare (secțiunea 8) și fiecare variabilă folosită la regresia logistică (secțiunea 9), față de ținta binară is_attack (0 = legitimate, 1 = oricare dintre atacuri). Formula este în secțiunea 4."
  },
  {
   "tip": "text",
   "eticheta": "Calcul pentru tcp.len cu mqtt.len",
   "text": "x̄ = 152,59 și ȳ = 31,72; suma (x - x̄)(y - ȳ) = 5,283 · 10⁹; suma (x - x̄)² = 2,958 · 10¹¹; suma (y - ȳ)² = 1,253 · 10⁹. r = 5,283 · 10⁹ / rădăcina din (2,958 · 10¹¹ · 1,253 · 10⁹) = 0,274. p se obține din t = r · rădăcina din (n - 2) / rădăcina din (1 - r²)."
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
   "src": "corr_pearson_spearman.png"
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
    "tcp.len cu mqtt.len: Pearson este 0,274, față de 0,939 la Spearman. Valorile extreme (flood, cu tcp.len până la 32.768 și mqtt.len mic) trag Pearson în jos, iar Spearman nu le simte, pentru că lucrează pe ranguri. r² = 0,274² = 0,075, adică exact R² din regresia liniară 1 (secțiunea 8.1).",
    "Perechile cu tcp.time_delta au Pearson aproape de 0 (-0,007 și -0,037), dar Spearman în jur de 0,25: legătura există pe ranguri, nu este liniară.",
    "Față de is_attack, cea mai mare corelație o are mqtt.qos (0,444), apoi mqtt.len (0,409). La mqtt.len, Spearman este doar 0,058: la atac, mqtt.len este fie mai mic decât la normal (mediana 2 față de 10), fie mult mai mare (Q3 = 165 față de 11). Pe ranguri cele două efecte aproape se anulează, iar Pearson, care lucrează pe valorile reale, este dominat de valorile mari."
   ]
  }
 ]
}

export default date
