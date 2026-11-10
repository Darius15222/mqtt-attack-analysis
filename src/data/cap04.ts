import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "4. Cum se calculează valorile din document",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Formula fiecărei valori din document, cu un exemplu din datele noastre. Calculele s-au făcut în Python (pandas, scipy, statsmodels), iar arborii de decizie în R (partykit), pe toate cele 330.926 de pachete."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "formulele sunt adunate aici, înainte de prima folosire, iar capitolele următoare trimit la ele. Calculele sunt făcute pe toate pachetele, nu pe un eșantion, inclusiv arborii (capitolul 10). Graficele scatter folosesc 8.000 de pachete alese la întâmplare, ca punctele să se vadă (la regresia pe clase din 8.3, cel mult 3.000 pe clasă)."
  },
  {
   "tip": "tabel",
   "antet": [
    "Valoare",
    "La ce ajută",
    "Formulă",
    "Exemplu din datele noastre"
   ],
   "randuri": [
    [
     "Media",
     "Valoarea tipică a unei variabile. Ca valoare tipică se raportează doar la variabilele cu distribuție aproape normală.",
     "x̄ = (x1 + x2 + ... + xn) / n",
     "Valorile 1, 2, 2, 3, 10: media 3,6. tcp.len, tot setul: 152,59."
    ],
    [
     "Abaterea standard (Std)",
     "Arată cât de împrăștiate sunt valorile în jurul mediei. Mică: valori apropiate; mare: valori răspândite.",
     "s = rădăcina din [ suma (xi - x̄)² / (n - 1) ]",
     "Aceleași valori: 53,2 / 4 = 13,3, deci s = 3,65. tcp.len: 945,5."
    ],
    [
     "Mediană, Q1, Q3",
     "Valoarea tipică atunci când distribuția nu e normală. Nu o strică valorile extreme. [Q1, Q3] arată unde stau jumătatea din mijloc a pachetelor.",
     "Mediana: poziția (n + 1) / 2. Qp: poziția 1 + p (n - 1), cu p = 0,25 la Q1 și 0,75 la Q3; între poziții se interpolează.",
     "tcp.len, n = 330.926: poziția 165.463,5, valoarea 10; Q1 = 0; Q3 = 14."
    ],
    [
     "Conversia hex",
     "Arată ce înseamnă codurile din tcp.flags: fiecare flag TCP este o putere a lui 2 (FIN 1, SYN 2, RST 4, PSH 8, ACK 16), deci 24 = 16 + 8 = ACK și PSH.",
     "Valoare = suma cifrelor hex, fiecare înmulțită cu 16 la puterea poziției ei (de la dreapta, din 0).",
     "0x00000018 = 1 · 16 + 8 = 24."
    ],
    [
     "χ² (chi-pătrat) și p",
     "Testează dacă o variabilă categorică depinde de clasă (normal sau tipul de atac). p mic: depinde.",
     "E = (total rând · total coloană) / N; χ² = suma (O - E)² / E; df = (rânduri - 1)(coloane - 1). O = număr observat, E = număr așteptat dacă variabila n-ar avea legătură cu clasa, N = numărul de pachete.",
     "mqtt.conack.val, celula (5, bruteforce): O = 1.428, E = 62,6, contribuție ≈ 29.795 din χ² = 31.295; p sub 0,001."
    ],
    [
     "Kruskal-Wallis (H) și p",
     "Testează dacă o variabilă numerică are valori diferite în cele 6 clase, fără să presupună distribuție normală.",
     "H = 12 / (N (N + 1)) · suma (Ri² / ni) - 3 (N + 1); df = clase - 1. Valorile din toate clasele primesc rang; Ri = suma rangurilor clasei i, ni = numărul ei de pachete.",
     "tcp.len: H = 39.233, p sub 0,001."
    ],
    [
     "Mann-Whitney (U) și p",
     "Compară o singură pereche de clase (un atac față de normal). Arată care atacuri diferă de traficul normal.",
     "U = numărul de perechi (normal, atac) la care valoarea normalului este mai mare (+ 1/2 la egalități), din n1 · n2 perechi.",
     "tcp.time_delta, flood față de normal: U = 53.114.914,5 din 101.428.819 perechi (52,4%); p = 0,042."
    ],
    [
     "Stele",
     "Citire rapidă a lui p: mai multe stele, diferență mai sigură.",
     "p < 0,001: ***; p < 0,01: **; p < 0,05: *; altfel ns; „-” înseamnă că testul nu se poate calcula.",
     "p = 0,042 dă *."
    ],
    [
     "Corelația Spearman (R)",
     "Măsoară cât de bine cresc sau scad două variabile împreună, chiar dacă relația nu e dreaptă. Nu o strică valorile extreme.",
     "R = cov(Rx, Ry) / (Std(Rx) · Std(Ry)), cu Rx și Ry rangurile.",
     "tcp.len cu mqtt.len: R = 0,94."
    ],
    [
     "Corelația Pearson (r)",
     "Măsoară cât de bine se potrivesc două variabile pe o dreaptă. Compararea cu Spearman arată dacă valorile extreme influențează relația.",
     "r = suma (xi - x̄)(yi - ȳ) / rădăcina din [suma (xi - x̄)² · suma (yi - ȳ)²]. Folosește valorile reale, deci este sensibilă la valori extreme. La regresia simplă, R² = r².",
     "tcp.len cu mqtt.len: r = 0,274, deci r² = 0,075."
    ],
    [
     "Regresia liniară: dreapta",
     "Prezice o variabilă numerică din alta (de exemplu mqtt.len din tcp.len). β1 arată cu cât crește y când x crește cu 1.",
     "y = β0 + β1 · x + ε; β1 = suma (xi - x̄)(yi - ȳ) / suma (xi - x̄)²; β0 = ȳ - β1 · x̄. Dreapta minimizează suma pătratelor reziduurilor. La regresia multiplă se adaugă câte un coeficient pentru fiecare variabilă.",
     "Punctele (1, 2), (2, 3), (3, 7): β1 = 5 / 2 = 2,5, β0 = 4 - 2,5 · 2 = -1."
    ],
    [
     "Reziduu",
     "Eroarea modelului pentru un pachet. Reziduurile mari arată pachete pe care dreapta le explică prost.",
     "reziduu = y observat - y prezis",
     "Punctul (3, 7), prezis 6,5: reziduu 0,5."
    ],
    [
     "R² (regresie)",
     "Cât din variația lui y explică modelul: 0 nimic, 1 totul.",
     "R² = 1 - (suma reziduurilor²) / suma (yi - ȳ)²",
     "Cele 3 puncte: 1 - 1,5 / 14 = 0,89. mqtt.len cu tcp.len, tot setul: 0,075."
    ],
    [
     "p pentru un coeficient (regresii)",
     "Arată dacă o variabilă contribuie cu adevărat la model sau coeficientul ei poate fi zero.",
     "t (regresia liniară) sau z (regresia logistică) = estimare / eroare standard. H0: coeficientul este 0.",
     "tcp.len în regresia 2: p = 0,043 (*). tcp.len în 9.6: z = 0,02934 / 0,000462 = 63,5."
    ],
    [
     "Transformarea logaritmică",
     "Micșorează efectul valorilor foarte mari, ca regresia să se potrivească mai bine.",
     "x' = ln(1 + x). Reduce asimetria și efectul valorilor extreme; regresia se face pe valorile transformate.",
     "tcp.len = 100 devine ln(101) = 4,62."
    ],
    [
     "Regresia logistică",
     "Prezice dacă un pachet este atac (1) sau normal (0) și arată ce variabile contribuie la asta.",
     "ln[p / (1 - p)] = β0 + β1 · x1 + ... + βk · xk, cu p probabilitatea ca pachetul să fie atac. Coeficient pozitiv: crește probabilitatea; negativ: o scade.",
     "Modelul din 9.6: logit = -0,308 + 0,0293 · tcp.len - 3,34 · tcp.time_delta + 0,0048 · mqtt.len."
    ],
    [
     "Deviance și AIC",
     "Compară modele. Deviance și AIC mai mici înseamnă potrivire mai bună.",
     "Deviance = -2 · logaritmul verosimilității; AIC = deviance reziduală + 2 · (număr de parametri). Null deviance = modelul fără predictori.",
     "9.6: deviance scade de la 458.761 la 337.501; AIC = 337.501 + 2 · 4 = 337.509."
    ],
    [
     "VIF",
     "Arată dacă o variabilă este deja explicată de celelalte (coliniaritate). Un VIF mare înseamnă că două variabile măsoară aproape același lucru, iar coeficienții lor nu mai sunt de încredere.",
     "VIF = 1 / (1 - R²j), cu R²j obținut regresând variabila j pe celelalte. Peste 5 sau 10 înseamnă coliniaritate severă.",
     "mqtt.len în modelul cu 5 variabile: 42,5."
    ],
    [
     "Regresia Firth",
     "Fixează regresia logistică atunci când o valoare apare doar la atacuri (separare), caz în care regresia obișnuită nu se poate calcula corect.",
     "Maximizează verosimilitatea penalizată (verosimilitatea = cât de probabile sunt datele observate după model): ln L(β) + 1/2 · ln|I(β)|, cu I matricea de informație. Al doilea termen crește când un coeficient fuge spre infinit și îl ține finit. Corectează separarea, unde regresia obișnuită dă erori standard uriașe.",
     "mqtt.qos: eroare standard 14.714 la regresia obișnuită (după 30 de pași; crește la fiecare pas), 2,35 la Firth."
    ],
    [
     "Statistica T (arbore)",
     "Măsoară cât de legat este un predictor de țintă, pe aceeași scară pentru orice tip de variabilă, ca arborele să poată compara predictorii între ei.",
     "T = (n - 1) · R². R² = r² Pearson la un predictor numeric; la unul categoric, R² = suma pătratelor dintre grupuri / suma pătratelor totală (cât din variația țintei se explică prin grupurile predictorului). Dacă și predictorul, și ținta sunt categorice, T = (n - 1) / n · χ², practic χ². p vine din distribuția χ² cu df = 1 (numeric) sau c - 1 (c categorii).",
     "Rădăcina arborelui de clasificare, mqtt.qos față de is_attack: r = 0,44369, r² = 0,196861; arborele se construiește pe toate cele n = 330.926 de pachete, deci T = (n - 1) · r² = 330.925 · 0,196861 = 65.146, df = 1."
    ],
    [
     "Corecția Bonferroni",
     "Când se fac mai multe teste deodată, unul poate ieși sub 0,05 doar din întâmplare. Corecția ține această șansă sub 5% pentru tot grupul de teste.",
     "p ajustat = 1 - (1 - p)^k, k = numărul de teste (forma folosită de partykit); când p este mic, este practic p · k. Echivalent: p brut trebuie să fie sub aproximativ 0,05 / k.",
     "Nodul 21 al arborelui din 10.4 (calculul în 10.1): se testează 2 predictori; cel mai mic p este 0,000314 (tcp.len); 1 - (1 - 0,000314)² = 0,00063, sub 0,05, deci nodul se împarte."
    ],
    [
     "Arbore de decizie",
     "Împarte pachetele în grupuri tot mai omogene prin întrebări simple („variabila ≤ prag?”). Fiecare grup final (frunză) dă o predicție.",
     "La fiecare nod: T și p pentru fiecare predictor, Bonferroni, se alege predictorul cu cel mai mic p dacă p < 0,05, apoi pragul cu cea mai mare statistică; se repetă în fiecare ramură. Frunza prezice clasa majoritară (clasificare) sau media țintei (regresie).",
     "Rădăcina: mqtt.qos ≤ 0 față de > 0. Ramura > 0 are 54.431 de pachete, toate atac."
    ],
    [
     "Matricea de confuzie",
     "Arată câte pachete a prezis modelul corect și câte greșit, separat pe fiecare tip de greșeală.",
     "TP = atac prezis atac; FP = normal prezis atac (alarmă falsă); FN = atac prezis normal (atac ratat); TN = normal prezis normal.",
     "Arborele de clasificare, pe toate pachetele: TP = 150.659, FP = 1.269, FN = 14.804, TN = 164.194."
    ],
    [
     "Accuracy, Sensitivity, Precision, F1",
     "Accuracy: cât din total este corect. Sensitivity: câte atacuri sunt prinse. Precision: din pachetele declarate atac, câte chiar sunt. F1: o singură notă, mare doar dacă Sensitivity și Precision sunt ambele mari.",
     "Accuracy = (TP + TN) / N; Sensitivity = TP / (TP + FN); Precision = TP / (TP + FP); F1 = 2 · Precision · Sensitivity / (Precision + Sensitivity).",
     "Sensitivity = 150.659 / 165.463 = 0,9105; Precision = 150.659 / 151.928 = 0,9916; F1 = 0,9494."
    ],
    [
     "MAE și RMSE",
     "Cât greșește în medie predicția unei valori numerice, în aceleași unități ca ținta. RMSE pune greutate mai mare pe greșelile mari.",
     "MAE = suma |y - ŷ| / n; RMSE = rădăcina din [suma (y - ŷ)² / n], cu y valoarea reală și ŷ valoarea prezisă.",
     "Arborele de regresie: MAE = 57,02 bytes, RMSE = 823,17 bytes."
    ],
    [
     "Item și tranzacție",
     "Forma datelor pentru regulile de asociere: fiecare pachet (tranzacție) este setul valorilor lui (itemi).",
     "item = variabilă=valoare; variabilele numerice se împart întâi în intervale",
     "Pachetul 2: flags=PSH+ACK, msgtype=PUBLISH, qos=1, dupflag=0, len=21-1460, delta=Q1, target=dos."
    ],
    [
     "Support",
     "Cât de des apare o combinație de itemi.",
     "support(A → B) = pachete cu A și B / toate pachetele",
     "FIN+ACK și bruteforce: 3.252 / 330.926 = 0,0098."
    ],
    [
     "Confidence",
     "Cât de sigură este regula: din pachetele cu A, ce parte au și B.",
     "confidence(A → B) = pachete cu A și B / pachete cu A",
     "3.252 / 4.198 = 0,775."
    ],
    [
     "Lift",
     "De câte ori apare B mai des când e A decât în general. Peste 1: A crește șansa lui B; 1: independente; sub 1: se evită.",
     "lift(A → B) = confidence(A → B) / support(B)",
     "0,775 / (14.501 / 330.926) = 17,7."
    ],
    [
     "Apriori",
     "Găsește toate combinațiile frecvente fără să le numere pe toate.",
     "seturile cu k itemi se formează din cele frecvente cu k - 1 itemi; un set se numără doar dacă toate subseturile lui sunt frecvente",
     "La k = 3: 232 de candidați în loc de 816 (11.2)."
    ]
   ]
  }
 ]
}

export default date
